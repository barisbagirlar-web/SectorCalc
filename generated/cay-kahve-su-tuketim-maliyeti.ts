// Auto-generated from cay-kahve-su-tuketim-maliyeti-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CayKahveSuTuketimMaliyetiInput {
  calisanSayisi: number;
  gunlukCayTuketimiKisi: number;
  gunlukKahveTuketimiKisi: number;
  gunlukSuTuketimiKisi: number;
  cayPosetFiyati: number;
  kahveFiyati: number;
  suFiyati: number;
  calismaGunuAy: number;
  cayBardakBasinaSuMiktari: number;
  kahveFincanBasinaSuMiktari: number;
  cayGramBardak: number;
  kahveGramFincan: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const CayKahveSuTuketimMaliyetiInputSchema = z.object({
  calisanSayisi: z.number().min(1).max(10000).default(50),
  gunlukCayTuketimiKisi: z.number().min(0).max(20).default(3),
  gunlukKahveTuketimiKisi: z.number().min(0).max(10).default(1),
  gunlukSuTuketimiKisi: z.number().min(0).max(10).default(1.5),
  cayPosetFiyati: z.number().min(0.01).max(5).default(0.5),
  kahveFiyati: z.number().min(50).max(2000).default(300),
  suFiyati: z.number().min(0.1).max(10).default(0.5),
  calismaGunuAy: z.number().min(1).max(31).default(22),
  cayBardakBasinaSuMiktari: z.number().min(0.05).max(0.5).default(0.15),
  kahveFincanBasinaSuMiktari: z.number().min(0.05).max(0.3).default(0.1),
  cayGramBardak: z.number().min(1).max(5).default(2),
  kahveGramFincan: z.number().min(5).max(15).default(7),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface CayKahveSuTuketimMaliyetiOutput {
  aylikToplamMaliyet: number;
  breakdown: {
    aylikCayMaliyeti: number;
    aylikKahveMaliyeti: number;
    aylikSuMaliyeti: number;
    kisiBasinaAylikMaliyet: number;
    yillikToplamMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CayKahveSuTuketimMaliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.aylikCayTuketimAdet = (() => { try { return input.calisanSayisi * input.gunlukCayTuketimiKisi * input.calismaGunuAy; } catch { return 0; } })();
  results.aylikKahveTuketimAdet = (() => { try { return input.calisanSayisi * input.gunlukKahveTuketimiKisi * input.calismaGunuAy; } catch { return 0; } })();
  results.aylikSuTuketimLitre = (() => { try { return input.calisanSayisi * input.gunlukSuTuketimiKisi * input.calismaGunuAy; } catch { return 0; } })();
  results.aylikCayMaliyeti = (() => { try { return results.aylikCayTuketimAdet * input.cayPosetFiyati; } catch { return 0; } })();
  results.aylikKahveMaliyeti = (() => { try { return results.aylikKahveTuketimAdet * (input.kahveGramFincan / 1000) * input.kahveFiyati; } catch { return 0; } })();
  results.aylikSuMaliyeti = (() => { try { return results.aylikSuTuketimLitre * input.suFiyati; } catch { return 0; } })();
  results.aylikToplamMaliyet = (() => { try { return results.aylikCayMaliyeti + results.aylikKahveMaliyeti + results.aylikSuMaliyeti; } catch { return 0; } })();
  results.yillikToplamMaliyet = (() => { try { return results.aylikToplamMaliyet * 12; } catch { return 0; } })();
  results.kisiBasinaAylikMaliyet = (() => { try { return results.aylikToplamMaliyet / input.calisanSayisi; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return input.dataConfidence == 'dusuk' ? results.aylikToplamMaliyet * 1.2 : (input.dataConfidence == 'orta' ? results.aylikToplamMaliyet * 1.1 : results.aylikToplamMaliyet); } catch { return 0; } })();
  return results;
}

export function calculateCayKahveSuTuketimMaliyeti(input: CayKahveSuTuketimMaliyetiInput): CayKahveSuTuketimMaliyetiOutput {
  const results = evaluateFormulas(input);
  const aylikToplamMaliyet = results.aylikToplamMaliyet ?? 0;
  const breakdown = {
    aylikCayMaliyeti: results.aylikCayMaliyeti,
    aylikKahveMaliyeti: results.aylikKahveMaliyeti,
    aylikSuMaliyeti: results.aylikSuMaliyeti,
    kisiBasinaAylikMaliyet: results.kisiBasinaAylikMaliyet,
    yillikToplamMaliyet: results.yillikToplamMaliyet,
  };

  // rule: calisanSayisi > 0
  // rule: gunlukCayTuketimiKisi >= 0
  // rule: gunlukKahveTuketimiKisi >= 0
  // rule: gunlukSuTuketimiKisi >= 0
  // rule: cayPosetFiyati > 0
  // rule: kahveFiyati > 0
  // rule: suFiyati > 0
  // rule: calismaGunuAy between 1 and 31
  // rule: cayBardakBasinaSuMiktari > 0
  // rule: kahveFincanBasinaSuMiktari > 0
  // rule: cayGramBardak > 0
  // rule: kahveGramFincan > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek cay tuketimi, saglik uyarisi
  // threshold skipped (non-JS): Yuksek kahve tuketimi, kafein uyarisi
  // threshold skipped (non-JS): Dusuk su tuketimi, dehidrasyon riski

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return aylikToplamMaliyet; } })();

  return {
    aylikToplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (aylik karsilastirma)","Detayli rapor (grafiklerle)"],
  };
}
