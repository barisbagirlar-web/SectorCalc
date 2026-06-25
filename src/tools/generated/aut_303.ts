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
 * ID: AUT_303
 * Name: Servo Motor Atalet Oranı (Inertia Mismatch)
 */

export const InputSchema_AUT_303 = z.object({
  motor_ataleti: z.number(),
  yuk_ataleti: z.number(),
});

export type Input_AUT_303 = z.infer<typeof InputSchema_AUT_303>;

export interface Output_AUT_303 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_AUT_303(input: Input_AUT_303): Output_AUT_303 {
  const validData = InputSchema_AUT_303.parse(input);
  const { motor_ataleti, yuk_ataleti } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((yuk_ataleti / motor_ataleti) > 10) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Servo Tuning Standartları",
        message: "Kritik Tasarım Hatası: Atalet oranı 10:1'i aşmaktadır. Servo motor bu yükü ani durduramayacak (Overshoot) ve sistemde şiddetli bir sarsıntı/ötme (Resonance) yaşanacaktır. PID kazançları ayarlanamaz. Redüktör tahvil oranını artırarak yük ataletini düşürün."
      });
    }

    if ((yuk_ataleti / motor_ataleti) > 5 && (yuk_ataleti / motor_ataleti) <= 10) {
      smartWarnings.push({
        severity: "WARNING",
        source: "CNC ve Hassas Pozisyonlama",
        message: "Uyarı: Atalet oranı 5:1 ile 10:1 arasındadır. Konveyör veya yavaş paketleme makineleri için kabul edilebilir olsa da, yüksek ivmeli (High-Dynamic) CNC eksenlerinde profil hatasına ve yüzey bozukluklarına neden olur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
