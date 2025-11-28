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
      emi_loans: '',
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

  // Loan form state (for single loan in Phase 1)
  const [loanData, setLoanData] = useState({
    name: '',
    outstanding_principal: '',
    interest_rate_annual: '',
    remaining_months: '',
  });

  const [hasLoan, setHasLoan] = useState(false);
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
    setLoanData(prev => ({
      ...prev,
      [name]: value,
    }));
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
    
    // Validate loan data if loan checkbox is checked
    if (hasLoan) {
      if (!loanData.name) newErrors.loan_name = 'Loan name is required';
      if (!loanData.outstanding_principal || parseFloat(loanData.outstanding_principal) <= 0) {
        newErrors.loan_principal = 'Principal amount is required and must be greater than 0';
      }
      if (!loanData.interest_rate_annual || parseFloat(loanData.interest_rate_annual) <= 0) {
        newErrors.loan_interest = 'Interest rate is required and must be greater than 0';
      }
      if (!loanData.remaining_months || parseInt(loanData.remaining_months) <= 0) {
        newErrors.loan_months = 'Remaining months is required and must be greater than 0';
      }
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
        emi_loans: parseFloat(formData.expenses.emi_loans) || 0,
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
      loans: [],
    };
    
    // Add loan if provided
    if (hasLoan && loanData.name) {
      data.loans.push({
        name: loanData.name,
        outstanding_principal: parseFloat(loanData.outstanding_principal),
        interest_rate_annual: parseFloat(loanData.interest_rate_annual),
        remaining_months: parseInt(loanData.remaining_months),
      });
    }
    
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
        emi_loans: sampleData.expenses.emi_loans.toString(),
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
    
    if (sampleData.loans.length > 0) {
      setHasLoan(true);
      setLoanData({
        name: sampleData.loans[0].name,
        outstanding_principal: sampleData.loans[0].outstanding_principal.toString(),
        interest_rate_annual: sampleData.loans[0].interest_rate_annual.toString(),
        remaining_months: sampleData.loans[0].remaining_months.toString(),
      });
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
        emi_loans: '',
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
    setLoanData({
      name: '',
      outstanding_principal: '',
      interest_rate_annual: '',
      remaining_months: '',
    });
    setHasLoan(false);
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
        {/* Currency Selection */}
        <div className="form-section">
          <h3>Currency</h3>
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
        </div>

        {/* Income Section */}
        <div className="form-section">
          <h3>💰 Monthly Income</h3>
          
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

        {/* Expenses Section */}
        <div className="form-section">
          <h3>📊 Monthly Expenses</h3>
          
          <div className="form-grid">
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
              <label htmlFor="emi_loans">EMI / Loans</label>
              <input
                type="number"
                id="emi_loans"
                name="expenses.emi_loans"
                value={formData.expenses.emi_loans}
                onChange={handleInputChange}
                placeholder="e.g., 8000"
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
        <div className="form-section">
          <h3>🎯 Financial Goals</h3>
          
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

        {/* Loans Section */}
        <div className="form-section">
          <h3>💳 Active Loans (Optional)</h3>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={hasLoan}
                onChange={(e) => setHasLoan(e.target.checked)}
              />
              <span>I have an active loan</span>
            </label>
          </div>
          
          {hasLoan && (
            <div className="loan-form">
              <div className="form-group">
                <label htmlFor="loan_name">Loan Name</label>
                <input
                  type="text"
                  id="loan_name"
                  name="name"
                  value={loanData.name}
                  onChange={handleLoanChange}
                  placeholder="e.g., Car Loan"
                  className={`form-input ${errors.loan_name ? 'error' : ''}`}
                />
                {errors.loan_name && (
                  <span className="error-message">{errors.loan_name}</span>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="loan_principal">Outstanding Principal</label>
                  <input
                    type="number"
                    id="loan_principal"
                    name="outstanding_principal"
                    value={loanData.outstanding_principal}
                    onChange={handleLoanChange}
                    placeholder="e.g., 400000"
                    min="0"
                    step="0.01"
                    className={`form-input ${errors.loan_principal ? 'error' : ''}`}
                  />
                  {errors.loan_principal && (
                    <span className="error-message">{errors.loan_principal}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="loan_interest">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    id="loan_interest"
                    name="interest_rate_annual"
                    value={loanData.interest_rate_annual}
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
                  <label htmlFor="loan_months">Remaining Months</label>
                  <input
                    type="number"
                    id="loan_months"
                    name="remaining_months"
                    value={loanData.remaining_months}
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
            </div>
          )}
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

// TODO: Phase 2 - Add ability to add multiple loans with add/remove buttons
// TODO: Phase 2 - Add input validation with real-time feedback
// TODO: Phase 2 - Save form data to localStorage for persistence
