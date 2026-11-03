import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import App from '../App';
import catalog from '../public/data/catalog.json';
import { useShop } from '../src/store/shop';
import { useCatalog } from '../src/store/catalog';

const account = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://example.com/rick.png',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
};
const originalFetch = global.fetch;
beforeEach(() => {
  useShop.setState({ cart: [], productId: 'tiger-red', page: 'shop' });
  useCatalog.setState({ products: [], status: 'idle', error: null });
  global.fetch = jest.fn().mockImplementation(async (url) => ({
    ok: true,
    json: async () => (String(url).includes('character/1') ? account : catalog),
  }));
});
afterEach(() => {
  global.fetch = originalFetch;
});
async function openApp() {
  await render(<App />);
  await screen.findByText('Tiger Medium Red');
}
test('loads the catalog, requires a variant, adds, merges and removes bag items', async () => {
  await openApp();
  await fireEvent.press(screen.getByText('ADD TO BAG'));
  expect(screen.getByText('Please choose a size and color.')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('Size M'));
  await fireEvent.press(screen.getByLabelText('Color Black'));
  await fireEvent.press(screen.getByText('ADD TO BAG'));
  await fireEvent.press(screen.getByText('ADD TO BAG'));
  await fireEvent.press(screen.getByText('Bag (2)'));
  expect(screen.getByText('Total: AED 500')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('Remove Tiger Medium Red M Black'));
  expect(screen.getByText('Your bag is empty.')).toBeTruthy();
});
test('filters products, handles empty categories and opens a related product', async () => {
  await openApp();
  await fireEvent.changeText(screen.getByLabelText('Search products'), 'Teal');
  expect(screen.getByText('1 RESULTS')).toBeTruthy();
  await fireEvent.press(screen.getByText('Tiger Deep Teal'));
  expect(screen.getByText('Tiger Deep Teal')).toBeTruthy();
  await fireEvent.press(screen.getByText('WOMEN'));
  expect(screen.getByText('No products found. Try MEN or a different search.')).toBeTruthy();
  await fireEvent.press(screen.getByText('MEN'));
  await fireEvent.press(screen.getByLabelText('View Tiger Medium Red'));
  expect(screen.getByText('Tiger Medium Red')).toBeTruthy();
});
test('opens and closes the image, loads an account and returns to the same bag', async () => {
  await openApp();
  await fireEvent.press(screen.getByLabelText('Enlarge product image'));
  await fireEvent.press(screen.getByText('Close image ×'));
  await fireEvent.press(screen.getByLabelText('Size S'));
  await fireEvent.press(screen.getByLabelText('Color White'));
  await fireEvent.press(screen.getByText('ADD TO BAG'));
  await fireEvent.press(screen.getByText('My account'));
  await screen.findByText('Rick Sanchez');
  expect(screen.getByText('Earth (C-137)')).toBeTruthy();
  await fireEvent.press(screen.getByText('Refresh profile'));
  await screen.findByText('Rick Sanchez');
  await fireEvent.press(screen.getByText('‹ Back to shop'));
  expect(screen.getByText('Bag (1)')).toBeTruthy();
});
test('recovers from catalog failure through retry', async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Offline'));
  await render(<App />);
  await screen.findByText(/Offline/);
  await fireEvent.press(screen.getByText('Try again'));
  await screen.findByText('Tiger Medium Red');
});
test('recovers from account failure through retry', async () => {
  await openApp();
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Account unavailable'));
  await fireEvent.press(screen.getByText('My account'));
  await screen.findByText('Account unavailable');
  await fireEvent.press(screen.getByText('Try again'));
  await screen.findByText('Rick Sanchez');
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));
});
