# 💄 Beauty CRM - Система для салонов красоты

> **Современная CRM система для управления салонами красоты с красивым интерфейсом и онлайн записью клиентов**

## 🎯 Описание

Beauty CRM - это полнофункциональная система управления салоном красоты, созданная для увеличения прибыли и автоматизации рутинных процессов. Система включает в себя красивый админ-интерфейс и публичную страницу для онлайн записи клиентов.

## ✨ Ключевые особенности

### 🎨 Современный UI/UX
- Красивый дизайн с градиентами и анимациями
- Полностью адаптивный интерфейс
- Интуитивно понятная навигация

### 📊 Аналитика и отчеты
- Дашборд с ключевыми метриками
- Статистика по мастерам и клиентам

### 📅 Управление записями
- Календарь записей
- Статусы записей
- Онлайн запись для клиентов

### 👥 База клиентов
- Полная информация о клиентах
- История посещений

### 💼 Управление персоналом
- Профили мастеров
- Расписание работы
- Специализации

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- npm или yarn
- Git

### Локальная установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/username/beauty-crm.git
cd beauty-crm

# 2. Установите зависимости
npm run install-all

# 3. Запустите в режиме разработки
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Демо аккаунт

```
Email: demo@salon.com
Пароль: demo123
```

## 🛠 Технологии

### Frontend
- **React 18** - UI библиотека
- **React Router** - маршрутизация
- **CSS3** - современные стили

### Backend
- **Node.js** - серверная платформа
- **Express** - веб-фреймворк
- **SQLite** - база данных
- **JWT** - аутентификация
- **bcrypt** - хеширование паролей

### DevOps
- **Docker** - контейнеризация
- **Timeweb Cloud** - хостинг

## 🔧 API Documentation

### Авторизация
```javascript
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Записи
```javascript
GET    /api/appointments
POST   /api/appointments
DELETE /api/appointments/:id
```

### Публичная запись
```javascript
GET  /api/appointments/public/:salonId/info
GET  /api/appointments/public/:salonId/services
GET  /api/appointments/public/:salonId/masters
```

## 🤝 Структура проекта

```
beauty-crm/
├── 📁 client/                 # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # React компоненты
│   │   │   ├── Auth/         # Авторизация
│   │   │   └── Dashboard/    # Главная панель
│   │   ├── App.js            # Главный компонент
│   │   └── index.js          # Точка входа
│   ├── 📁 public/            # Статические файлы
│   └── package.json          # Frontend зависимости
├── 📁 routes/                # API маршруты
├── 📁 database/             # База данных SQLite
├── 📁 uploads/              # Загруженные файлы
├── server.js                # Express сервер
├── package.json             # Backend зависимости
├── Dockerfile               # Docker конфигурация
└── README.md                # Документация
```

## 📈 Готово к запуску!

---

Made with ❤️ for beauty industry
