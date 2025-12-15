import { NextApiRequest, NextApiResponse } from 'next';

const Sitemap = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/xml');

  const base = 'https://vegaktools.com';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${base}/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${base}/calculators/emi</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${base}/calculators/sip</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${base}/learning/blog</loc>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>${base}/learning/blog/financial-calculators-explained</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  </urlset>`;

  res.end(sitemap);
};

export default Sitemap;