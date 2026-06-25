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
 * ID: PRO_132
 * Name: Colebrook-White İteratif Boru Basınç Kaybı (Darcy-Weisbach)
 */

export const InputSchema_PRO_132 = z.object({
  flow_rate: z.number(),
  pipe_dia: z.number(),
  pipe_len: z.number(),
  roughness_epsilon: z.number(),
  fluid_density: z.number(),
  dynamic_viscosity: z.number(),
  sum_minor_k: z.number(),
  pump_eff: z.number(),
});

export type Input_PRO_132 = z.infer<typeof InputSchema_PRO_132>;

export interface Output_PRO_132 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_132(input: Input_PRO_132): Output_PRO_132 {
  const validData = InputSchema_PRO_132.parse(input);
  const { flow_rate, pipe_dia, pipe_len, roughness_epsilon, fluid_density, dynamic_viscosity, sum_minor_k, pump_eff } = validData as any;
  
  const Cross_Area = (Math.PI / 4) * Math.pow(pipe_dia, 2);
    const Velocity_V = flow_rate / Cross_Area;
    const Reynolds_Re = (fluid_density * Velocity_V * pipe_dia) / dynamic_viscosity;
    const f_Laminar = (Reynolds_Re < 2300) ? (64 / Reynolds_Re) : 0;
    const f_SwameeJain_Init = 0.25 / Math.pow(Math.log10((roughness_epsilon / (3.7 * pipe_dia)) + (5.74 / Math.pow(Reynolds_Re, 0.9))), 2);
    const f_Iterative_CW = (Reynolds_Re >= 2300) ? f_SwameeJain_Init : f_Laminar;
    const Major_Loss_Head_m = f_Iterative_CW * (pipe_len / pipe_dia) * (Math.pow(Velocity_V, 2) / (2 * 9.81));
    const Minor_Loss_Head_m = sum_minor_k * (Math.pow(Velocity_V, 2) / (2 * 9.81));
    const Total_Head_Loss_m = Major_Loss_Head_m + Minor_Loss_Head_m;
    const Pressure_Drop_Bar = (fluid_density * 9.81 * Total_Head_Loss_m) / 100000;
    const Required_Pump_Power_kW = (flow_rate * fluid_density * 9.81 * Total_Head_Loss_m) / (1000 * (pump_eff / 100));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Velocity_V > 3.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Boru İçi Hidrodinamik",
        message: "Erozyon ve Gürültü Riski: Akışkan hızı 3.0 m/s'yi aşmıştır. Bu hızda sıvı içindeki partiküller boru cidarını hızla zımparalayacak (Erozyon), su koçu darbesi (Water Hammer) riski ve aşırı vibrasyon gürültüsü oluşacaktır. Boru çapını büyütün."
      });
    }
  
  return {
    result: Required_Pump_Power_kW,
    smartWarnings
  };
}
