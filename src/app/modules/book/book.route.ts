import express from 'express';
import { bookController } from './book.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createBookValidationSchema,
  updateBookValidationSchema,
} from './book.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/products', bookController.getAllbooks);

router.get('/products/:productId', bookController.getSinglebook);

router.get('/Author', bookController.getAuthor);

router.post(
  '/products',
  auth(USER_ROLE.admin),
  validateRequest(createBookValidationSchema),
  bookController.createbook,
);



router.patch(
  '/products/:productId',
  auth(USER_ROLE.admin),
  validateRequest(updateBookValidationSchema),
  bookController.updateBook,
);

router.delete(
  '/products/:productId',
  auth(USER_ROLE.admin),
  bookController.deleteBook,
);

export const BookRoutes = router;
