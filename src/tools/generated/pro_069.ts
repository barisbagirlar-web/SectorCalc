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
 * ID: PRO_069
 * Name: Kaynak Mukavemeti ve Birleşik Gerilme (AWS D1.1)
 */

export const InputSchema_PRO_069 = z.object({
  leg_size: z.number(),
  weld_length: z.number(),
  load_shear: z.number(),
  moment_bend: z.number(),
  base_metal_yield: z.number(),
  electrode_tensile: z.number(),
  safety_factor: z.number(),
});

export type Input_PRO_069 = z.infer<typeof InputSchema_PRO_069>;

export interface Output_PRO_069 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_069(input: Input_PRO_069): Output_PRO_069 {
  const validData = InputSchema_PRO_069.parse(input);
  const { leg_size, weld_length, load_shear, moment_bend, base_metal_yield, electrode_tensile, safety_factor } = validData as any;
  
  const Throat_a = leg_size * 0.7071;
  const Effective_Area = Throat_a * weld_length;
  const Tau_Shear = load_shear / Effective_Area;
  const I_Weld = (Throat_a * Math.pow(weld_length, 3)) / 12;
  const Sigma_Bending = (moment_bend * (weld_length / 2)) / I_Weld;
  const Sigma_Combined = Math.sqrt(Math.pow(Sigma_Bending, 2) + 3 * Math.pow(Tau_Shear, 2));
  const Allowable_Stress_AWS = Math.min(0.3 * electrode_tensile, 0.4 * base_metal_yield);
  const Actual_SF = Allowable_Stress_AWS / Sigma_Combined;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Actual_SF < safety_factor) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AWS D1.1 Yapısal Kaynak Kodu",
        message: "Kritik Çökme Riski: Kaynak dikişi üzerindeki birleşik gerilme (Von Mises), hedeflenen güvenlik faktörünü karşılayamıyor. Yük altında dikiş KESİNLİKLE kökten yırtılacaktır. Bacak boyunu (z) büyütün veya kaynak tasarımını değiştirin."
      });
    }
  
  return {
    result: Actual_SF,
    smartWarnings
  };
}
