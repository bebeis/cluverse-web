const API_PROXY_BASE = '/api/proxy';

export function getApiBaseUrl(): string {
  return API_PROXY_BASE;
}

export async function fetchApi(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${API_PROXY_BASE}${path}`, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers,
  });
}
