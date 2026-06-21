// Auto-generated premium calculator: project-overrun-risk
import * as z from 'zod';

export interface ProjectOverrunRiskInput {
  bAC: number;
  eV: number;
  aC: number;
  pV: number;
  planlıGercekSureGun: number;
  gecikmeCezasıCurrencygun: number;
  gecikmeMaliyetAsımOlasılıgı: number;
  hızlandırmaMaliyeti: number;
}

export const ProjectOverrunRiskInputSchema = z.object({
  bAC: z.number().min(0).default(0),
  eV: z.number().min(0).default(0),
  aC: z.number().min(0).default(0),
  pV: z.number().min(0).default(0),
  planlıGercekSureGun: z.number().min(0).default(0),
  gecikmeCezasıCurrencygun: z.number().min(0).default(0),
  gecikmeMaliyetAsımOlasılıgı: z.number().min(0).default(0),
  hızlandırmaMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.earnedValue * input.plannedValue; results["sPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sPI"] = Number.NaN; }
  try { const v = input.earnedValue * input.actualCost; results["cPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cPI"] = Number.NaN; }
  try { const v = input.budgetAtCompletion * input.cPI; results["eAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eAC"] = Number.NaN; }
  try { const v = input.eAC * input.budgetAtCompletion; results["expectedOverrun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedOverrun"] = Number.NaN; }
  try { const v = input.actualDuration * input.plannedDuration; results["scheduleDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scheduleDelay"] = Number.NaN; }
  try { const v = input.probabilityOfDelay * input.delayDays * input.dailyPenalty * input.probabilityOfCostOverrun * input.expectedOverrun; results["riskExposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskExposure"] = Number.NaN; }
  try { const v = input.crashingCost * input.fastTrackingCost; results["mitigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mitigationCost"] = Number.NaN; }
  try { const v = input.riskExposure * input.mitigationCost; results["netRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netRisk"] = Number.NaN; }
  return results;
}

export function calculateProjectOverrunRisk(input) {
  return evaluateAllFormulas(input);
}
