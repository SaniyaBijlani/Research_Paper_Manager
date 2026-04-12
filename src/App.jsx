import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import MyPapers from './pages/MyPapers';
import Editor from './pages/Editor';
import References from './pages/References';
import Collaboration from './pages/Collaboration';
import LearningHub from './pages/LearningHub';
import Recommendations from './pages/Recommendations';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import { ProjectProvider } from './context/ProjectContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isPublicRoute = ['/', '/home', '/profile'].includes(location.pathname);

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/papers" element={<MyPapers />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/references" element={<References />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/learning" element={<LearningHub />} />
          <Route path="/recommendations" element={<Recommendations />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ProjectProvider>
      <Router>
        <AppContent />
      </Router>
    </ProjectProvider>
  );
}

export default App;
