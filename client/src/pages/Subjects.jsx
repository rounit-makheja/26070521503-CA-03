import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { Alert } from '../components/common/Alert';
import { PageLoader } from '../components/common/PageLoader';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete Subject Modal State
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    instructor: '',
    color: '#4F46E5'
  });
  const [formErrors, setFormErrors] = useState({});
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/subjects');
      if (res.success) {
        setSubjects(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses/subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      instructor: '',
      color: '#4F46E5'
    });
    setFormErrors({});
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSubject(sub);
    setFormData({
      name: sub.name || '',
      code: sub.code || '',
      instructor: sub.instructor || '',
      color: sub.color || '#4F46E5'
    });
    setFormErrors({});
    setModalError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
    if (modalError) setModalError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Subject name is required';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate() || saving) return;

    setSaving(true);
    setModalError('');

    try {
      if (editingSubject) {
        await apiRequest(`/subjects/${editingSubject._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiRequest('/subjects', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      closeModal();
      fetchSubjects();
    } catch (err) {
      setModalError(err.message || 'Failed to save subject');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;

    try {
      setIsDeleting(true);
      await apiRequest(`/subjects/${subjectToDelete._id}`, { method: 'DELETE' });
      setSubjectToDelete(null);
      fetchSubjects();
    } catch (err) {
      alert(err.message || 'Failed to delete subject');
    } finally {
      setIsDeleting(false);
    }
  };

  // Color options for badges
  const COLOR_PALETTE = [
    '#4F46E5', // Indigo
    '#0284C7', // Sky
    '#059669', // Emerald
    '#D97706', // Amber
    '#DC2626', // Red
    '#7C3AED', // Purple
    '#DB2777', // Pink
    '#475569'  // Slate
  ];

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Subjects & Courses</h1>
          <p className="page-description">Organize your academic coursework, professors, and linked tasks.</p>
        </div>
        <div className="page-actions">
          <Button variant="primary" onClick={openAddModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Subject</span>
          </Button>
        </div>
      </header>

      <Alert type="error" message={error} />

      {loading ? (
        <PageLoader text="Loading your subjects..." />
      ) : subjects.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m16 6 4 14" />
            <path d="M12 6v14" />
            <path d="M8 8v12" />
            <path d="M4 4v16" />
          </svg>
          <h3 className="empty-state-title">No subjects added yet</h3>
          <p className="empty-state-desc">Create your college courses (e.g. Operating Systems, Data Structures) to tag assignments.</p>
          <Button variant="primary" onClick={openAddModal}>
            Add First Subject
          </Button>
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map((sub) => (
            <div key={sub._id} className="subject-card">
              <div className="subject-card-bar" style={{ backgroundColor: sub.color || '#4F46E5' }} />
              <div>
                <div className="subject-header">
                  <h3 className="subject-title">{sub.name}</h3>
                  {sub.code && <span className="subject-code">{sub.code}</span>}
                </div>
                <p className="subject-instructor">
                  {sub.instructor ? `Instructor: ${sub.instructor}` : 'No instructor specified'}
                </p>
              </div>
              <div className="subject-progress-box">
                <div className="subject-progress-top">
                  <span>Progress ({sub.completionRate || 0}%)</span>
                  <span>{sub.completedTasks || 0}/{sub.totalTasks || 0} Done</span>
                </div>
                <div className="subject-progress-track">
                  <div
                    className="subject-progress-fill"
                    style={{
                      width: `${sub.completionRate || 0}%`,
                      backgroundColor: sub.color || '#4F46E5'
                    }}
                  />
                </div>
              </div>

              <div className="subject-footer">
                <span className="subject-task-count">
                  {sub.pendingTasks || 0} active • {sub.overdueTasks ? `${sub.overdueTasks} overdue` : `${sub.completedTasks || 0} done`}
                </span>
                <div className="subject-actions">
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => openEditModal(sub)}
                    title="Edit Subject"
                    aria-label="Edit Subject"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn delete"
                    onClick={() => setSubjectToDelete(sub)}
                    title="Delete Subject"
                    aria-label="Delete Subject"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
              <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <Alert type="error" message={modalError} />

            <form onSubmit={handleSave} noValidate>
              <FormField
                label="Subject / Course Name"
                id="name"
                placeholder="e.g., Database Management Systems"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                required
                disabled={saving}
              />

              <div className="form-grid-2">
                <FormField
                  label="Course Code"
                  id="code"
                  placeholder="CS501"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={saving}
                />

                <FormField
                  label="Instructor / Professor"
                  id="instructor"
                  placeholder="Dr. Jenkins"
                  value={formData.instructor}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Color Badge Tag</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color: c }))}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: formData.color === c ? '3px solid #0F172A' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.15s'
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={closeModal} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={saving} disabled={saving}>
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmModal
        isOpen={Boolean(subjectToDelete)}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectToDelete?.name}"? Make sure no active assignments are linked to it.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setSubjectToDelete(null)}
      />
    </div>
  );
};
