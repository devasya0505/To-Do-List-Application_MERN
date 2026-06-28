import { useState, useEffect } from 'react';
import { STATUSES, PRIORITIES } from '../../utils/constants';
import { formatDateForInput } from '../../utils/helpers';

const TaskForm = ({ task, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    tags: [],
    dueDate: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        tags: task.tags || [],
        dueDate: formatDateForInput(task.dueDate),
      });
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.length > 200) errs.title = 'Title too long (max 200 chars)';
    if (formData.description.length > 2000) errs.description = 'Description too long (max 2000 chars)';
    if (formData.tags.length > 5) errs.tags = 'Max 5 tags allowed';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 5) {
        handleChange('tags', [...formData.tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleChange('tags', formData.tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      dueDate: formData.dueDate || null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-body" id="task-form">
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-title">Title *</label>
        <input
          type="text"
          id="task-title"
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          autoFocus
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          placeholder="Add more details..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Status & Priority */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="task-status">Status</label>
          <select
            id="task-status"
            className="form-select"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            className="form-select"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-due">Due Date</label>
        <input
          type="date"
          id="task-due"
          className="form-input"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label">Tags (press Enter to add)</label>
        <div className="tag-input-wrapper">
          {formData.tags.map((tag) => (
            <span key={tag} className="tag removable" onClick={() => handleRemoveTag(tag)}>
              {tag} ×
            </span>
          ))}
          <input
            type="text"
            className="tag-input"
            placeholder={formData.tags.length < 5 ? 'Add a tag...' : 'Max tags reached'}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={formData.tags.length >= 5}
            id="tag-input"
          />
        </div>
        {errors.tags && <span className="form-error">{errors.tags}</span>}
      </div>

      {/* Actions */}
      <div className="modal-footer" style={{ margin: 0, padding: 0, border: 'none' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading} id="task-submit">
          {loading ? <span className="spinner sm" /> : isEditing ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
