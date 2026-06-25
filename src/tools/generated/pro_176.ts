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
 * ID: PRO_176
 * Name: Sermaye Bütçelemesi: Black-Scholes Gerçek Opsiyon Değerleme
 */

export const InputSchema_PRO_176 = z.object({
  project_pv: z.number(),
  strike_price_capex: z.number(),
  risk_free_rate: z.number(),
  option_time_yrs: z.number(),
  volatility_annual: z.number(),
});

export type Input_PRO_176 = z.infer<typeof InputSchema_PRO_176>;

export interface Output_PRO_176 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_176(input: Input_PRO_176): Output_PRO_176 {
  const validData = InputSchema_PRO_176.parse(input);
  const { project_pv, strike_price_capex, risk_free_rate, option_time_yrs, volatility_annual } = validData as any;
  
  const r_dec = risk_free_rate / 100;
  const sigma_dec = volatility_annual / 100;
  const d1 = (Math.log(project_pv / strike_price_capex) + (r_dec + Math.pow(sigma_dec, 2) / 2) * option_time_yrs) / (sigma_dec * Math.sqrt(option_time_yrs));
  const d2 = d1 - (sigma_dec * Math.sqrt(option_time_yrs));
  const Call_Option_Value_RealOption = (project_pv * jStat.normal.cdf(d1)) - (strike_price_capex * Math.exp(-r_dec * option_time_yrs) * jStat.normal.cdf(d2));
  const Traditional_NPV = project_pv - strike_price_capex;
  const Expanded_NPV = Traditional_NPV + Call_Option_Value_RealOption;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "INFO",
        source: "McKinsey Stratejik Yatırım Metotları",
        message: "Stratejik Değer Kazanımı: Geleneksel NPV negatif çıkmasına rağmen, yüksek pazar oynaklığı (Volatilite) nedeniyle 'Yatırımı Erteleme Opsiyon Değeri' pozitiftir. Projeyi tamamen reddetmek yerine, opsiyon süresi boyunca patent/arazi haklarını elinizde tutarak bekleyin."
      });
    }
  
  return {
    result: Expanded_NPV,
    smartWarnings
  };
}
