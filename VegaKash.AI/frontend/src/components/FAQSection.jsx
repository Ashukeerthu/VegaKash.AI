import React, { useState } from 'react';
import './FAQSection.css';

/**
 * FAQSection Component
 * Collapsible FAQ with FAQPage schema for rich results
 * 
 * @component
 */
function FAQSection({ 
  title = "Frequently Asked Questions",
  faqs = [],
  showSchema = true,
  url,
  defaultOpen = 0
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Generate FAQPage schema
  const faqSchema = showSchema ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(url && { url }),
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  return (
    <>
      {/* Structured Data */}
      {showSchema && faqSchema && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section 
        className="faq-section"
        role="region"
        aria-label="Frequently Asked Questions"
        data-content-type="faq"
        data-ai-faq="true"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <h2 className="faq-title" data-ai-title="true">
          {title}
        </h2>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              data-faq-index={index}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                data-ai-question="true"
              >
                <span 
                  className="question-text"
                  itemProp="name"
                >
                  {faq.question}
                </span>
                <span 
                  className="faq-icon"
                  aria-hidden="true"
                >
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>

              <div
                id={`faq-answer-${index}`}
                className="faq-answer"
                role="region"
                aria-hidden={openIndex !== index}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
                data-ai-answer="true"
              >
                <div 
                  className="answer-text"
                  itemProp="text"
                >
                  {faq.answer}
                </div>

                {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                  <div className="related-links">
                    <strong>Related:</strong>
                    {faq.relatedLinks.map((link, i) => (
                      <a 
                        key={i}
                        href={link.url}
                        className="related-link"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Hidden summary for AI extraction */}
        <div 
          className="faq-summary visually-hidden"
          data-ai-summary="true"
        >
          This page answers {faqs.length} frequently asked questions about{' '}
          {title.toLowerCase().replace('frequently asked questions', '')}. 
          {faqs.map((faq, i) => ` Q${i + 1}: ${faq.question}`).join('.')}
        </div>
      </section>
    </>
  );
}

export default FAQSection;
