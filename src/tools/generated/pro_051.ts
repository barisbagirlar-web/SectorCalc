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
 * ID: PRO_051
 * Name: Bileşik Faiz, Enflasyon ve Reel Getiri (Sürekli Bileşik)
 */

export const InputSchema_PRO_051 = z.object({
  pv: z.number(),
  pmt: z.number(),
  annual_rate: z.number(),
  compounding_freq: z.enum(["Aylık", "Yıllık", "Sürekli"]),
  duration_yrs: z.number(),
  inflation_rate: z.number(),
  tax_rate: z.number(),
});

export type Input_PRO_051 = z.infer<typeof InputSchema_PRO_051>;

export interface Output_PRO_051 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_051(input: Input_PRO_051): Output_PRO_051 {
  const validData = InputSchema_PRO_051.parse(input);
  const { pv, pmt, annual_rate, compounding_freq, duration_yrs, inflation_rate, tax_rate } = validData as any;
  
  const m_comp = ((compounding_freq == 'Aylık') ? (12) : (((compounding_freq  === 'Yıllık') ? (1) : (0))));
  const r_dec = annual_rate / 100;
  const FV_Principal = ((compounding_freq == 'Sürekli') ? (pv * Math.exp(r_dec * duration_yrs)) : (pv * Math.pow(1 + (r_dec / m_comp), m_comp * duration_yrs)));
  const FV_Contributions = ((compounding_freq == 'Sürekli') ? (pmt * 12 * ((Math.exp(r_dec * duration_yrs) - 1) / r_dec)) : (pmt * ((Math.pow(1 + (r_dec / 12), 12 * duration_yrs) - 1) / (r_dec / 12))));
  const Total_FV = FV_Principal + FV_Contributions;
  const Total_Invested = pv + (pmt * 12 * duration_yrs);
  const Gross_Interest = Total_FV - Total_Invested;
  const Net_Interest_After_Tax = Gross_Interest * (1 - (tax_rate / 100));
  const Net_FV = Total_Invested + Net_Interest_After_Tax;
  const Real_Return_Rate = (((1 + r_dec) / (1 + (inflation_rate / 100))) - 1) * 100;
  const Purchasing_Power_FV = Net_FV / Math.pow(1 + (inflation_rate / 100), duration_yrs);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Real_Return_Rate < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Makroekonomik Analiz",
        message: "Kritik Varlık Erimesi: Enflasyon oranı, nominal faiz oranını aşmaktadır. Reel getiri negatiftir; yatırımınız zamanla satın alma gücünü kaybedecek ve şirket sermayesi (Wealth) eriyecektir."
      });
    }
  
  return {
    result: Purchasing_Power_FV,
    smartWarnings
  };
}
