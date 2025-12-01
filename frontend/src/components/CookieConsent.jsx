import React, { useState, useEffect } from 'react';

/**
 * Cookie Consent Banner
 * Required for GDPR/CCPA compliance and AdSense
 */
function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    // Note: If declined, you should disable non-essential cookies
    // This may affect AdSense and analytics
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">🍪 Cookie Notice</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                We use cookies to enhance your experience, analyze site usage, and display personalized advertisements through Google AdSense. 
                By clicking "Accept", you consent to our use of cookies. Learn more in our{' '}
                <a href="/privacy-policy" className="text-indigo-400 hover:text-indigo-300 underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
            
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg"
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
