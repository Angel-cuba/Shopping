import axios from 'axios';
import { getTokenFromLocalStorage } from './token';

const token = getTokenFromLocalStorage();
let baseURL: string
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseURL= 'http://localhost:8080/api/v1'
} else {
  baseURL= 'https://shopping-bhjf.onrender.com/api/v1'
}
export const api = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const apiWithoutAuth = axios.create({
  baseURL,
});