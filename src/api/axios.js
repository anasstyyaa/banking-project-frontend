import axios from 'axios';
import { getStoredCsrfToken, storeCsrfToken } from '@/utils/csrf';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: false,       
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  const csrf = getStoredCsrfToken();
  if (csrf) {
    config.headers['X-XSRF-TOKEN'] = csrf;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 403 && config && !config._retriedAfterCsrfRefresh) {
      config._retriedAfterCsrfRefresh = true;
      try {
        const csrfResponse = await api.get('/auth/csrf');
        storeCsrfToken(csrfResponse.data.token);
        config.headers['X-XSRF-TOKEN'] = csrfResponse.data.token;
        return api(config);
      } catch (refreshErr) {
        // fall through
      }
    }
    return Promise.reject(error);
  }
);

export default api;