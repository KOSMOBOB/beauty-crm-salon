import { API_BASE_URL, API_TIMEOUT } from '../config/api';

// Axios-like API client
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  // Set authorization token
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Build full URL
  buildUrl(endpoint) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    return url;
  }

  // Generic request method
  async request(method, endpoint, data = null, options = {}) {
    const url = this.buildUrl(endpoint);
    const config = {
      method: method.toUpperCase(),
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  async patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// API methods for different resources
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout')
};

export const salonAPI = {
  getDashboard: () => apiClient.get('/salon/dashboard'),
  getInfo: () => apiClient.get('/salon/info'),
  updateInfo: (data) => apiClient.put('/salon/info', data)
};

export const mastersAPI = {
  getAll: () => apiClient.get('/masters'),
  getById: (id) => apiClient.get(`/masters/${id}`),
  create: (data) => apiClient.post('/masters', data),
  update: (id, data) => apiClient.put(`/masters/${id}`, data),
  delete: (id) => apiClient.delete(`/masters/${id}`)
};

export const servicesAPI = {
  getAll: () => apiClient.get('/services'),
  getById: (id) => apiClient.get(`/services/${id}`),
  create: (data) => apiClient.post('/services', data),
  update: (id, data) => apiClient.put(`/services/${id}`, data),
  delete: (id) => apiClient.delete(`/services/${id}`)
};

export const appointmentsAPI = {
  getAll: () => apiClient.get('/appointments'),
  getById: (id) => apiClient.get(`/appointments/${id}`),
  create: (data) => apiClient.post('/appointments', data),
  update: (id, data) => apiClient.put(`/appointments/${id}`, data),
  delete: (id) => apiClient.delete(`/appointments/${id}`)
};

export const clientsAPI = {
  getAll: () => apiClient.get('/clients'),
  getById: (id) => apiClient.get(`/clients/${id}`),
  create: (data) => apiClient.post('/clients', data),
  update: (id, data) => apiClient.put(`/clients/${id}`, data),
  delete: (id) => apiClient.delete(`/clients/${id}`)
};

export const systemAPI = {
  health: () => apiClient.get('/health'),
  debug: () => apiClient.get('/debug')
};

// Utility functions
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'AbortError') {
    return 'Запрос прерван по таймауту';
  }
  
  return error.message || 'Произошла ошибка при обращении к серверу';
};

// Initialize token from localStorage if available
const token = localStorage.getItem('beauty_crm_token');
if (token) {
  apiClient.setAuthToken(token);
}

export default apiClient;