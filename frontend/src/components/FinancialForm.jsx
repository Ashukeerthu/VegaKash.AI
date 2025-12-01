import React, { useState } from 'react';
import { sampleData, goalTypes, currencies } from '../utils/helpers';

/**
 * Financial Form Component
 * Main input form for user's financial data
 */
function FinancialForm({ onCalculate, onReset, isCalculating }) {
  // Form state
  const [formData, setFormData] = useState({
    currency: 'INR',
    monthly_income_primary: '',
    monthly_income_additional: '',
    expenses: {
      housing_rent: '',
      groceries_food: '',
      transport: '',
      utilities: '',
      insurance: '',
      entertainment: '',
      subscriptions: '',
      others: '',
    },
    goals: {
      monthly_savings_target: '',
      emergency_fund_target: '',
      primary_goal_type: '',
      primary_goal_amount: '',
    },
    loans: [],
  });

  // Multiple loans state
  const [loans, setLoans] = useState([]);
  const [loanInputMode, setLoanInputMode] = useState('emi'); // 'emi' or 'principal'
  const [currentLoan, setCurrentLoan] = useState({
    name: '',
    input_mode: 'emi',
    monthly_emi: '',
    outstanding_principal: '',
    interest_rate_annual: '',
    remaining_months: '',
  });
  const [editingLoanIndex, setEditingLoanIndex] = useState(null);
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('expenses.')) {
      const expenseKey = name.replace('expenses.', '');
      setFormData(prev => ({
        ...prev,
        expenses: {
          ...prev.expenses,
          [expenseKey]: value,
        },
      }));
    } else if (name.startsWith('goals.')) {
      const goalKey = name.replace('goals.', '');
      setFormData(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [goalKey]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Handle loan input changes
   */
  const handleLoanChange = (e) => {
    const { name, value } = e.target;
    setCurrentLoan(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Add or update loan
   */
  const handleAddLoan = () => {
    const newErrors = {};
    
    if (!currentLoan.name) newErrors.loan_name = 'Loan name is required';
    
    // Validation based on input mode
    if (loanInputMode === 'emi') {
      if (!currentLoan.monthly_emi || parseFloat(currentLoan.monthly_emi) <= 0) {
        newErrors.loan_emi = 'Monthly EMI is required and must be greater than 0';
      }
    } else {
      if (!currentLoan.outstanding_principal || parseFloat(currentLoan.outstanding_principal) <= 0) {
        newErrors.loan_principal = 'Principal amount is required and must be greater than 0';
      }
    }
    
    if (!currentLoan.interest_rate_annual || parseFloat(currentLoan.interest_rate_annual) <= 0) {
      newErrors.loan_interest = 'Interest rate is required and must be greater than 0';
    }
    if (!currentLoan.remaining_months || parseInt(currentLoan.remaining_months) <= 0) {
      newErrors.loan_months = 'Remaining months is required and must be greater than 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare loan data with correct mode
    const loanData = {
      ...currentLoan,
      input_mode: loanInputMode,
    };
    
    if (editingLoanIndex !== null) {
      // Update existing loan
      const updatedLoans = [...loans];
      updatedLoans[editingLoanIndex] = loanData;
      setLoans(updatedLoans);
      setEditingLoanIndex(null);
    } else {
      // Add new loan
      setLoans([...loans, loanData]);
    }
    
    // Reset form
    setCurrentLoan({
      name: '',
      input_mode: loanInputMode,
      monthly_emi: '',
      outstanding_principal: '',
      interest_rate_annual: '',
      remaining_months: '',
    });
    setErrors({});
  };

  /**
   * Edit loan
   */
  const handleEditLoan = (index) => {
    const loan = loans[index];
    setCurrentLoan({ ...loan });
    setLoanInputMode(loan.input_mode || 'emi');
    setEditingLoanIndex(index);
  };

  /**
   * Remove loan
   */
  const handleRemoveLoan = (index) => {
    const updatedLoans = loans.filter((_, i) => i !== index);
    setLoans(updatedLoans);
    if (editingLoanIndex === index) {
      setCurrentLoan({
        name: '',
        input_mode: loanInputMode,
        monthly_emi: '',
        outstanding_principal: '',
        interest_rate_annual: '',
        remaining_months: '',
      });
      setEditingLoanIndex(null);
    }
  };

  /**
   * Cancel loan editing
   */
  const handleCancelLoanEdit = () => {
    setCurrentLoan({
      name: '',
      input_mode: loanInputMode,
      monthly_emi: '',
      outstanding_principal: '',
      interest_rate_annual: '',
      remaining_months: '',
    });
    setEditingLoanIndex(null);
    setErrors({});
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validate income
    if (!formData.monthly_income_primary || parseFloat(formData.monthly_income_primary) <= 0) {
      newErrors.monthly_income_primary = 'Primary income is required and must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Convert form data to API format
   */
  const prepareDataForAPI = () => {
    const data = {
      currency: formData.currency,
      monthly_income_primary: parseFloat(formData.monthly_income_primary) || 0,
      monthly_income_additional: parseFloat(formData.monthly_income_additional) || 0,
      expenses: {
        housing_rent: parseFloat(formData.expenses.housing_rent) || 0,
        groceries_food: parseFloat(formData.expenses.groceries_food) || 0,
        transport: parseFloat(formData.expenses.transport) || 0,
        utilities: parseFloat(formData.expenses.utilities) || 0,
        insurance: parseFloat(formData.expenses.insurance) || 0,
        entertainment: parseFloat(formData.expenses.entertainment) || 0,
        subscriptions: parseFloat(formData.expenses.subscriptions) || 0,
        others: parseFloat(formData.expenses.others) || 0,
      },
      goals: {
        monthly_savings_target: parseFloat(formData.goals.monthly_savings_target) || 0,
        emergency_fund_target: parseFloat(formData.goals.emergency_fund_target) || 0,
        primary_goal_type: formData.goals.primary_goal_type || null,
        primary_goal_amount: formData.goals.primary_goal_amount ? parseFloat(formData.goals.primary_goal_amount) : null,
      },
      loans: loans.map(loan => {
        const baseLoan = {
          name: loan.name,
          input_mode: loan.input_mode || 'emi',
          interest_rate_annual: parseFloat(loan.interest_rate_annual),
          remaining_months: parseInt(loan.remaining_months),
        };
        
        // Add mode-specific fields
        if (loan.input_mode === 'emi') {
          baseLoan.monthly_emi = parseFloat(loan.monthly_emi);
          baseLoan.outstanding_principal = null;
        } else {
          baseLoan.outstanding_principal = parseFloat(loan.outstanding_principal);
          baseLoan.monthly_emi = null;
        }
        
        return baseLoan;
      }),
    };
    
    return data;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const apiData = prepareDataForAPI();
    onCalculate(apiData);
  };

  /**
   * Load sample data
   */
  const handleUseSampleData = () => {
    setFormData({
      currency: sampleData.currency,
      monthly_income_primary: sampleData.monthly_income_primary.toString(),
      monthly_income_additional: sampleData.monthly_income_additional.toString(),
      expenses: {
        housing_rent: sampleData.expenses.housing_rent.toString(),
        groceries_food: sampleData.expenses.groceries_food.toString(),
        transport: sampleData.expenses.transport.toString(),
        utilities: sampleData.expenses.utilities.toString(),
        insurance: sampleData.expenses.insurance.toString(),
        entertainment: sampleData.expenses.entertainment.toString(),
        subscriptions: sampleData.expenses.subscriptions.toString(),
        others: sampleData.expenses.others.toString(),
      },
      goals: {
        monthly_savings_target: sampleData.goals.monthly_savings_target.toString(),
        emergency_fund_target: sampleData.goals.emergency_fund_target.toString(),
        primary_goal_type: sampleData.goals.primary_goal_type,
        primary_goal_amount: sampleData.goals.primary_goal_amount.toString(),
      },
      loans: [],
    });
    
    if (sampleData.loans && sampleData.loans.length > 0) {
      setLoans(sampleData.loans.map(loan => ({
        name: loan.name,
        input_mode: loan.input_mode || 'emi',
        monthly_emi: loan.monthly_emi ? loan.monthly_emi.toString() : '',
        outstanding_principal: loan.outstanding_principal ? loan.outstanding_principal.toString() : '',
        interest_rate_annual: loan.interest_rate_annual.toString(),
        remaining_months: loan.remaining_months.toString(),
      })));
    }
  };

  /**
   * Reset form
   */
  const handleResetForm = () => {
    setFormData({
      currency: 'INR',
      monthly_income_primary: '',
      monthly_income_additional: '',
      expenses: {
        housing_rent: '',
        groceries_food: '',
        transport: '',
        utilities: '',
        insurance: '',
        entertainment: '',
        subscriptions: '',
        others: '',
      },
      goals: {
        monthly_savings_target: '',
        emergency_fund_target: '',
        primary_goal_type: '',
        primary_goal_amount: '',
      },
      loans: [],
    });
    setLoans([]);
    setCurrentLoan({
      name: '',
      outstanding_principal: '',
      interest_rate_annual: '',
      remaining_months: '',
    });
    setEditingLoanIndex(null);
    setErrors({});
    onReset();
  };

  return (
    <div className="financial-form-container" id="financial-form">
      <div className="form-header">
        <h2>Your Financial Information</h2>
        <p>Enter your monthly income, expenses, and goals</p>
      </div>
      
      <form onSubmit={handleSubmit} className="financial-form">
        {/* Currency & Income Section */}
        <div className="form-section-inner">
          <h3>💰 Income & Currency</h3>
          
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="form-input"
              >
                {currencies.map(curr => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="monthly_income_primary">
                Primary Income <span className="required">*</span>
              </label>
              <input
                type="number"
                id="monthly_income_primary"
                name="monthly_income_primary"
                value={formData.monthly_income_primary}
                onChange={handleInputChange}
                placeholder="e.g., 75000"
                min="0"
                step="0.01"
                className={`form-input ${errors.monthly_income_primary ? 'error' : ''}`}
                required
              />
              {errors.monthly_income_primary && (
                <span className="error-message">{errors.monthly_income_primary}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="monthly_income_additional">Additional Income (Optional)</label>
              <input
                type="number"
                id="monthly_income_additional"
                name="monthly_income_additional"
                value={formData.monthly_income_additional}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="form-section-inner">
          <h3>📊 Monthly Expenses</h3>
          
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="housing_rent">Housing / Rent</label>
              <input
                type="number"
                id="housing_rent"
                name="expenses.housing_rent"
                value={formData.expenses.housing_rent}
                onChange={handleInputChange}
                placeholder="e.g., 20000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="groceries_food">Groceries & Food</label>
              <input
                type="number"
                id="groceries_food"
                name="expenses.groceries_food"
                value={formData.expenses.groceries_food}
                onChange={handleInputChange}
                placeholder="e.g., 12000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="transport">Transport</label>
              <input
                type="number"
                id="transport"
                name="expenses.transport"
                value={formData.expenses.transport}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="utilities">Utilities</label>
              <input
                type="number"
                id="utilities"
                name="expenses.utilities"
                value={formData.expenses.utilities}
                onChange={handleInputChange}
                placeholder="e.g., 3000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="insurance">Insurance</label>
              <input
                type="number"
                id="insurance"
                name="expenses.insurance"
                value={formData.expenses.insurance}
                onChange={handleInputChange}
                placeholder="e.g., 2500"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="entertainment">Entertainment</label>
              <input
                type="number"
                id="entertainment"
                name="expenses.entertainment"
                value={formData.expenses.entertainment}
                onChange={handleInputChange}
                placeholder="e.g., 4000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subscriptions">Subscriptions</label>
              <input
                type="number"
                id="subscriptions"
                name="expenses.subscriptions"
                value={formData.expenses.subscriptions}
                onChange={handleInputChange}
                placeholder="e.g., 1500"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="others">Others</label>
              <input
                type="number"
                id="others"
                name="expenses.others"
                value={formData.expenses.others}
                onChange={handleInputChange}
                placeholder="e.g., 3000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="form-section-inner">
          <h3>🎯 Financial Goals</h3>
          
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="monthly_savings_target">Monthly Savings Target</label>
              <input
                type="number"
                id="monthly_savings_target"
                name="goals.monthly_savings_target"
                value={formData.goals.monthly_savings_target}
                onChange={handleInputChange}
                placeholder="e.g., 15000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="emergency_fund_target">Emergency Fund Target</label>
              <input
                type="number"
                id="emergency_fund_target"
                name="goals.emergency_fund_target"
                value={formData.goals.emergency_fund_target}
                onChange={handleInputChange}
                placeholder="e.g., 300000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="primary_goal_type">Primary Goal Type</label>
              <select
                id="primary_goal_type"
                name="goals.primary_goal_type"
                value={formData.goals.primary_goal_type}
                onChange={handleInputChange}
                className="form-input"
              >
                {goalTypes.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.goals.primary_goal_type && (
              <div className="form-group">
              <label htmlFor="primary_goal_amount">Primary Goal Amount</label>
              <input
                type="number"
                id="primary_goal_amount"
                name="goals.primary_goal_amount"
                value={formData.goals.primary_goal_amount}
                onChange={handleInputChange}
                placeholder="e.g., 2000000"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            )}
          </div>
        </div>

        {/* Loans Section */}
        <div className="form-section-inner">
          <h3>💳 Active Loans (Optional)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Add all your active loans. The EMI for each loan will be automatically calculated.
          </p>
          
          {/* Added Loans List */}
          {loans.length > 0 && (
            <div className="loans-list" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Your Loans ({loans.length})</h4>
              {loans.map((loan, index) => (
                <div key={index} className="loan-item" style={{
                  background: 'var(--bg-secondary)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      {loan.name} {loan.input_mode === 'emi' ? '💰' : '📊'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {loan.input_mode === 'emi' ? (
                        <>EMI: ₹{parseFloat(loan.monthly_emi || 0).toLocaleString()}/month</>
                      ) : (
                        <>Principal: ₹{parseFloat(loan.outstanding_principal || 0).toLocaleString()}</>
                      )} @ {loan.interest_rate_annual}% • {loan.remaining_months} months
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleEditLoan(index)}
                      className="btn btn-outline"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveLoan(index)}
                      className="btn"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'var(--danger-color)', color: 'white' }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Loan Input Form */}
          <div className="loan-form" style={{
            background: 'var(--bg-tertiary)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--border-color)'
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {editingLoanIndex !== null ? '✏️ Edit Loan' : '➕ Add New Loan'}
            </h4>
            
            {/* Input Mode Toggle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                How would you like to enter your loan details?
              </label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ 
                  flex: '1', 
                  minWidth: '200px',
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  border: `2px solid ${loanInputMode === 'emi' ? '#667eea' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: loanInputMode === 'emi' ? 'rgba(102, 126, 234, 0.05)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <input
                    type="radio"
                    name="loanInputMode"
                    value="emi"
                    checked={loanInputMode === 'emi'}
                    onChange={(e) => setLoanInputMode(e.target.value)}
                    style={{ marginRight: '0.75rem' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>💰 I know my monthly EMI</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Most common - Enter the amount you pay monthly</div>
                  </div>
                </label>
                
                <label style={{ 
                  flex: '1', 
                  minWidth: '200px',
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  border: `2px solid ${loanInputMode === 'principal' ? '#667eea' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: loanInputMode === 'principal' ? 'rgba(102, 126, 234, 0.05)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <input
                    type="radio"
                    name="loanInputMode"
                    value="principal"
                    checked={loanInputMode === 'principal'}
                    onChange={(e) => setLoanInputMode(e.target.value)}
                    style={{ marginRight: '0.75rem' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>📊 I know the loan principal</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Advanced - Enter outstanding balance</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="loan_name">Loan Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="loan_name"
                  name="name"
                  value={currentLoan.name}
                  onChange={handleLoanChange}
                  placeholder="e.g., Car Loan, Home Loan"
                  className={`form-input ${errors.loan_name ? 'error' : ''}`}
                />
                {errors.loan_name && (
                  <span className="error-message">{errors.loan_name}</span>
                )}
              </div>
              
              {loanInputMode === 'emi' ? (
                <div className="form-group">
                  <label htmlFor="loan_emi">Monthly EMI <span className="required">*</span></label>
                  <input
                    type="number"
                    id="loan_emi"
                    name="monthly_emi"
                    value={currentLoan.monthly_emi}
                    onChange={handleLoanChange}
                    placeholder="e.g., 15000"
                    min="0"
                    step="0.01"
                    className={`form-input ${errors.loan_emi ? 'error' : ''}`}
                  />
                  {errors.loan_emi && (
                    <span className="error-message">{errors.loan_emi}</span>
                  )}
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    The amount you pay monthly (check your bank statement)
                  </small>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="loan_principal">Outstanding Principal <span className="required">*</span></label>
                  <input
                    type="number"
                    id="loan_principal"
                    name="outstanding_principal"
                    value={currentLoan.outstanding_principal}
                    onChange={handleLoanChange}
                    placeholder="e.g., 400000"
                    min="0"
                    step="0.01"
                    className={`form-input ${errors.loan_principal ? 'error' : ''}`}
                  />
                  {errors.loan_principal && (
                    <span className="error-message">{errors.loan_principal}</span>
                  )}
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    The remaining balance on your loan
                  </small>
                </div>
              )}
            </div>
            
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="loan_interest">Annual Interest Rate (%) <span className="required">*</span></label>
                <input
                  type="number"
                  id="loan_interest"
                  name="interest_rate_annual"
                  value={currentLoan.interest_rate_annual}
                  onChange={handleLoanChange}
                  placeholder="e.g., 8.5"
                  min="0"
                  step="0.01"
                  className={`form-input ${errors.loan_interest ? 'error' : ''}`}
                />
                {errors.loan_interest && (
                  <span className="error-message">{errors.loan_interest}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="loan_months">Remaining Months <span className="required">*</span></label>
                <input
                  type="number"
                  id="loan_months"
                  name="remaining_months"
                  value={currentLoan.remaining_months}
                  onChange={handleLoanChange}
                  placeholder="e.g., 36"
                  min="1"
                  className={`form-input ${errors.loan_months ? 'error' : ''}`}
                />
                {errors.loan_months && (
                  <span className="error-message">{errors.loan_months}</span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={handleAddLoan}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {editingLoanIndex !== null ? '💾 Update Loan' : '➕ Add Loan'}
              </button>
              {editingLoanIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelLoanEdit}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : '🧮 Calculate Summary'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleUseSampleData}
            disabled={isCalculating}
          >
            📋 Use Sample Data
          </button>
          
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleResetForm}
            disabled={isCalculating}
          >
            🔄 Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default FinancialForm;

// ✅ Multiple loans with add/edit/remove functionality implemented
// TODO: Add input validation with real-time feedback
// TODO: Save form data to localStorage for persistence
// TODO: Add loan type categorization (Home, Car, Personal, etc.)
