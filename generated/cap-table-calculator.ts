// Auto-generated from cap-table-calculator-schema.json
import * as z from 'zod';

export interface Cap_table_calculatorInput {
  kurucu: number;
  yatirimci: number;
  opsiyon: number;
  dataConfidence?: number;
}

export const Cap_table_calculatorInputSchema = z.object({
  kurucu: z.number().min(0).default(600000),
  yatirimci: z.number().min(0).default(300000),
  opsiyon: z.number().min(0).default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cap_table_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kurucu + input.yatirimci + input.opsiyon; results["toplam"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplam"] = Number.NaN; }
  try { const v = (input.kurucu / Math.max(1, (input.kurucu + input.yatirimci + input.opsiyon))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCap_table_calculator(input: Cap_table_calculatorInput): Cap_table_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cap_table_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cap_table_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

