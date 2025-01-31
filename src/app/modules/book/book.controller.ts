/* eslint-disable @typescript-eslint/no-explicit-any */
import { bookService } from './book.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// create book
const createbook = catchAsync(async (req, res) => {
  const bookData = req.body;
  const result = await bookService.createBookIntoDB(bookData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Created Successfully',
    data: result,
  });
});

// get all books
const getAllbooks = catchAsync(async (req, res) => {
  const { data, meta } = await bookService.getAllBooksFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books Retrieved Successfully',
    data,
    meta,
  });
});

// get single book
const getSinglebook = catchAsync(async (req, res) => {
  const id = req.params.productId;

  const result = await bookService.getSingleBookFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Retrieved Successfully',
    data: result,
  });
});

// update book
const updateBook = catchAsync(async (req, res) => {
  const id = req.params.productId;
  const book = req.body;

  const result = await bookService.updateBookIntoDB(id, book);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book is Updated Successfully',
    data: result,
  });
});

// delete book
const deleteBook = catchAsync(async (req, res) => {
  const id = req.params.productId;

  const result = await bookService.deleteBookFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book is Deleted Successfully',
    data: result,
  });
});

const getAuthor = catchAsync(async (req, res) => {
  const result = await bookService.getAuthorFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author Retrieved Successfully',
    data: result,
  });
});

export const bookController = {
  createbook,
  getAllbooks,
  getSinglebook,
  updateBook,
  deleteBook,
  getAuthor,
};
