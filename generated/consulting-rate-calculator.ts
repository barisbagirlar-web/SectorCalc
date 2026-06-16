// Auto-generated from consulting-rate-calculator-schema.json
import * as z from 'zod';

export interface Consulting_rate_calculatorInput {
  consultantDailyRate: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
  daysWorked: number;
  additionalExpenses: number;
  taxRate: number;
}

export const Consulting_rate_calculatorInputSchema = z.object({
  consultantDailyRate: z.number().default(800),
  overheadPercentage: z.number().default(20),
  profitMarginPercentage: z.number().default(15),
  daysWorked: z.number().default(5),
  additionalExpenses: z.number().default(0),
  taxRate: z.number().default(19),
});

function evaluateAllFormulas(input: Consulting_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consultantDailyRate * input.daysWorked + input.additionalExpenses; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) * (input.overheadPercentage / 100); results["overheadAmount"] = Number.isFinite(v) ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (results["totalCost"] ?? 0) + (results["overheadAmount"] ?? 0); results["costIncludingOverhead"] = Number.isFinite(v) ? v : 0; } catch { results["costIncludingOverhead"] = 0; }
  try { const v = (results["costIncludingOverhead"] ?? 0) * (input.profitMarginPercentage / 100); results["profitAmount"] = Number.isFinite(v) ? v : 0; } catch { results["profitAmount"] = 0; }
  try { const v = (results["costIncludingOverhead"] ?? 0) + (results["profitAmount"] ?? 0); results["netInvoiceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["netInvoiceAmount"] = 0; }
  try { const v = (results["netInvoiceAmount"] ?? 0) * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["netInvoiceAmount"] ?? 0) + (results["taxAmount"] ?? 0); results["grossInvoiceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["grossInvoiceAmount"] = 0; }
  return results;
}


export function calculateConsulting_rate_calculator(input: Consulting_rate_calculatorInput): Consulting_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossInvoiceAmount"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Consulting_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
