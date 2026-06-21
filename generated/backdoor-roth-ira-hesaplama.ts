// Auto-generated from backdoor-roth-ira-hesaplama-schema.json
import * as z from 'zod';

export interface Backdoor_roth_ira_hesaplamaInput {
  gelenekselBakiye: number;
  donusenTutar: number;
  vergiOrani: number;
  dataConfidence?: number;
}

export const Backdoor_roth_ira_hesaplamaInputSchema = z.object({
  gelenekselBakiye: z.number().min(0).default(50000),
  donusenTutar: z.number().min(0).default(50000),
  vergiOrani: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Backdoor_roth_ira_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.donusenTutar * (input.vergiOrani / 100); results["vergi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vergi"] = Number.NaN; }
  try { const v = input.gelenekselBakiye + input.donusenTutar - (input.donusenTutar * (input.vergiOrani / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBackdoor_roth_ira_hesaplama(input: Backdoor_roth_ira_hesaplamaInput): Backdoor_roth_ira_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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


export interface Backdoor_roth_ira_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Backdoor_roth_ira_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

