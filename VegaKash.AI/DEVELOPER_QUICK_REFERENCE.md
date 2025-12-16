/**
 * VegaKash.AI - Quick Reference Guide
 * Fast lookup for developers working on the codebase
 */

# VegaKash.AI Developer Quick Reference

## 🚀 Project Overview

**Project**: VegaKash.AI - Smart Financial Planning Tools
**Type**: Full-stack React + FastAPI application
**Purpose**: AI-powered budget planners and financial calculators
**Status**: Production-ready with 75% optimization complete

**Core Modules**:
- 🤖 AI Planners (Budget, Travel)
- 🧮 13 Global Calculators (Loans, Investments, Savings)
- 💬 Private Feedback System
- 📱 Responsive Mobile Design

---

## 📁 Project Structure

```
VegaKash.AI/
├── frontend/                          # React + Vite
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.jsx           # Main navigation (UPDATED: categories)
│   │   │   ├── EnhancedSEO.jsx      # SEO with schemas (UPDATED: FAQ, GEO)
│   │   │   ├── AEOContentSection.jsx # NEW: Answer engine optimization
│   │   │   ├── FloatingFeedbackButton.jsx
│   │   │   ├── FeedbackModal.jsx
│   │   │   └── SEO.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Homepage with SEO content
│   │   │   ├── calculators/
│   │   │   │   └── global/
│   │   │   │       ├── MortgageCalculatorUS.jsx (UPDATED: AEO section)
│   │   │   │       ├── LoanPaymentCalculatorUS.jsx
│   │   │   │       ├── CreditCardPayoffCalculatorUS.jsx
│   │   │   │       ├── Retirement401kCalculatorUS.jsx
│   │   │   │       ├── SavingsGrowthCalculatorUS.jsx
│   │   │   │       ├── VATCalculatorUK.jsx
│   │   │   │       ├── MortgageAffordabilityCalculatorUK.jsx
│   │   │   │       ├── SavingsInterestCalculatorUK.jsx
│   │   │   │       ├── EMICalculator.jsx
│   │   │   │       ├── SIPCalculator.jsx
│   │   │   │       ├── FDCalculator.jsx
│   │   │   │       ├── RDCalculator.jsx
│   │   │   │       └── AutoLoanCalculator.jsx
│   │   │   ├── FeedbackPage.jsx
│   │   │   └── ...more pages
│   │   ├── router/
│   │   │   └── routes.jsx            # UPDATED: 13 calculators with improved titles
│   │   ├── styles/
│   │   │   ├── Navbar.css           # UPDATED: dropdown header styling
│   │   │   ├── Calculator.css       # Calculator page styling
│   │   │   ├── AEOContent.css       # NEW: AEO section styling
│   │   │   ├── HomeEnhanced.css
│   │   │   └── ...more styles
│   │   ├── utils/
│   │   │   ├── seoOptimization.js   # NEW: SEO/GEO/AEO utilities
│   │   │   ├── feedbackService.js
│   │   │   └── countryRouting.js
│   │   └── services/
│   │       └── feedbackService.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                          # FastAPI
│   ├── main.py
│   ├── routes/
│   │   ├── feedback.py              # Feedback API with email
│   │   └── ...more routes
│   └── requirements.txt
│
├── PRODUCTION_CHECKLIST.md          # UPDATED: 200+ item checklist
├── PRODUCTION_OPTIMIZATION_SUMMARY.md # NEW: Complete summary
└── README.md
```

---

## 🔧 Key Files Modified (Recent Changes)

### 1. Frontend Router (routes.jsx)
**Status**: ✅ Updated with SEO-optimized titles
**Lines Modified**: 140-300
**Changes**: 13 calculator routes with improved names and descriptions

Example:
```javascript
// Before
title: 'Mortgage Calculator',
description: 'Calculate US mortgage monthly payment, total interest, and amortization.'

// After
title: 'US Mortgage Calculator – Monthly Payment & Amortization Breakdown',
description: 'Calculate US mortgage monthly payment, total interest, and complete amortization schedule with down payment analysis.'
```

### 2. Navigation Component (Navbar.jsx)
**Status**: ✅ Updated with category organization
**Changes**: Reorganized calculator dropdown into 3 categories
- 💳 Loans & Mortgages (5 tools)
- 📈 Investments & Savings (6 tools)
- 🛠️ Specialty Tools (2 tools)

