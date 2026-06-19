// Auto-generated from auto-repair-parts-labor-quote-calculator-schema.json
import * as z from 'zod';

export interface Auto_repair_parts_labor_quote_calculatorInput {
  parts_cost: number;
  labor_hours: number;
  labor_rate: number;
  overhead_percent: number;
  profit_margin: number;
  tax_rate: number;
  discount_percent: number;
  parts_markup: number;
  dataConfidence?: number;
}

export const Auto_repair_parts_labor_quote_calculatorInputSchema = z.object({
  parts_cost: z.number().min(0).max(100000).default(0),
  labor_hours: z.number().min(0.1).max(100).default(1),
  labor_rate: z.number().min(20).max(300).default(85),
  overhead_percent: z.number().min(0).max(100).default(25),
  profit_margin: z.number().min(0).max(100).default(15),
  tax_rate: z.number().min(0).max(20).default(8),
  discount_percent: z.number().min(0).max(100).default(0),
  parts_markup: z.number().min(0).max(200).default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Auto_repair_parts_labor_quote_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parts_cost * input.labor_hours * (input.labor_rate / 100) * (input.overhead_percent / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.parts_cost * input.labor_hours * (input.labor_rate / 100) * (input.overhead_percent / 100) * ((input.profit_margin / 100) * (input.tax_rate / 100) * (input.discount_percent / 100) * (input.parts_markup / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.profit_margin / 100) * (input.tax_rate / 100) * (input.discount_percent / 100) * (input.parts_markup / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAuto_repair_parts_labor_quote_calculator(input: Auto_repair_parts_labor_quote_calculatorInput): Auto_repair_parts_labor_quote_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency support","Custom markup profiles","API integration"],
  };
}


export interface Auto_repair_parts_labor_quote_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
