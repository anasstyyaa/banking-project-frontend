import axios from 'axios';

const ATM_SESSION_KEY = 'atmSession';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

const atmApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

atmApi.interceptors.request.use((config) => {
  const session = AtmService.getSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
});

atmApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 403 && config && !config._retriedAfterCsrfRefresh) {
      config._retriedAfterCsrfRefresh = true;
      try {
        await atmApi.get('/auth/csrf');
        const freshToken = getCookie('XSRF-TOKEN');
        if (freshToken) {
          config.headers['X-XSRF-TOKEN'] = freshToken;
        }
        return atmApi(config);
      } catch (refreshErr) {
        // Keep the original ATM request error for the caller.
      }
    }

    return Promise.reject(error);
  }
);

class AtmService {
  // Authenticates a customer for the mock ATM without changing the main app session.
  async login(credentials) {
    const response = await atmApi.post('/auth/login', credentials);

    if (response.data.role !== 'ROLE_CUSTOMER') {
      throw new Error('ATM access is only available for customers.');
    }

    const session = {
      email: response.data.email,
      token: response.data.token,
      role: response.data.role
    };

    localStorage.setItem(ATM_SESSION_KEY, JSON.stringify(session));
    await atmApi.get('/auth/csrf');
    return session;
  }

  // Returns the current ATM-only session, if one exists.
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(ATM_SESSION_KEY));
    } catch (error) {
      return null;
    }
  }

  // Clears only the ATM session and leaves the main banking login untouched.
  logout() {
    localStorage.removeItem(ATM_SESSION_KEY);
  }

  // Loads accounts using the ATM session token.
  getAccounts(params = {}) {
    return atmApi.get('/accounts', { params: this.cleanParams(params) });
  }

  // Creates an ATM deposit or withdrawal using the ATM session token.
  createTransaction(payload) {
    return atmApi.post('/transactions', payload);
  }

  cleanParams(params) {
    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
    );
  }
}

export default new AtmService();
