/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookModel } from './book.model';
import { TBook } from './book.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { bookSearchableFields } from './book.constant';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';

// Create Book
const createBookIntoDB = async (book: TBook) => {
  const newBook = await BookModel.create(book);
  return newBook;
};

const getAllBooksFromDB = async (query: Record<string, unknown>) => {
  const bookQuery = new QueryBuilder(BookModel.find(), query)
    .search(bookSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await bookQuery.modelQuery;
  const meta = await bookQuery.countTotal();

  return { data, meta };
};

const getSingleBookFromDB = async (id: string) => {
  // checking if book exists
  const existingBook = BookModel.isBookExists(id);
  if (!existingBook) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book does not exist');
  }

  const result = await BookModel.findOne({ _id: id });
  return result;
};

const updateBookIntoDB = async (id: string, book: Partial<TBook>) => {
  // checking if book exists
  const existingBook = BookModel.isBookExists(id);
  if (!existingBook) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book does not exist');
  }

  const result = await BookModel.findOneAndUpdate({ _id: id }, book, {
    new: true,
  });
  return result;
};

const deleteBookFromDB = async (id: string) => {
  // checking if book exists
  const existingBook = BookModel.isBookExists(id);
  if (!existingBook) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book does not exist');
  }
  const result = await BookModel.findByIdAndDelete(id);
  return result;
};

const getAuthorFromDB = async () => {
  const result = await BookModel.distinct('author');

  return result;
};

export const bookService = {
  createBookIntoDB,
  getAllBooksFromDB,
  getSingleBookFromDB,
  updateBookIntoDB,
  deleteBookFromDB,
  getAuthorFromDB,
};
