export type Category = 'MEN' | 'WOMEN' | 'KIDS' | 'FTW' | 'ACCESSORIES';
export type Crop = { x: number; y: number; width: number; height: number };
export type Product = {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: Category;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  details: string[];
  imageUrl: string;
  crop?: Crop;
};
export type CartItem = { product: Product; size: string; color: string; quantity: number };
