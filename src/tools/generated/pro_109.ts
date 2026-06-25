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
 * ID: PRO_109
 * Name: Fazla Mesai (Overtime) vs Yeni İşe Alım Başabaş Finansı
 */

export const InputSchema_PRO_109 = z.object({
  normal_hourly_rate: z.number(),
  ot_multiplier: z.number(),
  burden_rate: z.number(),
  recruitment_cost: z.number(),
  training_weeks: z.number(),
  training_productivity: z.number(),
  expected_monthly_ot: z.number(),
  fatigue_defect_rate: z.number(),
  cost_per_defect: z.number(),
  production_volume_per_hr: z.number(),
});

export type Input_PRO_109 = z.infer<typeof InputSchema_PRO_109>;

export interface Output_PRO_109 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_109(input: Input_PRO_109): Output_PRO_109 {
  const validData = InputSchema_PRO_109.parse(input);
  const { normal_hourly_rate, ot_multiplier, burden_rate, recruitment_cost, training_weeks, training_productivity, expected_monthly_ot, fatigue_defect_rate, cost_per_defect, production_volume_per_hr } = validData as any;
  
  const OT_Cost_Per_Hr = normal_hourly_rate * ot_multiplier * (1 + (burden_rate / 100));
  const Annual_Direct_OT_Cost = expected_monthly_ot * 12 * OT_Cost_Per_Hr;
  const Annual_Fatigue_Quality_Loss = expected_monthly_ot * 12 * production_volume_per_hr * (fatigue_defect_rate / 100) * cost_per_defect;
  const Total_Annual_OT_Risk_Cost = Annual_Direct_OT_Cost + Annual_Fatigue_Quality_Loss;
  const New_Hire_Annual_Base_Cost = 52 * 40 * normal_hourly_rate * (1 + (burden_rate / 100));
  const RampUp_Loss = training_weeks * 40 * normal_hourly_rate * (1 - (training_productivity / 100));
  const Total_First_Year_Hire_Cost = New_Hire_Annual_Base_Cost + recruitment_cost + RampUp_Loss;
  const Breakeven_OT_Hours_Annual = Total_First_Year_Hire_Cost / (OT_Cost_Per_Hr + (production_volume_per_hr * (fatigue_defect_rate / 100) * cost_per_defect));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Annual_Fatigue_Quality_Loss > (Annual_Direct_OT_Cost * 0.5)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Ergonomi ve Kalite",
        message: "Gizli Kalite Maliyeti: Personelin fazla mesaiden dolayı yaşadığı yorgunluk kaynaklı hurda ve hataların maliyeti, fazla mesaiye ödediğiniz primli ücretin %50'sini aşıyor. Fazla mesai üretimi felç etmektedir; acilen yeni vardiya açın veya yeni işe alım yapın."
      });
    }
  
  return {
    result: Breakeven_OT_Hours_Annual,
    smartWarnings
  };
}
