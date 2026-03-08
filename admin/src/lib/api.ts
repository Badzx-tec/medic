export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers
    }
  });
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
      throw new Error(payload.message);
    }
    throw new Error(typeof payload === 'string' ? payload : 'Falha na requisição.');
  }

  return payload as T;
}
