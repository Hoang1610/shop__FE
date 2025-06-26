export interface IBook {
  _id: string;
  thumbnail: string;
  slider: string[];
  mainText: string;
  author: string;
  price: number | string;
  sold: number;
  quantity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  priceScreen?: string;
}
