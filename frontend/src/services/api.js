import axios from 'axios';

// Configuração das URLs dos microserviços
const API_BASE_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'https://fase-3-auth-service.onrender.com',
  vehicles: import.meta.env.VITE_VEHICLES_SERVICE_URL || 'https://fase-3-vehicles-service.onrender.com',
  orders: import.meta.env.VITE_ORDERS_SERVICE_URL || 'https://fase-3-orders-service.onrender.com'
};

// Configuração do axios
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: (credentials) => api.post(`${API_BASE_URLS.auth}/auth/login`, credentials),
  register: (userData) => api.post(`${API_BASE_URLS.auth}/auth/register`, userData),
  getUsers: () => api.get(`${API_BASE_URLS.auth}/auth/users`),
  updateUser: (id, userData) => api.put(`${API_BASE_URLS.auth}/auth/users/${id}`, userData),
  getMe: () => api.get(`${API_BASE_URLS.auth}/auth/me`),
};

// Serviços de veículos
export const vehiclesService = {
  getVehicles: () => api.get(`${API_BASE_URLS.vehicles}/vehicles`),
  getVehicle: (id) => api.get(`${API_BASE_URLS.vehicles}/vehicles/${id}`),
  createVehicle: (vehicleData) => api.post(`${API_BASE_URLS.vehicles}/vehicles`, vehicleData),
  updateVehicle: (id, vehicleData) => api.put(`${API_BASE_URLS.vehicles}/vehicles/${id}`, vehicleData),
  deleteVehicle: (id) => api.delete(`${API_BASE_URLS.vehicles}/vehicles/${id}`),
  getMyVehicles: () => api.get(`${API_BASE_URLS.vehicles}/vehicles/my`),
  getSoldVehicles: () => api.get(`${API_BASE_URLS.vehicles}/vehicles/sold`),
};

// Serviços de pedidos
export const ordersService = {
  getOrders: () => api.get(`${API_BASE_URLS.orders}/orders`),
  getOrder: (id) => api.get(`${API_BASE_URLS.orders}/orders/${id}`),
  createOrder: (orderData) => api.post(`${API_BASE_URLS.orders}/orders`, orderData),
  updateOrder: (id, orderData) => api.put(`${API_BASE_URLS.orders}/orders/${id}`, orderData),
  approveOrder: (id) => api.put(`${API_BASE_URLS.orders}/orders/${id}/approve`),
  rejectOrder: (id) => api.put(`${API_BASE_URLS.orders}/orders/${id}/reject`),
  getMyOrders: () => api.get(`${API_BASE_URLS.orders}/orders/my`),
};

// Health checks
export const healthService = {
  auth: () => api.get(`${API_BASE_URLS.auth}/health`),
  vehicles: () => api.get(`${API_BASE_URLS.vehicles}/health`),
  orders: () => api.get(`${API_BASE_URLS.orders}/health`),
};

export default api; 