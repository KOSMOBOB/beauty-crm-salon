# Используем Node.js 20 для лучшей совместимости
FROM node:20-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json файлы
COPY package*.json ./
COPY client/package*.json ./client/

# Устанавливаем зависимости
RUN npm install
RUN cd client && npm install

# Копируем исходный код
COPY . .

# Создаем директории
RUN mkdir -p database uploads

# Собираем React приложение
RUN cd client && npm run build

# Устанавливаем права доступа
RUN chmod -R 755 /app

# Открываем порт
EXPOSE 5000

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=5000

# Запускаем приложение
CMD ["node", "server.js"]