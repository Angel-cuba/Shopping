import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const baseURL = __DEV__
  ? 'http://localhost:8080/api/v1'
  : 'https://shopping-bhjf.onrender.com/api/v1';

export const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export const apiWithoutAuth = axios.create({ baseURL });
