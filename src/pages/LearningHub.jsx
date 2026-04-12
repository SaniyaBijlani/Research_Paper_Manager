import { PlayCircle, BookOpen, Star } from 'lucide-react';
import './LearningHub.css';

const courses = [
  { title: 'How Anyone Can Start Writing a Research Paper', category: 'Tutorial', duration: '45 min', popular: true, color: 'blue' },
  { title: 'Different Standards: APA, MLA, IEEE', category: 'Course', duration: '1 hour', popular: true, color: 'purple' },
  { title: 'Finding & Formulating a Research Topic', category: 'Guide', duration: '20 min', popular: false, color: 'green' },
  { title: 'Reading Academic Literature Effectively', category: 'Tutorial', duration: '35 min', popular: false, color: 'orange' },
  { title: 'Effective Research Methodologies', category: 'Course', duration: '2 hours', popular: false, color: 'blue' },
  { title: 'Writing Compelling Abstracts', category: 'Guide', duration: '15 min', popular: true, color: 'purple' },
];

function LearningHub() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Learning Hub</h1>
        <p className="page-subtitle">Resources to level up your research skills.</p>
      </div>

      <div className="learning-grid">
        {courses.map((course, idx) => (
          <div className="course-card card" key={idx}>
            <div className={`course-thumbnail thumb-${course.color}`}>
              <PlayCircle size={48} className="play-icon" color="white" />
              {course.popular && (
                <div className="popular-badge">
                  <Star size={12} fill="currentColor" /> Popular
                </div>
              )}
            </div>
            <div className="course-content">
              <span className={`course-category text-${course.color}`}>
                <BookOpen size={14} /> {course.category}
              </span>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-duration">{course.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningHub;
