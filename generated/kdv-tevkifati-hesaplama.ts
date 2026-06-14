// Auto-generated from kdv-tevkifati-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KdvTevkifatiHesaplamaInput {
  brutTutar: number;
  kdvOrani: '0.01' | '0.08' | '0.18';
  tevkifatOrani: '0.3' | '0.4' | '0.5' | '0.7' | '0.9';
  tevkifatKapsami: 'kismi' | 'tam';
}

export const KdvTevkifatiHesaplamaInputSchema = z.object({
  brutTutar: z.number().min(0).default(0),
  kdvOrani: z.enum(['0.01', '0.08', '0.18']).default('0.18'),
  tevkifatOrani: z.enum(['0.3', '0.4', '0.5', '0.7', '0.9']).default('0.5'),
  tevkifatKapsami: z.enum(['kismi', 'tam']).default('kismi'),
});

export interface KdvTevkifatiHesaplamaOutput {
  odenmesiGerekenKDV: number;
  breakdown: {
    kdvMatrahi: number;
    kdvTutari: number;
    tevkifatTutari: number;
    netTutar: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KdvTevkifatiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kdvMatrahi = ((): number => { try { const __v = input.brutTutar / (1 + (Number(input.kdvOrani) || 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kdvTutari = ((): number => { try { const __v = results.kdvMatrahi * (Number(input.kdvOrani) || 0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tevkifatTutari = ((): number => { try { const __v = results.kdvTutari * (Number(input.tevkifatOrani) || 0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.odenmesiGerekenKDV = ((): number => { try { const __v = results.kdvTutari - results.tevkifatTutari; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netTutar = ((): number => { try { const __v = results.kdvMatrahi + results.odenmesiGerekenKDV; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKdvTevkifatiHesaplama(input: KdvTevkifatiHesaplamaInput): KdvTevkifatiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const odenmesiGerekenKDV = results.odenmesiGerekenKDV ?? 0;
  const breakdown = {
    kdvMatrahi: results.kdvMatrahi,
    kdvTutari: results.kdvTutari,
    tevkifatTutari: results.tevkifatTutari,
    netTutar: results.netTutar,
  };

  // rule: brutTutar > 0
  // rule: kdvOrani in [0.01, 0.08, 0.18]
  // rule: tevkifatOrani in [0.3, 0.4, 0.5, 0.7, 0.9]
  // rule: if tevkifatKapsami == 'tam' then tevkifatOrani == 1.0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 1000000 -> 'Yuksek tevkifat tutari, vergi dairesine bildirim gerekebilir.'

  const dataConfidenceAdjusted = (() => { try { return results.odenmesiGerekenKDV; } catch { return odenmesiGerekenKDV; } })();

  return {
    odenmesiGerekenKDV,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
