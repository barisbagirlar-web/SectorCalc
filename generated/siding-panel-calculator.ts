// Auto-generated from siding-panel-calculator-schema.json
import * as z from 'zod';

export interface Siding_panel_calculatorInput {
  alan: number;
  panelEn: number;
  panelBoy: number;
  fire: number;
  dataConfidence?: number;
}

export const Siding_panel_calculatorInputSchema = z.object({
  alan: z.number().min(0).default(100),
  panelEn: z.number().min(0).default(0.3),
  panelBoy: z.number().min(0).default(3),
  fire: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Siding_panel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input.alan * (1 + input.fire / 100)) / Math.max(0.0001, (input.panelEn * input.panelBoy))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSiding_panel_calculator(input: Siding_panel_calculatorInput): Siding_panel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "panels",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Siding_panel_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Siding_panel_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "panels",
  breakdownKeys: ["sonuc"],
} as const;

