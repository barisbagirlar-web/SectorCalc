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
 * ID: PRO_039
 * Name: Faiz Oranı Kur Riski ve VaR (Hedge Maliyeti)
 */

export const InputSchema_PRO_039 = z.object({
  floating_debt: z.number(),
  hedge_ratio: z.number(),
  bps_shock: z.number(),
  volatility_annual: z.number(),
  var_99_z: z.number(),
  swap_premium: z.number(),
  ebitda: z.number(),
});

export type Input_PRO_039 = z.infer<typeof InputSchema_PRO_039>;

export interface Output_PRO_039 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_039(input: Input_PRO_039): Output_PRO_039 {
  const validData = InputSchema_PRO_039.parse(input);
  const { floating_debt, hedge_ratio, bps_shock, volatility_annual, var_99_z, swap_premium, ebitda } = validData as any;
  
  const Unhedged_Exposure = floating_debt * (1 - (hedge_ratio / 100));
  const Interest_Shock_Impact = Unhedged_Exposure * (bps_shock / 10000);
  const VaR_1_Year = Unhedged_Exposure * (volatility_annual / 100) * var_99_z;
  const Total_Risk_Cost = swap_premium + Interest_Shock_Impact;
  const Stress_Test_EBITDA_Impact = (VaR_1_Year / ebitda) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Stress_Test_EBITDA_Impact > 20) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Finansal Covenants Kısıtlamaları",
        message: "Kritik İflas Riski: Riske Maruz Değer (VaR) şoku gerçekleştiğinde oluşacak ek faiz yükü, şirket FAVÖK'ünün %20'sini aşmaktadır. Bu durum banka kredi sözleşmelerindeki (Covenants) DSCR limitlerini ihlal edip kredilerin erken çağrılmasına neden olabilir. Hedge oranını artırın."
      });
    }
  
  return {
    result: Stress_Test_EBITDA_Impact,
    smartWarnings
  };
}
