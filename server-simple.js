const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS для всех origin в development и production
app.use(cors({
  origin: true,
  credentials: false
}));

// Debug info endpoint
app.get('/api/debug', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV || 'undefined',
        PORT: process.env.PORT || 'undefined',
        DB_PATH: process.env.DB_PATH || 'undefined',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'undefined'
      },
      platform: process.platform,
      node_version: process.version,
      cwd: process.cwd(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Debug endpoint error',
      error: error.message,
      stack: error.stack
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Beauty CRM API работает нормально! 🎉',
    timestamp: new Date().toISOString(),
    version: '1.0.1',
    status: 'healthy'
  });
});

// Mock auth endpoints for testing
app.post('/api/auth/register', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mock регистрация успешна',
    data: {
      id: 1,
      email: req.body.email || 'test@example.com',
      salonName: req.body.salonName || 'Тестовый салон'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mock авторизация успешна',
    data: {
      token: 'mock_jwt_token_123',
      user: {
        id: 1,
        email: req.body.email || 'test@example.com'
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎨 Beauty CRM API Server',
    timestamp: new Date().toISOString(),
    version: '1.0.1',
    endpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/debug',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ],
    documentation: 'Все endpoints работают в mock режиме для тестирования'
  });
});

// Catch all for SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ 
      success: false, 
      message: 'API маршрут не найден',
      path: req.path
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'Beauty CRM Frontend будет здесь',
      path: req.path
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Beauty CRM сервер запущен на порту ${PORT}`);
  console.log(`🎨 Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Node.js версия: ${process.version}`);
  console.log(`🗂️ Рабочая директория: ${process.cwd()}`);
  console.log(`🌐 Server listening on 0.0.0.0:${PORT}`);
});

module.exports = app;