import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Protected route – redirects to /login if not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage text="Loading TaskFlow…" />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route – redirects to / if already authenticated
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage text="Loading TaskFlow…" />;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/tasks"    element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
    <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    {/* Catch all */}
    <Route path="*"         element={<Navigate to="/" replace />} />
  </Routes>
);

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <TaskProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a2744',
              color: '#e2e8f0',
              border: '1px solid rgba(124,17,245,0.25)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
          }}
        />
      </TaskProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
