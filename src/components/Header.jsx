import { Search, Bell, PanelLeftClose } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="icon-button">
          <PanelLeftClose size={20} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search papers, references..." />
        </div>
      </div>
      
      <div className="header-right">
        <button className="icon-button">
          <Bell size={20} />
        </button>
        <div className="avatar">
          RF
        </div>
      </div>
    </header>
  );
}

export default Header;