### 3. SEO Component (EnhancedSEO.jsx)
**Status**: ✅ Enhanced with schema markup
**New Imports**:
```javascript
import { 
  generateFAQSchema, 
  generateBreadcrumbSchema, 
  generateGEOMetaTags 
} from '../utils/seoOptimization';
```
**New Features**: FAQ, Breadcrumb, and GEO schemas now injected

### 4. New Files Created

#### seoOptimization.js (380 lines)
**Purpose**: Centralized SEO/GEO/AEO utilities
**Exports**:
- `generateFAQSchema(tool, country)` - FAQ page schema
- `generateBreadcrumbSchema(tool, country)` - Navigation breadcrumbs
- `getAEOQuestions(tool)` - Answer engine questions
- `getRelatedTools(tool)` - Cross-calculator recommendations
- `generateGEOMetaTags(country)` - Geographic metadata

#### AEOContentSection.jsx (Component)
**Purpose**: Interactive FAQ section for pages
**Features**:
- Expandable Q&A items
- Related tools grid
- Key facts section
- Disclaimer messaging
- Mobile-responsive
- Accessibility-compliant

#### AEOContent.css (Styling)
**Purpose**: Professional styling for AEO sections
**Features**:
- Expandable FAQ styling
- Responsive grid layouts
- Mobile breakpoints
- Print-friendly styles

---

## 🔗 Key Connections & Data Flow

### SEO Data Flow
```
routes.jsx (calculator definitions)
    ↓
pages/calculators/[Tool].jsx
    ↓
EnhancedSEO (generates schemas)
    ↓
<Helmet> (injects meta tags)
    ↓
HTML head (appears in page source)
```

### AEO Content Flow
```
MortgageCalculatorUS.jsx
    ↓
<AEOContentSection tool="mortgage" country={country} />
    ↓
getAEOQuestions("mortgage") → Array of 4+ questions
    ↓
Render expandable FAQ + related tools + key facts
```

### Navigation Flow
```
Navbar.jsx
    ↓
calculators dropdown (3 categories)
    ↓
💳 Loans & Mortgages (5 items)
📈 Investments & Savings (6 items)
🛠️ Specialty Tools (2 items)
```

---

## 📊 Calculator Inventory

### By Country/Type

**Global Shortcuts** (6):
- Mortgage
- Loan
- EMI
- SIP
- FD
- RD
- Savings

**US-Specific** (5):
- Mortgage Calculator
- Loan Payment Calculator
- Credit Card Payoff Calculator
- 401(k) Retirement Calculator
- Savings Growth Calculator

**UK-Specific** (3):
- VAT Calculator
- Mortgage Affordability Calculator
- Savings Interest Calculator

**Auto** (1):
- Auto Loan Calculator (Global)

---

## 🛠️ Development Commands

```bash
# Frontend
cd frontend
npm install                 # Install dependencies
npm run dev                # Start development server (port 3000/3001)
npm run build              # Production build
npm run preview            # Test production build

# Backend
cd ../backend
pip install -r requirements.txt
python -m uvicorn main:app --reload  # Development (port 8000)
python main.py                       # Production

# Testing
npm run lint               # Lint check
npm audit                  # Security audit
npm test                   # Run tests (if configured)
```

---

## 🌐 URL Patterns

### Global Calculators
```
/calculators/mortgage
/calculators/loan
/calculators/emi
/calculators/sip
/calculators/fd
/calculators/rd
/calculators/savings
/calculators/autoloan
```

### US Calculators
```
/us/calculators/mortgage
/us/calculators/loan
/us/calculators/credit-card
/us/calculators/401k
/us/calculators/savings
```

### UK Calculators
```
/uk/calculators/vat
/uk/calculators/mortgage
/uk/calculators/savings
```

### India Calculators
```
/in/calculators/emi
/in/calculators/sip
/in/calculators/fd
/in/calculators/rd
```

---

## 🎨 Color Scheme

### Primary Gradient
```css
#667eea (purple-blue) → #764ba2 (violet)
Linear gradient for prominent elements
Used in: Logo, buttons, active states
```

