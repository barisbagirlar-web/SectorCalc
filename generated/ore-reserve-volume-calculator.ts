// Auto-generated from ore-reserve-volume-calculator-schema.json
import * as z from 'zod';

export interface Ore_reserve_volume_calculatorInput {
  blokHacim: number;
  cevherYogunlugu: number;
  tenor: number;
  dataConfidence?: number;
}

export const Ore_reserve_volume_calculatorInputSchema = z.object({
  blokHacim: z.number().min(0).default(50000),
  cevherYogunlugu: z.number().min(0).default(2.7),
  tenor: z.number().min(0).default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ore_reserve_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.blokHacim * input.cevherYogunlugu; results["tonaj"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tonaj"] = Number.NaN; }
  try { const v = (input.blokHacim * input.cevherYogunlugu) * (input.tenor / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOre_reserve_volume_calculator(input: Ore_reserve_volume_calculatorInput): Ore_reserve_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    tonaj: toNumericFormulaValue(values["tonaj"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
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
    unit: "tons",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ore_reserve_volume_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { tonaj: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ore_reserve_volume_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "tons",
  breakdownKeys: ["tonaj","sonuc"],
} as const;

