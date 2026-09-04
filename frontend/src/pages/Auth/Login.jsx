import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSplit from '../../components/auth/AuthSplit';
import Field from '../../components/auth/Field';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mounted, setMounted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    login({ name: 'Omkar', email: formData.email });
    navigate('/dashboard');
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
            placeholder="omkar@example.com" 
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
        
        <div className="auth-form-forgot">
          <a href="#" className="auth-form-link">Forgot password?</a>
        </div>

        <button 
          type="submit" 
          className="auth-form-submit"
        >
          Sign In
        </button>
        
        <p className="auth-form-footer">
          Don't have an account? <Link to="/register" className="auth-form-link" onClick={handleSwitchToRegister}>Create one</Link>
        </p>
      </form>
    </AuthSplit>
  );
};

export default Login;