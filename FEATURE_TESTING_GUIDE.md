# VegaKash.AI - Feature Testing Guide

## 🚀 Application Status

✅ **Backend Running**: http://localhost:8000  
✅ **Frontend Running**: http://localhost:3000  

---

## 🎯 New Features Implemented (Phase 2)

### 1. **Multi-Feature Dashboard** 📊
**Location**: Click "View Dashboard" button after generating summary

**Features to Test**:
- [ ] **4 Metric Cards**: Total Income, Total Expenses, Net Savings, Savings Rate
- [ ] **Expense Breakdown Chart** (Pie): Shows distribution across 9 categories
- [ ] **Savings Trend Chart** (Line): 12-month savings projection
- [ ] **Before/After Comparison** (Bar): Current vs optimized expenses
- [ ] **50-30-20 Rule Visualization**: Needs vs Wants vs Savings breakdown

**What to Look For**:
- Color-coded cards (green for positive, red for deficit)
- Interactive charts with hover tooltips
- Responsive design on mobile/tablet
- Smooth animations and transitions

---

### 2. **Smart Recommendations Engine** 💡
**Location**: Click "Get Smart Tips" button after generating summary

**Features to Test**:
- [ ] **Spending Alerts**: Overspending warnings (High/Medium/Low severity)
- [ ] **Personalized Recommendations**: 6 types of actionable tips
  - Subscription audit
  - Transportation optimization
  - Food expense reduction
  - Entertainment smart choices
  - Emergency fund building
  - Investment recommendations
- [ ] **Seasonal Reminders**: Month-specific financial tasks

**What to Look For**:
- Real-time alerts based on your expense data
- Potential savings amounts displayed
- Severity badges (color-coded)
- Relevant, actionable advice

---

### 3. **PDF Export with Branding** 📄
**Location**: Click "Download PDF" button after generating summary

**Current Status**: ⚠️ Requires GTK+ libraries on Windows

**Expected Behavior**:
- On systems **with GTK+**: Downloads professional PDF report
- On Windows **without GTK+**: Shows 503 error with installation instructions

**To Enable PDF Export on Windows**:
1. Visit: https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows
2. Install GTK+ for Windows
3. Restart the backend server

**What PDF Contains** (when available):
- VegaKash.AI branding and logo
- Summary metrics (Income, Expenses, Savings)
- Expense breakdown tables
- Active loan details
- AI-generated financial plan
- Actionable recommendations

---

### 4. **Multi-Loan Management** 🏦
**Backend Status**: ✅ Fully implemented  
**Frontend Status**: ⏳ Backend-ready, UI integration pending

**Available API Endpoints**:
```
POST /api/v1/compare-debt-strategies
Body: {
  "loans": [
    {"name": "Credit Card", "balance": 50000, "interest_rate": 18, "min_payment": 2000},
    {"name": "Personal Loan", "balance": 200000, "interest_rate": 12, "min_payment": 8000}
  ],
  "extra_monthly_payment": 5000
}
```

**Features**:
- Debt Snowball Strategy (pay smallest balance first)
- Debt Avalanche Strategy (pay highest interest first)
- Interest savings comparison
- Timeline to debt freedom
- Month-by-month payoff breakdown

**How to Test** (using API):
1. Open browser to: http://localhost:8000/docs
2. Try the `/api/v1/compare-debt-strategies` endpoint
3. Enter multiple loans with different balances/rates
4. Compare the two strategies

---

## 🧪 Testing Workflow

### Step 1: Basic Calculation
1. Navigate to http://localhost:3000
2. Fill in the financial form:
   - Enter monthly income (e.g., ₹80,000)
   - Fill all 9 expense categories
   - Add any active loans
3. Click **"Calculate Summary"**
4. Verify the summary card shows correct totals

### Step 2: Test Dashboard
1. After calculation, click **"View Dashboard"**
2. Verify all 4 metric cards display
3. Check that all 3 charts render correctly
4. Hover over chart elements to see tooltips
5. Scroll down to see 50-30-20 rule breakdown
6. Test on mobile (resize browser window)

### Step 3: Test Smart Recommendations
1. Click **"Get Smart Tips"**
2. Wait for recommendations to load
3. Review spending alerts (if any)
4. Check personalized recommendations
5. Note seasonal reminders for current month
6. Look for potential savings amounts

### Step 4: Test PDF Export (Optional)
1. Click **"Download PDF"**
2. **If GTK+ installed**: PDF downloads automatically
3. **If GTK+ not installed**: See 503 error with instructions
4. Open downloaded PDF to verify content

### Step 5: Test Responsiveness
1. Resize browser window (desktop → tablet → mobile)
2. Verify charts resize correctly
3. Check that cards stack properly on mobile
4. Test touch interactions on mobile devices

---

## 🔧 Troubleshooting

