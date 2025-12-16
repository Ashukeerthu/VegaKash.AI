import React from 'react';

interface HreflangLinksProps {
  links: { href: string; hreflang: string }[];
}

const HreflangLinks: React.FC<HreflangLinksProps> = ({ links }) => {
  return (
    <>
      {links.map((link) => (
        <link key={link.hreflang} rel="alternate" hrefLang={link.hreflang} href={link.href} />
      ))}
    </>
  );
};

export default HreflangLinks;