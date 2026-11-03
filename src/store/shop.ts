import { create } from 'zustand';
import { CartItem, Product } from '../types/catalog';

export function addCartItem(items: CartItem[], product: Product, size: string, color: string): CartItem[] {
  if (!product.sizes.includes(size) || !product.colors.some(c => c.name === color)) return items;
  const existing = items.find(item => item.product.id === product.id && item.size === size && item.color === color);
  return existing
    ? items.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
    : [...items, { product, size, color, quantity: 1 }];
}

type ShopState = {
  productId: string;
  page: 'shop' | 'account';
  cart: CartItem[];
  selectProduct: (id: string) => void;
  navigate: (page: 'shop' | 'account') => void;
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (index: number) => void;
};

// Transient form inputs stay on the screen; shared shopping state lives here.
export const useShop = create<ShopState>(set => ({
  productId: 'tiger-red', page: 'shop', cart: [],
  selectProduct: productId => set({ productId }),
  navigate: page => set({ page }),
  addToCart: (product, size, color) => set(state => ({ cart: addCartItem(state.cart, product, size, color) })),
  removeFromCart: index => set(state => ({ cart: state.cart.filter((_, i) => i !== index) })),
}));
