
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CLV_CAC_SCHEMA: PremiumCalculatorSchema = {
  id: "clv-cac-ratio-analyzer", legacyPaidSlug: "clv-cac-ratio-analyzer",
  name: "CLV to CAC Ratio Analyzer", name_i18n: {"en":"CLV to CAC Ratio Analyzer"}, sectorSlug: "ecommerce", category: "cost",
  painStatement: "The imbalance between customer Win Cost (CAC) and lifetime Value (CLV) leads to inefficient marketing budget use and profitability issues.", painStatement_i18n: {"en":"The imbalance between customer Win Cost (CAC) and lifetime Value (CLV) leads to inefficient marketing budget use and profitability issues."},
  inputs: [
    { id: "avgOrderValue", label: "Average order value (AOV)", label_i18n: {"en":"Average order value (AOV)"}, type: "number", unit: "USD", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "", expertMeaning: "Average order value (AOV)", expertMeaning_i18n: {"en":"Average order value (AOV)"} },
    { id: "purchaseFreq", label: "Purchase frequency per year", label_i18n: {"en":"Purchase frequency per year"}, type: "number", unit: "units/year", required: true, smartDefault: 6, validation: { min: 0.1 }, helper: "", expertMeaning: "Purchase frequency per year", expertMeaning_i18n: {"en":"Purchase frequency per year"} },
    { id: "lifespan", label: "Average customer lifespan (years)", label_i18n: {"en":"Average customer lifespan (years)"}, type: "number", unit: "years", required: true, smartDefault: 3, validation: { min: 0.5 }, helper: "", expertMeaning: "Average customer lifespan (years)", expertMeaning_i18n: {"en":"Average customer lifespan (years)"} },
    { id: "grossMarginPct", label: "Gross margin percentage", label_i18n: {"en":"Gross margin percentage"}, type: "number", unit: "%", required: true, smartDefault: 40, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Gross margin percentage", expertMeaning_i18n: {"en":"Gross margin percentage"} },
    { id: "retentionRate", label: "Annual retention rate", label_i18n: {"en":"Annual retention rate"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual retention rate", expertMeaning_i18n: {"en":"Annual retention rate"} },
    { id: "discountRate", label: "Discount rate for NPV", label_i18n: {"en":"Discount rate for NPV"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV"} },
    { id: "salesMarketing", label: "Total sales & marketing spend", label_i18n: {"en":"Total sales & marketing spend"}, type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Total sales & marketing spend", expertMeaning_i18n: {"en":"Total sales & marketing spend"} },
    { id: "salaries", label: "Sales team salaries", label_i18n: {"en":"Sales team salaries"}, type: "number", unit: "USD", required: false, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "Sales team salaries", expertMeaning_i18n: {"en":"Sales team salaries"} },
    { id: "overhead", label: "Genel Giderler", label_i18n: {"en":"Genel Giderler"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Allocated overhead", expertMeaning_i18n: {"en":"Allocated overhead"} },
    { id: "newCustomers", label: "New customers acquired", label_i18n: {"en":"New customers acquired"}, type: "number", unit: "people", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "New customers acquired", expertMeaning_i18n: {"en":"New customers acquired"} },
    { id: "avgMonthlyGpInput", label: "Avg monthly gross profit per customer", label_i18n: {"en":"Avg monthly gross profit per customer"}, type: "number", unit: "USD", required: false, smartDefault: 35, validation: { min: 0 }, helper: "", expertMeaning: "Avg monthly gross profit per customer", expertMeaning_i18n: {"en":"Avg monthly gross profit per customer"} },
  ],
  outputs: [
    { id: "clv", label: "CLV (Gross)", label_i18n: {"en":"CLV (Gross)"}, unit: "USD", format: "currency" },
    { id: "gmClv", label: "Gross Margin CLV", label_i18n: {"en":"Gross Margin CLV"}, unit: "USD", format: "currency" },
    { id: "discountedClv", label: "Iskontolu CLV", label_i18n: {"en":"Iskontolu CLV"}, unit: "USD", format: "currency" },
    { id: "cac", label: "CAC", label_i18n: {"en":"CAC"}, unit: "USD", format: "currency" },
    { id: "payback", label: "Payback Period", label_i18n: {"en":"Payback Period"}, unit: "months", format: "number" },
    { id: "ltvCac", label: "LTV/CAC Rate", label_i18n: {"en":"LTV/CAC Rate"}, unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "ltvCac", warning: 3, critical: 1, direction: "lower_is_bad", warningMessage: "LTV/CAC < 3 — marketing efficiency should be improved.", warningMessage_i18n: {"en":"LTV/CAC < 3 — marketing efficiency should be improved."}, criticalMessage: "LTV/CAC < 1 — every customer generates Loss, urgent strategy change needed.", criticalMessage_i18n: {"en":"LTV/CAC < 1 — every customer generates Loss, urgent strategy change needed."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.clv", inputMap: { avgOrderValue: "avgOrderValue", purchaseFreq: "purchaseFreq", lifespan: "lifespan" }, outputId: "clv" },
    { formulaId: "cost.gross_margin_clv", inputMap: { clv: "clv", grossMarginPct: "grossMarginPct" }, outputId: "gmClv" },
    { formulaId: "cost.discounted_clv", inputMap: {
        discountRate: "discountRate",
        retention: "gmClv",
        clv: "retentionRate",
        lifespan: "lifespan"
      }, outputId: "discountedClv" },
    { formulaId: "cost.cac", inputMap: { salesMarketing: "salesMarketing", salaries: "salaries", overhead: "overhead", newCustomers: "newCustomers" }, outputId: "cac" },
    { formulaId: "cost.payback", inputMap: {
        cac: "cac",
        avgOrderValue: "avgMonthlyGpInput"
      ,
        purchaseFreq: "purchaseFreq",
        grossMarginPct: "grossMarginPct"}, outputId: "payback" },
    { formulaId: "cost.ltv_cac", inputMap: { discountedClv: "discountedClv", cac: "cac" }, outputId: "ltvCac" },
  ],
  reportTemplate: { title: "CLV/CAC Ratio Report", title_i18n: {"en":"CLV/CAC Ratio Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["CLV = AOV × PurchaseFreq × Lifespan.", "DiscountedCLV uses retention rate churn model.", "CAC = (Sales+Marketing+Salaries+Overhead)/NewCustomers.", "LTV/CAC > 3 is healthy; < 1 is critical.", "Payback = CAC / MonthlyGrossProfit."],assumptionNotes_i18n:[{"en":"CLV = AOV × PurchaseFreq × Lifespan."},{"en":"DiscountedCLV uses retention rate churn model."},{"en":"CAC = (Sales+Marketing+Salaries+Overhead)/NewCustomers."},{"en":"LTV/CAC > 3 is healthy; < 1 is critical."},{"en":"Payback = CAC / MonthlyGrossProfit."}] },
};
