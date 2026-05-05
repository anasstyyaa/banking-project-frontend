import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const API_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = API_URL;

// authomatically adds token to headers if it exists
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const app = createApp(App)
app.config.globalProperties.$axios = axios;

app.use(createPinia())
app.use(router)

app.mount('#app')