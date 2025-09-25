import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Development',
    dueDate: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/tasks', formData);

      if (response.data.success) {
        toast.success('Task created successfully!');
        navigate('/tasks');
      } else {
        toast.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Create New Task</h1>
        <p className="page-subtitle">Add a new task to your project management system</p>
      </div>

      <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="card-header">
          <h2 className="card-title">Task Details</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Task Title <span style={{color: 'var(--danger)'}}>*</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter a descriptive title for your task"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <small style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
                Choose a clear, descriptive title that summarizes the task
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description <span style={{color: 'var(--danger)'}}>*</span>
              </label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                placeholder="Provide a detailed description of what needs to be done"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
              <small style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
                Include specific requirements, acceptance criteria, and any relevant details
              </small>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">
                  Priority <span style={{color: 'var(--danger)'}}>*</span>
                </label>
                <select
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <small style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
                  Set the urgency level for this task
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category <span style={{color: 'var(--danger)'}}>*</span>
                </label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Development">💻 Development</option>
                  <option value="DevOps">⚙️ DevOps</option>
                  <option value="Infrastructure">🏗️ Infrastructure</option>
                  <option value="Documentation">📚 Documentation</option>
                  <option value="Academic">🎓 Academic</option>
                  <option value="Testing">🧪 Testing</option>
                  <option value="Deployment">🚀 Deployment</option>
                </select>
                <small style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
                  Categorize this task for better organization
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Due Date <span style={{color: 'var(--danger)'}}>*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <small style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
                  When should this task be completed?
                </small>
              </div>
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <h4 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <i className="fas fa-info-circle" style={{color: 'var(--primary)'}}></i>
                Task Preview
              </h4>
              <div style={{display: 'grid', gap: '0.5rem', fontSize: '0.875rem'}}>
                <div><strong>Title:</strong> {formData.title || 'Enter task title'}</div>
                <div><strong>Description:</strong> {formData.description || 'Enter task description'}</div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <span><strong>Priority:</strong> 
                    <span className={`priority-badge priority-${formData.priority}`} style={{marginLeft: '0.5rem'}}>
                      {formData.priority}
                    </span>
                  </span>
                  <span><strong>Category:</strong> {formData.category}</span>
                  <span><strong>Due:</strong> {formData.dueDate || 'Select date'}</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)'
            }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
                disabled={loading}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card" style={{maxWidth: '800px', margin: '2rem auto 0'}}>
        <div className="card-header">
          <h3 className="card-title">💡 Task Creation Tips</h3>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gap: '1rem', fontSize: '0.875rem'}}>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{color: 'var(--primary)', fontSize: '1.2rem'}}>✅</div>
              <div>
                <strong>Be Specific:</strong> Use clear, actionable titles like "Set up Docker containers for React app" instead of "Fix Docker"
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{color: 'var(--primary)', fontSize: '1.2rem'}}>📋</div>
              <div>
                <strong>Include Details:</strong> Add technical requirements, acceptance criteria, and any dependencies in the description
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{color: 'var(--primary)', fontSize: '1.2rem'}}>⚡</div>
              <div>
                <strong>Set Realistic Deadlines:</strong> Consider the complexity and your other commitments when setting due dates
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{color: 'var(--primary)', fontSize: '1.2rem'}}>🎯</div>
              <div>
                <strong>Prioritize Wisely:</strong> Use "High" for urgent/blocking tasks, "Medium" for important work, "Low" for nice-to-have items
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTask;