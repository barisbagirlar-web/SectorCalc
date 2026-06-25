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
 * ID: PRO_050
 * Name: Doğal Havalandırma (ACH) Isıl Baca Optimizasyonu
 */

export const InputSchema_PRO_050 = z.object({
  vol: z.number(),
  t_in: z.number(),
  t_out: z.number(),
  target_ach: z.number(),
  cd: z.number(),
  delta_h: z.number(),
});

export type Input_PRO_050 = z.infer<typeof InputSchema_PRO_050>;

export interface Output_PRO_050 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_050(input: Input_PRO_050): Output_PRO_050 {
  const validData = InputSchema_PRO_050.parse(input);
  const { vol, t_in, t_out, target_ach, cd, delta_h } = validData as any;
  
  const Q_required_m3_s = (vol * target_ach) / 3600;
  const Delta_T = t_in - t_out;
  const T_in_K = t_in + 273.15;
  const A_vent_required = Q_required_m3_s / (cd * Math.sqrt(2 * 9.81 * delta_h * Delta_T / T_in_K));
  const A_lower_vent = A_vent_required * 0.55;
  const A_upper_vent = A_vent_required * 0.45;
  const Ventilation_Flow_m3_hr = Q_required_m3_s * 3600;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (target_ach > 20) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASHRAE Havalandırma Prensipleri",
        message: "Uyarı: Çok yüksek ACH (Hava Değişim) hedeflenmektedir. Bu hıza ulaşmak için devasa menfezler gerekecektir; hesaplanan rüzgarsız (Sadece ısıl baca) model yerine cebri (Fanlı) çekiş sistemlerine geçilmelidir."
      });
    }
  
  return {
    result: Ventilation_Flow_m3_hr,
    smartWarnings
  };
}
