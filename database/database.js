const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'beauty_crm.db'), (err) => {
      if (err) {
        console.error('Ошибка подключения к БД:', err);
      } else {
        console.log('✅ Подключение к SQLite установлено');
      }
    });
  }

  initialize() {
    this.createTables();
  }

  createTables() {
    const tables = [
      // Салоны
      `CREATE TABLE IF NOT EXISTS salons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        work_hours TEXT DEFAULT '{"mon":{"start":"09:00","end":"21:00"},"tue":{"start":"09:00","end":"21:00"},"wed":{"start":"09:00","end":"21:00"},"thu":{"start":"09:00","end":"21:00"},"fri":{"start":"09:00","end":"21:00"},"sat":{"start":"10:00","end":"20:00"},"sun":{"start":"10:00","end":"20:00"}}',
        settings TEXT DEFAULT '{"slot_duration":30,"advance_booking_days":30,"cancellation_hours":2}',
        subscription_plan TEXT DEFAULT 'basic',
        subscription_expires DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Мастера
      `CREATE TABLE IF NOT EXISTS masters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        salon_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        specialties TEXT, -- JSON массив специализаций
        work_schedule TEXT DEFAULT '{"mon":{"start":"09:00","end":"21:00","break_start":"13:00","break_end":"14:00"},"tue":{"start":"09:00","end":"21:00","break_start":"13:00","break_end":"14:00"},"wed":{"start":"09:00","end":"21:00","break_start":"13:00","break_end":"14:00"},"thu":{"start":"09:00","end":"21:00","break_start":"13:00","break_end":"14:00"},"fri":{"start":"09:00","end":"21:00","break_start":"13:00","break_end":"14:00"},"sat":{"start":"10:00","end":"20:00","break_start":"14:00","break_end":"15:00"},"sun":"off"}',
        avatar TEXT,
        description TEXT,
        rating REAL DEFAULT 5.0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (salon_id) REFERENCES salons (id) ON DELETE CASCADE
      )`,
      
      // Услуги
      `CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        salon_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL, -- в минутах
        price REAL NOT NULL,
        category TEXT DEFAULT 'other',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (salon_id) REFERENCES salons (id) ON DELETE CASCADE
      )`,
      
      // Клиенты
      `CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        salon_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        birthday DATE,
        notes TEXT,
        visits_count INTEGER DEFAULT 0,
        total_spent REAL DEFAULT 0,
        last_visit DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (salon_id) REFERENCES salons (id) ON DELETE CASCADE
      )`,
      
      // Записи
      `CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        salon_id INTEGER NOT NULL,
        master_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status TEXT DEFAULT 'confirmed', -- confirmed, completed, cancelled, no_show
        notes TEXT,
        price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (salon_id) REFERENCES salons (id) ON DELETE CASCADE,
        FOREIGN KEY (master_id) REFERENCES masters (id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
      )`,
      
      // Связь мастеров и услуг
      `CREATE TABLE IF NOT EXISTS master_services (
        master_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        PRIMARY KEY (master_id, service_id),
        FOREIGN KEY (master_id) REFERENCES masters (id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
      )`
    ];

    tables.forEach((table, index) => {
      this.db.run(table, (err) => {
        if (err) {
          console.error(`Ошибка создания таблицы ${index + 1}:`, err);
        }
      });
    });

    // Создаем индексы для производительности
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date)',
      'CREATE INDEX IF NOT EXISTS idx_appointments_master ON appointments(master_id)',
      'CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone)',
      'CREATE INDEX IF NOT EXISTS idx_masters_salon ON masters(salon_id)'
    ];

    indexes.forEach(index => {
      this.db.run(index, (err) => {
        if (err) {
          console.error('Ошибка создания индекса:', err);
        }
      });
    });

    console.log('✅ Таблицы и индексы созданы');
  }

  // Универсальный метод запроса
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Метод для вставки/обновления
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Получить одну запись
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Закрыть соединение
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Database;