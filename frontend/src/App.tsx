import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/Login';
import Dashboard from './routes/Dashboard';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      {/* Catch‑all redirect */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

export default App;
