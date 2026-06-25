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
 * ID: CNC_305
 * Name: Step Motor Doğrusal Çözünürlük
 */

export const InputSchema_CNC_305 = z.object({
  adim_acisi: z.number(),
  mikro_adim: z.number(),
  mil_hatvesi: z.number(),
});

export type Input_CNC_305 = z.infer<typeof InputSchema_CNC_305>;

export interface Output_CNC_305 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_305(input: Input_CNC_305): Output_CNC_305 {
  const validData = InputSchema_CNC_305.parse(input);
  const { adim_acisi, mikro_adim, mil_hatvesi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (mikro_adim > 32) {
      smartWarnings.push({
        severity: "INFO",
        source: "Hareket Kontrol Fiziği",
        message: "Bilgi: Mikro adım (Microstepping) değerini 32'nin üzerine çıkarmak teorik çözünürlüğü artırsa da, step motorun tutma torkunu (Holding Torque) dramatik şekilde düşürür. Eksen mekanik direncini yenemezse adım kaçırmalar (Lost Steps) başlar."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
