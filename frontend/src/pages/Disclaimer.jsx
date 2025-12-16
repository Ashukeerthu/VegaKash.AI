import React from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { getBreadcrumbSchema } from '../utils/structuredData';
import '../styles/LegalPages.css';

/**
 * Disclaimer Page
 * Important legal disclaimer for financial tools
 */
function Disclaimer() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Disclaimer', path: null }
  ];
  
  const breadcrumbData = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Disclaimer', url: '/disclaimer' }
  ]);
  return (
    <>
      <SEO
        title="Disclaimer - VegaKash.AI"
        description="Important disclaimer about VegaKash.AI's financial planning tools and AI-generated recommendations"
        keywords="disclaimer, financial disclaimer, not financial advice, AI recommendations disclaimer, investment disclaimer"
        ogType="website"
        canonical="/disclaimer"
        structuredData={breadcrumbData}
      />

      <div className="legal-layout">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="legal-content">
          <h1 className="legal-title">Disclaimer</h1>
          <p className="legal-updated">Last Updated: December 1, 2025</p>

          <div className="legal-card">
            <div className="legal-callout danger">
              <h2 className="legal-section-title">⚠️ IMPORTANT: NOT FINANCIAL ADVICE</h2>
              <p className="legal-text">
                VegaKash.AI provides educational tools and AI-generated suggestions only. This is NOT professional financial, investment, tax, or legal advice.
              </p>
            </div>

            <section className="legal-section">
              <h2 className="legal-section-title">1. Nature of Service</h2>
              <p className="legal-text">
                VegaKash.AI is an educational platform that provides:
              </p>
              <ul className="legal-list">
                <li>Budget planning calculators and tools</li>
                <li>AI-powered financial suggestions based on general best practices</li>
                <li>Debt management and comparison features</li>
                <li>Financial goal tracking utilities</li>
              </ul>
              <p className="legal-text">
                <strong>These tools are for informational and educational purposes only.</strong> They should not be considered as professional advice or a substitute for consultation with a certified financial advisor.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">2. No Professional Relationship</h2>
              <p className="legal-text">
                By using VegaKash.AI, you acknowledge that:
              </p>
              <ul className="legal-list">
                <li>No financial advisor-client relationship is created</li>
                <li>We are not certified financial planners, CPAs, or tax professionals</li>
                <li>We do not provide personalized advice tailored to your specific situation</li>
                <li>We do not manage investments or handle your money</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">3. AI-Generated Recommendations</h2>
              <p className="legal-text">
                Our AI-powered recommendations are generated using OpenAI's language models and are based on:
              </p>
              <ul className="legal-list">
                <li>General financial best practices and rules of thumb</li>
                <li>The data you provide (income, expenses, goals)</li>
                <li>Common budgeting frameworks (like the 50-30-20 rule)</li>
              </ul>
              <p className="legal-text">
                <strong>AI recommendations may contain errors, may not suit your specific financial situation, and should always be verified by a professional before implementation.</strong>
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">4. No Guarantees</h2>
              <p className="legal-text">
                We do NOT guarantee:
              </p>
              <ul className="legal-list">
                <li>Accuracy of calculations or recommendations</li>
                <li>Financial success or achievement of your goals</li>
                <li>Specific investment returns or savings outcomes</li>
                <li>Debt elimination within any timeframe</li>
                <li>Tax benefits or legal compliance of suggestions</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">5. Risk Acknowledgment</h2>
              <p className="legal-text">
                You acknowledge and accept that:
              </p>
              <ul className="legal-list">
                <li>All financial decisions carry inherent risks</li>
                <li>Past performance does not indicate future results</li>
                <li>Financial markets and personal circumstances can change</li>
                <li>You are solely responsible for your financial decisions</li>
                <li>You should conduct your own research and due diligence</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">6. Third-Party Data</h2>
              <p className="legal-text">
                Our tools may reference or use data from third-party sources. We make no representations about the accuracy, completeness, or timeliness of this information. Interest rates, investment returns, and financial products mentioned are for illustrative purposes only.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">7. Tax and Legal Implications</h2>
              <p className="legal-text">
                VegaKash.AI does not provide tax, legal, or accounting advice. Financial decisions may have tax consequences or legal implications. Always consult with:
              </p>
              <ul className="legal-list">
                <li>A Certified Public Accountant (CPA) for tax matters</li>
                <li>A licensed attorney for legal questions</li>
                <li>A certified financial planner (CFP) for comprehensive financial planning</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">8. Investment Products</h2>
              <p className="legal-text">
                When our tools mention investment products (mutual funds, SIP, PPF, EPF, etc.), we:
              </p>
              <ul className="legal-list">
                <li>Do NOT recommend specific funds, companies, or securities</li>
                <li>Mention generic categories for educational purposes only</li>
                <li>Do not receive commissions or compensation from any financial institutions</li>
              </ul>
              <p className="legal-text">
                Always research investment products thoroughly and consult with a SEBI-registered investment advisor before investing.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">9. Accuracy of User Input</h2>
              <p className="legal-text">
                The quality of our calculations and recommendations depends entirely on the accuracy of the data you provide. We cannot verify the accuracy of your input and are not responsible for errors resulting from incorrect or incomplete data.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">10. Service Availability</h2>
              <p className="legal-text">
                VegaKash.AI is provided "as is" without any guarantees of:
              </p>
              <ul className="legal-list">
                <li>Continuous availability or uptime</li>
                <li>Error-free operation</li>
                <li>Compatibility with all devices or browsers</li>
                <li>Preservation of your data (always export important plans)</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">11. Liability Limitation</h2>
              <p className="legal-text">
                Under no circumstances shall VegaKash.AI, its creators, or affiliates be liable for:
              </p>
              <ul className="legal-list">
                <li>Financial losses resulting from using our tools</li>
                <li>Missed investment opportunities</li>
                <li>Tax penalties or legal issues</li>
                <li>Damages arising from service interruptions or errors</li>
                <li>Third-party service failures (OpenAI, Google AdSense)</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">12. Seek Professional Advice</h2>
              <div className="legal-callout info">
                <p className="legal-text">
                  We strongly recommend consulting with licensed professionals before making significant financial decisions, including:
                </p>
                <ul className="legal-list">
                  <li>Large purchases or investments</li>
                  <li>Debt consolidation or bankruptcy</li>
                  <li>Retirement planning</li>
                  <li>Estate planning</li>
                  <li>Tax strategies</li>
                </ul>
              </div>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">13. Updates to Disclaimer</h2>
              <p className="legal-text">
                This disclaimer may be updated periodically. Your continued use of VegaKash.AI constitutes acceptance of any changes.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section-title">14. Contact</h2>
              <p className="legal-text">
                For questions about this disclaimer:
              </p>
              <div className="legal-callout info">
                <p className="legal-text"><strong>Email:</strong> legal@vegaktools.com</p>
                <p className="legal-text"><strong>Website:</strong> https://vegaktools.com</p>
              </div>
            </section>

            <div className="legal-callout warning">
              <p className="legal-text" style={{ textAlign: 'center', fontWeight: 700 }}>
                USE AT YOUR OWN RISK. ALWAYS CONSULT CERTIFIED PROFESSIONALS FOR FINANCIAL ADVICE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Disclaimer;
