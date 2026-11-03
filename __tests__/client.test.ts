import { fetchJson } from '../src/api/client';
import { parseAccount } from '../src/api/account';
const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
  jest.useRealTimers();
});
test('returns JSON from a successful response', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  await expect(fetchJson('https://example.com')).resolves.toEqual({ ok: true });
});
test('rejects HTTP errors', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });
  await expect(fetchJson('https://example.com')).rejects.toThrow('503');
});
test('propagates malformed JSON and network failures', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => {
      throw new Error('Invalid JSON');
    },
  });
  await expect(fetchJson('https://example.com')).rejects.toThrow('Invalid JSON');
  global.fetch = jest.fn().mockRejectedValue(new Error('Offline'));
  await expect(fetchJson('https://example.com')).rejects.toThrow('Offline');
});
test('aborts a hanging request after 12 seconds', async () => {
  jest.useFakeTimers();
  global.fetch = jest
    .fn()
    .mockImplementation(
      (_, options) =>
        new Promise((_, reject) =>
          options.signal.addEventListener('abort', () =>
            reject(Object.assign(new Error(), { name: 'AbortError' })),
          ),
        ),
    );
  const request = expect(fetchJson('https://example.com')).rejects.toThrow('timed out');
  await jest.advanceTimersByTimeAsync(12000);
  await request;
});
test('rejects malformed account responses', () => {
  expect(() => parseAccount({ name: 'Rick' })).toThrow('invalid');
});
