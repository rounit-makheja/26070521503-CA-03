import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { FormField } from '../components/common/FormField';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { PageLoader } from '../components/common/PageLoader';

export const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    type: 'Assignment',
    priority: 'Medium',
    status: 'Pending',
    dueDate: ''
  });

  const [subjects, setSubjects] = useState([]);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Fetch subjects for dropdown
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await apiRequest('/subjects');
        if (res.success) setSubjects(res.data);
      } catch (e) {
        console.warn('Failed to load subjects', e.message);
      }
    };
    loadSubjects();
  }, []);

  // If in edit mode, fetch existing task
  useEffect(() => {
    if (!isEditMode) return;
    const loadTask = async () => {
      try {
        const res = await apiRequest(`/tasks/${id}`);
        if (res.success && res.data) {
          const t = res.data;
          // Format ISO date to YYYY-MM-DDThh:mm for datetime-local input
          let formattedDate = '';
          if (t.dueDate) {
            const d = new Date(t.dueDate);
            const pad = (n) => String(n).padStart(2, '0');
            formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          }

          setFormData({
            title: t.title || '',
            description: t.description || '',
            subjectId: t.subjectId?._id || t.subjectId || '',
            type: t.type || 'Assignment',
            priority: t.priority || 'Medium',
            status: t.status || 'Pending',
            dueDate: formattedDate
          });
        }
      } catch (err) {
        setServerError(err.message || 'Failed to load task details');
      } finally {
        setInitialLoading(false);
      }
    };
    loadTask();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date and time are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || saving) return;

    setSaving(true);
    setServerError('');

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subjectId: formData.subjectId || null,
        type: formData.type,
        priority: formData.priority,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (isEditMode) {
        await apiRequest(`/tasks/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest('/tasks', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      navigate('/tasks', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) return <PageLoader text="Loading assignment details..." />;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Assignment' : 'Create New Assignment'}</h1>
          <p className="page-description">Fill in the details, course, deadline, and priority below.</p>
        </div>
        <div className="page-actions">
          <Link to="/tasks" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </header>

      <div className="section-panel">
        <Alert type="error" message={serverError} />

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Assignment / Task Title"
            id="title"
            placeholder="e.g., Problem Set 3 - Dynamic Programming"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            disabled={saving}
          />

          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="subjectId" className="form-label">
                Academic Subject
              </label>
              <select
                id="subjectId"
                name="subjectId"
                className="form-input"
                value={formData.subjectId}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">-- None / General --</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.code ? `[${sub.code}] ` : ''}{sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="type" className="form-label">
                Task Type
              </label>
              <select
                id="type"
                name="type"
                className="form-input"
                value={formData.type}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Assignment">Assignment</option>
                <option value="Project">Project</option>
                <option value="Lab Record">Lab Record</option>
                <option value="Exam Prep">Exam Prep</option>
                <option value="Homework">Homework</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="form-input"
                value={formData.priority}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <FormField
            label="Deadline (Date & Time)"
            id="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            required
            disabled={saving}
          />

          <div className="form-field">
            <label htmlFor="description" className="form-label">
              Description & Notes
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="form-input"
              placeholder="Add submission guidelines, textbook chapter references, or partner notes..."
              value={formData.description}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <Link to="/tasks" className="btn btn-outline">
              Cancel
            </Link>
            <Button type="submit" variant="primary" isLoading={saving} disabled={saving}>
              {isEditMode ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
