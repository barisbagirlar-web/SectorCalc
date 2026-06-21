// Auto-generated premium calculator: alti-sigma-proje-nceliklendirici
import * as z from 'zod';

export interface AltiSigmaProjeNceliklendiriciInput {
  UretimHacmi: number;
  hatalıBirim: number;
  hataFırsatı: number;
  IcDısBasarısızlıkMaliyeti: number;
  mevcutZbench: number;
  hedefSigma: number;
  kurtarmaOlasılıgı: number;
}

export const AltiSigmaProjeNceliklendiriciInputSchema = z.object({
  UretimHacmi: z.number().min(0).default(0),
  hatalıBirim: z.number().min(0).default(0),
  hataFırsatı: z.number().min(0).default(0),
  IcDısBasarısızlıkMaliyeti: z.number().min(0).default(0),
  mevcutZbench: z.number().min(0).default(0),
  hedefSigma: z.number().min(0).default(0),
  kurtarmaOlasılıgı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.defects * input.units * input.opportunities; results["dPMO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dPMO"] = Number.NaN; }
  try { const v = input.defects * input.units * input.opportunities; results["yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yield"] = Number.NaN; }
  try { const v = input.yield; results["zBench"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zBench"] = Number.NaN; }
  try { const v = input.zBench; results["sigmaLevel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sigmaLevel"] = Number.NaN; }
  try { const v = input.internalFailure * input.externalFailure * input.appraisal * input.prevention; results["cOPQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cOPQ"] = Number.NaN; }
  try { const v = input.cOPQ * input.recoveryProb * input.sigmaGap * input.strategicAlignment * input.ease; results["projectScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["projectScore"] = Number.NaN; }
  return results;
}

export function calculateAltiSigmaProjeNceliklendirici(input) {
  return evaluateAllFormulas(input);
}
