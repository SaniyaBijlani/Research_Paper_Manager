import { Search, Tag, Book, FileText, ChevronDown, Check, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import './References.css';

function References() {
  const { references, addReference, updateReferenceTitle, deleteReference } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAddReference = () => {
    const newId = addReference({ 
      title: 'Untitled Reference', 
      authors: 'You', 
      year: new Date().getFullYear().toString(), 
      doi: '', 
      tags: ['Manual'] 
    });
    // Give focus to the new edit field instantly
    setEditingId(newId);
  };

  const handleGenerateBibliography = () => {
    const bibText = references.map(ref => 
      `${ref.authors} (${ref.year}). ${ref.title}. ${ref.doi ? `DOI: ${ref.doi}` : ''}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(bibText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const filteredRefs = references.filter(ref => 
    ref.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ref.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header references-header">
        <div>
          <h1 className="page-title">References</h1>
          <p className="page-subtitle">{references.length} references in your library</p>
        </div>
        
        <div className="header-actions">
          <button className="btn-outline" onClick={handleGenerateBibliography}>
            {copied ? <Check size={16} className="text-green-500" /> : <FileText size={16} />}
            {copied ? 'Copied to Clipboard!' : 'Bibliography'}
          </button>
          <button className="btn-primary" onClick={handleAddReference}>
            + Add Reference
          </button>
        </div>
      </div>

      <div className="references-toolbar">
        <div className="search-bar flex-fill">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search references..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button className="btn-filter">
          <Tag size={16} className="text-muted" />
          <span>All</span>
          <ChevronDown size={16} className="text-muted" />
        </button>
      </div>

      <div className="references-list">
        {filteredRefs.map((ref, i) => (
          <div className="reference-card card" key={i}>
            <div className="ref-icon-container">
              <Book size={20} className="ref-icon" />
            </div>
            
            <div className="ref-content">
              {editingId === ref.id ? (
                <input 
                  type="text" 
                  className="ref-title-input"
                  value={ref.title}
                  onChange={(e) => updateReferenceTitle(ref.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <h3 className="ref-title" onClick={() => setEditingId(ref.id)} style={{cursor: 'pointer'}} title="Click to edit">
                  {ref.title}
                </h3>
              )}
              <p className="ref-authors">{ref.authors} · {ref.year}</p>
              {ref.doi && <p className="ref-doi">DOI: {ref.doi}</p>}
            </div>
            
            <div className="ref-tags">
              {ref.tags.map(tag => (
                <span className="style-tag" key={tag}>{tag}</span>
              ))}
              <button 
                className="btn-icon delete-ref-btn" 
                onClick={() => deleteReference(ref.id)}
                title="Delete Reference"
                style={{marginLeft: '0.5rem', color: '#ef4444'}}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default References;
