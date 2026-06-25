/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: FIN_019
 * Name: Yıllık Getiri
 */

export const InputSchema_FIN_019 = z.object({
  baslangic: z.number(),
  bitis: z.number(),
  yil: z.number(),
});

export type Input_FIN_019 = z.infer<typeof InputSchema_FIN_019>;

export interface Output_FIN_019 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_019(input: Input_FIN_019): Output_FIN_019 {
  const validData = InputSchema_FIN_019.parse(input);
  const { baslangic, bitis, yil } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (yil < 1) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Yıllıklandırma Hatası",
        message: "Uyarı: Yıllıklandırma (Annualization) 1 yıldan kısa süreler için yapıldığında, elde edilen yüksek kısa vadeli getiriyi tüm yıla projekte ederek yanıltıcı (gerçek dışı) bir performans tablosu yaratabilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
