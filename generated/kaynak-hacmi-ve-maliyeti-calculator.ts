// Auto-generated premium calculator: kaynak-hacmi-ve-maliyeti
import * as z from 'zod';

export interface KaynakHacmiVeMaliyetiInput {
  kaynakBoyuLeg: number;
  uzunluk: number;
  tel CapıEkimVerimi: number;
  gazDebisi: number;
  voltajAkım: number;
  telGazKgm3Fiyatı: number;
  IscilikSaati: number;
  elektrik: number;
}

export const KaynakHacmiVeMaliyetiInputSchema = z.object({
  kaynakBoyuLeg: z.number().min(0).default(0),
  uzunluk: z.number().min(0).default(0),
  tel CapıEkimVerimi: z.number().min(0).default(0),
  gazDebisi: z.number().min(0).default(0),
  voltajAkım: z.number().min(0).default(0),
  telGazKgm3Fiyatı: z.number().min(0).default(0),
  IscilikSaati: z.number().min(0).default(0),
  elektrik: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.leg; results["areaWeld"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaWeld"] = Number.NaN; }
  try { const v = input.areaWeld * input.length; results["volumeWeld"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeWeld"] = Number.NaN; }
  try { const v = input.volumeWeld * input.density; results["weightDeposited"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightDeposited"] = Number.NaN; }
  try { const v = input.weightDeposited * input.depositionEfficiency; results["weightElectrode"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightElectrode"] = Number.NaN; }
  try { const v = input.weightElectrode * input.pricePerKg; results["costFiller"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costFiller"] = Number.NaN; }
  try { const v = input.gasFlowRate * input.arcTime * input.gasPrice; results["costGas"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costGas"] = Number.NaN; }
  try { const v = input.voltage * input.current * input.arcTime * input.machineEff * input.elecRate; results["costPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPower"] = Number.NaN; }
  try { const v = input.costFiller * input.costGas * input.costPower * input.arcTime * input.depositionRate * input.laborRate; results["totalWeldCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeldCost"] = Number.NaN; }
  return results;
}

export function calculateKaynakHacmiVeMaliyeti(input) {
  return evaluateAllFormulas(input);
}
