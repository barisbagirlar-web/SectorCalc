// Auto-generated from nakit-akisi-basit-gunluk-haftalik-panosu-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface NakitAkisiBasitGunlukHaftalikPanosuInput {
  baslangicNakdi: number;
  gunlukGelir: number;
  gunlukGider: number;
  gunlukNetNakitAkisi: number;
  haftalikGelir: number;
  haftalikGider: number;
  haftalikNetNakitAkisi: number;
  dataConfidence: number;
}

export const NakitAkisiBasitGunlukHaftalikPanosuInputSchema = z.object({
  baslangicNakdi: z.number().min(0).default(0),
  gunlukGelir: z.number().min(0).default(0),
  gunlukGider: z.number().min(0).default(0),
  gunlukNetNakitAkisi: z.number().default(0),
  haftalikGelir: z.number().min(0).default(0),
  haftalikGider: z.number().min(0).default(0),
  haftalikNetNakitAkisi: z.number().default(0),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface NakitAkisiBasitGunlukHaftalikPanosuOutput {
  gunlukNetNakitAkisi: number;
  breakdown: {
    gunlukBakiye: number;
    haftalikBakiye: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: NakitAkisiBasitGunlukHaftalikPanosuInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gunlukNetNakitAkisi = ((): number => { try { const __v = input.gunlukGelir - input.gunlukGider; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.haftalikNetNakitAkisi = ((): number => { try { const __v = input.haftalikGelir - input.haftalikGider; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gunlukBakiye = ((): number => { try { const __v = input.baslangicNakdi + results.input.gunlukNetNakitAkisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.haftalikBakiye = ((): number => { try { const __v = input.baslangicNakdi + results.input.haftalikNetNakitAkisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence < 100 ? (results.input.gunlukNetNakitAkisi * input.dataConfidence / 100) : results.input.gunlukNetNakitAkisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateNakitAkisiBasitGunlukHaftalikPanosu(input: NakitAkisiBasitGunlukHaftalikPanosuInput): NakitAkisiBasitGunlukHaftalikPanosuOutput {
  const results = evaluateFormulas(input);
  const gunlukNetNakitAkisi = results.gunlukNetNakitAkisi ?? 0;
  const breakdown = {
    gunlukBakiye: results.gunlukBakiye,
    haftalikBakiye: results.haftalikBakiye,
  };

  // rule: gunlukGelir >= 0
  // rule: gunlukGider >= 0
  // rule: haftalikGelir >= 0
  // rule: haftalikGider >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.gunlukNetNakitAkisi < 0) hiddenLossDrivers.push("Negatif gunluk nakit akisi");
  if (input.haftalikNetNakitAkisi < 0) hiddenLossDrivers.push("Negatif haftalik nakit akisi");
  if (input.baslangicNakdi < 0) hiddenLossDrivers.push("Baslangic nakdi negatif");

  const dataConfidenceAdjusted = (() => { try { return input.dataConfidence < 100 ? (results.input.gunlukNetNakitAkisi * input.dataConfidence / 100) : results.input.gunlukNetNakitAkisi; } catch { return gunlukNetNakitAkisi; } })();

  return {
    gunlukNetNakitAkisi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
