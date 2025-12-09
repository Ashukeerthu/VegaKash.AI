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
              <li role="none">
                <Link to="/event-planner" className="dropdown-item" role="menuitem">
                  🎉 AI Event Planner
                </Link>
              </li>
              <li role="none">
                <Link to="/wedding-planner" className="dropdown-item" role="menuitem">
                  💒 AI Wedding Budget Planner
                </Link>
              </li>
              <li role="none">
                <Link to="/student-budget" className="dropdown-item" role="menuitem">
                  🎓 AI Student Budget Planner
                </Link>
              </li>
              <li role="none">
                <Link to="/savings-goal" className="dropdown-item" role="menuitem">
                  🎯 AI Savings Goal Planner
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
                  🧮 All Calculators
                </Link>
              </li>
              <li className="dropdown-divider"></li>
              <li role="none">
                <Link to="/calculators/emi" className="dropdown-item" role="menuitem">
                  🏠 EMI Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/sip" className="dropdown-item" role="menuitem">
                  📈 SIP Calculator
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
                <Link to="/calculators/emi" className="dropdown-item" role="menuitem">
                  🚗 Auto Loan Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/tax" className="dropdown-item" role="menuitem">
                  📊 Income Tax Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/savings-goal" className="dropdown-item" role="menuitem">
                  🎯 Savings Goal Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/calculators/emergency-fund" className="dropdown-item" role="menuitem">
                  🆘 Emergency Fund Calculator
                </Link>
              </li>
              <li className="dropdown-divider"></li>
              <li className="dropdown-header">🌍 Global Calculators</li>
              <li role="none">
                <Link to="/us/calculators/mortgage" className="dropdown-item" role="menuitem">
                  🇺🇸 US Mortgage Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/us/calculators/loan" className="dropdown-item" role="menuitem">
                  🇺🇸 US Loan Payment Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/us/calculators/credit-card" className="dropdown-item" role="menuitem">
                  🇺🇸 US Credit Card Payoff
                </Link>
              </li>
              <li role="none">
                <Link to="/us/calculators/401k" className="dropdown-item" role="menuitem">
                  🇺🇸 US 401(k) Retirement
                </Link>
              </li>
              <li role="none">
                <Link to="/us/calculators/savings" className="dropdown-item" role="menuitem">
                  🇺🇸 US Savings Growth
                </Link>
              </li>
              <li role="none">
                <Link to="/uk/calculators/vat" className="dropdown-item" role="menuitem">
                  🇬🇧 UK VAT Calculator
                </Link>
              </li>
              <li role="none">
                <Link to="/uk/calculators/mortgage" className="dropdown-item" role="menuitem">
                  🇬🇧 UK Mortgage Affordability
                </Link>
              </li>
              <li role="none">
                <Link to="/uk/calculators/savings" className="dropdown-item" role="menuitem">
                  🇬🇧 UK Savings Interest
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
              <li><Link to="/budget-planner">💰 AI Monthly Budget Planner</Link></li>
              <li><Link to="/travel-budget">✈️ AI Travel Budget Planner</Link></li>
              <li><Link to="/event-planner">🎉 AI Event Planner</Link></li>
              <li><Link to="/wedding-planner">💒 AI Wedding Budget Planner</Link></li>
              <li><Link to="/student-budget">🎓 AI Student Budget Planner</Link></li>
              <li><Link to="/savings-goal">🎯 AI Savings Goal Planner</Link></li>
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
              <li><Link to="/calculators">🧮 All Calculators</Link></li>
              <li><Link to="/calculators/emi">💰 EMI Calculator</Link></li>
              <li><Link to="/calculators/sip">📈 SIP Calculator</Link></li>
              <li><Link to="/calculators/fd">🏦 FD Calculator</Link></li>
              <li><Link to="/calculators/rd">💵 RD Calculator</Link></li>
              <li><Link to="/calculators/emi">🚗 Auto Loan Calculator</Link></li>
              <li><Link to="/calculators/tax">📊 Income Tax Calculator</Link></li>
              <li className="dropdown-divider"></li>
              <li className="dropdown-header">🌍 Global Calculators</li>
              <li><Link to="/us/calculators/mortgage">🇺🇸 US Mortgage Calculator</Link></li>
              <li><Link to="/us/calculators/loan">🇺🇸 US Loan Payment Calculator</Link></li>
              <li><Link to="/us/calculators/credit-card">🇺🇸 US Credit Card Payoff</Link></li>
              <li><Link to="/us/calculators/401k">🇺🇸 US 401(k) Retirement</Link></li>
              <li><Link to="/us/calculators/savings">🇺🇸 US Savings Growth</Link></li>
              <li><Link to="/uk/calculators/vat">🇬🇧 UK VAT Calculator</Link></li>
              <li><Link to="/uk/calculators/mortgage">🇬🇧 UK Mortgage Affordability</Link></li>
              <li><Link to="/uk/calculators/savings">🇬🇧 UK Savings Interest</Link></li>
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
