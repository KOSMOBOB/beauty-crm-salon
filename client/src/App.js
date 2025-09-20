import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';

// Простая заглушка для AuthContext
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    return { user: null, loading: false, login: () => {}, register: () => {}, logout: () => {} };
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const login = async (email, password) => {
    // Простая заглушка для входа
    if (email === 'demo@salon.com' && password === 'demo123') {
      setUser({ id: 1, name: 'Demo Salon', email });
      return true;
    }
    return false;
  };

  const register = async (data) => {
    setUser({ id: 1, name: data.name, email: data.email });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Компонент для защищенных роутов
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Компонент для публичных роутов
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Публичные роуты */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Защищенные роуты */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Редирект на dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 страница */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <h1 className="text-xl font-bold mb-3">404 - Страница не найдена</h1>
                    <p className="text-gray-600 mb-4">
                      Запрашиваемая страница не существует
                    </p>
                    <a href="/" className="btn btn-primary">
                      На главную
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;