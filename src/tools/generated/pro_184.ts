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
 * ID: PRO_184
 * Name: Boru Hatlarında Su Koçu Akustik Sönümleme ve Kelepçe Statik Yükü
 */

export const InputSchema_PRO_184 = z.object({
  joukowsky_pressure_bar: z.number(),
  pipe_outer_dia: z.number(),
  pipe_wall_thickness: z.number(),
  clamp_spacing_m: z.number(),
  pipe_yield_strength: z.number(),
});

export type Input_PRO_184 = z.infer<typeof InputSchema_PRO_184>;

export interface Output_PRO_184 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_184(input: Input_PRO_184): Output_PRO_184 {
  const validData = InputSchema_PRO_184.parse(input);
  const { joukowsky_pressure_bar, pipe_outer_dia, pipe_wall_thickness, clamp_spacing_m, pipe_yield_strength } = validData as any;
  
  const P_surge_pa = joukowsky_pressure_bar * 100000;
  const Hoop_Stress_MPa = (P_surge_pa * pipe_outer_dia) / (2 * pipe_wall_thickness * 1000000);
  const Axial_Force_N = P_surge_pa * (Math.PI / 4) * Math.pow(pipe_outer_dia / 1000, 2);
  const Clamp_Static_Load_N = Axial_Force_N * clamp_spacing_m;
  const Safety_Factor_Pipe = pipe_yield_strength / Hoop_Stress_MPa;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Safety_Factor_Pipe < 1.5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME B31.3 Proses Borulama Kodları",
        message: "Kritik Boru Patlama Riski: Su koçu şok dalgasının yarattığı çevresel gerilme (Hoop Stress), boru akma sınırına tehlikeli derecede yaklaşmıştır (SF < 1.5). Hat ilk koç darbesinde dikiş yerlerinden yarılacaktır. Kelepçe aralığını daraltın veya sönümleyici (Surge arrester) ekleyin."
      });
    }
  
  return {
    result: Safety_Factor_Pipe,
    smartWarnings
  };
}
