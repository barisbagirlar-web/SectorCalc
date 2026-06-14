// Auto-generated from istatistiksel-proses-kontrol-spc-limit-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IstatistikselProsesKontrolSpcLimitHesabiInput {
  processMean: number;
  processStdDev: number;
  sampleSize: number;
  numSigmas: number;
  chartType: 'Xbar-R' | 'Xbar-s' | 'I-MR' | 'p' | 'np' | 'c' | 'u';
}

export const IstatistikselProsesKontrolSpcLimitHesabiInputSchema = z.object({
  processMean: z.number().default(0),
  processStdDev: z.number().min(0).default(1),
  sampleSize: z.number().min(1).max(100).default(5),
  numSigmas: z.number().min(1).max(6).default(3),
  chartType: z.enum(['Xbar-R', 'Xbar-s', 'I-MR', 'p', 'np', 'c', 'u']).default('Xbar-R'),
});

export interface IstatistikselProsesKontrolSpcLimitHesabiOutput {
  uCL: number;
  breakdown: {
    uCL: number;
    cL: number;
    lCL: number;
    uCLR: number;
    lCLR: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IstatistikselProsesKontrolSpcLimitHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.uCL = ((): number => { try { const __v = input.processMean + input.numSigmas * (input.processStdDev / Math.sqrt(input.sampleSize)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lCL = ((): number => { try { const __v = input.processMean - input.numSigmas * (input.processStdDev / Math.sqrt(input.sampleSize)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cL = ((): number => { try { const __v = input.processMean; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.d3 = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.d4 = ((): number => { try { const __v = 2.114; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.uCLR = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lCLR = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIstatistikselProsesKontrolSpcLimitHesabi(input: IstatistikselProsesKontrolSpcLimitHesabiInput): IstatistikselProsesKontrolSpcLimitHesabiOutput {
  const results = evaluateFormulas(input);
  const uCL = results.uCL ?? 0;
  const breakdown = {
    uCL: results.uCL,
    cL: results.cL,
    lCL: results.lCL,
    uCLR: results.uCLR,
    lCLR: results.lCLR,
  };

  // rule: processStdDev > 0
  // rule: sampleSize >= 1
  // rule: numSigmas >= 1
  // rule: chartType must be one of the allowed values
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Standart sapma sifir veya negatif olamaz.
  // threshold skipped (non-JS): Alt grup buyuklugu en az 2 olmalidir (Xbar-R icin).
  // threshold skipped (non-JS): Sigma sayisi 3'ten kucuk ise kontrol limitleri dar olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.uCL * (1 - 0.05); } catch { return uCL; } })();

  return {
    uCL,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (birden fazla proses)","Detayli rapor (kok neden analizi dahil)"],
  };
}
