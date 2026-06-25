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
 * ID: PRO_189
 * Name: Kurumsal Finans: Kaldıraçlı Satın Alım (LBO) Borç Ödeme ve IRR Matrisi
 */

export const InputSchema_PRO_189 = z.object({
  purchase_multiple: z.number(),
  ebitda_y0: z.number(),
  leverage_ratio: z.number(),
  interest_rate_debt: z.number(),
  exit_multiple_y5: z.number(),
  ebitda_cagr: z.number(),
});

export type Input_PRO_189 = z.infer<typeof InputSchema_PRO_189>;

export interface Output_PRO_189 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_189(input: Input_PRO_189): Output_PRO_189 {
  const validData = InputSchema_PRO_189.parse(input);
  const { purchase_multiple, ebitda_y0, leverage_ratio, interest_rate_debt, exit_multiple_y5, ebitda_cagr } = validData as any;
  
  const Enterprise_Value_Y0 = ebitda_y0 * purchase_multiple;
  const Initial_Debt = Enterprise_Value_Y0 * (leverage_ratio / 100);
  const Initial_Equity = Enterprise_Value_Y0 - Initial_Debt;
  const EBITDA_Y5 = ebitda_y0 * Math.pow(1 + (ebitda_cagr / 100), 5);
  const Enterprise_Value_Y5 = EBITDA_Y5 * exit_multiple_y5;
  const Estimated_Debt_Paydown_5Y = Initial_Debt * 0.40;
  const Ending_Debt = Initial_Debt - estimated_debt_paydown_5Y;
  const Ending_Equity_Y5 = Enterprise_Value_Y5 - Ending_Debt;
  const LBO_IRR_Pct = (Math.pow(Ending_Equity_Y5 / Initial_Equity, 1 / 5) - 1) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (LBO_IRR_Pct < 20.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Private Equity (Girişim Sermayesi) Kriterleri",
        message: "Düşük Getiri Uyarısı: Kaldıraçlı satın alım (LBO) modeline göre beklenen özsermaye IRR getirisi %20'lik PE fon eşiğinin altındadır. Yüksek borç riskine değmeyen bir finansal yapı; ya alım çarpanını (multiple) düşürün ya da kaldıraç oranını revize edin."
      });
    }
  
  return {
    result: LBO_IRR_Pct,
    smartWarnings
  };
}
