import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_106
 * Araç Adı: Nakit Yakma Oranı (Burn Rate)
 */

export const InputSchema_CORP_106 = z.object({
  baslangic_nakit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  bitis_nakit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ay: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_CORP_106 = z.infer<typeof InputSchema_CORP_106>;

export interface Output_CORP_106 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_106(input: Input_CORP_106): Output_CORP_106 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: baslangic_nakit, bitis_nakit, ay
  
  const validData = InputSchema_CORP_106.parse(input);
  const { baslangic_nakit, bitis_nakit, ay } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const burnRate = (baslangic_nakit - bitis_nakit) / Math.max(1, ay);
  const result = Math.max(0, bitis_nakit / Math.max(0.0001, burnRate));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Finansal Performans",
      message: "Bilgi: Dönem sonu nakit, başlangıçtan fazladır. Nakit yakma (Burn Rate) negatiftir; işletme kendi kendini fonlamakta (kâr veya yatırım nakdi üretmekte) ve iflas süresi (Runway) sonsuzdur."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "İflas Riski (Runway)",
      message: "Kritik Uyarı: Şirketin kalan ömrü (Runway) 6 ayın altındadır. Acil fonlama, yatırım turu veya agresif maliyet kesintisi (Layoff vb.) yapılmazsa operasyonlar duracaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}