/**
 * Tool #22 — Nakit Akisi Acigi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CASH_FLOW_GAP_SCHEMA: PremiumCalculatorSchema = {
  id: "cash-flow-gap-analyzer", legacyPaidSlug: "cash-flow-gap-analyzer",
  name: "Cash Flow Gap Analysis", name_i18n: {"en":"Cash Flow Gap Analysis"}, sectorSlug: "financial-planning", category: "measurement",
  painStatement: "Nakit akisi acigi, DSO/DPO/DIO dengesi ve nakit dongusu hesaplanmazsa likidite krizi onceden tespit edilemez.", painStatement_i18n: {"en":"Cash flow gap, DSO/DPO/DIO balance, and cash cycle — if not calculated, liquidity crisis cannot be detected beforehand."},
  inputs: [
    { id: "monthlyRevenue", label: "Monthly Revenue", label_i18n: {"en":"Monthly Revenue"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly revenue", expertMeaning_i18n: {"en":"Monthly revenue"} },
    { id: "monthlyExpenses", label: "Monthly Expenses", label_i18n: {"en":"Monthly Expenses"}, type: "number", unit: "USD", required: true, smartDefault: 85000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly expenses", expertMeaning_i18n: {"en":"Monthly expenses"} },
    { id: "accountsReceivable", label: "Alacak Bakiyesi", label_i18n: {"en":"Accounts Receivable"}, type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts receivable", expertMeaning_i18n: {"en":"Accounts receivable"} },
    { id: "accountsPayable", label: "Accounts Payable", label_i18n: {"en":"Accounts Payable"}, type: "number", unit: "USD", required: true, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts payable", expertMeaning_i18n: {"en":"Accounts payable"} },
    { id: "inventoryValue", label: "Inventory Value", label_i18n: {"en":"Inventory Value"}, type: "number", unit: "USD", required: true, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "Inventory value", expertMeaning_i18n: {"en":"Inventory value"} },
    { id: "cogsMonthly", label: "Monthly COGS", label_i18n: {"en":"Monthly COGS"}, type: "number", unit: "USD", required: true, smartDefault: 60000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly COGS", expertMeaning_i18n: {"en":"Monthly COGS"} },
    { id: "numMonths", label: "Projection Months", label_i18n: {"en":"Projection Months"}, type: "number", unit: "ay", required: false, smartDefault: 6, validation: { min: 1, max: 24 }, helper: "", expertMeaning: "Projection months", expertMeaning_i18n: {"en":"Projection months"} },
  ],
  outputs: [
    { id: "cashInflow", label: "Aylk Nakit Girisi", label_i18n: {"en":"Aylk cash Girisi"}, unit: "USD", format: "currency" },
    { id: "cashOutflow", label: "Aylk Nakit Cks", label_i18n: {"en":"Aylk cash Cks"}, unit: "USD", format: "currency" },
    { id: "netCashFlow", label: "Net Nakit Aks", label_i18n: {"en":"Net cash Aks"}, unit: "USD/ay", format: "currency" },
    { id: "cumulativeCash", label: "Kumulatif Nakit", label_i18n: {"en":"Kumulatif cash"}, unit: "USD", format: "currency" },
    { id: "cashGap", label: "Nakit Acg", label_i18n: {"en":"cash Acg"}, unit: "USD", format: "currency" },
    { id: "dso", label: "DSO (Alacak Gun Suresi)", label_i18n: {"en":"DSO (Receivable Gun Duration)"}, unit: "gun", format: "number" },
    { id: "dpo", label: "DPO (Borc Gun Suresi)", label_i18n: {"en":"DPO (Borc Gun Duration)"}, unit: "gun", format: "number" },
    { id: "dio", label: "DIO (Stok Gun Suresi)", label_i18n: {"en":"DIO (Inventory Gun Duration)"}, unit: "gun", format: "number" },
    { id: "cashConversionCycle", label: "Nakit Donusum Dongusu", label_i18n: {"en":"cash Donusum Dongusu"}, unit: "gun", format: "number" },
  ],
  thresholds: [{ fieldId: "cashGap", warning: 20000, critical: 50000, direction: "higher_is_bad", warningMessage: "Cash gap > $20K — evaluate credit line or factoring.", warningMessage_i18n: {"en":"Cash gap > $20K — evaluate credit line or factoring."}, criticalMessage: "Cash gap > $50K — urgent cash management action needed.", criticalMessage_i18n: {"en":"Cash gap > $50K — urgent cash management action needed."} }],
  formulaPipeline: [
    { formulaId: "measurement.cash_inflow", inputMap: {
        salesRevenue: "monthlyRevenue"
      ,
        receivablesCollected: "receivablesCollected",
        otherIncome: "otherIncome"}, outputId: "cashInflow" },
    { formulaId: "measurement.cash_outflow", inputMap: {
        supplierPayments: "monthlyExpenses"
      ,
        payroll: "payroll",
        operatingExpenses: "operatingExpenses",
        taxPayment: "taxPayment"}, outputId: "cashOutflow" },
    { formulaId: "measurement.net_cash_flow", inputMap: { cashInflow: "cashInflow", cashOutflow: "cashOutflow" }, outputId: "netCashFlow" },
    { formulaId: "measurement.cumulative_cash", inputMap: {
        netCashFlow: "netCashFlow",
        openingBalance: "numMonths"
      }, outputId: "cumulativeCash" },
    { formulaId: "measurement.cash_gap", inputMap: { cumulativeCash: "cumulativeCash", netCashFlow: "netCashFlow" }, outputId: "cashGap" },
    { formulaId: "measurement.dso", inputMap: { accountsReceivable: "accountsReceivable", monthlyRevenue: "monthlyRevenue" ,
        annualRevenue: "annualRevenue"}, outputId: "dso" },
    { formulaId: "measurement.dpo", inputMap: { accountsPayable: "accountsPayable", cogsMonthly: "cogsMonthly" ,
        annualCOGS: "annualCOGS"}, outputId: "dpo" },
    { formulaId: "measurement.dio", inputMap: { inventoryValue: "inventoryValue", cogsMonthly: "cogsMonthly" ,
        inventory: "inventory",
        annualCOGS: "annualCOGS"}, outputId: "dio" },
    { formulaId: "measurement.cash_conversion_cycle", inputMap: { dso: "dso", dpo: "dpo", dio: "dio" }, outputId: "cashConversionCycle" },
  ],
  reportTemplate: { title: "Cash Flow Gap Report", title_i18n: {"en":"Cash Flow Gap Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["DSO = (Alacak/Gelir)×30 gun.", "CCC = DSO + DIO − DPO.", "Negatif kumulatif nakit = nakit acigi."],assumptionNotes_i18n:[{"en":"DSO = (Receivables/Revenue)×30 days."},{"en":"CCC = DSO + DIO − DPO."},{"en":"Negative cumulative cash = cash deficit."}]},
};
