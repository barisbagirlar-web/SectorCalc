// Auto-generated from vat-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface VatCalculatorInput {
  netAmount: number;
  vatRate: 'standard' | 'reduced' | 'zero' | 'exempt';
  vatPercentage: number;
  isReverseCharge: boolean;
  currency: 'USD' | 'EUR' | 'GBP' | 'TRY' | 'other';
}

export const VatCalculatorInputSchema = z.object({
  netAmount: z.number().min(0).default(0),
  vatRate: z.enum(['standard', 'reduced', 'zero', 'exempt']).default('standard'),
  vatPercentage: z.number().min(0).max(100).default(20),
  isReverseCharge: z.boolean().default(false),
  currency: z.enum(['USD', 'EUR', 'GBP', 'TRY', 'other']).default('USD'),
});

export interface VatCalculatorOutput {
  grossAmount: number;
  breakdown: {
    netAmount: number;
    vatAmount: number;
    reverseChargeVat: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: VatCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.vatAmount = ((): number => { try { const __v = input.netAmount * (input.vatRate == 'standard' ? input.vatPercentage : (input.vatRate == 'reduced' ? input.vatPercentage * 0.5 : 0)) / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossAmount = ((): number => { try { const __v = input.netAmount + results.vatAmount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reverseChargeVat = ((): number => { try { const __v = input.isReverseCharge ? results.vatAmount : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateVatCalculator(input: VatCalculatorInput): VatCalculatorOutput {
  const results = evaluateFormulas(input);
  const grossAmount = results.grossAmount ?? 0;
  const breakdown = {
    netAmount: results.netAmount,
    vatAmount: results.vatAmount,
    reverseChargeVat: results.reverseChargeVat,
  };

  // rule: netAmount >= 0
  // rule: vatPercentage >= 0 and vatPercentage <= 100
  // rule: if isReverseCharge == true then vatRate == 'standard' or vatRate == 'reduced'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if netAmount > 1000000 then 'High value transaction'
  // threshold skipped (non-JS): if vatPercentage > 25 then 'Unusually high VAT rate'

  const dataConfidenceAdjusted = (() => { try { return results.grossAmount * (1 - 0.05); } catch { return grossAmount; } })();

  return {
    grossAmount,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency comparison","Detailed tax report"],
  };
}
