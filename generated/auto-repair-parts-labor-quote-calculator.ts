// Auto-generated from auto-repair-parts-labor-quote-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AutoRepairPartsLaborQuoteCalculatorInput {
  partsCost: number;
  laborHours: number;
  laborRate: number;
  shopSuppliesFee: number;
  hazardousWasteFee: number;
  subletCost: number;
  taxRate: number;
  desiredProfitMargin: number;
  discountPercentage: number;
  includeLaborInTax: boolean;
}

export const AutoRepairPartsLaborQuoteCalculatorInputSchema = z.object({
  partsCost: z.number().min(0).default(0),
  laborHours: z.number().min(0).default(1),
  laborRate: z.number().min(0).default(100),
  shopSuppliesFee: z.number().min(0).default(10),
  hazardousWasteFee: z.number().min(0).default(5),
  subletCost: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100).default(8),
  desiredProfitMargin: z.number().min(0).max(100).default(30),
  discountPercentage: z.number().min(0).max(100).default(0),
  includeLaborInTax: z.boolean().default(false),
});

export interface AutoRepairPartsLaborQuoteCalculatorOutput {
  finalQuotePrice: number;
  breakdown: {
    totalPartsCost: number;
    totalLaborCost: number;
    totalSuppliesAndFees: number;
    totalSublet: number;
    taxAmount: number;
    discountAmount: number;
    profitAmount: number;
    actualProfitMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AutoRepairPartsLaborQuoteCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalPartsCost = input.partsCost;
  results.totalLaborCost = input.laborHours * input.laborRate;
  results.totalSuppliesAndFees = input.shopSuppliesFee + input.hazardousWasteFee;
  results.totalSublet = input.subletCost;
  results.totalCostBeforeTax = results.totalPartsCost + results.totalLaborCost + results.totalSuppliesAndFees + results.totalSublet;
  results.taxableAmount = input.includeLaborInTax ? results.totalCostBeforeTax : results.totalPartsCost + results.totalSuppliesAndFees + results.totalSublet;
  results.taxAmount = results.taxableAmount * (input.taxRate / 100);
  results.totalCostWithTax = results.totalCostBeforeTax + results.taxAmount;
  results.priceBeforeDiscount = results.totalCostWithTax / (1 - input.desiredProfitMargin / 100);
  results.discountAmount = results.priceBeforeDiscount * (input.discountPercentage / 100);
  results.finalQuotePrice = results.priceBeforeDiscount - results.discountAmount;
  results.profitAmount = results.finalQuotePrice - results.totalCostWithTax;
  results.actualProfitMargin = (results.profitAmount / results.finalQuotePrice) * 100;
  return results;
}

export function calculateAutoRepairPartsLaborQuoteCalculator(input: AutoRepairPartsLaborQuoteCalculatorInput): AutoRepairPartsLaborQuoteCalculatorOutput {
  const results = evaluateFormulas(input);
  const finalQuotePrice = results.finalQuotePrice;
  const breakdown = {
    totalPartsCost: results.totalPartsCost,
    totalLaborCost: results.totalLaborCost,
    totalSuppliesAndFees: results.totalSuppliesAndFees,
    totalSublet: results.totalSublet,
    taxAmount: results.taxAmount,
    discountAmount: results.discountAmount,
    profitAmount: results.profitAmount,
    actualProfitMargin: results.actualProfitMargin,
  };

  // rule: partsCost must be >= 0
  // rule: laborHours must be >= 0
  // rule: laborRate must be > 0
  // rule: shopSuppliesFee must be >= 0
  // rule: hazardousWasteFee must be >= 0
  // rule: subletCost must be >= 0
  // rule: taxRate must be between 0 and 100
  // rule: desiredProfitMargin must be between 0 and 100
  // rule: discountPercentage must be between 0 and 100
  // threshold desiredProfitMargin > 50: Profit margin above 50% may be unrealistic for competitive market.
  // threshold laborHours > 10: High labor hours; consider breaking down into sub-operations.
  // threshold partsCost > 5000: High parts cost; verify with supplier quote.
  const hiddenLossDrivers: string[] = ["If shopSuppliesFee is too low, actual consumable cost may erode margin.","If laborHours underestimate, overtime or rework reduces profit."];
  const suggestedActions: string[] = ["Verify parts cost with current supplier pricing.","Check labor hours against standard repair times (e.g., Mitchell).","Review shop supplies fee to cover actual usage.","Ensure hazardous waste fee complies with local regulations."];
  const dataConfidenceAdjusted = results.finalQuotePrice;

  return {
    finalQuotePrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF/CSV export of quote","Trend analysis of parts and labor costs over time","Comparison with industry average pricing","Detailed profit margin breakdown by job type","Integration with inventory management"],
  };
}
