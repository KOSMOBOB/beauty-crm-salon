const express = require('express');
const Database = require('../database/database');
const { authenticateToken } = require('./auth');

const router = express.Router();
const db = new Database();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Получить всех мастеров салона
router.get('/', async (req, res) => {
  try {
    const masters = await db.query(
      'SELECT * FROM masters WHERE salon_id = ? ORDER BY name',
      [req.salonId]
    );

    res.json({
      success: true,
      masters
    });

  } catch (error) {
    console.error('Get masters error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения мастеров'
    });
  }
});

// Создать нового мастера
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, specialties, work_schedule, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Имя мастера обязательно'
      });
    }

    const result = await db.run(
      `INSERT INTO masters 
       (salon_id, name, phone, email, specialties, work_schedule, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.salonId,
        name,
        phone || null,
        email || null,
        JSON.stringify(specialties || []),
        JSON.stringify(work_schedule || {}),
        description || null
      ]
    );

    const master = await db.get(
      'SELECT * FROM masters WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Мастер успешно добавлен',
      master
    });

  } catch (error) {
    console.error('Create master error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка создания мастера'
    });
  }
});

// Удалить мастера
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM masters WHERE id = ? AND salon_id = ?',
      [req.params.id, req.salonId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Мастер не найден'
      });
    }

    res.json({
      success: true,
      message: 'Мастер удален'
    });

  } catch (error) {
    console.error('Delete master error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка удаления мастера'
    });
  }
});

module.exports = router;