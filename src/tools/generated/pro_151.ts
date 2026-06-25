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
 * ID: PRO_151
 * Name: CNC İş Mili (Spindle) Termal Uzama ve Rulman Ön Yük Kaybı
 */

export const InputSchema_PRO_151 = z.object({
  spindle_rpm: z.number(),
  bearing_pitch_dia: z.number(),
  shaft_length: z.number(),
  temp_delta: z.number(),
  thermal_exp_coeff: z.number(),
  initial_preload: z.number(),
  stiffness_axial: z.number(),
});

export type Input_PRO_151 = z.infer<typeof InputSchema_PRO_151>;

export interface Output_PRO_151 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_151(input: Input_PRO_151): Output_PRO_151 {
  const validData = InputSchema_PRO_151.parse(input);
  const { spindle_rpm, bearing_pitch_dia, shaft_length, temp_delta, thermal_exp_coeff, initial_preload, stiffness_axial } = validData as any;
  
  const Speed_Factor_ndm = spindle_rpm * bearing_pitch_dia;
  const Thermal_Elongation_um = shaft_length * 1000 * thermal_exp_coeff * temp_delta;
  const Preload_Loss_N = Thermal_Elongation_um * stiffness_axial;
  const Residual_Preload_N = initial_preload - Preload_Loss_N;
  const Preload_Loss_Pct = (Preload_Loss_N / initial_preload) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Speed_Factor_ndm > 1000000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "SKF Yüksek Hız Sınırları",
        message: "Ultra Yüksek Hız (n×dm) Sınırı: Rulman hız faktörü 1.000.000 sınırını aşmıştır. Standart gres yağlama veya çelik bilye kullanılamaz; seramik (Hibrit) bilye ve hava-yağ (Oil-air) yağlama sistemine geçiş teknik zorunluluktur."
      });
    }

    if (Residual_Preload_N <= 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Takım Tezgahı Fiziği",
        message: "Kritik Rijitlik Kaybı: Termal uzama, rulmanın başlangıç ön yükünü (Preload) tamamen yutmuştur. İş mili eksenel olarak boşluğa (Clearance) düşmüş olup, kesim esnasında devasa tırlama (Chatter) ve takım kırılması kaçınılmazdır."
      });
    }
  
  return {
    result: Preload_Loss_Pct,
    smartWarnings
  };
}
