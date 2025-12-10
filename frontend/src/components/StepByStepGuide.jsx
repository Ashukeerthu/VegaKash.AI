import React from 'react';
import './StepByStepGuide.css';

/**
 * StepByStepGuide Component
 * Optimized for HowTo schema and AI answer extraction
 * 
 * @component
 * @description Displays structured step-by-step instructions with HowTo schema
 */
function StepByStepGuide({ 
  title = "How to Use This Calculator", 
  steps, 
  estimatedTime,
  difficulty,
  tool 
}) {
  // Generate HowTo structured data
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": `Step-by-step guide for ${title.toLowerCase()}`,
    ...(estimatedTime && { "totalTime": estimatedTime }),
    ...(tool && { "tool": { "@type": "WebApplication", "name": tool } }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.description,
      "itemListElement": {
        "@type": "HowToDirection",
        "text": step.description
      },
      ...(step.image && { "image": step.image }),
      ...(step.tip && { "tip": { "@type": "Tip", "text": step.tip } })
    }))
  };

  return (
    <>
      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <section 
        className="step-by-step-guide"
        role="region"
        aria-label="Step-by-step guide"
        data-content-type="howto"
        data-ai-steps="true"
      >
        <div className="guide-header">
          <h2 className="guide-title" data-ai-title="true">
            {title}
          </h2>
          
          <div className="guide-meta">
            {estimatedTime && (
              <span className="meta-badge time" data-duration={estimatedTime}>
                ⏱️ {estimatedTime}
              </span>
            )}
            {difficulty && (
              <span 
                className={`meta-badge difficulty ${difficulty.toLowerCase()}`}
                data-difficulty={difficulty}
              >
                📊 {difficulty}
              </span>
            )}
          </div>
        </div>

        <ol className="steps-list" data-steps-count={steps.length}>
          {steps.map((step, index) => (
            <li 
              key={index}
              className="step-item"
              data-step-number={index + 1}
              data-ai-step="true"
              itemScope
              itemType="https://schema.org/HowToStep"
            >
              <meta itemProp="position" content={index + 1} />
              
              <div className="step-number" aria-label={`Step ${index + 1}`}>
                {index + 1}
              </div>
              
              <div className="step-content">
                <h3 
                  className="step-title"
                  itemProp="name"
                  data-ai-step-title="true"
                >
                  {step.title}
                </h3>
                
                <p 
                  className="step-description"
                  itemProp="text"
                  data-ai-instruction="true"
                >
                  {step.description}
                </p>

                {step.example && (
                  <div className="step-example" data-example="true">
                    <strong className="example-label">Example:</strong>
                    <span className="example-text">{step.example}</span>
                  </div>
                )}

                {step.tip && (
                  <div 
                    className="step-tip"
                    role="note"
                    data-tip="true"
                  >
                    💡 <strong>Tip:</strong> {step.tip}
                  </div>
                )}

                {step.warning && (
                  <div 
                    className="step-warning"
                    role="alert"
                    data-warning="true"
                  >
                    ⚠️ <strong>Note:</strong> {step.warning}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* AI-friendly summary */}
        <div 
          className="guide-summary visually-hidden"
          data-ai-summary="true"
          aria-label="Summary"
        >
          Complete this process in {steps.length} steps. {steps.map((s, i) => 
            `Step ${i + 1}: ${s.title}.`
          ).join(' ')}
        </div>
      </section>
    </>
  );
}

export default StepByStepGuide;
