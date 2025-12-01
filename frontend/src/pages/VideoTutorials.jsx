import React from 'react';
import SEO from '../components/SEO';
import '../styles/Pages.css';

function VideoTutorials() {
  return (
    <>
      <SEO 
        title="Financial Planning Video Tutorials | VegaKash.AI"
        description="Learn financial planning, budgeting, investing, and money management through our comprehensive video tutorials. Free financial education for everyone."
        keywords="financial planning videos, budgeting tutorials, investment learning, money management videos, financial education"
        canonical="/learning/videos"
      />
      
      <div className="page-container">
        <div className="page-header">
          <h1>🎥 Video Tutorials</h1>
          <p>Learn financial planning through expert video content</p>
        </div>
        
        <div className="page-content">
          <div className="coming-soon-card">
            <div className="coming-soon-icon">🚧</div>
            <h2>Coming Soon</h2>
            <p>Comprehensive video library on financial literacy!</p>
            <p className="feature-list">
              ✓ Budgeting basics<br/>
              ✓ Investment strategies<br/>
              ✓ Debt management<br/>
              ✓ Retirement planning
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoTutorials;
