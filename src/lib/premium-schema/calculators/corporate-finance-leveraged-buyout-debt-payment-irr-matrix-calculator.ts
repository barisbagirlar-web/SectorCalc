import { KurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187InputSchema, type KurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187Input } from "./kurumsal-finans-kaldiracli-satin-alim-lbo-borc-odeme-ve-irr-matrisi-calculator-187-validation";

export const calculateKurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187Contract: any = {
  id: "kurumsal-finans-kaldiracli-satin-alim-lbo-borc-odeme-ve-irr-matrisi-calculator-187",
  version: "1.0.0",
  category: "cost",
  inputSchema: KurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        purchaseMultiple,
        ebitdaY0,
        leverageRatio,
        interestRateDebt,
        exitMultipleY5,
        ebitdaCagr
      } = input as KurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187Input;

      // Enterprise_Value_Y0 = ebitda_y0 * purchase_multiple
      const enterpriseValueY0 = ebitdaY0 * purchaseMultiple;

      // Initial_Debt = Enterprise_Value_Y0 * (leverage_ratio / 100)
      const initialDebt = enterpriseValueY0 * (leverageRatio / 100);

      // Initial_Equity = Enterprise_Value_Y0 - Initial_Debt
      const initialEquity = enterpriseValueY0 - initialDebt;

      // EBITDA_Y5 = ebitda_y0 * POWER(1 + (ebitda_cagr / 100), 5)
      const eBITDAY5 = ebitdaY0 * Math.pow(1 + (ebitdaCagr / 100), 5);

      // Enterprise_Value_Y5 = EBITDA_Y5 * exit_multiple_y5
      const enterpriseValueY5 = eBITDAY5 * exitMultipleY5;

      // Estimated_Debt_Paydown_5Y = Initial_Debt * 0.40
      const estimatedDebtPaydown5Y = initialDebt * 0.40;

      // Ending_Debt = Initial_Debt - estimated_debt_paydown_5Y
      const endingDebt = initialDebt - estimatedDebtPaydown5Y;

      // Ending_Equity_Y5 = Enterprise_Value_Y5 - Ending_Debt
      const endingEquityY5 = enterpriseValueY5 - endingDebt;

      // LBO_IRR_Pct = (POWER(Ending_Equity_Y5 / Initial_Equity, 1 / 5) - 1) * 100
      const lBOIRRPct = initialEquity > 0 
        ? (Math.pow(endingEquityY5 / initialEquity, 1 / 5) - 1) * 100 
        : 0;

      return {
        enterpriseValueY0,
        initialDebt,
        initialEquity,
        eBITDAY5,
        enterpriseValueY5,
        estimatedDebtPaydown5Y,
        endingDebt,
        endingEquityY5,
        lBOIRRPct
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};