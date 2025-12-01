import React from 'react';
import SEO from '../../components/SEO';
import '../../styles/Calculator.css';

/**
 * Income Tax Calculator Component
 * Calculates tax under Old vs New Regime for FY 2024-25
 */
function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(600000);
  const [deductions80C, setDeductions80C] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [age, setAge] = useState('below60');
  const [result, setResult] = useState(null);

  const validateInput = (value, min, max) => {
    const num = parseFloat(value);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  };

  const calculateOldRegimeTax = (taxableIncome) => {
    let tax = 0;
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.20;
    } else {
      tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30;
    }

    // Senior citizen benefits
    if (age === '60to80' && taxableIncome <= 300000) {
      tax = 0;
    } else if (age === 'above80' && taxableIncome <= 500000) {
      tax = 0;
    }

    return tax;
  };

  const calculateNewRegimeTax = (grossIncome) => {
    let tax = 0;
    if (grossIncome <= 300000) {
      tax = 0;
    } else if (grossIncome <= 600000) {
      tax = (grossIncome - 300000) * 0.05;
    } else if (grossIncome <= 900000) {
      tax = 15000 + (grossIncome - 600000) * 0.10;
    } else if (grossIncome <= 1200000) {
      tax = 15000 + 30000 + (grossIncome - 900000) * 0.15;
    } else if (grossIncome <= 1500000) {
      tax = 15000 + 30000 + 45000 + (grossIncome - 1200000) * 0.20;
    } else {
      tax = 15000 + 30000 + 45000 + 60000 + (grossIncome - 1500000) * 0.30;
    }

    // Standard deduction of 50,000 in new regime (FY 2024-25)
    const taxableIncome = Math.max(0, grossIncome - 50000);
    return calculateNewRegimeTaxActual(taxableIncome);
  };

  const calculateNewRegimeTaxActual = (taxableIncome) => {
    let tax = 0;
    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 600000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 900000) {
      tax = 15000 + (taxableIncome - 600000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 15000 + 30000 + (taxableIncome - 900000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.30;
    }
    return tax;
  };

  const calculateTax = () => {
    const income = parseFloat(grossIncome) || 0;
    const ded80C = Math.min(parseFloat(deductions80C) || 0, 150000); // Max 1.5L
    const otherDed = Math.min(parseFloat(otherDeductions) || 0, 200000); // Max 2L

    if (income <= 0) {
      return;
    }

    // Old Regime Calculation
    const totalDeductions = ded80C + otherDed;
    const taxableIncomeOld = Math.max(0, income - totalDeductions - 50000); // Standard deduction
    const taxOld = calculateOldRegimeTax(taxableIncomeOld);
    const cessOld = taxOld * 0.04; // 4% cess
    const totalTaxOld = taxOld + cessOld;

    // New Regime Calculation
    const taxableIncomeNew = Math.max(0, income - 50000); // Only standard deduction
    const taxNew = calculateNewRegimeTaxActual(taxableIncomeNew);
    const cessNew = taxNew * 0.04;
    const totalTaxNew = taxNew + cessNew;

    setResult({
      grossIncome: income.toFixed(2),
      oldRegime: {
        taxableIncome: taxableIncomeOld.toFixed(2),
        tax: taxOld.toFixed(2),
        cess: cessOld.toFixed(2),
        totalTax: totalTaxOld.toFixed(2),
        takeHome: (income - totalTaxOld).toFixed(2)
      },
      newRegime: {
        taxableIncome: taxableIncomeNew.toFixed(2),
        tax: taxNew.toFixed(2),
        cess: cessNew.toFixed(2),
        totalTax: totalTaxNew.toFixed(2),
        takeHome: (income - totalTaxNew).toFixed(2)
      },
      savings: (Math.abs(totalTaxOld - totalTaxNew)).toFixed(2),
      betterRegime: totalTaxOld < totalTaxNew ? 'Old Regime' : 'New Regime'
    });
  };

  useEffect(() => {
    calculateTax();
  }, [grossIncome, deductions80C, otherDeductions, age]);

  const handleReset = () => {
    setGrossIncome(600000);
    setDeductions80C(0);
    setOtherDeductions(0);
    setAge('below60');
    setResult(null);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Income Tax Calculator 2024-25</h1>
        <p>Compare Old vs New Tax Regime and find which saves you more</p>
      </div>

      <div className="calculator-content">
        <div className="calculator-inputs">
          <div className="input-group">
            <label htmlFor="grossIncome">
              Gross Annual Income: ₹{grossIncome.toLocaleString('en-IN')}
            </label>
            <input
              type="range"
              id="grossIncome"
              min="100000"
              max="10000000"
              step="50000"
              value={grossIncome}
              onChange={(e) => setGrossIncome(parseFloat(e.target.value))}
              className="slider"
            />
            <input
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(e.target.value)}
              onBlur={(e) => setGrossIncome(validateInput(e.target.value, 100000, 10000000))}
              className="slider-input"
              min="100000"
              max="10000000"
              step="50000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="age">Age Category</label>
            <select
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="full-width-select"
            >
              <option value="below60">Below 60 years</option>
              <option value="60to80">60-80 years (Senior Citizen)</option>
              <option value="above80">Above 80 years (Super Senior)</option>
            </select>
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Old Regime Deductions
          </h3>

          <div className="input-group">
            <label htmlFor="deductions80C">
              80C Deductions: ₹{deductions80C.toLocaleString('en-IN')} (Max ₹1.5L)
            </label>
            <input
              type="range"
              id="deductions80C"
              min="0"
              max="150000"
              step="10000"
              value={deductions80C}
              onChange={(e) => setDeductions80C(parseFloat(e.target.value))}
              className="slider"
            />
            <input
              type="number"
              value={deductions80C}
              onChange={(e) => setDeductions80C(e.target.value)}
              onBlur={(e) => setDeductions80C(validateInput(e.target.value, 0, 150000))}
              className="slider-input"
              min="0"
              max="150000"
              step="10000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="otherDeductions">
              Other Deductions: ₹{otherDeductions.toLocaleString('en-IN')} (80D, HRA, etc.)
            </label>
            <input
              type="range"
              id="otherDeductions"
              min="0"
              max="200000"
              step="10000"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(parseFloat(e.target.value))}
              className="slider"
            />
            <input
              type="number"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              onBlur={(e) => setOtherDeductions(validateInput(e.target.value, 0, 200000))}
              className="slider-input"
              min="0"
              max="200000"
              step="10000"
            />
          </div>
        </div>

        <div className="calculator-external-actions">
          <button onClick={handleReset} className="btn-secondary">
            Reset
          </button>
        </div>

        {result && (
          <div className="calculator-results">
            <div className="regime-comparison">
              <h2>Tax Comparison: Old vs New Regime</h2>
              
              <div className="comparison-cards">
                <div className={`regime-card ${result.betterRegime === 'Old Regime' ? 'best-option' : ''}`}>
                  <h3>Old Tax Regime</h3>
                  <div className="regime-details">
                    <div className="detail-row">
                      <span>Taxable Income:</span>
                      <strong>₹{Number(result.oldRegime.taxableIncome).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Income Tax:</span>
                      <strong>₹{Number(result.oldRegime.tax).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Cess (4%):</span>
                      <strong>₹{Number(result.oldRegime.cess).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row total">
                      <span>Total Tax:</span>
                      <strong>₹{Number(result.oldRegime.totalTax).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row takehome">
                      <span>Take Home:</span>
                      <strong>₹{Number(result.oldRegime.takeHome).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                  {result.betterRegime === 'Old Regime' && (
                    <div className="best-badge">✓ Best Option</div>
                  )}
                </div>

                <div className={`regime-card ${result.betterRegime === 'New Regime' ? 'best-option' : ''}`}>
                  <h3>New Tax Regime</h3>
                  <div className="regime-details">
                    <div className="detail-row">
                      <span>Taxable Income:</span>
                      <strong>₹{Number(result.newRegime.taxableIncome).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Income Tax:</span>
                      <strong>₹{Number(result.newRegime.tax).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Cess (4%):</span>
                      <strong>₹{Number(result.newRegime.cess).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row total">
                      <span>Total Tax:</span>
                      <strong>₹{Number(result.newRegime.totalTax).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row takehome">
                      <span>Take Home:</span>
                      <strong>₹{Number(result.newRegime.takeHome).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                  {result.betterRegime === 'New Regime' && (
                    <div className="best-badge">✓ Best Option</div>
                  )}
                </div>
              </div>

              <div className="recommendation">
                <h3>💡 Recommendation</h3>
                <p>
                  <strong>{result.betterRegime}</strong> saves you <strong>₹{Number(result.savings).toLocaleString('en-IN')}</strong> in taxes!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="seo-content-section">
          <h3>Tax Slabs FY 2024-25</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <h4>Old Regime</h4>
              <ul>
                <li>Up to ₹2.5L: Nil</li>
                <li>₹2.5L - ₹5L: 5%</li>
                <li>₹5L - ₹10L: 20%</li>
                <li>Above ₹10L: 30%</li>
              </ul>
              <p><strong>Deductions:</strong> 80C, HRA, Home Loan, etc.</p>
            </div>

            <div>
              <h4>New Regime</h4>
              <ul>
                <li>Up to ₹3L: Nil</li>
                <li>₹3L - ₹6L: 5%</li>
                <li>₹6L - ₹9L: 10%</li>
                <li>₹9L - ₹12L: 15%</li>
                <li>₹12L - ₹15L: 20%</li>
                <li>Above ₹15L: 30%</li>
              </ul>
              <p><strong>Deductions:</strong> Only ₹50K standard deduction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeTaxCalculator;
