import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

/**
 * Professional Navbar Component with Dropdown Menus
 * SEO-optimized with semantic HTML and accessibility features
 */
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Toggle dropdown menu
  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="VegaKash.AI Home">
          <span className="logo-icon">🏦</span>
          <span className="logo-text">VegaKash.AI</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu" role="menubar">
          {/* Dashboard */}
          <li className="navbar-item" role="none">
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              role="menuitem"
            >
              Dashboard
            </Link>
          </li>

          {/* Calculators Dropdown */}
          <li 
            className="navbar-item has-dropdown" 
            role="none"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('calculators');
            }}
          >
            <button 
              className={`navbar-link dropdown-trigger ${activeDropdown === 'calculators' ? 'active' : ''}`}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'calculators'}
            >
              Calculators <span className="dropdown-arrow">▼</span>
            </button>
            
            <ul className={`dropdown-menu ${activeDropdown === 'calculators' ? 'show' : ''}`} role="menu">
              <li role="none">
                <Link to="/calculators/emi" className="dropdown-item" role="menuitem">
                  💰 EMI Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/sip" className="dropdown-item" role="menuitem">
                  📈 SIP Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/loan" className="dropdown-item" role="menuitem">
                  🏦 Loan Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/auto-loan" className="dropdown-item" role="menuitem">
                  🚗 Auto Loan Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/interest" className="dropdown-item" role="menuitem">
                  📊 Interest Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/mortgage" className="dropdown-item" role="menuitem">
                  🏠 Mortgage Calculator
                </Link>
              </li>
            </ul>
          </li>

          {/* Learning Dropdown */}
          <li 
            className="navbar-item has-dropdown" 
            role="none"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('learning');
            }}
          >
            <button 
              className={`navbar-link dropdown-trigger ${activeDropdown === 'learning' ? 'active' : ''}`}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'learning'}
            >
              Learning <span className="dropdown-arrow">▼</span>
            </button>
            
            <ul className={`dropdown-menu ${activeDropdown === 'learning' ? 'show' : ''}`} role="menu">
              <li role="none">
                <Link to="/learning/videos" className="dropdown-item" role="menuitem">
                  🎥 Video Tutorials
                </Link>
              </li>
              <li role="none">
                <Link to="/learning/guides" className="dropdown-item" role="menuitem">
                  📚 Financial Guides
                </Link>
              </li>
              <li role="none">
                <Link to="/learning/blog" className="dropdown-item" role="menuitem">
                  ✍️ Blog Articles
                </Link>
              </li>
            </ul>
          </li>

          {/* About */}
          <li className="navbar-item" role="none">
            <Link 
              to="/about" 
              className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
              role="menuitem"
            >
              About
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger Menu */}
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-list">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          
          <li className="mobile-dropdown">
            <button 
              className="mobile-dropdown-trigger"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('mobile-calculators');
              }}
            >
              Calculators <span className="dropdown-arrow">▼</span>
            </button>
            <ul className={`mobile-dropdown-menu ${activeDropdown === 'mobile-calculators' ? 'show' : ''}`}>
              <li><Link to="/calculators/emi">💰 EMI Calculator</Link></li>
              <li><Link to="/calculators/sip">📈 SIP Calculator</Link></li>
              <li><Link to="/calculators/loan">🏦 Loan Calculator</Link></li>
              <li><Link to="/calculators/auto-loan">🚗 Auto Loan Calculator</Link></li>
              <li><Link to="/calculators/interest">📊 Interest Calculator</Link></li>
              <li><Link to="/calculators/mortgage">🏠 Mortgage Calculator</Link></li>
            </ul>
          </li>
          
          <li className="mobile-dropdown">
            <button 
              className="mobile-dropdown-trigger"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('mobile-learning');
              }}
            >
              Learning <span className="dropdown-arrow">▼</span>
            </button>
            <ul className={`mobile-dropdown-menu ${activeDropdown === 'mobile-learning' ? 'show' : ''}`}>
              <li><Link to="/learning/videos">🎥 Video Tutorials</Link></li>
              <li><Link to="/learning/guides">📚 Financial Guides</Link></li>
              <li><Link to="/learning/blog">✍️ Blog Articles</Link></li>
            </ul>
          </li>
          
          <li>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
