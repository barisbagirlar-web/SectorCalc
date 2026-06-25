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
 * ID: CIV_266
 * Name: Beton Hacmi ve Reçetesi (Su/Çimento Oranı)
 */

export const InputSchema_CIV_266 = z.object({
  hacim: z.number(),
  cimen_dozaj: z.number(),
  su_cimento_orani: z.number(),
});

export type Input_CIV_266 = z.infer<typeof InputSchema_CIV_266>;

export interface Output_CIV_266 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_266(input: Input_CIV_266): Output_CIV_266 {
  const validData = InputSchema_CIV_266.parse(input);
  const { hacim, cimen_dozaj, su_cimento_orani } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (su_cimento_orani > 0.55) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ACI 318 / TS EN 206 Betonarme Yapılar",
        message: "Kritik Uyarı: Su/Çimento (W/C) oranı 0.55'in üzerindedir. Beton işlenebilirliği artsa da, bu kadar fazla su betonun basınç dayanımını ciddi şekilde düşürecek (C20 sınıfı altına itebilir), geçirimliliği artıracak ve büzülme/çatlama (Shrinkage) riskini patlatacaktır. Akışkanlaştırıcı katkı (Admixture) kullanın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
