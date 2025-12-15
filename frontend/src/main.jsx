import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './AppRouter.jsx'
import './styles/index.css'
import './styles/SEOContent.css'

// Pre-load module styles to prevent FOUC (Flash of Unstyled Content) on refresh
import './modules/planners/travel/travel-styles.css'
import './styles/Blog.css'

// Performance monitoring and optimization
import { reportWebVitals, logPerformanceMetrics, addResourceHints } from './utils/performance'

// Google Analytics - only in production
import { initGA } from './components/GoogleAnalytics'

// Add resource hints for faster loading
addResourceHints()

// Initialize Google Analytics in production
if (import.meta.env.PROD) {
  initGA()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)

// Track Core Web Vitals (LCP, FID, CLS)
reportWebVitals(logPerformanceMetrics)
