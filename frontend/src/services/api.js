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

// Serviços de autenticação (baseado na collection do Postman)
export const authService = {
  // Health check
  health: () => api.get(`${API_BASE_URLS.auth}/health`),
  
  // Login
  login: (credentials) => api.post(`${API_BASE_URLS.auth}/auth/login`, credentials),
  
  // Registrar usuário (apenas Admin)
  register: (userData) => api.post(`${API_BASE_URLS.auth}/auth/register`, userData),
  
  // Meus dados
  getMe: () => api.get(`${API_BASE_URLS.auth}/auth/me`),
  
  // Listar usuários (apenas Admin)
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${API_BASE_URLS.auth}/auth/users?${queryParams}`);
  },
  
  // Atualizar usuário
  updateUser: (id, userData) => api.put(`${API_BASE_URLS.auth}/auth/users/${id}`, userData),
  
  // Desativar usuário (apenas Admin)
  deleteUser: (id) => api.delete(`${API_BASE_URLS.auth}/auth/users/${id}`),
};

// Serviços de veículos (baseado na collection do Postman)
export const vehiclesService = {
  // Health check
  health: () => api.get(`${API_BASE_URLS.vehicles}/health`),
  
  // Listar veículos (público)
  getVehicles: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${API_BASE_URLS.vehicles}/vehicles?${queryParams}`);
  },
  
  // Buscar veículo por ID (público)
  getVehicle: (id) => api.get(`${API_BASE_URLS.vehicles}/vehicles/${id}`),
  
  // Criar veículo (Vendedor/Admin)
  createVehicle: (vehicleData) => api.post(`${API_BASE_URLS.vehicles}/vehicles`, vehicleData),
  
  // Atualizar veículo (Vendedor do veículo/Admin)
  updateVehicle: (id, vehicleData) => api.put(`${API_BASE_URLS.vehicles}/vehicles/${id}`, vehicleData),
  
  // Remover veículo (Vendedor do veículo/Admin)
  deleteVehicle: (id) => api.delete(`${API_BASE_URLS.vehicles}/vehicles/${id}`),
  
  // Listar veículos vendidos (Vendedor/Admin)
  getSoldVehicles: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${API_BASE_URLS.vehicles}/vehicles/sold?${queryParams}`);
  },
  
  // Meus veículos (Vendedor/Admin)
  getMyVehicles: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${API_BASE_URLS.vehicles}/vehicles/my?${queryParams}`);
  },
};

// Serviços de pedidos (baseado na collection do Postman)
export const ordersService = {
  // Health check
  health: () => api.get(`${API_BASE_URLS.orders}/health`),
  
  // Criar pedido (Cliente/Admin)
  createOrder: (orderData) => api.post(`${API_BASE_URLS.orders}/orders`, orderData),
  
  // Meus pedidos (Cliente/Admin)
  getMyOrders: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${API_BASE_URLS.orders}/orders?${queryParams}`);
  },
  
  // Pedidos recebidos (Vendedor/Admin)
  getVendorOrders: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`${API_BASE_URLS.orders}/orders/vendor?${queryParams}`);
  },
  
  // Buscar pedido por ID
  getOrder: (id) => api.get(`${API_BASE_URLS.orders}/orders/${id}`),
  
  // Aprovar pedido (Vendedor/Admin)
  approveOrder: (id) => api.put(`${API_BASE_URLS.orders}/orders/${id}/approve`),
  
  // Rejeitar pedido (Vendedor/Admin)
  rejectOrder: (id, data) => api.put(`${API_BASE_URLS.orders}/orders/${id}/reject`, data),
  
  // Concluir pedido (Vendedor/Admin)
  completeOrder: (id) => api.put(`${API_BASE_URLS.orders}/orders/${id}/complete`),
  
  // Cancelar pedido (Cliente/Admin)
  cancelOrder: (id, data) => api.put(`${API_BASE_URLS.orders}/orders/${id}/cancel`, data),
};

// Health checks consolidados
export const healthService = {
  auth: () => api.get(`${API_BASE_URLS.auth}/health`),
  vehicles: () => api.get(`${API_BASE_URLS.vehicles}/health`),
  orders: () => api.get(`${API_BASE_URLS.orders}/health`),
};

export default api; 