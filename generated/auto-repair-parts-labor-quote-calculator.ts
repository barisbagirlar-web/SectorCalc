// Auto-generated from auto-repair-parts-labor-quote-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AutoRepairPartsLaborQuoteCalculatorInput {
  partsCost: number;
  laborHours: number;
  laborRate: number;
  shopSuppliesFee: number;
  hazardousWasteFee: number;
  taxRate: number;
  discountPercent: number;
  customerType: 'retail' | 'wholesale' | 'insurance';
}

export const AutoRepairPartsLaborQuoteCalculatorInputSchema = z.object({
  partsCost: z.number().min(0).default(0),
  laborHours: z.number().min(0.1).max(100).default(1),
  laborRate: z.number().min(0).max(500).default(100),
  shopSuppliesFee: z.number().min(0).max(100).default(10),
  hazardousWasteFee: z.number().min(0).max(50).default(5),
  taxRate: z.number().min(0).max(20).default(8),
  discountPercent: z.number().min(0).max(100).default(0),
  customerType: z.enum(['retail', 'wholesale', 'insurance']).default('retail'),
});

export interface AutoRepairPartsLaborQuoteCalculatorOutput {
  totalQuote: number;
  breakdown: {
    partsTotal: number;
    laborTotal: number;
    shopSuppliesFee: number;
    hazardousWasteFee: number;
    subtotal: number;
    taxAmount: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AutoRepairPartsLaborQuoteCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.partsTotal = (() => { try { return input.partsCost * (1 - input.discountPercent/100); } catch { return 0; } })();
  results.laborTotal = (() => { try { return input.laborHours * input.laborRate; } catch { return 0; } })();
  results.subtotal = (() => { try { return results.partsTotal + results.laborTotal + input.shopSuppliesFee + input.hazardousWasteFee; } catch { return 0; } })();
  results.taxAmount = (() => { try { return results.subtotal * (input.taxRate/100); } catch { return 0; } })();
  results.totalQuote = (() => { try { return results.subtotal + results.taxAmount; } catch { return 0; } })();
  return results;
}

export function calculateAutoRepairPartsLaborQuoteCalculator(input: AutoRepairPartsLaborQuoteCalculatorInput): AutoRepairPartsLaborQuoteCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalQuote = results.totalQuote ?? 0;
  const breakdown = {
    partsTotal: results.partsTotal,
    laborTotal: results.laborTotal,
    shopSuppliesFee: results.shopSuppliesFee,
    hazardousWasteFee: results.hazardousWasteFee,
    subtotal: results.subtotal,
    taxAmount: results.taxAmount,
  };

  // rule: partsCost >= 0
  // rule: laborHours >= 0.1
  // rule: laborRate >= 0
  // rule: shopSuppliesFee >= 0
  // rule: hazardousWasteFee >= 0
  // rule: taxRate >= 0 && taxRate <= 20
  // rule: discountPercent >= 0 && discountPercent <= 100
  // rule: if customerType == 'wholesale' then discountPercent >= 10 else discountPercent >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Long job; consider break into multiple days
  // threshold skipped (non-JS): High parts cost; verify with customer
  // threshold skipped (non-JS): Premium labor rate; ensure justification

  const dataConfidenceAdjusted = (() => { try { return results.totalQuote * (1 - 0.05); } catch { return totalQuote; } })();

  return {
    totalQuote,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Quote Comparison","Detailed Report with Labor Time Breakdown"],
  };
}
