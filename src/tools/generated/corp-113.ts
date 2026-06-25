import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_113
 * Araç Adı: Brüt ve Net Kâr
 */

export const InputSchema_CORP_113 = z.object({
  ciro: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  cogs: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  isletme_gideri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vergi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_113 = z.infer<typeof InputSchema_CORP_113>;

export interface Output_CORP_113 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_113(input: Input_CORP_113): Output_CORP_113 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ciro, cogs, isletme_gideri, vergi
  
  const validData = InputSchema_CORP_113.parse(input);
  const { ciro, cogs, isletme_gideri, vergi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const brut = ciro - cogs;
  const net = brut - isletme_gideri - vergi;
  const result = net;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (brut < 0) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Ticari Sürdürülebilirlik",
      message: "Kritik Uyarı: Brüt Kâr negatiftir. Şirket, ürün/hizmeti tedarik ettiği veya ürettiği maliyetin altında satmaktadır (Pricing Crisis)."
    });
  }

  if (isletme_gideri + vergi > brut) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Gider Yönetimi",
      message: "Uyarı: Faaliyet (OPEX) giderleri brüt kârı tamamen tüketmektedir. Net kâra ulaşmak için operasyonel verimlilik artırılmalı veya personel/pazarlama bütçesi kısılmalıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}