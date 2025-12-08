/**
 * Budget Input Form Component
 * Comprehensive form for budget planner inputs
 * Includes: Income, Location, Household, Expenses, Loans, Goals
 */
import React, { useState, useEffect } from 'react';
import LocationSelector from './LocationSelector';
import { getBudgetModes, getLifestyleOptions } from '../../services/budgetPlannerApi';
import './BudgetInputForm.css';

const BudgetInputForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    // Income
    monthlyIncome: '',
    currency: 'INR',
    
    // Location (handled by LocationSelector)
    country: '',
    state: '',
    city: '',
    cityTier: 'tier_1',
    colMultiplier: 1.0,
    
    // Household
    familySize: 1,
    lifestyle: 'moderate',
    
    // Fixed Expenses
    rent: '',
    utilities: '',
    insurance: '',
    medical: '',
    otherFixed: '',
    
    // Variable Expenses
    groceries: '',
    transport: '',
    subscriptions: '',
    entertainment: '',
    shopping: '',
    diningOut: '',
    otherVariable: '',
    
    // Loans
    loans: [],
    
    // Goals
    goals: [],
    
    // Budget Mode
    mode: 'smart_balanced',
  });

  const [budgetModes, setBudgetModes] = useState([]);
  const [lifestyleOptions, setLifestyleOptions] = useState([]);
  const [activeSection, setActiveSection] = useState('income');

  // Fetch budget modes and lifestyle options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [modesData, lifestyleData] = await Promise.all([
          getBudgetModes(),
          getLifestyleOptions()
        ]);
        setBudgetModes(modesData.modes || []);
        setLifestyleOptions(lifestyleData.lifestyles || []);
      } catch (error) {
        console.error('Error fetching options:', error);
        // Set fallbacks
        setBudgetModes([
          { value: 'basic', label: 'Basic 50/30/20', description: 'Simple balanced approach' },
          { value: 'smart_balanced', label: 'Smart Balanced', description: 'AI-optimized allocation' },
          { value: 'aggressive_savings', label: 'Aggressive Savings', description: 'Maximize savings' }
        ]);
        setLifestyleOptions([
          { value: 'minimal', label: 'Minimal', description: 'Essential spending only' },
          { value: 'moderate', label: 'Moderate', description: 'Balanced lifestyle' },
          { value: 'comfort', label: 'Comfort', description: 'Comfortable living' },
          { value: 'premium', label: 'Premium', description: 'Luxury lifestyle' }
        ]);
      }
    };
    fetchOptions();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle location change from LocationSelector
  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      ...locationData
    }));
  };

  // Add loan
  const addLoan = () => {
    setFormData(prev => ({
      ...prev,
      loans: [...prev.loans, { principal: '', rate: '', tenureMonths: '', issuer: '' }]
    }));
  };

  // Remove loan
  const removeLoan = (index) => {
    setFormData(prev => ({
      ...prev,
      loans: prev.loans.filter((_, i) => i !== index)
    }));
  };

  // Update loan
  const updateLoan = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      loans: prev.loans.map((loan, i) => 
        i === index ? { ...loan, [field]: value } : loan
      )
    }));
  };

  // Add goal
  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, { name: '', target: '', targetMonths: '', priority: 3 }]
    }));
  };

  // Remove goal
  const removeGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  // Update goal
  const updateGoal = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Navigation between sections
  const sections = ['income', 'location', 'household', 'expenses', 'loans', 'goals', 'mode'];
  const sectionTitles = {
    income: 'Income & Currency',
    location: 'Location',
    household: 'Household',
    expenses: 'Expenses',
    loans: 'Loans & EMIs',
    goals: 'Savings Goals',
    mode: 'Budget Mode'
  };

  return (
    <form onSubmit={handleSubmit} className="budget-input-form">
      {/* Section Navigation */}
      <div className="form-navigation">
        {sections.map(section => (
          <button
            key={section}
            type="button"
            className={`nav-btn ${activeSection === section ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {sectionTitles[section]}
          </button>
        ))}
      </div>

      {/* Income Section */}
      {activeSection === 'income' && (
        <div className="form-section">
          <h3>Income & Currency</h3>
          <div className="form-group">
            <label htmlFor="monthlyIncome">
              Monthly Income <span className="required">*</span>
            </label>
            <input
              type="number"
              id="monthlyIncome"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              placeholder="Enter your monthly income"
              min="10000"
              max="10000000"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="form-select"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>
      )}

      {/* Location Section */}
      {activeSection === 'location' && (
        <div className="form-section">
          <h3>Location</h3>
          <p className="section-description">
            Your location helps us calculate cost-of-living adjustments for your budget.
          </p>
          <LocationSelector
            value={{
              country: formData.country,
              state: formData.state,
              city: formData.city,
              cityTier: formData.cityTier,
              colMultiplier: formData.colMultiplier
            }}
            onChange={handleLocationChange}
            required={false}
          />
        </div>
      )}

      {/* Household Section */}
      {activeSection === 'household' && (
        <div className="form-section">
          <h3>Household Information</h3>
          
          <div className="form-group">
            <label htmlFor="familySize">Family Size</label>
            <input
              type="number"
              id="familySize"
              name="familySize"
              value={formData.familySize}
              onChange={handleChange}
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
              onChange={handleChange}
              className="form-select"
            >
              {lifestyleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Expenses Section */}
      {activeSection === 'expenses' && (
        <div className="form-section">
          <h3>Monthly Expenses</h3>
          
          <h4>Fixed Expenses</h4>
          <div className="expense-grid">
            <div className="form-group">
              <label htmlFor="rent">Rent/Mortgage</label>
              <input
                type="number"
                id="rent"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="utilities">Utilities</label>
              <input
                type="number"
                id="utilities"
                name="utilities"
                value={formData.utilities}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="insurance">Insurance</label>
              <input
                type="number"
                id="insurance"
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="medical">Medical</label>
              <input
                type="number"
                id="medical"
                name="medical"
                value={formData.medical}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="otherFixed">Other Fixed</label>
              <input
                type="number"
                id="otherFixed"
                name="otherFixed"
                value={formData.otherFixed}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>
          </div>

          <h4>Variable Expenses</h4>
          <div className="expense-grid">
            <div className="form-group">
              <label htmlFor="groceries">Groceries</label>
              <input
                type="number"
                id="groceries"
                name="groceries"
                value={formData.groceries}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="transport">Transport</label>
              <input
                type="number"
                id="transport"
                name="transport"
                value={formData.transport}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subscriptions">Subscriptions</label>
              <input
                type="number"
                id="subscriptions"
                name="subscriptions"
                value={formData.subscriptions}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="entertainment">Entertainment</label>
              <input
                type="number"
                id="entertainment"
                name="entertainment"
                value={formData.entertainment}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="shopping">Shopping</label>
              <input
                type="number"
                id="shopping"
                name="shopping"
                value={formData.shopping}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="diningOut">Dining Out</label>
              <input
                type="number"
                id="diningOut"
                name="diningOut"
                value={formData.diningOut}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="otherVariable">Other Variable</label>
              <input
                type="number"
                id="otherVariable"
                name="otherVariable"
                value={formData.otherVariable}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loans Section */}
      {activeSection === 'loans' && (
        <div className="form-section">
          <h3>Loans & EMIs</h3>
          <p className="section-description">Add any loans or EMIs you're currently paying</p>
          
          {formData.loans.map((loan, index) => (
            <div key={index} className="dynamic-item">
              <div className="item-header">
                <h4>Loan {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeLoan(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
              
              <div className="expense-grid">
                <div className="form-group">
                  <label>Principal Amount</label>
                  <input
                    type="number"
                    value={loan.principal}
                    onChange={(e) => updateLoan(index, 'principal', e.target.value)}
                    placeholder="Loan amount"
                    min="0"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Interest Rate (%)</label>
                  <input
                    type="number"
                    value={loan.rate}
                    onChange={(e) => updateLoan(index, 'rate', e.target.value)}
                    placeholder="Interest rate"
                    min="0"
                    max="50"
                    step="0.1"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Tenure (Months)</label>
                  <input
                    type="number"
                    value={loan.tenureMonths}
                    onChange={(e) => updateLoan(index, 'tenureMonths', e.target.value)}
                    placeholder="Duration"
                    min="1"
                    max="360"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Bank/Issuer (Optional)</label>
                  <input
                    type="text"
                    value={loan.issuer}
                    onChange={(e) => updateLoan(index, 'issuer', e.target.value)}
                    placeholder="Bank name"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLoan}
            className="btn-add"
            disabled={formData.loans.length >= 5}
          >
            + Add Loan
          </button>
        </div>
      )}

      {/* Goals Section */}
      {activeSection === 'goals' && (
        <div className="form-section">
          <h3>Savings Goals</h3>
          <p className="section-description">Set your financial goals</p>
          
          {formData.goals.map((goal, index) => (
            <div key={index} className="dynamic-item">
              <div className="item-header">
                <h4>Goal {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
              
              <div className="expense-grid">
                <div className="form-group">
                  <label>Goal Name</label>
                  <input
                    type="text"
                    value={goal.name}
                    onChange={(e) => updateGoal(index, 'name', e.target.value)}
                    placeholder="e.g., Emergency Fund"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Target Amount</label>
                  <input
                    type="number"
                    value={goal.target}
                    onChange={(e) => updateGoal(index, 'target', e.target.value)}
                    placeholder="Target amount"
                    min="0"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Timeline (Months)</label>
                  <input
                    type="number"
                    value={goal.targetMonths}
                    onChange={(e) => updateGoal(index, 'targetMonths', e.target.value)}
                    placeholder="Months to achieve"
                    min="1"
                    max="360"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Priority (1-5)</label>
                  <select
                    value={goal.priority}
                    onChange={(e) => updateGoal(index, 'priority', e.target.value)}
                    className="form-select"
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

          <button
            type="button"
            onClick={addGoal}
            className="btn-add"
            disabled={formData.goals.length >= 5}
          >
            + Add Goal
          </button>
        </div>
      )}

      {/* Mode Section */}
      {activeSection === 'mode' && (
        <div className="form-section">
          <h3>Budget Mode</h3>
          <p className="section-description">Choose how you want your budget to be optimized</p>
          
          <div className="mode-selection">
            {budgetModes.map(mode => (
              <label key={mode.value} className="mode-option">
                <input
                  type="radio"
                  name="mode"
                  value={mode.value}
                  checked={formData.mode === mode.value}
                  onChange={handleChange}
                />
                <div className="mode-content">
                  <strong>{mode.label}</strong>
                  <p>{mode.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Generating Budget...' : 'Generate Budget Plan'}
        </button>
      </div>
    </form>
  );
};

export default BudgetInputForm;
