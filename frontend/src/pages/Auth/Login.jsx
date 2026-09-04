import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSplit from '../../components/auth/AuthSplit';
import Field from '../../components/auth/Field';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <AuthSplit isLogin={true}>
      <form ref={formRef} onSubmit={handleLogin} className={`auth-form ${mounted ? 'animate-in' : ''}`}>
        <div className="auth-form-header">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">Sign in to continue your learning journey.</p>
        </div>
        
        <div className="auth-form-fields">
          <Field 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Field 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600, textAlign: 'center', marginBottom: '8px' }}>{error}</p>
        )}
        
        <div className="auth-form-forgot">
          <a href="#" className="auth-form-link">Forgot password?</a>
        </div>

        <button 
          type="submit" 
          className="auth-form-submit"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <p className="auth-form-footer">
          Don't have an account? <Link to="/register" className="auth-form-link" onClick={handleSwitchToRegister}>Create one</Link>
        </p>
      </form>
    </AuthSplit>
  );
};

export default Login;
