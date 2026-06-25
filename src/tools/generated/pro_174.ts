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
 * ID: PRO_174
 * Name: TEMA Akış Kaynaklı Eşanjör Rezonans ve Akışkan Elastiği Sınırı
 */

export const InputSchema_PRO_174 = z.object({
  shell_fluid_velocity: z.number(),
  tube_outer_dia: z.number(),
  tube_natural_freq: z.number(),
  strouhal_number: z.number(),
  shell_fluid_density: z.number(),
  fluid_damping_ratio: z.number(),
  connors_constant: z.number(),
  total_mass_kg_m: z.number(),
});

export type Input_PRO_174 = z.infer<typeof InputSchema_PRO_174>;

export interface Output_PRO_174 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_174(input: Input_PRO_174): Output_PRO_174 {
  const validData = InputSchema_PRO_174.parse(input);
  const { shell_fluid_velocity, tube_outer_dia, tube_natural_freq, strouhal_number, shell_fluid_density, fluid_damping_ratio, connors_constant, total_mass_kg_m } = validData as any;
  
  const D_m = tube_outer_dia / 1000;
  const Vortex_Shedding_Freq_Fv = (strouhal_number * shell_fluid_velocity) / D_m;
  const Frequency_Ratio = Vortex_Shedding_Freq_Fv / tube_natural_freq;
  const Mass_Damping_Parameter = (2 * Math.PI * fluid_damping_ratio * total_mass_kg_m) / (shell_fluid_density * Math.pow(D_m, 2));
  const Critical_Fluidelastic_Velocity = connors_constant * tube_natural_freq * D_m * Math.sqrt(Mass_Damping_Parameter);
  const Fluidelastic_Instability_Ratio = shell_fluid_velocity / Critical_Fluidelastic_Velocity;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "TEMA Isı Değiştirici Akışkan Titreşimleri",
        message: "Kritik Akustik Rezonans: Girdap kopma frekansı, boru doğal frekansının %15 yakınlık bandına girmiştir. Borular şiddetli rezonans nedeniyle birbirine çarparak aşınacak ve boru tepsisinde (Baffle) kesilerek sistem felaketine yol açacaktır."
      });
    }

    if (Fluidelastic_Instability_Ratio >= 1.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Connors Kararsızlık Kriteri",
        message: "Akışkan Elastiği Kararsızlığı (FEI): Çapraz akış hızı kritik Connors sınırını aşmıştır. Borularda kendi kendini besleyen (Self-excited) yıkıcı genlikli salınımlar başlayacaktır; kabuk tarafı giriş debisini düşürün veya iç yönlendirici (Baffle) ekleyin."
      });
    }
  
  return {
    result: Fluidelastic_Instability_Ratio,
    smartWarnings
  };
}
