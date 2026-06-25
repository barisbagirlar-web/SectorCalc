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
 * ID: PRO_141
 * Name: HSM Talaş İnceltme (Chip Thinning) ve İlerleme Kompanzasyonu
 */

export const InputSchema_PRO_141 = z.object({
  tool_dia: z.number(),
  radial_doc: z.number(),
  base_fz: z.number(),
  flutes: z.number(),
  spindle_rpm: z.number(),
});

export type Input_PRO_141 = z.infer<typeof InputSchema_PRO_141>;

export interface Output_PRO_141 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_141(input: Input_PRO_141): Output_PRO_141 {
  const validData = InputSchema_PRO_141.parse(input);
  const { tool_dia, radial_doc, base_fz, flutes, spindle_rpm } = validData as any;
  
  const Ratio_ae_Dc = radial_doc / tool_dia;
  const Chip_Thinning_Factor = ((radial_doc < (tool_dia / 2)) ? (Math.sqrt(tool_dia / radial_doc)) : (1.0));
  const Compensated_fz = base_fz * Chip_Thinning_Factor;
  const Actual_Max_Chip_Thickness_hex = ((radial_doc < (tool_dia / 2)) ? (Compensated_fz * Math.sqrt(radial_doc / tool_dia)) : (Compensated_fz));
  const Base_FeedRate_Vf0 = base_fz * flutes * spindle_rpm;
  const Compensated_FeedRate_Vfc = Compensated_fz * flutes * spindle_rpm;
  const Productivity_Gain_Pct = ((Compensated_FeedRate_Vfc / Base_FeedRate_Vf0) - 1) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sandvik Coromant HSM",
        message: "Takım Aşınma Riski: Radyal dalma çok düşük. Talaş inceltme katsayısını (Chip Thinning Factor) uygulamayıp ilerlemeyi (Vf) artırmazsanız, takım kesmek yerine 'sürtünme (rubbing)' yapacaktır. Kesici kenar anında yanar ve iş sertleşmesi (Work hardening) oluşur."
      });
    }
  
  return {
    result: Productivity_Gain_Pct,
    smartWarnings
  };
}
