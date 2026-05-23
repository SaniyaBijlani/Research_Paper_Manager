import { Check, History, Save, Bold, Italic, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, Maximize } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
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
  const [textAlign, setTextAlign] = useState('left');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const editorRef = useRef(null);

  // Synchronize editor innerHTML when active section or project changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content[activeSection] || '';
    }
  }, [activeSection, activeProjectId]);

  const handleContentChange = (e) => {
    const newHTML = e.target.innerHTML;
    setContent(prev => ({ ...prev, [activeSection]: newHTML }));
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
        const currentText = editorRef.current ? editorRef.current.innerText || '' : '';
        const rawWords = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
        updateProjectContent(currentProject.id, rawWords);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSaving, updateProjectContent, currentProject.id, content, activeSection]);

  // Command handlers that prevent losing editor selection focus
  const applyBold = (e) => {
    e.preventDefault();
    document.execCommand('bold', false, null);
    if (editorRef.current) {
      setContent(prev => ({ ...prev, [activeSection]: editorRef.current.innerHTML }));
      setIsSaving(true);
    }
  };

  const applyItalic = (e) => {
    e.preventDefault();
    document.execCommand('italic', false, null);
    if (editorRef.current) {
      setContent(prev => ({ ...prev, [activeSection]: editorRef.current.innerHTML }));
      setIsSaving(true);
    }
  };

  const applyHeader = (e, headerTag) => {
    e.preventDefault();
    document.execCommand('formatBlock', false, headerTag);
    if (editorRef.current) {
      setContent(prev => ({ ...prev, [activeSection]: editorRef.current.innerHTML }));
      setIsSaving(true);
    }
  };

  const currentContent = content[activeSection] || '';
  
  // Calculate word count from current HTML string
  const getWordCount = (html) => {
    const text = html.replace(/<[^>]*>/g, ' ');
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };
  const wordCount = getWordCount(currentContent);

  return (
    <div className={`page-container editor-layout ${isFocusMode ? 'focus-mode' : ''}`}>
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
              <button 
                className="toolbar-btn" 
                onMouseDown={applyBold}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button 
                className="toolbar-btn" 
                onMouseDown={applyItalic}
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button 
                className="toolbar-btn text-icon" 
                onMouseDown={(e) => applyHeader(e, '<h1>')}
                title="Heading 1"
              >
                H1
              </button>
              <button 
                className="toolbar-btn text-icon" 
                onMouseDown={(e) => applyHeader(e, '<h2>')}
                title="Heading 2"
              >
                H2
              </button>
            </div>
            
            <div className="toolbar-group">
              <button 
                className={`toolbar-btn ${textAlign === 'left' ? 'active' : ''}`}
                onClick={() => setTextAlign('left')}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button 
                className={`toolbar-btn ${textAlign === 'center' ? 'active' : ''}`}
                onClick={() => setTextAlign('center')}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button 
                className={`toolbar-btn ${textAlign === 'right' ? 'active' : ''}`}
                onClick={() => setTextAlign('right')}
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
            </div>
            
            <button 
              className={`toolbar-btn ms-auto flex-gap ${isFocusMode ? 'active' : ''}`}
              onClick={() => setIsFocusMode(!isFocusMode)}
              title={isFocusMode ? "Exit Fullscreen Writing" : "Distraction-Free Focus Mode"}
            >
              <Maximize size={16} /> {isFocusMode ? 'Exit Focus' : 'Focus'}
            </button>
          </div>
          
          <div className="writing-area flex-col">
            <h2>{sections[activeSection]}</h2>
            <p className="section-meta">{wordCount} words in this section</p>
            
            <div 
              ref={editorRef}
              contentEditable
              className="prose-textarea prose-editor"
              style={{ textAlign: textAlign }}
              onInput={handleContentChange}
              data-placeholder={`Start writing your ${sections[activeSection].toLowerCase()}...`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
