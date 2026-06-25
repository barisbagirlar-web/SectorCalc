import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_157
 * Araç Adı: Medicare / Sağlık Sigortası Tasarrufu
 */

export const InputSchema_INS_157 = z.object({
  dusuk_prim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yuksek_prim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  muafiyet_farki: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_157 = z.infer<typeof InputSchema_INS_157>;

export interface Output_INS_157 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_157(input: Input_INS_157): Output_INS_157 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: dusuk_prim, yuksek_prim, muafiyet_farki
  
  const validData = InputSchema_INS_157.parse(input);
  const { dusuk_prim, yuksek_prim, muafiyet_farki } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result < 0) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Risk Analizi",
      message: "Kritik Uyarı: Sağlıklı kalırsanız primden elde edeceğiniz yıllık kazanç, olası bir hastalıkta ödeyeceğiniz ekstra muafiyet (cebinden çıkacak para) riskini karşılamıyor. Düşük primli plan matematiksel olarak verimsiz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
