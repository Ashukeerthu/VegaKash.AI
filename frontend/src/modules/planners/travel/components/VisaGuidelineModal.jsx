import React, { useState } from 'react';
import './VisaGuidelineModal.css';

/**
 * Visa Guideline Modal Component
 * Shows detailed visa information with external reference links
 */
function VisaGuidelineModal({ 
  isOpen, 
  onClose, 
  visaType, 
  visaGuidance, 
  originCountry, 
  destinationCountry,
  tripDays 
}) {
  // Visa reference websites by country
  const visaWebsites = {
    'Thailand': 'https://www.thaievisa.go.th/en/visa-information.html', // Official Thai Ministry of Foreign Affairs
    'Indonesia': 'https://www.imigrasi.go.id/wna/permohonan-visa-republik-indonesia', // Indonesian Immigration
    'India': 'https://www.vfsglobalindia.com', // India Visa Portal
    'Sri Lanka': 'https://www.immigration.gov.lk', // Sri Lanka Department of Immigration
    'Vietnam': 'https://www.mofa.gov.vn/en/', // Vietnam Ministry of Foreign Affairs
    'Singapore': 'https://www.ica.gov.sg/enter-transit-depart', // Singapore ICA
    'France': 'https://www.france-visas.gouv.fr', // Official France Visas Portal
    'Germany': 'https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt', // German Foreign Office
    'UK': 'https://www.gov.uk/browse/visas-immigration', // UK Immigration Portal
    'USA': 'https://travel.state.gov/content/travel/en/us-visas.html', // US State Department
    'Canada': 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html', // Canada Immigration
    'Australia': 'https://immi.homeaffairs.gov.au/visas', // Australian Immigration
    'New Zealand': 'https://www.immigration.govt.nz', // NZ Immigration
    'Japan': 'https://www.mofa.go.jp/j_info/visit/visa/index.html', // Japan MOFA
    'Bali': 'https://www.imigrasi.go.id/wna/permohonan-visa-republik-indonesia', // Indonesian Immigration
    'Dubai': 'https://u.ae/en/information-and-services/visa-and-emirates-id', // UAE Official Portal
    'UAE': 'https://u.ae/en/information-and-services/visa-and-emirates-id', // UAE Official Portal
    'Malaysia': 'https://www.kln.gov.my/en/', // Malaysia Ministry of Foreign Affairs
    'Philippines': 'https://www.dfa.gov.ph', // Philippines Department of Foreign Affairs
    'Myanmar': 'https://www.mofa.gov.mm', // Myanmar Ministry of Foreign Affairs
    'Cambodia': 'https://mfaic.gov.kh', // Cambodia Ministry of Foreign Affairs
    'Laos': 'https://mofa.gov.la', // Laos Ministry of Foreign Affairs
    'Hong Kong': 'https://www.immd.gov.hk/english/services/visas.html', // Hong Kong Immigration
    'Taiwan': 'https://www.boca.gov.tw', // Taiwan Visa
    'China': 'https://www.visaforchina.org', // China Visa Service
    'South Korea': 'https://www.immigration.go.kr/imi/1364', // South Korea Immigration
  };

  // Determine if domestic travel
  const isDomestic = originCountry.toLowerCase() === destinationCountry.toLowerCase();

  // Get visa reference website
  const getVisaWebsite = () => {
    return visaWebsites[destinationCountry] || `https://www.google.com/search?q=${destinationCountry}+visa+requirements`;
  };

  if (!isOpen) return null;

  return (
    <div className="visa-modal-overlay" onClick={onClose}>
      <div className="visa-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="visa-modal-header">
          <h2>📋 Visa Guidelines</h2>
          <button className="visa-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="visa-modal-body">
          {isDomestic ? (
            <div className="visa-info-section domestic">
              <div className="visa-info-icon">✅</div>
              <div className="visa-info-content">
                <h3>Domestic Travel - No Visa Required</h3>
                <p>
                  You are traveling within <strong>{destinationCountry}</strong>. 
                  As a citizen or resident, no visa is required for domestic travel.
                </p>
                <div className="visa-details">
                  <p><strong>Duration:</strong> {tripDays} days</p>
                  <p><strong>Visa Requirement:</strong> None - Free to travel within country</p>
                  <p><strong>Documentation:</strong> Valid ID/Passport for local travel</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="visa-info-section international">
              {visaType && (
                <div className="visa-type-badge">
                  <span className="badge-label">Visa Type:</span>
                  <span className="badge-value">{visaType}</span>
                </div>
              )}

              {visaGuidance && (
                <div className="visa-guidance-box">
                  <h3>Quick Guideline</h3>
                  <p>{visaGuidance}</p>
                </div>
              )}

              <div className="visa-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Trip Duration:</span>
                  <span className="detail-value">{tripDays} days</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">From:</span>
                  <span className="detail-value">{originCountry}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">To:</span>
                  <span className="detail-value">{destinationCountry}</span>
                </div>
              </div>

              <div className="visa-tips-section">
                <h4>💡 Important Tips</h4>
                <ul>
                  <li>Check your passport validity (typically 6+ months required)</li>
                  <li>Apply for visa well in advance (processing takes 2-4 weeks)</li>
                  <li>Keep copies of important documents (passport, visa, travel insurance)</li>
                  <li>Check embassy websites for latest requirements</li>
                  <li>Consider travel insurance even if visa isn't required</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer with external link */}
        <div className="visa-modal-footer">
          <a 
            href={getVisaWebsite()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="visa-link-button"
          >
            🔗 View Official {destinationCountry} Visa Guidelines
          </a>
          <button className="visa-modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisaGuidelineModal;
