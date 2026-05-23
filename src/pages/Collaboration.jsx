import { UserPlus, Send, History } from 'lucide-react';
import React, { useState } from 'react';
import './Collaboration.css';

const teamMembers = [
  { id: 'AJ', name: 'Alex Johnson', role: 'Owner', badgeColor: 'blue', online: true },
  { id: 'MC', name: 'Maria Chen', role: 'Editor', badgeColor: 'purple', online: false },
  { id: 'SP', name: 'Sam Patel', role: 'Editor', badgeColor: 'green', online: true },
  { id: 'JL', name: 'Jordan Lee', role: 'Viewer', badgeColor: 'orange', online: false },
];

const initialComments = [
  { id: 'MC', name: 'Maria Chen', time: '2h ago', text: 'The methodology section needs more detail on the dataset.' },
  { id: 'SP', name: 'Sam Patel', time: '4h ago', text: "I've added the updated figures to the results section." },
  { id: 'AJ', name: 'Alex Johnson', time: '1d ago', text: "Great progress everyone! Let's aim to finish by Friday." },
];

const activityLog = [
  { user: 'Maria Chen', action: 'edited Methodology', time: '2h ago', dotColor: 'purple' },
  { user: 'Sam Patel', action: 'added Results (Figures)', time: '4h ago', dotColor: 'green' },
  { user: 'Alex Johnson', action: 'reviewed Abstract', time: '1d ago', dotColor: 'blue' },
  { user: 'Jordan Lee', action: 'viewed Full Paper', time: '2d ago', dotColor: 'gray' },
];

function Collaboration() {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSend = () => {
    if (!newComment.trim()) return;
    setComments([
      { id: 'RF', name: 'You (Researcher)', time: 'Just now', text: newComment },
      ...comments
    ]);
    setNewComment('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Collaboration</h1>
        <p className="page-subtitle">Machine Learning in Healthcare</p>
      </div>

      <div className="collaboration-grid">
        <div className="col-left">
          {/* Team Card */}
          <div className="card">
            <div className="card-header">
              <h2>Team</h2>
              <button className="btn-text">
                <UserPlus size={16} />
                <span>Invite</span>
              </button>
            </div>
            <div className="team-list">
              {teamMembers.map(member => (
                <div className="team-member" key={member.name}>
                  <div className="member-info">
                    <div className={`avatar-circle bg-${member.badgeColor}`}>
                      {member.id}
                      {member.online && <span className="online-indicator"></span>}
                    </div>
                    <span className="member-name">{member.name}</span>
                  </div>
                  <span className={`role-badge badge-${member.badgeColor}`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Change Tracking Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="header-with-icon">
                <History size={18} className="icon-blue" />
                Change Tracking
              </h2>
            </div>
            <div className="timeline">
              {activityLog.map((log, i) => (
                <div className="timeline-item" key={i}>
                  <div className={`timeline-dot dot-${log.dotColor}`}></div>
                  <div className="timeline-content">
                    <p>
                      <strong>{log.user}</strong> {log.action}
                    </p>
                    <span className="timeline-time">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-right">
          {/* Comments Card */}
          <div className="card comments-card">
            <div className="card-header">
              <h2>Comments</h2>
            </div>

            <div className="comment-input-area">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn-primary icon-only" onClick={handleSend}>
                <Send size={16} />
              </button>
            </div>

            <div className="comments-list">
              {comments.map((comment, i) => (
                <div className="comment-item" key={i}>
                  <div className="comment-avatar">
                    {comment.id}
                  </div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <strong>{comment.name}</strong>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collaboration;
