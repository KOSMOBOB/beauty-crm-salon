const express = require('express');
const Database = require('../database/database');
const { authenticateToken } = require('./auth');

const router = express.Router();
const db = new Database();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authenticateToken);

// Получить всех клиентов салона
router.get('/', async (req, res) => {
  try {
    const clients = await db.query(
      'SELECT * FROM clients WHERE salon_id = ? ORDER BY name',
      [req.salonId]
    );

    res.json({
      success: true,
      clients
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения клиентов'
    });
  }
});

// Создать нового клиента
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, birthday, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Имя и телефон обязательны'
      });
    }

    const result = await db.run(
      `INSERT INTO clients 
       (salon_id, name, phone, email, birthday, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.salonId,
        name,
        phone,
        email || null,
        birthday || null,
        notes || null
      ]
    );

    const client = await db.get(
      'SELECT * FROM clients WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Клиент успешно добавлен',
      client
    });

  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка создания клиента'
    });
  }
});

// Удалить клиента
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM clients WHERE id = ? AND salon_id = ?',
      [req.params.id, req.salonId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Клиент не найден'
      });
    }

    res.json({
      success: true,
      message: 'Клиент удален'
    });

  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка удаления клиента'
    });
  }
});

module.exports = router;