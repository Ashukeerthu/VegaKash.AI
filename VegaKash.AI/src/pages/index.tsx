import React from 'react';
import MainLayout from '../layouts/MainLayout';

const HomePage: React.FC = () => {
  return (
    <MainLayout
      title="VegaKash.AI - Smart Financial Tools"
      description="Explore smart financial tools like EMI and SIP calculators."
      url="https://yourdomain.com"
    >
      <h1>Welcome to VegaKash.AI</h1>
      <p>Discover tools to simplify your financial decisions.</p>
    </MainLayout>
  );
};

export default HomePage;