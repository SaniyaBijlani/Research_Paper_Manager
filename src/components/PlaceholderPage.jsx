import './PlaceholderPage.css';

function PlaceholderPage({ title, description, icon: Icon }) {
  return (
    <div className="page-container page-empty-state">
      <div className="empty-state-content card">
        <div className="empty-icon-container">
          <Icon size={48} className="empty-icon" />
        </div>
        <h2 className="empty-title">{title} is under construction!</h2>
        <p className="empty-description">
          {description || "We are currently building this feature. Check back soon for exciting updates to your research workflow."}
        </p>
        <button className="btn-primary mt-4">
          Notify Me When Live
        </button>
      </div>
    </div>
  );
}

export default PlaceholderPage;
