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
 * ID: PRO_030
 * Name: Dijital İkiz (Digital Twin) Prototip ROI Analizi
 */

export const InputSchema_PRO_030 = z.object({
  phys_proto_cost: z.number(),
  phys_iterations: z.number(),
  field_test_cost: z.number(),
  dt_software_lic: z.number(),
  dt_cloud_hrs: z.number(),
  cloud_rate: z.number(),
  sensor_capex: z.number(),
  eng_modeling_hrs: z.number(),
  eng_rate: z.number(),
  time_to_market_gain: z.number(),
  daily_market_rev: z.number(),
});

export type Input_PRO_030 = z.infer<typeof InputSchema_PRO_030>;

export interface Output_PRO_030 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_030(input: Input_PRO_030): Output_PRO_030 {
  const validData = InputSchema_PRO_030.parse(input);
  const { phys_proto_cost, phys_iterations, field_test_cost, dt_software_lic, dt_cloud_hrs, cloud_rate, sensor_capex, eng_modeling_hrs, eng_rate, time_to_market_gain, daily_market_rev } = validData as any;
  
  const Cost_Physical_Baseline = (phys_proto_cost * phys_iterations) + field_test_cost;
  const Cost_DT_OpEx = dt_software_lic + (dt_cloud_hrs * cloud_rate) + (eng_modeling_hrs * eng_rate);
  const Cost_DT_Total = Cost_DT_OpEx + sensor_capex;
  const Savings_Prototyping = Cost_Physical_Baseline - Cost_DT_Total;
  const Revenue_Gain_TTM = time_to_market_gain * daily_market_rev;
  const Total_Value_Created = Savings_Prototyping + Revenue_Gain_TTM;
  const DT_ROI = (Total_Value_Created / Cost_DT_Total) * 100;
  const Payback_Months = (sensor_capex / (Total_Value_Created / 12));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Savings_Prototyping < 0 && Revenue_Gain_TTM > ABS(Savings_Prototyping)) {
      smartWarnings.push({
        severity: "INFO",
        source: "AR-GE İnovasyon Stratejisi",
        message: "Bilgi: Dijital İkiz yatırımı, doğrudan prototip masraflarından tasarruf sağlamıyor (Yazılım/Sensör maliyeti daha yüksek). Ancak Pazara Çıkış (TTM) hızından elde edilen ek gelir, bu yatırımı fazlasıyla kârlı kılıyor. Strateji onaylanabilir."
      });
    }
  
  return {
    result: Payback_Months,
    smartWarnings
  };
}
