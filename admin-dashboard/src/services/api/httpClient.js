import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  withCredentials: false,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.warn('API error response', error.response.status, error.response.data);
    } else {
      console.warn('API request failed', error.message);
    }
    return Promise.reject(error);
  },
);

export default httpClient;
