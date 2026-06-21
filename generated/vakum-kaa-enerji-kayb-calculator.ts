// Auto-generated premium calculator: vakum-kaa-enerji-kayb
import * as z from 'zod';

export interface VakumKaaEnerjiKaybInput {
  sistemHacmiM3: number;
  basıncDusumuDeltaPBar: number;
  sureDeltaTSn: number;
  atmosferikBasınc: number;
  pompaVerimi: number;
  yıllıkSaat: number;
  elektrikTarifesi: number;
  emisyonFaktoru: number;
}

export const VakumKaaEnerjiKaybInputSchema = z.object({
  sistemHacmiM3: z.number().min(0).default(0),
  basıncDusumuDeltaPBar: z.number().min(0).default(0),
  sureDeltaTSn: z.number().min(0).default(0),
  atmosferikBasınc: z.number().min(0).default(0),
  pompaVerimi: z.number().min(0).default(0),
  yıllıkSaat: z.number().min(0).default(0),
  elektrikTarifesi: z.number().min(0).default(0),
  emisyonFaktoru: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.volume * input.deltaP * input.deltaT; results["leakRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leakRate"] = Number.NaN; }
  try { const v = input.leakRate * input.pAtmospheric * input.pumpEff; results["powerLossKW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerLossKW"] = Number.NaN; }
  try { const v = input.powerLossKW * input.operatingHours; results["annualEnergyLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualEnergyLoss"] = Number.NaN; }
  try { const v = input.annualEnergyLoss * input.elecRate; results["costOfLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costOfLeak"] = Number.NaN; }
  try { const v = input.leakRate * input.totalPumpCapacity; results["pumpCapacityWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pumpCapacityWaste"] = Number.NaN; }
  try { const v = input.annualEnergyLoss * input.gridEmissionFactor; results["carbonEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonEmissions"] = Number.NaN; }
  return results;
}

export function calculateVakumKaaEnerjiKayb(input) {
  return evaluateAllFormulas(input);
}
