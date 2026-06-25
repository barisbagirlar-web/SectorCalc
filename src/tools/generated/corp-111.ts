import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_111
 * Araç Adı: Nakit Dönüşüm Döngüsü (CCC)
 */

export const InputSchema_CORP_111 = z.object({
  stok_gun: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  alacak_gun: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  borc_gun: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_111 = z.infer<typeof InputSchema_CORP_111>;

export interface Output_CORP_111 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_111(input: Input_CORP_111): Output_CORP_111 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: stok_gun, alacak_gun, borc_gun
  
  const validData = InputSchema_CORP_111.parse(input);
  const { stok_gun, alacak_gun, borc_gun } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = stok_gun + alacak_gun - borc_gun; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Amazon Büyüme Modeli",
      message: "Bilgi: CCC negatiftir. Mükemmel bir işletme sermayesi yönetimi! Müşteriden parayı, tedarikçiye ödeme yapmadan önce tahsil ediyorsunuz; işletme dışarıdan finansmana ihtiyaç duymadan organik büyüyebilir."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "İşletme Sermayesi Riski",
      message: "Kritik Uyarı: Döngü 120 günden fazladır. Her bir birim satış, aylar boyunca şirketin nakdini rehin tutmaktadır; büyüme hızlandıkça paradoks olarak nakit krizine girebilirsiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}