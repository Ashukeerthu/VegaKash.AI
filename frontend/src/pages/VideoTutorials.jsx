import React from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import '../styles/Pages.css';

function VideoTutorials() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Video Tutorials', path: null }
  ];
  
  return (
    <>
      <SEO 
        title="Financial Planning Video Tutorials | VegaKash.AI"
        description="Learn financial planning, budgeting, investing, and money management through our comprehensive video tutorials. Free financial education for everyone."
        keywords="financial planning videos, budgeting tutorials, investment learning, money management videos, financial education"
        canonical="/learning/videos"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Financial Planning Video Tutorials",
              "url": "https://vegaktools.com/learning/videos"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Learning Videos", "item": "https://vegaktools.com/learning/videos" }
              ]
            }
          ]
        }}
      />
      
      <div className="page-container">
        <Breadcrumb items={breadcrumbItems} />
        
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
