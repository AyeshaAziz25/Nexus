import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// 1. ALL IMPORTS MUST BE HERE AT THE TOP
import { MessagesPage } from './pages/messages/MessagesPage'; 
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Layouts & Pages
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// A simple wrapper to protect routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            {/* Dashboard Sub-routes */}
            <Route path="dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="dashboard/investor" element={<InvestorDashboard />} />
            
            {/* 2. DEFINE THE ROUTES HERE (NO IMPORTS HERE) */}
            <Route path="messages" element={<MessagesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            
            {/* If your navbar uses /profile/entrepreneur/:id */}
            <Route path="profile/entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="profile/investor/:id" element={<InvestorProfile />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;