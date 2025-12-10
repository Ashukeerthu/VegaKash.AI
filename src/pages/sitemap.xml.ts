import { NextApiRequest, NextApiResponse } from 'next';

const Sitemap = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/xml');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://yourdomain.com/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://yourdomain.com/tools/emi</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://yourdomain.com/tools/sip</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  </urlset>`;

  res.end(sitemap);
};

export default Sitemap;