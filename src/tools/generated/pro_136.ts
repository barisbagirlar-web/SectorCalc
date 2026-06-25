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
 * ID: PRO_136
 * Name: DuPont ROI Ayrıştırması ve Ekonomik Katma Değer (EVA)
 */

export const InputSchema_PRO_136 = z.object({
  revenue: z.number(),
  net_income: z.number(),
  ebit: z.number(),
  total_assets: z.number(),
  total_equity: z.number(),
  tax_rate: z.number(),
  wacc: z.number(),
});

export type Input_PRO_136 = z.infer<typeof InputSchema_PRO_136>;

export interface Output_PRO_136 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_136(input: Input_PRO_136): Output_PRO_136 {
  const validData = InputSchema_PRO_136.parse(input);
  const { revenue, net_income, ebit, total_assets, total_equity, tax_rate, wacc } = validData as any;
  
  const Net_Profit_Margin = (net_income / revenue) * 100;
  const Asset_Turnover = revenue / total_assets;
  const Equity_Multiplier = total_assets / total_equity;
  const ROE_3Factor_DuPont = (Net_Profit_Margin / 100) * Asset_Turnover * Equity_Multiplier * 100;
  const Invested_Capital = total_assets - (total_assets - total_equity);
  const NOPAT = ebit * (1 - (tax_rate / 100));
  const ROIC = (NOPAT / Invested_Capital) * 100;
  const Economic_Value_Added_EVA = NOPAT - (Invested_Capital * (wacc / 100));
  const Value_Spread = ROIC - wacc;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Value_Spread < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sermaye Yönetimi (EVA)",
        message: "Değer Yıkımı: ROIC (Yatırılan Sermayenin Getirisi), WACC'ın (Sermaye Maliyeti) altındadır. Şirket muhasebesel olarak net kâr yazsa dahi, finansal olarak ekonomik katma değer (EVA) yaratamamakta ve hissedar varlığını yok etmektedir."
      });
    }

    if (Equity_Multiplier > 4.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "DuPont Analizi",
        message: "Kaldıraç Riski: Şirketin yüksek ROE değeri, kârlılıktan değil yüksek borçluluktan (Equity Multiplier > 4) kaynaklanmaktadır. Olası bir faiz şokunda şirket temerrüde düşebilir."
      });
    }
  
  return {
    result: Value_Spread,
    smartWarnings
  };
}
