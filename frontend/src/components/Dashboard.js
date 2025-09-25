import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, tasksResponse] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/tasks?limit=5')
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (tasksResponse.data.success) {
        setRecentTasks(tasksResponse.data.tasks.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's an overview of your tasks.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--primary)'}}>
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-number" style={{color: 'var(--primary)'}}>
            {stats?.total || 0}
          </div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--success)'}}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-number" style={{color: 'var(--success)'}}>
            {stats?.completed || 0}
          </div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--warning)'}}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-number" style={{color: 'var(--warning)'}}>
            {stats?.pending || 0}
          </div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--primary)'}}>
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-number" style={{color: 'var(--primary)'}}>
            {stats?.inProgress || 0}
          </div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Tasks</h2>
          <Link 
            to="/tasks" 
            className="btn btn-outline"
            style={{padding: '0.5rem 1rem', fontSize: '0.8rem', textDecoration: 'none'}}
          >
            <i className="fas fa-eye"></i>
            View All
          </Link>
        </div>
        <div className="card-body">
          {recentTasks.length === 0 ? (
            <div className="text-center" style={{padding: '2rem', color: 'var(--text-light)'}}>
              <i className="fas fa-inbox" style={{fontSize: '3rem', marginBottom: '1rem'}}></i>
              <p>No tasks yet. Create your first task to get started!</p>
              <Link 
                to="/create-task" 
                className="btn btn-primary" 
                style={{marginTop: '1rem', textDecoration: 'none'}}
              >
                <i className="fas fa-plus"></i>
                Create Task
              </Link>
            </div>
          ) : (
            <div className="task-list">
              {recentTasks.map((task) => (
                <div key={task.id} className={`task-item priority-${task.priority}`} style={{marginBottom: '1rem'}}>
                  <div className="task-header">
                    <div>
                      <h3 className="task-title" style={{fontSize: '1.1rem'}}>{task.title}</h3>
                      <div className="task-meta" style={{fontSize: '0.8rem'}}>
                        <span className={`status-badge status-${task.status.replace('-', '-')}`} style={{fontSize: '0.7rem'}}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <span className={`priority-badge priority-${task.priority}`} style={{fontSize: '0.7rem'}}>
                          {task.priority}
                        </span>
                        <span style={{fontSize: '0.75rem'}}>
                          <i className="fas fa-calendar"></i>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="task-description" style={{fontSize: '0.85rem', lineHeight: '1.4'}}>{task.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
