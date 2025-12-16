import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import Link from 'next/link';

const ToolsPage: React.FC = () => {
  const tools = [
    { slug: 'emi', name: 'EMI Calculator' },
    { slug: 'sip', name: 'SIP Calculator' },
  ];

  return (
    <MainLayout
      title="Tools - VegaKash.AI"
      description="Explore our financial tools like EMI and SIP calculators."
      url="https://yourdomain.com/tools"
    >
      <h1>Tools</h1>
      <ul>
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`}>
              <a>{tool.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </MainLayout>
  );
};

export default ToolsPage;