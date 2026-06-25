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
 * ID: PRO_144
 * Name: Su Koçu Darbesi (Water Hammer) Joukowsky Şok Basıncı
 */

export const InputSchema_PRO_144 = z.object({
  fluid_density: z.number(),
  bulk_modulus_K: z.number(),
  pipe_E: z.number(),
  pipe_dia_D: z.number(),
  pipe_thickness_t: z.number(),
  fluid_velocity_V: z.number(),
  pipe_length_L: z.number(),
  valve_close_time_tc: z.number(),
  static_pressure: z.number(),
});

export type Input_PRO_144 = z.infer<typeof InputSchema_PRO_144>;

export interface Output_PRO_144 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_144(input: Input_PRO_144): Output_PRO_144 {
  const validData = InputSchema_PRO_144.parse(input);
  const { fluid_density, bulk_modulus_K, pipe_E, pipe_dia_D, pipe_thickness_t, fluid_velocity_V, pipe_length_L, valve_close_time_tc, static_pressure } = validData as any;
  
  const Wave_Celerity_a = Math.sqrt((bulk_modulus_K / fluid_density) / (1 + (bulk_modulus_K * pipe_dia_D) / (pipe_E * pipe_thickness_t)));
  const Critical_Time_tc_crit = (2 * pipe_length_L) / Wave_Celerity_a;
  const Closure_Type = ((valve_close_time_tc <= Critical_Time_tc_crit) ? ('Ani (Sudden)') : ('Yavaş (Gradual)'));
  const Delta_P_Joukowsky_Pa = fluid_density * Wave_Celerity_a * fluid_velocity_V;
  const Delta_P_Gradual_Pa = Delta_P_Joukowsky_Pa * (Critical_Time_tc_crit / valve_close_time_tc);
  const Actual_Surge_Pressure_Pa = ((Closure_Type == 'Ani (Sudden)') ? (Delta_P_Joukowsky_Pa) : (Delta_P_Gradual_Pa));
  const Surge_Pressure_Bar = Actual_Surge_Pressure_Pa / 100000;
  const Total_Max_Pressure_Bar = static_pressure + Surge_Pressure_Bar;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Closure_Type === 'Ani (Sudden)') {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Hidrolik Geçici Rejim (Transient)",
        message: "Tahribat Riski: Vananın kapanma süresi, basınç dalgasının gidiş-dönüş süresinden (Kritik Zaman) daha kısadır. Hatta %100 Joukowsky şok dalgası oluşmaktadır. Total Max Pressure hattın PN (Nominal Basınç) sınıfını aşıyorsa contalar patlayacak ve flanşlar yarılacaktır. Yavaşlatmalı vana/Aktüatör kullanın."
      });
    }
  
  return {
    result: Total_Max_Pressure_Bar,
    smartWarnings
  };
}
