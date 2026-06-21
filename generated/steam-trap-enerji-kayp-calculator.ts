// Auto-generated premium calculator: steam-trap-enerji-kayp
import * as z from 'zod';

export interface SteamTrapEnerjiKaypInput {
  delik CapıMm: number;
  basıncFarkıBar: number;
  buharEntalpisiKJkg: number;
  arızalıSaglamKapanSayısı: number;
  yıllık CalısmaSaat: number;
  buhar UretimMaliyetiCurrencykWh: number;
  kapanDegisimMaliyeti: number;
}

export const SteamTrapEnerjiKaypInputSchema = z.object({
  delik CapıMm: z.number().min(0).default(0),
  basıncFarkıBar: z.number().min(0).default(0),
  buharEntalpisiKJkg: z.number().min(0).default(0),
  arızalıSaglamKapanSayısı: z.number().min(0).default(0),
  yıllık CalısmaSaat: z.number().min(0).default(0),
  buhar UretimMaliyetiCurrencykWh: z.number().min(0).default(0),
  kapanDegisimMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.cD * input.a * input.deltaP * input.density; results["orificeFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["orificeFlow"] = Number.NaN; }
  try { const v = input.orificeFlow; results["steamLossKgH"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["steamLossKgH"] = Number.NaN; }
  try { const v = input.steamLossKgH * input.enthalpySteam; results["energyLossKW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyLossKW"] = Number.NaN; }
  try { const v = input.energyLossKW * input.operatingHours * input.steamCostPerKWh; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCost"] = Number.NaN; }
  try { const v = input.failedTraps * input.totalTraps; results["trapFailureRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["trapFailureRate"] = Number.NaN; }
  try { const v = input.annualCostI; results["totalSystemLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSystemLoss"] = Number.NaN; }
  try { const v = input.totalSystemLoss * input.trapCost * input.laborCost; results["repairROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["repairROI"] = Number.NaN; }
  return results;
}

export function calculateSteamTrapEnerjiKayp(input) {
  return evaluateAllFormulas(input);
}
