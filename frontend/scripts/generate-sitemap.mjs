import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Canonical routes to include in sitemap
const siteUrl = 'https://vegaktools.com';
const today = new Date().toISOString().slice(0, 10);

const urls = [
  '/',
  // Budget planner canonicals
  '/budget-planner',
  '/ai-budget-planner',
  // Calculators (flat slugs)
  '/emi-calculator',
  '/sip-calculator',
  '/fd-calculator',
  '/rd-calculator',
  '/car-loan-calculator',
  '/income-tax-calculator',
  // Calculator hub
  '/calculators',
  // Content
  '/learning/blog',
  '/learning/videos',
  '/about',
];

// Blog articles (extend as needed)
const blogArticles = [
  '/learning/blog/create-monthly-budget-ai'
];

const all = [...urls, ...blogArticles];

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n`;
const openSet = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
const closeSet = `\n</urlset>\n`;

const body = all.map((path) => {
  const priority = path === '/' ? '1.0' : path.startsWith('/learning/blog') ? '0.9' : path.startsWith('/calculators') || path.endsWith('-calculator') ? '0.8' : '0.7';
  const changefreq = path === '/' ? 'daily' : path.startsWith('/learning/blog') ? 'daily' : 'weekly';
  return `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n\n');

const xml = xmlHeader + openSet + '\n' + body + '\n' + closeSet;

const outPath = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf-8');
console.log(`[sitemap] Wrote ${all.length} URLs to`, outPath);
