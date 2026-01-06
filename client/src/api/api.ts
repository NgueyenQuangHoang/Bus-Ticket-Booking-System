import axios from 'axios';

//Khởi tạo instance với các cấu hình cơ bản
const api = axios.create({
  baseURL: 'http://localhost:8080', // Địa chỉ json-server
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

//Request Interceptor: Xử lý trước khi gửi yêu cầu đi
//dùng chỗ này để đính kèm Token đăng nhập vào Header
api.interceptors.request.use(
  (config) => {
    //lưu token trong localStorage
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

//Response Interceptor: Xử lý dữ liệu hoặc lỗi khi Server phản hồi
api.interceptors.response.use(
  (response) => {
    //Trả về dữ liệu trực tiếp để ở Component không cần dùng response.data
    return response.data;
  },
  (error) => {
    //Xử lý lỗi tập trung
    console.error('API Error:', error.response ? error.response.data : error.message);
    
    if (error.response?.status === 401) {
      //Nếu lỗi 401 thì đẩy người dùng về trang Login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;