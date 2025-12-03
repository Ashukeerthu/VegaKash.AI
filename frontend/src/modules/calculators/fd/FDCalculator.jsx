import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { formatSmartCurrency, getCurrencySymbol } from '../../../utils/helpers';
import CurrencySelector from '../../../components/CurrencySelector';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';

/**
 * FD Calculator Component
 * Calculates Fixed Deposit maturity amount
 */
function FDCalculator() {
  const [currency, setCurrency] = useState('INR');
  const [depositAmount, setDepositAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenure, setTenure] = useState(12);
  const [result, setResult] = useState(null);

  // Auto-calculate on mount and whenever values change
  React.useEffect(() => {
    calculateFD();
  }, [depositAmount, interestRate, tenure]);

  const calculateFD = () => {
    const P = parseFloat(depositAmount);
    const r = parseFloat(interestRate) / 100; // Annual interest rate
    const t = parseFloat(tenure) / 12; // Convert months to years

    if (!P || !r || !t || P <= 0 || r < 0 || t <= 0) {
      return;
    }

    // Compounding frequency - quarterly
    const n = 4;

    // FD Formula: A = P × (1 + r/n)^(n×t)
    const maturityAmount = P * Math.pow(1 + (r / n), n * t);
    const interestEarned = maturityAmount - P;

    setResult({
      maturityAmount: maturityAmount.toFixed(2),
      depositAmount: P.toFixed(2),
      interestEarned: interestEarned.toFixed(2),
      effectiveRate: (((maturityAmount / P) - 1) * (1 / t) * 100).toFixed(2)
    });
  };

  const handleReset = () => {
    setDepositAmount(100000);
    setInterestRate(6.5);
    setTenure(12);
  };

  return (
    <>
      <SEO 
        title="FD Calculator | VegaKash.AI"
        description="Calculate fixed deposit maturity amount, interest earned, and effective annual rate across currencies."
        keywords="fd calculator, fixed deposit calculator, maturity amount, interest earned, effective rate"
        canonical="/fd-calculator"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "FD Calculator",
              "description": "Calculate fixed deposit maturity amount, interest earned, and effective annual rate",
              "url": "https://vegaktools.com/fd-calculator"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://vegaktools.com/calculators" },
                { "@type": "ListItem", "position": 3, "name": "FD Calculator", "item": "https://vegaktools.com/fd-calculator" }
              ]
            }
          ]
        }}
      />
      <div className="calculator-container">
      <div className="calculator-header">
        <h1>FD Calculator</h1>
        <p>Calculate Fixed Deposit maturity amount and interest earned</p>
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
              <label>Deposit Amount</label>
              <input
                type="text"
                value={formatSmartCurrency(depositAmount, currency)}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val === '') {
                    setDepositAmount('');
                    return;
                  }
                  const num = parseInt(val);
                  if (!isNaN(num)) {
                    setDepositAmount(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  const num = parseInt(val);
                  
                  if (val === '' || isNaN(num)) {
                    setDepositAmount(100000);
                  } else if (num < 10000) {
                    setDepositAmount(10000);
                  } else if (num > 10000000) {
                    setDepositAmount(10000000);
                  } else {
                    setDepositAmount(num);
                  }
                }}
                className="input-display"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>₹10K</span>
              <span>₹1Cr</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label>Interest Rate (p.a.)</label>
              <input
                type="text"
                value={`${interestRate}%`}
                onChange={(e) => {
                  const val = e.target.value.replace(/[%\s]/g, '');
                  if (val === '') {
                    setInterestRate('');
                    return;
                  }
                  const num = parseFloat(val);
                  if (!isNaN(num)) {
                    setInterestRate(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[%\s]/g, '');
                  const num = parseFloat(val);
                  
                  if (val === '' || isNaN(num)) {
                    setInterestRate(6.5);
                  } else if (num < 1) {
                    setInterestRate(1);
                  } else if (num > 15) {
                    setInterestRate(15);
                  } else {
                    setInterestRate(num);
                  }
                }}
                className="input-display"
              />
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>1%</span>
              <span>15%</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label>FD Tenure</label>
              <input
                type="text"
                value={`${tenure} ${tenure === 1 ? 'Month' : 'Months'}`}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val === '') {
                    setTenure('');
                    return;
                  }
                  const num = parseInt(val);
                  if (!isNaN(num)) {
                    setTenure(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  const num = parseInt(val);
                  
                  if (val === '' || isNaN(num)) {
                    setTenure(12);
                  } else if (num < 1) {
                    setTenure(1);
                  } else if (num > 120) {
                    setTenure(120);
                  } else {
                    setTenure(num);
                  }
                }}
                className="input-display"
              />
            </div>
            <input
              type="range"
              min="1"
              max="120"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>1 Mo</span>
              <span>120 Mos</span>
            </div>
          </div>

          {/* Reset Button Inside Input Box */}
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
            <h2>Your FD Maturity Details</h2>
            
            <div className="result-card highlight">
              <div className="result-label">Maturity Amount</div>
              <div className={`result-value ${String(result.maturityAmount).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.maturityAmount, currency)}</div>
            </div>

            <div className="result-cards">
              <div className="result-card">
                <div className="result-label">Deposit Amount</div>
                <div className={`result-value ${String(result.depositAmount).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.depositAmount, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Interest Earned</div>
                <div className={`result-value ${String(result.interestEarned).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.interestEarned, currency)}</div>
              </div>
            </div>

            <div className="breakdown-chart">
              <h3>Maturity Breakdown</h3>
              <div className="chart-bar">
                <div 
                  className="chart-segment principal"
                  style={{ width: `${(result.depositAmount / result.maturityAmount * 100).toFixed(1)}%` }}
                >
                  <span>Principal</span>
                </div>
                <div 
                  className="chart-segment interest"
                  style={{ width: `${(result.interestEarned / result.maturityAmount * 100).toFixed(1)}%` }}
                >
                  <span>Interest</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Principal: ₹{Number(result.depositAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Interest: ₹{Number(result.interestEarned).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="seo-content-section">
        <div className="content-block">
          <h2>What is Fixed Deposit (FD)?</h2>
          <p>
            A Fixed Deposit (FD) is a financial instrument provided by banks and NBFCs where you deposit a lump sum amount for a fixed tenure at a 
            predetermined interest rate. It's one of the safest investment options in India, offering guaranteed returns regardless of market conditions. 
            The interest rate remains fixed throughout the tenure, making it ideal for risk-averse investors seeking stable, predictable income.
          </p>
          <p>
            FDs are highly popular among Indians due to their safety, simplicity, and tax benefits (for 5-year tax-saver FDs under Section 80C). 
            Unlike market-linked investments, FD returns are not affected by economic volatility. They offer liquidity through premature withdrawal options 
            (with penalty) and can serve as collateral for loans. Senior citizens receive an additional 0.25-0.50% interest rate in most banks.
          </p>
        </div>

        <div className="content-block">
          <h2>How FD Interest is Calculated - Formula Explained</h2>
          
          <div className="formula-box">
            <strong>A = P × (1 + r/n)^(n×t)</strong>
          </div>
          
          <p><strong>Where:</strong></p>
          <ul>
            <li><strong>A</strong> = Maturity Amount (principal + interest)</li>
            <li><strong>P</strong> = Principal deposit amount</li>
            <li><strong>r</strong> = Annual interest rate (in decimal, e.g., 6.5% = 0.065)</li>
            <li><strong>n</strong> = Compounding frequency per year (4 for quarterly, most common in India)</li>
            <li><strong>t</strong> = Tenure in years</li>
          </ul>

          <p><strong>Example Calculation:</strong></p>
          <p>
            For ₹1,00,000 deposited at 7% per annum for 3 years with quarterly compounding:
          </p>
          <ul>
            <li>P = ₹1,00,000</li>
            <li>r = 0.07 (7%)</li>
            <li>n = 4 (quarterly)</li>
            <li>t = 3 years</li>
            <li><strong>Maturity Amount = ₹1,00,000 × (1 + 0.07/4)^(4×3) = ₹1,23,047</strong></li>
            <li><strong>Interest Earned = ₹23,047</strong></li>
          </ul>
        </div>

        <div className="content-block">
          <h2>Types of Fixed Deposits in India</h2>
          
          <h3>Regular Fixed Deposit</h3>
          <p>
            Standard FD offered by banks with tenures ranging from 7 days to 10 years. Interest is compounded quarterly (most banks) and paid at maturity 
            or as monthly/quarterly income based on your choice. Suitable for goal-based savings with flexible tenure options.
          </p>

          <h3>Tax Saver FD (5-Year Lock-in)</h3>
          <p>
            Special FDs with mandatory 5-year lock-in period eligible for tax deduction up to ₹1.5 lakh under Section 80C of Income Tax Act. 
            No premature withdrawal allowed. Interest rates similar to regular FDs but comes with tax-saving benefit. Interest earned is taxable.
          </p>

          <h3>Senior Citizen FD</h3>
          <p>
            Exclusive FDs for individuals aged 60+ offering higher interest rates (typically 0.25% to 0.50% extra). Most banks provide this benefit 
            automatically. Some banks offer special schemes with quarterly interest payouts to supplement retirement income.
          </p>

          <h3>Cumulative FD</h3>
          <p>
            Interest is compounded quarterly and paid at maturity along with principal. Best for long-term wealth accumulation as you earn 
            "interest on interest" through compounding. Higher returns compared to non-cumulative FDs due to reinvestment benefit.
          </p>

          <h3>Non-Cumulative FD</h3>
          <p>
            Interest is paid out monthly, quarterly, half-yearly, or annually as per your choice. Principal remains invested till maturity. 
            Ideal for retirees or those seeking regular income from their investment. Returns slightly lower than cumulative FDs.
          </p>
        </div>

        <div className="content-block">
          <h2>Current FD Interest Rates (2024-25)</h2>
          <p>Interest rates vary across banks and tenures. Here's an approximate range:</p>
          
          <h3>Public Sector Banks</h3>
          <ul>
            <li><strong>SBI:</strong> 6.50% - 7.10% (general), 7.00% - 7.60% (senior citizens)</li>
            <li><strong>PNB:</strong> 6.50% - 7.25% (general), 7.00% - 7.75% (senior citizens)</li>
            <li><strong>Bank of Baroda:</strong> 6.50% - 7.15% (general), 7.00% - 7.65% (senior citizens)</li>
          </ul>

          <h3>Private Sector Banks</h3>
          <ul>
            <li><strong>HDFC Bank:</strong> 6.60% - 7.40% (general), 7.10% - 7.90% (senior citizens)</li>
            <li><strong>ICICI Bank:</strong> 6.70% - 7.30% (general), 7.20% - 7.80% (senior citizens)</li>
            <li><strong>Axis Bank:</strong> 6.75% - 7.35% (general), 7.25% - 7.85% (senior citizens)</li>
          </ul>

          <h3>Small Finance Banks</h3>
          <ul>
            <li><strong>Ujjivan SFB:</strong> 7.25% - 8.25%</li>
            <li><strong>Jana SFB:</strong> 7.50% - 8.50%</li>
            <li><strong>AU SFB:</strong> 7.25% - 8.00%</li>
          </ul>

          <h3>Post Office</h3>
          <ul>
            <li><strong>Post Office Time Deposit:</strong> 7.00% - 7.50% (quarterly compounding)</li>
          </ul>

          <p><em>Note: Rates are indicative and change frequently based on RBI policies. Always check current rates before investing.</em></p>
        </div>

        <div className="content-block">
          <h2>Advantages of Using FD Calculator</h2>
          <ul>
            <li><strong>Instant Maturity Projection:</strong> Know exactly how much you'll receive at maturity within seconds</li>
            <li><strong>Compare Different Tenures:</strong> Test various lock-in periods to find optimal balance between returns and liquidity</li>
            <li><strong>Plan Goal-Based Savings:</strong> Calculate required deposit amount to reach specific financial goals</li>
            <li><strong>Interest Rate Comparison:</strong> Compare returns from different banks by adjusting interest rates</li>
            <li><strong>Tax Planning:</strong> Calculate post-tax returns by factoring in your tax bracket</li>
            <li><strong>Quarterly Compounding Effect:</strong> See the power of compounding with accurate quarterly calculations</li>
            <li><strong>Senior Citizen Planning:</strong> Calculate extra returns available for senior citizens with higher rates</li>
          </ul>
        </div>

        <div className="content-block">
          <h2>How to Use This FD Calculator</h2>
          <ol>
            <li><strong>Enter Deposit Amount:</strong> Input the lump sum you want to invest (₹10,000 to ₹1 Crore)</li>
            <li><strong>Set Interest Rate:</strong> Enter the annual interest rate offered by your bank (typically 6-8% for regular FDs)</li>
            <li><strong>Choose Tenure:</strong> Select FD duration from 1 month to 120 months (10 years)</li>
            <li><strong>View Results:</strong> Instantly see maturity amount, total interest earned, and visual breakdown</li>
            <li><strong>Compare Options:</strong> Adjust values to compare different banks, tenures, or amounts</li>
            <li><strong>Plan Investment:</strong> Use results to decide optimal FD tenure and bank for your needs</li>
          </ol>
        </div>

        <div className="content-block">
          <h2>Tips to Maximize FD Returns</h2>
          <ul>
            <li><strong>Compare Banks:</strong> Small finance banks often offer 0.5-1.5% higher rates than PSU banks - compare before investing</li>
            <li><strong>Ladder Your FDs:</strong> Instead of one large FD, create multiple FDs with different maturities for better liquidity and rate optimization</li>
            <li><strong>Choose Cumulative Option:</strong> For long-term goals, cumulative FDs yield higher returns through quarterly compounding</li>
            <li><strong>Utilize Senior Citizen Benefits:</strong> If eligible, extra 0.25-0.50% can add ₹2,500-5,000 on ₹10 lakh over 3 years</li>
            <li><strong>Time Your Investment:</strong> Open FDs when rates are high - RBI rate hikes lead to better FD rates</li>
            <li><strong>Consider Tax Implications:</strong> Interest is taxable as per your slab - calculate post-tax returns for accurate planning</li>
            <li><strong>Use 5-Year Tax Saver FD:</strong> Save ₹46,800 in taxes (₹1.5L × 31.2% tax) for highest tax bracket investors</li>
            <li><strong>Avoid Premature Withdrawal:</strong> Penalty of 0.5-1% reduces effective returns - plan liquidity in advance</li>
          </ul>
        </div>

        <div className="content-block faq-section">
          <h2>Frequently Asked Questions (FAQs)</h2>
          
          <div className="faq-item">
            <h3>Is FD interest rate fixed for the entire tenure?</h3>
            <p>
              Yes, FD interest rates are locked at the time of booking and remain unchanged throughout the tenure, regardless of market fluctuations. 
              Even if the bank reduces or increases FD rates later, your existing FD continues to earn the original rate. This makes FDs predictable 
              and safe. However, for floating rate FDs (rare), rates change with market conditions. Always confirm whether your FD has a fixed or 
              floating rate before investing.
            </p>
          </div>

          <div className="faq-item">
            <h3>What happens if I withdraw FD before maturity?</h3>
            <p>
              Premature withdrawal is allowed in most FDs (except 5-year tax-saver FDs) but comes with penalty of 0.5% to 1% reduction in interest rate. 
              You'll receive principal plus interest calculated at reduced rate for actual tenure. Some banks may waive penalty in special circumstances 
              (death, medical emergency). The penalty significantly reduces returns, so plan your liquidity needs before investing. Consider laddering 
              FDs or keeping emergency funds separately to avoid premature withdrawals.
            </p>
          </div>

          <div className="faq-item">
            <h3>How is FD interest taxed?</h3>
            <p>
              FD interest is fully taxable as "Income from Other Sources" at your applicable income tax slab rate (up to 30% + cess). Banks deduct TDS 
              at 10% if annual interest exceeds ₹40,000 (₹50,000 for senior citizens). If your total income is below taxable limit, submit Form 15G/15H 
              to avoid TDS deduction. Unlike equity mutual funds, there's no indexation benefit or special tax treatment. For highest tax bracket investors, 
              post-tax FD returns may be lower than inflation, making debt mutual funds more tax-efficient alternatives for longer tenures.
            </p>
          </div>

          <div className="faq-item">
            <h3>Which is better - cumulative or non-cumulative FD?</h3>
            <p>
              <strong>Cumulative FDs</strong> are better for wealth accumulation as interest gets compounded quarterly, resulting in higher returns. 
              Ideal for long-term goals where you don't need interim income. <strong>Non-cumulative FDs</strong> suit retirees or those needing regular 
              income, as interest is paid monthly/quarterly/annually. However, returns are lower since interest doesn't get reinvested. For a 
              ₹10 lakh FD at 7% for 3 years, cumulative gives ₹2.30 lakh interest vs ₹2.10 lakh in non-cumulative (with annual payout). Choose based 
              on your income needs and investment timeline.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are FDs completely safe? What about DICGC insurance?</h3>
            <p>
              FDs in scheduled banks are among the safest investments in India. The Deposit Insurance and Credit Guarantee Corporation (DICGC) 
              insures up to ₹5 lakh per depositor per bank (covering both principal and interest). This means if a bank fails, you're guaranteed to 
              recover up to ₹5 lakh. For amounts exceeding ₹5 lakh, diversify across multiple banks to stay within insured limits. Public sector banks 
              have implicit government backing making them extremely safe. Small finance banks and NBFCs offer higher rates but carry slightly higher risk - 
              always verify their credit rating and DICGC coverage before investing large amounts.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I get a loan against my FD?</h3>
            <p>
              Yes, most banks offer loans against FD (also called FD overdraft) at interest rates typically 1-2% above your FD rate. You can borrow 
              up to 90-95% of your FD value without breaking it. This is useful for emergency needs while keeping your FD returns intact. The loan 
              interest is charged only on utilized amount. Your FD continues earning interest, so net cost is just 1-2%. For example, if FD earns 7% 
              and loan costs 8.5%, your effective cost is only 1.5%. Some banks allow automatic overdraft facility for seamless access. This is better 
              than premature withdrawal which attracts penalty and stops future interest earnings.
            </p>
          </div>
        </div>

        <section className="related-calculators">
          <h2>Related Financial Tools</h2>
          <p>Explore more calculators and tools to plan smarter</p>
          <div className="calculator-grid">
            <Link to="/rd-calculator" className="calc-card">
              <h3>📅 RD Calculator</h3>
              <p>Calculate recurring deposit maturity and returns</p>
            </Link>
            <Link to="/sip-calculator" className="calc-card">
              <h3>📈 SIP Calculator</h3>
              <p>Calculate mutual fund SIP returns</p>
            </Link>
            <Link to="/emi-calculator" className="calc-card">
              <h3>💰 EMI Calculator</h3>
              <p>Calculate loan EMI and total interest</p>
            </Link>
            <Link to="/car-loan-calculator" className="calc-card">
              <h3>🚗 Auto Loan Calculator</h3>
              <p>Plan car loan EMIs and interest outgo</p>
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

export default FDCalculator;
