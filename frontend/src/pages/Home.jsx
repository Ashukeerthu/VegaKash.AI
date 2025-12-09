import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import '../styles/HomeEnhanced.css';

/**
 * VegaKash.AI Homepage
 * SEO-optimized landing page showcasing all planners and calculators
 */
function Home() {
  const featuredPlanners = [
    {
      icon: '🤖',
      title: 'AI Budget Planner',
      description: 'Smart monthly budget planning with AI-powered recommendations',
      tagline: 'Create personalized budgets with AI insights',
      path: '/budget-planner',
      badge: 'Most Popular',
      featured: true
    },
    {
      icon: '✈️',
      title: 'AI Travel Budget Planner',
      description: 'Plan your trip expenses with intelligent cost predictions',
      tagline: 'Create smart itineraries with cost forecasting',
      path: '/travel-budget',
      badge: 'New',
      featured: true
    },
    {
      icon: '🎉',
      title: 'AI Event Planner',
      description: 'Budget and organize events with smart recommendations',
      tagline: 'Plan memorable events within your budget',
      path: '/event-planner',
      badge: 'Coming Soon'
    },
    {
      icon: '💍',
      title: 'AI Wedding Budget Planner',
      description: 'Plan your perfect wedding with AI cost optimization',
      tagline: 'Your dream wedding, perfectly planned',
      path: '/wedding-planner',
      badge: 'Coming Soon'
    },
    {
      icon: '🎓',
      title: 'AI Student Budget Planner',
      description: 'Manage monthly allowance and study expenses smartly',
      tagline: 'Smart financial management for students',
      path: '/student-planner',
      badge: 'Coming Soon'
    },
    {
      icon: '🎯',
      title: 'AI Savings Goal Planner',
      description: 'Achieve your financial goals with intelligent planning',
      tagline: 'Reach your savings goals faster',
      path: '/savings-planner',
      badge: 'Coming Soon'
    }
  ];

  const popularCalculators = [
    { icon: '🏦', title: 'FD Calculator', path: '/calculators/fd' },
    { icon: '📅', title: 'RD Calculator', path: '/calculators/rd' },
    { icon: '📈', title: 'SIP Calculator', path: '/calculators/sip' },
    { icon: '🏠', title: 'EMI Calculator', path: '/calculators/emi' },
    { icon: '🇺🇸', title: 'US Loan Calculator', path: '/us/calculators/loan' },
    { icon: '📊', title: 'Income Tax Calculator', path: '/calculators/tax' }
  ];

  const valueProps = [
    {
      icon: '🧠',
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations based on your financial data',
      detail: 'Advanced algorithms analyze patterns and suggest improvements'
    },
    {
      icon: '⚡',
      title: 'Instant Calculations',
      description: 'Real-time results with lightning-fast processing',
      detail: 'Get answers in milliseconds, not minutes'
    },
    {
      icon: '📊',
      title: 'Smart Recommendations',
      description: 'Personalized advice to optimize your finances',
      detail: 'Tailored strategies based on your unique situation'
    },
    {
      icon: '🔒',
      title: 'Privacy-First Design',
      description: 'Your data never leaves your device',
      detail: 'No registration, no tracking, complete privacy'
    },
    {
      icon: '🌍',
      title: 'Global Currency Support',
      description: 'Works with multiple currencies worldwide',
      detail: 'INR, USD, EUR, GBP, and 20+ more currencies'
    },
    {
      icon: '📱',
      title: 'Works Everywhere',
      description: 'Fully responsive on all devices',
      detail: 'Desktop, tablet, and mobile optimized'
    }
  ];

  const blogPosts = [
    {
      title: 'How AI Can Reduce Your Monthly Spending by 20%',
      excerpt: 'Discover proven strategies to cut costs using AI-powered budgeting',
      path: '/learning/blog/create-monthly-budget-ai',
      date: 'December 2025'
    }
  ];

  return (
    <>
      <SEO 
        title="VegaKash.AI - Plan Anything in Seconds with AI | Smart Calculators & Planners"
        description="Intelligent platform offering AI-powered financial and lifestyle planners. From monthly budgeting to event planning and travel costs. Plan better, save more."
        keywords="ai budget planner, financial planning tools, budget calculator, travel planner, event planner, savings calculator, loan calculator, smart planning"
        canonical="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "VegaKash.AI",
          "url": "https://vegaktools.com",
          "description": "AI-powered financial and lifestyle planning tools",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://vegaktools.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />

      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-icon">🎉</span>
          <span className="announcement-text">
            <strong>New!</strong> AI Travel Budget Planner is now live — Try it free!
          </span>
          <Link to="/travel-budget" className="announcement-link">
            Explore Now →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Plan Anything in Seconds with <span className="gradient-text">AI</span>
            </h1>
            <p className="hero-supporting">
              Plan smarter with AI-driven financial tools designed for everyone.
            </p>
            <p className="hero-subtitle">
              Smart calculators and planners for budgeting, travel, events, savings, loans, and more.
            </p>
            
            {/* Social Proof */}
            <div className="social-proof">
              <div className="trust-badge">
                <span className="trust-icon">✓</span>
                <span className="trust-text">Trusted by 10,000+ planners</span>
              </div>
            </div>
            
            <div className="hero-buttons">
              <Link to="/budget-planner" className="btn-primary-hero">
                🚀 Start Planning Now
              </Link>
              <Link to="/calculators" className="btn-secondary-hero">
                Explore AI Tools
              </Link>
            </div>
            
            {/* Scroll Indicator */}
            <div className="scroll-indicator">
              <span className="scroll-text">See how it works</span>
              <div className="scroll-arrow">↓</div>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-circle pulse"></div>
            <div className="illustration-icon">🎯</div>
          </div>
        </div>
      </section>

      {/* What is VegaKash.AI */}
      <section className="section-brand">
        <div className="container">
          <h2 className="section-title">What is VegaKash.AI?</h2>
          <p className="brand-description">
            <strong>VegaKash.AI</strong> is an intelligent platform offering AI-powered financial and lifestyle planners. 
            From monthly budgeting to event planning and travel costs, our tools help users plan better, save more, 
            and make informed decisions—instantly.
          </p>
          
          {/* Key Features */}
          <div className="brand-features">
            <div className="brand-feature">
              <span className="feature-check">✔</span>
              <span className="feature-text">AI-powered planning</span>
            </div>
            <div className="brand-feature">
              <span className="feature-check">✔</span>
              <span className="feature-text">No login required</span>
            </div>
            <div className="brand-feature">
              <span className="feature-check">✔</span>
              <span className="feature-text">Free & privacy-first</span>
            </div>
            <div className="brand-feature">
              <span className="feature-check">✔</span>
              <span className="feature-text">Super-fast calculations</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section-how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Four simple steps to smarter planning</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3 className="step-title">Enter Your Details</h3>
              <p className="step-description">Fill in your financial information or planning requirements</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🤖</div>
              <h3 className="step-title">AI Analyzes Instantly</h3>
              <p className="step-description">Our AI processes your data in real-time</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">📊</div>
              <h3 className="step-title">Get Personalized Plan</h3>
              <p className="step-description">Receive intelligent recommendations tailored for you</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">💾</div>
              <h3 className="step-title">Download or Share</h3>
              <p className="step-description">Export as PDF or share with family</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured AI Planners */}
      <section className="section-planners">
        <div className="container">
          <h2 className="section-title">Featured AI Planners</h2>
          <p className="section-subtitle">Intelligent planning tools powered by artificial intelligence</p>
          
          <div className="planner-grid">
            {featuredPlanners.map((planner, index) => (
              <div key={index} className={`planner-card ${planner.featured ? 'planner-featured' : ''}`}>
                {planner.badge && (
                  <span className={`badge ${
                    planner.badge === 'Most Popular' ? 'badge-popular' : 
                    planner.badge === 'New' ? 'badge-new' : 
                    'badge-coming'
                  }`}>
                    {planner.badge}
                  </span>
                )}
                <div className="planner-icon">{planner.icon}</div>
                <h3 className="planner-title">{planner.title}</h3>
                <p className="planner-tagline">{planner.tagline}</p>
                <p className="planner-description">{planner.description}</p>
                {planner.badge === 'Coming Soon' ? (
                  <button className="btn-notify">
                    🔔 Notify Me
                  </button>
                ) : (
                  <Link to={planner.path} className="btn-planner">
                    Open Planner →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VegaKash.AI */}
      <section className="section-value">
        <div className="container">
          <h2 className="section-title">Why VegaKash.AI?</h2>
          <p className="section-subtitle">Everything you need for intelligent financial planning</p>
          <div className="value-grid">
            {valueProps.map((prop, index) => (
              <div key={index} className="value-card">
                <div className="value-icon-wrapper">
                  <div className="value-icon">{prop.icon}</div>
                </div>
                <h3 className="value-title">{prop.title}</h3>
                <p className="value-description">{prop.description}</p>
                <p className="value-detail">{prop.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Calculators */}
      <section className="section-calculators">
        <div className="container">
          <h2 className="section-title">Popular Calculators</h2>
          <p className="section-subtitle">Quick and accurate financial calculations</p>
          
          <div className="calculator-grid">
            {popularCalculators.map((calc, index) => (
              <Link key={index} to={calc.path} className="calculator-card">
                <div className="calculator-icon">{calc.icon}</div>
                <h3 className="calculator-title">{calc.title}</h3>
              </Link>
            ))}
          </div>
          
          <div className="section-cta">
            <Link to="/calculators" className="btn-secondary">
              View All Calculators →
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Highlights */}
      <section className="section-blog">
        <div className="container">
          <h2 className="section-title">Financial Wisdom</h2>
          <p className="section-subtitle">Learn from our expert guides and articles</p>
          
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <Link key={index} to={post.path} className="blog-card">
                <span className="blog-date">{post.date}</span>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <span className="blog-link">Read More →</span>
              </Link>
            ))}
          </div>
          
          <div className="section-cta">
            <Link to="/learning/blog" className="btn-secondary">
              Explore All Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about VegaKash.AI</p>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">Is VegaKash.AI completely free?</h3>
              <p className="faq-answer">
                Yes! All our AI planners and calculators are 100% free to use. No hidden charges, 
                no premium tiers, no registration required.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">How does AI planning work?</h3>
              <p className="faq-answer">
                Our AI analyzes your financial data using advanced algorithms to provide personalized 
                recommendations, identify spending patterns, and suggest optimization strategies.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Is my data safe and private?</h3>
              <p className="faq-answer">
                Absolutely! We follow a privacy-first approach. Your data is processed locally in your 
                browser and never stored on our servers. No tracking, no data collection.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">What makes VegaKash.AI different?</h3>
              <p className="faq-answer">
                We combine AI intelligence with simplicity. No complex interfaces, no registration 
                hassles, instant results, and completely free—designed for everyone.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Which countries and currencies are supported?</h3>
              <p className="faq-answer">
                We support 20+ currencies including INR, USD, EUR, GBP, AUD, CAD, AED, and more. 
                Our tools work globally with country-specific calculations.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Can I save or export my plans?</h3>
              <p className="faq-answer">
                Yes! You can download your plans as PDF, export data to Excel, or share directly 
                via WhatsApp and other platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-cta-final">
        <div className="container">
          <h2 className="cta-title">Ready to Take Control of Your Finances?</h2>
          <p className="cta-subtitle">Start planning smarter with AI-powered tools — Free, Fast, and Private</p>
          <Link to="/budget-planner" className="btn-primary-large">
            🚀 Start Your Budget Plan Now
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
