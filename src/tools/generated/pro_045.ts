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
 * ID: PRO_045
 * Name: Kondenser Adiyabatik Ön Soğutma Enerji Tasarrufu
 */

export const InputSchema_PRO_045 = z.object({
  chiller_cap: z.number(),
  current_cop: z.number(),
  t_dry: z.number(),
  t_wet: z.number(),
  pad_eff: z.number(),
  op_hours: z.number(),
  elec_rate: z.number(),
  system_capex: z.number(),
  system_opex: z.number(),
});

export type Input_PRO_045 = z.infer<typeof InputSchema_PRO_045>;

export interface Output_PRO_045 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_045(input: Input_PRO_045): Output_PRO_045 {
  const validData = InputSchema_PRO_045.parse(input);
  const { chiller_cap, current_cop, t_dry, t_wet, pad_eff, op_hours, elec_rate, system_capex, system_opex } = validData as any;
  
  const Cap_kW = chiller_cap * 3.517;
  const T_cond_new = t_dry - (pad_eff / 100) * (t_dry - t_wet);
  const Delta_T_Improvement = t_dry - T_cond_new;
  const New_COP = current_cop * (1 + (Delta_T_Improvement * 0.03));
  const Power_Current = Cap_kW / current_cop;
  const Power_New = Cap_kW / New_COP;
  const Power_Savings_kW = Power_Current - Power_New;
  const AnnualSavings_kWh = Power_Savings_kW * op_hours;
  const AnnualSavings_USD = AnnualSavings_kWh * elec_rate;
  const Net_Annual_Savings = AnnualSavings_USD - system_opex;
  const Payback_Months = (system_capex / Net_Annual_Savings) * 12;
  const ROI_Pct = (Net_Annual_Savings / system_capex) * 100;
  const CO2_Reduction_Ton = (AnnualSavings_kWh * 0.5) / 1000;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Net_Annual_Savings <= 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Finansal Karar Motoru",
        message: "Finansal Red: Ön soğutma sisteminin tüketeceği su ve bakım maliyetleri (OpEx), elde edilecek elektrik tasarrufunu geçmektedir. Yatırım tamamen zararına çalışacaktır."
      });
    }
  
  return {
    result: CO2_Reduction_Ton,
    smartWarnings
  };
}
