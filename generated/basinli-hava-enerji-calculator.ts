// Auto-generated premium calculator: basinli-hava-enerji
import * as z from 'zod';

export interface BasinliHavaEnerjiInput {
  kompresorGucu: number;
  CalısmaSaati: number;
  yukOranı: number;
  IzotermalMotorVerimi: number;
  elektrikTarifesi: number;
  asırıBasıncDusumu: number;
}

export const BasinliHavaEnerjiInputSchema = z.object({
  kompresorGucu: z.number().min(0).default(0),
  CalısmaSaati: z.number().min(0).default(0),
  yukOranı: z.number().min(0).default(0),
  IzotermalMotorVerimi: z.number().min(0).default(0),
  elektrikTarifesi: z.number().min(0).default(0),
  asırıBasıncDusumu: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.q * input.deltaP * input.effIsothermal * input.effMotor * input.effDrive; results["compressorPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["compressorPower"] = Number.NaN; }
  try { const v = input.compressorPower * input.qActual; results["specificPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["specificPower"] = Number.NaN; }
  try { const v = input.compressorPower * input.opHours * input.elecRate * input.loadFactor; results["annualEnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualEnergyCost"] = Number.NaN; }
  try { const v = input.leakFlow * input.opHours * input.specificPower * input.elecRate; results["leakageCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leakageCost"] = Number.NaN; }
  try { const v = input.annualEnergyCost * input.leakageCost * input.pressureDropCost * input.unloadWaste * input.heatRecoverySavings; results["totalAnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAnnualCost"] = Number.NaN; }
  return results;
}

export function calculateBasinliHavaEnerji(input) {
  return evaluateAllFormulas(input);
}
