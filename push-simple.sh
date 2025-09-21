#!/bin/bash
cd "D:\CLAUDE_ACCES\beauty-crm"

# Добавляем все файлы
git add .

# Коммитим изменения
git commit -m "fix: simplify server for production deployment

- Add server-simple.js with minimal dependencies
- Remove database dependency for initial deployment test
- Add health check and debug endpoints  
- Use only express and cors for stability
- Mock auth endpoints for testing
- Fix 500 error by removing complex dependencies"

# Пушим в репозиторий
git push origin main

echo "✅ Simplified server pushed to GitHub!"
