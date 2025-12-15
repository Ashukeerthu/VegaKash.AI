export type AmortizationRow = {
  period: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

export function computeEmi(principal: number, annualRatePct: number, tenureYears: number): { emi: number; totalInterest: number; totalAmount: number } {
  const P = principal;
  const r = annualRatePct / 12 / 100;
  const n = Math.round(tenureYears * 12);
  if (!(P > 0) || !(n > 0) || r < 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - P;
  return { emi, totalInterest, totalAmount };
}

export function buildAmortization(principal: number, annualRatePct: number, tenureYears: number): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  const r = annualRatePct / 12 / 100;
  const n = Math.round(tenureYears * 12);
  const { emi } = computeEmi(principal, annualRatePct, tenureYears);
  let balance = principal;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    const principalPay = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principalPay);
    rows.push({ period: m, emi, principal: principalPay, interest, balance });
    if (balance <= 0) break;
  }
  return rows;
}

export type PrepaymentMode = 'reduceEmi' | 'reduceTenure';

export function simulatePrepayment(
  principal: number,
  annualRatePct: number,
  tenureYears: number,
  yearlyPrepay: number,
  startYear: number,
  mode: PrepaymentMode
): {
  rows: AmortizationRow[];
  interestSaved: number;
  yearsReduced: number;
  emiChanged: number;
} {
  const r = annualRatePct / 12 / 100;
  const months = Math.round(tenureYears * 12);
  let balance = principal;
  let currentEmi = computeEmi(balance, annualRatePct, tenureYears).emi;
  const baseline = buildAmortization(principal, annualRatePct, tenureYears);
  const baselineInterest = baseline.reduce((s, row) => s + row.interest, 0);

  const rows: AmortizationRow[] = [];
  let m = 0;
  while (m < months && balance > 0) {
    m += 1;
    const interest = balance * r;
    const principalPay = Math.min(currentEmi - interest, balance);
    balance = Math.max(0, balance - principalPay);

    // apply yearly prepayment at end of each year starting from startYear
    if (m % 12 === 0 && m / 12 >= startYear && yearlyPrepay > 0 && balance > 0) {
      balance = Math.max(0, balance - yearlyPrepay);
      if (mode === 'reduceEmi' && balance > 0) {
        const remainingYears = Math.max(0.0834, (months - m) / 12);
        currentEmi = computeEmi(balance, annualRatePct, remainingYears).emi;
      }
      // reduceTenure keeps EMI same, shortens schedule naturally
    }

    rows.push({ period: m, emi: currentEmi, principal: principalPay, interest, balance });
  }

  const totalInterest = rows.reduce((s, row) => s + row.interest, 0);
  const interestSaved = Math.max(0, baselineInterest - totalInterest);
  const yearsReduced = Math.max(0, baseline.length / 12 - rows.length / 12);
  const emiChanged = Math.abs(currentEmi - computeEmi(principal, annualRatePct, tenureYears).emi);

  return { rows, interestSaved, yearsReduced, emiChanged };
}

export function shockRate(
  principal: number,
  annualRatePct: number,
  tenureYears: number,
  shockDeltaPct: number
) {
  const base = computeEmi(principal, annualRatePct, tenureYears);
  const shocked = computeEmi(principal, annualRatePct + shockDeltaPct, tenureYears);
  const extraInterest = Math.max(0, shocked.totalInterest - base.totalInterest);
  return { base, shocked, extraInterest };
}
