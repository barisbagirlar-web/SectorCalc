// Auto-generated from anova-varyans-analizi-hesaplama-schema.json
import * as z from 'zod';

export interface Anova_varyans_analizi_hesaplamaInput {
  grup1: number;
  grup2: number;
  grup1N: number;
  grup2N: number;
  grup1Varyans: number;
  grup2Varyans: number;
  dataConfidence?: number;
}

export const Anova_varyans_analizi_hesaplamaInputSchema = z.object({
  grup1: z.number().min(0).default(100),
  grup2: z.number().min(0).default(110),
  grup1N: z.number().min(2).default(30),
  grup2N: z.number().min(2).default(30),
  grup1Varyans: z.number().min(0).default(225),
  grup2Varyans: z.number().min(0).default(225),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Anova_varyans_analizi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (100*30+110*30)/(30+30); results["grandMean"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grandMean"] = Number.NaN; }
  try { const v = 30*(100-((100*30+110*30)/(30+30)))**2+30*(110-((100*30+110*30)/(30+30)))**2; results["ssBetween"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ssBetween"] = Number.NaN; }
  try { const v = (30-1)*225+(30-1)*225; results["ssWithin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ssWithin"] = Number.NaN; }
  try { const v = (30*(100-((100*30+110*30)/(30+30)))**2+30*(110-((100*30+110*30)/(30+30)))**2)/1; results["msBetween"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["msBetween"] = Number.NaN; }
  try { const v = ((30-1)*225+(30-1)*225)/(30+30-2); results["msWithin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["msWithin"] = Number.NaN; }
  try { const v = ((30*(100-((100*30+110*30)/(30+30)))**2+30*(110-((100*30+110*30)/(30+30)))**2)/1)/(((30-1)*225+(30-1)*225)/(30+30-2)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAnova_varyans_analizi_hesaplama(input: Anova_varyans_analizi_hesaplamaInput): Anova_varyans_analizi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify statistical assumptions before making decisions.","Use larger sample sizes for better accuracy."];
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
    unit: "F-value",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Anova_varyans_analizi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Anova_varyans_analizi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "F-value",
  breakdownKeys: ["sonuc"],
} as const;

