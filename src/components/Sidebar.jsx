import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  PenTool, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Lightbulb, 
  FileText,
  Home,
  User
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/papers', label: 'My Papers', icon: Files },
  { path: '/editor', label: 'Editor', icon: PenTool },
  { path: '/references', label: 'References', icon: BookOpen },
  { path: '/collaboration', label: 'Collaboration', icon: Users },
  { path: '/learning', label: 'Learning Hub', icon: GraduationCap },
  { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/home', label: 'Home Page', icon: Home },
];

function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useProjects();

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">
            <FileText size={20} color="white" />
          </div>
          <div className="logo-text">
            <h1>Research Flow</h1>
            <span>Research Manager</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
