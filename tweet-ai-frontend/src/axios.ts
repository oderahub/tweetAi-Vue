// src/axios.ts
import axios, { type AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'https://localhost:3000', // Backend API base URL
});

export default instance;
