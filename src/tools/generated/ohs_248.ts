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
 * ID: OHS_248
 * Name: Vinç/Sapan Kaldırma Güvenliği (WLL)
 */

export const InputSchema_OHS_248 = z.object({
  yuk_kutlesi: z.number(),
  bacak_sayisi: z.number(),
  sapan_acisi: z.number(),
});

export type Input_OHS_248 = z.infer<typeof InputSchema_OHS_248>;

export interface Output_OHS_248 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_OHS_248(input: Input_OHS_248): Output_OHS_248 {
  const validData = InputSchema_OHS_248.parse(input);
  const { yuk_kutlesi, bacak_sayisi, sapan_acisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (sapan_acisi < 45 && sapan_acisi >= 30) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASME B30.9 Sapan Emniyet Kriterleri",
        message: "Uyarı: Sapan açısı dar bölgededir (30-45 derece). Sapan bacaklarına binen yük, dikey kaldırmaya oranla yaklaşık %1.41 - %2 kat daha fazladır. Her bir sapan bacağının Güvenli Çalışma Yükü (WLL) bu çarpan dikkate alınarak seçilmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
