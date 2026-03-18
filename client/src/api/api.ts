import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Đính kèm JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract data từ backend format { success, data, message }
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Backend trả { success, data, ... }
    if (body && typeof body === 'object' && 'success' in body) {
      // Paginated response: giữ { data, total, page, limit }
      if ('total' in body) {
        return { data: body.data, total: body.total, page: body.page, limit: body.limit } as any;
      }
      // Single/list response: extract .data
      return body.data;
    }
    // Fallback cho các response không theo format mới
    return body;
  },
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);

    if (error.response?.status === 401) {
      // Chỉ redirect nếu không phải đang ở trang login
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin');
        localStorage.removeItem('role');
        localStorage.removeItem('bus_company_id');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
