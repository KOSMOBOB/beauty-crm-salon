const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Debug endpoint error',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Beauty CRM API работает нормально',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Beauty CRM API Server',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/debug'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Маршрут не найден',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Внутренняя ошибка сервера',
    error: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Debug сервер запущен на порту ${PORT}`);
  console.log(`🎨 Beauty CRM Debug Mode`);
  console.log(`📊 Node.js версия: ${process.version}`);
  console.log(`🗂️ Рабочая директория: ${process.cwd()}`);
});

module.exports = app;