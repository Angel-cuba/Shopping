import axios from 'axios';
import { getTokenFromLocalStorage } from './token';

const token = getTokenFromLocalStorage();

export const api = axios.create({
  baseURL: 'https://shopping-bhjf.onrender.com/api/v1',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});