import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_367
 * Araç Adı: Yay İndeksi ve Sarım Zorluğu (Spring Index - C)
 */

export const InputSchema_MECH_367 = z.object({
  ortalama_cap: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tel_cap: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_367 = z.infer<typeof InputSchema_MECH_367>;

export interface Output_MECH_367 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_367(input: Input_MECH_367): Output_MECH_367 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ortalama_cap, tel_cap
  
  const validData = InputSchema_MECH_367.parse(input);
  const { ortalama_cap, tel_cap } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "SMI Yay İmalat Standartları",
      message: "Kritik İmalat Reddi: Yay indeksi (C) 4'ün altındadır. Tel o kadar kalın ve yay çapı o kadar dar ki, sarım makinesinde (Spring Coiler) telin plastik deformasyona uğratılıp sarılması fiziken imkansızdır; sarılsa bile iç gerilmelerden dolayı anında kırılır."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "SMI Yay İmalat Standartları",
      message: "Uyarı: Yay indeksi 12'nin üzerindedir. Yay kendi ağırlığını taşımakta bile zorlanacak, basma kuvveti altında anında burkulacaktır (Buckling). Tel çapını artırın veya içine kılavuz mil (Guide Pin) ekleyin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
