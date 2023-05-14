import axios from 'axios';
import { getTokenFromLocalStorage } from './token';

const token = getTokenFromLocalStorage();
export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});