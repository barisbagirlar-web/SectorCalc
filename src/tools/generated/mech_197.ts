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
 * ID: MECH_197
 * Name: Düz Dişli (Lewis Formülü)
 */

export const InputSchema_MECH_197 = z.object({
  yuk: z.number(),
  modul: z.number(),
  genislik: z.number(),
  form_faktoru: z.number(),
});

export type Input_MECH_197 = z.infer<typeof InputSchema_MECH_197>;

export interface Output_MECH_197 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_197(input: Input_MECH_197): Output_MECH_197 {
  const validData = InputSchema_MECH_197.parse(input);
  const { yuk, modul, genislik, form_faktoru } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (genislik / modul > 16 || genislik / modul < 8) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AGMA Dişli Tasarımı",
        message: "Uyarı: Diş genişliği / Modül oranı standart dışıdır (Genellikle 8 ile 12 arası tavsiye edilir). Genişlik çok büyükse yük diş boyunca homojen dağılmaz, çok darsa diş çabuk kırılır."
      });
    }

    if (true) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Dinamik Yük Analizi",
        message: "Kritik Uyarı: Lewis formülü SADECE statik kök eğilme gerilmesini ölçer. Yüksek devirlerde dinamik hız katsayısı (Barth faktörü) ve yüzey temas yorulması (Hertz/Buckingham pitting gerilmesi) hesaplanmadan dişli çark üretilemez."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
