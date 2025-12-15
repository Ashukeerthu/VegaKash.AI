import { describe, it, expect } from 'vitest';
import { computeEmi, buildAmortization, simulatePrepayment, shockRate } from './emiEngine';

describe('EMI Engine', () => {
  describe('computeEmi', () => {
    it('handles 0% interest rate correctly', () => {
      const result = computeEmi(100000, 0, 10);
      const expectedEmi = 100000 / (10 * 12);
      expect(result.emi).toBeCloseTo(expectedEmi, 2);
      expect(result.totalInterest).toBe(0);
    });

    it('calculates standard EMI correctly', () => {
      const result = computeEmi(1000000, 8.5, 20);
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalAmount).toBeCloseTo(result.emi * 20 * 12, 2);
    });

    it('returns zero for invalid inputs', () => {
      const result = computeEmi(0, 8.5, 20);
      expect(result.emi).toBe(0);
      expect(result.totalInterest).toBe(0);
    });
  });

  describe('buildAmortization', () => {
    it('generates correct number of rows for tenure', () => {
      const amort = buildAmortization(2500000, 8.5, 30);
      expect(amort.length).toBeLessThanOrEqual(360);
      expect(amort.length).toBeGreaterThan(0);
    });

    it('balance decreases monotonically', () => {
      const amort = buildAmortization(1000000, 8.5, 10);
      for (let i = 1; i < amort.length; i++) {
        expect(amort[i].balance).toBeLessThanOrEqual(amort[i - 1].balance);
      }
    });

    it('final balance is zero or near-zero', () => {
      const amort = buildAmortization(1000000, 8.5, 10);
      const finalBalance = amort[amort.length - 1].balance;
      expect(finalBalance).toBeCloseTo(0, 0);
    });
  });

  describe('simulatePrepayment', () => {
    it('reduceTenure mode reduces years and saves interest', () => {
      const result = simulatePrepayment(2500000, 8.5, 20, 200000, 1, 'reduceTenure');
      expect(result.interestSaved).toBeGreaterThan(0);
      expect(result.yearsReduced).toBeGreaterThan(0);
    });

    it('reduceEmi mode changes EMI', () => {
      const result = simulatePrepayment(2500000, 8.5, 20, 200000, 1, 'reduceEmi');
      expect(result.emiChanged).toBeGreaterThanOrEqual(0);
      expect(result.interestSaved).toBeGreaterThan(0);
    });

    it('no prepayment yields baseline results', () => {
      const result = simulatePrepayment(1000000, 8.5, 10, 0, 1, 'reduceTenure');
      expect(result.interestSaved).toBeCloseTo(0, 0);
      expect(result.yearsReduced).toBeCloseTo(0, 1);
    });
  });

  describe('shockRate', () => {
    it('positive shock increases interest', () => {
      const result = shockRate(2500000, 8.5, 20, 1);
      expect(result.extraInterest).toBeGreaterThan(0);
      expect(result.shocked.emi).toBeGreaterThan(result.base.emi);
    });

    it('zero shock returns same values', () => {
      const result = shockRate(1000000, 8.5, 10, 0);
      expect(result.extraInterest).toBe(0);
      expect(result.shocked.emi).toBeCloseTo(result.base.emi, 2);
    });

    it('negative shock decreases EMI', () => {
      const result = shockRate(1000000, 8.5, 10, -0.5);
      expect(result.shocked.emi).toBeLessThan(result.base.emi);
    });
  });

  describe('Edge Cases', () => {
    it('handles very long tenure (30 years)', () => {
      const result = computeEmi(5000000, 8.5, 30);
      expect(result.emi).toBeGreaterThan(0);
      const amort = buildAmortization(5000000, 8.5, 30);
      expect(amort.length).toBeLessThanOrEqual(360);
    });

    it('handles large prepayment amounts', () => {
      const result = simulatePrepayment(1000000, 8.5, 10, 500000, 1, 'reduceTenure');
      expect(result.interestSaved).toBeGreaterThan(0);
      expect(result.yearsReduced).toBeGreaterThan(0);
    });

    it('handles very high interest rates', () => {
      const result = computeEmi(1000000, 20, 10);
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThanOrEqual(result.emi * 10 * 12 - 1000000);
    });
  });
});
