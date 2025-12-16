import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';

/**
 * UK VAT Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates VAT and total price for UK purchases with proper SEO
 */
function VATCalculatorUK() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'VAT Calculator UK', path: null }
  ];
  
  const [amount, setAmount] = useState(100);
  const [vatRate, setVatRate] = useState(20);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculateVAT();
  }, [amount, vatRate]);

  const calculateVAT = () => {
    const A = parseFloat(amount);
    const r = parseFloat(vatRate) / 100;
    if (!A || r < 0 || A < 0) return;
    const vat = A * r;
    const total = A + vat;
    setResult({ vat: vat.toFixed(2), total: total.toFixed(2) });
  };

  return (
    <div className="calculator-container">
      <Breadcrumb items={breadcrumbItems} />
      <SEO title="UK VAT Calculator – Add or Remove VAT | VegaKash" description="Calculate UK VAT and total price. Free, fast, accurate VAT calculator for the UK." />
      <h1>UK VAT Calculator</h1>
      <form>
        <label>Amount (£): <input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></label><br />
        <label>VAT Rate (%): <input type="number" value={vatRate} onChange={e => setVatRate(e.target.value)} /></label>
      </form>
      {result && (
        <div className="result">
          <p><strong>VAT:</strong> £{result.vat}</p>
          <p><strong>Total Price (incl. VAT):</strong> £{result.total}</p>
        </div>
      )}
      <section className="seo-content">
        <h2>How to Calculate UK VAT</h2>
        <p>VAT (Value Added Tax) in the UK is typically 20%.<br />
        <code>VAT = Amount × VAT Rate</code><br />
        <code>Total = Amount + VAT</code></p>
        <h2>UK VAT FAQ</h2>
        <ul>
          <li><strong>What is VAT?</strong> Value Added Tax, a consumption tax in the UK.</li>
          <li><strong>How do I add or remove VAT?</strong> Use this calculator to add or remove VAT from any amount.</li>
        </ul>
      </section>
      <AEOContentSection tool="vat" country={country} />

      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "UK VAT Calculator",
        "description": "Calculate UK VAT and total price.",
        "provider": {"@type": "Organization", "name": "VegaKash.AI"},
        "applicationCategory": "Calculator",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}
      })}</script>
    </div>
  );
}

export default VATCalculatorUK;
