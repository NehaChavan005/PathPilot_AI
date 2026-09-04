import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearnerProfileProvider } from './context/LearnerProfileCtx';

// Layout
import AppLayout from './layouts/AppLayout';

// Public Pages
import AuthPage from './components/auth/AuthPage';
import OnboardingFlow from './pages/OnboardingFlow';

// Protected Interior Pages
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import CareerPath from './pages/CareerPath';
import LearningPath from './pages/LearningPath';
import AIRolePlay from './pages/AIRolePlay';
import Certifications from './pages/Certifications';
import SkillAnalytics from './pages/SkillAnalytics';
import AllCourses from './pages/AllCourses';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-slate-500">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/register" element={<AuthPage initialMode="register" />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />

      {/* Protected Routes (Wrapped in the AppLayout) */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/career" element={<CareerPath />} />
        <Route path="/learning" element={<LearningPath />} />
        <Route path="/roleplay" element={<AIRolePlay />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/analytics" element={<SkillAnalytics />} />
        <Route path="/courses" element={<AllCourses />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LearnerProfileProvider>
        <Router>
          <AppRoutes />
        </Router>
      </LearnerProfileProvider>
    </AuthProvider>
  );
};

export default App;
