import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, 
  xsrfCookieName: 'XSRF-TOKEN', 
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

// request interceptor: automatically attaches JWT to every request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
  },
  (error) => Promise.reject(error)

);

export default api;