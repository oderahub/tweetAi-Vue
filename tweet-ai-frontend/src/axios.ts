
import axios, { type AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'https://localhost:3000', 
});

export default instance;
