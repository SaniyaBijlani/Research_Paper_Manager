import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { User, Mail, Briefcase, BookOpen, ArrowRight } from 'lucide-react';
import './Profile.css';

function Profile() {
  const { userProfile, setUserProfile } = useProjects();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = userProfile.email || '';
    if (!email.includes('@') || !email.includes('.')) {
      setError(true);
      return;
    }
    setError(false);
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-layout">
      <div className="profile-card card">
        <div className="profile-header">
          <div className="profile-icon-large">
            <User size={32} color="white" />
          </div>
          <h2>Welcome to Research Flow</h2>
          <p>Tell us about yourself to personalize your workspace and AI recommendations.</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                name="name"
                required
                placeholder="e.g., Jane Doe"
                value={userProfile.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className={`input-with-icon ${error ? 'input-error' : ''}`}>
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                name="email"
                required
                placeholder="e.g., jane.doe@university.edu"
                value={userProfile.email}
                onChange={(e) => {
                  setError(false);
                  handleChange(e);
                }}
              />
            </div>
            {error && <span className="error-text">enter valid email address</span>}
          </div>

          <div className="form-group">
            <label>Academic Role</label>
            <div className="input-with-icon">
              <Briefcase size={18} className="input-icon" />
              <select 
                name="role" 
                required 
                value={userProfile.role}
                onChange={handleChange}
                className={userProfile.role === '' ? 'placeholder-active' : ''}
              >
                <option value="" disabled hidden>Select your role...</option>
                <option value="Student">Student</option>
                <option value="Teaching Assistant">Teaching Assistant</option>
                <option value="Professor">Professor</option>
                <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                <option value="Independent Researcher">Independent Researcher</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Field of Study</label>
            <div className="input-with-icon">
              <BookOpen size={18} className="input-icon" />
              <input 
                type="text" 
                name="field"
                required
                placeholder="e.g., Quantum Physics, Literature, etc."
                value={userProfile.field}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-submit">
            Continue to Workspace <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
