import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import ScrollToTop from '../../modules/core/ui/ScrollToTop';
import '../../styles/Blog.css';

/**
 * Blog Index Page - Lists all blog articles
 */
function BlogIndex() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Blog', path: null }
  ];
  // Blog posts data - will expand as we add more articles
  const blogPosts = [
    {
      slug: '/learning/blog/financial-calculators-explained',
      title: 'Financial Calculators Explained: FD, RD, SIP & EMI',
      excerpt: 'Understand why FD, RD, SIP, and EMI calculators matter, how they work, and when to use each. Plan smarter with data-driven financial tools.',
      category: 'Personal Finance',
      date: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      readTime: '6 min read',
      tags: ['FD', 'RD', 'SIP', 'EMI', 'Financial Calculators'],
      featured: false
    },
    {
      slug: '/learning/blog/future-of-travel-2026-ai-trip-planning',
      title: 'Future of Travel 2026: How AI Will Redefine Trip Planning Forever',
      excerpt: 'Discover how AI is transforming travel with smart planning, predictive budgeting, real-time updates, and personalized itineraries. Experience the future of travel in 2026.',
      category: 'Travel & AI',
      date: 'December 2025',
      readTime: '8 min read',
      tags: ['AI Travel', 'Trip Planning', 'Travel Tech', '2026 Trends', 'Budget Planning'],
      featured: false
    },
    {
      slug: '/learning/blog/create-monthly-budget-ai',
      title: 'How to Create a Monthly Budget Using AI (Global 2025 Guide)',
      excerpt: 'Learn how to create a monthly budget using AI. A global budgeting guide for the US, UK, India, Canada, and Australia with smart AI budgeting tips and tools.',
      category: 'Personal Finance',
      date: 'December 2025',
      readTime: '5 min read',
      tags: ['AI Budgeting', 'Monthly Budget', 'Personal Finance', '50-30-20 Rule'],
      featured: true
    }
    // Add more blog posts here as they're created
  ];

  return (
    <>
      <ScrollToTop threshold={300} />
      <SEO 
        title="Financial Blog & Learning Articles | VegaKash.AI"
        description="Learn about personal finance, budgeting, investing, and money management. Expert articles on AI budgeting, financial calculators, and smart money strategies."
        keywords="personal finance blog, budgeting articles, money management tips, AI budgeting guide, financial planning, investment tips"
        canonical="/learning/blog"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "VegaKash.AI Financial Blog",
              "description": "Expert articles on personal finance, budgeting, investing, and money management",
              "url": "https://vegaktools.com/learning/blog"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Learning Blog", "item": "https://vegaktools.com/learning/blog" }
              ]
            }
          ]
        }}
      />
      
      <div className="blog-index">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="blog-index-header">
          <h1>Financial Learning Blog</h1>
          <p className="blog-index-subtitle">
            Expert articles on personal finance, budgeting, investing, and smart money management using AI tools
          </p>
        </div>

        {/* Featured Post Section */}
        {blogPosts.filter(post => post.featured).length > 0 && (
          <section className="featured-posts">
            <h2 className="section-title">Featured Article</h2>
            <div className="featured-grid">
              {blogPosts
                .filter(post => post.featured)
                .map((post, index) => (
                  <Link to={post.slug} key={index} className="featured-card">
                    <div className="featured-badge">⭐ Featured</div>
                    <div className="featured-meta">
                      <span className="featured-category">{post.category}</span>
                      <span className="featured-date">{post.date}</span>
                      <span className="featured-read-time">{post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p className="featured-excerpt">{post.excerpt}</p>
                    <div className="featured-tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="featured-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="read-more">
                      Read Full Article →
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section className="all-posts">
          <h2 className="section-title">All Articles</h2>
          <div className="posts-grid">
            {blogPosts.map((post, index) => (
              <Link to={post.slug} key={index} className="post-card">
                <div className="post-meta">
                  <span className="post-category">{post.category}</span>
                  <span className="post-date">{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-footer">
                  <span className="post-read-time">⏱️ {post.readTime}</span>
                  <span className="post-link">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="blog-categories">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">💰</div>
              <h3>Personal Finance</h3>
                <p>Money management and budgeting tips</p>
                <span className="category-count">2 articles</span>
            </div>
            <div className="category-card coming-soon">
              <div className="category-icon">📈</div>
              <h3>Investing</h3>
              <p>Investment strategies and tips</p>
              <span className="category-count">Coming Soon</span>
            </div>
            <div className="category-card coming-soon">
              <div className="category-icon">🏦</div>
              <h3>Banking</h3>
              <p>Loans, EMI, and banking guides</p>
              <span className="category-count">Coming Soon</span>
            </div>
            <div className="category-card coming-soon">
              <div className="category-icon">🤖</div>
              <h3>AI Tools</h3>
              <p>How to use AI for financial planning</p>
              <span className="category-count">Coming Soon</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="blog-cta">
          <div className="cta-content">
            <h2>Try Our AI Budget Planner</h2>
            <p>Put your learning into action with our intelligent budget planning tool</p>
            <Link to="/" className="cta-button primary">
              Start Planning →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default BlogIndex;
