import axios from "axios";
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

let isRefreshing = false;

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    const skipRefreshRoutes = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/authorize'];

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefreshRoutes.includes(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return Promise.reject(err);
      }

      isRefreshing = true;

      try {
        await api.get('/auth/refresh'); 
        console.log(originalRequest)
        return api(originalRequest); 
      } catch  {
        await api.post('/auth/logout');
        window.localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href="http://localhost:5173/auth/login";
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;