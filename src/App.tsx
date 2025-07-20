import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';

// Components
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import BankLinking from './components/BankLinking';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Goals from './components/Goals';
import Calendar from './components/Calendar';
import Search from './components/Search';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Bank Linking Route Component
const BankLinkingRoute: React.FC = () => {
  const { bankLinked } = useApp();
  
  if (bankLinked) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <BankLinking />;
};

// Dashboard Route Component
const DashboardRoute: React.FC = () => {
  const { bankLinked } = useApp();
  
  if (!bankLinked) {
    return <Navigate to="/bank-linking" replace />;
  }
  
  return <Dashboard />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/bank-linking" />} />
      <Route path="/signup" element={!user ? <SignUpForm /> : <Navigate to="/bank-linking" />} />
      
      {/* Protected Routes */}
      <Route path="/bank-linking" element={
        <ProtectedRoute>
          <BankLinkingRoute />
        </ProtectedRoute>
      } />
      
      {/* App Routes with Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardRoute />} />
        <Route path="insights" element={<Insights />} />
        <Route path="goals" element={<Goals />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="search" element={<Search />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <AppRoutes />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;