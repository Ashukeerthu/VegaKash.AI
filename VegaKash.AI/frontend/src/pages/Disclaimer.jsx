import React from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { getBreadcrumbSchema } from '../utils/structuredData';

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

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Disclaimer</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: December 1, 2025</p>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {/* Critical Warning Banner */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <h2 className="text-2xl font-bold text-red-800 mb-3">⚠️ IMPORTANT: NOT FINANCIAL ADVICE</h2>
              <p className="text-red-700 font-semibold text-lg">
                VegaKash.AI provides educational tools and AI-generated suggestions only. This is NOT professional financial, investment, tax, or legal advice.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Nature of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                VegaKash.AI is an educational platform that provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Budget planning calculators and tools</li>
                <li>AI-powered financial suggestions based on general best practices</li>
                <li>Debt management and comparison features</li>
                <li>Financial goal tracking utilities</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>These tools are for informational and educational purposes only.</strong> They should not be considered as professional advice or a substitute for consultation with a certified financial advisor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. No Professional Relationship</h2>
              <p className="text-gray-700 leading-relaxed">
                By using VegaKash.AI, you acknowledge that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>No financial advisor-client relationship is created</li>
                <li>We are not certified financial planners, CPAs, or tax professionals</li>
                <li>We do not provide personalized advice tailored to your specific situation</li>
                <li>We do not manage investments or handle your money</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. AI-Generated Recommendations</h2>
              <p className="text-gray-700 leading-relaxed">
                Our AI-powered recommendations are generated using OpenAI's language models and are based on:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>General financial best practices and rules of thumb</li>
                <li>The data you provide (income, expenses, goals)</li>
                <li>Common budgeting frameworks (like the 50-30-20 rule)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                AI recommendations may contain errors, may not suit your specific financial situation, and should always be verified by a professional before implementation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. No Guarantees</h2>
              <p className="text-gray-700 leading-relaxed">
                We do NOT guarantee:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Accuracy of calculations or recommendations</li>
                <li>Financial success or achievement of your goals</li>
                <li>Specific investment returns or savings outcomes</li>
                <li>Debt elimination within any timeframe</li>
                <li>Tax benefits or legal compliance of suggestions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Risk Acknowledgment</h2>
              <p className="text-gray-700 leading-relaxed">
                You acknowledge and accept that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>All financial decisions carry inherent risks</li>
                <li>Past performance does not indicate future results</li>
                <li>Financial markets and personal circumstances can change</li>
                <li>You are solely responsible for your financial decisions</li>
                <li>You should conduct your own research and due diligence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Data</h2>
              <p className="text-gray-700 leading-relaxed">
                Our tools may reference or use data from third-party sources. We make no representations about the accuracy, completeness, or timeliness of this information. Interest rates, investment returns, and financial products mentioned are for illustrative purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Tax and Legal Implications</h2>
              <p className="text-gray-700 leading-relaxed">
                VegaKash.AI does not provide tax, legal, or accounting advice. Financial decisions may have tax consequences or legal implications. Always consult with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>A Certified Public Accountant (CPA) for tax matters</li>
                <li>A licensed attorney for legal questions</li>
                <li>A certified financial planner (CFP) for comprehensive financial planning</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Investment Products</h2>
              <p className="text-gray-700 leading-relaxed">
                When our tools mention investment products (mutual funds, SIP, PPF, EPF, etc.), we:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Do NOT recommend specific funds, companies, or securities</li>
                <li>Mention generic categories for educational purposes only</li>
                <li>Do not receive commissions or compensation from any financial institutions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Always research investment products thoroughly and consult with a SEBI-registered investment advisor before investing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Accuracy of User Input</h2>
              <p className="text-gray-700 leading-relaxed">
                The quality of our calculations and recommendations depends entirely on the accuracy of the data you provide. We cannot verify the accuracy of your input and are not responsible for errors resulting from incorrect or incomplete data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                VegaKash.AI is provided "as is" without any guarantees of:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Continuous availability or uptime</li>
                <li>Error-free operation</li>
                <li>Compatibility with all devices or browsers</li>
                <li>Preservation of your data (always export important plans)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Liability Limitation</h2>
              <p className="text-gray-700 leading-relaxed">
                Under no circumstances shall VegaKash.AI, its creators, or affiliates be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Financial losses resulting from using our tools</li>
                <li>Missed investment opportunities</li>
                <li>Tax penalties or legal issues</li>
                <li>Damages arising from service interruptions or errors</li>
                <li>Third-party service failures (OpenAI, Google AdSense)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Seek Professional Advice</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-800 font-semibold">
                  We strongly recommend consulting with licensed professionals before making significant financial decisions, including:
                </p>
                <ul className="list-disc list-inside text-blue-700 space-y-2 ml-4 mt-2">
                  <li>Large purchases or investments</li>
                  <li>Debt consolidation or bankruptcy</li>
                  <li>Retirement planning</li>
                  <li>Estate planning</li>
                  <li>Tax strategies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Updates to Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                This disclaimer may be updated periodically. Your continued use of VegaKash.AI constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about this disclaimer:
              </p>
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-gray-800"><strong>Email:</strong> legal@vegaktools.com</p>
                <p className="text-gray-800"><strong>Website:</strong> https://vegaktools.com</p>
              </div>
            </section>

            {/* Final Warning */}
            <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <p className="text-yellow-900 font-bold text-center text-lg">
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
