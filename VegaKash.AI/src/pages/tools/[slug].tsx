import { GetServerSideProps } from 'next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import CalculatorShell from '../../components/CalculatorShell';
import AeoBlock from '../../components/AeoBlock'; // Ensure the module exists and path is correct
import { getCalculatorData } from '../../lib/calcMeta'; // Ensure the module exists and path is correct

interface ToolPageProps {
  title: string;
  description: string;
  url: string;
  schema: object;
  calculatorData: any;
}

const ToolPage: React.FC<ToolPageProps> = ({ title, description, url, schema, calculatorData }) => {
  return (
    <MainLayout title={title} description={description} url={url} schema={schema}>
      <CalculatorShell>
        <AeoBlock {...calculatorData} />
      </CalculatorShell>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};
  const calculatorData = getCalculatorData(slug as string);

  if (!calculatorData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: calculatorData.title,
      description: calculatorData.description,
      url: `https://yourdomain.com/tools/${slug}`,
      schema: calculatorData.schema,
      calculatorData,
    },
  };
};

export default ToolPage;