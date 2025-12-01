# 🧪 Calculator Testing Guide

## Local Testing URLs

### Backend
- Health Check: http://localhost:8000/health ✅ Running
- API Docs: http://localhost:8000/docs

### Frontend
- Main App: http://localhost:3000/ ✅ Running
- Calculator Hub: http://localhost:3000/calculators

---

## 🎯 Test Plan

### Phase 1: Calculator Hub Page
**URL:** http://localhost:3000/calculators

**Test Cases:**
- [ ] Page loads without errors
- [ ] All 8 calculator cards are visible
- [ ] Category filters work (All, Loans, Investments, Savings, Tax, Planning)
- [ ] "Coming Soon" badges appear on future calculators
- [ ] Clicking "Use Calculator" navigates to correct calculator
- [ ] Responsive design on mobile (resize browser)
- [ ] Features section displays at bottom

---

### Phase 2: Navigation Testing
**Test Cases:**
- [ ] Navbar "Calculators" dropdown shows all calculators
- [ ] "All Calculators" link in dropdown works
- [ ] Clicking any calculator from navbar navigates correctly
- [ ] Dropdown closes after selection
- [ ] Mobile hamburger menu works

---

### Phase 3: Individual Calculator Testing

#### ✅ 1. EMI Calculator
**URL:** http://localhost:3000/calculators/emi

**Input Values:**
- Loan Amount: 1000000 (10 Lakhs)
- Interest Rate: 8.5%
- Tenure: 20 years

**Expected Output:**
- Monthly EMI: ₹8,678
- Total Interest: ₹10,82,652
- Total Amount: ₹20,82,652

**Test Cases:**
- [ ] All inputs accept numbers
- [ ] Tenure toggle (Years/Months) works
- [ ] Calculate button computes correctly
- [ ] Reset button clears all fields
- [ ] Pie chart displays principal vs interest
- [ ] Result cards show formatted currency (₹ symbol, commas)
- [ ] No console errors
- [ ] Mobile responsive

---

#### ✅ 2. SIP Calculator
**URL:** http://localhost:3000/calculators/sip

**Input Values:**
- Monthly Investment: 5000
- Expected Return: 12%
- Duration: 10 years

**Expected Output:**
- Total Invested: ₹6,00,000
- Future Value: ₹11,61,695
- Wealth Gained: ₹5,61,695

**Test Cases:**
- [ ] Calculations accurate
- [ ] Future value shows compound growth
- [ ] Chart displays invested vs returns
- [ ] Info section explains SIP benefits
- [ ] Mobile responsive

---

#### ✅ 3. Lumpsum Calculator
**URL:** http://localhost:3000/calculators/lumpsum

**Input Values:**
- Investment: 100000 (1 Lakh)
- Expected Return: 12%
- Duration: 10 years

**Expected Output:**
- Future Value: ₹3,10,585
- Total Returns: ₹2,10,585
- Return %: 210.58%

**Test Cases:**
- [ ] Compound interest formula correct
- [ ] Return percentage calculates properly
- [ ] Chart visualization works
- [ ] Comparison with SIP mentioned in info
- [ ] Mobile responsive

---

#### ✅ 4. FD Calculator
**URL:** http://localhost:3000/calculators/fd

**Input Values:**
- Deposit: 100000
- Interest Rate: 6.5%
- Tenure: 5 years
- Compounding: Quarterly

**Expected Output:**
- Maturity Amount: ₹1,37,414
- Interest Earned: ₹37,414

**Test Cases:**
- [ ] Tenure type dropdown (Days/Months/Years) works
- [ ] Compounding frequency dropdown works
- [ ] Different compounding gives different results
- [ ] Bank interest rates mentioned in info
- [ ] Mobile responsive

---

#### ✅ 5. RD Calculator
**URL:** http://localhost:3000/calculators/rd

**Input Values:**
- Monthly Deposit: 5000
- Interest Rate: 6.5%
- Tenure: 60 months (5 years)

**Expected Output:**
- Total Deposited: ₹3,00,000
- Maturity Amount: ₹3,46,500 (approx)
- Interest Earned: ₹46,500 (approx)

**Test Cases:**
- [ ] Monthly deposit calculation
- [ ] Shows years conversion below months input
- [ ] Effective return percentage displays
- [ ] RD vs FD comparison in info
- [ ] Mobile responsive

---

#### ✅ 6. Income Tax Calculator
**URL:** http://localhost:3000/calculators/income-tax

**Input Values:**
- Gross Income: 1200000 (12 Lakhs)
- Age: Below 60
- 80C Deductions: 150000
- HRA: 0
- Home Loan Interest: 0
- Other Deductions: 0

**Expected Output:**
- Old Regime Tax: ~₹1,12,000
- New Regime Tax: ~₹75,000
- Recommendation: New Regime saves money

**Test Cases:**
- [ ] Old regime calculation with deductions
- [ ] New regime calculation (only standard deduction)
- [ ] Both regimes display side-by-side
- [ ] "Best Option" badge appears on better regime
- [ ] Recommendation shows savings amount
- [ ] Age category affects calculations
- [ ] Tax slabs displayed correctly
- [ ] Mobile responsive (cards stack vertically)

