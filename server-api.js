const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const { router: authRoutes } = require('./routes/auth');
const salonRoutes = require('./routes/salon');
const masterRoutes = require('./routes/masters');
const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const clientRoutes = require('./routes/clients');

const app = express();
const PORT = process.env.PORT || 5000;

// Database initialization with fallback
let db = null;
try {
  const Database = require('./database/database');
  db = new Database();
  db.initialize();
  console.log('✅ База данных инициализирована');
} catch (error) {
  console.error('⚠️ БД недоступна, работаем в mock режиме:', error.message);
}

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS - разрешаем все origins для API
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Слишком много запросов, попробуйте позже' }
});

app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Beauty CRM API работает! 🎉',
    timestamp: new Date().toISOString(),
    version: '1.0.3',
    status: 'healthy',
    database: db ? 'connected' : 'mock_mode'
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Beauty CRM API Debug Info',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: PORT,
      DB_PATH: process.env.DB_PATH || './database/beauty_crm.db',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'undefined'
    },
    system: {
      platform: process.platform,
      node_version: process.version,
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage()
    },
    database: {
      status: db ? 'connected' : 'mock_mode',
      path: process.env.DB_PATH || './database/beauty_crm.db'
    }
  });
});

// API Routes
if (db) {
  // Полные роуты с БД
  app.use('/api/auth', authRoutes);
  app.use('/api/salon', salonRoutes);
  app.use('/api/masters', masterRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/clients', clientRoutes);
} else {
  // Mock роуты для демонстрации
  app.post('/api/auth/register', (req, res) => {
    res.json({
      success: true,
      message: 'Mock регистрация успешна (демо режим)',
      data: {
        id: 1,
        email: req.body.email || 'demo@salon.com',
        salonName: req.body.salonName || 'Демо салон',
        token: 'mock_jwt_token_' + Date.now()
      }
    });
  });

  app.post('/api/auth/login', (req, res) => {
    res.json({
      success: true,
      message: 'Mock авторизация успешна (демо режим)',
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          email: req.body.email || 'demo@salon.com',
          salonName: 'Демо салон красоты'
        }
      }
    });
  });

  app.get('/api/salon/dashboard', (req, res) => {
    res.json({
      success: true,
      message: 'Mock данные дашборда (демо режим)',
      data: {
        appointments_today: 12,
        revenue_today: 15500,
        clients_total: 245,
        masters_count: 5,
        popular_services: [
          { name: 'Стрижка', count: 45 },
          { name: 'Окрашивание', count: 38 },
          { name: 'Маникюр', count: 52 }
        ]
      }
    });
  });
}

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🎨 Beauty CRM API Server',
    version: '1.0.3',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      debug: 'GET /api/debug',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      salon: {
        dashboard: 'GET /api/salon/dashboard'
      }
    },
    database_status: db ? 'connected' : 'mock_mode',
    documentation: 'Полная документация API скоро будет доступна'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎨 Beauty CRM API',
    version: '1.0.3',
    timestamp: new Date().toISOString(),
    api_base: '/api',
    frontend: 'Будет развернут отдельно на React',
    status: 'production_ready'
  });
});

// 404 handler для API
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint не найден',
    path: req.path,
    available_endpoints: '/api для списка доступных endpoints'
  });
});

// 404 handler для остальных запросов
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Это API сервер. Frontend будет доступен отдельно.',
    api_base: '/api',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Внутренняя ошибка API сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Beauty CRM API запущен на порту ${PORT}`);
  console.log(`🎨 Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Node.js: ${process.version}`);
  console.log(`🗄️ База данных: ${db ? 'подключена' : 'mock режим'}`);
  console.log(`🌐 API доступен: http://0.0.0.0:${PORT}/api`);
});

module.exports = app;