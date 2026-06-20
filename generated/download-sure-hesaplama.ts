// Auto-generated from download-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Download_sure_hesaplamaInput {
  dataSize: number;
  connectionSpeed: number;
  dataConfidence?: number;
}

export const Download_sure_hesaplamaInputSchema = z.object({
  dataSize: z.number().min(0).default(100),
  connectionSpeed: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Download_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dataSize * input.connectionSpeed + Math.floor(input.dataSize / input.connectionSpeed) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.dataSize * input.connectionSpeed + Math.floor(input.dataSize / input.connectionSpeed) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateDownload_sure_hesaplama(input: Download_sure_hesaplamaInput): Download_sure_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "MB",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Download_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Download_sure_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "MB",
  breakdownKeys: ["result"],
} as const;

