// Auto-generated from network-hesaplama-schema.json
import * as z from 'zod';

export interface Network_hesaplamaInput {
  dataSize: number;
  connectionSpeed: number;
  dataConfidence?: number;
}

export const Network_hesaplamaInputSchema = z.object({
  dataSize: z.number().min(0).default(100),
  connectionSpeed: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Network_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.dataSize * input.connectionSpeed * input.connectionSpeed / 1000 + input.dataSize * input.connectionSpeed / 100; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = 0.5 * input.dataSize * input.connectionSpeed * input.connectionSpeed / 1000 + input.dataSize * input.connectionSpeed / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateNetwork_hesaplama(input: Network_hesaplamaInput): Network_hesaplamaOutput {
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


export interface Network_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Network_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "MB",
  breakdownKeys: ["result"],
} as const;

