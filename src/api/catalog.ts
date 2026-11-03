import { Category, Product } from '../types/catalog';
import { fetchJson } from './client';

export const catalogUrl =
  process.env.EXPO_PUBLIC_CATALOG_URL || 'http://localhost:8787/catalog.json';
const categories: Category[] = ['MEN', 'WOMEN', 'KIDS', 'FTW', 'ACCESSORIES'];
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string' && s.trim().length > 0);

export function parseCatalog(data: unknown, sourceUrl: string): Product[] {
  if (!record(data) || !Array.isArray(data.products) || !data.products.length)
    throw new Error('The catalog is empty or invalid.');
  const ids = new Set<string>();
  return data.products.map((p: unknown) => {
    if (
      !record(p) ||
      typeof p.id !== 'string' ||
      !p.id ||
      ids.has(p.id) ||
      typeof p.title !== 'string' ||
      !p.title.trim() ||
      typeof p.price !== 'number' ||
      !Number.isFinite(p.price) ||
      p.price < 0 ||
      typeof p.currency !== 'string' ||
      !/^[A-Z]{3}$/.test(p.currency) ||
      !categories.includes(p.category as Category) ||
      !strings(p.sizes) ||
      !strings(p.details) ||
      typeof p.description !== 'string' ||
      !p.description ||
      typeof p.imageUrl !== 'string' ||
      !p.imageUrl ||
      !Array.isArray(p.colors) ||
      !p.colors.length ||
      !p.colors.every(
        (c) =>
          record(c) &&
          typeof c.name === 'string' &&
          c.name.trim() &&
          typeof c.hex === 'string' &&
          /^#[a-f\d]{6}$/i.test(c.hex),
      )
    ) {
      throw new Error('The catalog contains invalid product data.');
    }
    if (
      p.crop !== undefined &&
      (!record(p.crop) ||
        !['x', 'y', 'width', 'height'].every(
          (k) =>
            typeof (p.crop as Record<string, unknown>)[k] === 'number' &&
            Number.isFinite((p.crop as Record<string, number>)[k]),
        ) ||
        (p.crop.x as number) < 0 ||
        (p.crop.y as number) < 0 ||
        (p.crop.width as number) <= 0 ||
        (p.crop.height as number) <= 0 ||
        (p.crop.x as number) + (p.crop.width as number) > 375 ||
        (p.crop.y as number) + (p.crop.height as number) > 1131)
    )
      throw new Error('The catalog contains an invalid image crop.');
    const imageUrl = new URL(p.imageUrl, sourceUrl);
    if (!['http:', 'https:'].includes(imageUrl.protocol))
      throw new Error('Product images must use HTTP or HTTPS.');
    ids.add(p.id);
    return { ...p, imageUrl: imageUrl.toString() } as Product;
  });
}
export async function getCatalog() {
  return parseCatalog(await fetchJson(catalogUrl), catalogUrl);
}
