// Auto-generated from hydraulic-sistem-kayip-schema.json
import * as z from 'zod';

export interface Hydraulic_sistem_kayipInput {
  basinc: number;
  pompaDebisi: number;
  kacak: number;
  boruDusum: number;
  vanaKayip: number;
  saat: number;
  verim: number;
  tarif: number;
  dataConfidence?: number;
}

export const Hydraulic_sistem_kayipInputSchema = z.object({
  basinc: z.number().min(0).default(0),
  pompaDebisi: z.number().min(0).default(0),
  kacak: z.number().min(0).default(0),
  boruDusum: z.number().min(0).default(0),
  vanaKayip: z.number().min(0).default(0),
  saat: z.number().min(0).default(0),
  verim: z.number().min(0).default(0),
  tarif: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hydraulic_sistem_kayipInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.basinc * input.pompaDebisi * input.kacak * input.boruDusum; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.basinc * input.pompaDebisi * input.kacak * input.boruDusum * (input.vanaKayip * input.saat * input.verim * input.tarif); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.vanaKayip * input.saat * input.verim * input.tarif; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateHydraulic_sistem_kayip(input: Hydraulic_sistem_kayipInput): Hydraulic_sistem_kayipOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Hydraulic_sistem_kayipOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hydraulic_sistem_kayipOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

