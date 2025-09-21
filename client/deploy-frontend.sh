#!/bin/bash

echo "🚀 Инициализация Beauty CRM Frontend репозитория..."

# Переходим в папку клиента
cd "D:\CLAUDE_ACCES\beauty-crm\client"

# Инициализируем git (если еще не инициализирован)
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git репозиторий инициализирован"
fi

# Добавляем remote (если еще не добавлен)
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/KOSMOBOB/beauty-crm-frontend.git
echo "✅ Remote origin добавлен"

# Добавляем все файлы
git add .
echo "✅ Файлы добавлены в git"

# Коммитим
git commit -m "initial: Beauty CRM React Frontend

- React 18 application for Beauty CRM
- API integration with production backend
- Responsive design and modern UI
- Authentication and dashboard
- Ready for Timeweb Cloud deployment"

echo "✅ Коммит создан"

# Пушим в репозиторий
git branch -M main
git push -u origin main

echo "🎉 Frontend код успешно загружен в GitHub!"
echo "📍 Репозиторий: https://github.com/KOSMOBOB/beauty-crm-frontend"
echo ""
echo "🔽 СЛЕДУЮЩИЕ ШАГИ:"
echo "1. Зайдите в панель Timeweb Cloud"
echo "2. Создайте новое приложение Frontend app (1₽/мес)"
echo "3. Укажите репозиторий: beauty-crm-frontend"
echo "4. Framework: React"
echo "5. Build command: npm run build"
echo "6. Index directory: /build"
