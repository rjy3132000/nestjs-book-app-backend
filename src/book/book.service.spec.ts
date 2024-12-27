import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book, Category } from './schema/book.schema';
import { Model } from 'mongoose';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  const mockBook = {
    _id: '62a23958e5a9e9b88f853a67',
    user: '62a23958e5a9e9b88f853a60',
    title: 'New Book',
    description: 'Book Description github',
    author: 'Author',
    price: 100,
    category: Category.FANTASY,
  };

  const mockBookService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findById', () => {
    it('should find a book and return it', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

      const result = await bookService.findById(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });
  });
});
