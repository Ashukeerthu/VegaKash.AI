/**
 * Enhanced SEO Component with Global Routing Support
 * 
 * Features:
 * ✓ Automatic hreflang tag generation
 * ✓ Proper canonical tag handling
 * ✓ Country-specific metadata
 * ✓ Schema markup for calculators
 * ✓ Open Graph tags for social sharing
 * ✓ FAQ Schema for Answer Engine Optimization (AEO)
 * ✓ Breadcrumb Schema for enhanced navigation
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { buildCalculatorURLs, COUNTRY_META } from '../utils/countryRouting';
import { generateFAQSchema, generateBreadcrumbSchema, generateGEOMetaTags } from '../utils/seoOptimization';

/**
 * Enhanced SEO Component for Global Calculator Pages
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.canonical - Canonical URL (auto-generated if not provided)
 * @param {string} props.tool - Tool name (e.g., 'emi', 'mortgage')
 * @param {string} props.country - Country code if this is a country-specific page
 * @param {Array<string>} props.supportedCountries - List of countries this tool supports
 * @param {Object} props.structuredData - Custom schema markup
 * @param {boolean} props.isGlobal - Is this the global version (default page)?
 */
export const EnhancedSEO = ({
  title,
  description,
  keywords,
  canonical,
  tool,
  country,
  supportedCountries = ['in', 'us', 'uk', 'ca', 'au', 'ae'],
  structuredData,
  isGlobal = false,
}) => {
  // Generate canonical if not provided
  let resolvedCanonical = canonical;
  if (!resolvedCanonical && tool) {
    if (country) {
      resolvedCanonical = `https://vegakash.ai/${country}/calculators/${tool}/`;
    } else {
      resolvedCanonical = `https://vegakash.ai/calculators/${tool}/`;
    }
  }

  // Generate hreflang links
  const generateHreflangs = () => {
    if (!tool) return [];

    const hreflangs = [];

    // Add x-default (global version)
    hreflangs.push(
      <link
        key="x-default"
        rel="alternate"
        hrefLang="x-default"
        href={`https://vegakash.ai/calculators/${tool}/`}
      />
    );

    // Add country-specific versions
    supportedCountries.forEach((countryCode) => {
      const meta = COUNTRY_META[countryCode];
      if (meta) {
        hreflangs.push(
          <link
            key={countryCode}
            rel="alternate"
            hrefLang={meta.hreflang.toLowerCase()}
            href={`https://vegakash.ai/${countryCode}/calculators/${tool}/`}
          />
        );
      }
    });

    return hreflangs;
  };

  // Generate calculator schema markup
  const generateCalculatorSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Calculator',
      name: title,
      description: description,
      url: resolvedCanonical,
      applicationCategory: 'FinanceApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: country ? COUNTRY_META[country]?.currency : 'USD',
      },
      provider: {
        '@type': 'Organization',
        name: 'VegaKash.AI',
        url: 'https://vegakash.ai/',
      },
    };

    // Add country-specific metadata if available
    if (country && COUNTRY_META[country]) {
      schema.inLanguage = COUNTRY_META[country].hreflang;
      schema.areaServed = COUNTRY_META[country].name;
    }

    return schema;
  };

  const hreflangs = generateHreflangs();
  const calculatorSchema = generateCalculatorSchema();
  const faqSchema = tool ? generateFAQSchema(tool, country) : null;
  const breadcrumbSchema = tool ? generateBreadcrumbSchema(tool, country) : null;
  const geoTags = country ? generateGEOMetaTags(country) : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical & Hreflang */}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
      {hreflangs}

      {/* GEO Meta Tags (Geographic Targeting) */}
      {geoTags && (
        <>
          <meta name="ICBM" content={geoTags.position} />
          <meta name="geo.position" content={geoTags.position} />
          <meta name="geo.placename" content={geoTags.placename} />
          <meta name="geo.region" content={geoTags.region} />
        </>
      )}

      {/* Open Graph Tags (Social Sharing) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:site_name" content="VegaKash.AI" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Robots Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content={country ? (COUNTRY_META[country]?.hreflang || 'en-US') : 'en-US'} />

      {/* Schema Markup - Calculator */}
      <script type="application/ld+json">{JSON.stringify(calculatorSchema)}</script>

      {/* Schema Markup - FAQ (for Answer Engine Optimization) */}
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}

      {/* Schema Markup - Breadcrumb */}
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}

      {/* Additional Schema Markup */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

/**
 * Country Selector Component
 * Allows users to switch between global and country-specific versions
 */
export const CountrySelectorWidget = ({ currentCountry, tool, onCountryChange }) => {
  return (
    <div className="country-selector-widget">
      <label htmlFor="country-select">View in your country:</label>
      <select
        id="country-select"
        value={currentCountry || 'global'}
        onChange={(e) => {
          const selected = e.target.value;
          onCountryChange(selected);
          localStorage.setItem('userAgreedToCountryRedirect', 'true');
        }}
        className="country-select"
      >
        <option value="global">🌍 Global Version</option>
        {Object.entries(COUNTRY_META).map(([code, meta]) => (
          <option key={code} value={code}>
            {meta.flag} {meta.name}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Breadcrumb Navigation Component
 * Shows current location in the hierarchy
 */
export const BreadcrumbNavigation = ({ country, tool, title }) => {
  const countryName = country ? COUNTRY_META[country]?.name : 'Global';

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/calculators/">Calculators</Link>
        </li>
        {country && (
          <li>
            <Link to={`/${country}/calculators/`}>{countryName}</Link>
          </li>
        )}
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
};

export default EnhancedSEO;
