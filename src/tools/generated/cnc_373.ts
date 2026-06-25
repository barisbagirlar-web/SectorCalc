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
 * ID: CNC_373
 * Name: Derin Delik Delme (Gun Drilling) Parametreleri
 */

export const InputSchema_CNC_373 = z.object({
  matkap_capi: z.number(),
  delik_derinligi: z.number(),
  sogutma_basinci: z.number(),
});

export type Input_CNC_373 = z.infer<typeof InputSchema_CNC_373>;

export interface Output_CNC_373 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_373(input: Input_CNC_373): Output_CNC_373 {
  const validData = InputSchema_CNC_373.parse(input);
  const { matkap_capi, delik_derinligi, sogutma_basinci } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((delik_derinligi / matkap_capi) > 20 && sogutma_basinci < 50) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "VDI 3208 / Botek Derin Delme Standartları",
        message: "Kritik Takım Reddi: L/D (Boy/Çap) oranı 20'yi aşmaktadır. 50 Bar altındaki soğutma sıvıları bu derinlikte talaşı tahliye edemez (Chip Evacuation Failure). Talaş matkabın etrafına sarılacak, kesme bölgesinde ısı 800°C'yi aşacak ve takım KESİNLİKLE parçanın içinde kaynayarak kırılacaktır. Minimum 70+ Bar HPC sistemi şarttır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
