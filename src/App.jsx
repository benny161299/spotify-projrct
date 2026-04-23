import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import CreatePage from './pages/CreatePage';

/**
 * Protected route — redirects to login if no access token.
 */
function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();
  return accessToken ? children : <Navigate to="/" replace />;
}

/**
 * Root component with routing logic.
 * / → LoginPage (unless already authenticated → /create)
 * /callback → CallbackPage
 * /create → CreatePage (protected)
 */
function AppRoutes() {
  const { accessToken } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={accessToken ? <Navigate to="/create" replace /> : <LoginPage />}
      />
      <Route path="/callback" element={<CallbackPage />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        }
      />
      {/* Catch-all → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
