import { fetchJson } from './client';

export type Account = { id: number; name: string; image: string; status: string; species: string; gender: string; origin: { name: string }; location: { name: string } };
export const accountUrl = 'https://rickandmortyapi.com/api/character/1';
export function parseAccount(data: unknown): Account {
  const p = data as Partial<Account> | null;
  if (!p || typeof p.id !== 'number' || !['name', 'image', 'status', 'species', 'gender'].every(key => typeof p[key as keyof Account] === 'string' && p[key as keyof Account]) ||
    typeof p.origin?.name !== 'string' || typeof p.location?.name !== 'string' || !/^https:\/\//.test(p.image ?? '')) throw new Error('The account response is invalid.');
  return p as Account;
}
export async function getAccount() { return parseAccount(await fetchJson(accountUrl)); }
