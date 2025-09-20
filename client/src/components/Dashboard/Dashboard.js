import React from 'react';
import { useAuth } from '../../App';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="text-2xl font-bold">Beauty CRM</h1>
              <p className="text-gray-600">Добро пожаловать, {user?.name}!</p>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Карточка статистики */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full d-flex align-items-center justify-content-center">
                  📅
                </div>
                <div>
                  <h3 className="text-2xl font-bold">8</h3>
                  <p className="text-gray-600">Записи сегодня</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full d-flex align-items-center justify-content-center">
                  💰
                </div>
                <div>
                  <h3 className="text-2xl font-bold">45,000 ₽</h3>
                  <p className="text-gray-600">Выручка за неделю</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full d-flex align-items-center justify-content-center">
                  👥
                </div>
                <div>
                  <h3 className="text-2xl font-bold">142</h3>
                  <p className="text-gray-600">Всего клиентов</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Приветственное сообщение */}
        <div className="card mt-8">
          <div className="card-body text-center">
            <h2 className="text-xl font-bold mb-4">🎉 Добро пожаловать в Beauty CRM!</h2>
            <p className="text-gray-600 mb-6">
              Ваша CRM система готова к работе. Начните с добавления мастеров и услуг.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">👩‍💼</div>
                <h3 className="font-semibold mb-2">Добавьте мастеров</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Создайте профили для ваших специалистов
                </p>
                <button className="btn btn-primary btn-sm">
                  Добавить мастера
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">✂️</div>
                <h3 className="font-semibold mb-2">Настройте услуги</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Создайте прайс-лист ваших услуг
                </p>
                <button className="btn btn-primary btn-sm">
                  Добавить услугу
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">👥</div>
                <h3 className="font-semibold mb-2">Добавьте клиентов</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ведите базу ваших клиентов
                </p>
                <button className="btn btn-primary btn-sm">
                  Добавить клиента
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Информация о системе */}
        <div className="card mt-8">
          <div className="card-header">
            <h3 className="font-semibold">Информация о системе</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Возможности Beauty CRM:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Управление записями клиентов</li>
                  <li>✅ База данных клиентов</li>
                  <li>✅ Управление мастерами и услугами</li>
                  <li>✅ Календарь записей</li>
                  <li>✅ Статистика и отчеты</li>
                  <li>✅ Онлайн запись для клиентов</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Следующие шаги:</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Добавьте информацию о своих мастерах</li>
                  <li>2. Создайте прайс-лист услуг</li>
                  <li>3. Настройте расписание работы</li>
                  <li>4. Начните принимать записи</li>
                  <li>5. Поделитесь ссылкой для онлайн записи</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;