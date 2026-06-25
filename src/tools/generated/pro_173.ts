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
 * ID: PRO_173
 * Name: TEMA Isı Eşanjörü Boru Demeti Doğal Frekans Analizi
 */

export const InputSchema_PRO_173 = z.object({
  tube_outer_dia: z.number(),
  tube_wall_thickness: z.number(),
  support_span_length: z.number(),
  material_modulus_E: z.number(),
  material_density: z.number(),
  fluid_inside_density: z.number(),
  support_condition_factor: z.number(),
});

export type Input_PRO_173 = z.infer<typeof InputSchema_PRO_173>;

export interface Output_PRO_173 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_173(input: Input_PRO_173): Output_PRO_173 {
  const validData = InputSchema_PRO_173.parse(input);
  const { tube_outer_dia, tube_wall_thickness, support_span_length, material_modulus_E, material_density, fluid_inside_density, support_condition_factor } = validData as any;
  
  const D_outer_m = tube_outer_dia / 1000;
  const D_inner_m = (tube_outer_dia - (2 * tube_wall_thickness)) / 1000;
  const Tube_Inertia_I = (Math.PI / 64) * (Math.pow(D_outer_m, 4) - Math.pow(D_inner_m, 4));
  const Mass_Tube_kg_m = (Math.PI / 4) * (Math.pow(D_outer_m, 2) - Math.pow(D_inner_m, 2)) * material_density;
  const Mass_Fluid_kg_m = (Math.PI / 4) * Math.pow(D_inner_m, 2) * fluid_inside_density;
  const Total_Mass_kg_m = Mass_Tube_kg_m + Mass_Fluid_kg_m;
  const L_m = support_span_length / 1000;
  const Tube_Natural_Freq_Hz = support_condition_factor * Math.sqrt(((material_modulus_E * 1e9) * Tube_Inertia_I) / (Total_Mass_kg_m * Math.pow(L_m, 4)));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Tube_Natural_Freq_Hz < 20) {
      smartWarnings.push({
        severity: "WARNING",
        source: "TEMA Standartları (Section 5)",
        message: "Esneklik Uyarısı: Boru demeti doğal frekansı 20 Hz sınırının altındadır. Kabuk tarafındaki akış girdapları (Vortex shedding) boruları kolayca rezonansa sokabilir ve erken yorulma kırılmalarına yol açabilir. Destek aralığını (L) daraltın."
      });
    }
  
  return {
    result: Tube_Natural_Freq_Hz,
    smartWarnings
  };
}
