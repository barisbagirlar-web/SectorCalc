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
 * ID: PRO_115
 * Name: CNC Kılavuz Çekme (Tapping) Torku ve Senkronizasyon (VDI 3321)
 */

export const InputSchema_PRO_115 = z.object({
  tap_dia: z.number(),
  pitch: z.number(),
  kc: z.number(),
  rpm: z.number(),
  chuck_torque_limit: z.number(),
  hole_type: z.enum(["Kör Delik", "Açık (Boydan Boya) Delik"]),
});

export type Input_PRO_115 = z.infer<typeof InputSchema_PRO_115>;

export interface Output_PRO_115 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_115(input: Input_PRO_115): Output_PRO_115 {
  const validData = InputSchema_PRO_115.parse(input);
  const { tap_dia, pitch, kc, rpm, chuck_torque_limit, hole_type } = validData as any;
  
  const Torque_Nm = (kc * Math.pow(pitch, 2) * tap_dia) / 4000;
  const Torque_Peak = ((hole_type == 'Kör Delik') ? (Torque_Nm * 1.3) : (Torque_Nm));
  const Spindle_Power_kW = (Torque_Peak * rpm) / 9550;
  const Feed_Rate_mm_min = rpm * pitch;
  const Utilization_Pct = (Torque_Peak / chuck_torque_limit) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Torque_Peak > chuck_torque_limit) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sandvik Kılavuz Çekme (Tapping)",
        message: "Kritik Takım Kırılma Riski: İşlenen malzemenin gerektirdiği kesme torku, ER pens veya senkron tutucunun kayma (Slip) sınırını aşmaktadır. Kılavuz takım parçaya saplanacak ve anında kırılarak içinde kalacaktır. Rijit (Weldon vb.) tutucuya geçin."
      });
    }
  
  return {
    result: Utilization_Pct,
    smartWarnings
  };
}
