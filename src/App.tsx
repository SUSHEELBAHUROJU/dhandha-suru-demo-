import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RetailerDashboard from './pages/RetailerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import FintechDashboard from './pages/FintechDashboard';
import FintechRegistration from './pages/FintechRegistration';
import ConnectionStatus from './components/ConnectionStatus';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.user_type}/dashboard`} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.user_type}/dashboard`} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.user_type}/dashboard`} /> : <RegisterPage />} />
      <Route path="/register/fintech" element={user ? <Navigate to={`/${user.user_type}/dashboard`} /> : <FintechRegistration />} />
      
      {/* Dashboard Routes */}
      <Route
        path="/retailer/dashboard"
        element={
          <PrivateRoute allowedRoles={['retailer']}>
            <RetailerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/supplier/dashboard"
        element={
          <PrivateRoute allowedRoles={['supplier']}>
            <SupplierDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/fintech/dashboard"
        element={
          <PrivateRoute allowedRoles={['fintech']}>
            <FintechDashboard />
          </PrivateRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ConnectionStatus />
      </AuthProvider>
    </Router>
  );
}

export default App;