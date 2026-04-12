import { FileText, MoreHorizontal, Clock, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './MyPapers.css';

function MyPapers() {
  const { projects, addProject, setActiveProjectId } = useProjects();
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

      <div className="papers-list">
        {projects.map((paper) => (
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

            <button className="icon-button more-btn">
              <MoreHorizontal size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPapers;
