import React, { useState, useEffect } from 'react';
import { sampleData, goalTypes, currencies } from '../utils/helpers';
import { getCountries, getLifestyleOptions } from '../services/budgetPlannerApi';
import CitySelector from './CitySelector';

/**
 * Financial Form Component - V1.2 Enhanced
 * Main input form for user's financial data
 * Now includes: CitySelector, Household info, Lifestyle, Multiple goals
 */
function FinancialForm({ onCalculate, onReset, isCalculating }) {
  // Form state - V1.2 Enhanced
  const [formData, setFormData] = useState({
    currency: 'INR',
    monthly_income_primary: '',
    monthly_income_additional: '',
    
    // V1.2: Location data
    country: '',
    state: '',
    city: '',
    cityTier: 'other',
    col_multiplier: 1.0,
    
    // V1.2: Household & Lifestyle
    family_size: 1,
    lifestyle: 'moderate',
    
    // V1.2: Separated Fixed and Variable Expenses
    fixed_expenses: {
      housing_rent: '',
      utilities: '',
      insurance: '',
      medical: '',
      other_fixed: '',
    },
    variable_expenses: {
      groceries_food: '',
      transport: '',
      subscriptions: '',
      entertainment: '',
      shopping: '',
      dining_out: '',
      other_variable: '',
    },
    
    // Legacy expenses (for compatibility)
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
  
  // V1.2: Location & Lifestyle state
  const [countriesData, setCountriesData] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [lifestyleOptions, setLifestyleOptions] = useState([
    { value: 'minimal', label: 'Minimal', description: 'Essential spending only' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced lifestyle' },
    { value: 'comfort', label: 'Comfort', description: 'Comfortable living' },
    { value: 'premium', label: 'Premium', description: 'Luxury lifestyle' }
  ]);
  
  // V1.2: Multiple savings goals
  const [savingsGoals, setSavingsGoals] = useState([]);

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
  
  // V1.2: Load countries and lifestyle options on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [countriesResponse, lifestyleResponse] = await Promise.all([
          getCountries(),
          getLifestyleOptions()
        ]);
        
        // Transform countries data
        if (countriesResponse && countriesResponse.countries) {
          const transformed = {};
          countriesResponse.countries.forEach(country => {
            transformed[country.name] = {
              code: country.code,
              currency: country.currency,
              states: getDefaultStatesForCountry(country.name)
            };
          });
          setCountriesData({ countries: transformed });
        }
        
        if (lifestyleResponse && lifestyleResponse.lifestyles) {
          setLifestyleOptions(lifestyleResponse.lifestyles);
        }
      } catch (error) {
        console.error('Error loading options:', error);
      }
    };
    
    loadOptions();
  }, []);
  
  // V1.2: Helper function for default states/cities
  const getDefaultStatesForCountry = (countryName) => {
    const statesMap = {
      'India': {
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
        'Karnataka': ['Bangalore', 'Mysore'],
        'Tamil Nadu': ['Chennai', 'Coimbatore'],
        'Delhi': ['New Delhi'],
      },
      'United States': {
        'California': ['San Francisco', 'Los Angeles'],
        'New York': ['New York City', 'Buffalo'],
        'Texas': ['Austin', 'Houston', 'Dallas'],
      },
    };
    return statesMap[countryName] || { 'State 1': ['City 1'] };
  };
  
  // V1.2: Handle location changes
  const handleLocationChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      if (countriesData && countriesData.countries[value]) {
        setAvailableStates(Object.keys(countriesData.countries[value].states));
      }
    } else if (field === 'state') {
      setFormData(prev => ({ ...prev, city: '' }));
      if (countriesData && countriesData.countries[formData.country]) {
        setAvailableCities(countriesData.countries[formData.country].states[value] || []);
      }
    }
  };
  
  // V1.2: Handle savings goal management
  const addSavingsGoal = () => {
    setSavingsGoals([...savingsGoals, {
      name: '',
      target: '',
      timeline: '',
      priority: 3
    }]);
  };
  
  const updateSavingsGoal = (index, field, value) => {
    const updated = [...savingsGoals];
    updated[index][field] = value;
    setSavingsGoals(updated);
  };
  
  const removeSavingsGoal = (index) => {
    setSavingsGoals(savingsGoals.filter((_, i) => i !== index));
  };

  /**
   * Handle input changes - V1.2 Enhanced
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // V1.2: Handle fixed_expenses
    if (name.startsWith('fixed_expenses.')) {
      const expenseKey = name.replace('fixed_expenses.', '');
      setFormData(prev => ({
        ...prev,
        fixed_expenses: {
          ...prev.fixed_expenses,
          [expenseKey]: value,
        },
      }));
    }
    // V1.2: Handle variable_expenses
    else if (name.startsWith('variable_expenses.')) {
      const expenseKey = name.replace('variable_expenses.', '');
      setFormData(prev => ({
        ...prev,
        variable_expenses: {
          ...prev.variable_expenses,
          [expenseKey]: value,
        },
      }));
    }
    // Legacy: Handle expenses (for backward compatibility)
    else if (name.startsWith('expenses.')) {
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
      
      // V1.2: Location data with COL multiplier
      country: formData.country || null,
      state: formData.state || null,
      city: formData.city || null,
      city_tier: formData.cityTier || 'other',
      col_multiplier: parseFloat(formData.col_multiplier) || 1.0,
      
      // V1.2: Household & Lifestyle
      family_size: parseInt(formData.family_size) || 1,
      lifestyle: formData.lifestyle || 'moderate',
      
      // V1.2: Fixed expenses
      fixed_expenses: {
        housing_rent: parseFloat(formData.fixed_expenses?.housing_rent || formData.expenses?.housing_rent) || 0,
        utilities: parseFloat(formData.fixed_expenses?.utilities || formData.expenses?.utilities) || 0,
        insurance: parseFloat(formData.fixed_expenses?.insurance || formData.expenses?.insurance) || 0,
        medical: parseFloat(formData.fixed_expenses?.medical) || 0,
        other_fixed: parseFloat(formData.fixed_expenses?.other_fixed || formData.expenses?.others) || 0,
      },
      
      // V1.2: Variable expenses
      variable_expenses: {
        groceries_food: parseFloat(formData.variable_expenses?.groceries_food || formData.expenses?.groceries_food) || 0,
        transport: parseFloat(formData.variable_expenses?.transport || formData.expenses?.transport) || 0,
        subscriptions: parseFloat(formData.variable_expenses?.subscriptions || formData.expenses?.subscriptions) || 0,
        entertainment: parseFloat(formData.variable_expenses?.entertainment || formData.expenses?.entertainment) || 0,
        shopping: parseFloat(formData.variable_expenses?.shopping) || 0,
        dining_out: parseFloat(formData.variable_expenses?.dining_out) || 0,
        other_variable: parseFloat(formData.variable_expenses?.other_variable) || 0,
      },
      
      // Legacy expenses (for backward compatibility) - map from fixed/variable to legacy format
      expenses: {
        housing_rent: parseFloat(formData.fixed_expenses?.housing_rent || formData.expenses?.housing_rent) || 0,
        groceries_food: parseFloat(formData.variable_expenses?.groceries_food || formData.expenses?.groceries_food) || 0,
        transport: parseFloat(formData.variable_expenses?.transport || formData.expenses?.transport) || 0,
        utilities: parseFloat(formData.fixed_expenses?.utilities || formData.expenses?.utilities) || 0,
        insurance: parseFloat(formData.fixed_expenses?.insurance || formData.expenses?.insurance) || 0,
        entertainment: parseFloat(formData.variable_expenses?.entertainment || formData.expenses?.entertainment) || 0,
        subscriptions: parseFloat(formData.variable_expenses?.subscriptions || formData.expenses?.subscriptions) || 0,
        others: parseFloat(formData.fixed_expenses?.other_fixed || formData.variable_expenses?.other_variable || formData.expenses?.others) || 0,
      },
      
      // Goals (legacy format)
      goals: {
        monthly_savings_target: parseFloat(formData.goals.monthly_savings_target) || 0,
        emergency_fund_target: parseFloat(formData.goals.emergency_fund_target) || 0,
        primary_goal_type: formData.goals.primary_goal_type || null,
        primary_goal_amount: formData.goals.primary_goal_amount ? parseFloat(formData.goals.primary_goal_amount) : null,
      },
      
      // V1.2: Multiple savings goals
      savings_goals: savingsGoals.map(goal => ({
        name: goal.name,
        target: parseFloat(goal.target) || 0,
        timeline: parseInt(goal.timeline) || 12,
        priority: parseInt(goal.priority) || 3,
      })).filter(g => g.target > 0),
      
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
      
      // V1.2: Location data
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      cityTier: 'tier_1',
      col_multiplier: 1.5,
      
      // V1.2: Household & Lifestyle
      family_size: 3,
      lifestyle: 'moderate',
      
      // V1.2: Fixed expenses
      fixed_expenses: {
        housing_rent: sampleData.expenses.housing_rent.toString(),
        utilities: sampleData.expenses.utilities.toString(),
        insurance: sampleData.expenses.insurance.toString(),
        medical: '2000',
        other_fixed: '1000',
      },
      
      // V1.2: Variable expenses
      variable_expenses: {
        groceries_food: sampleData.expenses.groceries_food.toString(),
        transport: sampleData.expenses.transport.toString(),
        subscriptions: sampleData.expenses.subscriptions.toString(),
        entertainment: sampleData.expenses.entertainment.toString(),
        shopping: '3000',
        dining_out: '2500',
        other_variable: sampleData.expenses.others.toString(),
      },
      
      // Legacy expenses (for compatibility)
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
    
    // V1.2: Sample savings goals
    setSavingsGoals([{
      goal_type: 'Home',
      target_amount: '2000000',
      target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5).toISOString().split('T')[0], // 5 years from now
      priority: 'high'
    }]);
    
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
      
      // V1.2: Location data
      country: '',
      state: '',
      city: '',
      cityTier: 'other',
      col_multiplier: 1.0,
      
      // V1.2: Household & Lifestyle
      family_size: 1,
      lifestyle: 'moderate',
      
      // V1.2: Fixed expenses
      fixed_expenses: {
        housing_rent: '',
        utilities: '',
        insurance: '',
        medical: '',
        other_fixed: '',
      },
      
      // V1.2: Variable expenses
      variable_expenses: {
        groceries_food: '',
        transport: '',
        subscriptions: '',
        entertainment: '',
        shopping: '',
        dining_out: '',
        other_variable: '',
      },
      
      // Legacy expenses (for compatibility)
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
    
    // V1.2: Reset savings goals
    setSavingsGoals([]);
    
    setLoans([]);
    setCurrentLoan({
      name: '',
      input_mode: 'emi',
      monthly_emi: '',
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
        
        {/* V1.2: City Selector Section (Enhanced with CitySelector Component) */}
        <CitySelector
          selectedCountry={formData.country}
          selectedState={formData.state}
          selectedCity={formData.city}
          selectedTier={formData.cityTier}
          colMultiplier={formData.col_multiplier || 1.0}
          onChange={(cityData) => {
            setFormData(prev => ({
              ...prev,
              country: cityData.country,
              state: cityData.state,
              city: cityData.city,
              cityTier: cityData.city_tier,
              col_multiplier: cityData.col_multiplier
            }));
          }}
          disabled={isCalculating}
        />
        
        {/* V1.2: Household & Lifestyle Section */}
        <div className="form-section-inner">
          <h3>👥 Household & Lifestyle</h3>
          
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="family_size">Family Size</label>
              <input
                type="number"
                id="family_size"
                name="family_size"
                value={formData.family_size}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lifestyle">Lifestyle</label>
              <select
                id="lifestyle"
                name="lifestyle"
                value={formData.lifestyle}
                onChange={handleInputChange}
                className="form-input"
              >
                {lifestyleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* V1.2: Fixed Expenses Section */}
        <div className="form-section-inner">
          <h3>🏠 Fixed Expenses</h3>
          <p className="section-description">Regular monthly expenses that don't change much</p>
          
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="fixed_housing_rent">
                Rent/Mortgage
                <span className="tooltip-icon" title="Enter your monthly rent OR home loan EMI (not both). This is your total monthly housing cost.">ℹ️</span>
              </label>
              <input
                type="number"
                id="fixed_housing_rent"
                name="fixed_expenses.housing_rent"
                value={formData.fixed_expenses.housing_rent}
                onChange={handleInputChange}
                placeholder="e.g., 20000"
                min="0"
                className="form-input"
              />
              <small className="field-helper">Monthly rent or home loan EMI</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="fixed_utilities">Utilities</label>
              <input
                type="number"
                id="fixed_utilities"
                name="fixed_expenses.utilities"
                value={formData.fixed_expenses.utilities}
                onChange={handleInputChange}
                placeholder="e.g., 3000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fixed_insurance">Insurance</label>
              <input
                type="number"
                id="fixed_insurance"
                name="fixed_expenses.insurance"
                value={formData.fixed_expenses.insurance}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fixed_medical">Medical</label>
              <input
                type="number"
                id="fixed_medical"
                name="fixed_expenses.medical"
                value={formData.fixed_expenses.medical}
                onChange={handleInputChange}
                placeholder="e.g., 2000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fixed_other">Other Fixed</label>
              <input
                type="number"
                id="fixed_other"
                name="fixed_expenses.other_fixed"
                value={formData.fixed_expenses.other_fixed}
                onChange={handleInputChange}
                placeholder="e.g., 1000"
                min="0"
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        {/* V1.2: Variable Expenses Section */}
        <div className="form-section-inner">
          <h3>💳 Variable Expenses</h3>
          <p className="section-description">Flexible monthly expenses that can vary</p>
          
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="var_groceries">Groceries</label>
              <input
                type="number"
                id="var_groceries"
                name="variable_expenses.groceries_food"
                value={formData.variable_expenses.groceries_food}
                onChange={handleInputChange}
                placeholder="e.g., 15000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="var_transport">Transport</label>
              <input
                type="number"
                id="var_transport"
                name="variable_expenses.transport"
                value={formData.variable_expenses.transport}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="var_subscriptions">Subscriptions</label>
              <input
                type="number"
                id="var_subscriptions"
                name="variable_expenses.subscriptions"
                value={formData.variable_expenses.subscriptions}
                onChange={handleInputChange}
                placeholder="e.g., 2000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="var_entertainment">Entertainment</label>
              <input
                type="number"
                id="var_entertainment"
                name="variable_expenses.entertainment"
                value={formData.variable_expenses.entertainment}
                onChange={handleInputChange}
                placeholder="e.g., 3000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="var_shopping">Shopping</label>
              <input
                type="number"
                id="var_shopping"
                name="variable_expenses.shopping"
                value={formData.variable_expenses.shopping}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="var_dining">Dining Out</label>
              <input
                type="number"
                id="var_dining"
                name="variable_expenses.dining_out"
                value={formData.variable_expenses.dining_out}
                onChange={handleInputChange}
                placeholder="e.g., 4000"
                min="0"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="var_other">Other Variable</label>
              <input
                type="number"
                id="var_other"
                name="variable_expenses.other_variable"
                value={formData.variable_expenses.other_variable}
                onChange={handleInputChange}
                placeholder="e.g., 2000"
                min="0"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Legacy Expenses Section (Hidden, kept for compatibility) */}
        <div className="form-section-inner" style={{display: 'none'}}>
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
        
        {/* V1.2: Multiple Savings Goals */}
        <div className="form-section-inner">
          <h3>🎯 Savings Goals </h3>
          <p className="section-description">Add up to 5 specific savings goals with timelines</p>
          
          {savingsGoals.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              {savingsGoals.map((goal, index) => (
                <div key={index} style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-color, #e2e8f0)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>Goal #{index + 1}</strong>
                    <button
                      type="button"
                      onClick={() => removeSavingsGoal(index)}
                      style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Goal Name</label>
                      <input
                        type="text"
                        value={goal.name}
                        onChange={(e) => updateSavingsGoal(index, 'name', e.target.value)}
                        placeholder="e.g., Emergency Fund"
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Target Amount</label>
                      <input
                        type="number"
                        value={goal.target}
                        onChange={(e) => updateSavingsGoal(index, 'target', e.target.value)}
                        placeholder="e.g., 500000"
                        min="0"
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Timeline (Months)</label>
                      <input
                        type="number"
                        value={goal.timeline}
                        onChange={(e) => updateSavingsGoal(index, 'timeline', e.target.value)}
                        placeholder="e.g., 24"
                        min="1"
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Priority (1-5)</label>
                      <select
                        value={goal.priority}
                        onChange={(e) => updateSavingsGoal(index, 'priority', e.target.value)}
                        className="form-input"
                      >
                        <option value="5">5 - Highest</option>
                        <option value="4">4 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="2">2 - Low</option>
                        <option value="1">1 - Lowest</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {savingsGoals.length < 5 && (
            <button
              type="button"
              onClick={addSavingsGoal}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              + Add Savings Goal ({savingsGoals.length}/5)
            </button>
          )}
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
// ===========================================
// FUTURE ENHANCEMENTS
// ===========================================
// - Input validation with real-time feedback
// - Save form data to localStorage for persistence
// - Loan type categorization (Home, Car, Personal, etc.)
