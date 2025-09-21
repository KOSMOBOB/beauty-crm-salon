#!/bin/bash
cd "D:\CLAUDE_ACCES\beauty-crm\client"

# Инициализируем отдельный git репозиторий для frontend
git init
git remote add origin https://github.com/KOSMOBOB/beauty-crm-frontend.git

# Создаем .gitignore для React
echo "# React build
node_modules/
build/
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# Stores VSCode versions used for testing VSCode extensions
.vscode-test" > .gitignore

# Добавляем все файлы
git add .

# Коммитим
git commit -m "initial: Beauty CRM React Frontend"

echo "✅ Frontend repository initialized!"
