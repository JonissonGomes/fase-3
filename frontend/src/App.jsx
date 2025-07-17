import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import VehiclesList from './pages/VehiclesList';
import OrdersList from './pages/OrdersList';
import UsersList from './pages/UsersList';
import VehicleForm from './pages/VehicleForm';
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Rotas públicas */}
        <Route 
          path="/login" 
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <RegisterForm />} 
        />
        
        {/* Rotas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas para Admin */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <OrdersList />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas para Vendedor */}
        <Route 
          path="/vehicles" 
          element={
            <ProtectedRoute allowedRoles={['vendedor', 'admin']}>
              <VehiclesList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vehicles/new" 
          element={
            <ProtectedRoute allowedRoles={['vendedor', 'admin']}>
              <VehicleForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vehicles/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={['vendedor', 'admin']}>
              <VehicleForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota padrão */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
        
        {/* Rota para usuários não autorizados */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Acesso Negado
                </h1>
                <p className="text-gray-600 mb-4">
                  Você não tem permissão para acessar esta página.
                </p>
                <button 
                  onClick={() => window.history.back()}
                  className="btn-primary"
                >
                  Voltar
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

export default App; 