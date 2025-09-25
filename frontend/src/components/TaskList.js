import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = tasks;

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    if (filters.category) {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    setFilteredTasks(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      if (response.data.success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
        toast.success('Task status updated!');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await axios.delete(`/api/tasks/${taskId}`);
        if (response.data.success) {
          setTasks(tasks.filter(task => task.id !== taskId));
          toast.success('Task deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const openEditModal = (task) => {
    setEditingTask({ ...task });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setShowEditModal(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/tasks/${editingTask.id}`, editingTask);
      if (response.data.success) {
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? response.data.task : task
        ));
        closeEditModal();
        toast.success('Task updated successfully!');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleEditChange = (field, value) => {
    setEditingTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">All Tasks</h1>
        <p className="page-subtitle">Manage and track all your tasks</p>
      </div>

      <div className="task-filters">
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="filter-select"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Development">Development</option>
          <option value="DevOps">DevOps</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Documentation">Documentation</option>
          <option value="Academic">Academic</option>
        </select>

        <span style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="text-center" style={{padding: '3rem'}}>
              <i className="fas fa-inbox" style={{fontSize: '4rem', color: 'var(--text-light)', marginBottom: '1rem'}}></i>
              <h3 style={{marginBottom: '1rem'}}>No tasks found</h3>
              <p style={{color: 'var(--text-light)', marginBottom: '2rem'}}>
                {tasks.length === 0 
                  ? "You haven't created any tasks yet. Start by creating your first task!"
                  : "No tasks match your current filters. Try adjusting the filter criteria."}
              </p>
              <a href="/create-task" className="btn btn-primary">
                <i className="fas fa-plus"></i>
                Create Task
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-item priority-${task.priority}`}>
              <div className="task-header">
                <div>
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-meta">
                    <span className={`status-badge status-${task.status.replace('-', '-')}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority} priority
                    </span>
                    <span>
                      <i className="fas fa-tag"></i>
                      {task.category}
                    </span>
                    <span>
                      <i className="fas fa-calendar"></i>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-actions">
                {task.status === 'pending' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                  >
                    <i className="fas fa-play"></i>
                    Start
                  </button>
                )}

                {task.status === 'in-progress' && (
                  <button
                    className="btn btn-success"
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                  >
                    <i className="fas fa-check"></i>
                    Complete
                  </button>
                )}

                {task.status === 'completed' && (
                  <button
                    className="btn btn-outline"
                    onClick={() => updateTaskStatus(task.id, 'pending')}
                  >
                    <i className="fas fa-undo"></i>
                    Reopen
                  </button>
                )}

                <button
                  className="btn btn-outline"
                  onClick={() => openEditModal(task)}
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Task</h2>
              <button className="modal-close" onClick={closeEditModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingTask.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editingTask.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-control"
                  value={editingTask.priority}
                  onChange={(e) => handleEditChange('priority', e.target.value)}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={editingTask.category}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                  required
                >
                  <option value="Development">Development</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Academic">Academic</option>
                  <option value="Testing">Testing</option>
                  <option value="Deployment">Deployment</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editingTask.dueDate}
                  onChange={(e) => handleEditChange('dueDate', e.target.value)}
                  required
                />
              </div>

              <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-outline" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TaskList;