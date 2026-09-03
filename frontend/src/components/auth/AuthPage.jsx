import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeroCard from './AuthHeroCard';
import FloatingBubbles from './FloatingBubbles';
import Field from './Field';
import { useAuth } from '../../context/AuthContext';
import './auth-split.css';
import './AuthForms.css';

const AuthPage = ({ initialMode = 'register' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [transitioning, setTransitioning] = useState(false);
  const [displayMode, setDisplayMode] = useState(initialMode);
  const [mounted, setMounted] = useState(false);
  const [authCardActive, setAuthCardActive] = useState(false);
  const [authCardRect, setAuthCardRect] = useState(null);
  const formCardRef = useRef(null);
  const formRef = useRef(null);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (formCardRef.current) {
      const rect = formCardRef.current.getBoundingClientRect();
      setAuthCardRect(rect);
    }
    const handleResize = () => {
      if (formCardRef.current) {
        setAuthCardRect(formCardRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [displayMode]);

  useEffect(() => {
    const el = formCardRef.current;
    if (el) {
      const onFocusIn = () => setAuthCardActive(true);
      const onFocusOut = () => {
        setTimeout(() => {
          if (formCardRef.current && !formCardRef.current.contains(document.activeElement)) {
            setAuthCardActive(false);
          }
        }, 100);
      };
      el.addEventListener('focusin', onFocusIn);
      el.addEventListener('focusout', onFocusOut);
      return () => {
        el.removeEventListener('focusin', onFocusIn);
        el.removeEventListener('focusout', onFocusOut);
      };
    }
  }, []);

  const switchMode = useCallback((newMode) => {
    if (newMode === mode || transitioning) return;
    setTransitioning(true);
    setAuthCardActive(false);
    setTimeout(() => {
      setDisplayMode(newMode);
      setMode(newMode);
      setTimeout(() => setTransitioning(false), 50);
    }, 450);
  }, [mode, transitioning]);

  const handleLogin = (e) => {
    e.preventDefault();
    login({ name: 'Omkar', email: loginData.email });
    navigate('/dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  const currentFormData = displayMode === 'login' ? loginData : registerData;
  const setCurrentFormData = displayMode === 'login' ? setLoginData : setRegisterData;

  return (
    <div className="auth-split-container">
      <FloatingBubbles authCardActive={authCardActive} authCardRect={authCardRect} />

      <div className="auth-split-grid">
        <div className="auth-hero-column">
          <AuthHeroCard isActive={authCardActive} />
        </div>

        <div className="auth-form-column">
          <div
            ref={formCardRef}
            className={`auth-form-card ${mounted ? 'animate-in' : ''} ${transitioning ? 'transitioning' : ''}`}
          >
            <div className={`auth-form-wrapper ${transitioning ? 'slide-out' : 'slide-in'}`}>
              {displayMode === 'register' ? (
                <form key="register" ref={formRef} onSubmit={handleRegister} className="auth-form animate-in">
                  <div className="auth-form-header">
                    <h2 className="auth-form-title">Create your account</h2>
                    <p className="auth-form-subtitle">Accelerate your career in tech and AI.</p>
                  </div>
                  <div className="auth-form-fields">
                    <Field
                      label="Full Name"
                      placeholder="e.g. Omkar"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    />
                    <Field
                      label="Email"
                      type="email"
                      placeholder="omkar@example.com"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    />
                    <Field
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="auth-form-submit">
                    Get Started →
                  </button>
                  <p className="auth-form-footer">
                    Already have an account?{' '}
                    <button type="button" className="auth-form-link" onClick={() => switchMode('login')}>
                      Sign in
                    </button>
                  </p>
                </form>
              ) : (
                <form key="login" ref={formRef} onSubmit={handleLogin} className="auth-form animate-in">
                  <div className="auth-form-header">
                    <h2 className="auth-form-title">Welcome back</h2>
                    <p className="auth-form-subtitle">Sign in to continue your learning journey.</p>
                  </div>
                  <div className="auth-form-fields">
                    <Field
                      label="Email"
                      type="email"
                      placeholder="omkar@example.com"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                    <Field
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                  <div className="auth-form-forgot">
                    <a href="#" className="auth-form-link">Forgot password?</a>
                  </div>
                  <button type="submit" className="auth-form-submit">
                    Sign In
                  </button>
                  <p className="auth-form-footer">
                    Don't have an account?{' '}
                    <button type="button" className="auth-form-link" onClick={() => switchMode('register')}>
                      Create one
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;