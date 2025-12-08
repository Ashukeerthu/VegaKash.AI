import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import SEO from '../../../components/SEO';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';

/**
 * UK Savings Account Interest Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Estimates interest earned on UK savings accounts with proper SEO
 */
function SavingsInterestCalculatorUK() {
  const { country } = useParams();
  const [principal, setPrincipal] = useState(5000);
  const [interestRate, setInterestRate] = useState(3.0);
  const [years, setYears] = useState(2);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculateInterest();
  }, [principal, interestRate, years]);

  const calculateInterest = () => {
    const P = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(years);
    if (!P || !r || !t || P < 0 || r < 0 || t <= 0) return;
    // Simple interest: I = P × r × t
    const interest = P * r * t;
    const total = P + interest;
    setResult({ interest: interest.toFixed(2), total: total.toFixed(2) });
  };

  return (
    <div className="calculator-container">
      <SEO title="UK Savings Account Interest Calculator | VegaKash" description="Estimate interest earned on UK savings accounts. Free, fast, accurate savings interest calculator for the UK." />
      <h1>UK Savings Account Interest Calculator</h1>
      <form>
        <label>Principal (£): <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></label><br />
        <label>Interest Rate (% p.a.): <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} /></label><br />
        <label>Years: <input type="number" value={years} onChange={e => setYears(e.target.value)} /></label>
      </form>
      {result && (
        <div className="result">
          <p><strong>Interest Earned:</strong> £{result.interest}</p>
          <p><strong>Total Value:</strong> £{result.total}</p>
        </div>
      )}
      <section className="seo-content">
        <h2>How to Calculate Savings Interest in the UK</h2>
        <p>The formula for simple interest is:<br />
        <code>Interest = Principal × Rate × Time</code></p>
        <h2>UK Savings Interest FAQ</h2>
        <ul>
          <li><strong>How much interest will I earn?</strong> Enter your deposit, rate, and time to estimate.</li>
          <li><strong>What is the typical UK savings rate?</strong> Rates vary, but 2–4% is common in 2025.</li>
        </ul>
      </section>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "UK Savings Account Interest Calculator",
        "description": "Estimate interest earned on UK savings accounts.",
        "provider": {"@type": "Organization", "name": "VegaKash.AI"},
        "applicationCategory": "Calculator",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}
      })}</script>
    </div>
  );
}

export default SavingsInterestCalculatorUK;