### Accent Colors
```css
Announcement Bar: #FF6B6B → #FF8E53 → #FE6B8B (coral-pink)
Feedback Button: #11998e → #38ef7d (teal-green)
Success/Positive: #10b981 (emerald)
```

### Neutral Palette
```css
Background: #ffffff (white)
Text: #1a202c (dark gray)
Borders: #e9ecef (light gray)
Hover: #f8f9fa (subtle gray)
```

---

## 📈 Schema Markup Types

### 1. Calculator Schema
```json
{
  "@type": "Calculator",
  "applicationCategory": "FinanceApplication",
  "offers": {"price": "0"}
}
```

### 2. FAQ Schema
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": {"@type": "Answer", "text": "..."}
    }
  ]
}
```

### 3. Breadcrumb Schema
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"position": 1, "name": "Home", "item": "..."},
    {"position": 2, "name": "Calculators", "item": "..."},
    {"position": 3, "name": "Mortgage", "item": "..."}
  ]
}
```

---

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_DOMAIN=vegakash.ai
VITE_ANALYTICS_ID=your_analytics_id
```

### Backend (.env)
```
OPENAI_API_KEY=your_key
GMAIL_EMAIL=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
DATABASE_URL=your_db_url
CORS_ORIGIN=http://localhost:3000,https://vegakash.ai
```

---

## 🧪 Testing Checklist

### Before Any Deployment
- [ ] SEO validation (Structured Data Testing Tool)
- [ ] Lighthouse audit (90+ all scores)
- [ ] Mobile responsiveness (5+ devices)
- [ ] Calculator accuracy (all 13 tools)
- [ ] Feedback system (email delivery)

### Browser Compatibility
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile Safari & Chrome

### Accessibility
- [ ] Keyboard navigation (Tab through all)
- [ ] Screen reader (NVDA/JAWS)
- [ ] Color contrast (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] Alt text on all images

---

## 📚 Useful Resources

### Documentation
- `PRODUCTION_CHECKLIST.md` - 200+ item deployment checklist
- `PRODUCTION_OPTIMIZATION_SUMMARY.md` - Complete implementation summary

### Tools & Services
- **SEO Testing**: https://search.google.com/test/rich-results
- **Mobile Check**: https://search.google.com/test/mobile-friendly
- **Lighthouse**: Chrome DevTools → Lighthouse tab
- **Accessibility**: axe DevTools browser extension
- **Schema Validator**: https://schema.org/Tool

### API Endpoints
```
POST /api/feedback           # Submit feedback
GET  /api/calculators        # Get calculator list
POST /api/calculate          # Execute calculation
GET  /api/health             # Health check
```

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found" error
**Solution**: 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
**Solution**: 
```bash
npm run dev -- --port 3001
```

### Issue: CORS error when calling backend
**Check**: 
1. Backend CORS_ORIGIN in .env
2. Vite API URL in frontend .env
3. Backend running on correct port

### Issue: Styles not applying
**Solution**: 
```bash
# Clear Vite cache
rm -rf .vite/

# Restart dev server
npm run dev
```

---

## ✅ Quality Metrics

```
Code Coverage:              Ready to test
Performance Score:          Ready to measure (target 90+)
SEO Score:                  Ready to measure (target 95+)
Accessibility Score:        Ready to measure (target 95+)
Bundle Size:                < 500KB (gzipped, target)
Mobile Score:               Ready to test (target 95+)
```

---

## 🚀 Deployment Steps

```bash
# 1. Build production bundle
npm run build

# 2. Test build locally
npm run preview

# 3. Run final checks
npm audit                   # Security
npm run lint               # Code quality (if configured)

# 4. Deploy
git add .
git commit -m "Production: Complete optimization (Task 1-6)"
git push production main

# 5. Verify deployment
# Check logs, run basic smoke tests
tail -f logs/app.log
```

---

## 📞 Support & Contact

**For Questions**:
- Documentation: See PRODUCTION_CHECKLIST.md
- Code: Check inline comments in affected files
- Issues: Review error logs in browser console

**Key Contacts**:
- Frontend Lead: [Your Name]
- Backend Lead: [Your Name]
- DevOps: [Your Name]

---

**Quick Reference Version**: 1.0
**Last Updated**: 2024
**Status**: ✅ Production Ready (Phase 1-3 Complete)
**Next Phase**: Testing & Validation (Phase 4)
