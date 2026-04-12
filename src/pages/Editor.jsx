import { Check, History, Save, Bold, Italic, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, Maximize } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import './Editor.css';

const sections = [
  'Abstract',
  'Introduction',
  'Literature Review',
  'Methodology',
  'Results',
  'Conclusion'
];

function Editor() {
  const { projects, activeProjectId, updateProjectTitle, updateProjectContent } = useProjects();
  
  // Find the active project, or fall back to the first one for mockup purposes
  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const [activeSection, setActiveSection] = useState(0);
  const [content, setContent] = useState({
    0: 'This paper explores the application of machine learning techniques in healthcare diagnostics. We present a comprehensive analysis of deep learning models applied to medical imaging, demonstrating significant improvements in early disease detection accuracy.'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleContentChange = (e) => {
    setContent({ ...content, [activeSection]: e.target.value });
    setIsSaving(true);
  };

  const handleTitleChange = (e) => {
    updateProjectTitle(currentProject.id, e.target.value);
  };

  useEffect(() => {
    if (isSaving) {
      const timer = setTimeout(() => {
        setIsSaving(false);
        // Map wordcount back roughly to global state context
        const currentText = content[activeSection] || '';
        const rawWords = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
        updateProjectContent(currentProject.id, rawWords);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSaving, updateProjectContent, currentProject.id, content, activeSection]);

  const currentContent = content[activeSection] || '';
  const wordCount = currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0;

  return (
    <div className="page-container editor-layout">
      <div className="page-header editor-topbar">
        <div className="title-editor-group flex-col">
          <input 
            type="text" 
            className="page-title-input" 
            value={currentProject.title}
            onChange={handleTitleChange}
            placeholder="Untitled Research Paper"
          />
          <p className="page-subtitle">Writing Editor</p>
        </div>
        
        <div className="editor-actions">
          <span className="auto-save-text" style={{ opacity: isSaving ? 0.5 : 1 }}>
            <Check size={14} /> {isSaving ? 'Saving...' : 'Auto-saved'}
          </span>
          <span className="word-count">{wordCount} words</span>
          
          <button className="btn-outline">
            <History size={16} />
            History
          </button>
          
          <button className="btn-primary">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="editor-main">
        {/* Left Sections Sidebar */}
        <div className="editor-sidebar card">
          <div className="sidebar-title">SECTIONS</div>
          <nav className="sections-nav">
            {sections.map((section, idx) => (
              <button 
                key={section} 
                className={`section-btn ${idx === activeSection ? 'active' : ''}`}
                onClick={() => setActiveSection(idx)}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Writing Area */}
        <div className="editor-canvas card">
          <div className="toolbar">
            <div className="toolbar-group">
              <button className="toolbar-btn"><Bold size={16} /></button>
              <button className="toolbar-btn"><Italic size={16} /></button>
              <button className="toolbar-btn text-icon">H1</button>
              <button className="toolbar-btn text-icon">H2</button>
            </div>
            
            <div className="toolbar-group">
              <button className="toolbar-btn"><AlignLeft size={16} /></button>
              <button className="toolbar-btn"><AlignCenter size={16} /></button>
              <button className="toolbar-btn"><AlignRight size={16} /></button>
            </div>
            
            <button className="toolbar-btn ms-auto flex-gap">
              <Maximize size={16} /> Focus
            </button>
          </div>
          
          <div className="writing-area flex-col">
            <h2>{sections[activeSection]}</h2>
            <p className="section-meta">{wordCount} words in this section</p>
            
            <textarea 
              className="prose-textarea"
              value={currentContent}
              onChange={handleContentChange}
              placeholder={`Start writing your ${sections[activeSection].toLowerCase()}...`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
