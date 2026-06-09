import axios from 'axios';
import { getStoredCsrfToken, storeCsrfToken } from '@/utils/csrf';


const ATM_SESSION_KEY = 'atmSession';



function getAtmSession() {
  try {
    return JSON.parse(localStorage.getItem(ATM_SESSION_KEY));
  } catch (error) {
    return null;
  }
}

const atmApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

atmApi.interceptors.request.use((config) => {
  const session = getAtmSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  const csrf = getStoredCsrfToken();
  if (csrf) { config.headers['X-XSRF-TOKEN'] = csrf; }

  return config;
});

atmApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 403 && config && !config._retriedAfterCsrfRefresh) {
      config._retriedAfterCsrfRefresh = true;
      try {
        const csrfResponse = await atmApi.get('/auth/csrf');
        storeCsrfToken(csrfResponse.data.token);
        config.headers['X-XSRF-TOKEN'] = csrfResponse.data.token;
        return atmApi(config);
      } catch (refreshErr) {
        // fall through and reject with the original error
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
    const { data } = await atmApi.get('/auth/csrf');
    storeCsrfToken(data.token);
    return session;
  }

  // Returns the current ATM-only session, if one exists.
  getSession() {
    return getAtmSession();
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
