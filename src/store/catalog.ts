import { create } from 'zustand';
import { getCatalog } from '../api/catalog';
import { Product } from '../types/catalog';

type CatalogState = {
  products: Product[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  load: () => Promise<void>;
};
export const useCatalog = create<CatalogState>((set, get) => ({
  products: [], status: 'idle', error: null,
  load: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try { set({ products: await getCatalog(), status: 'ready' }); }
    catch (error) { set({ status: 'error', error: error instanceof Error ? error.message : 'Unable to load the catalog.' }); }
  },
}));
