const CSRF_TOKEN_KEY = 'csrfToken';

export function getStoredCsrfToken() {
  return localStorage.getItem(CSRF_TOKEN_KEY);
}

export function storeCsrfToken(token) {
  if (token) localStorage.setItem(CSRF_TOKEN_KEY, token);
}

export function clearCsrfToken() {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}