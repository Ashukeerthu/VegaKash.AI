import React from 'react';
import { getAEOQuestions, getRelatedTools } from '../utils/seoOptimization';
import '../styles/AEOContent.css';

/**
 * AEO (Answer Engine Optimization) Content Component
 * Displays common questions and answers to optimize for answer engines
 * and improve featured snippet chances
 */
export const AEOContentSection = ({ tool, country = null }) => {
  const questions = getAEOQuestions(tool);
  const relatedTools = getRelatedTools(tool);

  return (
    <section className="aeo-content-section">
      {/* Common Questions Section */}
      <div className="aeo-container">
        <h2 className="aeo-section-title">Common Questions About {tool.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase())}</h2>
        
        <div className="faq-list">
          {questions.map((question, index) => (
            <details key={index} className="faq-item">
              <summary className="faq-question">
                <span className="faq-number">{index + 1}</span>
                <span className="faq-text">{question}</span>
              </summary>
              <div className="faq-answer">
                <p>This is a common question about {tool}. Use the calculator above to get your personalized answer based on your specific financial situation.</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Related Tools Section */}
      <div className="related-tools-section">
        <h3>Related Financial Tools</h3>
        <div className="related-tools-grid">
          {relatedTools.map((relatedTool, index) => (
            <a
              key={index}
              href={relatedTool.path}
              className="related-tool-card"
              title={relatedTool.description}
            >
              <div className="tool-icon">🔗</div>
              <h4>{relatedTool.name}</h4>
              <p>{relatedTool.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Key Facts Section */}
      <div className="key-facts-section">
        <h3>Key Facts & Definitions</h3>
        <ul className="facts-list">
          <li>
            <strong>Financial Literacy:</strong> Understanding basic financial concepts helps you make better financial decisions and plan for your future.
          </li>
          <li>
            <strong>Compound Interest:</strong> Interest earned on both your principal and previously earned interest, helping your money grow exponentially.
          </li>
          <li>
            <strong>Interest Rate:</strong> The percentage charged by lenders for borrowing money, or paid by banks for saving money.
          </li>
          <li>
            <strong>Monthly Payment:</strong> The fixed amount you pay each month toward a loan, mortgage, or savings plan.
          </li>
          <li>
            <strong>Total Interest:</strong> The total amount of interest you'll pay over the life of a loan or earn from an investment.
          </li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="calculator-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This calculator provides estimates based on the information you provide. 
          For accurate financial advice, consult with a qualified financial advisor. Past performance is not indicative of future results.
        </p>
      </div>
    </section>
  );
};

export default AEOContentSection;
