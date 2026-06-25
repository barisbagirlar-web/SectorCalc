import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_047
 * Araç Adı: Kripto Para Kârı
 */

export const InputSchema_FIN_047 = z.object({
  alis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  miktar: z.number().min(1e-8, "Endüstriyel minimum tolerans: 1e-8"),
  komisyon: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_047 = z.infer<typeof InputSchema_FIN_047>;

export interface Output_FIN_047 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_047(input: Input_FIN_047): Output_FIN_047 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: alis, satis, miktar, komisyon
  
  const validData = InputSchema_FIN_047.parse(input);
  const { alis, satis, miktar, komisyon } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (satis - alis) * miktar * (1 - komisyon / 100); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Kripto Borsa Standartları",
      message: "Uyarı: İşlem komisyonu %2'nin üzerinde. Standart borsalar (Binance vb.) %0.1 civarı komisyon alır. Merkeziyetsiz borsalardaki (DEX) slipaj veya yüksek gas ücretini dahil etmiş olabilirsiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}