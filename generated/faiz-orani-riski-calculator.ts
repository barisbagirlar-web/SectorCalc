// Auto-generated premium calculator: faiz-orani-riski
import * as z from 'zod';

export interface FaizOraniRiskiInput {
  degiskenSabitBorc: number;
  hedgeOranı: number;
  duration: number;
  bps Sok: number;
  volatilite: number;
  swapSpread: number;
  hedefNIM: number;
}

export const FaizOraniRiskiInputSchema = z.object({
  degiskenSabitBorc: z.number().min(0).default(0),
  hedgeOranı: z.number().min(0).default(0),
  duration: z.number().min(0).default(0),
  bps Sok: z.number().min(0).default(0),
  volatilite: z.number().min(0).default(0),
  swapSpread: z.number().min(0).default(0),
  hedefNIM: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.floatingDebt * input.hedgeRatio; results["exposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exposure"] = Number.NaN; }
  try { const v = input.exposure * input.bpsChange; results["shockImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shockImpact"] = Number.NaN; }
  try { const v = input.assetDur * input.liabDur; results["durGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["durGap"] = Number.NaN; }
  try { const v = input.durGap * input.assetVal * input.rateChange; results["eVEChange"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eVEChange"] = Number.NaN; }
  try { const v = input.inc * input.earningAssets; results["nIM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nIM"] = Number.NaN; }
  try { const v = input.portVal * input.volatility * input.z; results["vaR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vaR"] = Number.NaN; }
  try { const v = input.notional * input.swapSpread; results["hedgeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hedgeCost"] = Number.NaN; }
  try { const v = input.fixed * input.floatingCurr; results["breakEven"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakEven"] = Number.NaN; }
  return results;
}

export function calculateFaizOraniRiski(input) {
  return evaluateAllFormulas(input);
}
