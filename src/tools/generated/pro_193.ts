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
 * ID: PRO_193
 * Name: SectorCalc Küresel Endüstriyel Otorite TCO ve Ekosistem ROI Hesaplayıcı
 */

export const InputSchema_PRO_193 = z.object({
  legacy_software_lic_usd: z.number(),
  engineering_hours_saved: z.number(),
  hourly_engineering_rate: z.number(),
  scrap_reduction_value_yr: z.number(),
  sectorcalc_sub_cost_yr: z.number(),
  implementation_capex: z.number(),
  wacc_discount_rate: z.number(),
  evaluation_horizon_yrs: z.number(),
});

export type Input_PRO_193 = z.infer<typeof InputSchema_PRO_193>;

export interface Output_PRO_193 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_193(input: Input_PRO_193): Output_PRO_193 {
  const validData = InputSchema_PRO_193.parse(input);
  const { legacy_software_lic_usd, engineering_hours_saved, hourly_engineering_rate, scrap_reduction_value_yr, sectorcalc_sub_cost_yr, implementation_capex, wacc_discount_rate, evaluation_horizon_yrs } = validData as any;
  
  const Annual_OpEx_Savings = legacy_software_lic_usd + (engineering_hours_saved * hourly_engineering_rate) + scrap_reduction_value_yr;
  const Net_Annual_CashFlow = Annual_OpEx_Savings - sectorcalc_sub_cost_yr;
  const Project_NPV = (Net_Annual_CashFlow * ((1 - Math.pow(1 + (wacc_discount_rate/100), -evaluation_horizon_yrs)) / (wacc_discount_rate/100))) - implementation_capex;
  const SectorCalc_ROI_Pct = (Project_NPV / (implementation_capex + sectorcalc_sub_cost_yr)) * 100;
  const Simple_Payback_Months = (implementation_capex / Net_Annual_CashFlow) * 12;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Project_NPV < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Big Four Finansal Fizibilite Standartları",
        message: "Finansal Sapma Riski: Yatırımın Net Bugünkü Değeri (NPV) negatiftir. Eğer kurtarılan mühendislik eforu veya hurda azaltma girdileri sahadaki gerçek durumu yansıtmıyorsa, mevcut entegrasyon bütçesi optimize edilmelidir."
      });
    }
  
  return {
    result: Simple_Payback_Months,
    smartWarnings
  };
}
