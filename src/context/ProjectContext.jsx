import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

const initialProjects = [
  { id: 'p1', title: 'Machine Learning in Healthcare', progress: 75, status: 'In Progress', statusColor: 'blue', date: 'Apr 28, 2026', words: '4,520' },
  { id: 'p2', title: 'Quantum Computing Survey', progress: 40, status: 'Draft', statusColor: 'gray', date: 'May 10, 2026', words: '2,100' },
  { id: 'p3', title: 'NLP for Education', progress: 95, status: 'Review', statusColor: 'purple', date: 'Apr 15, 2026', words: '6,800' },
  { id: 'p4', title: 'Blockchain Privacy Analysis', progress: 20, status: 'Draft', statusColor: 'gray', date: 'Jun 01, 2026', words: '980' },
];

const initialReferences = [
  { id: 'r1', title: 'A Survey of Quantum Computing', authors: 'Chen, W.', year: '2023', doi: '10.1007/qc2023', tags: ['Quantum Survey', 'Journal'] },
  { id: 'r2', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin, J. et al.', year: '2019', doi: '', tags: ['NLP Education', 'Conference'] },
  { id: 'r3', title: 'Ethics in AI Research', authors: 'Patel, R. & Kim, S.', year: '2025', doi: '', tags: ['ML Healthcare', 'Book'] },
  { id: 'r4', title: 'Deep Learning for Medical Imaging', authors: 'Smith, J. & Lee, K.', year: '2024', doi: '10.1234/dlmi.2024', tags: ['ML Healthcare', 'Journal'] },
  { id: 'r5', title: 'Attention Is All You Need', authors: 'Vaswani, A. et al.', year: '2017', doi: '10.5555/3295222', tags: ['NLP Education', 'Conference'] }
];

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState(null);
  
  // References Global State
  const [references, setReferences] = useState(initialReferences);

  const addProject = () => {
    const newId = `p${Date.now()}`;
    const newProject = {
      id: newId,
      title: 'Untitled Research Paper',
      progress: 0,
      status: 'Draft',
      statusColor: 'gray',
      date: 'Just Now',
      words: '0'
    };
    setProjects(prev => [newProject, ...prev]);
    return newId;
  };

  const updateProjectTitle = (id, newTitle) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, title: newTitle } : p
    ));
  };

  const updateProjectContent = (id, newWordCount) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, words: newWordCount.toString() } : p
    ));
  };

  // Function to add a new reference global wrapper
  const addReference = (refData) => {
    const newId = `r${Date.now()}`;
    const newRef = { ...refData, id: newId };
    setReferences(prev => [newRef, ...prev]);
    return newId;
  };

  const updateReferenceTitle = (id, newTitle) => {
    setReferences(prev => prev.map(r => 
      r.id === id ? { ...r, title: newTitle } : r
    ));
  };

  const deleteReference = (id) => {
    setReferences(prev => prev.filter(r => r.id !== id));
  };

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    role: '',
    field: ''
  });

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      addProject, 
      updateProjectTitle, 
      updateProjectContent,
      activeProjectId,
      setActiveProjectId,
      references,
      addReference,
      updateReferenceTitle,
      deleteReference,
      userProfile,
      setUserProfile
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
