import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials:true
});

api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.includes('auth')) {
      return config;
    }
    const token = localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;


