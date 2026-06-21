// Auto-generated from spc-signal-delay-maliyet-schema.json
import * as z from 'zod';

export interface Spc_signal_delay_maliyetInput {
  alphaBetaRiskleri: number;
  OrneklemeAraligiSaat: number;
  UretimHiziAdetsaat: number;
  hataOraniOOC: number;
  hataBasinaMaliyet: number;
  arastirma_Isciligi: number;
  dataConfidence?: number;
}

export const Spc_signal_delay_maliyetInputSchema = z.object({
  alphaBetaRiskleri: z.number().min(0).default(0),
  OrneklemeAraligiSaat: z.number().min(0).default(0),
  UretimHiziAdetsaat: z.number().min(0).default(0),
  hataOraniOOC: z.number().min(0).default(0),
  hataBasinaMaliyet: z.number().min(0).default(0),
  arastirma_Isciligi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spc_signal_delay_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alphaBetaRiskleri * input.OrneklemeAraligiSaat * input.UretimHiziAdetsaat * (input.hataOraniOOC / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.alphaBetaRiskleri * input.OrneklemeAraligiSaat * input.UretimHiziAdetsaat * (input.hataOraniOOC / 100) * (input.hataBasinaMaliyet * input.arastirma_Isciligi); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.hataBasinaMaliyet * input.arastirma_Isciligi; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateSpc_signal_delay_maliyet(input: Spc_signal_delay_maliyetInput): Spc_signal_delay_maliyetOutput {
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Spc_signal_delay_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Spc_signal_delay_maliyetOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

