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
 * ID: MFG_340
 * Name: Takt Time vs Çevrim Süresi (Cycle Time)
 */

export const InputSchema_MFG_340 = z.object({
  net_sure: z.number(),
  musteri_talebi: z.number(),
  olculen_cevrim: z.number(),
});

export type Input_MFG_340 = z.infer<typeof InputSchema_MFG_340>;

export interface Output_MFG_340 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_340(input: Input_MFG_340): Output_MFG_340 {
  const validData = InputSchema_MFG_340.parse(input);
  const { net_sure, musteri_talebi, olculen_cevrim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (olculen_cevrim > (net_sure / musteri_talebi)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Value Stream Mapping (VSM)",
        message: "Kritik Üretim Hatası: Ölçülen Çevrim Süresi (CT), Takt Time'dan (Müşteri Ritminden) yüksektir. Bu istasyon mevcut hızıyla müşteri siparişlerini asla yetiştiremez (Darboğaz). Fazla mesai, operatör ekleme veya Kaizen iyileştirmesi şarttır."
      });
    }

    if (olculen_cevrim < ((net_sure / musteri_talebi) * 0.8)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "TPS / İsraf Analizi",
        message: "Uyarı: Çevrim süreniz Takt süresinin %80'inin de altındadır. İstasyon müşteri talebinden çok daha hızlı çalışmaktadır. Toyota sistemine göre bu durum en kötü israftır (Aşırı Üretim / Overproduction); stokları şişirir ve operatörleri boş bekletir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
