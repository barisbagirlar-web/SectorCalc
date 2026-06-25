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
 * ID: PRO_127
 * Name: İskontolu Nakit Akışı (DCF) ile Şirket Değerleme
 */

export const InputSchema_PRO_127 = z.object({
  ebit_array: z.number(),
  tax_rate: z.number(),
  da_array: z.number(),
  capex_array: z.number(),
  nwc_change_array: z.number(),
  wacc: z.number(),
  terminal_growth_rate: z.number(),
  net_debt: z.number(),
  diluted_shares: z.number(),
});

export type Input_PRO_127 = z.infer<typeof InputSchema_PRO_127>;

export interface Output_PRO_127 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_127(input: Input_PRO_127): Output_PRO_127 {
  const validData = InputSchema_PRO_127.parse(input);
  const { ebit_array, tax_rate, da_array, capex_array, nwc_change_array, wacc, terminal_growth_rate, net_debt, diluted_shares } = validData as any;
  
  const n_periods = 1;
  const NOPAT_t = ebit_array_t * (1 - (tax_rate / 100));
  const FCFF_t = NOPAT_t + da_array_t - capex_array_t - nwc_change_array_t;
  const PV_FCFF = Array.from({length: n}, (_, i) => { const t = i + 1; return FCFF_t / Math.pow(1 + (wacc / 100), t); }).reduce((a,b)=>a+b, 0);
  const Terminal_Value = (FCFF_n_periods * (1 + (terminal_growth_rate / 100))) / ((wacc / 100) - (terminal_growth_rate / 100));
  const PV_Terminal_Value = Terminal_Value / Math.pow(1 + (wacc / 100), n_periods);
  const Enterprise_Value_EV = PV_FCFF + PV_Terminal_Value;
  const Equity_Value = Enterprise_Value_EV - net_debt;
  const Implied_Share_Price = Equity_Value / diluted_shares;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (PV_Terminal_Value > (Enterprise_Value_EV * 0.80)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Değerleme Güvenilirliği",
        message: "Hassasiyet Uyarısı: Şirketin Toplam İşletme Değerinin (EV) %80'inden fazlası, gelecekteki Terminal Değer (Sonsuzluk) varsayımına dayanmaktadır. Büyüme oranındaki (g) ufak bir sapma hisse fiyatını kökten değiştirecektir; senaryo analizi yapın."
      });
    }
  
  return {
    result: Implied_Share_Price,
    smartWarnings
  };
}
