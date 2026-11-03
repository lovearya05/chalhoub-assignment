import catalog from '../public/data/catalog.json';
import { parseCatalog } from '../src/api/catalog';
const url = 'https://example.com/data/catalog.json';
test('resolves all relative image URLs against the remote JSON location', () => {
  const products = parseCatalog(catalog, url);
  expect(products).toHaveLength(5);
  expect(products.every((p) => p.imageUrl === 'https://example.com/data/task.png')).toBe(true);
});
test.each([null, {}, { products: [] }, { products: [catalog.products[0], catalog.products[0]] }])(
  'rejects invalid or duplicate catalog data: %p',
  (data) => {
    expect(() => parseCatalog(data, url)).toThrow();
  },
);
test.each([
  { price: -1 },
  { price: NaN },
  { sizes: [] },
  { imageUrl: 'javascript:alert(1)' },
  { category: 'UNKNOWN' },
  { colors: [{ name: 'Invalid', hex: 'not-a-color' }] },
  { crop: { x: 0, y: 0, width: 0, height: 1 } },
  { crop: { x: 374, y: 0, width: 10, height: 1 } },
])('rejects malformed product fields: %p', (patch) => {
  expect(() => parseCatalog({ products: [{ ...catalog.products[0], ...patch }] }, url)).toThrow();
});
