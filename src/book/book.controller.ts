import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schema/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService){}

    @SkipThrottle()
    @Get()
    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthGuard(), RolesGuard)
    async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
        return this.bookService.findAll(query);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createBook(@Body() book : CreateBookDto, @Req() req): Promise<Book> {
        return this.bookService.createBook(book, req.user);
    }

    @Get(':id')
    async getBookById(@Param('id') id: string): Promise<Book> {
        return this.bookService.findById(id);
    }

    @Delete(':id')
    async deleteById(@Param('id') id: string): Promise<Book> {
        return this.bookService.deleteById(id);
    }

    @Put(':id')
    async updateById(@Param('id') id: string, @Body() book: UpdateBookDto): Promise<Book> {
        return this.bookService.updateById(id, book);
    }
}
