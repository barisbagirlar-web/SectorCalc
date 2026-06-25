import { DupontRoiAyristirmasiVeEkonomikKatmaDegerEvaCalculator134InputSchema, type DupontRoiAyristirmasiVeEkonomikKatmaDegerEvaCalculator134Input } from "./dupont-roi-ayristirmasi-ve-ekonomik-katma-deger-eva-calculator-134-validation";

export const calculateDupontRoiAyristirmasiVeEkonomikKatmaDegerEvaCalculator134Contract: any = {
  id: "dupont-roi-ayristirmasi-ve-ekonomik-katma-deger-eva-calculator-134",
  version: "1.0.0",
  category: "cost",
  inputSchema: DupontRoiAyristirmasiVeEkonomikKatmaDegerEvaCalculator134InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        revenue,
        netIncome,
        ebit,
        totalAssets,
        totalEquity,
        taxRate,
        wacc
      } = input;

      // Validate inputs are positive numbers
      if (revenue <= 0 || totalAssets <= 0 || totalEquity <= 0 || netIncome === undefined || ebit === undefined) {
        throw new Error("Revenue, Total Assets, and Total Equity must be positive numbers.");
      }

      // Net Profit Margin = Net Income / Revenue (as decimal, then percentage in ROE calculation)
      const netProfitMargin = netIncome / revenue;

      // Asset Turnover = Revenue / Total Assets
      const assetTurnover = revenue / totalAssets;

      // Equity Multiplier = Total Assets / Total Equity
      const equityMultiplier = totalAssets / totalEquity;

      // ROE (3-Factor DuPont) = Net Profit Margin * Asset Turnover * Equity Multiplier
      const rOE3FactorDuPont = netProfitMargin * assetTurnover * equityMultiplier;

      // Invested Capital = Total Equity (simplified standard approach)
      const investedCapital = totalEquity;

      // NOPAT = EBIT * (1 - Tax Rate)
      const taxRateDecimal = taxRate / 100;
      const nOPAT = ebit * (1 - taxRateDecimal);

      // ROIC = NOPAT / Invested Capital
      const rOIC = nOPAT / investedCapital;

      // WACC as decimal
      const waccDecimal = wacc / 100;

      // Economic Value Added (EVA) = NOPAT - (Invested Capital * WACC)
      const economicValueAddedEVA = nOPAT - (investedCapital * waccDecimal);

      // Value Spread = ROIC - WACC
      const valueSpread = rOIC - waccDecimal;

      return {
        netProfitMargin,
        assetTurnover,
        equityMultiplier,
        rOE3FactorDuPont,
        investedCapital,
        nOPAT,
        rOIC,
        economicValueAddedEVA,
        valueSpread
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};