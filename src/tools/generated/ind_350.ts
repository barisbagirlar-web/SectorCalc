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
 * ID: IND_350
 * Name: Radyografik Muayene (RT) Poz Süresi Hesabı
 */

export const InputSchema_IND_350 = z.object({
  malzeme_kalinligi: z.number(),
  izotop_aktivite: z.number(),
  kaynak_film_mesafesi: z.number(),
});

export type Input_IND_350 = z.infer<typeof InputSchema_IND_350>;

export interface Output_IND_350 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_350(input: Input_IND_350): Output_IND_350 {
  const validData = InputSchema_IND_350.parse(input);
  const { malzeme_kalinligi, izotop_aktivite, kaynak_film_mesafesi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (malzeme_kalinligi > 75) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASME Section V Nondestructive Examination",
        message: "Uyarı: Çelik kalınlığı İridyum-192 (Ir-192) izotopunun penetrasyon sınırını (Maks 75mm) aşmaktadır. Çıkan röntgen filmi grafiğinde saçılma (Scattering) çok yüksek olacak ve iç süreksizlikler net görülemeyecektir. Kobalt-60 veya X-Ray cihazına geçin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
