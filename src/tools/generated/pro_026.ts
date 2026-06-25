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
 * ID: PRO_026
 * Name: TOC Darboğaz Kapasite Artışı ROI Analizi
 */

export const InputSchema_PRO_026 = z.object({
  takt_time_min: z.number(),
  bottleneck_ct_min: z.number(),
  target_ct_min: z.number(),
  available_time_min: z.number(),
  unit_contrib_margin: z.number(),
  upgrade_capex: z.number(),
  wacc: z.number(),
  life_years: z.number(),
});

export type Input_PRO_026 = z.infer<typeof InputSchema_PRO_026>;

export interface Output_PRO_026 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_026(input: Input_PRO_026): Output_PRO_026 {
  const validData = InputSchema_PRO_026.parse(input);
  const { takt_time_min, bottleneck_ct_min, target_ct_min, available_time_min, unit_contrib_margin, upgrade_capex, wacc, life_years } = validData as any;
  
  const Current_Annual_Output = available_time_min / bottleneck_ct_min;
  const Target_Annual_Output = available_time_min / target_ct_min;
  const Theoretical_Demand_Max = available_time_min / takt_time_min;
  const Realized_Output = Math.min(Target_Annual_Output, Theoretical_Demand_Max);
  const Additional_Units = Realized_Output - Current_Annual_Output;
  const Annual_Throughput_Gain = Additional_Units * unit_contrib_margin;
  const Project_NPV = (Annual_Throughput_Gain * ((1 - Math.pow(1 + (wacc/100), -life_years)) / (wacc/100))) - upgrade_capex;
  const Payback_Months = (upgrade_capex / Annual_Throughput_Gain) * 12;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (target_ct_min < takt_time_min) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Goldratt Kısıtlar Teorisi (TOC)",
        message: "Yatırım İsrafı Uyarısı: Hedeflenen çevrim süresi müşteri Takt süresinin altındadır. Sistem müşterinin talep ettiğinden daha hızlı üretemeyeceği için (Aşırı üretim israfı), bu makineyi Takt süresinden daha fazla hızlandırmak için harcanan her kuruş çöpe gidecektir."
      });
    }
  
  return {
    result: Payback_Months,
    smartWarnings
  };
}
