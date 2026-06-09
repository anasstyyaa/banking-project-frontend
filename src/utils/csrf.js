const CSRF_KEY = 'csrf_token';

export function getStoredCsrfToken() {
  return localStorage.getItem(CSRF_KEY);
}

export function storeCsrfToken(token) {
  if (token) {
    localStorage.setItem(CSRF_KEY, token);
  }
}

export function clearCsrfToken() {
  localStorage.removeItem(CSRF_KEY);
}
