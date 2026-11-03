import catalog from '../public/data/catalog.json';
import { parseCatalog } from '../src/api/catalog';
import { addCartItem, useShop } from '../src/store/shop';

const product = parseCatalog(catalog, 'https://example.com/catalog.json')[0];
beforeEach(() => useShop.setState({ cart: [], productId: product.id, page: 'shop' }));
test('merges identical variants and keeps different sizes or colors separate', () => {
  const add = useShop.getState().addToCart;
  add(product, 'M', 'Black');
  add(product, 'M', 'Black');
  add(product, 'L', 'Black');
  add(product, 'M', 'White');
  expect(useShop.getState().cart.map((item) => item.quantity)).toEqual([2, 1, 1]);
  expect(
    useShop.getState().cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
  ).toBe(1000);
});
test('rejects invalid sizes and colors', () => {
  expect(addCartItem([], product, 'XXXL', 'Black')).toEqual([]);
  expect(addCartItem([], product, 'M', 'Purple')).toEqual([]);
});
test('preserves the bag across navigation and removes a chosen variant', () => {
  const state = useShop.getState();
  state.addToCart(product, 'S', 'White');
  state.navigate('account');
  state.navigate('shop');
  expect(useShop.getState().cart).toHaveLength(1);
  state.removeFromCart(0);
  expect(useShop.getState().cart).toEqual([]);
});
