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
 * ID: PRO_093
 * Name: Rüzgar Türbini (AEP) ve İleri LCOE Analizi (IEC 61400)
 */

export const InputSchema_PRO_093 = z.object({
  nominal_kw: z.number(),
  capacity_factor: z.number(),
  capex: z.number(),
  opex_yr: z.number(),
  degradation: z.number(),
  system_life: z.number(),
  wacc: z.number(),
  grid_rate: z.number(),
});

export type Input_PRO_093 = z.infer<typeof InputSchema_PRO_093>;

export interface Output_PRO_093 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_093(input: Input_PRO_093): Output_PRO_093 {
  const validData = InputSchema_PRO_093.parse(input);
  const { nominal_kw, capacity_factor, capex, opex_yr, degradation, system_life, wacc, grid_rate } = validData as any;
  
  const AEP_Year1 = nominal_kw * (capacity_factor / 100) * 8760;
  const Total_Discounted_Energy = Array.from({length: life}, (_, i) => { const t = i + 1; return  (AEP_Year1 * Math.pow(1 - (degradation/100), t)) / Math.pow(1 + (wacc/100), t) ; }).reduce((a,b)=>a+b, 0);
  const Total_Discounted_Cost = capex + Array.from({length: life}, (_, i) => { const t = i + 1; return  opex_yr / Math.pow(1 + (wacc/100), t) ; }).reduce((a,b)=>a+b, 0);
  const LCOE = Total_Discounted_Cost / Total_Discounted_Energy;
  const NPV = (Total_Discounted_Energy * grid_rate) - Total_Discounted_Cost;
  const Simple_Payback = capex / ((AEP_Year1 * grid_rate) - opex_yr);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (LCOE > grid_rate) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Enerji Ekonomisi",
        message: "Zararına Yatırım: Seviyelendirilmiş Enerji Maliyeti (LCOE), şebekeye satış fiyatından (Tarife) daha yüksektir. Proje, ürettiği her kWh için şirkete zarar yazacaktır (NPV Negatif). Kapasite faktörü (Rüzgar hızı) yetersizdir."
      });
    }
  
  return {
    result: Simple_Payback,
    smartWarnings
  };
}
