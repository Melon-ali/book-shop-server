import { Schema, model } from 'mongoose';
import { IBook, TBook } from './book.interface';

const bookSchema = new Schema<TBook>(
  {
    name: { type: String, required: [true, 'Name is Required'] },
    author: { type: String, required: [true, 'Author is Required'] },
    price: { type: Number, required: [true, 'Price is Required'] },
    category: {
      type: String,
      enum: ['Deign', 'Development', 'Frameworks', 'DevOps', 'Apps'],
      required: [true, 'Category is Required'],
    },
    description: { type: String, required: [true, 'Description is Required'] },
    quantity: { type: Number, required: [true, 'Quantity is Required'] },
    inStock: { type: Boolean, required: true, default: true },
    image: { type: String, required: [true, 'Image is Required'] },
  },
  { timestamps: true },
);

bookSchema.statics.isBookExists = async function (
  id: string,
): Promise<TBook | null> {
  return await BookModel.findOne({ _id: id });
};

export const BookModel = model<TBook, IBook>('Book', bookSchema);
