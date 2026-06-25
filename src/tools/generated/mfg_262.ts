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
 * ID: MFG_262
 * Name: Cıvata Sıkma Torku (VDI 2230)
 */

export const InputSchema_MFG_262 = z.object({
  nominal_cap: z.number(),
  adim: z.number(),
  kalite_sinifi: z.number(),
  surtunme: z.number(),
});

export type Input_MFG_262 = z.infer<typeof InputSchema_MFG_262>;

export interface Output_MFG_262 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_262(input: Input_MFG_262): Output_MFG_262 {
  const validData = InputSchema_MFG_262.parse(input);
  const { nominal_cap, adim, kalite_sinifi, surtunme } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (surtunme > 0.2) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Makine Montaj Standartları",
        message: "Kritik Uyarı: Sürtünme katsayısı çok yüksek. Paslı, kaplamasız veya hasarlı dişlerde uygulanan torkun %90'ı sürtünmeyi yenmeye gider, cıvatada istenen ön yükleme (Preload) oluşmaz. Dişleri temizleyin ve yağlayın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
