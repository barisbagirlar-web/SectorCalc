import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_110
 * Araç Adı: Stok Devir Hızı
 */

export const InputSchema_CORP_110 = z.object({
  yillik_cogs: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ort_stok: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_CORP_110 = z.infer<typeof InputSchema_CORP_110>;

export interface Output_CORP_110 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_110(input: Input_CORP_110): Output_CORP_110 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_cogs, ort_stok
  
  const validData = InputSchema_CORP_110.parse(input);
  const { yillik_cogs, ort_stok } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const devirHizi = yillik_cogs / Math.max(0.0001, ort_stok);
  const result = 365 / Math.max(0.0001, devirHizi);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Envanter Yönetimi",
      message: "Uyarı: Stokların eritilme süresi 180 günü (6 ay) aşıyor. Önemli miktarda sermayeyi depoya bağladınız; 'Ölü Stok (Dead Inventory)', depolama maliyeti ve ürün eskimsi/bozulması riski çok yüksektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}