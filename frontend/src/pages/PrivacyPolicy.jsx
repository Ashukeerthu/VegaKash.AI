import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import '../styles/LegalPages.css';

/**
 * Privacy Policy Page
 * Required for AdSense approval
 */
function PrivacyPolicy() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Privacy Policy', path: null }
  ];
  
  return (
    <>
      <SEO 
        title="Privacy Policy - VegaKash.AI"
        description="VegaKash.AI Privacy Policy - Learn how we handle your data and protect your privacy"
        keywords="privacy policy, data protection, VegaKash privacy, user data, financial data security"
        canonical="/privacy-policy"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Privacy Policy",
              "url": "https://vegaktools.com/privacy-policy"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://vegaktools.com/privacy-policy" }
              ]
            }
          ]
        }}
      />

      <div className="legal-layout">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="legal-content">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last Updated: December 1, 2025</p>

          <div className="legal-card">
            <section className="legal-section">
              <h2 className="legal-section-title">1. Introduction</h2>
              <p className="legal-text">
                Welcome to VegaKash.AI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our financial planning and budgeting tools.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">2. Information We Collect</h2>
              
              <h3 className="legal-subtitle">2.1 Financial Data</h3>
              <p className="legal-text">
                When you use our calculators and planning tools, you may provide:
              </p>
              <ul className="legal-list">
                <li>Income information (monthly salary, additional income)</li>
                <li>Expense data (housing, utilities, groceries, etc.)</li>
                <li>Loan information (principal, interest rates, tenure)</li>
                <li>Financial goals and savings targets</li>
              </ul>
              <p className="legal-text">
                <strong>Important:</strong> This financial data is processed in real-time and is NOT stored on our servers unless you explicitly choose to save it. All calculations happen client-side in your browser.
              </p>

              <h3 className="legal-subtitle">2.2 Usage Data</h3>
              <p className="legal-text">
                We automatically collect certain information about how you interact with our website, including:
              </p>
              <ul className="legal-list">
                <li>Browser type and version</li>
                <li>Pages visited and features used</li>
                <li>Time spent on pages</li>
                <li>Device information (IP address, device type)</li>
              </ul>

              <h3 className="legal-subtitle">2.3 Cookies and Tracking</h3>
              <p className="legal-text">
                We use cookies and similar tracking technologies to enhance your experience. These include:
              </p>
              <ul className="legal-list">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant ads</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">3. How We Use Your Information</h2>
              <p className="legal-text">We use the collected information for:</p>
              <ul className="legal-list">
                <li>Providing and improving our financial planning services</li>
                <li>Generating AI-powered budget recommendations</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Displaying relevant advertisements (via Google AdSense)</li>
                <li>Detecting and preventing fraud or abuse</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">4. AI Processing and OpenAI</h2>
              <p className="legal-text">
                When you use our AI-powered budget recommendations, your financial data is sent to OpenAI's servers for processing. This data is used solely to generate personalized recommendations and is not stored by OpenAI beyond the processing period. Please review <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="legal-link">OpenAI's Privacy Policy</a> for more details.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">5. Data Storage and Security</h2>
              <p className="legal-text">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="legal-list">
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure API endpoints with rate limiting</li>
                <li>No permanent storage of financial calculations</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p className="legal-text">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">6. Third-Party Services</h2>
              <p className="legal-text">We work with the following third-party services:</p>
              <ul className="legal-list">
                <li><strong>Google AdSense:</strong> Displays advertisements on our site. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="legal-link">Google Privacy Policy</a></li>
                <li><strong>OpenAI:</strong> Powers our AI budget recommendations. <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="legal-link">OpenAI Privacy Policy</a></li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">7. Your Rights</h2>
              <p className="legal-text">You have the right to:</p>
              <ul className="legal-list">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Disable cookies in your browser settings</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">8. Children's Privacy</h2>
              <p className="legal-text">
                Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">9. Changes to This Policy</h2>
              <p className="legal-text">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated "Last Updated" date.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">10. Contact Us</h2>
              <p className="legal-text">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="legal-callout info">
                <p className="legal-text"><strong>Email:</strong> privacy@vegaktools.com</p>
                <p className="legal-text"><strong>Website:</strong> https://vegaktools.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;
