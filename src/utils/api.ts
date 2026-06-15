import axios from 'axios';
import { getTokenFromLocalStorage } from './token';

const baseURL = 'http://localhost:8080/api/v1';

export const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const token = getTokenFromLocalStorage();
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

export const apiWithoutAuth = axios.create({ baseURL });