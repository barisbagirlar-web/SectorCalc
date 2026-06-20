/**
 * Tool #30 — Transfer Fiyatlandırması
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TRANSFER_PRICING_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "transfer-pricing-optimizer-analyzer", legacyPaidSlug: "transfer-pricing-optimizer-analyzer",
  name: "Transfer Fiyatlandırması Optimizasyonu", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Şirketler arası transfer fiyatlandırmasında vergi etkisi ve global kâr hesaplanmazsa optimizasyon fırsatı kaçar.",
  inputs: [
    { id: "entityALocation", label: "A Şirketi Ülke", type: "select", unit: "", required: true, smartDefault: "TR", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity A country", enumValues: ["TR", "DE", "US", "UK", "CN", "AE", "NL", "SG"] },
    { id: "entityBLocation", label: "B Şirketi Ülke", type: "select", unit: "", required: true, smartDefault: "DE", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity B country", enumValues: ["TR", "DE", "US", "UK", "CN", "AE", "NL", "SG"] },
    { id: "transferAmount", label: "Transfer Tutarı", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Intercompany transfer amount" },
    { id: "entityATaxRate", label: "A Şirketi Vergi Oranı", type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity A tax rate" },
    { id: "entityBTaxRate", label: "B Şirketi Vergi Oranı", type: "number", unit: "%", required: true, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Entity B tax rate" },
    { id: "transferPrice", label: "Transfer Fiyatı", type: "number", unit: "USD", required: false, smartDefault: 550000, validation: { min: 0 }, helper: "", expertMeaning: "Actual transfer price" },
    { id: "armLengthPrice", label: "Piyasa (Arm's Length) Fiyatı", type: "number", unit: "USD", required: false, smartDefault: 520000, validation: { min: 0 }, helper: "", expertMeaning: "Arm's length market price" },
  ],
  outputs: [
    { id: "transferTaxImpact", label: "Vergi Etkisi", unit: "USD", format: "currency" },
    { id: "transferGlobalProfit", label: "Global Kâr", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "transferTaxImpact", warning: 30000, critical: 75000, direction: "higher_is_bad", warningMessage: "Vergi etkisi > $30K — transfer fiyatı optimize edilmeli.", criticalMessage: "Vergi etkisi > $75K — vergi danışmanlığı önerilir." }],
  formulaPipeline: [
    { formulaId: "cost.transfer_tax_impact", inputMap: { transferAmount: "transferAmount", transferPrice: "transferPrice", entityATaxRate: "entityATaxRate", entityBTaxRate: "entityBTaxRate" }, outputId: "transferTaxImpact" },
    { formulaId: "cost.transfer_global_profit", inputMap: { transferPrice: "transferPrice", armLengthPrice: "armLengthPrice", transferTaxImpact: "transferTaxImpact" }, outputId: "transferGlobalProfit" },
  ],
  reportTemplate: { title: "Transfer Pricing Optimization Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 18, assumptionNotes: ["Tax impact = (Price − Cost) × (TaxB − TaxA).", "Global profit = Arm's length adjusted for tax.", "Assumes arm's length compliance."] },
};
