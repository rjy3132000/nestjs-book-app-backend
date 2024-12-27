import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Book } from './schema/book.schema';
import {Query} from "express-serve-static-core"
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel : mongoose.Model<Book>
    ) {}

    async findAll (query: Query): Promise<Book[]> {

        const resPerPage = 10
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const keyword = query.keyword ? {
            title : {
                $regex : query.keyword,
                $options : 'i'
            }
        } : {}

        const books = await this.bookModel.find({...keyword}).limit(resPerPage).skip(skip);
        return books;      
    }

    async createBook(book: Book, user: User): Promise<Book> {

        const data = Object.assign({}, book, {user : user._id})

        const res = await this.bookModel.create(data);
        return res
    }

    async findById(id : string): Promise<Book> {
        const isValid = mongoose.isValidObjectId(id);

        if(!isValid) {
            throw new BadRequestException("Please enter correct Id.")
        }

        const book = await this.bookModel.findById(id);
        if(!book) {
            throw new NotFoundException("Book not found.")
        }
        return book
    }

    async deleteById(id : string): Promise<Book> {

        const isValid = mongoose.isValidObjectId(id);

        if(!isValid) {
            throw new BadRequestException("Please enter correct Id.")
        }

        const book = await this.bookModel.findByIdAndDelete(id);

        if(!book) {
            throw new NotFoundException("Book not found.")
        }
        return book
    }

    async updateById(id : string, book : Book): Promise<Book> {

        const isValid = mongoose.isValidObjectId(id);

        if(!isValid) {
            throw new BadRequestException("Please enter correct Id.")
        }

        return await this.bookModel.findByIdAndUpdate(id, book, {
            new : true,
            runValidators : true
        })
    }
}
