// Auto-generated premium calculator: tedariki-dviz-kuru-riski
import * as z from 'zod';

export interface TedarikiDvizKuruRiskiInput {
  dovizCinsiSozlesmeBedeli: number;
  hedgeEdilmeyenOran: number;
  spotForwardKur: number;
  volatilite: number;
  zamanUfkuGun: number;
  zSkoru: number;
  dovizAyarlamaKlozuFaktoru: number;
}

export const TedarikiDvizKuruRiskiInputSchema = z.object({
  dovizCinsiSozlesmeBedeli: z.number().min(0).default(0),
  hedgeEdilmeyenOran: z.number().min(0).default(0),
  spotForwardKur: z.number().min(0).default(0),
  volatilite: z.number().min(0).default(0),
  zamanUfkuGun: z.number().min(0).default(0),
  zSkoru: z.number().min(0).default(0),
  dovizAyarlamaKlozuFaktoru: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.contractValueFC * input.unhedgedPct; results["exposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exposure"] = Number.NaN; }
  try { const v = input.exposure * input.forwardRate * input.expectedSpotRate; results["expectedLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedLoss"] = Number.NaN; }
  try { const v = input.exposure * input.volatility * input.zScore * input.timeHorizon; results["vaR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vaR"] = Number.NaN; }
  try { const v = input.exposure * input.forwardRate * input.spotRate; results["hedgingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hedgingCost"] = Number.NaN; }
  try { const v = input.expectedLoss * input.hedgingCost; results["netRiskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netRiskCost"] = Number.NaN; }
  try { const v = input.contractHasAdjustment * input.exposure * input.adjustmentFactor; results["currencyClauseSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currencyClauseSavings"] = Number.NaN; }
  return results;
}

export function calculateTedarikiDvizKuruRiski(input) {
  return evaluateAllFormulas(input);
}
