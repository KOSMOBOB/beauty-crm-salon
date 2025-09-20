const express = require('express');
const Database = require('../database/database');
const { authenticateToken } = require('./auth');

const router = express.Router();
const db = new Database();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Получить все услуги салона
router.get('/', async (req, res) => {
  try {
    const services = await db.query(
      'SELECT * FROM services WHERE salon_id = ? ORDER BY category, name',
      [req.salonId]
    );

    res.json({
      success: true,
      services
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения услуг'
    });
  }
});

// Создать новую услугу
router.post('/', async (req, res) => {
  try {
    const { name, description, duration, price, category } = req.body;

    if (!name || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: 'Заполните все обязательные поля'
      });
    }

    const result = await db.run(
      `INSERT INTO services 
       (salon_id, name, description, duration, price, category) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.salonId,
        name,
        description || null,
        duration,
        price,
        category || 'other'
      ]
    );

    const service = await db.get(
      'SELECT * FROM services WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Услуга успешно создана',
      service
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка создания услуги'
    });
  }
});

// Удалить услугу
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM services WHERE id = ? AND salon_id = ?',
      [req.params.id, req.salonId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Услуга не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Услуга удалена'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка удаления услуги'
    });
  }
});

module.exports = router;