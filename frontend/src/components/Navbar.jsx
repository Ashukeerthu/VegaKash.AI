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

  // Close mobile menu and dropdowns when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside (but not on links)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown) {
        // Don't close if clicking on a link or navigation element
        if (e.target.closest('a, .navbar-link, .dropdown-item')) {
          return;
        }
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
          {/* AI Planners Dropdown */}
          <li 
            className="navbar-item has-dropdown" 
            role="none"
          >
            <button 
              className={`navbar-link dropdown-trigger ${activeDropdown === 'planners' ? 'active' : ''}`}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'planners'}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('planners');
              }}
            >
              🤖 AI Planners <span className="dropdown-arrow">▼</span>
            </button>
            
            <ul className={`dropdown-menu ${activeDropdown === 'planners' ? 'show' : ''}`} role="menu">
              <li role="none">
                <Link to="/budget-planner" className="dropdown-item" role="menuitem">
                  💰 AI Monthly Budget Planner
                </Link>
              </li>
              <li role="none">
                <Link to="/travel-budget" className="dropdown-item" role="menuitem">
                  ✈️ AI Travel Budget Planner
                </Link>
              </li>
            </ul>
          </li>

          {/* Calculators Dropdown */}
          <li 
            className="navbar-item has-dropdown" 
            role="none"
          >
            <button 
              className={`navbar-link dropdown-trigger ${activeDropdown === 'calculators' ? 'active' : ''}`}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'calculators'}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('calculators');
              }}
            >
              Calculators <span className="dropdown-arrow">▼</span>
            </button>
            
            <ul className={`dropdown-menu ${activeDropdown === 'calculators' ? 'show' : ''}`} role="menu">
              <li role="none">
                <Link to="/calculators" className="dropdown-item featured" role="menuitem">
                  🧮 All Calculators Hub
                </Link>
              </li>
              <li className="dropdown-divider"></li>

              {/* Loan & Mortgage Category */}
              <li className="dropdown-header">💳 Loans & Mortgages</li>
              <li role="none">
                <Link to="/calculators/mortgage" className="dropdown-item" role="menuitem">
                  💰 Mortgage Calculator (US)
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/loan" className="dropdown-item" role="menuitem">
                  📊 Loan Payment Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/emi" className="dropdown-item" role="menuitem">
                  🏠 EMI Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/us/calculators/credit-card" className="dropdown-item" role="menuitem">
                  💳 Credit Card Payoff (US)
                </Link>
              </li>
              <li role="none">
                <Link to="/uk/calculators/mortgage" className="dropdown-item" role="menuitem">
                  🏡 Mortgage Affordability (UK)
                </Link>
              </li>

              {/* Investments & Savings Category */}
              <li className="dropdown-header">📈 Investments & Savings</li>
              <li role="none">
                <Link to="/calculators/savings" className="dropdown-item" role="menuitem">
                  💰 Savings Growth Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/sip" className="dropdown-item" role="menuitem">
                  📊 SIP Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/fd" className="dropdown-item" role="menuitem">
                  🏦 FD Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/rd" className="dropdown-item" role="menuitem">
                  📅 RD Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/us/calculators/401k" className="dropdown-item" role="menuitem">
                  📈 401(k) Retirement (US)
                </Link>
              </li>
              <li role="none">
                <Link to="/uk/calculators/savings" className="dropdown-item" role="menuitem">
                  💷 Savings Interest (UK)
                </Link>
              </li>

              {/* Specialty Tools Category */}
              <li className="dropdown-header">🛠️ Specialty Tools</li>
              <li role="none">
                <Link to="/calculators/autoloan" className="dropdown-item" role="menuitem">
                  🚗 Auto Loan Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/uk/calculators/vat" className="dropdown-item" role="menuitem">
                  🧾 VAT Calculator (UK)
                </Link>
              </li>
            </ul>
          </li>

          {/* Learning Dropdown */}
          <li 
            className="navbar-item has-dropdown" 
            role="none"
          >
            <button 
              className={`navbar-link dropdown-trigger ${activeDropdown === 'learning' ? 'active' : ''}`}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'learning'}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('learning');
              }}
            >
              Learning <span className="dropdown-arrow">▼</span>
            </button>
            
            <ul className={`dropdown-menu ${activeDropdown === 'learning' ? 'show' : ''}`} role="menu">
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
          <li className="mobile-dropdown">
            <button 
              className="mobile-dropdown-trigger"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('mobile-planners');
              }}
            >
              🤖 AI Planners <span className="dropdown-arrow">▼</span>
            </button>
            <ul className={`mobile-dropdown-menu ${activeDropdown === 'mobile-planners' ? 'show' : ''}`}>
              <li><Link to="/budget-planner" onClick={handleLinkClick}>💰 AI Monthly Budget Planner</Link></li>
              <li><Link to="/travel-budget" onClick={handleLinkClick}>✈️ AI Travel Budget Planner</Link></li>
            </ul>
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
              <li><Link to="/calculators" onClick={handleLinkClick}>🧮 All Calculators Hub</Link></li>
              <li className="dropdown-divider"></li>
              
              <li className="dropdown-header">💳 Loans & Mortgages</li>
              <li><Link to="/calculators/mortgage" onClick={handleLinkClick}>💰 Mortgage Calculator</Link></li>
              <li><Link to="/calculators/loan" onClick={handleLinkClick}>📊 Loan Payment Calculator</Link></li>
              <li><Link to="/calculators/emi" onClick={handleLinkClick}>🏠 EMI Calculator</Link></li>
              <li><Link to="/us/calculators/credit-card" onClick={handleLinkClick}>💳 Credit Card Payoff (US)</Link></li>
              <li><Link to="/uk/calculators/mortgage" onClick={handleLinkClick}>🏡 Mortgage Affordability (UK)</Link></li>
              
              <li className="dropdown-divider" style={{marginTop: '0.5rem'}}></li>
              <li className="dropdown-header">📈 Investments & Savings</li>
              <li><Link to="/calculators/savings" onClick={handleLinkClick}>💰 Savings Growth Calculator</Link></li>
              <li><Link to="/calculators/sip" onClick={handleLinkClick}>📊 SIP Calculator</Link></li>
              <li><Link to="/calculators/fd" onClick={handleLinkClick}>🏦 FD Calculator</Link></li>
              <li><Link to="/calculators/rd" onClick={handleLinkClick}>📅 RD Calculator</Link></li>
              <li><Link to="/us/calculators/401k" onClick={handleLinkClick}>📈 401(k) Retirement (US)</Link></li>
              <li><Link to="/uk/calculators/savings" onClick={handleLinkClick}>💷 Savings Interest (UK)</Link></li>
              
              <li className="dropdown-divider" style={{marginTop: '0.5rem'}}></li>
              <li className="dropdown-header">🛠️ Specialty Tools</li>
              <li><Link to="/uk/calculators/vat" onClick={handleLinkClick}>🧾 VAT Calculator (UK)</Link></li>
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
              <li><Link to="/learning/blog" onClick={handleLinkClick}>✍️ Blog Articles</Link></li>
            </ul>
          </li>
          
          <li>
            <Link to="/about" onClick={handleLinkClick} className={isActive('/about') ? 'active' : ''}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
