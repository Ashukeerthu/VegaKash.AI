import { NextApiRequest, NextApiResponse } from 'next';
import { getCalculatorData } from '../../../lib/calcMeta';

const AnswerJson = (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;
  const calculatorData = getCalculatorData(slug as string);

  if (!calculatorData) {
    res.status(404).json({ error: 'Calculator not found' });
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    directAnswer: calculatorData.directAnswer,
    summary: calculatorData.summary,
    formula: calculatorData.formula,
  });
};

export default AnswerJson;