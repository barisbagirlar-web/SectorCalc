// Auto-generated from fazla-mesai-ucreti-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FazlaMesaiUcretiHesaplamaInput {
  brutUcret: number;
  calismaSaati: number;
  fazlaMesaiSaati: number;
  fazlaMesaiKatsayisi: number;
  primOrani: number;
}

export const FazlaMesaiUcretiHesaplamaInputSchema = z.object({
  brutUcret: z.number().min(0).default(10000),
  calismaSaati: z.number().min(0).max(168).default(45),
  fazlaMesaiSaati: z.number().min(0).default(10),
  fazlaMesaiKatsayisi: z.number().min(1).max(3).default(1.5),
  primOrani: z.number().min(0).max(100).default(0),
});

export interface FazlaMesaiUcretiHesaplamaOutput {
  toplamFazlaMesaiUcreti: number;
  breakdown: {
    saatlikUcret: number;
    fazlaMesaiUcreti: number;
    primTutari: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FazlaMesaiUcretiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.saatlikUcret = ((): number => { try { const __v = input.brutUcret / (input.calismaSaati * 4.33); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fazlaMesaiUcreti = ((): number => { try { const __v = results.saatlikUcret * input.fazlaMesaiKatsayisi * input.fazlaMesaiSaati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primTutari = ((): number => { try { const __v = results.fazlaMesaiUcreti * (input.primOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamFazlaMesaiUcreti = ((): number => { try { const __v = results.fazlaMesaiUcreti + results.primTutari; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFazlaMesaiUcretiHesaplama(input: FazlaMesaiUcretiHesaplamaInput): FazlaMesaiUcretiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const toplamFazlaMesaiUcreti = results.toplamFazlaMesaiUcreti ?? 0;
  const breakdown = {
    saatlikUcret: results.saatlikUcret,
    fazlaMesaiUcreti: results.fazlaMesaiUcreti,
    primTutari: results.primTutari,
  };

  // rule: brutUcret > 0
  // rule: calismaSaati > 0 && calismaSaati <= 168
  // rule: fazlaMesaiSaati >= 0
  // rule: fazlaMesaiKatsayisi >= 1 && fazlaMesaiKatsayisi <= 3
  // rule: primOrani >= 0 && primOrani <= 100
  // rule: fazlaMesaiSaati <= 22.5 ? 'Aylik fazla mesai kanuni siniri asiyor (22.5 saat/ay)' : ''
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 22.5

  const dataConfidenceAdjusted = (() => { try { return results.toplamFazlaMesaiUcreti; } catch { return toplamFazlaMesaiUcreti; } })();

  return {
    toplamFazlaMesaiUcreti,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (calisan bazinda)","Detayli rapor"],
  };
}
