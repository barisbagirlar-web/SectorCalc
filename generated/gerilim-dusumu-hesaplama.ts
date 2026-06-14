// Auto-generated from gerilim-dusumu-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface GerilimDusumuHesaplamaInput {
  hatUzunlugu: number;
  akim: number;
  direnc: number;
  reaktans: number;
  fazKatsayisi: 'tekFaz' | 'ucFaz';
  gucFaktoru: number;
  nominalGerilim: number;
}

export const GerilimDusumuHesaplamaInputSchema = z.object({
  hatUzunlugu: z.number().min(0).max(100000).default(100),
  akim: z.number().min(0).max(10000).default(10),
  direnc: z.number().min(0).max(10).default(0.5),
  reaktans: z.number().min(0).max(10).default(0.1),
  fazKatsayisi: z.enum(['tekFaz', 'ucFaz']).default('tekFaz'),
  gucFaktoru: z.number().min(0).max(1).default(0.9),
  nominalGerilim: z.number().min(0).max(100000).default(230),
});

export interface GerilimDusumuHesaplamaOutput {
  gerilimDusumuYuzde: number;
  breakdown: {
    gerilimDusumu: number;
    fazKatsayisiDegeri: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: GerilimDusumuHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.fazKatsayisiDegeri = ((): number => { try { const __v = input.fazKatsayisi === 'tekFaz' ? 2 : Math.Math.sqrt(3); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerilimDusumu = ((): number => { try { const __v = results.fazKatsayisiDegeri * input.akim * (input.hatUzunlugu / 1000) * (input.direnc * input.gucFaktoru + input.reaktans * Math.Math.sqrt(1 - input.gucFaktoru * input.gucFaktoru)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerilimDusumuYuzde = ((): number => { try { const __v = (results.gerilimDusumu / input.nominalGerilim) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateGerilimDusumuHesaplama(input: GerilimDusumuHesaplamaInput): GerilimDusumuHesaplamaOutput {
  const results = evaluateFormulas(input);
  const gerilimDusumuYuzde = results.gerilimDusumuYuzde ?? 0;
  const breakdown = {
    gerilimDusumu: results.gerilimDusumu,
    fazKatsayisiDegeri: results.fazKatsayisiDegeri,
  };

  // rule: hatUzunlugu > 0
  // rule: akim > 0
  // rule: direnc >= 0
  // rule: reaktans >= 0
  // rule: gucFaktoru >= 0 && gucFaktoru <= 1
  // rule: nominalGerilim > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): gerilimDusumuYuzde

  const dataConfidenceAdjusted = (() => { try { return results.gerilimDusumuYuzde * (1 - 0.1); } catch { return gerilimDusumuYuzde; } })();

  return {
    gerilimDusumuYuzde,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli rapor (bilesen bazinda kayiplar)"],
  };
}
