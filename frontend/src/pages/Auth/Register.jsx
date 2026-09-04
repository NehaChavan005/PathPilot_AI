import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSplit from '../../components/auth/AuthSplit';
import Field from '../../components/auth/Field';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      navigate('/onboarding');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <AuthSplit isLogin={false}>
      <form ref={formRef} onSubmit={handleRegister} className={`auth-form ${mounted ? 'animate-in' : ''}`}>
        <div className="auth-form-header">
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Accelerate your career in tech and AI.</p>
        </div>
        
        <div className="auth-form-fields">
          <Field 
            label="Full Name" 
            placeholder="e.g. Alex" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
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
        
        <button 
          type="submit" 
          className="auth-form-submit"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Get Started →'}
        </button>
        
        <p className="auth-form-footer">
          Already have an account? <Link to="/login" className="auth-form-link" onClick={handleSwitchToLogin}>Sign in</Link>
        </p>
      </form>
    </AuthSplit>
  );
};

export default Register;
