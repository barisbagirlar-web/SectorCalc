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
 * ID: PRO_125
 * Name: Net Bugünkü Değer (NPV) ve Ağırlıklı Sermaye Maliyeti (WACC)
 */

export const InputSchema_PRO_125 = z.object({
  total_debt: z.number(),
  total_equity: z.number(),
  cost_of_debt: z.number(),
  cost_of_equity: z.number(),
  tax_rate: z.number(),
  initial_investment: z.number(),
  cash_flows: z.number(),
  terminal_growth_rate: z.number(),
});

export type Input_PRO_125 = z.infer<typeof InputSchema_PRO_125>;

export interface Output_PRO_125 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_125(input: Input_PRO_125): Output_PRO_125 {
  const validData = InputSchema_PRO_125.parse(input);
  const { total_debt, total_equity, cost_of_debt, cost_of_equity, tax_rate, initial_investment, cash_flows, terminal_growth_rate } = validData as any;
  
  const Total_Capital = total_debt + total_equity;
  const Weight_Debt = total_debt / Total_Capital;
  const Weight_Equity = total_equity / Total_Capital;
  const WACC_Pct = (Weight_Equity * cost_of_equity) + (Weight_Debt * cost_of_debt * (1 - (tax_rate / 100)));
  const WACC_Dec = WACC_Pct / 100;
  const n_years = 1;
  const NPV_Standard = Array.from({length: n}, (_, i) => { const t = i + 1; return cash_flows_t / Math.pow(1 + WACC_Dec, t); }).reduce((a,b)=>a+b, 0) - initial_investment;
  const Terminal_Value = (cash_flows_n_years * (1 + (terminal_growth_rate / 100))) / (WACC_Dec - (terminal_growth_rate / 100));
  const NPV_With_Terminal = NPV_Standard + (Terminal_Value / Math.pow(1 + WACC_Dec, n_years));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (NPV_With_Terminal < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Hissedar Değeri",
        message: "Sermaye İmhası: Projenin Net Bugünkü Değeri (NBD) negatiftir. Bu projeye yatırım yapmak şirket değerini ve hissedar varlıklarını yok edecektir."
      });
    }
  
  return {
    result: NPV_With_Terminal,
    smartWarnings
  };
}
