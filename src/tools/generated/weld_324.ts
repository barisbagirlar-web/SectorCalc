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
 * ID: WELD_324
 * Name: Kaynak T8/5 Soğuma Süresi (Cooling Time)
 */

export const InputSchema_WELD_324 = z.object({
  isi_girdisi: z.number(),
  parca_kalinligi: z.number(),
  on_isitma: z.number(),
});

export type Input_WELD_324 = z.infer<typeof InputSchema_WELD_324>;

export interface Output_WELD_324 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_WELD_324(input: Input_WELD_324): Output_WELD_324 {
  const validData = InputSchema_WELD_324.parse(input);
  const { isi_girdisi, parca_kalinligi, on_isitma } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (true) {
      smartWarnings.push({
        severity: "INFO",
        source: "EN 1011-2 Kaynak Kodları",
        message: "Bilgi: T8/5 süresi (800°C'den 500°C'ye düşüş) 5 saniyenin altında çıkarsa yapı çok hızlı soğuyor demektir. C-Mn çeliklerinde sert Martenzit fazı oluşarak yapıyı gevrekleştirir (Hidrojen çatlağı riski artar). Ön ısıtmayı yükseltin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
