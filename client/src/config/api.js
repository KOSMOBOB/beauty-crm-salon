// API Configuration for Beauty CRM
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    API_TIMEOUT: 10000,
  },
  production: {
    API_BASE_URL: 'https://kosmobob-beauty-crm-salon-45ff.twc1.net/api',
    API_TIMEOUT: 15000,
  }
};

// Определяем окружение по домену или NODE_ENV
const isDevelopment = (
  process.env.NODE_ENV === 'development' || 
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const currentConfig = isDevelopment ? config.development : config.production;

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const API_TIMEOUT = currentConfig.API_TIMEOUT;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  
  // Salon
  DASHBOARD: '/salon/dashboard',
  SALON_INFO: '/salon/info',
  
  // Masters
  MASTERS: '/masters',
  MASTER_BY_ID: (id) => `/masters/${id}`,
  
  // Services  
  SERVICES: '/services',
  SERVICE_BY_ID: (id) => `/services/${id}`,
  
  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_BY_ID: (id) => `/appointments/${id}`,
  
  // Clients
  CLIENTS: '/clients',
  CLIENT_BY_ID: (id) => `/clients/${id}`,
  
  // System
  HEALTH: '/health',
  DEBUG: '/debug'
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Export current environment
export const IS_DEVELOPMENT = isDevelopment;
export const IS_PRODUCTION = !isDevelopment;

console.log(`🚀 Beauty CRM Frontend initialized`);
console.log(`📍 Environment: ${isDevelopment ? 'development' : 'production'}`);
console.log(`🌐 API Base URL: ${API_BASE_URL}`);
