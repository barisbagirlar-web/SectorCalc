// Auto-generated from smith-diyagrami-vswr-hesaplama-schema.json
import * as z from 'zod';

export interface Smith_diyagrami_vswr_hesaplamaInput {
  yukEmpedans: number;
  hatEmpedans: number;
  dataConfidence?: number;
}

export const Smith_diyagrami_vswr_hesaplamaInputSchema = z.object({
  yukEmpedans: z.number().min(0).default(100),
  hatEmpedans: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Smith_diyagrami_vswr_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.yukEmpedans - input.hatEmpedans) / Math.max(0.0001, (input.yukEmpedans + input.hatEmpedans)); results["yansima"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yansima"] = Number.NaN; }
  try { const v = (1 + Math.abs((input.yukEmpedans - input.hatEmpedans) / Math.max(0.0001, (input.yukEmpedans + input.hatEmpedans)))) / Math.max(0.0001, (1 - Math.abs((input.yukEmpedans - input.hatEmpedans) / Math.max(0.0001, (input.yukEmpedans + input.hatEmpedans))))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSmith_diyagrami_vswr_hesaplama(input: Smith_diyagrami_vswr_hesaplamaInput): Smith_diyagrami_vswr_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "VSWR",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Smith_diyagrami_vswr_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Smith_diyagrami_vswr_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "VSWR",
  breakdownKeys: ["sonuc"],
} as const;

