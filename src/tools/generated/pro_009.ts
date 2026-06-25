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
 * ID: PRO_009
 * Name: Basınçlı Kap Et Kalınlığı (İnce Cidar Testli)
 */

export const InputSchema_PRO_009 = z.object({
  p: z.number(),
  ri: z.number(),
  head: z.enum(["Silindirik", "Küresel", "Elipsoidal"]),
  s: z.number(),
  e: z.number(),
  ca: z.number(),
});

export type Input_PRO_009 = z.infer<typeof InputSchema_PRO_009>;

export interface Output_PRO_009 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_009(input: Input_PRO_009): Output_PRO_009 {
  const validData = InputSchema_PRO_009.parse(input);
  const { p, ri, head, s, e, ca } = validData as any;
  
  const t_shell = (p * ri) / ((s * e) - (0.6 * p)) + ca;
  const t_sphere = (p * ri) / ((2 * s * e) - (0.2 * p)) + ca;
  const t_ellip = (p * (ri * 2)) / ((2 * s * e) - (0.2 * p)) + ca;
  const t_selected = ((head == 'Silindirik') ? (t_shell) : (((head  === 'Küresel') ? (t_sphere) : (t_ellip))));
  const MAWP = (s * e * (t_selected - ca)) / (ri + (0.6 * (t_selected - ca)));
  const HydroTest = 1.3 * MAWP;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ca === 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "ASME Kuralı",
        message: "Korozyon payı 0 girildi, kap zamanla delinecektir."
      });
    }
  
  return {
    result: HydroTest,
    smartWarnings
  };
}
