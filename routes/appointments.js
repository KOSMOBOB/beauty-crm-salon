const express = require('express');
const Database = require('../database/database');
const { authenticateToken } = require('./auth');

const router = express.Router();
const db = new Database();

// Применяем middleware аутентификации ко всем маршрутам кроме публичной записи
router.use((req, res, next) => {
  // Публичные маршруты для записи клиентов
  if (req.path.startsWith('/public/')) {
    return next();
  }
  authenticateToken(req, res, next);
});

// Получить все записи салона
router.get('/', async (req, res) => {
  try {
    const appointments = await db.query(
      `SELECT a.*, c.name as client_name, c.phone as client_phone,
              s.name as service_name, m.name as master_name
       FROM appointments a
       LEFT JOIN clients c ON a.client_id = c.id
       LEFT JOIN services s ON a.service_id = s.id
       LEFT JOIN masters m ON a.master_id = m.id
       WHERE a.salon_id = ?
       ORDER BY a.appointment_date DESC, a.start_time DESC`,
      [req.salonId]
    );
    
    res.json({
      success: true,
      appointments
    });
    
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения записей'
    });
  }
});

// Создать новую запись
router.post('/', async (req, res) => {
  try {
    const { client_id, master_id, service_id, appointment_date, start_time, notes, price } = req.body;

    if (!client_id || !master_id || !service_id || !appointment_date || !start_time) {
      return res.status(400).json({
        success: false,
        message: 'Заполните все обязательные поля'
      });
    }

    // Получаем информацию об услуге для расчета времени окончания
    const service = await db.get(
      'SELECT duration, price as default_price FROM services WHERE id = ? AND salon_id = ?',
      [service_id, req.salonId]
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Услуга не найдена'
      });
    }

    // Вычисляем время окончания
    const startDateTime = new Date(`${appointment_date}T${start_time}`);
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000);
    const end_time = endDateTime.toTimeString().slice(0, 5);

    // Создаем запись
    const result = await db.run(
      `INSERT INTO appointments 
       (salon_id, client_id, master_id, service_id, appointment_date, start_time, end_time, notes, price, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.salonId,
        client_id,
        master_id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        notes || '',
        price || service.default_price,
        'confirmed'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Запись успешно создана',
      appointment_id: result.id
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка создания записи'
    });
  }
});

// ПУБЛИЧНЫЕ МАРШРУТЫ ДЛЯ ОНЛАЙН ЗАПИСИ

// Получить информацию о салоне для публичной записи
router.get('/public/:salonId/info', async (req, res) => {
  try {
    const { salonId } = req.params;
    
    const salon = await db.get(
      'SELECT id, name, address, phone, work_hours FROM salons WHERE id = ?',
      [salonId]
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
    console.error('Get public salon info error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения информации о салоне'
    });
  }
});

// Получить услуги для публичной записи
router.get('/public/:salonId/services', async (req, res) => {
  try {
    const { salonId } = req.params;
    
    const services = await db.query(
      'SELECT id, name, description, duration, price FROM services WHERE salon_id = ? AND is_active = 1',
      [salonId]
    );

    res.json({
      success: true,
      services
    });

  } catch (error) {
    console.error('Get public services error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения услуг'
    });
  }
});

// Получить мастеров для публичной записи
router.get('/public/:salonId/masters', async (req, res) => {
  try {
    const { salonId } = req.params;
    
    const masters = await db.query(
      'SELECT id, name, rating FROM masters WHERE salon_id = ? AND is_active = 1',
      [salonId]
    );

    res.json({
      success: true,
      masters
    });

  } catch (error) {
    console.error('Get public masters error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения мастеров'
    });
  }
});

module.exports = router;