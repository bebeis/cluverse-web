const KEY = 'loggedIn';

export function setLoggedIn(): void {
  if (typeof window !== 'undefined') localStorage.setItem(KEY, '1');
}

export function clearLoggedIn(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(KEY);
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEY) === '1';
}
