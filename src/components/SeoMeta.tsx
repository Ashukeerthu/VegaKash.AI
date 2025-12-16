import React from 'react';
import Head from 'next/head';

interface SeoMetaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  schema?: object;
}

const SeoMeta: React.FC<SeoMetaProps> = ({ title, description, url, image, schema }) => {
  const jsonLd = schema ? JSON.stringify(schema) : null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
    </Head>
  );
};

export default SeoMeta;