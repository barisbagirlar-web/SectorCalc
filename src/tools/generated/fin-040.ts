import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_040
 * Araç Adı: Maksimum Düşüş (Max Drawdown)
 */

export const InputSchema_FIN_040 = z.object({
  zirve_deger: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  dip_deger: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_040 = z.infer<typeof InputSchema_FIN_040>;

export interface Output_FIN_040 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_040(input: Input_FIN_040): Output_FIN_040 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: zirve_deger, dip_deger
  
  const validData = InputSchema_FIN_040.parse(input);
  const { zirve_deger, dip_deger } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // MDD = ((ZirveDeger - DipDeger) / MAX(1, ZirveDeger)) * 100
  const maxDenominator = Math.max(1, zirve_deger);
  const result = ((zirve_deger - dip_deger) / maxDenominator) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 50) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Sermaye Koruma Yönetimi",
      message: "Uyarı: Maksimum Düşüş (MDD) %50'yi aşmıştır. Portföyün eski zirvesine ulaşması için mevcut dipten %100 oranında (%50 kayıp için %100 kazanç gerekir) büyümesi gerekmektedir. İyileşme (recovery) süresi yıllar sürebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}