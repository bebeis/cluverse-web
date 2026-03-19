const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.cluverse.kro.kr';

export function getApiBaseUrl(): string {
  return API_BASE;
}

export async function fetchApi(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers,
  });
}
