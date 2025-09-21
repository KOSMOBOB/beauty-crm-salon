#!/bin/bash

# Переходим в директорию проекта
cd "D:\CLAUDE_ACCES\beauty-crm"

# Добавляем новые файлы
git add render.yaml
git add Procfile
git add .

# Коммитим изменения  
git commit -m "feat: add deployment configs for multiple platforms

- Add render.yaml for Render.com deployment
- Add Procfile for Heroku/Railway compatibility  
- Add health check endpoint
- Update package.json with npm version requirement
- Ready for production deployment on multiple platforms"

# Пушим в репозиторий
git push origin main

echo "✅ Deployment configs successfully pushed to GitHub!"
