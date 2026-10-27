import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { Logo } from '../components/common/Logo';
import { FormField } from '../components/common/FormField';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    degree: '',
    semester: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College / University is required';
    }

    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree / Branch is required';
    }

    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          college: formData.college.trim(),
          degree: formData.degree.trim(),
          semester: formData.semester.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        navigate('/dashboard', { replace: true });
      } else {
        setServerError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'Unable to register student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card auth-card-wide">
        <header className="auth-header">
          <Logo to="/" />
          <h1 className="auth-title">Create Student Account</h1>
          <p className="auth-subtitle">
            Get started organizing your course load, projects, and deadlines.
          </p>
        </header>

        <Alert type="error" message={serverError} />

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full Name"
            id="name"
            placeholder="Alex Morgan"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            autoComplete="name"
            disabled={isLoading}
          />

          <FormField
            label="College / University"
            id="college"
            placeholder="State University of Technology"
            value={formData.college}
            onChange={handleChange}
            error={errors.college}
            required
            disabled={isLoading}
          />

          <div className="form-grid-2">
            <FormField
              label="Degree / Branch"
              id="degree"
              placeholder="B.Tech Computer Science"
              value={formData.degree}
              onChange={handleChange}
              error={errors.degree}
              required
              disabled={isLoading}
            />

            <FormField
              label="Current Semester"
              id="semester"
              placeholder="e.g. 5th Semester"
              value={formData.semester}
              onChange={handleChange}
              error={errors.semester}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-grid-2">
            <FormField
              label="Student Email"
              id="email"
              type="email"
              placeholder="alex@college.edu"
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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isBlock
            isLoading={isLoading}
            disabled={isLoading}
          >
            Complete Registration
          </Button>
        </form>

        <footer className="auth-footer">
          Already registered?{' '}
          <Link to="/login">Sign In Here</Link>
        </footer>
      </div>
    </div>
  );
};
