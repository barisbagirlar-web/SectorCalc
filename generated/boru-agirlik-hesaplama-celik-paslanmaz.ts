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
  results.icCap = ((): number => { try { const __v = input.disCap - 2 * input.etKal; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kesitAlan = ((): number => { try { const __v = 3.14159 * (input.disCap^2 - results.icCap^2) / 4; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hacim = ((): number => { try { const __v = results.kesitAlan * input.boy / 1000000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.agirlik = ((): number => { try { const __v = results.hacim * (input.malzeme == 'celik' ? 7850 : 7930); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
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
