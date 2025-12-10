import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';

function SavingsGrowthCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Savings Growth Calculator', path: null }
  ];
  
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(5.0);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculateGrowth();
  }, [initial, monthly, years, annualReturn]);

  const calculateGrowth = () => {
    const P = parseFloat(initial);
    const PMT = parseFloat(monthly);
    const r = parseFloat(annualReturn) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!P || !PMT || !r || !n || P < 0 || PMT < 0 || r < 0 || n <= 0) return;
    const FV = P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
    const totalDeposited = P + (PMT * n);
    setResult({ futureValue: FV.toFixed(2), totalDeposited: totalDeposited.toFixed(2), gain: (FV - totalDeposited).toFixed(2) });
  };

  const handleReset = () => {
    setInitial(1000);
    setMonthly(200);
    setYears(10);
    setAnnualReturn(5.0);
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <>
      <EnhancedSEO 
        title={`US Savings Growth Calculator${country ? ` for ${country.toUpperCase()}` : ''}`}
        description={`Estimate your savings growth with regular deposits${country ? ` for ${country.toUpperCase()}` : ''}. Free savings calculator.`}
        tool="savings"
        country={country}
        isGlobal={!country}
      />
      <SEO title="US Savings Growth Calculator | VegaKash" description="Estimate your US savings growth with regular deposits. Free savings calculator for the USA." />

      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1>US Savings Growth Calculator</h1>
          <p>Estimate your savings growth with regular monthly deposits and interest</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              <div className="slider-group">
                <div className="slider-header">
                  <label>Initial Savings</label>
                  <input type="text" value={formatCurrency(initial)} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); setInitial(val === '' ? '' : parseInt(val)); }} className="input-display" />
                </div>
                <input type="range" min="0" max="100000" step="1000" value={initial} onChange={(e) => setInitial(parseFloat(e.target.value))} className="slider" />
                <div className="slider-labels"><span>$0</span><span>$100K</span></div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Monthly Deposit</label>
                  <input type="text" value={formatCurrency(monthly)} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); setMonthly(val === '' ? '' : parseInt(val)); }} className="input-display" />
                </div>
                <input type="range" min="0" max="5000" step="50" value={monthly} onChange={(e) => setMonthly(parseFloat(e.target.value))} className="slider" />
                <div className="slider-labels"><span>$0</span><span>$5K</span></div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Years to Save</label>
                  <input type="text" value={`${years} Yrs`} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); setYears(val === '' ? '' : parseInt(val)); }} className="input-display" />
                </div>
                <input type="range" min="1" max="50" step="1" value={years} onChange={(e) => setYears(parseFloat(e.target.value))} className="slider" />
                <div className="slider-labels"><span>1 Yr</span><span>50 Yrs</span></div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Annual Return Rate</label>
                  <input type="text" value={`${annualReturn}%`} onChange={(e) => { const val = e.target.value.replace(/[%\s]/g, ''); setAnnualReturn(val === '' ? '' : parseFloat(val)); }} className="input-display" />
                </div>
                <input type="range" min="0" max="15" step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(parseFloat(e.target.value))} className="slider" />
                <div className="slider-labels"><span>0%</span><span>15%</span></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleReset} className="btn-reset">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset to Default
                </button>
              </div>
            </div>

            {result && (
              <div className="calculator-results">
                <h2>Your Savings Projection</h2>
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">Total Savings Value</div>
                    <div className="result-value">{formatCurrency(result.futureValue)}</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Total Amount Deposited</div>
                    <div className="result-value">{formatCurrency(result.totalDeposited)}</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Interest Earned</div>
                    <div className="result-value">{formatCurrency(result.gain)}</div>
                  </div>
                </div>
                <div className="breakdown-chart">
                  <h3>Savings Composition</h3>
                  <div className="chart-bar">
                    <div className="chart-segment principal" style={{ width: `${(result.totalDeposited / result.futureValue * 100).toFixed(1)}%` }}><span className="chart-label">Deposited</span></div>
                    <div className="chart-segment interest" style={{ width: `${(result.gain / result.futureValue * 100).toFixed(1)}%` }}><span className="chart-label">Interest</span></div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item"><div className="legend-color principal"></div><span>Deposited: {formatCurrency(result.totalDeposited)}</span></div>
                    <div className="legend-item"><div className="legend-color interest"></div><span>Interest: {formatCurrency(result.gain)}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="seo-content">
          <h2>How to Estimate Savings Growth</h2>
          <p>The formula for future value with regular deposits is:</p>
          <code>FV = P×(1+r)<sup>n</sup> + PMT×(((1+r)<sup>n</sup> - 1)/r)</code>
          <ul>
            <li><strong>FV</strong> = Future value of savings</li>
            <li><strong>P</strong> = Initial savings amount</li>
            <li><strong>PMT</strong> = Monthly deposit</li>
            <li><strong>r</strong> = Monthly return rate</li>
            <li><strong>n</strong> = Number of months</li>
          </ul>

          <h2>Savings Growth FAQ</h2>
          <ul>
            <li><strong>How much will my savings grow?</strong> Use this calculator to estimate based on your deposits and expected returns.</li>
            <li><strong>What is compound interest?</strong> Interest earned on both principal and accumulated interest over time.</li>
            <li><strong>Where should I save?</strong> High-yield savings accounts, CDs, money market accounts offer better rates than regular savings.</li>
            <li><strong>How often does interest compound?</strong> Daily, monthly, quarterly - more frequent compounding means better returns.</li>
          </ul>
        </section>

        <AEOContentSection tool="savingsgrowth" country={country} />

        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FinancialProduct", "name": "US Savings Growth Calculator", "description": "Estimate your US savings growth with regular deposits.", "provider": {"@type": "Organization", "name": "VegaKash.AI"}, "applicationCategory": "Calculator", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"} })}</script>
      </div>
    </>
  );
}

export default SavingsGrowthCalculatorUS;
