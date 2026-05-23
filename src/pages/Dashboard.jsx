import { FileText, Users, Clock, TrendingUp, Search, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './Dashboard.css';

function Dashboard() {
  const { projects, addProject, setActiveProjectId, searchQuery, setSearchQuery } = useProjects();
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState('All');

  const handleNewProject = () => {
    const newId = addProject();
    setActiveProjectId(newId);
    navigate('/editor');
  };

  const handleOpenProject = (id) => {
    setActiveProjectId(id);
    navigate('/editor');
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Review').length;

  return (
    <div className="page-container">
      <div className="page-header dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your research overview.</p>
        </div>
        <button className="btn-primary" onClick={handleNewProject}>
          + New Project
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-header">
            <span>ACTIVE PAPERS</span>
            <FileText size={16} className="stat-icon-blue" />
          </div>
          <div className="stat-value">{activeCount}</div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-header">
            <span>COLLABORATORS</span>
            <Users size={16} className="stat-icon-purple" />
          </div>
          <div className="stat-value">7</div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-header">
            <span>HOURS THIS WEEK</span>
            <Clock size={16} className="stat-icon-green" />
          </div>
          <div className="stat-value">12</div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-header">
            <span>COMPLETION RATE</span>
            <TrendingUp size={16} className="stat-icon-orange" />
          </div>
          <div className="stat-value">68%</div>
        </div>
      </div>

      <div className="projects-section">
        <div className="projects-header">
          <h2>Research Projects</h2>
          <div className="projects-actions">
            <div className="search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="btn-outline filter-btn"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
            </select>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.length === 0 ? (
            <p className="text-muted" style={{padding: '1rem'}}>No projects found.</p>
          ) : (
            filteredProjects.map((project) => (
              <div 
                className="project-card card" 
                key={project.id}
                onClick={() => handleOpenProject(project.id)}
                style={{cursor: 'pointer'}}
              >
                <div className="project-card-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge st-${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="project-card-footer">
                  <span className="footer-stat">{project.progress}% complete</span>
                  <span className="footer-stat flex-icon">
                    <Clock size={14} /> {project.date}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
