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
 * ID: PRO_116
 * Name: CMM Prob (Stylus) Bükülme ve Ölçüm Belirsizliği (ISO 10360)
 */

export const InputSchema_PRO_116 = z.object({
  stylus_length: z.number(),
  stylus_dia: z.number(),
  material_E: z.number(),
  trigger_force: z.number(),
  temp_variation: z.number(),
  expansion_coeff: z.number(),
  part_tolerance: z.number(),
});

export type Input_PRO_116 = z.infer<typeof InputSchema_PRO_116>;

export interface Output_PRO_116 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_116(input: Input_PRO_116): Output_PRO_116 {
  const validData = InputSchema_PRO_116.parse(input);
  const { stylus_length, stylus_dia, material_E, trigger_force, temp_variation, expansion_coeff, part_tolerance } = validData as any;
  
  const Inertia_I = (Math.PI * Math.pow(stylus_dia, 4)) / 64;
  const Bending_Deflection_mm = (trigger_force * Math.pow(stylus_length, 3)) / (3 * (material_E * 1000) * Inertia_I);
  const Bending_Error_um = Bending_Deflection_mm * 1000;
  const Temp_Error_um = (stylus_length / 1000) * expansion_coeff * temp_variation;
  const Combined_Error_um = Math.sqrt(Math.pow(Bending_Error_um, 2) + Math.pow(Temp_Error_um, 2));
  const TUR = part_tolerance / Combined_Error_um;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (TUR < 4) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 10360 Metroloji Standardı",
        message: "Test Belirsizlik İhlali: CMM'in prob esnemesi ve ısıl genleşmeden kaynaklanan ölçüm hatası, parçanın toleransına göre çok yüksektir (TUR < 4). Hatalı ölçüm (False Accept/Reject) riski mevcuttur. Daha kalın veya karbon-fiber bir prob gövdesi kullanın."
      });
    }
  
  return {
    result: TUR,
    smartWarnings
  };
}
