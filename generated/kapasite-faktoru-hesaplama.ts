// Auto-generated from kapasite-faktoru-hesaplama-schema.json
import * as z from 'zod';

export interface Kapasite_faktoru_hesaplamaInput {
  textInput: number;
  dataConfidence?: number;
}

export const Kapasite_faktoru_hesaplamaInputSchema = z.object({
  textInput: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kapasite_faktoru_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.textInput * (1 + input.textInput/500) + Math.sqrt(input.textInput) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.textInput * (1 + input.textInput/500) + Math.sqrt(input.textInput) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateKapasite_faktoru_hesaplama(input: Kapasite_faktoru_hesaplamaInput): Kapasite_faktoru_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "text",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Kapasite_faktoru_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kapasite_faktoru_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "text",
  breakdownKeys: ["result"],
} as const;

