import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { formatSmartCurrency } from '../../../utils/helpers';
import CurrencySelector from '../../../components/CurrencySelector';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';

function AutoLoanCalculator() {
  const [currency, setCurrency] = useState('INR');
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [downPayment, setDownPayment] = useState(100000);
  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalAmount: 0,
    principalAmount: 0
  });

  const handleReset = () => {
    setLoanAmount(500000);
    setInterestRate(8.5);
    setLoanTenure(5);
    setDownPayment(100000);
  };

  useEffect(() => {
    calculateAutoLoan();
  }, [loanAmount, interestRate, loanTenure, downPayment]);

  const calculateAutoLoan = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;

    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      setResults({
        emi: 0,
        totalInterest: 0,
        totalAmount: 0,
        principalAmount: 0
      });
      return;
    }

    // EMI Calculation
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    setResults({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principalAmount: principal
    });
  };

  const carPrice = loanAmount;
  const downPaymentPercent = ((downPayment / carPrice) * 100).toFixed(1);
  const financedAmount = carPrice - downPayment;

  return (
    <>
      <SEO 
        title="Car Loan EMI Calculator | VegaKash.AI"
        description="Calculate your car loan EMI, total interest, and payment schedule. Plan your auto loan for new and used vehicles."
        keywords="car loan emi calculator, auto loan calculator, vehicle loan, car financing calculator, auto emi"
        canonical="/in/calculators/emi"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Car Loan EMI Calculator",
              "description": "Calculate your car loan EMI, total interest, and payment schedule",
              "url": "https://vegaktools.com/in/calculators/emi"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://vegaktools.com/in/calculators" },
                { "@type": "ListItem", "position": 3, "name": "Car Loan EMI Calculator", "item": "https://vegaktools.com/in/calculators/emi" }
              ]
            }
          ]
        }}
      />

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>🚗 Auto Loan Calculator</h1>
          <p>Calculate your car loan EMI and plan your vehicle purchase</p>
        </div>

        <div className="calculator-content">
          {/* Currency Selector */}
          <CurrencySelector 
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
          />

          <div className="calculator-main-grid">
            <div className="calculator-inputs">
            <div className="slider-group">
              <div className="slider-header">
                <label>Car Price (On-Road)</label>
                <input
                  type="text"
                  value={formatSmartCurrency(loanAmount, currency)}
                  readOnly
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="200000"
                max="10000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>₹2L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Down Payment</label>
                <input
                  type="text"
                  value={`${formatSmartCurrency(downPayment, currency)} (${downPaymentPercent}%)`}
                  readOnly
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="0"
                max={loanAmount * 0.5}
                step="10000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>₹0</span>
                <span style={{ minWidth: '80px', textAlign: 'right' }}>₹50L</span>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Interest Rate (Per Annum)</label>
                <input
                  type="text"
                  value={`${interestRate}%`}
                  readOnly
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="7"
                max="18"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>7%</span>
                <span>18%</span>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Loan Tenure</label>
                <input
                  type="text"
                  value={`${loanTenure} Years`}
                  readOnly
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>1 Yr</span>
                <span>7 Yrs</span>
              </div>
            </div>
          </div>

          <div className="calculator-results">
            <h2>Your Auto Loan Breakdown</h2>
            
            <div className="result-card highlight">
              <div className="result-label">Monthly EMI</div>
              <div className="result-value">{formatSmartCurrency(results.emi, currency)}</div>
            </div>

            <div className="result-cards">
              <div className="result-card">
                <div className="result-label">Financed Amount</div>
                <div className="result-value">{formatSmartCurrency(results.principalAmount, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value">{formatSmartCurrency(results.totalInterest, currency)}</div>
              </div>
            </div>

            <div className="result-card highlight">
              <div className="result-label">Total Payment</div>
              <div className="result-value">{formatSmartCurrency(results.totalAmount, currency)}</div>
            </div>

            <div className="breakdown-chart">
              <h3>Payment Breakdown</h3>
              <div className="chart-bar">
                <div 
                  className="chart-segment principal"
                  style={{ width: `${(results.principalAmount / results.totalAmount * 100)}%` }}
                >
                  <span>Principal</span>
                </div>
                <div 
                  className="chart-segment interest"
                  style={{ width: `${(results.totalInterest / results.totalAmount * 100)}%` }}
                >
                  <span>Interest</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Principal: {formatSmartCurrency(results.principalAmount, currency)}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Interest: {formatSmartCurrency(results.totalInterest, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="calculator-external-actions">
        <button onClick={handleReset} className="btn-reset">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset to Default
        </button>
      </div>

      <div className="seo-content-section">
        <div className="content-block">
          <h2>💡 Auto Loan Calculator - Plan Your Dream Car Purchase</h2>
          <p>
            Our Auto Loan Calculator helps you estimate your monthly car loan EMI, total interest, and payment schedule.
            Whether you're buying a new car or a used vehicle, this calculator helps you plan your finances effectively.
          </p>

          <h3>🎯 Key Features</h3>
          <ul>
            <li><strong>Flexible Down Payment:</strong> Adjust down payment from 0% to 50% of car price</li>
            <li><strong>Realistic Interest Rates:</strong> Compare rates from 7% to 18% per annum</li>
            <li><strong>Flexible Tenure:</strong> Choose loan tenure from 1 to 7 years</li>
            <li><strong>Visual Breakdown:</strong> See principal vs interest distribution clearly</li>
            <li><strong>Indian Currency Format:</strong> All amounts in ₹ (INR)</li>
          </ul>

          <h3>📊 How to Use This Calculator</h3>
          <ol>
            <li><strong>Enter Car Price:</strong> Input the on-road price of the vehicle (₹2L - ₹1Cr)</li>
            <li><strong>Set Down Payment:</strong> Choose how much you can pay upfront (0-50%)</li>
            <li><strong>Select Interest Rate:</strong> Enter the rate offered by your bank/dealer (7-18%)</li>
            <li><strong>Choose Tenure:</strong> Select loan duration (1-7 years)</li>
            <li><strong>Review Results:</strong> Check your monthly EMI and total cost</li>
          </ol>

          <h3>🚗 Understanding Auto Loans</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>📝 What is Auto Loan EMI?</h4>
              <p>
                Equated Monthly Installment (EMI) is the fixed amount you pay every month to repay your car loan.
                It includes both principal repayment and interest charges.
              </p>
            </div>

            <div className="info-card">
              <h4>💰 Down Payment Benefits</h4>
              <p>
                Higher down payment reduces your loan amount, resulting in lower EMIs and less total interest paid.
                Most lenders prefer 10-20% down payment.
              </p>
            </div>

            <div className="info-card">
              <h4>⏱️ Tenure Selection</h4>
              <p>
                Shorter tenure means higher EMI but lower total interest. Longer tenure reduces EMI but increases
                overall interest paid. Choose based on your monthly budget.
              </p>
            </div>

            <div className="info-card">
              <h4>📈 Interest Rates</h4>
              <p>
                New car loans typically have lower rates (7-10%) compared to used car loans (10-15%).
                Your credit score significantly impacts the rate offered.
              </p>
            </div>
          </div>

          <h3>💡 Tips for Better Auto Loan</h3>
          <ul>
            <li><strong>Compare Rates:</strong> Check offers from multiple banks and dealers</li>
            <li><strong>Improve Credit Score:</strong> Higher score (750+) gets better rates</li>
            <li><strong>Higher Down Payment:</strong> Reduces loan burden and interest</li>
            <li><strong>Shorter Tenure:</strong> Saves on total interest if affordable</li>
            <li><strong>Read Fine Print:</strong> Check for processing fees and prepayment charges</li>
            <li><strong>Budget Wisely:</strong> EMI shouldn't exceed 40% of monthly income</li>
          </ul>

          <h3>❓ FAQs</h3>
          <div className="faq-section">
            <div className="faq-item">
              <h4>What is the minimum down payment required?</h4>
              <p>
                Most lenders require 10-20% down payment. However, some lenders offer 100% financing
                for new cars with excellent credit scores.
              </p>
            </div>

            <div className="faq-item">
              <h4>Can I prepay my auto loan?</h4>
              <p>
                Yes, most lenders allow prepayment. However, some may charge prepayment penalties
                during the first 1-2 years. Check with your lender for specific terms.
              </p>
            </div>

            <div className="faq-item">
              <h4>What documents are needed for auto loan?</h4>
              <p>
                Typically: ID proof, address proof, income proof (salary slips/ITR), bank statements,
                and vehicle quotation/invoice.
              </p>
            </div>

            <div className="faq-item">
              <h4>How does loan tenure affect EMI?</h4>
              <p>
                Longer tenure = Lower EMI but Higher total interest. Shorter tenure = Higher EMI but
                Lower total interest. Choose based on your monthly budget capacity.
              </p>
            </div>
          </div>

          <div className="disclaimer">
            <p>
              <strong>Note:</strong> This calculator provides estimates for planning purposes only. Actual EMI may vary
              based on lender policies, processing fees, insurance, and other charges. Consult with your bank or
              financial advisor for accurate loan details.
            </p>
          </div>

          <section className="related-calculators">
            <h2>Related Financial Tools</h2>
            <p>Explore more calculators and tools to plan smarter</p>
            <div className="calculator-grid">
              <Link to="/in/calculators/emi" className="calc-card">
                <h3>💰 EMI Calculator</h3>
                <p>Calculate home or personal loan EMI</p>
              </Link>
              <Link to="/in/calculators/sip" className="calc-card">
                <h3>📈 SIP Calculator</h3>
                <p>Plan monthly investments and estimate returns</p>
              </Link>
              <Link to="/in/calculators/fd" className="calc-card">
                <h3>🏦 FD Calculator</h3>
                <p>Calculate fixed deposit maturity and interest</p>
              </Link>
              <Link to="/in/calculators/rd" className="calc-card">
                <h3>📅 RD Calculator</h3>
                <p>Calculate recurring deposit returns</p>
              </Link>
              <Link to="/" className="calc-card">
                <h3>🤖 AI Budget Planner</h3>
                <p>Create a personalized monthly budget with AI</p>
              </Link>
              <Link to="/calculators" className="calc-card">
                <h3>🧮 Calculator Hub</h3>
                <p>See all calculators in one place</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default AutoLoanCalculator;
