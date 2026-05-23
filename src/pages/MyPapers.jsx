import { FileText, MoreHorizontal, Clock, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './MyPapers.css';

function MyPapers() {
  const { projects, addProject, setActiveProjectId, searchQuery, setSearchQuery } = useProjects();
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const handleNewPaper = () => {
    const id = addProject();
    setActiveProjectId(id);
    navigate('/editor');
  };

  const handleOpenPaper = (id) => {
    setActiveProjectId(id);
    navigate('/editor');
  };

  const filteredPapers = projects.filter((paper) => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || paper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header papers-header">
        <div>
          <h1 className="page-title">My Papers</h1>
          <p className="page-subtitle">{projects.length} papers in your library</p>
        </div>
        <button className="btn-primary" onClick={handleNewPaper}>
          <Plus size={16} style={{marginRight: '6px', verticalAlign: 'text-bottom'}}/> New Paper
        </button>
      </div>

      <div className="papers-toolbar">
        <div className="search-bar flex-fill">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search papers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
        </select>
      </div>

      <div className="papers-list">
        {filteredPapers.length === 0 ? (
          <div className="empty-state card">
            <Search size={40} className="empty-icon" />
            <h3>No papers found</h3>
            <p className="text-muted">We couldn't find any papers matching your search criteria.</p>
            <button className="btn-outline" onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPapers.map((paper) => (
            <div 
              className="paper-row card" 
              key={paper.id}
              onClick={() => handleOpenPaper(paper.id)}
              style={{cursor: 'pointer'}}
            >
              <div className="paper-icon-container">
                <FileText size={20} className="paper-icon" />
              </div>
              
              <div className="paper-content">
                <div className="paper-title-row">
                  <span className="paper-title">{paper.title}</span>
                  <span className={`status-badge st-${paper.statusColor}`}>
                    {paper.status}
                  </span>
                </div>
                
                <div className="paper-progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${paper.progress}%` }}></div>
                  </div>
                </div>
                
                <div className="paper-meta">
                  <span>{paper.progress}%</span>
                  <span>{paper.words} words</span>
                  <span className="meta-time">
                    <Clock size={12} />
                    {paper.date}
                  </span>
                </div>
              </div>

              <button className="icon-button more-btn" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyPapers;
