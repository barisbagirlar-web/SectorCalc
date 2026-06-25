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
 * ID: PRO_046
 * Name: Pad Media Psikrometrik ve Basınç Düşümü Analizi
 */

export const InputSchema_PRO_046 = z.object({
  pad_thickness: z.number(),
  air_velocity: z.number(),
  pad_area: z.number(),
  t_db: z.number(),
  rh_in: z.number(),
  p_atm: z.number(),
});

export type Input_PRO_046 = z.infer<typeof InputSchema_PRO_046>;

export interface Output_PRO_046 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_046(input: Input_PRO_046): Output_PRO_046 {
  const validData = InputSchema_PRO_046.parse(input);
  const { pad_thickness, air_velocity, pad_area, t_db, rh_in, p_atm } = validData as any;
  
  const Pws_in = 6.112 * Math.exp((17.67 * t_db) / (t_db + 243.5));
  const Pv_in = Pws_in * (rh_in / 100);
  const W_in = 0.622 * (Pv_in / (p_atm - Pv_in));
  const T_wb_approx = t_db * ATAN(0.151977 * Math.sqrt(rh_in + 8.313659)) + ATAN(t_db + rh_in) - ATAN(rh_in - 1.676331) + 0.00391838 * Math.pow(rh_in, 1.5) * ATAN(0.023101 * rh_in) - 4.686035;
  const Eff_Sat = (95 - (air_velocity * 10)) * (pad_thickness / 150);
  const T_out_db = t_db - (Eff_Sat / 100) * (t_db - T_wb_approx);
  const Delta_T = t_db - T_out_db;
  const Pws_out = 6.112 * Math.exp((17.67 * T_out_db) / (T_out_db + 243.5));
  const Q_air = air_velocity * pad_area * 3600;
  const CoolingCapacity_kW = Q_air * 1.2 * 1.006 * Delta_T / 3600;
  const PressureDrop_Pa = (air_velocity * 15) * (pad_thickness / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (air_velocity > 3.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASHRAE Soğutma Standartları",
        message: "Uyarı: Hava hızı 3.0 m/s'yi aşıyor. Bu hızda sistem 'Su Sürüklenmesi (Water Carry-over)' yaşayacak ve tesis içine su damlacıkları püskürterek korozyon/elektrik risklerine yol açacaktır."
      });
    }
  
  return {
    result: PressureDrop_Pa,
    smartWarnings
  };
}
