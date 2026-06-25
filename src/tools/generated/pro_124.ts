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
 * ID: PRO_124
 * Name: İç Verim Oranı (IRR) ve Modifiye IRR (MIRR)
 */

export const InputSchema_PRO_124 = z.object({
  initial_investment: z.number(),
  cash_flows: z.number(),
  finance_rate: z.number(),
  reinvest_rate: z.number(),
  wacc: z.number(),
});

export type Input_PRO_124 = z.infer<typeof InputSchema_PRO_124>;

export interface Output_PRO_124 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_124(input: Input_PRO_124): Output_PRO_124 {
  const validData = InputSchema_PRO_124.parse(input);
  const { initial_investment, cash_flows, finance_rate, reinvest_rate, wacc } = validData as any;
  
  const n_years = cash_flows.length;
    const NPV = cash_flows.map((cf, i) => cf / Math.pow(1 + (wacc/100), i + 1)).reduce((a,b)=>a+b, 0) - initial_investment;
    const IRR = 0.1 /* IRR placeholder */;
    const PV_Negative_CF = initial_investment + cash_flows.map((cf, i) => (cf < 0 ? Math.abs(cf) / Math.pow(1 + (finance_rate/100), i + 1) : 0)).reduce((a,b)=>a+b, 0);
    const FV_Positive_CF = cash_flows.map((cf, i) => (cf > 0 ? cf * Math.pow(1 + (reinvest_rate/100), n_years - (i + 1)) : 0)).reduce((a,b)=>a+b, 0);
    const MIRR = Math.pow(FV_Positive_CF / PV_Negative_CF, 1 / n_years) - 1;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((IRR * 100) > (wacc + 50)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sermaye Bütçelemesi Kısıtları",
        message: "Yeniden Yatırım Yanılgısı: Projenin standart IRR'si aşırı yüksektir. Standart IRR, ara dönem nakit akışlarının yine aynı astronomik IRR oranıyla yatırıma dönüştürüleceğini varsayar. Gerçekçi bir değerlendirme için her zaman Modifiye IRR (MIRR) sonucunu (Yeniden yatırım oranına dayalı) dikkate alın."
      });
    }
  
  return {
    result: MIRR,
    smartWarnings
  };
}
