import React from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { getBreadcrumbSchema } from '../utils/structuredData';
import '../styles/LegalPages.css';

/**
 * Terms and Conditions Page
 * Required for AdSense approval
 */
function TermsAndConditions() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Terms and Conditions', path: null }
  ];
  
  const breadcrumbData = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms and Conditions', url: '/terms-and-conditions' }
  ]);
  return (
    <>
      <SEO
        title="Terms and Conditions - VegaKash.AI"
        description="VegaKash.AI Terms and Conditions - Legal terms for using our financial planning tools"
        keywords="terms and conditions, terms of service, VegaKash terms, legal agreement, user agreement"
        ogType="website"
        canonical="/terms-and-conditions"
        structuredData={breadcrumbData}
      />

      <div className="legal-layout">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="legal-content">
          <h1 className="legal-title">Terms and Conditions</h1>
          <p className="legal-updated">Last Updated: December 1, 2025</p>

          <div className="legal-card">
            <section className="legal-section">
              <h2 className="legal-section-title">1. Acceptance of Terms</h2>
              <p className="legal-text">
                By accessing and using VegaKash.AI ("Service", "Website", "we", "our"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">2. Description of Service</h2>
              <p className="legal-text">
                VegaKash.AI provides:
              </p>
              <ul className="legal-list">
                <li>AI-powered budget planning and financial recommendations</li>
                <li>Financial calculators (EMI, SIP, Loan, etc.)</li>
                <li>Debt management and comparison tools</li>
                <li>Financial goal tracking and planning</li>
                <li>PDF export of financial plans</li>
              </ul>
              <p className="legal-text">
                All services are provided "as is" without warranties of any kind.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">3. User Responsibilities</h2>
              
              <h3 className="legal-subtitle">3.1 Accuracy of Information</h3>
              <p className="legal-text">
                You are responsible for providing accurate financial information. We are not liable for incorrect recommendations based on inaccurate input data.
              </p>

              <h3 className="legal-subtitle">3.2 Age Requirement</h3>
              <p className="legal-text">
                You must be at least 18 years old to use this Service. By using the Service, you represent that you meet this requirement.
              </p>

              <h3 className="legal-subtitle">3.3 Prohibited Activities</h3>
              <p className="legal-text">You agree NOT to:</p>
              <ul className="legal-list">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to reverse engineer or hack our systems</li>
                <li>Upload malicious code or viruses</li>
                <li>Abuse API rate limits or overload our servers</li>
                <li>Scrape or harvest data from our website</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">4. Not Financial Advice</h2>
              <div className="legal-callout warning">
                <p className="legal-text"><strong>⚠️ IMPORTANT DISCLAIMER</strong></p>
                <p className="legal-text">
                  VegaKash.AI provides educational tools and AI-generated suggestions for budgeting and financial planning. <strong>This is NOT professional financial advice.</strong> We are not certified financial advisors, accountants, or tax professionals.
                </p>
              </div>
              <p className="legal-text">
                You should:
              </p>
              <ul className="legal-list">
                <li>Consult with a certified financial advisor before making major financial decisions</li>
                <li>Verify all calculations and recommendations independently</li>
                <li>Consider your unique financial situation and risk tolerance</li>
                <li>Not rely solely on AI-generated recommendations</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">5. Intellectual Property</h2>
              <p className="legal-text">
                All content on VegaKash.AI, including text, graphics, logos, software, and algorithms, is the property of VegaKash.AI and is protected by copyright and intellectual property laws. You may not:
              </p>
              <ul className="legal-list">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our brand name or logo without authorization</li>
                <li>Republish our calculators or tools on other websites</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">6. Third-Party Services</h2>
              <p className="legal-text">
                Our Service integrates with third-party services including:
              </p>
              <ul className="legal-list">
                <li><strong>OpenAI:</strong> For AI-powered recommendations</li>
                <li><strong>Google AdSense:</strong> For displaying advertisements</li>
              </ul>
              <p className="legal-text">
                Use of these services is subject to their respective terms and conditions. We are not responsible for third-party service failures or issues.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">7. Limitation of Liability</h2>
              <p className="legal-text">
                To the maximum extent permitted by law:
              </p>
              <ul className="legal-list">
                <li>VegaKash.AI is provided "as is" without any warranties</li>
                <li>We are not liable for financial losses resulting from use of our Service</li>
                <li>We are not responsible for errors in calculations or AI recommendations</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>Our total liability shall not exceed ₹1,000 or the amount you paid (if any)</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">8. Data and Privacy</h2>
              <p className="legal-text">
                Your use of VegaKash.AI is also governed by our <a href="/privacy-policy" className="legal-link">Privacy Policy</a>. Please review it to understand how we collect and use your data.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">9. Termination</h2>
              <p className="legal-text">
                We reserve the right to:
              </p>
              <ul className="legal-list">
                <li>Suspend or terminate your access without notice</li>
                <li>Modify or discontinue the Service at any time</li>
                <li>Remove content that violates these Terms</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">10. Advertisements</h2>
              <p className="legal-text">
                VegaKash.AI displays advertisements through Google AdSense. By using our Service, you agree to the display of these ads. We do not control the content of advertisements and are not responsible for the products or services advertised.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">11. Governing Law</h2>
              <p className="legal-text">
                These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of [Your City/State], India.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">12. Changes to Terms</h2>
              <p className="legal-text">
                We may update these Terms and Conditions at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We will post the updated Terms with a new "Last Updated" date.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">13. Contact Information</h2>
              <p className="legal-text">
                For questions about these Terms and Conditions, contact us at:
              </p>
              <div className="legal-callout info">
                <p className="legal-text"><strong>Email:</strong> legal@vegaktools.com</p>
                <p className="legal-text"><strong>Website:</strong> https://vegaktools.com</p>
              </div>
            </section>

            <section className="legal-section">
              <div className="legal-callout warning">
                <p className="legal-text">
                  By using VegaKash.AI, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default TermsAndConditions;
