import React from 'react';

interface AeoBlockProps {
  title: string;
  directAnswer: string;
  summary: string;
  steps: string[];
  formula: string;
  whenToUse: string;
}

const AeoBlock: React.FC<AeoBlockProps> = ({ title, directAnswer, summary, steps, formula, whenToUse }) => {
  return (
    <section className="aeo-block" aria-labelledby="aeo-title" data-ai-summary="true">
      <h2 id="aeo-title">{title}</h2>
      <div className="aeo-direct-answer" role="article">
        <p className="aeo-result">{directAnswer}</p>
        <p className="aeo-summary">{summary}</p>
      </div>

      <div className="aeo-steps">
        <h3>Step-by-step</h3>
        <ol>
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="aeo-formula">
        <h3>Formula used</h3>
        <pre>{formula}</pre>
      </div>

      <div className="aeo-when-to-use">
        <h3>When to use this tool</h3>
        <p>{whenToUse}</p>
      </div>
    </section>
  );
};

export default AeoBlock;