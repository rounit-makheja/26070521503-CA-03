import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { FormField } from '../components/common/FormField';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || '',
    semester: user?.semester || '',
    email: user?.email || ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (successMsg) setSuccessMsg('');
    if (errorMsg) setErrorMsg('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name cannot be empty';
    if (!formData.college.trim()) newErrors.college = 'College cannot be empty';
    if (!formData.degree.trim()) newErrors.degree = 'Degree / branch cannot be empty';
    if (!formData.semester.trim()) newErrors.semester = 'Semester cannot be empty';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || saving) return;

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name.trim(),
          college: formData.college.trim(),
          degree: formData.degree.trim(),
          semester: formData.semester.trim()
        })
      });

      if (res.success && res.data?.user) {
        updateUser(res.data.user);
        setSuccessMsg('Your student profile was updated successfully.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update student profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Student Profile</h1>
          <p className="page-description">Manage your university details, current semester, and identity.</p>
        </div>
      </header>

      <Alert type="success" message={successMsg} />
      <Alert type="error" message={errorMsg} />

      <div className="section-panel" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '1.4rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              {user?.name}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {user?.email} • {user?.degree}
            </p>
          </div>
        </div>
      </div>

      <div className="section-panel">
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={saving}
          />

          <FormField
            label="College Email (Immutable)"
            id="email"
            value={formData.email}
            disabled={true}
          />

          <FormField
            label="College / University"
            id="college"
            value={formData.college}
            onChange={handleChange}
            error={errors.college}
            required
            disabled={saving}
          />

          <div className="form-grid-2">
            <FormField
              label="Degree & Branch"
              id="degree"
              value={formData.degree}
              onChange={handleChange}
              error={errors.degree}
              required
              disabled={saving}
            />

            <FormField
              label="Current Semester"
              id="semester"
              value={formData.semester}
              onChange={handleChange}
              error={errors.semester}
              required
              disabled={saving}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button type="submit" variant="primary" isLoading={saving} disabled={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
