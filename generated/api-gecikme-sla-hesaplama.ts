// Auto-generated from api-gecikme-sla-hesaplama-schema.json
import * as z from 'zod';

export interface Api_gecikme_sla_hesaplamaInput {
  toplamIstek: number;
  hataliIstek: number;
  toplamGecikme: number;
  dataConfidence?: number;
}

export const Api_gecikme_sla_hesaplamaInputSchema = z.object({
  toplamIstek: z.number().min(0).default(10000),
  hataliIstek: z.number().min(0).default(50),
  toplamGecikme: z.number().min(0).default(250000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Api_gecikme_sla_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.toplamGecikme / Math.max(1, input.toplamIstek); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  try { const v = ((input.toplamIstek - input.hataliIstek) / Math.max(1, input.toplamIstek)) * 100; results["sla"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sla"] = Number.NaN; }
  return results;
}


export function calculateApi_gecikme_sla_hesaplama(input: Api_gecikme_sla_hesaplamaInput): Api_gecikme_sla_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"]),
    sla: toNumericFormulaValue(values["sla"])
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
    unit: "ms",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Api_gecikme_sla_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number; sla: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Api_gecikme_sla_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ms",
  breakdownKeys: ["sonuc","sla"],
} as const;

