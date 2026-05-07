import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// i am gonna add a request interceptor later for JWT Tokens
export default api;