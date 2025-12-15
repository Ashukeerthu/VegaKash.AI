import React from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import ScrollToTop from '../modules/core/ui/ScrollToTop';
import '../styles/Pages.css';

function About() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'About', path: null }
  ];
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VegaKash.AI",
    "description": "AI-powered financial planning and budget management platform",
    "url": "https://vegaktools.com",
    "logo": "https://vegaktools.com/logo.png",
    "sameAs": [
      "https://twitter.com/vegakashai",
      "https://facebook.com/vegakashai",
      "https://linkedin.com/company/vegakashai"
    ]
  };

  return (
    <>
      <ScrollToTop threshold={300} />
      <SEO 
        title="About VegaKash.AI - AI-Powered Financial Planning Platform"
        description="Learn about VegaKash.AI, the intelligent financial planning platform helping thousands manage their money better with AI-powered insights."
        keywords="about vegakash, financial planning platform, AI budget planner, money management tool"
        canonical="/about"
        structuredData={{
          "@graph": [
            structuredData,
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "About", "item": "https://vegaktools.com/about" }
              ]
            }
          ]
        }}
      />
      
      <div className="page-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="page-header">
          <h1>About VegaKash.AI</h1>
          <p>Your AI-powered financial companion</p>
        </div>
        
        <div className="page-content about-content">
          <section className="about-section">
            <h2>🎯 Our Mission</h2>
            <p>
              VegaKash.AI is on a mission to democratize financial planning by making 
              intelligent money management accessible to everyone. We combine the power 
              of artificial intelligence with user-friendly tools to help you achieve 
              your financial goals.
            </p>
          </section>

          <section className="about-section">
            <h2>💡 What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🤖 AI-Powered Planning</h3>
                <p>Get personalized financial advice powered by advanced AI algorithms</p>
              </div>
              <div className="feature-card">
                <h3>📊 Smart Calculators</h3>
                <p>Comprehensive suite of financial calculators for all your needs</p>
              </div>
              <div className="feature-card">
                <h3>📈 Budget Tracking</h3>
                <p>Track income, expenses, and savings with intelligent insights</p>
              </div>
              <div className="feature-card">
                <h3>🎓 Financial Education</h3>
                <p>Learn money management through our educational resources</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>🌟 Why Choose Us</h2>
            <ul className="benefits-list">
              <li>✓ Free to use with no hidden charges</li>
              <li>✓ Privacy-focused - your data stays secure</li>
              <li>✓ AI-powered personalized recommendations</li>
              <li>✓ Easy-to-use interface for everyone</li>
              <li>✓ Regular updates with new features</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

export default About;
