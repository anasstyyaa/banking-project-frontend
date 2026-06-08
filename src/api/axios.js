import axios from 'axios';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}


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

    const csrfToken = getCookie('XSRF-TOKEN');
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
        await api.get('/auth/csrf');
        const freshToken = getCookie('XSRF-TOKEN');
        if (freshToken) {
          config.headers['X-XSRF-TOKEN'] = freshToken;
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
