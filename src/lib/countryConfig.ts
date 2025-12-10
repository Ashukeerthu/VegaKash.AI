export const getCountryConfig = (country: string) => {
  const countries = {
    india: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      info: 'This tool is optimized for users in India.',
    },
    usa: {
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      info: 'This tool is optimized for users in the United States.',
    },
    uk: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      info: 'This tool is optimized for users in the United Kingdom.',
    },
  };

  return countries[country] || null;
};