
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CASH_FLOW_GAP_SCHEMA: PremiumCalculatorSchema = {
  id: "cash-flow-gap-analyzer", legacyPaidSlug: "cash-flow-gap-analyzer",
  name: "Cash Flow Gap Analysis", name_i18n: {"en":"Cash Flow Gap Analysis"}, sectorSlug: "financial-planning", category: "measurement",
  painStatement: "Cash flow gap, DSO/DPO/DIO balance, and cash cycle - if not calculated, liquidity crisis cannot be detected beforehand.", painStatement_i18n: {"en":"Cash flow gap, DSO/DPO/DIO balance, and cash cycle - if not calculated, liquidity crisis cannot be detected beforehand."},
  inputs: [
    {
      id: "annualCOGS",
      label: "Annual C O G S",
      label_i18n: { en: "Annual C O G S" },
      type: "number",
      unit: "-",

      group: "General"
    },
    {
      id: "annualRevenue",
      label: "Annual Revenue",
      label_i18n: { en: "Annual Revenue" },
      type: "number",
      unit: "-",

      group: "General"
    },
    {
      id: "taxPayment",
      label: "Tax Payment",
      label_i18n: { en: "Tax Payment" },
      type: "number",
      unit: "-",

      group: "General"
    },
    {
      id: "operatingExpenses",
      label: "Operating Expenses",
      label_i18n: { en: "Operating Expenses" },
      type: "number",
      unit: "-",

      group: "General"
    },
    {
      id: "payroll",
      label: "Payroll",
      label_i18n: { en: "Payroll" },
      type: "number",
      unit: "-",

      group: "General"
    },
    {
      id: "otherIncome",
      label: "Other Income",
      label_i18n: { en: "Other Income" },
      type: "number",
      unit: "-",

      group: "General"
    },
    { id: "monthlyRevenue", label: "Monthly Revenue", label_i18n: {"en":"Monthly Revenue"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly revenue", expertMeaning_i18n: {"en":"Monthly revenue"} },
    { id: "monthlyExpenses", label: "Monthly Expenses", label_i18n: {"en":"Monthly Expenses"}, type: "number", unit: "USD", required: true, smartDefault: 85000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly expenses", expertMeaning_i18n: {"en":"Monthly expenses"} },
    { id: "accountsReceivable", label: "Accounts Receivable", label_i18n: {"en":"Accounts Receivable"}, type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts receivable", expertMeaning_i18n: {"en":"Accounts receivable"} },
    { id: "accountsPayable", label: "Accounts Payable", label_i18n: {"en":"Accounts Payable"}, type: "number", unit: "USD", required: true, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts payable", expertMeaning_i18n: {"en":"Accounts payable"} },
    { id: "inventoryValue", label: "Inventory Value", label_i18n: {"en":"Inventory Value"}, type: "number", unit: "USD", required: true, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "Inventory value", expertMeaning_i18n: {"en":"Inventory value"} },
    { id: "cogsMonthly", label: "Monthly COGS", label_i18n: {"en":"Monthly COGS"}, type: "number", unit: "USD", required: true, smartDefault: 60000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly COGS", expertMeaning_i18n: {"en":"Monthly COGS"} },
    { id: "numMonths", label: "Projection Months", label_i18n: {"en":"Projection Months"}, type: "number", unit: "months", required: false, smartDefault: 6, validation: { min: 1, max: 24 }, helper: "", expertMeaning: "Projection months", expertMeaning_i18n: {"en":"Projection months"} },
  ],
  outputs: [
    { id: "cashInflow", label: "Aylk cash Girisi", label_i18n: {"en":"Aylk cash Girisi"}, unit: "USD", format: "currency" },
    { id: "cashOutflow", label: "Aylk cash Cks", label_i18n: {"en":"Aylk cash Cks"}, unit: "USD", format: "currency" },
    { id: "netCashFlow", label: "Net cash Aks", label_i18n: {"en":"Net cash Aks"}, unit: "USD/month", format: "currency" },
    { id: "cumulativeCash", label: "Kumulatif cash", label_i18n: {"en":"Kumulatif cash"}, unit: "USD", format: "currency" },
    { id: "cashGap", label: "cash Acg", label_i18n: {"en":"cash Acg"}, unit: "USD", format: "currency" },
    { id: "dso", label: "DSO (Receivable Gun Duration)", label_i18n: {"en":"DSO (Receivable Gun Duration)"}, unit: "days", format: "number" },
    { id: "dpo", label: "DPO (Borc Gun Duration)", label_i18n: {"en":"DPO (Borc Gun Duration)"}, unit: "days", format: "number" },
    { id: "dio", label: "DIO (Inventory Gun Duration)", label_i18n: {"en":"DIO (Inventory Gun Duration)"}, unit: "days", format: "number" },
    { id: "cashConversionCycle", label: "cash Donusum Dongusu", label_i18n: {"en":"cash Donusum Dongusu"}, unit: "days", format: "number" },
  ],
  thresholds: [{ fieldId: "cashGap", warning: 20000, critical: 50000, direction: "higher_is_bad", warningMessage: "Cash gap > $20K - evaluate credit line or factoring.", warningMessage_i18n: {"en":"Cash gap > $20K - evaluate credit line or factoring."}, criticalMessage: "Cash gap > $50K - urgent cash management action needed.", criticalMessage_i18n: {"en":"Cash gap > $50K - urgent cash management action needed."} }],
  formulaPipeline: [
    { formulaId: "measurement.cash_inflow", inputMap: {
        salesRevenue: "monthlyRevenue"
      ,
        receivablesCollected: "accountsReceivable",
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
    { formulaId: "measurement.dso", inputMap: { avgReceivables: "accountsReceivable", monthlyRevenue: "monthlyRevenue" ,
        annualRevenue: "annualRevenue"}, outputId: "dso" },
    { formulaId: "measurement.dpo", inputMap: { accountsPayable: "accountsPayable", cogsMonthly: "cogsMonthly" ,
        annualCOGS: "annualCOGS"}, outputId: "dpo" },
    { formulaId: "measurement.dio", inputMap: { inventoryValue: "inventoryValue", cogsMonthly: "cogsMonthly" ,
        inventory: "inventoryValue",
        annualCOGS: "annualCOGS"}, outputId: "dio" },
    { formulaId: "measurement.cash_conversion_cycle", inputMap: { dso: "dso", dpo: "dpo", dio: "dio" }, outputId: "cashConversionCycle" },
  ],
  reportTemplate: { title: "Cash Flow Gap Report", title_i18n: {"en":"Cash Flow Gap Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["DSO = (Alacak/Gelir)×30 gun.", "CCC = DSO + DIO − DPO.", "Negatif kumulatif nakit = nakit acigi."],assumptionNotes_i18n:[{"en":"DSO = (Receivables/Revenue)×30 days."},{"en":"CCC = DSO + DIO − DPO."},{"en":"Negative cumulative cash = cash deficit."}]},
};
