
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TRANSFER_PRICING_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "transfer-pricing-optimizer-analyzer", legacyPaidSlug: "transfer-pricing-optimizer-analyzer",
  name: "Transfer Pricing Optimizer", name_i18n: {"en":"Transfer Pricing Optimizer"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "If tax impact and global profit are not calculated in intercompany transfer pricing, optimization opportunities are missed.", painStatement_i18n: {"en":"If tax impact and global profit are not calculated in intercompany transfer pricing, optimization opportunities are missed."},
  inputs: [
    { id: "entityALocation", label: "Entity A country", label_i18n: {"en":"Entity A country"}, type: "select", unit: "scalar", required: true, smartDefault: "TR", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity A country", expertMeaning_i18n: {"en":"Entity A country"}, enumValues: ["TR", "DE", "US", "UK", "CN", "AE", "NL", "SG"] },
    { id: "entityBLocation", label: "Entity B country", label_i18n: {"en":"Entity B country"}, type: "select", unit: "scalar", required: true, smartDefault: "DE", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity B country", expertMeaning_i18n: {"en":"Entity B country"}, enumValues: ["TR", "DE", "US", "UK", "CN", "AE", "NL", "SG"] },
    { id: "transferAmount", label: "Intercompany transfer amount", label_i18n: {"en":"Intercompany transfer amount"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Intercompany transfer amount", expertMeaning_i18n: {"en":"Intercompany transfer amount"} },
    { id: "entityATaxRate", label: "Entity A tax rate", label_i18n: {"en":"Entity A tax rate"}, type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity A tax rate", expertMeaning_i18n: {"en":"Entity A tax rate"} },
    { id: "entityBTaxRate", label: "Entity B tax rate", label_i18n: {"en":"Entity B tax rate"}, type: "number", unit: "%", required: true, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity B tax rate", expertMeaning_i18n: {"en":"Entity B tax rate"} },
    { id: "transferPrice", label: "Actual transfer price", label_i18n: {"en":"Actual transfer price"}, type: "number", unit: "USD", required: false, smartDefault: 550000, validation: { min: 0 }, helper: "", expertMeaning: "Actual transfer price", expertMeaning_i18n: {"en":"Actual transfer price"} },
    { id: "armLengthPrice", label: "Arm's length market price", label_i18n: {"en":"Arm's length market price"}, type: "number", unit: "USD", required: false, smartDefault: 520000, validation: { min: 0 }, helper: "", expertMeaning: "Arm's length market price", expertMeaning_i18n: {"en":"Arm's length market price"} },
  ],
  outputs: [
    { id: "transferTaxImpact", label: "tax Etkisi", label_i18n: {"en":"tax Etkisi"}, unit: "USD", format: "currency" },
    { id: "transferGlobalProfit", label: "Global Profit", label_i18n: {"en":"Global Profit"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "transferTaxImpact", warning: 30000, critical: 75000, direction: "higher_is_bad", warningMessage: "Tax impact > $30K - transfer price should be optimized.", warningMessage_i18n: {"en":"Tax impact > $30K - transfer price should be optimized."}, criticalMessage: "Tax impact > $75K - tax consultancy is recommended.", criticalMessage_i18n: {"en":"Tax impact > $75K - tax consultancy is recommended."} }],
  formulaPipeline: [
    { formulaId: "cost.transfer_tax_impact", inputMap: {
        transferPrice: "transferPrice",
        entityATaxRate: "entityATaxRate",
        armLengthPrice: "transferAmount",
        entityBTaxRate: "entityBTaxRate"
      ,
        marketPrice: "marketPrice",
        taxRateDiff: "taxRateDiff"}, outputId: "transferTaxImpact" },
    { formulaId: "cost.transfer_global_profit", inputMap: { transferPrice: "transferPrice", armLengthPrice: "armLengthPrice", transferTaxImpact: "transferTaxImpact" ,
        sellerProfit: "sellerProfit",
        buyerProfit: "buyerProfit"}, outputId: "transferGlobalProfit" },
  ],
  reportTemplate: { title: "Transfer Pricing Optimization Report", title_i18n: {"en":"Transfer Pricing Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 18, assumptionNotes: ["Tax impact = (Price − Cost) × (TaxB − TaxA).", "Global profit = Arm's length adjusted for tax.", "Assumes arm's length compliance."],assumptionNotes_i18n:[{"en":"Tax impact = (Price − Cost) × (TaxB − TaxA)."},{"en":"Global profit = Arm's length adjusted for tax."},{"en":"Assumes arm's length compliance."}] },
};
