import { useEffect } from 'react';

/**
 * useSEO Hook - Dynamic SEO Meta Tags Management
 * 
 * @hook
 * @description Production-grade SEO hook for dynamically setting meta tags
 * Manages title, description, keywords, Open Graph, and Twitter Card data
 * 
 * @param {Object} seoConfig - SEO configuration object
 * @param {string} seoConfig.title - Page title
 * @param {string} seoConfig.description - Meta description
 * @param {string} seoConfig.keywords - Meta keywords (comma-separated)
 * @param {string} seoConfig.ogImage - Open Graph image URL
 * @param {string} seoConfig.ogType - Open Graph type (default: 'website')
 * @param {string} seoConfig.canonical - Canonical URL
 * @param {Object} seoConfig.structuredData - JSON-LD structured data
 * 
 * @example
 * useSEO({
 *   title: 'EMI Calculator - VegaKash.AI',
 *   description: 'Calculate your loan EMI with our advanced calculator',
 *   keywords: 'emi calculator, loan calculator, home loan emi',
 *   canonical: '/calculators/emi'
 * });
 */
const useSEO = ({
  title = 'VegaKash.AI - AI-Powered Financial Planning',
  description = 'Smart financial planning with AI-powered budgeting and comprehensive calculators',
  keywords = 'financial planning, budget calculator, emi calculator, sip calculator',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical = '',
  structuredData = null,
  author = 'VegaKash.AI',
  twitterCard = 'summary_large_image',
  robots = 'index, follow'
} = {}) => {
  
  const siteUrl = window.location.origin;
  const fullUrl = canonical ? `${siteUrl}${canonical}` : window.location.href;

  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attribute, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrValue] = selector.match(/\[(.+)="(.+)"\]/).slice(1);
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Helper function to update or create link tag
    const updateLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Primary meta tags
    updateMetaTag('[name="description"]', 'content', description);
    updateMetaTag('[name="keywords"]', 'content', keywords);
    updateMetaTag('[name="author"]', 'content', author);
    updateMetaTag('[name="robots"]', 'content', robots);

    // Canonical URL
    updateLinkTag('canonical', fullUrl);

    // Open Graph tags
    updateMetaTag('[property="og:title"]', 'content', title);
    updateMetaTag('[property="og:description"]', 'content', description);
    updateMetaTag('[property="og:url"]', 'content', fullUrl);
    updateMetaTag('[property="og:type"]', 'content', ogType);
    updateMetaTag('[property="og:image"]', 'content', `${siteUrl}${ogImage}`);
    updateMetaTag('[property="og:site_name"]', 'content', 'VegaKash.AI');

    // Twitter Card tags
    updateMetaTag('[name="twitter:card"]', 'content', twitterCard);
    updateMetaTag('[name="twitter:title"]', 'content', title);
    updateMetaTag('[name="twitter:description"]', 'content', description);
    updateMetaTag('[name="twitter:image"]', 'content', `${siteUrl}${ogImage}`);
    updateMetaTag('[name="twitter:url"]', 'content', fullUrl);

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function (optional - reset to defaults on unmount)
    return () => {
      // You can add cleanup logic here if needed
    };
  }, [title, description, keywords, ogImage, ogType, canonical, structuredData, author, twitterCard, robots, fullUrl, siteUrl]);
};

/**
 * Generate structured data for calculators
 * 
 * @param {Object} config - Calculator configuration
 * @returns {Object} JSON-LD structured data
 */
export const generateCalculatorSchema = ({
  name,
  description,
  url,
  category = 'Financial Calculator'
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': name,
    'description': description,
    'url': url,
    'applicationCategory': category,
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    },
    'creator': {
      '@type': 'Organization',
      'name': 'VegaKash.AI',
      'url': window.location.origin
    }
  };
};

/**
 * Generate FAQ schema
 * 
 * @param {Array} faqs - Array of FAQ objects with question and answer
 * @returns {Object} JSON-LD FAQ schema
 */
export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
};

export default useSEO;
