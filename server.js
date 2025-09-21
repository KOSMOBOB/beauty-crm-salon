const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const Database = require('./database/database');
const { router: authRoutes } = require('./routes/auth');
const salonRoutes = require('./routes/salon');
const masterRoutes = require('./routes/masters');
const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const clientRoutes = require('./routes/clients');

const app = express();
const PORT = process.env.PORT || 5000;

// Инициализация базы данных с обработкой ошибок
try {
  const db = new Database();
  db.initialize();
  console.log('✅ База данных инициализирована');
} catch (error) {
  console.error('❌ Ошибка инициализации БД:', error.message);
  // В production продолжаем работу без БД (mock режим)
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Слишком много запросов, попробуйте позже'
});

app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Beauty CRM API работает нормально! 🎉',
    timestamp: new Date().toISOString(),
    version: '1.0.4',
    status: 'healthy',
    database: 'connected',
    mode: 'full_api'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🎨 Beauty CRM API Server',
    version: '1.0.4',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      salon: {
        dashboard: 'GET /api/salon/dashboard'
      },
      masters: 'GET/POST/PUT/DELETE /api/masters',
      services: 'GET/POST/PUT/DELETE /api/services',
      appointments: 'GET/POST/PUT/DELETE /api/appointments',
      clients: 'GET/POST/PUT/DELETE /api/clients'
    },
    database_status: 'connected',
    mode: 'full_api_with_database'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎨 Beauty CRM API',
    version: '1.0.4',
    timestamp: new Date().toISOString(),
    api_base: '/api',
    frontend: 'Развернут отдельно на React',
    status: 'production_ready',
    mode: 'full_functionality'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/salon', salonRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);

// Статические файлы (аватары, фото)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Production API-only mode - no frontend serving
if (process.env.NODE_ENV === 'production') {
  // API-only mode for production
  console.log('🎯 Running in API-only production mode');
} else {
  // Development mode with frontend
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Внутренняя ошибка сервера' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Маршрут не найден' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🎨 Beauty CRM готова к работе!`);
});

module.exports = app;