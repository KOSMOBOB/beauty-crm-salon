#!/bin/bash
cd "D:\CLAUDE_ACCES\beauty-crm"

# Добавляем API-only сервер
git add .

# Коммитим изменения
git commit -m "feat: API-only server for backend deployment

- Create server-api.js with API-only functionality
- Database fallback to mock mode if SQLite fails
- CORS enabled for frontend separation
- Health check and debug endpoints
- Ready for separate frontend deployment
- Production-ready error handling"

# Пушим в репозиторий
git push origin main

echo "✅ API-only server deployed!"
