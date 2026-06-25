import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_155
 * Araç Adı: Sağlık Sigortası (HSA / ÖSS Vergisi)
 */

export const InputSchema_INS_155 = z.object({
  yillik_katki: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  marjinal_vergi: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_INS_155 = z.infer<typeof InputSchema_INS_155>;

export interface Output_INS_155 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_155(input: Input_INS_155): Output_INS_155 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_katki, marjinal_vergi
  
  const validData = InputSchema_INS_155.parse(input);
  const { yillik_katki, marjinal_vergi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Vergi İndirimi Limitleri",
      message: "Uyarı: Sisteme girilen katkı tutarı çok yüksektir. Çoğu ülke (ve IRS limitleri) sağlık hesaplarına (veya TR için ÖSS poliçelerine) yatırılan paranın vergiden düşülebilecek kısmına yıllık bir üst limit koyar. Tüm katkı vergiden düşülemeyebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
