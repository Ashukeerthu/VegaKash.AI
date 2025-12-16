import React from 'react';
import './DirectAnswerBox.css';

/**
 * DirectAnswerBox Component
 * Optimized for Google SGE, ChatGPT, Perplexity answer extraction
 * 
 * @component
 * @description Displays a featured snippet-style answer box for AI search engines
 */
function DirectAnswerBox({ question, answer, useCase, benefit, aiSummary }) {
  return (
    <section 
      className="direct-answer-box"
      role="complementary"
      aria-label="Quick Answer"
      data-ai-answer="true"
      data-content-type="direct-answer"
      itemScope
      itemType="https://schema.org/Answer"
    >
      <div className="answer-container">
        <div className="answer-icon" aria-hidden="true">💡</div>
        
        <div className="answer-content">
          <h2 
            className="answer-question"
            itemProp="question"
            data-ai-question="true"
          >
            {question}
          </h2>
          
          <p 
            className="answer-text"
            itemProp="text"
            data-answer-text="true"
            data-ai-extract="primary"
          >
            {answer}
          </p>

          {/* AI-friendly summary (hidden but machine-readable) */}
          {aiSummary && (
            <meta 
              itemProp="description" 
              content={aiSummary}
              data-ai-summary="true"
            />
          )}
          
          <div className="answer-meta">
            {useCase && (
              <div className="meta-item use-case" data-ai-use-case="true">
                <strong className="meta-label">Best for:</strong>
                <span className="meta-value">{useCase}</span>
              </div>
            )}
            
            {benefit && (
              <div className="meta-item benefit" data-ai-benefit="true">
                <strong className="meta-label">Key Benefit:</strong>
                <span className="meta-value">{benefit}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DirectAnswerBox;
