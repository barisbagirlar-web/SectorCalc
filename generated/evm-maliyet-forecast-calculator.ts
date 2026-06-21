// Auto-generated premium calculator: evm-maliyet-forecast
import * as z from 'zod';

export interface EvmMaliyetForecastInput {
  bAC: number;
  pV: number;
  eV: number;
  aC: number;
  varyansNedeni: string;
  kalanRisk: number;
  yonetimRezervi: number;
}

export const EvmMaliyetForecastInputSchema = z.object({
  bAC: z.number().min(0).default(0),
  pV: z.number().min(0).default(0),
  eV: z.number().min(0).default(0),
  aC: z.number().min(0).default(0),
  varyansNedeni: z.number().min(0).default(0),
  kalanRisk: z.number().min(0).default(0),
  yonetimRezervi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.eV * input.pV; results["sV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sV"] = Number.NaN; }
  try { const v = input.eV * input.aC; results["cV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cV"] = Number.NaN; }
  try { const v = input.eV * input.pV; results["sPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sPI"] = Number.NaN; }
  try { const v = input.eV * input.aC; results["cPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cPI"] = Number.NaN; }
  try { const v = input.bAC * input.cPI; results["eACCPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eACCPI"] = Number.NaN; }
  try { const v = input.aC * input.bAC * input.eV * input.cPI * input.sPI; results["eACCPISPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eACCPISPI"] = Number.NaN; }
  try { const v = input.eAC * input.aC; results["eTC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eTC"] = Number.NaN; }
  try { const v = input.bAC * input.eAC; results["vAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vAC"] = Number.NaN; }
  try { const v = input.bAC * input.eV * input.aC; results["tCPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCPI"] = Number.NaN; }
  return results;
}

export function calculateEvmMaliyetForecast(input) {
  return evaluateAllFormulas(input);
}
