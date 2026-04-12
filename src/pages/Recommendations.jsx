import { Lightbulb, Plus, Check } from 'lucide-react';
import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import './Recommendations.css';

const initialRecs = [
  { id: 1, title: 'Optimizing Neural Networks', authors: 'Goodfellow et al.', reason: 'Based on "Machine Learning in Healthcare"' },
  { id: 2, title: 'State of Quantum Error Correction', authors: 'Shor, P.', reason: 'Based on your recent quantum searches' },
  { id: 3, title: 'Transformer Architectures', authors: 'Devlin, J.', reason: 'Trending in your network' },
];

function Recommendations() {
  const { addReference, userProfile } = useProjects();
  const [added, setAdded] = useState({});

  const displayRecs = userProfile?.field ? [
    { id: 1, title: `Recent Advances in ${userProfile.field}`, authors: 'Smith et al.', reason: `Based on your field: ${userProfile.field}` },
    { id: 2, title: `Methodologies for ${userProfile.field} Research`, authors: 'Johnson, K.', reason: 'Trending among researchers in your field.' },
    { id: 3, title: 'Transformer Architectures', authors: 'Devlin, J.', reason: 'Trending in global AI network' }
  ] : initialRecs;

  const handleAdd = (rec) => {
    if(!added[rec.id]) {
      addReference({
        title: rec.title,
        authors: rec.authors,
        year: '2026',
        doi: '',
        tags: ['Recommended']
      });
      setAdded(prev => ({ ...prev, [rec.id]: true }));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Recommendations</h1>
        <p className="page-subtitle">Personalized AI suggestions tailored to your library.</p>
      </div>

      <div className="recs-list">
        {displayRecs.map(rec => (
          <div className="rec-card card" key={rec.id}>
            <div className="rec-icon-bg">
              <Lightbulb size={24} className="rec-icon" />
            </div>
            
            <div className="rec-info">
              <h3>{rec.title}</h3>
              <p className="rec-authors">{rec.authors}</p>
              <span className="rec-reason">{rec.reason}</span>
            </div>

            <button 
              className={`btn-add-library ${added[rec.id] ? 'added' : ''}`}
              onClick={() => handleAdd(rec)}
            >
              {added[rec.id] ? (
                <><Check size={16}/> Added</>
              ) : (
                <><Plus size={16}/> Add to Library</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
