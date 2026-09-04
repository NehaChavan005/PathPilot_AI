import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
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

const App = () => {
  return (
    <AuthProvider>
      <LearnerProfileProvider>
        <Router>
          <Routes>
            {/* 1. Public Routes (No Sidebar/Navbar) */}
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/register" element={<AuthPage initialMode="register" />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />

            {/* 2. Protected Routes (Wrapped in the AppLayout) */}
            <Route element={<AppLayout />}>
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
        </Router>
      </LearnerProfileProvider>
    </AuthProvider>
  );
};

export default App;
