import { Search, Bell, PanelLeftClose } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './Header.css';

function Header() {
  const { searchQuery, setSearchQuery, userProfile } = useProjects();
  const navigate = useNavigate();

  const getAvatarInitials = () => {
    if (!userProfile || !userProfile.name || !userProfile.name.trim()) {
      return 'PR';
    }
    const nameParts = userProfile.name.trim().split(/\s+/);
    if (nameParts.length === 1) {
      const singleName = nameParts[0];
      return singleName.length >= 2 
        ? singleName.substring(0, 2).toUpperCase() 
        : singleName.charAt(0).toUpperCase();
    }
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="icon-button">
          <PanelLeftClose size={20} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search papers, references..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="icon-button">
          <Bell size={20} />
        </button>
        <div 
          className="avatar" 
          onClick={() => navigate('/profile')}
          title="View Profile"
          style={{ cursor: 'pointer' }}
        >
          {getAvatarInitials()}
        </div>
      </div>
    </header>
  );
}

export default Header;
