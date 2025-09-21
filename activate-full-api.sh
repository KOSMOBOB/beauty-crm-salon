#!/bin/bash
cd "D:\CLAUDE_ACCES\beauty-crm"

# Добавляем обновления
git add .

# Коммитим полную функциональность
git commit -m "feat: activate full API functionality with database

- Switch to server.js for full database integration
- Add comprehensive API endpoints documentation
- Improve health check with detailed status
- API-only production mode (no frontend serving)
- All CRUD operations available: auth, salon, masters, services, appointments, clients
- Version 1.0.4 with full functionality
- Ready for real client registrations and data"

# Пушим в репозиторий
git push origin main

echo "✅ Full API functionality activated!"
echo "🔄 Timeweb will auto-deploy in 2-3 minutes"
echo "🎯 All endpoints will be available for real usage"
