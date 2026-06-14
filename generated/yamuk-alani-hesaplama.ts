// Auto-generated from yamuk-alani-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YamukAlaniHesaplamaInput {
  ustKenar: number;
  altKenar: number;
  yukseklik: number;
}

export const YamukAlaniHesaplamaInputSchema = z.object({
  ustKenar: z.number().min(0).default(0),
  altKenar: z.number().min(0).default(0),
  yukseklik: z.number().min(0).default(0),
});

export interface YamukAlaniHesaplamaOutput {
  alan: number;
  breakdown: {

  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YamukAlaniHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.alan = ((): number => { try { const __v = (input.ustKenar + input.altKenar) * input.yukseklik / 2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYamukAlaniHesaplama(input: YamukAlaniHesaplamaInput): YamukAlaniHesaplamaOutput {
  const results = evaluateFormulas(input);
  const alan = results.alan ?? 0;
  const breakdown = {

  };

  // rule: ustKenar >= 0
  // rule: altKenar >= 0
  // rule: yukseklik >= 0
  // rule: ustKenar + altKenar > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];


  const dataConfidenceAdjusted = (() => { try { return results.alan; } catch { return alan; } })();

  return {
    alan,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison"],
  };
}
