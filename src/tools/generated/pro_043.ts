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
 * ID: PRO_043
 * Name: Talaşlı İmalat Kesme Dinamikleri ve Spindle Gücü
 */

export const InputSchema_PRO_043 = z.object({
  tool_dia: z.number(),
  flutes: z.number(),
  vc: z.number(),
  fz: z.number(),
  ap: z.number(),
  ae: z.number(),
  kc1: z.number(),
  mc: z.number(),
  spindle_eff: z.number(),
  max_spindle_kw: z.number(),
});

export type Input_PRO_043 = z.infer<typeof InputSchema_PRO_043>;

export interface Output_PRO_043 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_043(input: Input_PRO_043): Output_PRO_043 {
  const validData = InputSchema_PRO_043.parse(input);
  const { tool_dia, flutes, vc, fz, ap, ae, kc1, mc, spindle_eff, max_spindle_kw } = validData as any;
  
  const n_rpm = (1000 * vc) / (Math.PI * tool_dia);
  const Vf_feed = fz * flutes * n_rpm;
  const h_m = fz * Math.sqrt(ae / tool_dia);
  const kc_actual = kc1 / Math.pow(h_m, mc);
  const Fc_tangential = kc_actual * ap * fz * (ae / tool_dia) * flutes;
  const Tc_torque = (Fc_tangential * tool_dia) / 2000;
  const Pc_net = (Fc_tangential * vc) / 60000;
  const P_motor_req = Pc_net / (spindle_eff / 100);
  const MRR = (ap * ae * Vf_feed) / 1000;
  const Ra_theoretical = (Math.pow(fz, 2) * 1000) / (8 * (tool_dia / 2));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (P_motor_req > max_spindle_kw) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sandvik İşleme Ekonomisi",
        message: "Kritik Makine Limiti: Gerekli motor gücü, makinenin spindle kapasitesini aşıyor. Makine kesim sırasında bayılacak (Stall) ve takım KESİNLİKLE parçaya saplanıp kırılacaktır. Ap, Ae veya Vc değerlerini düşürün."
      });
    }
  
  return {
    result: Ra_theoretical,
    smartWarnings
  };
}
