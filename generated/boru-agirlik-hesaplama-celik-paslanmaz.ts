// Auto-generated from boru-agirlik-hesaplama-celik-paslanmaz-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoruAgirlikHesaplamaCelikPaslanmazInput {
  disCap: number;
  etKal: number;
  boy: number;
  malzeme: 'celik' | 'paslanmaz';
}

export const BoruAgirlikHesaplamaCelikPaslanmazInputSchema = z.object({
  disCap: z.number().min(1).max(2000).default(50),
  etKal: z.number().min(0.5).max(100).default(5),
  boy: z.number().min(0.1).max(50).default(6),
  malzeme: z.enum(['celik', 'paslanmaz']).default('celik'),
});

export interface BoruAgirlikHesaplamaCelikPaslanmazOutput {
  agirlik: number;
  breakdown: {
    icCap: number;
    kesitAlan: number;
    hacim: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoruAgirlikHesaplamaCelikPaslanmazInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.icCap = (() => { try { return input.disCap - 2 * input.etKal; } catch { return 0; } })();
  results.kesitAlan = (() => { try { return 3.14159 * (input.disCap^2 - results.icCap^2) / 4; } catch { return 0; } })();
  results.hacim = (() => { try { return results.kesitAlan * input.boy / 1000000; } catch { return 0; } })();
  results.agirlik = (() => { try { return results.hacim * (input.malzeme == 'celik' ? 7850 : 7930); } catch { return 0; } })();
  return results;
}

export function calculateBoruAgirlikHesaplamaCelikPaslanmaz(input: BoruAgirlikHesaplamaCelikPaslanmazInput): BoruAgirlikHesaplamaCelikPaslanmazOutput {
  const results = evaluateFormulas(input);
  const agirlik = results.agirlik ?? 0;
  const breakdown = {
    icCap: results.icCap,
    kesitAlan: results.kesitAlan,
    hacim: results.hacim,
  };

  // rule: disCap > 0
  // rule: etKal > 0
  // rule: boy > 0
  // rule: etKal < disCap / 2
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (agirlik > 1000) hiddenLossDrivers.push("Agirlik 1 tonu asiyor, tasima ekipmani gerekebilir.");

  const dataConfidenceAdjusted = (() => { try { return results.agirlik; } catch { return agirlik; } })();

  return {
    agirlik,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
