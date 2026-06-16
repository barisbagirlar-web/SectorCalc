// Auto-generated from wilcoxon-signed-rank-schema.json
import * as z from 'zod';

export interface Wilcoxon_signed_rankInput {
  before: number;
  after: number;
  alpha: number;
  hypothesis: number;
}

export const Wilcoxon_signed_rankInputSchema = z.object({
  before: z.number().default(0),
  after: z.number().default(0),
  alpha: z.number().default(0.05),
  hypothesis: z.number().default(0),
});

function evaluateAllFormulas(input: Wilcoxon_signed_rankInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.after - input.before; results["differences"] = Number.isFinite(v) ? v : 0; } catch { results["differences"] = 0; }
  try { const v = Math.abs((results["differences"] ?? 0)); results["absDifferences"] = Number.isFinite(v) ? v : 0; } catch { results["absDifferences"] = 0; }
  try { const v = rank((results["absDifferences"] ?? 0), nonZeroMask); results["ranks"] = Number.isFinite(v) ? v : 0; } catch { results["ranks"] = 0; }
  try { const v = (results["ranks"] ?? 0) * Math.sign((results["differences"] ?? 0)); results["signedRanks"] = Number.isFinite(v) ? v : 0; } catch { results["signedRanks"] = 0; }
  try { const v = sum((results["signedRanks"] ?? 0) > 0); results["Wplus"] = Number.isFinite(v) ? v : 0; } catch { results["Wplus"] = 0; }
  try { const v = sum((results["signedRanks"] ?? 0) < 0); results["Wminus"] = Number.isFinite(v) ? v : 0; } catch { results["Wminus"] = 0; }
  try { const v = Math.min((results["Wplus"] ?? 0), (results["Wminus"] ?? 0)); results["W"] = Number.isFinite(v) ? v : 0; } catch { results["W"] = 0; }
  try { const v = count(nonZeroMask); results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = (results["n"] ?? 0) * ((results["n"] ?? 0) + 1) / 4; results["expectedW"] = Number.isFinite(v) ? v : 0; } catch { results["expectedW"] = 0; }
  try { const v = Math.sqrt((results["n"] ?? 0) * ((results["n"] ?? 0) + 1) * (2 * (results["n"] ?? 0) + 1) / 24); results["stdW"] = Number.isFinite(v) ? v : 0; } catch { results["stdW"] = 0; }
  try { const v = ((results["W"] ?? 0) - (results["expectedW"] ?? 0)) / (results["stdW"] ?? 0); results["z"] = Number.isFinite(v) ? v : 0; } catch { results["z"] = 0; }
  try { const v = 2 * (1 - normalCDF(Math.abs((results["z"] ?? 0)))); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  try { const v = (results["pValue"] ?? 0) < input.alpha; results["rejectNull"] = Number.isFinite(v) ? v : 0; } catch { results["rejectNull"] = 0; }
  return results;
}


export function calculateWilcoxon_signed_rank(input: Wilcoxon_signed_rankInput): Wilcoxon_signed_rankOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["W"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Wilcoxon_signed_rankOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
