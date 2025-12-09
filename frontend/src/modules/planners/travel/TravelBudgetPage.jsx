import React, { useState } from 'react';
import SEO from '../../../components/SEO';
import TravelForm from './components/TravelForm';
import TravelSummary from './components/TravelSummary';
import TravelAIPlan from './components/TravelAIPlan';
import './TravelBudget.css';

/**
 * AI Travel Budget Planner
 * Plan trip expenses with AI-powered cost predictions and itinerary generation
 */
function TravelBudgetPage() {
  const [activeStep, setActiveStep] = useState('form'); // form, summary, ai-plan
  const [travelData, setTravelData] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('travel-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setTravelData(formData);
    
    try {
      console.log('Travel form submitted:', formData);
      
      // Call backend API to calculate budget
      const response = await fetch('http://localhost:8000/api/v1/ai/travel/calculate-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const budgetData = await response.json();
      console.log('Budget data received:', budgetData);
      
      // Store budget data for summary view
      setTravelData({ ...formData, budgetData });
      setActiveStep('summary');
    } catch (error) {
      console.error('Error processing travel budget:', error);
      alert('Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsLoading(true);
    setActiveStep('ai-plan');
    
    try {
      // Prepare travel data
      const travelDataPayload = {
        originCity: travelData.originCity,
        originCountry: travelData.originCountry,
        destinationCity: travelData.destinationCity,
        destinationCountry: travelData.destinationCountry,
        additionalDestinations: travelData.additionalDestinations || '',
        startDate: travelData.startDate,
        endDate: travelData.endDate,
        adults: travelData.adults,
        children: travelData.children || 0,
        infants: travelData.infants || 0,
        travelStyle: travelData.travelStyle,
        tripTheme: travelData.tripTheme || [],
        localTransport: travelData.localTransport,
        homeCurrency: travelData.homeCurrency,
        includeFlights: travelData.includeFlights !== false,
        includeVisa: travelData.includeVisa || false,
        includeInsurance: travelData.includeInsurance !== false,
        bufferPercentage: travelData.bufferPercentage || 10,
      };

      // Prepare budget data (expenses only)
      const budgetDataPayload = travelData.budgetData?.expenses || travelData.budgetData || {
        flights: 0,
        accommodation: 0,
        food: 0,
        localTransport: 0,
        activities: 0,
        shopping: 0,
        visa: 0,
        insurance: 0,
        miscellaneous: 0,
      };

      let optimization = null;
      let itinerary = null;

      // Function to fetch with timeout
      const fetchWithTimeout = (url, options, timeoutMs = 15000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          )
        ]);
      };

      // Call optimization endpoint with timeout
      try {
        const optimizationResponse = await fetchWithTimeout(
          'http://localhost:8000/api/v1/ai/travel/optimize',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              travelData: travelDataPayload,
              budgetData: budgetDataPayload
            }),
          },
          12000
        );

        if (optimizationResponse.ok) {
          optimization = await optimizationResponse.json();
          console.log('✅ Optimization received:', optimization);
        } else {
          console.warn('⚠️ Optimization response not ok:', optimizationResponse.status);
        }
      } catch (error) {
        console.warn('⚠️ Optimization failed (continuing):', error.message);
      }

      // Call itinerary generation endpoint with timeout
      try {
        const itineraryResponse = await fetchWithTimeout(
          'http://localhost:8000/api/v1/ai/travel/generate-itinerary',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              travelData: travelDataPayload,
              budgetData: budgetDataPayload,
              itineraryDetailLevel: travelData.itineraryDetailLevel || 'standard'
            }),
          },
          12000
        );

        if (itineraryResponse.ok) {
          itinerary = await itineraryResponse.json();
          console.log('✅ Itinerary received:', itinerary);
        } else {
          console.warn('⚠️ Itinerary response not ok:', itineraryResponse.status);
        }
      } catch (error) {
        console.warn('⚠️ Itinerary failed (continuing):', error.message);
      }

      // Set AI plan with whatever data we received
      if (optimization || itinerary) {
        setAiPlan({
          optimization: optimization || { suggestions: [], originalCost: 0, optimizedCost: 0, savings: 0, savingsPercentage: 0 },
          itinerary: itinerary || { itinerary: [], totalDays: 0, totalCost: 0 },
        });
        console.log('✅ AI Plan state updated successfully');
      } else {
        throw new Error('No recommendations received from backend');
      }

    } catch (error) {
      console.error('❌ Error generating AI plan:', error);
      alert('Could not load recommendations. Please try again.');
      setActiveStep('summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPlan = () => {
    // TODO: Implement PDF/Excel export
    alert('Export functionality coming soon!');
  };

  return (
    <>
      <SEO 
        title="AI Travel Budget Planner - Plan Your Trip Expenses | VegaKash.AI"
        description="Smart travel budget planning with AI-powered cost predictions, itinerary generation, and trip optimization. Plan flights, hotels, activities, and more."
        keywords="travel budget planner, trip cost calculator, vacation budget, travel expense planner, ai travel planner, trip cost estimator"
        canonical="/travel-budget"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AI Travel Budget Planner",
          "description": "Plan your trip expenses with intelligent cost predictions",
          "url": "https://vegaktools.com/travel-budget",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />

      <div className="travel-budget-planner">
        {/* Hero Section */}
        <header className="hero hero-travel-planner">
          <div className="hero-content">
            <div className="hero-icon-badge">✈️</div>
            <h1 className="hero-title">AI Travel Budget Planner</h1>
            <h2 className="hero-subtitle">
              Plan Your Dream Trip with AI-Powered Cost Predictions
            </h2>
            <p className="hero-description">
              Get instant budget estimates for flights, hotels, activities, and more. 
              AI-generated itineraries, currency conversion, and smart optimization—all in one place.
            </p>
            <button onClick={scrollToForm} className="hero-cta-button">
              🎯 Start Planning Your Trip
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="travel-content">
          <div id="travel-form-section" className="container">
            {activeStep === 'form' && (
              <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            )}
            
            {activeStep === 'summary' && travelData && (
              <TravelSummary 
                travelData={travelData}
                budgetData={travelData.budgetData || null}
                onEdit={() => setActiveStep('form')}
                onGenerateAI={handleGenerateAI}
                isGenerating={isLoading}
              />
            )}

            {activeStep === 'ai-plan' && (
              <TravelAIPlan 
                travelData={travelData}
                aiPlan={aiPlan}
                onBack={() => setActiveStep('summary')}
                onExport={handleExportPlan}
              />
            )}
          </div>
        </main>

        {/* Features Overview */}
        <section className="features-section">
          <div className="container">
            <h3 className="features-title">What You'll Get</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h4>AI Cost Estimation</h4>
                <p>Accurate predictions for all trip expenses</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h4>Smart Itinerary</h4>
                <p>Day-wise plans with timings and costs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h4>Currency Converter</h4>
                <p>Real-time exchange rates built-in</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Trip Optimizer</h4>
                <p>AI suggestions to reduce costs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📥</div>
                <h4>Export & Share</h4>
                <p>Download PDF/Excel or share via WhatsApp</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💾</div>
                <h4>Save & Compare</h4>
                <p>Store multiple trip plans side-by-side</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default TravelBudgetPage;
