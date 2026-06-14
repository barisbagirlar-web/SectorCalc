// Auto-generated from daire-alani-cevresi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DaireAlaniCevresiHesaplamaInput {
  yaricap: number;
  birim: 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft';
}

export const DaireAlaniCevresiHesaplamaInputSchema = z.object({
  yaricap: z.number().min(0).default(1),
  birim: z.enum(['mm', 'cm', 'm', 'km', 'in', 'ft']).default('m'),
});

export interface DaireAlaniCevresiHesaplamaOutput {
  alan: number;
  breakdown: {
    cevre: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DaireAlaniCevresiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.alan = ((): number => { try { const __v = Math.PI * input.yaricap * input.yaricap; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cevre = ((): number => { try { const __v = 2 * Math.PI * input.yaricap; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDaireAlaniCevresiHesaplama(input: DaireAlaniCevresiHesaplamaInput): DaireAlaniCevresiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const alan = results.alan ?? 0;
  const breakdown = {
    cevre: results.cevre,
  };

  // rule: yaricap > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.yaricap <= 0) hiddenLossDrivers.push("Yaricap pozitif olmalidir");

  const dataConfidenceAdjusted = (() => { try { return alan; } catch { return alan; } })();

  return {
    alan,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF/CSV export","trend analizi","karsilastirma","detayli rapor"],
  };
}
