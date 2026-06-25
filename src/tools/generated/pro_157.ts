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
 * ID: PRO_157
 * Name: Titreşimli Cıvata Gevşemesi (Junker Testi) ve Ön Yük Kaybı
 */

export const InputSchema_PRO_157 = z.object({
  bolt_dia: z.number(),
  initial_preload: z.number(),
  transverse_displacement: z.number(),
  vibration_cycles: z.number(),
  friction_thread: z.number(),
  friction_head: z.number(),
  anti_loosening_factor: z.number(),
});

export type Input_PRO_157 = z.infer<typeof InputSchema_PRO_157>;

export interface Output_PRO_157 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_157(input: Input_PRO_157): Output_PRO_157 {
  const validData = InputSchema_PRO_157.parse(input);
  const { bolt_dia, initial_preload, transverse_displacement, vibration_cycles, friction_thread, friction_head, anti_loosening_factor } = validData as any;
  
  const Self_Loosening_Threshold_mm = (friction_thread * bolt_dia) / 2;
  const Slip_Condition = ((transverse_displacement > Self_Loosening_Threshold_mm) ? (1) : (0));
  const Preload_Loss_Rate_Per_Cycle = (transverse_displacement / bolt_dia) * (1 / (friction_thread + friction_head)) * anti_loosening_factor * 0.001;
  const Total_Preload_Loss_kN = Slip_Condition * initial_preload * (1 - Math.exp(-Preload_Loss_Rate_Per_Cycle * vibration_cycles));
  const Remaining_Preload_kN = initial_preload - Total_Preload_Loss_kN;
  const Remaining_Preload_Pct = (Remaining_Preload_kN / initial_preload) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "DIN 65151 Junker Test Standartları",
        message: "Kritik Çözülme Riski: Yanal titreşim genliği, cıvatanın kendiliğinden gevşeme eşiğini aşmıştır (Makro-kayma gerçekleşiyor). Sıkma kuvveti çok hızlı düşmektedir. Standart pul yerine Tırtıllı/Kamalı pul (Wedge-locking washer) kullanımı veya kimyasal sabitleyici (Loctite) zorunludur."
      });
    }
  
  return {
    result: Remaining_Preload_Pct,
    smartWarnings
  };
}