---

#### ✅ 7. Savings Goal Calculator
**URL:** http://localhost:3000/calculators/savings-goal

**Input Values:**
- Target Amount: 1000000 (10 Lakhs)
- Time: 5 years
- Expected Return: 12%
- Current Savings: 0

**Expected Output:**
- Monthly Investment Required: ₹12,244
- Total Investment: ₹7,34,640

**Test Cases:**
- [ ] Calculates monthly investment needed
- [ ] With current savings, adjusts required investment
- [ ] Shows "already achieved" if current savings > target
- [ ] Goal breakdown displays timeline
- [ ] Popular goals examples shown
- [ ] Investment options by timeline
- [ ] Mobile responsive

---

#### ✅ 8. Emergency Fund Calculator
**URL:** http://localhost:3000/calculators/emergency-fund

**Input Values:**
- Monthly Expenses: 30000
- Dependents: 2
- Health Insurance: Yes
- Job Stability: Stable

**Expected Output:**
- 3 Months: ₹90,000
- 6 Months: ₹1,80,000 (Standard)
- 12 Months: ₹3,60,000
- Recommended: 7-8 months (₹2,10,000 - ₹2,40,000)

**Test Cases:**
- [ ] Adjusts recommendation based on factors
- [ ] More dependents = higher months
- [ ] No insurance = higher buffer
- [ ] Unstable job = maximum months
- [ ] Factors breakdown displays logic
- [ ] Action plan shows daily investment
- [ ] Emergency fund examples listed
- [ ] Mobile responsive

---

## Phase 4: Cross-Browser Testing

**Browsers to Test:**
- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if Mac available)

**Test:**
- [ ] All calculators load
- [ ] Calculations work
- [ ] Styles render correctly
- [ ] No console errors

---

## Phase 5: Mobile Responsiveness

**Devices to Test:**
1. Mobile (375px width)
   - [ ] Calculator hub grid becomes 1 column
   - [ ] Individual calculators stack vertically
   - [ ] Buttons are full width
   - [ ] Text is readable
   - [ ] Charts resize properly

2. Tablet (768px width)
   - [ ] Calculator hub shows 2 columns
   - [ ] Tax calculator cards stack
   - [ ] Navigation is accessible

3. Desktop (1200px+ width)
   - [ ] Full layout displays
   - [ ] Charts are properly sized
   - [ ] No horizontal scroll

---

## Phase 6: Performance Testing

**Check:**
- [ ] Page loads in < 2 seconds
- [ ] No memory leaks (calculate multiple times)
- [ ] Smooth animations
- [ ] No layout shifts
- [ ] Images load properly

**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Check scores:
   - [ ] Performance > 90
   - [ ] Accessibility > 90
   - [ ] Best Practices > 90
   - [ ] SEO > 90

---

## Phase 7: Error Handling

**Test Invalid Inputs:**
- [ ] Empty fields - Shows alert
- [ ] Negative numbers - Shows alert
- [ ] Zero values - Shows alert
- [ ] Very large numbers - Handles gracefully
- [ ] Non-numeric input - Prevented by input type

---

## Phase 8: Analytics Testing (If Configured)

**Open Browser Console:**
1. Navigate to any calculator
2. Perform calculation
3. Check console for:
   - [ ] No GA errors
   - [ ] Event tracking works (if GA configured)

---

## 🐛 Bug Tracking

### Critical Issues (Fix Immediately)
- [ ] None found

### Medium Issues (Fix Before Production)
- [ ] None found

### Low Priority Issues (Fix Later)
- [ ] None found

---

## ✅ Final Checklist Before GitHub Push

- [ ] All 8 calculators work correctly
- [ ] No console errors in browser
- [ ] Mobile responsive on all pages
- [ ] Calculator Hub navigation works
- [ ] Navbar dropdown displays all calculators
- [ ] Reset buttons work on all calculators
- [ ] Result formatting (₹ symbol, commas) correct
- [ ] Charts/visualizations display properly
- [ ] Info sections are readable and helpful
- [ ] Cross-browser tested (Chrome, Firefox, Edge)
- [ ] Performance is good (fast load, smooth)
- [ ] No TypeScript/ESLint errors
- [ ] Ready for production deployment

---

## 📝 Testing Notes

**Date:** December 2, 2024  
**Tester:** _________________  
**Browser:** _________________  
**OS:** Windows 11

**Overall Status:** ⏳ In Progress

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## 🚀 After Testing Approval

Once all tests pass:

1. Review changes: `git status`
2. Add files: `git add .`
3. Commit: `git commit -m "Add 8 financial calculators with hub page"`
4. Push: `git push origin main`
5. Deploy to production
6. Test on live site: https://vegaktools.com/calculators
7. Monitor analytics for calculator usage

---

**Current Status:** 
- ✅ Backend running on port 8000
- ✅ Frontend running on port 3000
- 🧪 Ready for testing!

**Start Testing:** http://localhost:3000/calculators
