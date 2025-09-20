const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('../database/database');

const router = express.Router();
const db = new Database();

// JWT Secret (в продакшене должен быть в .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// Регистрация салона
router.post('/register', async (req, res) => {
  try {
    const { name, address, phone, email, password } = req.body;

    // Проверяем обязательные поля
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Заполните все обязательные поля'
      });
    }

    // Проверяем, существует ли салон с таким email
    const existingSalon = await db.get(
      'SELECT id FROM salons WHERE email = ?',
      [email]
    );

    if (existingSalon) {
      return res.status(400).json({
        success: false,
        message: 'Салон с таким email уже существует'
      });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем салон
    const result = await db.run(
      `INSERT INTO salons (name, address, phone, email, password, subscription_expires) 
       VALUES (?, ?, ?, ?, ?, datetime('now', '+30 days'))`,
      [name, address, phone, email, hashedPassword]
    );

    // Получаем созданный салон
    const salon = await db.get(
      'SELECT id, name, address, phone, email, subscription_plan, subscription_expires FROM salons WHERE id = ?',
      [result.id]
    );

    // Создаем JWT токен
    const token = jwt.sign(
      { salonId: salon.id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Салон успешно зарегистрирован',
      token,
      salon
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка регистрации салона'
    });
  }
});

// Вход в систему
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Введите email и пароль'
      });
    }

    // Ищем салон по email
    const salon = await db.get(
      'SELECT * FROM salons WHERE email = ?',
      [email]
    );

    if (!salon) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, salon.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { salonId: salon.id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Убираем пароль из ответа
    const { password: _, ...salonData } = salon;

    res.json({
      success: true,
      message: 'Успешный вход в систему',
      token,
      salon: salonData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка входа в систему'
    });
  }
});

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Токен доступа не предоставлен'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Недействительный токен'
      });
    }
    req.salonId = decoded.salonId;
    next();
  });
};

// Получение текущего пользователя
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const salon = await db.get(
      'SELECT id, name, address, phone, email, subscription_plan, subscription_expires FROM salons WHERE id = ?',
      [req.salonId]
    );

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Салон не найден'
      });
    }

    res.json({
      success: true,
      salon
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных пользователя'
    });
  }
});

module.exports = { router, authenticateToken };