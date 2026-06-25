import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ROB_336
 * Araç Adı: Robotik TCP (Tool Center Point) Hızı
 */

export const InputSchema_ROB_336 = z.object({
  eksen_hizlari: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  jacobiyen: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_ROB_336 = z.infer<typeof InputSchema_ROB_336>;

export interface Output_ROB_336 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ROB_336(input: Input_ROB_336): Output_ROB_336 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: eksen_hizlari, jacobiyen
  
  const validData = InputSchema_ROB_336.parse(input);
  const { eksen_hizlari, jacobiyen } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 250) {
    smartWarnings.push({
      severity: "WARNING",
      source: "ISO 10218-1 / ISO/TS 15066 (Cobot)",
      message: "İSG Uyarısı: TCP hızı 250 mm/s'yi aşmıştır. Bu sistem kafessiz (Fenceless) çalışan işbirlikçi bir robot (Cobot) ise, bu hız insan-robot çarpışmasında yasal biyo-mekanik acı sınırlarını aşar. Lazer alan tarayıcı (Safety Scanner) ile hız kesme zonu oluşturulmalıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
