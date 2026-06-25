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
 * ID: PRO_044
 * Name: Evaporatif Soğutma (FES) Kapasite ve ROI Analizi
 */

export const InputSchema_PRO_044 = z.object({
  len: z.number(),
  wid: z.number(),
  hei: z.number(),
  ach: z.number(),
  t_dry: z.number(),
  t_wet: z.number(),
  pad_eff: z.number(),
  dev_flow: z.number(),
  dev_kw: z.number(),
  conv_kw: z.number(),
  water_lph: z.number(),
  elec_rate: z.number(),
  water_rate: z.number(),
  op_hours: z.number(),
});

export type Input_PRO_044 = z.infer<typeof InputSchema_PRO_044>;

export interface Output_PRO_044 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_044(input: Input_PRO_044): Output_PRO_044 {
  const validData = InputSchema_PRO_044.parse(input);
  const { len, wid, hei, ach, t_dry, t_wet, pad_eff, dev_flow, dev_kw, conv_kw, water_lph, elec_rate, water_rate, op_hours } = validData as any;
  
  const Volume = len * wid * hei;
  const Total_Q = Volume * ach;
  const T_out_pad = t_dry - (pad_eff / 100) * (t_dry - t_wet);
  const Delta_T = t_dry - T_out_pad;
  const DeviceCount = CEILING(Total_Q / dev_flow);
  const TotalPower_FES = DeviceCount * dev_kw;
  const TotalWater_Lph = DeviceCount * water_lph;
  const AnnualElec_FES = TotalPower_FES * op_hours;
  const AnnualElec_Conv = conv_kw * op_hours;
  const EnergySavings_kWh = AnnualElec_Conv - AnnualElec_FES;
  const AnnualElecCost_FES = AnnualElec_FES * elec_rate;
  const AnnualWaterCost = (TotalWater_Lph * op_hours / 1000) * water_rate;
  const TotalOpEx_FES = AnnualElecCost_FES + AnnualWaterCost;
  const TotalSavings_USD = (AnnualElec_Conv * elec_rate) - TotalOpEx_FES;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Delta_T < 3.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Psikrometrik Analiz",
        message: "Uyarı: Dış ortam bağıl nemi çok yüksek. Pad media üzerinden elde edilen sıcaklık düşüşü (Delta T) 3 derecenin altındadır. Bu iklim şartlarında evaporatif soğutma yerine DX (Gazlı) sistem kullanılması önerilir."
      });
    }
  
  return {
    result: TotalSavings_USD,
    smartWarnings
  };
}
