import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import SEO from '../../../components/SEO';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';

/**
 * UK Mortgage Affordability Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Estimates how much mortgage you can afford in the UK with proper SEO
 */
function MortgageAffordabilityCalculatorUK() {
  const { country } = useParams();
  const [income, setIncome] = useState(40000);
  const [monthlyDebt, setMonthlyDebt] = useState(500);
  const [interestRate, setInterestRate] = useState(5.0);
  const [years, setYears] = useState(25);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculateAffordability();
  }, [income, monthlyDebt, interestRate, years]);

  const calculateAffordability = () => {
    const annualIncome = parseFloat(income);
    const monthlyDebtPayments = parseFloat(monthlyDebt);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!annualIncome || !r || !n || annualIncome <= 0 || r < 0 || n <= 0) return;
    // UK lenders typically allow 4.5x income minus debts
    const maxLoan = (annualIncome * 4.5) - (monthlyDebtPayments * 12 * years);
    // Calculate monthly payment for maxLoan
    const monthly = (maxLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setResult({ maxLoan: maxLoan.toFixed(2), monthly: monthly.toFixed(2) });
  };

  return (
    <div className="calculator-container">
      <SEO title="UK Mortgage Affordability Calculator | VegaKash" description="Estimate how much mortgage you can afford in the UK. Free, fast, accurate mortgage affordability calculator for the UK." />
      <h1>UK Mortgage Affordability Calculator</h1>
      <form>
        <label>Annual Income (£): <input type="number" value={income} onChange={e => setIncome(e.target.value)} /></label><br />
        <label>Monthly Debt Payments (£): <input type="number" value={monthlyDebt} onChange={e => setMonthlyDebt(e.target.value)} /></label><br />
        <label>Interest Rate (% p.a.): <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} /></label><br />
        <label>Mortgage Term (years): <input type="number" value={years} onChange={e => setYears(e.target.value)} /></label>
      </form>
      {result && (
        <div className="result">
          <p><strong>Maximum Affordable Mortgage:</strong> £{result.maxLoan}</p>
          <p><strong>Estimated Monthly Payment:</strong> £{result.monthly}</p>
        </div>
      )}
      <section className="seo-content">
        <h2>How to Calculate Mortgage Affordability in the UK</h2>
        <p>UK lenders typically allow you to borrow up to 4.5 times your annual income, minus debts.<br />
        <code>Max Loan = (Income × 4.5) - (Debts × 12 × Years)</code></p>
        <h2>UK Mortgage Affordability FAQ</h2>
        <ul>
          <li><strong>How much can I borrow?</strong> Most UK lenders allow up to 4.5x your income, minus debts.</li>
          <li><strong>What affects affordability?</strong> Income, debts, interest rate, and term.</li>
        </ul>
      </section>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "UK Mortgage Affordability Calculator",
        "description": "Estimate how much mortgage you can afford in the UK.",
        "provider": {"@type": "Organization", "name": "VegaKash.AI"},
        "applicationCategory": "Calculator",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}
      })}</script>
    </div>
  );
}

export default MortgageAffordabilityCalculatorUK;
