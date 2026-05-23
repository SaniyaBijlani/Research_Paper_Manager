import { Link } from 'react-router-dom';
import { FileText, Users, ArrowRight, Zap, BookOpen, Quote, User } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-layout">
      {/* Top Nav inside Landing Page */}
      <header className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <FileText size={20} color="white" />
          </div>
          <span className="landing-brand">Research Flow</span>
        </div>
        <div className="landing-nav-links">
          <a href="#about">About the Ecosystem</a>
          <a href="#how-it-works">How it works</a>
          <Link to="/dashboard" className="btn-primary-small">
            Start Writing
          </Link>
          <Link to="/profile" className="landing-profile-icon" title="Complete Profile" style={{ color: 'var(--color-primary)' }}>
            <User size={18} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="inline-badge">
            <span className="badge-pulse"></span>
            Now in open beta for researchers
          </div>
          
          <h1 className="hero-title">
            The intelligent workspace for <span className="text-gradient">research teams</span>.
          </h1>
          
          <p className="hero-subtitle">
            Say goodbye to scattered PDFs, chaotic chat logs, and lost references. Research Flow unifies your writing, collaboration, and bibliography into one beautiful, AI-powered platform.
          </p>
          
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary hero-btn">
              Start Researching <ArrowRight size={18} />
            </Link>
            <button className="btn-outline-dark hero-btn">
              Watch Demo
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <strong>10k+</strong>
              <span>Papers Written</span>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
              <strong>4.9/5</strong>
              <span>User Rating</span>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
              <strong>120+</strong>
              <span>Universities</span>
            </div>
          </div>
        </div>
        
        {/* Abstract floating UI representation */}
        <div className="hero-visual">
          <div className="floating-card c1 card">
            <div className="c-icon blue"><FileText size={16}/></div>
            <div className="c-lines">
              <div className="c-line long"></div>
              <div className="c-line short"></div>
            </div>
          </div>
          
          <div className="floating-card c2 card">
            <div className="c-icon purple"><Users size={16}/></div>
            <div className="c-lines">
               <div className="c-line medium"></div>
            </div>
            <div className="c-avatars">
              <div className="c-av">JD</div>
              <div className="c-av">AS</div>
            </div>
          </div>
          
          <div className="floating-card c3 card">
             <div className="c-icon green"><Zap size={16}/></div>
             <p className="c-text">Auto-formatting references...</p>
          </div>
        </div>
      </main>

      {/* About Us / Ecosystem Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h2 className="title-section">The Ultimate Ecosystem for Research Students</h2>
            <p className="subtitle-section">We are serving the next generation of academic minds by breaking down the silos between reading, writing, and collaboration.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon bg-blue-muted">
                <BookOpen size={24} className="text-blue" />
              </div>
              <h3>Centralized Knowledge</h3>
              <p>Store your PDFs, annotations, and references in one searchable vault. Never lose track of a paper again when writing your literature reviews.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-purple-muted">
                <Users size={24} className="text-purple" />
              </div>
              <h3>Real-time Collaboration</h3>
              <p>Work with your lab mates seamlessly. Leave comments, track historical changes, and divide writing sections seamlessly across multiple authors.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-green-muted">
                <Quote size={24} className="text-green" />
              </div>
              <h3>Smart Citation Management</h3>
              <p>The days of manually formatting bibliographies are over. Our AI automatically tracks your references and builds perfect citations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Profile Quick Link Bar */}
      <footer className="developer-footer">
        <div className="dev-footer-container">
          <p className="dev-bio">Idea and Development by Saniya Bijlani - Student at Thadomal Shahani Engineering College</p>
          <div className="dev-links">
            <a href="https://www.instagram.com/saniyaspace_?igsh=MWEwbTBsODF0NXdweQ==" className="dev-link" target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              Instagram
            </a>
            <a href="https://www.linkedin.com/in/saniyabijlani6" className="dev-link" target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-linkedin"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
