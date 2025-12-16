import React from 'react';
import './FormulaDisplay.css';

/**
 * FormulaDisplay Component
 * Displays mathematical formulas with LaTeX-style rendering and plain text alternatives
 * Optimized for AI search engines and accessibility
 * 
 * @component
 */
function FormulaDisplay({ 
  title = "Formula Used",
  formula,
  plainText,
  variables = [],
  example,
  note
}) {
  return (
    <section 
      className="formula-display"
      role="region"
      aria-label="Mathematical formula"
      data-content-type="formula"
      data-ai-formula="true"
      itemScope
      itemType="https://schema.org/MathSolver"
    >
      <h3 className="formula-title" data-ai-title="true">
        {title}
      </h3>

      {/* Visual Formula Display */}
      <div 
        className="formula-box"
        role="img"
        aria-label={plainText}
        data-formula-visual="true"
      >
        <div 
          className="formula-content"
          itemProp="mathExpression"
          data-math-expression="true"
        >
          {formula}
        </div>
      </div>

      {/* Plain Text Alternative for AI & Screen Readers */}
      <div 
        className="formula-plain-text"
        data-ai-extract="formula"
        itemProp="description"
      >
        <strong>Plain Text:</strong> {plainText}
      </div>

      {/* Variable Definitions */}
      {variables.length > 0 && (
        <div className="formula-variables" data-variables="true">
          <h4 className="variables-title">Where:</h4>
          <dl className="variables-list">
            {variables.map((variable, index) => (
              <div 
                key={index}
                className="variable-item"
                data-variable={variable.symbol}
                itemScope
                itemType="https://schema.org/DefinedTerm"
              >
                <dt 
                  className="variable-symbol"
                  itemProp="name"
                  data-symbol="true"
                >
                  {variable.symbol}
                </dt>
                <dd 
                  className="variable-description"
                  itemProp="description"
                  data-ai-definition="true"
                >
                  {variable.description}
                  {variable.unit && (
                    <span className="variable-unit"> ({variable.unit})</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Example Calculation */}
      {example && (
        <div className="formula-example" data-example="true">
          <h4 className="example-title">Example Calculation:</h4>
          <div className="example-content" data-ai-example="true">
            {example.input && (
              <div className="example-input">
                <strong>Given:</strong> {example.input}
              </div>
            )}
            {example.calculation && (
              <div className="example-calculation">
                <strong>Calculation:</strong> {example.calculation}
              </div>
            )}
            {example.result && (
              <div className="example-result">
                <strong>Result:</strong> {example.result}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Note */}
      {note && (
        <div 
          className="formula-note"
          role="note"
          data-note="true"
        >
          ℹ️ <strong>Note:</strong> {note}
        </div>
      )}

      {/* Hidden structured data for AI extraction */}
      <meta 
        itemProp="educationalLevel" 
        content="Intermediate"
        data-ai-complexity="intermediate"
      />
      <meta 
        itemProp="learningResourceType" 
        content="Formula"
      />
    </section>
  );
}

export default FormulaDisplay;
