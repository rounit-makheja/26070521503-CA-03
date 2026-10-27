import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { Logo } from '../components/common/Logo';
import { FormField } from '../components/common/FormField';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    setServerError('');

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        navigate('/dashboard', { replace: true });
      } else {
        setServerError(response.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setServerError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <header className="auth-header">
          <Logo to="/" />
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to manage your assignments, deadlines, and courses.
          </p>
        </header>

        <Alert type="error" message={serverError} />

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="College Email"
            id="email"
            type="email"
            placeholder="student@college.edu"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <FormField
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            isBlock
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In to Dashboard
          </Button>
        </form>

        <footer className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup">Create Student Account</Link>
        </footer>
      </div>
    </div>
  );
};
