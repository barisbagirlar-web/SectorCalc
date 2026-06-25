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
 * ID: MET_322
 * Name: Gerçek Konum Toleransı (True Position)
 */

export const InputSchema_MET_322 = z.object({
  x_sapma: z.number(),
  y_sapma: z.number(),
  izin_verilen_tolerans: z.number(),
});

export type Input_MET_322 = z.infer<typeof InputSchema_MET_322>;

export interface Output_MET_322 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MET_322(input: Input_MET_322): Output_MET_322 {
  const validData = InputSchema_MET_322.parse(input);
  const { x_sapma, y_sapma, izin_verilen_tolerans } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((2 * SQRT((x_sapma * x_sapma) + (y_sapma * y_sapma))) > izin_verilen_tolerans) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME Y14.5 GD&T Standartları",
        message: "Kritik Kalite Reddi: Hesaplanılan gerçek konum sapması, teknik resimde verilen dairesel tolerans alanını aşmaktadır. Karşı parça ile cıvata/pim montajı gerçekleşemez (Interference). Parça hurdaya (Scrap) ayrılmalı veya yeniden işlenmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
