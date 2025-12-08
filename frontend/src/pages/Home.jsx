import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import '../styles/Home.css';

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
      path: '/budget-planner',
      badge: 'Most Popular'
    },
    {
      icon: '✈️',
      title: 'AI Travel Budget Planner',
      description: 'Plan your trip expenses with intelligent cost predictions',
      path: '/travel-budget',
      badge: 'Coming Soon'
    },
    {
      icon: '🎉',
      title: 'AI Event Planner',
      description: 'Budget and organize events with smart recommendations',
      path: '/event-planner',
      badge: 'Coming Soon'
    },
    {
      icon: '💍',
      title: 'AI Wedding Budget Planner',
      description: 'Plan your perfect wedding with AI cost optimization',
      path: '/wedding-planner',
      badge: 'Coming Soon'
    },
    {
      icon: '🎓',
      title: 'AI Student Budget Planner',
      description: 'Manage monthly allowance and study expenses smartly',
      path: '/student-planner',
      badge: 'Coming Soon'
    },
    {
      icon: '🎯',
      title: 'AI Savings Goal Planner',
      description: 'Achieve your financial goals with intelligent planning',
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
      description: 'Get intelligent recommendations based on your financial data'
    },
    {
      icon: '⚡',
      title: 'Instant Calculations',
      description: 'Real-time results with lightning-fast processing'
    },
    {
      icon: '📊',
      title: 'Smart Recommendations',
      description: 'Personalized advice to optimize your finances'
    },
    {
      icon: '🌍',
      title: 'All-in-One Planning Hub',
      description: 'Everything you need for financial planning in one place'
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

      {/* Hero Section */}
      <section className="hero-home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Plan Anything in Seconds with <span className="gradient-text">AI</span>
            </h1>
            <p className="hero-subtitle">
              Smart calculators and planners for budgeting, travel, events, savings, loans, and more.
            </p>
            <div className="hero-buttons">
              <Link to="/budget-planner" className="btn-primary">
                🤖 Start Budget Planning
              </Link>
              <Link to="/calculators" className="btn-secondary">
                🧮 Explore Financial Tools
              </Link>
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
            and make informed decisions—instantly. No registration required, privacy-first approach, and completely free.
          </p>
        </div>
      </section>

      {/* Featured AI Planners */}
      <section className="section-planners">
        <div className="container">
          <h2 className="section-title">Featured AI Planners</h2>
          <p className="section-subtitle">Intelligent planning tools powered by artificial intelligence</p>
          
          <div className="planner-grid">
            {featuredPlanners.map((planner, index) => (
              <div key={index} className="planner-card">
                {planner.badge && (
                  <span className={`badge ${planner.badge === 'Most Popular' ? 'badge-popular' : 'badge-coming'}`}>
                    {planner.badge}
                  </span>
                )}
                <div className="planner-icon">{planner.icon}</div>
                <h3 className="planner-title">{planner.title}</h3>
                <p className="planner-description">{planner.description}</p>
                {planner.badge === 'Coming Soon' ? (
                  <button className="btn-planner" disabled>Coming Soon</button>
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
          <div className="value-grid">
            {valueProps.map((prop, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{prop.icon}</div>
                <h3 className="value-title">{prop.title}</h3>
                <p className="value-description">{prop.description}</p>
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

      {/* CTA Section */}
      <section className="section-cta-final">
        <div className="container">
          <h2 className="cta-title">Ready to Take Control of Your Finances?</h2>
          <p className="cta-subtitle">Start planning smarter with AI-powered tools</p>
          <Link to="/budget-planner" className="btn-primary-large">
            Start Your Budget Plan Now
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
