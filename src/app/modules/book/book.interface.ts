import { Model } from 'mongoose';

export type TBook = {
  name: string;
  author: string;
  price: number;
  category: 'Design' | 'Development' | 'Frameworks' | 'DevOps' | 'Apps';
  description: string;
  quantity: number;
  inStock?: boolean;
  image: string;
};

export interface IBook extends Model<TBook> {
  // eslint-disable-next-line no-unused-vars
  isBookExists(id: string): unknown;
  // eslint-disable-next-line no-unused-vars
  isBicycleExists(id: string): Promise<TBook>;
}
