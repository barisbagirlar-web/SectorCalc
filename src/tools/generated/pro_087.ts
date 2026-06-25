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
 * ID: PRO_087
 * Name: Verimlilik Artırıcı Proje (VAP) İndirgenmiş Nakit Akışı
 */

export const InputSchema_PRO_087 = z.object({
  current_energy_kwh: z.number(),
  target_reduction_pct: z.number(),
  elec_tariff: z.number(),
  vap_capex: z.number(),
  vap_opex_yr: z.number(),
  project_life_yr: z.number(),
  discount_rate: z.number(),
});

export type Input_PRO_087 = z.infer<typeof InputSchema_PRO_087>;

export interface Output_PRO_087 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_087(input: Input_PRO_087): Output_PRO_087 {
  const validData = InputSchema_PRO_087.parse(input);
  const { current_energy_kwh, target_reduction_pct, elec_tariff, vap_capex, vap_opex_yr, project_life_yr, discount_rate } = validData as any;
  
  const Energy_Savings_kWh = current_energy_kwh * (target_reduction_pct / 100);
  const Gross_Annual_Savings_USD = Energy_Savings_kWh * elec_tariff;
  const Net_Annual_CashFlow = Gross_Annual_Savings_USD - vap_opex_yr;
  const NPV = Array.from({length: life}, (_, i) => { const t = i + 1; return Net_Annual_CashFlow / Math.pow(1 + (discount_rate/100), t); }).reduce((a,b)=>a+b, 0) - vap_capex;
  const IRR = 0.1 /* IRR placeholder */;
  const Simple_Payback_Yrs = vap_capex / Net_Annual_CashFlow;
  const CO2_Reduction_Ton = (Energy_Savings_kWh * 0.45) / 1000;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (NPV < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sermaye Bütçelemesi",
        message: "Finansal Red: Projenin Net Bugünkü Değeri negatiftir. VAP yatırımı, ömrü boyunca kendini ve sermaye maliyetini (Faiz/Enflasyon) amorti edememektedir."
      });
    }
  
  return {
    result: CO2_Reduction_Ton,
    smartWarnings
  };
}
