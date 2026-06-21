// Auto-generated premium calculator: kur-riski
import * as z from 'zod';

export interface KurRiskiInput {
  dovizGelirGider: number;
  vadeler: number;
  doviz Cifti: string;
  volatilite: number;
  zamanUfku: number;
  zSkoru: number;
  hedgeOranı: number;
  forwardPuanı: number;
  spotForwardKur: number;
}

export const KurRiskiInputSchema = z.object({
  dovizGelirGider: z.number().min(0).default(0),
  vadeler: z.number().min(0).default(0),
  doviz Cifti: z.number().min(0).default(0),
  volatilite: z.number().min(0).default(0),
  zamanUfku: z.number().min(0).default(0),
  zSkoru: z.number().min(0).default(0),
  hedgeOranı: z.number().min(0).default(0),
  forwardPuanı: z.number().min(0).default(0),
  spotForwardKur: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalRevenueFC * input.totalCostFC; results["exposureFC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exposureFC"] = Number.NaN; }
  try { const v = input.exposureFC * input.stdDevExchangeRate * input.zScore; results["vaRHistorical"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vaRHistorical"] = Number.NaN; }
  try { const v = input.exposureFC * input.volatility * input.timeHorizon; results["vaRParametric"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vaRParametric"] = Number.NaN; }
  try { const v = input.exposureFC * input.hedgeRatio; results["hedgedExposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hedgedExposure"] = Number.NaN; }
  try { const v = input.vaRHistorical * input.hedgeRatio; results["unhedgedVaR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unhedgedVaR"] = Number.NaN; }
  try { const v = input.notional * input.forwardPoints; results["costOfHedge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costOfHedge"] = Number.NaN; }
  try { const v = input.spotRate * input.forwardRate * input.hedgedExposure; results["netImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netImpact"] = Number.NaN; }
  return results;
}

export function calculateKurRiski(input) {
  return evaluateAllFormulas(input);
}
