// Auto-generated from varlik-dagilimi-portfoy-hesaplama-schema.json
import * as z from 'zod';

export interface Varlik_dagilimi_portfoy_hesaplamaInput {
  portfoy: number;
  hisse: number;
  tahvil: number;
  nakit: number;
  dataConfidence?: number;
}

export const Varlik_dagilimi_portfoy_hesaplamaInputSchema = z.object({
  portfoy: z.number().min(0).default(500000),
  hisse: z.number().min(0).max(100).default(60),
  tahvil: z.number().min(0).max(100).default(30),
  nakit: z.number().min(0).max(100).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Varlik_dagilimi_portfoy_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.portfoy * (input.hisse / 100); results["hisseTutar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hisseTutar"] = Number.NaN; }
  try { const v = input.portfoy * (input.tahvil / 100); results["tahvilTutar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tahvilTutar"] = Number.NaN; }
  try { const v = input.portfoy * (input.nakit / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateVarlik_dagilimi_portfoy_hesaplama(input: Varlik_dagilimi_portfoy_hesaplamaInput): Varlik_dagilimi_portfoy_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    hisseTutar: toNumericFormulaValue(values["hisseTutar"]),
    tahvilTutar: toNumericFormulaValue(values["tahvilTutar"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Varlik_dagilimi_portfoy_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { hisseTutar: number; tahvilTutar: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Varlik_dagilimi_portfoy_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["hisseTutar","tahvilTutar","sonuc"],
} as const;

