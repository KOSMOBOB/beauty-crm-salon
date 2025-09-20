import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../App';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(formData.email, formData.password);
    if (!success) {
      alert('Неверный email или пароль');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {/* Заголовок */}
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            <div className="p-3 bg-rose-100" style={{ borderRadius: '50%' }}>
              ✂️
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">Beauty CRM</h1>
          <p className="text-gray-600">Войдите в свой аккаунт салона красоты</p>
        </div>

        {/* Форма входа */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email адрес</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="salon@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Пароль */}
              <div className="form-group">
                <label className="form-label">Пароль</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Кнопка входа */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Вход в систему...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Ссылка на регистрацию */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-rose-600 font-semibold">
              Зарегистрировать салон
            </Link>
          </p>
        </div>

        {/* Демо данные */}
        <div className="card mt-4" style={{ backgroundColor: 'var(--gray-50)' }}>
          <div className="card-body">
            <h3 className="text-sm font-semibold mb-3">Демо доступ:</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Email:</strong> demo@salon.com</p>
              <p><strong>Пароль:</strong> demo123</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-3"
              onClick={() => {
                setFormData({
                  email: 'demo@salon.com',
                  password: 'demo123'
                });
              }}
            >
              Заполнить демо данными
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;