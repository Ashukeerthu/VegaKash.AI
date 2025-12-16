import { GetServerSideProps } from 'next';
import { getCalculatorData } from '../../../lib/calcMeta';

const AnswerJson = () => null;

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  if (!slug) {
    return { notFound: true };
  }

  const calculatorData = getCalculatorData(slug);

  if (!calculatorData) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ error: 'Calculator not found' }));
    res.end();
    return { props: {} };
  }

  res.setHeader('Content-Type', 'application/json');
  res.write(
    JSON.stringify({
      directAnswer: calculatorData.directAnswer,
      summary: calculatorData.summary,
      formula: calculatorData.formula,
    })
  );
  res.end();

  return { props: {} };
};

export default AnswerJson;