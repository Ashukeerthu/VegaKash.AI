import React, { useState } from 'react';
import '../../styles/Calculator.css';

/**
 * RD Calculator Component
 * Calculates Recurring Deposit maturity amount
 */
function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenure, setTenure] = useState(12);
  const [result, setResult] = useState(null);

  // Auto-calculate on mount and whenever values change
  React.useEffect(() => {
    calculateRD();
  }, [monthlyDeposit, interestRate, tenure]);

  const calculateRD = () => {
    const P = parseFloat(monthlyDeposit);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(tenure); // Tenure in months

    if (!P || !r || !n || P <= 0 || r < 0 || n <= 0) {
      return;
    }

    // RD Formula: M = P × [(1 + r)^n - 1] / r × (1 + r)
    // This is similar to SIP formula
    const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const totalDeposited = P * n;
    const interestEarned = maturityAmount - totalDeposited;

    setResult({
      maturityAmount: maturityAmount.toFixed(2),
      totalDeposited: totalDeposited.toFixed(2),
      interestEarned: interestEarned.toFixed(2),
      effectiveRate: ((interestEarned / totalDeposited) * 100).toFixed(2)
    });
  };

  const handleReset = () => {
    setMonthlyDeposit(5000);
    setInterestRate(6.5);
    setTenure(12);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>RD Calculator</h1>
        <p>Calculate Recurring Deposit maturity amount with monthly deposits</p>
      </div>

      <div className="calculator-content">
        <div className="calculator-inputs">
          <div className="slider-group">
            <div className="slider-header">
              <label>Monthly Deposit</label>
              <input
                type="text"
                value={`₹${monthlyDeposit.toLocaleString('en-IN')}`}
                onChange={(e) => {
                  const val = e.target.value.replace(/[₹,\s]/g, '');
                  if (val === '') {
                    setMonthlyDeposit('');
                    return;
                  }
                  const num = parseInt(val);
                  if (!isNaN(num)) {
                    setMonthlyDeposit(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[₹,\s]/g, '');
                  const num = parseInt(val);
                  
                  if (val === '' || isNaN(num)) {
                    setMonthlyDeposit(5000);
                  } else if (num < 500) {
                    setMonthlyDeposit(500);
                  } else if (num > 100000) {
                    setMonthlyDeposit(100000);
                  } else {
                    setMonthlyDeposit(num);
                  }
                }}
                className="input-display"
              />
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>₹500</span>
              <span>₹1L</span>
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
              <label>RD Tenure</label>
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
                  } else if (num < 6) {
                    setTenure(6);
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
              min="6"
              max="120"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>6 Months</span>
              <span>120 Months</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="calculator-results">
            <h2>Your RD Maturity Details</h2>
            
            <div className="result-card highlight">
              <div className="result-label">MATURITY AMOUNT</div>
              <div className="result-value">₹{Number(result.maturityAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>

            <div className="result-cards">
              <div className="result-card">
                <div className="result-label">TOTAL DEPOSITED</div>
                <div className="result-value">₹{Number(result.totalDeposited).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>

              <div className="result-card">
                <div className="result-label">INTEREST EARNED</div>
                <div className="result-value">₹{Number(result.interestEarned).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
            </div>

            <div className="pie-chart-container">
              <div 
                className="pie-chart" 
                style={{
                  background: `conic-gradient(
                    #667eea 0% ${(result.totalDeposited / result.maturityAmount * 100).toFixed(1)}%,
                    #10b981 ${(result.totalDeposited / result.maturityAmount * 100).toFixed(1)}% 100%
                  )`
                }}>
                <div className="pie-center">
                  <span>Total</span>
                  <strong>₹{Number(result.maturityAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Deposited: ₹{Number(result.totalDeposited).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
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

      <div className="calculator-external-actions">
        <button onClick={handleReset} className="btn-reset">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset to Default
        </button>
      </div>

      {/* SEO Content Section */}
      <div className="seo-content-section">
        <div className="content-block">
          <h2>What is Recurring Deposit (RD)?</h2>
          <p>
            A Recurring Deposit (RD) is a savings instrument offered by banks and post offices where you deposit a fixed amount every month for a 
            predetermined period and earn interest on your savings. Unlike Fixed Deposits where you invest a lump sum, RD allows you to save small 
            amounts regularly, making it perfect for salaried individuals and those with consistent monthly income. It combines the discipline of 
            regular savings with the safety and guaranteed returns of a fixed deposit.
          </p>
          <p>
            RDs are ideal for building an emergency fund, saving for short-term goals like vacations or gadget purchases, or cultivating a savings 
            habit. Interest rates are comparable to FDs (typically 6-7.5%), and deposits are insured up to ₹5 lakh by DICGC. The monthly deposit 
            amount remains fixed throughout the tenure, and missing installments may attract penalties. Most banks offer auto-debit facilities, 
            making it convenient for automated savings without manual effort every month.
          </p>
        </div>

        <div className="content-block">
          <h2>How RD Interest is Calculated - Formula Explained</h2>
          
          <div className="formula-box">
            <strong>M = P × [((1 + r)^n - 1) / r] × (1 + r)</strong>
          </div>
          
          <p><strong>Where:</strong></p>
          <ul>
            <li><strong>M</strong> = Maturity Amount (total deposits + interest)</li>
            <li><strong>P</strong> = Monthly deposit amount</li>
            <li><strong>r</strong> = Monthly interest rate (Annual rate ÷ 12 ÷ 100)</li>
            <li><strong>n</strong> = Number of monthly installments (tenure in months)</li>
          </ul>

          <p><strong>Example Calculation:</strong></p>
          <p>
            For ₹5,000 monthly deposit at 7% annual interest for 2 years (24 months):
          </p>
          <ul>
            <li>P = ₹5,000</li>
            <li>r = 7% ÷ 12 ÷ 100 = 0.005833</li>
            <li>n = 24 months</li>
            <li><strong>Maturity Amount = ₹1,28,484</strong></li>
            <li><strong>Total Deposited = ₹1,20,000</strong></li>
            <li><strong>Interest Earned = ₹8,484</strong></li>
          </ul>

          <p>
            <strong>Note:</strong> RD interest is compounded quarterly in most banks, meaning interest is calculated and added to your balance every 
            3 months. This compounding effect increases your overall returns compared to simple interest.
          </p>
        </div>

        <div className="content-block">
          <h2>RD vs FD vs SIP - Which is Better?</h2>
          
          <h3>Recurring Deposit (RD)</h3>
          <ul>
            <li><strong>Investment Mode:</strong> Fixed monthly deposits</li>
            <li><strong>Returns:</strong> 6-7.5% guaranteed (quarterly compounding)</li>
            <li><strong>Risk:</strong> Very low - DICGC insured up to ₹5 lakh</li>
            <li><strong>Liquidity:</strong> Moderate - premature withdrawal allowed with penalty</li>
            <li><strong>Tenure:</strong> 6 months to 10 years</li>
            <li><strong>Best For:</strong> Risk-averse regular savers, short-term goals, emergency fund building</li>
          </ul>

          <h3>Fixed Deposit (FD)</h3>
          <ul>
            <li><strong>Investment Mode:</strong> One-time lump sum</li>
            <li><strong>Returns:</strong> 6.5-8% guaranteed (quarterly compounding)</li>
            <li><strong>Risk:</strong> Very low - DICGC insured</li>
            <li><strong>Liquidity:</strong> Good - premature withdrawal with penalty</li>
            <li><strong>Tenure:</strong> 7 days to 10 years</li>
            <li><strong>Best For:</strong> Lumpsum parking, slightly higher returns than RD, fixed tenure goals</li>
          </ul>

          <h3>Systematic Investment Plan (SIP)</h3>
          <ul>
            <li><strong>Investment Mode:</strong> Fixed monthly in mutual funds</li>
            <li><strong>Returns:</strong> 10-15% potential (market-linked, not guaranteed)</li>
            <li><strong>Risk:</strong> Moderate to high - market volatility</li>
            <li><strong>Liquidity:</strong> Excellent - redeem anytime (except ELSS)</li>
            <li><strong>Tenure:</strong> Flexible, ideally 5+ years</li>
            <li><strong>Best For:</strong> Long-term wealth creation, higher return seekers, inflation-beating growth</li>
          </ul>

          <p>
            <strong>Verdict:</strong> Choose RD for guaranteed short-term savings with capital protection. Choose FD if you have lumpsum to park 
            safely. Choose SIP for long-term wealth building with higher return potential. Many investors use a combination - RD for emergency fund, 
            SIP for retirement, and FD for parking bonus/maturity proceeds.
          </p>
        </div>

        <div className="content-block">
          <h2>Types of Recurring Deposits</h2>
          
          <h3>Regular Bank RD</h3>
          <p>
            Offered by all scheduled banks with tenures from 6 months to 10 years. Interest rates range from 6% to 7.5% depending on bank and tenure. 
            Quarterly compounding increases effective returns. Suitable for building savings corpus for vacations, gadgets, or small expenses.
          </p>

          <h3>Post Office RD</h3>
          <p>
            Government-backed RD scheme with 5-year lock-in and current interest rate around 6.7%. Considered extremely safe with sovereign guarantee. 
            Available at all post offices across India. Ideal for conservative investors seeking government security, especially in rural areas.
          </p>

          <h3>Senior Citizen RD</h3>
          <p>
            Special RD for citizens aged 60+ offering 0.25% to 0.50% higher interest rates than regular RDs. Most banks provide this benefit automatically. 
            Helps senior citizens earn higher fixed income on their monthly savings. Some banks offer special schemes with quarterly interest payouts.
          </p>

          <h3>NRI Recurring Deposit</h3>
          <p>
            Available for Non-Resident Indians through NRO/NRE accounts. Interest rates similar to resident RDs but subject to TDS and repatriation rules. 
            Helps NRIs save regularly in rupees and benefit from rupee appreciation. Check with your bank for NRI-specific RD features and taxation.
          </p>
        </div>

        <div className="content-block">
          <h2>Current RD Interest Rates (2024-25)</h2>
          <p>RD rates vary by bank and tenure. Here's an approximate range for popular institutions:</p>
          
          <h3>Public Sector Banks</h3>
          <ul>
            <li><strong>SBI RD:</strong> 6.50% - 7.00% (general), 7.00% - 7.50% (senior citizens)</li>
            <li><strong>PNB RD:</strong> 6.50% - 7.25% (general), 7.00% - 7.75% (senior citizens)</li>
            <li><strong>Bank of Baroda:</strong> 6.50% - 7.15% (general), 7.00% - 7.65% (senior citizens)</li>
          </ul>

          <h3>Private Sector Banks</h3>
          <ul>
            <li><strong>HDFC Bank:</strong> 6.50% - 7.40% (general), 7.00% - 7.90% (senior citizens)</li>
            <li><strong>ICICI Bank:</strong> 6.60% - 7.30% (general), 7.10% - 7.80% (senior citizens)</li>
            <li><strong>Axis Bank:</strong> 6.70% - 7.35% (general), 7.20% - 7.85% (senior citizens)</li>
          </ul>

          <h3>Small Finance Banks</h3>
          <ul>
            <li><strong>Ujjivan SFB:</strong> 7.25% - 8.25%</li>
            <li><strong>Jana SFB:</strong> 7.50% - 8.50%</li>
            <li><strong>Equitas SFB:</strong> 7.25% - 8.00%</li>
          </ul>

          <h3>Post Office</h3>
          <ul>
            <li><strong>Post Office RD:</strong> 6.7% (5-year tenure, quarterly compounding)</li>
          </ul>

          <p><em>Note: Rates are indicative and subject to change based on RBI policy. Always verify current rates before opening an RD.</em></p>
        </div>

        <div className="content-block">
          <h2>Advantages of Using RD Calculator</h2>
          <ul>
            <li><strong>Goal-Based Planning:</strong> Calculate exact monthly savings needed to reach specific financial targets</li>
            <li><strong>Compare Banks & Tenures:</strong> Test different interest rates and periods to find best returns</li>
            <li><strong>Maturity Amount Projection:</strong> Know precisely how much you'll receive at the end of tenure</li>
            <li><strong>Discipline Building:</strong> Visualize long-term benefits of consistent monthly savings</li>
            <li><strong>Interest Earnings Preview:</strong> See how much extra you earn compared to simply saving in savings account</li>
            <li><strong>Multiple Scenario Testing:</strong> Try various monthly amounts to find what fits your budget</li>
            <li><strong>Better than Manual Calculation:</strong> Accurate quarterly compounding calculations in seconds</li>
          </ul>
        </div>

        <div className="content-block">
          <h2>How to Use This RD Calculator</h2>
          <ol>
            <li><strong>Enter Monthly Deposit:</strong> Input amount you can save monthly (₹500 to ₹1 lakh)</li>
            <li><strong>Set Interest Rate:</strong> Enter annual rate offered by your bank (typically 6-8%)</li>
            <li><strong>Choose Tenure:</strong> Select RD duration from 6 months to 120 months (10 years)</li>
            <li><strong>View Maturity Details:</strong> Instantly see maturity amount, total deposited, and interest earned</li>
            <li><strong>Compare Options:</strong> Adjust values to compare different banks, tenures, or monthly amounts</li>
            <li><strong>Plan Your Savings:</strong> Use results to decide optimal RD amount and tenure for your goals</li>
          </ol>
        </div>

        <div className="content-block">
          <h2>Tips to Maximize RD Returns</h2>
          <ul>
            <li><strong>Compare Interest Rates:</strong> Small finance banks often offer 0.5-1% higher than PSU banks - compare before opening</li>
            <li><strong>Choose Longer Tenure:</strong> Longer RDs usually fetch better rates and benefit more from compounding</li>
            <li><strong>Set Auto-Debit:</strong> Avoid missing installments and penalties by enabling auto-debit on salary date</li>
            <li><strong>Senior Citizen Benefits:</strong> If 60+, extra 0.25-0.50% can add ₹1,500-3,000 on 5-year ₹10K/month RD</li>
            <li><strong>Don't Withdraw Early:</strong> Premature closure reduces interest rate significantly - plan tenure carefully</li>
            <li><strong>Open Multiple RDs:</strong> Ladder RDs with different maturity dates for regular liquidity without losing returns</li>
            <li><strong>Link to Salary Account:</strong> Get reminders and seamless auto-debit from your salary account</li>
            <li><strong>Renew on Maturity:</strong> Immediately reinvest maturity amount to maintain savings momentum and compounding benefit</li>
          </ul>
        </div>

        <div className="content-block faq-section">
          <h2>Frequently Asked Questions (FAQs)</h2>
          
          <div className="faq-item">
            <h3>What happens if I miss an RD installment?</h3>
            <p>
              Missing RD installments attracts penalty, typically ₹1-5 per ₹100 of monthly deposit per month of delay. For example, missing one 
              ₹5,000 installment for 1 month may cost ₹50-250 penalty. Some banks allow 1-2 grace days. After multiple defaults (usually 3-4), banks 
              may close the RD and refund your money with reduced interest (savings account rate). To avoid this, enable auto-debit or set reminders. 
              Some banks allow lump sum payment of missed installments with penalty during tenure continuation.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I increase or decrease RD monthly deposit amount?</h3>
            <p>
              No, the monthly deposit amount is fixed at the time of opening and cannot be changed during the tenure. This is a fundamental rule of 
              RDs. If your financial situation changes, you have two options: (1) Open an additional RD account with different amount, or (2) Close 
              existing RD prematurely and open new one with desired amount (though this attracts interest penalty). Some banks allow multiple RD accounts, 
              so you can run several RDs with different amounts and maturities simultaneously.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is RD better than saving in a savings account?</h3>
            <p>
              Yes, RD is significantly better than savings accounts. Savings accounts offer only 2.5-4% interest, while RDs give 6-7.5%, nearly double 
              the returns. For ₹10,000 monthly: savings account adds ~₹8,000 interest in 5 years vs RD adds ~₹42,000 - that's ₹34,000 extra! RD also 
              enforces savings discipline through fixed monthly commitment. The quarterly compounding in RD further boosts returns. Only keep emergency 
              funds in savings account (3-6 months expenses); move rest to RD, FD, or mutual funds for better wealth growth.
            </p>
          </div>

          <div className="faq-item">
            <h3>How is RD interest taxed?</h3>
            <p>
              RD interest is fully taxable as "Income from Other Sources" at your income tax slab rate (up to 30% + cess). Banks deduct TDS at 10% 
              if annual interest exceeds ₹40,000 (₹50,000 for senior citizens). If your total income is below taxable limit, submit Form 15G/15H to 
              avoid TDS. Unlike equity mutual funds, there's no special tax treatment or indexation benefit. Post Office RDs follow same tax rules. 
              For high tax bracket investors, debt mutual funds may be more tax-efficient for longer investment horizons due to lower tax rates on 
              long-term capital gains.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I take a loan against my RD account?</h3>
            <p>
              Yes, most banks offer loans against RD, typically up to 80-90% of the maturity value. Interest charged is usually 1-2% above the RD 
              interest rate. For example, if RD earns 7% and loan costs 8.5%, your net cost is only 1.5%. This is useful for emergency needs without 
              breaking your RD and losing interest. The RD continues to earn interest while loan is outstanding. Loan is automatically adjusted from 
              maturity amount. Some banks require minimum 6-12 months of RD tenure completion before sanctioning loan. Check with your bank for specific 
              policies and interest rates on RD-backed loans.
            </p>
          </div>

          <div className="faq-item">
            <h3>Which is better - Post Office RD or Bank RD?</h3>
            <p>
              <strong>Post Office RD:</strong> Safer (government-backed), consistent 6.7% rate, available pan-India including rural areas, mandatory 
              5-year tenure, suitable for risk-averse investors. <strong>Bank RD:</strong> Flexible tenures (6 months to 10 years), often higher rates 
              (6.5-8.5%), convenient online access and auto-debit, easier premature withdrawal, better for urban users. Choose Post Office if you 
              prioritize absolute safety and are comfortable with 5-year lock-in. Choose bank RD if you want flexibility in tenure and potentially 
              higher returns. Private/small finance banks typically offer 0.5-1% more than Post Office, making them attractive if you're comfortable 
              with DICGC insurance coverage.
            </p>
          </div>
        </div>

        <div className="related-calculators">
          <h2>Related Financial Calculators</h2>
          <p>Explore our other calculators to plan your finances better:</p>
          <div className="calculator-grid">
            <a href="/calculators/fd" className="calc-card">
              <h3>FD Calculator</h3>
              <p>Calculate fixed deposit maturity and returns</p>
            </a>
            <a href="/calculators/sip" className="calc-card">
              <h3>SIP Calculator</h3>
              <p>Calculate mutual fund SIP and lumpsum returns</p>
            </a>
            <a href="/calculators/savings-goal" className="calc-card">
              <h3>Savings Goal Calculator</h3>
              <p>Plan monthly savings to achieve financial goals</p>
            </a>
            <a href="/calculators/emi" className="calc-card">
              <h3>EMI Calculator</h3>
              <p>Calculate loan EMI and total interest payable</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RDCalculator;
