import { NetBugunkuDegerNpvVeAgirlikliSermayeMaliyetiWaccCalculator123InputSchema, type NetBugunkuDegerNpvVeAgirlikliSermayeMaliyetiWaccCalculator123Input } from "./net-bugunku-deger-npv-ve-agirlikli-sermaye-maliyeti-wacc-calculator-123-validation";

export const calculateNetBugunkuDegerNpvVeAgirlikliSermayeMaliyetiWaccCalculator123Contract: any = {
  id: "net-bugunku-deger-npv-ve-agirlikli-sermaye-maliyeti-wacc-calculator-123",
  version: "1.0.0",
  category: "cost",
  inputSchema: NetBugunkuDegerNpvVeAgirlikliSermayeMaliyetiWaccCalculator123InputSchema,
  
  execute: async (input: any) => {
    try {
      const totalDebt = Number(input.totalDebt);
      const totalEquity = Number(input.totalEquity);
      const costOfDebt = Number(input.costOfDebt);
      const costOfEquity = Number(input.costOfEquity);
      const taxRate = Number(input.taxRate);
      const initialInvestment = Number(input.initialInvestment);
      const cashFlowAmount = Number(input.cashFlows);
      const terminalGrowthRate = Number(input.terminalGrowthRate);

      // Total_Capital = total_debt + total_equity
      const totalCapital = totalDebt + totalEquity;

      // Weight_Debt = total_debt / Total_Capital
      const weightDebt = totalCapital > 0 ? totalDebt / totalCapital : 0;

      // Weight_Equity = total_equity / Total_Capital
      const weightEquity = totalCapital > 0 ? totalEquity / totalCapital : 0;

      // WACC_Pct = (Weight_Equity * cost_of_equity) + (Weight_Debt * cost_of_debt * (1 - (tax_rate / 100)))
      const wACCPct = (weightEquity * costOfEquity) + (weightDebt * costOfDebt * (1 - (taxRate / 100)));

      // WACC_Dec = WACC_Pct / 100
      const wACCDec = wACCPct / 100;

      // n_years - assuming cashFlows is a constant cash flow per year for a default 5 year period
      const nYears = 5;

      // NPV_Standard = SUM_t=1_to_n(cash_flows_t / POWER(1 + WACC_Dec, t)) - initial_investment
      let nPVStandard = -initialInvestment;
      for (let t = 1; t <= nYears; t++) {
        nPVStandard += cashFlowAmount / Math.pow(1 + wACCDec, t);
      }

      // Terminal_Value = (cash_flows_n_years * (1 + (terminal_growth_rate / 100))) / (WACC_Dec - (terminal_growth_rate / 100))
      const terminalValue = (wACCDec !== terminalGrowthRate / 100) 
        ? (cashFlowAmount * (1 + (terminalGrowthRate / 100))) / (wACCDec - (terminalGrowthRate / 100))
        : 0;

      // NPV_With_Terminal = NPV_Standard + (Terminal_Value / POWER(1 + WACC_Dec, n_years))
      const nPVWithTerminal = nPVStandard + (terminalValue / Math.pow(1 + wACCDec, nYears));

      return {
        totalCapital,
        weightDebt,
        weightEquity,
        wACCPct,
        wACCDec,
        nYears,
        nPVStandard,
        terminalValue,
        nPVWithTerminal
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};