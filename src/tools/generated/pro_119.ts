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
 * ID: PRO_119
 * Name: Santrifüj Pompa Kavitasyon ve NPSH Analizi (API 610)
 */

export const InputSchema_PRO_119 = z.object({
  atm_pressure: z.number(),
  vapor_pressure: z.number(),
  density: z.number(),
  suction_head: z.number(),
  friction_loss: z.number(),
  npsh_r: z.number(),
});

export type Input_PRO_119 = z.infer<typeof InputSchema_PRO_119>;

export interface Output_PRO_119 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_119(input: Input_PRO_119): Output_PRO_119 {
  const validData = InputSchema_PRO_119.parse(input);
  const { atm_pressure, vapor_pressure, density, suction_head, friction_loss, npsh_r } = validData as any;
  
  const Head_Atm = (atm_pressure * 100000) / (density * 9.81);
  const Head_Vapor = (vapor_pressure * 100000) / (density * 9.81);
  const NPSH_Available = Head_Atm - Head_Vapor + suction_head - friction_loss;
  const NPSH_Margin = NPSH_Available - npsh_r;
  const NPSH_Ratio = NPSH_Available / npsh_r;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (NPSH_Ratio < 1.1) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "API 610 Pompa Standartları",
        message: "Kavitasyon Başlangıcı: Mevcut NPSH değeri, pompanın minimum ihtiyacına (NPSHr) tehlikeli düzeyde yaklaşmış veya altına inmiştir. Emme çarkında sıvı kaynayarak buhar kabarcıkları oluşturacak ve bu kabarcıklar çark yüzeyinde patlayarak pompayı parçalayacaktır (Erozyon/Kavitasyon)."
      });
    }
  
  return {
    result: NPSH_Ratio,
    smartWarnings
  };
}
