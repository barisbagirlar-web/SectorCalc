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
 * ID: PRO_159
 * Name: Kaynaklı İmalat Kalıcı Çarpılma (Transverse Shrinkage) Tahmini
 */

export const InputSchema_PRO_159 = z.object({
  weld_length: z.number(),
  plate_thickness: z.number(),
  weld_cross_section: z.number(),
  heat_input: z.number(),
  material_exp_coeff: z.number(),
  weld_passes: z.number(),
});

export type Input_PRO_159 = z.infer<typeof InputSchema_PRO_159>;

export interface Output_PRO_159 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_159(input: Input_PRO_159): Output_PRO_159 {
  const validData = InputSchema_PRO_159.parse(input);
  const { weld_length, plate_thickness, weld_cross_section, heat_input, material_exp_coeff, weld_passes } = validData as any;
  
  const Inherent_Shrinkage_Force_N = 1000 * heat_input * material_exp_coeff * 200000;
  const Transverse_Shrinkage_mm = (0.2 * weld_cross_section) / plate_thickness;
  const Cumulative_Shrinkage_mm = Transverse_Shrinkage_mm * Math.pow(weld_passes, 0.8);
  const Angular_Distortion_Rad = (0.012 * heat_input) / Math.pow(plate_thickness, 2);
  const Angular_Distortion_Deg = Angular_Distortion_Rad * (180 / Math.PI);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Cumulative_Shrinkage_mm > 3.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AWS D1.1 Yapısal Toleranslar",
        message: "Boyutsal Red Garantisi: Enine çekme (Shrinkage) 3 mm'nin üzerindedir. Kaynak sonrası parça boyutsal toleransların tamamen dışına çıkacaktır. Ters sehim (Pre-setting) vermek, paso sayısını azaltmak veya rijit fikstürleme (Jig) kullanmak zorunludur."
      });
    }
  
  return {
    result: Angular_Distortion_Deg,
    smartWarnings
  };
}
