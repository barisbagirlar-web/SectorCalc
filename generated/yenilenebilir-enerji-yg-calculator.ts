// Auto-generated premium calculator: yenilenebilir-enerji-yg
import * as z from 'zod';

export interface YenilenebilirEnerjiYgInput {
  kuruluGucKW: number;
  kapasiteFaktoru: number;
  sistem OmruYıl: number;
  capex: number;
  wACC: number;
  SebekeElektrikFiyatıCurrencykWh: number;
  yıllıkBakımSigorta: number;
  tesvikler: number;
}

export const YenilenebilirEnerjiYgInputSchema = z.object({
  kuruluGucKW: z.number().min(0).default(0),
  kapasiteFaktoru: z.number().min(0).default(0),
  sistem OmruYıl: z.number().min(0).default(0),
  capex: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
  SebekeElektrikFiyatıCurrencykWh: z.number().min(0).default(0),
  yıllıkBakımSigorta: z.number().min(0).default(0),
  tesvikler: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.systemCapacity * input.capacityFactor; results["annualGeneration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualGeneration"] = Number.NaN; }
  try { const v = input.annualGeneration * input.gridElectricityRate; results["annualSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualSavings"] = Number.NaN; }
  try { const v = input.maintenance * input.insurance * input.inverterReplacementFund; results["annualOPEX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualOPEX"] = Number.NaN; }
  try { const v = input.annualSavings * input.annualOPEX * input.incentives; results["netCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netCashFlow"] = Number.NaN; }
  try { const v = input.totalCapex * input.netCashFlow; results["paybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackPeriod"] = Number.NaN; }
  try { const v = input.totalCapex * input.oPEXT * input.r * input.t * input.generationT; results["lCOE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lCOE"] = Number.NaN; }
  try { const v = input.netCashFlowT * input.wACC * input.t * input.totalCapex; results["nPV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPV"] = Number.NaN; }
  return results;
}

export function calculateYenilenebilirEnerjiYg(input) {
  return evaluateAllFormulas(input);
}
