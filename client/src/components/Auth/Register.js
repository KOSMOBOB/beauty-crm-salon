import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../App';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    return formData.name.trim() && formData.address.trim() && formData.phone.trim();
  };

  const validateStep2 = () => {
    return formData.email.trim() && 
           formData.password.length >= 6 && 
           formData.password === formData.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setLoading(true);
    
    const { confirmPassword, ...dataToSend } = formData;
    const success = await register(dataToSend);
    
    if (!success) {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
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
          <h1 className="text-xl font-bold mb-2">Регистрация салона</h1>
          <p className="text-gray-600">Создайте аккаунт для вашего салона красоты</p>
        </div>

        {/* Индикатор шагов */}
        <div className="d-flex justify-content-center mb-4">
          <div className="d-flex align-items-center gap-4">
            <div className={`w-8 h-8 rounded-full d-flex align-items-center justify-content-center text-sm font-semibold ${
              step >= 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'
            }`} style={{ borderRadius: '50%', width: '32px', height: '32px' }}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-rose-500' : 'bg-gray-200'}`} style={{ height: '4px' }}></div>
            <div className={`w-8 h-8 rounded-full d-flex align-items-center justify-content-center text-sm font-semibold ${
              step >= 2 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'
            }`} style={{ borderRadius: '50%', width: '32px', height: '32px' }}>
              2
            </div>
          </div>
        </div>

        {/* Форма регистрации */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Информация о салоне</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Название салона</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Beauty Studio"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Адрес</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="г. Москва, ул. Красоты, д. 1"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={nextStep}
                    disabled={!validateStep1()}
                  >
                    Продолжить
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Данные для входа</h3>

                  <div className="form-group">
                    <label className="form-label">Email адрес</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="admin@beautystudio.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Пароль</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Минимум 6 символов"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Подтвердите пароль</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Повторите пароль"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {formData.password && formData.confirmPassword && 
                     formData.password !== formData.confirmPassword && (
                      <div className="text-sm text-danger mt-1">
                        Пароли не совпадают
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={loading || !validateStep2()}
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Регистрация...
                        </>
                      ) : (
                        'Создать салон'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Ссылка на вход */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-rose-600 font-semibold">
              Войти в систему
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;