// Auto-generated from rent-vs-buy-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RentVsBuyCalculatorInput {
  homePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  loanTermYears: number;
  propertyTaxRate: number;
  homeInsuranceRate: number;
  maintenanceRate: number;
  hoaFeesMonthly: number;
  closingCostsPercent: number;
  rentMonthly: number;
  rentersInsuranceMonthly: number;
  securityDeposit: number;
  appreciationRate: number;
  inflationRate: number;
  investmentReturnRate: number;
  timeHorizonYears: number;
  marginalTaxRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RentVsBuyCalculatorInputSchema = z.object({
  homePrice: z.number().min(50000).max(10000000).default(300000),
  downPaymentPercent: z.number().min(0).max(100).default(20),
  mortgageRate: z.number().min(0).max(20).default(6.5),
  loanTermYears: z.number().min(5).max(40).default(30),
  propertyTaxRate: z.number().min(0).max(5).default(1.2),
  homeInsuranceRate: z.number().min(0).max(3).default(0.5),
  maintenanceRate: z.number().min(0).max(5).default(1),
  hoaFeesMonthly: z.number().min(0).max(2000).default(0),
  closingCostsPercent: z.number().min(0).max(10).default(3),
  rentMonthly: z.number().min(0).max(50000).default(2000),
  rentersInsuranceMonthly: z.number().min(0).max(200).default(20),
  securityDeposit: z.number().min(0).max(50000).default(2000),
  appreciationRate: z.number().min(-5).max(20).default(3),
  inflationRate: z.number().min(0).max(20).default(2.5),
  investmentReturnRate: z.number().min(0).max(20).default(7),
  timeHorizonYears: z.number().min(1).max(50).default(10),
  marginalTaxRate: z.number().min(0).max(50).default(24),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RentVsBuyCalculatorOutput {
  netBenefitOfBuying: number;
  breakdown: {
    totalBuyCost: number;
    totalRentCost: number;
    monthlyBuyCost: number;
    monthlyRentCost: number;
    equityAfterSale: number;
    breakEvenYears: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RentVsBuyCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.downPayment = ((): number => { try { const __v = input.homePrice * (input.downPaymentPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.loanAmount = ((): number => { try { const __v = input.homePrice - results.downPayment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyMortgagePayment = ((): number => { try { const __v = results.loanAmount * (input.mortgageRate / 12 / 100) * Math.Math.pow(1 + input.mortgageRate / 12 / 100, input.loanTermYears * 12) / (Math.Math.pow(1 + input.mortgageRate / 12 / 100, input.loanTermYears * 12) - 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyPropertyTax = ((): number => { try { const __v = input.homePrice * (input.propertyTaxRate / 100) / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyHomeInsurance = ((): number => { try { const __v = input.homePrice * (input.homeInsuranceRate / 100) / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyMaintenance = ((): number => { try { const __v = input.homePrice * (input.maintenanceRate / 100) / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyHOAFees = ((): number => { try { const __v = input.hoaFeesMonthly; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMonthlyBuyCost = ((): number => { try { const __v = results.monthlyMortgagePayment + results.monthlyPropertyTax + results.monthlyHomeInsurance + results.monthlyMaintenance + results.monthlyHOAFees; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyRentCost = ((): number => { try { const __v = input.rentMonthly + input.rentersInsuranceMonthly; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.closingCosts = ((): number => { try { const __v = input.homePrice * (input.closingCostsPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalBuyUpfront = ((): number => { try { const __v = results.downPayment + results.closingCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalRentUpfront = ((): number => { try { const __v = input.securityDeposit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.futureHomeValue = ((): number => { try { const __v = input.homePrice * Math.Math.pow(1 + input.appreciationRate / 100, input.timeHorizonYears); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.remainingMortgageBalance = ((): number => { try { const __v = results.loanAmount * Math.Math.pow(1 + input.mortgageRate / 12 / 100, input.timeHorizonYears * 12) - results.monthlyMortgagePayment * (Math.Math.pow(1 + input.mortgageRate / 12 / 100, input.timeHorizonYears * 12) - 1) / (input.mortgageRate / 12 / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.equityAfterSale = ((): number => { try { const __v = results.futureHomeValue - results.remainingMortgageBalance - (results.futureHomeValue - input.homePrice) * 0.06; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalBuyCost = ((): number => { try { const __v = results.totalBuyUpfront + results.totalMonthlyBuyCost * 12 * input.timeHorizonYears - results.equityAfterSale; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalRentCost = ((): number => { try { const __v = results.totalRentUpfront + results.monthlyRentCost * 12 * input.timeHorizonYears - input.securityDeposit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netBenefitOfBuying = ((): number => { try { const __v = results.totalRentCost - results.totalBuyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.breakEvenYears = ((): number => { try { const __v = log((results.totalBuyUpfront - results.totalRentUpfront) / (results.monthlyRentCost - results.totalMonthlyBuyCost) + 1) / log(1 + (input.investmentReturnRate / 100 / 12)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.netBenefitOfBuying * (input.dataConfidence === 'high' ? 1 : input.dataConfidence === 'medium' ? 0.9 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRentVsBuyCalculator(input: RentVsBuyCalculatorInput): RentVsBuyCalculatorOutput {
  const results = evaluateFormulas(input);
  const netBenefitOfBuying = results.netBenefitOfBuying ?? 0;
  const breakdown = {
    totalBuyCost: results.totalBuyCost,
    totalRentCost: results.totalRentCost,
    monthlyBuyCost: results.totalMonthlyBuyCost,
    monthlyRentCost: results.monthlyRentCost,
    equityAfterSale: results.equityAfterSale,
    breakEvenYears: results.breakEvenYears,
  };

  // rule: downPaymentPercent >= 0 && downPaymentPercent <= 100
  // rule: mortgageRate >= 0 && mortgageRate <= 20
  // rule: loanTermYears >= 5 && loanTermYears <= 40
  // rule: timeHorizonYears >= 1 && timeHorizonYears <= 50
  // rule: homePrice > 0
  // rule: rentMonthly > 0
  // rule: if downPaymentPercent < 20 then mortgageRate must include PMI (not modeled separately)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low down payment may require PMI, increasing monthly cost.
  // threshold skipped (non-JS): High mortgage rate significantly increases cost.
  // threshold skipped (non-JS): Short time horizon may favor renting due to transaction costs.
  // threshold skipped (non-JS): Negative appreciation could lead to loss.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return netBenefitOfBuying; } })();

  return {
    netBenefitOfBuying,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Market Averages","Detailed Amortization Schedule"],
  };
}
