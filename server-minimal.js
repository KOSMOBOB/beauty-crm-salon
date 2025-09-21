// Максимально простой Express сервер для диагностики
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Минимум middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Beauty CRM API работает! 🎉',
    timestamp: new Date().toISOString(),
    version: '1.0.2-minimal'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    env: process.env.NODE_ENV || 'unknown',
    port: PORT,
    node_version: process.version,
    platform: process.platform,
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;