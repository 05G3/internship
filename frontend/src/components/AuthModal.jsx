import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!formData.name.trim()) throw new Error('Please enter your full name');
        if (!formData.email.trim()) throw new Error('Please enter your email address');
        if (formData.password.length < 4) throw new Error('Password must be at least 4 characters');
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        onLoginSuccess(data);
        onClose();
      } else {
        if (!formData.email.trim() || !formData.password) {
          throw new Error('Please enter your email and password');
        }

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials');

        onLoginSuccess(data);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setMode('login');
      setFormData({
        name: '',
        email: 'admin@thecoffeehaven.com',
        password: 'admin',
        confirmPassword: '',
        phone: ''
      });
    } else {
      setMode('login');
      setFormData({
        name: '',
        email: 'customer@thecoffeehaven.com',
        password: 'customer123',
        confirmPassword: '',
        phone: ''
      });
    }
    setError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">×</button>

        <div className="auth-header">
          <img src="/logo.jpg" alt="The Coffee Haven" className="auth-logo" />
          <h2>{mode === 'login' ? 'Welcome Back to The Haven' : 'Join The Coffee Haven'}</h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your dashboard, rewards & custom orders'
              : 'Create an account to explore our menu and order seamless pickups'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name *</label>
              <input
                id="auth-name"
                type="text"
                name="name"
                placeholder="e.g. Maya Patel"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address *</label>
            <input
              id="auth-email"
              type="email"
              name="email"
              placeholder="e.g. maya@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-phone">Phone Number</label>
              <input
                id="auth-phone"
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-password">Password *</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-confirm">Confirm Password *</label>
              <input
                id="auth-confirm"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In to Account' : 'Register Customer Account')}
          </button>
        </form>

        <div className="demo-credentials-box">
          <p className="demo-label">⚡ Fast One-Click Demo Logins:</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-demo"
              onClick={() => setDemoCredentials('customer')}
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => setDemoCredentials('admin')}
            >
              🛡️ Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
