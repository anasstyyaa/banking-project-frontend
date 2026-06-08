import axios from 'axios';
import { getStoredCsrfToken, storeCsrfToken } from '@/utils/csrf';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// request interceptor: automatically attaches JWT to every request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    const csrfToken = getStoredCsrfToken();
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 403 && config && !config._retriedAfterCsrfRefresh) {
      config._retriedAfterCsrfRefresh = true;
      try {
        const { data } = await api.get('/auth/csrf');
        storeCsrfToken(data.token);
        if (data.token) {
          config.headers['X-XSRF-TOKEN'] = data.token;
        }
        return api(config);
      } catch (refreshErr) {
        // fall through and reject with the original error
      }
    }

    return Promise.reject(error);
  }
);

export default api;
