// Auto-generated from ucgen-alani-cevresi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface UcgenAlaniCevresiHesaplamaInput {
  kenarA: number;
  kenarB: number;
  kenarC: number;
  birim: 'm' | 'cm' | 'mm' | 'ft' | 'in';
}

export const UcgenAlaniCevresiHesaplamaInputSchema = z.object({
  kenarA: z.number().min(0.001).max(1000000).default(1),
  kenarB: z.number().min(0.001).max(1000000).default(1),
  kenarC: z.number().min(0.001).max(1000000).default(1),
  birim: z.enum(['m', 'cm', 'mm', 'ft', 'in']).default('m'),
});

export interface UcgenAlaniCevresiHesaplamaOutput {
  alan: number;
  breakdown: {
    cevre: number;
    yarimCevre: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: UcgenAlaniCevresiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.cevre = ((): number => { try { const __v = input.kenarA + input.kenarB + input.kenarC; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yarimCevre = ((): number => { try { const __v = (input.kenarA + input.kenarB + input.kenarC) / 2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.alan = ((): number => { try { const __v = Math.Math.sqrt(results.yarimCevre * (results.yarimCevre - input.kenarA) * (results.yarimCevre - input.kenarB) * (results.yarimCevre - input.kenarC)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateUcgenAlaniCevresiHesaplama(input: UcgenAlaniCevresiHesaplamaInput): UcgenAlaniCevresiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const alan = results.alan ?? 0;
  const breakdown = {
    cevre: results.cevre,
    yarimCevre: results.yarimCevre,
  };

  // rule: kenarA > 0
  // rule: kenarB > 0
  // rule: kenarC > 0
  // rule: kenarA + kenarB > kenarC
  // rule: kenarA + kenarC > kenarB
  // rule: kenarB + kenarC > kenarA
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kenar A cok kucuk, hassasiyet sorunu olabilir.
  // threshold skipped (non-JS): Kenar B cok kucuk, hassasiyet sorunu olabilir.
  // threshold skipped (non-JS): Kenar C cok kucuk, hassasiyet sorunu olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.alan; } catch { return alan; } })();

  return {
    alan,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison"],
  };
}
