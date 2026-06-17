// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Consulting_rate_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.consultantDailyRate * input.daysWorked + input.additionalExpenses; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) * (input.overheadPercentage / 100); results["overheadAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) + (asFormulaNumber(results["overheadAmount"])); results["costIncludingOverhead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costIncludingOverhead"] = 0; }
  try { const v = (asFormulaNumber(results["costIncludingOverhead"])) * (input.profitMarginPercentage / 100); results["profitAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitAmount"] = 0; }
  try { const v = (asFormulaNumber(results["costIncludingOverhead"])) + (asFormulaNumber(results["profitAmount"])); results["netInvoiceAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netInvoiceAmount"] = 0; }
  try { const v = (asFormulaNumber(results["netInvoiceAmount"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["netInvoiceAmount"])) + (asFormulaNumber(results["taxAmount"])); results["grossInvoiceAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossInvoiceAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConsulting_rate_calculator(input: Consulting_rate_calculatorInput): Consulting_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossInvoiceAmount"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
