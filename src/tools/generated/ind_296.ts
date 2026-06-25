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
 * ID: IND_296
 * Name: Ultrasonik Muayene (NDT) Ses Hızı Kalibrasyonu
 */

export const InputSchema_IND_296 = z.object({
  referans_kalinlik: z.number(),
  ucus_suresi: z.number(),
});

export type Input_IND_296 = z.infer<typeof InputSchema_IND_296>;

export interface Output_IND_296 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_296(input: Input_IND_296): Output_IND_296 {
  const validData = InputSchema_IND_296.parse(input);
  const { referans_kalinlik, ucus_suresi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((2 * referans_kalinlik) / ucus_suresi) < 3000 || ((2 * referans_kalinlik) / ucus_suresi) > 6500) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME Section V / EN ISO 16810",
        message: "Kritik Kalibrasyon Hatası: Hesaplanan ses hızı, standart metallerin boyuna ses hızı aralığının (Çelik: ~5900 m/s, Alüminyum: ~6300 m/s) dışındadır. Prob yüzeye tam temas etmiyor, kuplant (Jel) eksik veya cihaz ayarları yanlıştır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
