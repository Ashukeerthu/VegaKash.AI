import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Manages meta tags, titles, and structured data
 * Optimizes each page for search engines and social media
 */
function SEO({ 
  title = 'VegaKash.AI - AI-Powered Budget Planner & Financial Calculator',
  description = 'Smart financial planning tool with AI-powered budget advice, calculators for EMI, SIP, loans, and personalized savings recommendations. Free financial management made easy.',
  keywords = 'budget planner, financial calculator, EMI calculator, SIP calculator, loan calculator, AI budget advisor, savings planner, financial planning, money management',
  author = 'VegaKash.AI',
  ogType = 'website',
  ogImage = '/og-image.jpg',
  canonical,
  structuredData
}) {
  const siteUrl = 'https://vegaktools.com';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="VegaKash.AI" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#667eea" />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;
