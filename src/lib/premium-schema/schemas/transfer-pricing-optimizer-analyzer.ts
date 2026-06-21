/**
 * Tool #30 — Transfer Fiyatlandırması
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TRANSFER_PRICING_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "transfer-pricing-optimizer-analyzer", legacyPaidSlug: "transfer-pricing-optimizer-analyzer",
  name: "Transfer Fiyatlandırması Optimizasyonu", name_i18n: {"en":"Transfer Fiyatlandırması Optimizasyonu","tr":"Transfer Fiyatlandırması Optimizasyonu"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Şirketler arası transfer fiyatlandırmasında vergi etkisi ve global kâr hesaplanmazsa optimizasyon fırsatı kaçar.", painStatement_i18n: {"en":"Şirketler arası transfer fiyatlandırmasında vergi etkisi ve global kâr hesaplanmazsa optimizasyon fırsatı kaçar.","tr":"Şirketler arası transfer fiyatlandırmasında vergi etkisi ve global kâr hesaplanmazsa optimizasyon fırsatı kaçar."},
  inputs: [
    { id: "entityALocation", label: "A Şirketi Ülke", label_i18n: {"en":"A Şirketi Ülke","tr":"A Şirketi Ülke"}, type: "select", unit: "", required: true, smartDefault: "TR", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity A country", expertMeaning_i18n: {"en":"Entity A country","tr":"Entity A country"}, enumValues: ["TR", "DE", "US", "UK", "CN", "AE", "NL", "SG"] },
    { id: "entityBLocation", label: "B Şirketi Ülke", label_i18n: {"en":"B Şirketi Ülke","tr":"B Şirketi Ülke"}, type: "select", unit: "", required: true, smartDefault: "DE", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity B country", expertMeaning_i18n: {"en":"Entity B country","tr":"Entity B country"}, enumValues: ["TR", "DE", "US", "UK", "CN", "AE", "NL", "SG"] },
    { id: "transferAmount", label: "Transfer Tutarı", label_i18n: {"en":"Transfer Tutarı","tr":"Transfer Tutarı"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Intercompany transfer amount", expertMeaning_i18n: {"en":"Intercompany transfer amount","tr":"Intercompany transfer amount"} },
    { id: "entityATaxRate", label: "A Şirketi Vergi Oranı", label_i18n: {"en":"A Şirketi Vergi Oranı","tr":"A Şirketi Vergi Oranı"}, type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity A tax rate", expertMeaning_i18n: {"en":"Entity A tax rate","tr":"Entity A tax rate"} },
    { id: "entityBTaxRate", label: "B Şirketi Vergi Oranı", label_i18n: {"en":"B Şirketi Vergi Oranı","tr":"B Şirketi Vergi Oranı"}, type: "number", unit: "%", required: true, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity B tax rate", expertMeaning_i18n: {"en":"Entity B tax rate","tr":"Entity B tax rate"} },
    { id: "transferPrice", label: "Transfer Fiyatı", label_i18n: {"en":"Transfer Fiyatı","tr":"Transfer Fiyatı"}, type: "number", unit: "USD", required: false, smartDefault: 550000, validation: { min: 0 }, helper: "", expertMeaning: "Actual transfer price", expertMeaning_i18n: {"en":"Actual transfer price","tr":"Actual transfer price"} },
    { id: "armLengthPrice", label: "Piyasa (Arm's Length) Fiyatı", label_i18n: {"en":"Piyasa (Arm's Length) Fiyatı","tr":"Piyasa (Arm's Length) Fiyatı"}, type: "number", unit: "USD", required: false, smartDefault: 520000, validation: { min: 0 }, helper: "", expertMeaning: "Arm's length market price", expertMeaning_i18n: {"en":"Arm's length market price","tr":"Arm's length market price"} },
  ],
  outputs: [
    { id: "transferTaxImpact", label: "Vergi Etkisi", label_i18n: {"en":"Vergi Etkisi","tr":"Vergi Etkisi"}, unit: "USD", format: "currency" },
    { id: "transferGlobalProfit", label: "Global Kâr", label_i18n: {"en":"Global Kâr","tr":"Global Kâr"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "transferTaxImpact", warning: 30000, critical: 75000, direction: "higher_is_bad", warningMessage: "Vergi etkisi > $30K — transfer fiyatı optimize edilmeli.", warningMessage_i18n: {"en":"Vergi etkisi > $30K — transfer fiyatı optimize edilmeli.","tr":"Vergi etkisi > $30K — transfer fiyatı optimize edilmeli."}, criticalMessage: "Vergi etkisi > $75K — vergi danışmanlığı önerilir.", criticalMessage_i18n: {"en":"Vergi etkisi > $75K — vergi danışmanlığı önerilir.","tr":"Vergi etkisi > $75K — vergi danışmanlığı önerilir."} }],
  formulaPipeline: [
    { formulaId: "cost.transfer_tax_impact", inputMap: { transferAmount: "transferAmount", transferPrice: "transferPrice", entityATaxRate: "entityATaxRate", entityBTaxRate: "entityBTaxRate" }, outputId: "transferTaxImpact" },
    { formulaId: "cost.transfer_global_profit", inputMap: { transferPrice: "transferPrice", armLengthPrice: "armLengthPrice", transferTaxImpact: "transferTaxImpact" }, outputId: "transferGlobalProfit" },
  ],
  reportTemplate: { title: "Transfer Pricing Optimization Report", title_i18n: {"en":"Transfer Pricing Optimization Report","tr":"Transfer Pricing Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 18, assumptionNotes: ["Tax impact = (Price − Cost) × (TaxB − TaxA).", "Global profit = Arm's length adjusted for tax.", "Assumes arm's length compliance."],assumptionNotes_i18n:[{"en":"Tax impact = (Price − Cost) × (TaxB − TaxA).","tr":"Tax impact = (Price − Cost) × (TaxB − TaxA)."},{"en":"Global profit = Arm's length adjusted for tax.","tr":"Global profit = Arm's length adjusted for tax."},{"en":"Assumes arm's length compliance.","tr":"Assumes arm's length compliance."}] },
};
