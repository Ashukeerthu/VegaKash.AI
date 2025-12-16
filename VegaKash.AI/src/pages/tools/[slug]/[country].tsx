import { GetServerSideProps } from 'next';
import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import CalculatorShell from '../../../components/CalculatorShell';
import AeoBlock from '../../../components/AeoBlock';
import { getCalculatorData } from '../../../lib/calcMeta';
import { getCountryConfig } from '../../../lib/countryConfig';

interface CountryToolPageProps {
  title: string;
  description: string;
  url: string;
  schema: object;
  calculatorData: any;
  countryConfig: any;
}

const CountryToolPage: React.FC<CountryToolPageProps> = ({ title, description, url, schema, calculatorData, countryConfig }) => {
  return (
    <MainLayout title={title} description={description} url={url} schema={schema}>
      <CalculatorShell>
        <AeoBlock {...calculatorData} />
        <div className="country-config">
          <h3>Country-Specific Information</h3>
          <p>{countryConfig.info}</p>
        </div>
      </CalculatorShell>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, country } = context.params || {};
  const calculatorData = getCalculatorData(slug as string);
  const countryConfig = getCountryConfig(country as string);

  if (!calculatorData || !countryConfig) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: calculatorData.title,
      description: calculatorData.description,
      url: `https://yourdomain.com/tools/${slug}/${country}`,
      schema: calculatorData.schema,
      calculatorData,
      countryConfig,
    },
  };
};

export default CountryToolPage;