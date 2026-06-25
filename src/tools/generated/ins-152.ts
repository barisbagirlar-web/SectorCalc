import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_152
 * Araç Adı: Tam Hayat Sigortası (Whole Life)
 */

export const InputSchema_INS_152 = z.object({
  yillik_prim: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_152 = z.infer<typeof InputSchema_INS_152>;

export interface Output_INS_152 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_152(input: Input_INS_152): Output_INS_152 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_prim, faiz, yil
  
  const validData = InputSchema_INS_152.parse(input);
  const { yillik_prim, faiz, yil } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const faizOrani = faiz / 100;
  const birikimCarpani = Math.pow(1 + faizOrani, yil) - 1;
  const payda = Math.max(0.0001, faizOrani);
  const result = yillik_prim * (birikimCarpani / payda);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Aktüeryal Değerleme",
      message: "Uyarı: Hayat sigortası nakit değer büyümesi (Cash Value) için %8 üzeri garanti getiri hesaplaması oldukça yanıltıcıdır. Sigorta şirketlerinin idari kesintileri (Gider Payı) brüt faizden düşülmelidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}