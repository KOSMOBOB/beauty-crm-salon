const express = require('express');
const Database = require('../database/database');
const { authenticateToken } = require('./auth');

const router = express.Router();
const db = new Database();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Получить информацию о салоне
router.get('/info', async (req, res) => {
  try {
    const salon = await db.get(
      'SELECT * FROM salons WHERE id = ?',
      [req.salonId]
    );

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Салон не найден'
      });
    }

    // Убираем пароль из ответа
    const { password, ...salonData } = salon;

    res.json({
      success: true,
      salon: salonData
    });

  } catch (error) {
    console.error('Get salon info error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения информации о салоне'
    });
  }
});

// Получить статистику салона
router.get('/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Записи сегодня
    const todayAppointments = await db.get(
      'SELECT COUNT(*) as count FROM appointments WHERE salon_id = ? AND appointment_date = ?',
      [req.salonId, today]
    );

    // Записи за неделю
    const weekAppointments = await db.get(
      'SELECT COUNT(*) as count FROM appointments WHERE salon_id = ? AND appointment_date >= ?',
      [req.salonId, weekAgo]
    );

    // Выручка за неделю
    const weekRevenue = await db.get(
      'SELECT SUM(price) as total FROM appointments WHERE salon_id = ? AND appointment_date >= ? AND status = ?',
      [req.salonId, weekAgo, 'completed']
    );

    // Общее количество клиентов
    const totalClients = await db.get(
      'SELECT COUNT(*) as count FROM clients WHERE salon_id = ?',
      [req.salonId]
    );

    res.json({
      success: true,
      stats: {
        todayAppointments: todayAppointments.count,
        weekAppointments: weekAppointments.count,
        weekRevenue: weekRevenue.total || 0,
        totalClients: totalClients.count
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения статистики'
    });
  }
});

module.exports = router;