### Dashboard Not Showing
- Ensure you clicked "Calculate Summary" first
- Check browser console (F12) for errors
- Verify all expense fields are filled

### Charts Not Rendering
- Refresh the page (Ctrl+R)
- Clear browser cache
- Check if chart.js loaded in console

### Smart Recommendations Empty
- Need valid financial data with expenses
- Check backend logs for errors
- Verify API endpoint returns data (F12 → Network tab)

### PDF Export 503 Error
- **Expected on Windows without GTK+**
- This is not a bug - it's a missing system dependency
- Install GTK+ to enable PDF export (link in section 3)

### Backend Not Responding
- Check terminal: Backend should show "Application startup complete"
- Verify port 8000 is not in use
- Restart backend: `Ctrl+C` then re-run command

### Frontend Not Loading
- Check terminal: Should show "VITE ready"
- Verify port 3000 is available
- Clear node_modules cache: `npm install`

---

## 📊 Test Data Examples

### Example 1: High Earner with Good Savings
```
Income: ₹120,000
Housing: ₹30,000
Food: ₹15,000
Transport: ₹8,000
Entertainment: ₹10,000
Health: ₹5,000
Education: ₹12,000
Subscriptions: ₹2,000
Shopping: ₹8,000
Other: ₹5,000
Total Expenses: ₹95,000
Expected Savings: ₹25,000 (20.8% rate)
```

### Example 2: Overspending Scenario
```
Income: ₹50,000
Housing: ₹20,000
Food: ₹12,000
Transport: ₹8,000
Entertainment: ₹8,000
Health: ₹3,000
Education: ₹2,000
Subscriptions: ₹1,500
Shopping: ₹5,000
Other: ₹3,000
Total Expenses: ₹62,500
Expected Deficit: -₹12,500 (red alert!)
```

### Example 3: Multi-Loan Scenario
```
Income: ₹80,000
Expenses: ₹50,000
Active Loans:
- Credit Card: ₹50,000 @ 18% (₹2,000/month)
- Personal Loan: ₹200,000 @ 12% (₹8,000/month)
- Car Loan: ₹300,000 @ 10% (₹12,000/month)
Extra Payment Available: ₹5,000/month
```

---

## 🎨 Visual Expectations

### Dashboard Colors
- **Income Card**: Blue gradient
- **Expenses Card**: Orange gradient
- **Savings Card**: Green (positive) / Red (negative)
- **Savings Rate Card**: Purple gradient

### Chart Styles
- **Pie Chart**: 9 distinct colors, labels with percentages
- **Line Chart**: Smooth curve, area fill, gridlines
- **Bar Chart**: Side-by-side comparison, legend

### Smart Recommendations
- **High Severity Alert**: Red badge
- **Medium Severity Alert**: Yellow badge
- **Low Severity Alert**: Blue badge
- **Savings Badge**: Green with amount

---

## 📝 Known Limitations

1. **PDF Export**: Requires GTK+ on Windows (optional feature)
2. **AI Plan Generation**: Requires OPENAI_API_KEY in backend/.env
3. **Multi-Loan UI**: Backend ready, frontend visualization coming in Phase 3
4. **Currency**: Currently hardcoded to INR (₹)
5. **Data Persistence**: No database yet - data resets on page refresh

---

## ✅ Success Criteria

You've successfully tested all features when:
- [ ] All 4 metric cards show correct calculations
- [ ] All 3 charts render and are interactive
- [ ] Smart recommendations generate personalized tips
- [ ] Dashboard is responsive on mobile/tablet/desktop
- [ ] No console errors in browser (F12)
- [ ] Backend shows no errors in terminal
- [ ] (Optional) PDF downloads successfully if GTK+ installed

---

## 🚨 Critical Issues to Report

**Report these immediately**:
- Charts fail to render after multiple refreshes
- Dashboard shows incorrect calculations
- Smart recommendations crash or infinite loading
- Backend returns 500 errors (not 503 for PDF)
- Console shows unhandled promise rejections
- Data loss or corruption

**Not bugs** (expected behavior):
- PDF export 503 error on Windows without GTK+
- "OPENAI_API_KEY not set" warning (only affects AI plan)
- Empty smart recommendations if no overspending detected

---

## 📚 API Documentation

Full API documentation available at:
**http://localhost:8000/docs**

New endpoints added:
- `POST /api/v1/export-pdf` - Generate PDF report
- `POST /api/v1/smart-recommendations` - Get personalized tips
- `POST /api/v1/compare-debt-strategies` - Multi-loan analysis

---

## 🎯 Next Steps (Phase 3)

After testing Phase 2:
1. Multi-loan debt visualization in UI
2. Loan comparison dashboard
3. Interactive debt payoff timeline
4. Goal tracking features
5. Savings projection graphs

---

**Happy Testing! 🎉**

For issues or questions, check the console logs (F12) and backend terminal output.
