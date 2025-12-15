import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import InfoTooltip from '../../../components/InfoTooltip';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';
import '../../../styles/VATCalculator.css';
import ScrollToTop from '../../../modules/core/ui/ScrollToTop';

/**
 * UK VAT Calculator - PRODUCTION GRADE
 * Calculates VAT and total price for UK purchases with add/remove functionality
 * Supports Standard (20%), Reduced (5%), and Zero (0%) VAT rates
 */
function VATCalculatorUK() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'VAT Calculator UK', path: null }
  ];
  
  const [calculationMode, setCalculationMode] = useState('add'); // 'add' or 'remove'
  const [amount, setAmount] = useState(100);
  const [vatRate, setVatRate] = useState(20);
  const [vatPreset, setVatPreset] = useState('standard'); // standard, reduced, zero, custom
  const [userType, setUserType] = useState('personal'); // 'personal' or 'business'
  const [flatRateScheme, setFlatRateScheme] = useState(false);
  const [flatRatePercentage, setFlatRatePercentage] = useState(12.5);
  const [result, setResult] = useState(null);

  // UK VAT Rates 2025 (HMRC compliant)
  const VAT_RATES = {
    standard: 20,
    reduced: 5,
    zero: 0,
    food: 4, // Flat Rate Scheme - Food retailers
    it: 12.5, // Flat Rate Scheme - IT consultants
    business: 14.5 // Flat Rate Scheme - Business services
  };

  const tooltips = {
    amount: { text: calculationMode === 'add' ? 'Enter the net amount (excluding VAT)' : 'Enter the gross amount (including VAT). Supports decimals (e.g., £100.50) and commas (e.g., £1,000).' },
    mode: { text: 'Add VAT: Calculate gross price from net amount. Remove VAT: Calculate net amount from gross price. ⚠️ Important: Removing VAT does NOT mean subtracting 20%. £120 – 20% = £96 (WRONG). £120 ÷ 1.20 = £100 (CORRECT).' },
    vatRate: { text: 'Standard Rate (20%): Most goods and services. Reduced Rate (5%): Energy, children\'s car seats. Zero Rate (0%): Food, books, children\'s clothing. Flat Rate Scheme: Simplified VAT for small businesses.' },
    userType: { text: 'Personal: Calculate consumer prices. Business: VAT-registered business features including VAT reclaim, invoice breakdown, and Flat Rate Scheme options.' },
    flatRate: { text: 'Flat Rate Scheme: Simplified VAT method for small businesses with turnover under £150,000. You charge 20% VAT but pay a lower flat rate to HMRC, keeping the difference.' }
  };

  // Debounced calculation to avoid lag on slower devices
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateVAT();
    }, 150); // 150ms debounce
    return () => clearTimeout(timeoutId);
  }, [amount, vatRate, calculationMode, userType, flatRateScheme, flatRatePercentage]);

  useEffect(() => {
    if (vatPreset !== 'custom') {
      setVatRate(VAT_RATES[vatPreset]);
    }
  }, [vatPreset]);

  const calculateVAT = useCallback(() => {
    const A = parseFloat(amount) || 0;
    let effectiveRate = parseFloat(vatRate) / 100;
    
    if (A < 0 || effectiveRate < 0) return;
    
    let netAmount, vatAmount, grossAmount, vatReclaimable = 0, flatRateSaving = 0;
    
    if (calculationMode === 'add') {
      // Add VAT: Net Amount → Gross Amount (HMRC-compliant rounding)
      netAmount = A;
      vatAmount = Math.round(A * effectiveRate * 100) / 100; // Round per line item
      grossAmount = netAmount + vatAmount;
    } else {
      // Remove VAT: Gross Amount → Net Amount
      grossAmount = A;
      netAmount = grossAmount / (1 + effectiveRate);
      vatAmount = grossAmount - netAmount;
      
      // Round to 2 decimal places (HMRC guidance)
      netAmount = Math.round(netAmount * 100) / 100;
      vatAmount = Math.round(vatAmount * 100) / 100;
    }
    
    // Business mode calculations
    if (userType === 'business') {
      vatReclaimable = vatAmount; // VAT-registered businesses can reclaim input VAT
      
      // Flat Rate Scheme calculation
      if (flatRateScheme && calculationMode === 'add') {
        const flatRateVAT = grossAmount * (flatRatePercentage / 100);
        flatRateSaving = vatAmount - flatRateVAT;
      }
    }
    
    setResult({
      netAmount,
      vatAmount,
      grossAmount,
      effectiveRate: vatRate,
      vatReclaimable,
      flatRateSaving,
      isBusinessMode: userType === 'business',
      isFlatRate: flatRateScheme
    });
  }, [amount, vatRate, calculationMode, userType, flatRateScheme, flatRatePercentage]);

  const handleReset = () => {
    setCalculationMode('add');
    setAmount(100);
    setVatRate(20);
    setVatPreset('standard');
    setUserType('personal');
    setFlatRateScheme(false);
    setFlatRatePercentage(12.5);
  };
  
  // Quick VAT action buttons (UK UX standard)
  const quickVATAction = (action) => {
    if (action === 'add20') {
      setCalculationMode('add');
      setVatRate(20);
      setVatPreset('standard');
    } else if (action === 'remove20') {
      setCalculationMode('remove');
      setVatRate(20);
      setVatPreset('standard');
    } else if (action === 'add5') {
      setCalculationMode('add');
      setVatRate(5);
      setVatPreset('reduced');
    } else if (action === 'remove5') {
      setCalculationMode('remove');
      setVatRate(5);
      setVatPreset('reduced');
    }
  };

  const formatCurrency = (value) => {
    return `£${parseFloat(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const parseNumericInput = (value) => {
    // Remove currency symbols, commas, and whitespace, but keep decimals
    const cleaned = value.replace(/[£$€,\s]/g, '').replace(/[^0-9.]/g, '');
    
    // Handle multiple decimal points (keep only first one)
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return cleaned === '' ? '' : cleaned;
  };
  
  const formatInputDisplay = (value) => {
    if (value === '' || value === null || value === undefined) return '£0';
    const num = parseFloat(value);
    if (isNaN(num)) return '£0';
    return `£${num.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      <ScrollToTop threshold={300} />
      <EnhancedSEO 
        title={`UK VAT Calculator${country ? ` for ${country.toUpperCase()}` : ''}`}
        description={`Calculate UK VAT - Add or Remove VAT from prices${country ? ` for ${country.toUpperCase()}` : ''}. Free VAT calculator with Standard (20%), Reduced (5%), and Zero (0%) rates.`}
        tool="vat"
        country={country}
        isGlobal={!country}
      />
      <SEO title="UK VAT Calculator – Add or Remove VAT | VegaKash" description="Calculate UK VAT and total price. Free, fast, accurate VAT calculator for the UK." />

      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>🧾</span>
            UK VAT Calculator
          </h1>
          <p style={{ opacity: 0.75 }}>HMRC-compliant VAT calculator with business features, Flat Rate Scheme, and instant VAT reclaim calculations</p>
          <div style={{ marginTop: '1rem', padding: '0.875rem', background: '#fef3c7', borderRadius: '8px', border: '2px solid #fbbf24', maxWidth: '600px', margin: '1rem auto 0' }}>
            <strong style={{ color: '#92400e', fontSize: '0.95rem' }}>🔹 2025 VAT Threshold: £85,000 per year</strong>
            <div style={{ fontSize: '0.85rem', color: '#78350f', marginTop: '0.25rem' }}>Businesses exceeding this turnover must register for VAT with HMRC</div>
          </div>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              
              {/* User Type Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <div className="slider-header">
                  <label>
                    User Type
                    <InfoTooltip {...tooltips.userType} />
                  </label>
                </div>
                <div className="loan-type-select">
                  <select 
                    value={userType} 
                    onChange={(e) => setUserType(e.target.value)}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: '8px', border: '2px solid #10b981', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', fontWeight: '600', color: '#1e293b' }}
                  >
                    <option value="personal">👤 Personal (Consumer)</option>
                    <option value="business">🏢 Business (VAT-registered)</option>
                  </select>
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: userType === 'business' ? '#fef3c7' : '#f0f9ff', borderRadius: '8px', border: `1px solid ${userType === 'business' ? '#fbbf24' : '#bae6fd'}` }}>
                  <span style={{ fontSize: '0.85rem', color: userType === 'business' ? '#78350f' : '#075985', lineHeight: '1.5' }}>
                    {userType === 'personal' 
                      ? '🛒 Calculate consumer prices with VAT included'
                      : '📊 Business mode: VAT reclaim, invoice breakdown, Flat Rate Scheme'
                    }
                  </span>
                </div>
              </div>

              {/* Quick VAT Action Buttons */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem' }}>
                  Quick VAT Actions
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  <button 
                    onClick={() => quickVATAction('add20')}
                    className="vat-quick-btn vat-add-btn"
                    style={{ padding: '0.875rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(102, 126, 234, 0.25)' }}
                  >
                    ➕ Add 20% VAT
                  </button>
                  <button 
                    onClick={() => quickVATAction('remove20')}
                    className="vat-quick-btn vat-remove-btn"
                    style={{ padding: '0.875rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)' }}
                  >
                    ➖ Remove 20% VAT
                  </button>
                  <button 
                    onClick={() => quickVATAction('add5')}
                    className="vat-quick-btn vat-add-btn"
                    style={{ padding: '0.875rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(139, 92, 246, 0.25)' }}
                  >
                    ➕ Add 5% VAT
                  </button>
                  <button 
                    onClick={() => quickVATAction('remove5')}
                    className="vat-quick-btn vat-remove-btn"
                    style={{ padding: '0.875rem', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(6, 182, 212, 0.25)' }}
                  >
                    ➖ Remove 5% VAT
                  </button>
                </div>
              </div>
              
              {/* Calculation Mode Toggle */}
              <div style={{ marginBottom: '2rem' }}>
                <div className="slider-header">
                  <label>
                    Calculation Mode
                    <InfoTooltip {...tooltips.mode} />
                  </label>
                </div>
                <div className="loan-type-select">
                  <select 
                    value={calculationMode} 
                    onChange={(e) => setCalculationMode(e.target.value)}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: '8px', border: '2px solid #667eea', background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)', fontWeight: '600', color: '#1e293b' }}
                  >
                    <option value="add">➕ Add VAT (Net → Gross)</option>
                    <option value="remove">➖ Remove VAT (Gross → Net)</option>
                  </select>
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                  <span style={{ fontSize: '0.85rem', color: '#075985', lineHeight: '1.5' }}>
                    {calculationMode === 'add' 
                      ? '📊 Calculate the total price including VAT from a net amount'
                      : '📉 Calculate the net amount excluding VAT from a gross price'
                    }
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    {calculationMode === 'add' ? 'Net Amount (Excl. VAT)' : 'Gross Amount (Incl. VAT)'}
                    <InfoTooltip {...tooltips.amount} />
                  </label>
                  <input 
                    type="text" 
                    value={formatInputDisplay(amount)} 
                    onChange={(e) => { 
                      const val = parseNumericInput(e.target.value); 
                      setAmount(val === '' ? '' : parseFloat(val)); 
                    }} 
                    className="input-display"
                    placeholder="£0.00"
                  />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="10" 
                  value={amount || 0} 
                  onChange={(e) => setAmount(parseFloat(e.target.value))} 
                  className="slider" 
                />
                <div className="slider-labels"><span>£0</span><span>£10,000</span></div>
              </div>

              {/* VAT Rate Preset */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    VAT Rate
                    <InfoTooltip {...tooltips.vatRate} />
                  </label>
                </div>
                <div className="loan-type-select">
                  <select 
                    value={vatPreset} 
                    onChange={(e) => setVatPreset(e.target.value)}
                    style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', border: '1.5px solid #e8ecf3', background: '#ffffff' }}
                  >
                    <option value="standard">Standard Rate (20%) - Most goods & services</option>
                    <option value="reduced">Reduced Rate (5%) - Energy, children's items</option>
                    <option value="zero">Zero Rate (0%) - Food, books, children's clothing</option>
                    {userType === 'business' && <option value="food">Flat Rate: Food retailers (4%)</option>}
                    {userType === 'business' && <option value="it">Flat Rate: IT consultants (12.5%)</option>}
                    {userType === 'business' && <option value="business">Flat Rate: Business services (14.5%)</option>}
                    <option value="custom">Custom Rate</option>
                  </select>
                </div>
              </div>

              {/* Custom VAT Rate Slider */}
              {vatPreset === 'custom' && (
                <div className="slider-group">
                  <div className="slider-header">
                    <label>Custom VAT Rate</label>
                    <input 
                      type="text" 
                      value={`${vatRate}%`} 
                      onChange={(e) => { 
                        const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')); 
                        if (!isNaN(val) && val >= 0 && val <= 25) setVatRate(val); 
                      }} 
                      className="input-display" 
                    />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="25" 
                    step="0.5" 
                    value={vatRate} 
                    onChange={(e) => setVatRate(parseFloat(e.target.value))} 
                    className="slider" 
                  />
                  <div className="slider-labels"><span>0%</span><span>25%</span></div>
                  {vatRate > 20 && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fbbf24' }}>
                      <span style={{ fontSize: '0.85rem', color: '#92400e' }}>
                        ⚠️ UK VAT rates above 20% are rare. Standard rate is 20%.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Business Mode: Flat Rate Scheme */}
              {userType === 'business' && (
                <div className="slider-group" style={{ padding: '1.5rem', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fbbf24' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#92400e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    💼 Flat Rate Scheme
                    <InfoTooltip {...tooltips.flatRate} />
                  </h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={flatRateScheme} 
                        onChange={(e) => setFlatRateScheme(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.95rem', color: '#78350f' }}>Use Flat Rate Scheme (turnover under £150k)</span>
                    </label>
                  </div>
                  {flatRateScheme && (
                    <>
                      <div className="slider-header">
                        <label>Flat Rate Percentage</label>
                        <input 
                          type="text" 
                          value={`${flatRatePercentage}%`} 
                          onChange={(e) => { 
                            const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')); 
                            if (!isNaN(val) && val >= 0 && val <= 20) setFlatRatePercentage(val); 
                          }} 
                          className="input-display" 
                        />
                      </div>
                      <input 
                        type="range" 
                        min="4" 
                        max="16.5" 
                        step="0.5" 
                        value={flatRatePercentage} 
                        onChange={(e) => setFlatRatePercentage(parseFloat(e.target.value))} 
                        className="slider" 
                      />
                      <div className="slider-labels"><span>4%</span><span>16.5%</span></div>
                      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#78350f', lineHeight: '1.6' }}>
                        You charge customers 20% VAT but pay only {flatRatePercentage}% to HMRC, keeping the difference as profit.
                      </div>
                    </>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleReset} className="btn-reset">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset to Default
                </button>
              </div>
            </div>

            {result && (
              <div className="calculator-results">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                  {calculationMode === 'add' ? 'Price with VAT' : 'Price without VAT'}
                </h2>
                
                {/* Main Result Card */}
                <div style={{ 
                  background: calculationMode === 'add' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '1.5rem',
                  boxShadow: calculationMode === 'add' 
                    ? '0 6px 18px rgba(102, 126, 234, 0.25)' 
                    : '0 6px 18px rgba(16, 185, 129, 0.25)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.95rem', opacity: '0.9', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    {calculationMode === 'add' ? 'Total Price (Including VAT)' : 'Net Amount (Excluding VAT)'}
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                    {formatCurrency(calculationMode === 'add' ? result.grossAmount : result.netAmount)}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: '0.85', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'inline-block', marginBottom: '0.5rem' }}>
                    {calculationMode === 'add' 
                      ? `VAT at ${result.effectiveRate}% added` 
                      : `VAT at ${result.effectiveRate}% removed`
                    }
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: '0.9', marginTop: '0.5rem' }}>
                    {calculationMode === 'add' 
                      ? '💳 This is the amount your customer pays' 
                      : '📊 This is your net amount for bookkeeping'
                    }
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: calculationMode === 'add' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Net Amount
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>
                      {formatCurrency(result.netAmount)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Excluding VAT
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      VAT Amount
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#667eea' }}>
                      {formatCurrency(result.vatAmount)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      {result.effectiveRate}% of net
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
                  border: '2px solid #e9d5ff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📋 VAT Calculation Summary
                  </h3>
                  <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.8' }}>
                    {calculationMode === 'add' ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Original Amount:</span>
                          <strong>{formatCurrency(result.netAmount)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#667eea' }}>
                          <span>+ VAT ({result.effectiveRate}%):</span>
                          <strong>{formatCurrency(result.vatAmount)}</strong>
                        </div>
                        <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '700', color: '#1e293b' }}>
                          <span>Total Price:</span>
                          <strong>{formatCurrency(result.grossAmount)}</strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Gross Amount:</span>
                          <strong>{formatCurrency(result.grossAmount)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#ef4444' }}>
                          <span>- VAT ({result.effectiveRate}%):</span>
                          <strong>{formatCurrency(result.vatAmount)}</strong>
                        </div>
                        <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '700', color: '#1e293b' }}>
                          <span>Net Amount:</span>
                          <strong>{formatCurrency(result.netAmount)}</strong>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* VAT Rate Info */}
                <div className="breakdown-chart">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    {calculationMode === 'remove' ? 'VAT Removal Formula (HMRC Method)' : 'UK VAT Rates (2025)'}
                  </h3>
                  
                  {calculationMode === 'remove' && (
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#fef3c7', borderRadius: '12px', border: '2px solid #fbbf24' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#92400e', marginBottom: '1rem' }}>
                        ⚠️ Common Mistake: VAT Removal
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: '1.8' }}>
                        <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', marginBottom: '0.75rem' }}>
                          <strong style={{ color: '#dc2626' }}>❌ WRONG:</strong> £120 – 20% = £96 (Incorrect)<br/>
                          <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>This subtracts 20% of gross, not VAT amount</span>
                        </div>
                        <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px' }}>
                          <strong style={{ color: '#059669' }}>✅ CORRECT:</strong> £120 ÷ 1.20 = £100 (HMRC Method)<br/>
                          <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Net = Gross ÷ (1 + VAT Rate)</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {calculationMode === 'add' && (
                    <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#475569', lineHeight: '1.8' }}>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#1e293b' }}>Standard Rate (20%):</strong> Most goods and services, including electronics, clothing, furniture, and professional services.
                      </div>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#1e293b' }}>Reduced Rate (5%):</strong> Home energy, children's car seats, mobility aids, and certain residential conversions.
                      </div>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <strong style={{ color: '#1e293b' }}>Zero Rate (0%):</strong> Most food and drink, books, newspapers, children's clothing, and public transport.
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Mode: VAT Reclaim & Flat Rate */}
                {result.isBusinessMode && (
                  <div className="breakdown-chart" style={{ marginTop: '1.5rem', background: '#f0fdf4', border: '2px solid #86efac' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d' }}>
                      💼 Business VAT Information
                    </h3>
                    <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', lineHeight: '1.8' }}>
                      <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#15803d' }}>VAT Reclaimable:</strong>
                          <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>{formatCurrency(result.vatReclaimable)}</strong>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#166534', opacity: 0.9 }}>
                          As a VAT-registered business, you can reclaim this input VAT on business purchases
                        </div>
                      </div>
                      
                      {result.isFlatRate && result.flatRateSaving > 0 && (
                        <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '2px solid #fbbf24' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#92400e' }}>Flat Rate Saving:</strong>
                            <strong style={{ fontSize: '1.1rem', color: '#92400e' }}>{formatCurrency(result.flatRateSaving)}</strong>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#78350f', opacity: 0.9 }}>
                            Profit from Flat Rate Scheme (charged 20%, paid {flatRatePercentage}% to HMRC)
                          </div>
                        </div>
                      )}
                      
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                        <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>📋 Invoice Breakdown:</strong>
                        <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Net Amount:</span>
                            <span>{formatCurrency(result.netAmount)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>VAT @ {result.effectiveRate}%:</span>
                            <span>{formatCurrency(result.vatAmount)}</span>
                          </div>
                          <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }}></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                            <span>Total Due:</span>
                            <span>{formatCurrency(result.grossAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="seo-content-section">
          <div className="content-block">
            <h2>How to Calculate UK VAT (HMRC Method)</h2>
            <p>VAT (Value Added Tax) is a consumption tax applied to most goods and services in the UK. The standard rate is 20%, with reduced rates of 5% and 0% for specific items.</p>
            <div className="formula-box">
              <strong>Add VAT:</strong> Gross Price = Net Amount × (1 + VAT Rate)<br/>
              <em>Example: £100 × 1.20 = £120</em>
            </div>
            <div className="formula-box">
              <strong>Remove VAT (HMRC Method):</strong> Net Amount = Gross Price ÷ (1 + VAT Rate)<br/>
              <em>Example: £120 ÷ 1.20 = £100</em>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
              <strong style={{ color: '#92400e' }}>⚠️ Common Mistake:</strong>
              <p style={{ marginTop: '0.5rem', marginBottom: 0, color: '#78350f', fontSize: '0.95rem' }}>
                Many people incorrectly remove VAT by subtracting 20% from the gross price. <strong>This is wrong!</strong> £120 – 20% = £96 (incorrect). The correct method is £120 ÷ 1.20 = £100, because VAT is calculated on the net amount, not the gross amount.
              </p>
            </div>
          </div>

          <div className="content-block">
            <h2>UK VAT Rates Comparison Table (2025)</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700' }}>Category</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '700' }}>Rate</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700' }}>Examples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>Standard Rate</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#667eea', fontWeight: '700' }}>20%</td>
                    <td style={{ padding: '0.75rem' }}>Electronics, adult clothing, furniture, restaurant meals, professional services</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>Reduced Rate</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>5%</td>
                    <td style={{ padding: '0.75rem' }}>Home energy, children's car seats, mobility aids, contraceptives</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>Zero Rate</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#64748b', fontWeight: '700' }}>0%</td>
                    <td style={{ padding: '0.75rem' }}>Most food (not prepared/hot), books, newspapers, children's clothing, public transport</td>
                  </tr>
                  <tr style={{ background: '#f8f9fa' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>VAT-Exempt</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8', fontWeight: '700' }}>N/A</td>
                    <td style={{ padding: '0.75rem' }}>Insurance, postage stamps, financial services, education, NHS health services</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
              <strong>Note:</strong> VAT-exempt items have no VAT charged, and businesses cannot reclaim VAT on these purchases. Zero-rated items have 0% VAT but are still technically VAT-taxable, allowing businesses to reclaim input VAT.
            </p>
          </div>

          <div className="content-block">
            <h2>UK VAT FAQ</h2>
            <ul>
              <li><strong>What is VAT?</strong> Value Added Tax is a consumption tax charged on most goods and services in the UK. It's collected by businesses and paid to HMRC. The standard rate is 20%.</li>
              <li><strong>What are the UK VAT rates in 2025?</strong> Standard (20%), Reduced (5%), and Zero (0%). Most items are charged at the standard rate. Some items are VAT-exempt or outside the scope of VAT.</li>
              <li><strong>How do I add VAT to a price?</strong> Multiply the net amount by 1.20 (for 20% VAT) to get the gross price including VAT. For example, £100 × 1.20 = £120.</li>
              <li><strong>How do I remove VAT from a price?</strong> Divide the gross amount by 1.20 (for 20% VAT) to get the net price excluding VAT. For example, £120 ÷ 1.20 = £100. Do NOT subtract 20% - this is incorrect!</li>
              <li><strong>When do I need to register for VAT?</strong> If your taxable turnover exceeds £85,000 per year (2025 threshold), you must register for VAT with HMRC within 30 days.</li>
              <li><strong>What is the Flat Rate Scheme?</strong> A simplified VAT method for small businesses (turnover under £150,000). You charge customers 20% VAT but pay a lower flat rate to HMRC (typically 4-16.5% depending on your sector), keeping the difference.</li>
              <li><strong>Can I reclaim VAT on business purchases?</strong> Yes, if you're VAT-registered. You can reclaim input VAT on goods and services purchased for business use, subject to HMRC rules.</li>
              <li><strong>What's the difference between zero-rated and exempt?</strong> Zero-rated items have 0% VAT but are still VAT-taxable (you can reclaim input VAT). Exempt items have no VAT and you cannot reclaim VAT on related purchases.</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>VAT Rate Categories & Business Guidance</h2>
            <ul>
              <li><strong>Standard Rate (20%):</strong> Applies to most goods and services including electronics, furniture, adult clothing, vehicles, professional services, and construction work.</li>
              <li><strong>Reduced Rate (5%):</strong> Applies to domestic fuel and power, children's car seats, smoking cessation products, certain residential conversions, and women's sanitary products.</li>
              <li><strong>Zero Rate (0%):</strong> Applies to most food and drink (except hot takeaway, alcohol, confectionery), books, newspapers, children's clothing and footwear (under age 14), public transport, prescription medicines, and water for household use.</li>
              <li><strong>Exempt Items:</strong> Insurance, postage stamps, financial services (loans, mortgages), education and training, health services provided by doctors/dentists, charity fundraising events, and certain land and property transactions.</li>
              <li><strong>Flat Rate Scheme Percentages (2025):</strong> Food retailers (4%), Retail (7.5%), Computer repair (10.5%), IT consultants (14.5%), Business services (12-14.5%), Catering (12.5%), Hairdressing (13%). Check HMRC website for your sector-specific rate.</li>
              <li><strong>VAT Registration Threshold 2025:</strong> £85,000 annual turnover. If your taxable turnover exceeds this in any 12-month rolling period, you must register for VAT. Voluntary registration is allowed even below this threshold.</li>
              <li><strong>Northern Ireland VAT (Post-Brexit):</strong> Goods sold in NI follow EU VAT rules. Services follow UK VAT rules. Businesses operating in NI may need to apply different VAT rates depending on the transaction type.</li>
            </ul>
          </div>
        </div>

        <AEOContentSection tool="vat" country={country} />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "UK VAT Calculator",
          "description": "Calculate UK VAT and total price with add or remove functionality.",
          "provider": {"@type": "Organization", "name": "VegaKash.AI"},
          "applicationCategory": "Calculator",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}
        })}</script>
      </div>
    </>
  );
}

export default VATCalculatorUK;
