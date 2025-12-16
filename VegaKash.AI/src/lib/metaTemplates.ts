export const generateTitle = (base: string, pageTitle?: string): string => {
  return pageTitle ? `${pageTitle} | ${base}` : base;
};

export const generateDescription = (defaultDescription: string, customDescription?: string): string => {
  return customDescription || defaultDescription;
};

export const generateOg = (title: string, description: string, url: string, image?: string) => {
  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    ...(image && { 'og:image': image }),
  };
};

export const generateTwitter = (title: string, description: string, image?: string) => {
  return {
    'twitter:title': title,
    'twitter:description': description,
    ...(image && { 'twitter:image': image }),
  };
};