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
 * ID: PRO_073
 * Name: Kompresör Hava Tankı (Receiver) Boyutlandırma
 */

export const InputSchema_PRO_073 = z.object({
  compressor_flow: z.number(),
  p_max: z.number(),
  p_min: z.number(),
  max_motor_starts: z.number(),
  surge_demand: z.number(),
  surge_duration: z.number(),
});

export type Input_PRO_073 = z.infer<typeof InputSchema_PRO_073>;

export interface Output_PRO_073 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_073(input: Input_PRO_073): Output_PRO_073 {
  const validData = InputSchema_PRO_073.parse(input);
  const { compressor_flow, p_max, p_min, max_motor_starts, surge_demand, surge_duration } = validData as any;
  
  const V_starts_Liters = (compressor_flow * 1.01325) / (4 * max_motor_starts * (p_max - p_min)) * 60;
  const V_surge_Liters = ((surge_demand - compressor_flow) * surge_duration * 1.01325) / (p_max - p_min);
  const Required_Tank_Volume = Math.max(V_starts_Liters, V_surge_Liters);
  const Cycle_Time_Mins = (Required_Tank_Volume * (p_max - p_min)) / (compressor_flow * 1.01325);
  const Actual_Motor_Starts_Per_Hr = 60 / Cycle_Time_Mins;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Actual_Motor_Starts_Per_Hr > max_motor_starts) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Elektrik Motorları Koruması",
        message: "Motor Yanma Riski: Tank kapasitesi, motorun saatte izin verilen maksimum kalkış sayısını aşmasına neden oluyor. Motor sargıları aşırı kalkış akımı (Inrush current) nedeniyle ısınıp yanacaktır. Tank hacmini acilen büyütün."
      });
    }
  
  return {
    result: Actual_Motor_Starts_Per_Hr,
    smartWarnings
  };
}
