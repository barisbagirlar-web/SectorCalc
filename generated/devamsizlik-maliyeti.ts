// Auto-generated from devamsizlik-maliyeti-schema.json
import * as z from 'zod';

export interface Devamsizlik_maliyetiInput {
  kayipSaat: number;
  Ucret: number;
  yanHak: number;
  olaySayisiS: number;
  fazlaMesai: number;
  gecici_Isci: number;
  verimDusus: number;
  dataConfidence?: number;
}

export const Devamsizlik_maliyetiInputSchema = z.object({
  kayipSaat: z.number().min(0).default(0),
  Ucret: z.number().min(0).default(0),
  yanHak: z.number().min(0).default(0),
  olaySayisiS: z.number().min(0).default(0),
  fazlaMesai: z.number().min(0).default(0),
  gecici_Isci: z.number().min(0).default(0),
  verimDusus: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Devamsizlik_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kayipSaat * input.Ucret * input.yanHak * input.olaySayisiS; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.kayipSaat * input.Ucret * input.yanHak * input.olaySayisiS * (input.fazlaMesai * input.gecici_Isci * input.verimDusus); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.fazlaMesai * input.gecici_Isci * input.verimDusus; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDevamsizlik_maliyeti(input: Devamsizlik_maliyetiInput): Devamsizlik_maliyetiOutput {
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


export interface Devamsizlik_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Devamsizlik_maliyetiOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

