import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './AppRouter.jsx'
import './styles/index.css'

// Performance monitoring and optimization
import { reportWebVitals, logPerformanceMetrics, addResourceHints } from './utils/performance'

// Add resource hints for faster loading
addResourceHints()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)

// Track Core Web Vitals (LCP, FID, CLS)
reportWebVitals(logPerformanceMetrics)
