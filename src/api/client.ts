export async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed (${response.status}). Please try again.`);
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError')
      throw new Error('The request timed out. Check your connection and retry.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
