import React, { useEffect, useState } from 'react';
import SEO from '../../../components/SEO';
import TravelForm from './components/TravelForm';
import TravelSummary from './components/TravelSummary';
import TravelAIPlan from './components/TravelAIPlan';
import TravelLoadingScreen from './components/TravelLoadingScreen';
import ScrollToTop from '../../core/ui/ScrollToTop';
import { API_BASE_URL } from '../../../config';
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

  useEffect(() => {
    const target = document.querySelector('.travel-content') || document.getElementById('travel-form-section') || document.body;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

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
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/travel/calculate-budget`, {
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
          `${API_BASE_URL}/api/v1/ai/travel/optimize`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              travelData: travelDataPayload,
              budgetData: budgetDataPayload
            }),
          },
          59000
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
          `${API_BASE_URL}/api/v1/ai/travel/generate-itinerary`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              travelData: travelDataPayload,
              budgetData: budgetDataPayload,
              itineraryDetailLevel: travelData.itineraryDetailLevel || 'standard'
            }),
          },
          59000
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

  const handleExportPDF = async () => {
    if (!aiPlan) {
      alert('No plan to export. Please generate a plan first.');
      return;
    }

    try {
      // Dynamically import jspdf
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper to add new page if needed
      const checkAddPage = (requiredSpace = 20) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper to format currency
      const formatCurrencyPDF = (value, currency) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD'
        }).format(value || 0);
      };

      // Header with blue gradient background
      doc.setFillColor(102, 126, 234);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Travel Plan', pageWidth / 2, 22, { align: 'center' });
      
      // Destination with white text
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(`${travelData.destinationCity}, ${travelData.destinationCountry}`, pageWidth / 2, 38, { align: 'center' });
      
      yPosition = 65;

      // Trip Details Section with styled box
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, 40, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 126, 234);
      doc.text('Trip Details', margin + 5, yPosition + 3);
      
      yPosition += 12;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`Dates: ${travelData.startDate} to ${travelData.endDate}`, margin + 5, yPosition);
      yPosition += 7;
      doc.text(`Travelers: ${travelData.adults} adult(s)${travelData.children ? `, ${travelData.children} child(ren)` : ''}`, margin + 5, yPosition);
      yPosition += 7;
      doc.text(`Style: ${travelData.travelStyle}`, margin + 5, yPosition);
      yPosition += 7;
      doc.text(`Currency: ${travelData.homeCurrency}`, margin + 5, yPosition);
      yPosition += 15;

      // Budget Optimization Section with styled box
      if (aiPlan.optimization) {
        checkAddPage(50);
        
        // Section header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 126, 234);
        doc.text('Budget Optimization', margin, yPosition);
        yPosition += 10;
        
        // Budget box with light green background
        doc.setFillColor(236, 253, 245);
        doc.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, 40, 3, 3, 'F');
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text('Original Cost:', margin + 5, yPosition + 2);
        doc.setFont('helvetica', 'normal');
        doc.text(formatCurrencyPDF(aiPlan.optimization.originalCost, travelData.homeCurrency), margin + 45, yPosition + 2);
        
        yPosition += 8;
        doc.setFont('helvetica', 'bold');
        doc.text('Optimized Cost:', margin + 5, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(formatCurrencyPDF(aiPlan.optimization.optimizedCost, travelData.homeCurrency), margin + 45, yPosition);
        
        yPosition += 10;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 163, 74);
        doc.text('Savings:', margin + 5, yPosition);
        doc.setFontSize(12);
        doc.text(`${formatCurrencyPDF(aiPlan.optimization.savings, travelData.homeCurrency)} (${aiPlan.optimization.savingsPercentage.toFixed(2)}%)`, margin + 45, yPosition);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        yPosition += 18;
      }

      // Itinerary Section
      if (aiPlan.itinerary?.itinerary) {
        checkAddPage(15);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 126, 234);
        doc.text('Daily Itinerary', margin, yPosition);
        yPosition += 10;

        const days = aiPlan.itinerary.itinerary.slice(0, 7); // First 7 days for PDF
        days.forEach((day, index) => {
          checkAddPage(30);
          
          // Day header with colored background
          doc.setFillColor(237, 242, 247);
          doc.roundedRect(margin, yPosition - 4, pageWidth - 2 * margin, 10, 2, 2, 'F');
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 64, 175);
          doc.text(`Day ${day.day}: ${day.theme || day.title || 'Explore Riyadh'}`, margin + 3, yPosition + 2);
          yPosition += 12;
          
          // Activities
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
          
          if (day.sections && day.sections.length > 0) {
            day.sections.forEach(section => {
              checkAddPage(8);
              const bullet = section.time ? `⏰ ${section.time}` : '•';
              const activityText = `${bullet} ${section.title || section.description || ''}`;
              const lines = doc.splitTextToSize(activityText, pageWidth - 2 * margin - 8);
              lines.forEach(line => {
                checkAddPage(5);
                doc.text(line, margin + 5, yPosition);
                yPosition += 5;
              });
            });
          } else if (day.activities && day.activities.length > 0) {
            day.activities.forEach(activity => {
              checkAddPage(8);
              const activityText = `• ${activity}`;
              const lines = doc.splitTextToSize(activityText, pageWidth - 2 * margin - 8);
              lines.forEach(line => {
                checkAddPage(5);
                doc.text(line, margin + 5, yPosition);
                yPosition += 5;
              });
            });
          }
          
          // Cost
          yPosition += 2;
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(22, 163, 74);
          doc.text(`Est. Cost: ${formatCurrencyPDF(day.estimated_cost || day.estimatedCost || 3250, travelData.homeCurrency)}`, margin + 5, yPosition);
          
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          yPosition += 10;
        });

        if (aiPlan.itinerary.itinerary.length > 7) {
          doc.setFontSize(10);
          doc.setTextColor(120, 120, 120);
          doc.setFont('helvetica', 'italic');
          doc.text(`...and ${aiPlan.itinerary.itinerary.length - 7} more days in your complete itinerary`, margin, yPosition);
          yPosition += 8;
        }
      }

      // Footer on each page
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by VegaKash.AI on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
      }

      const fileName = `Travel-Plan-${travelData.destinationCity.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('PDF Export error:', error);
      alert('Failed to export PDF. Please try again or use JSON export.');
    }
  };

  const handleExportJSON = () => {
    try {
      const exportData = {
        tripDetails: {
          destination: `${travelData.destinationCity}, ${travelData.destinationCountry}`,
          travelDates: `${travelData.startDate} to ${travelData.endDate}`,
          travelers: `${travelData.adults} adult(s)${travelData.children ? `, ${travelData.children} child(ren)` : ''}`,
          currency: travelData.homeCurrency,
        },
        budget: aiPlan.optimization ? {
          originalCost: aiPlan.optimization.originalCost,
          optimizedCost: aiPlan.optimization.optimizedCost,
          savings: aiPlan.optimization.savings,
          savingsPercentage: aiPlan.optimization.savingsPercentage,
        } : null,
        itinerary: aiPlan.itinerary?.itinerary || [],
        suggestions: aiPlan.optimization?.suggestions || [],
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `travel-plan-${travelData.destinationCity?.replace(/[^a-zA-Z0-9]/g, '-') || 'trip'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('JSON Export error:', error);
      alert('Failed to export plan. Please try again.');
    }
  };

  const handleExportPlan = handleExportPDF;

  const destination = travelData?.destinationCity || 'Your Dream Destination';
  const tripDates = travelData?.startDate && travelData?.endDate 
    ? `${new Date(travelData.startDate).toLocaleDateString()} - ${new Date(travelData.endDate).toLocaleDateString()}`
    : '';

  // Dynamic meta tags for social sharing
  const pageTitle = travelData 
    ? `AI Travel Plan: ${destination} - ${tripDates} | VegaKash.AI` 
    : "AI Travel Budget Planner - Plan Your Trip Expenses | VegaKash.AI";
  
  const pageDescription = travelData 
    ? `Explore my AI-powered travel plan to ${destination}. Includes budget optimization, daily itinerary with activities, and smart recommendations for the perfect trip.`
    : "Smart travel budget planning with AI-powered cost predictions, itinerary generation, and trip optimization. Plan flights, hotels, activities, and more.";
  
  const twitterTitleMeta = travelData 
    ? `My AI Travel Plan to ${destination} - ${tripDates}` 
    : "AI Travel Budget Planner | VegaKash.AI";
  
  const twitterDescriptionMeta = travelData 
    ? `Check out my AI-generated travel plan to ${destination}! Complete with budget optimization, daily itinerary, and smart recommendations. Created with VegaKash.AI`
    : "Plan your dream trip with AI-powered cost predictions and smart itinerary generation. Get personalized travel recommendations.";
  
  const ogImageUrl = travelData 
    ? "https://vegaktools.com/images/ai-travel-2026-banner.jpg" 
    : "https://vegaktools.com/images/ai-travel-2026-banner.jpg";
  
  const ogImageAltText = travelData 
    ? `AI-generated travel plan for ${destination} showing itinerary and budget optimization`
    : "AI-powered travel planning interface with budget calculator and itinerary generator";

  return (
    <>
      <ScrollToTop threshold={300} />
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords="travel budget planner, trip cost calculator, vacation budget, travel expense planner, ai travel planner, trip cost estimator, ai itinerary generator"
        canonical="/travel-budget"
        ogType={travelData ? "article" : "website"}
        ogImage={ogImageUrl}
        ogImageAlt={ogImageAltText}
        twitterCard="summary_large_image"
        twitterTitle={twitterTitleMeta}
        twitterDescription={twitterDescriptionMeta}
        twitterImage={ogImageUrl}
        twitterImageAlt={ogImageAltText}
        twitterSite="@vegaktools"
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
          {/* Loading Screen Overlay */}
          <TravelLoadingScreen 
            isLoading={isLoading && activeStep === 'ai-plan'} 
            title="Planning Your Journey"
          />

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
