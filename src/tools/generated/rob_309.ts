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
 * ID: ROB_309
 * Name: Robot Eksen Momenti (Payload Overload)
 */

export const InputSchema_ROB_309 = z.object({
  tutucu_agirlik: z.number(),
  parca_agirlik: z.number(),
  agirlik_merkezi: z.number(),
  maks_moment: z.number(),
});

export type Input_ROB_309 = z.infer<typeof InputSchema_ROB_309>;

export interface Output_ROB_309 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ROB_309(input: Input_ROB_309): Output_ROB_309 {
  const validData = InputSchema_ROB_309.parse(input);
  const { tutucu_agirlik, parca_agirlik, agirlik_merkezi, maks_moment } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((tutucu_agirlik + parca_agirlik) * 9.81 * agirlik_merkezi) > maks_moment) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "KUKA / FANUC Robotik Dinamikleri",
        message: "Kritik Çarpışma/Servo Hatası: Tutucu ve parçanın yarattığı moment, robot bilek ekseninin (J4/J5/J6) maksimum kapasitesini aşıyor. Robot statik olarak yükü kaldırsa bile, yüksek hızlı yörünge (Trajectory) hareketlerinde eksen düşecek veya servo motor aşırı akım (Overcurrent) hatası verecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
