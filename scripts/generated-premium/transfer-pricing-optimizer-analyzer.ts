/**
 * Transfer Fiyatlandırması Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TRANSFERPRICINGOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "transfer-pricing-optimizer-analyzer",
  legacyPaidSlug: "transfer-pricing-optimizer-analyzer",
  name: "Transfer Fiyatlandırması Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Transfer Fiyatlandırması Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "karsilastirilabilir_piyasa_fiyati", label: "Karşılaştırılabilir Piyasa Fiyatı", type: "number", required: true },
    { id: "yuksekdusuk_vergi_oranlari", label: "Yüksek/Düşük Vergi Oranları", type: "number", required: true },
    { id: "tam_maliyetdegisken_maliyet", label: "Tam Maliyet/Değişken Maliyet", type: "number", required: true },
    { id: "firsat_maliyeti", label: "Fırsat Maliyeti", type: "number", required: true },
    { id: "hedef_marj", label: "Hedef Marj", type: "number", required: true },
    { id: "duzenleyici_ceza_riski", label: "Düzenleyici Ceza Riski", type: "number", required: true },
  ],
  outputs: [
    { id: "cost_plus_price", label: "Cost Plus Price", unit: "currency", format: "currency" },
    { id: "market_based_price", label: "Market Based Price", unit: "currency", format: "currency" },
    { id: "marginal_cost", label: "Marginal Cost", unit: "currency", format: "currency" },
    { id: "tax_impact", label: "Tax Impact", unit: "currency", format: "currency" },
    { id: "global_profit", label: "Global Profit", unit: "currency", format: "currency" },
    { id: "optimal_transfer_price", label: "Optimal Transfer Price", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.transfer_fiyatlandirmasi_optimize_edici_analyzer_0", inputMap: { FullCost: "full_cost", MarkupPct: "markup_pct" }, outputId: "cost_plus_price" },
    { formulaId: "custom.transfer_fiyatlandirmasi_optimize_edici_analyzer_1", inputMap: { ComparableUncontrolledPrice: "comparable_uncontrolled_price" }, outputId: "market_based_price" },
    { formulaId: "custom.transfer_fiyatlandirmasi_optimize_edici_analyzer_2", inputMap: { VariableCost: "variable_cost", OpportunityCost: "opportunity_cost" }, outputId: "marginal_cost" },
    { formulaId: "custom.transfer_fiyatlandirmasi_optimize_edici_analyzer_3", inputMap: { TransferPrice: "transfer_price", ArmLengthPrice: "arm_length_price", TaxRate_High: "tax_rate__high", TaxRate_Low: "tax_rate__low" }, outputId: "tax_impact" },
    { formulaId: "custom.transfer_fiyatlandirmasi_optimize_edici_analyzer_4", inputMap: { Revenue_Final: "revenue__final", Cost_Origin: "cost__origin", Cost_Transfer: "cost__transfer", TaxImpact: "tax_impact" }, outputId: "global_profit" },
    { formulaId: "custom.transfer_fiyatlandirmasi_optimize_edici_analyzer_5", inputMap: { Price: "price", that: "that", MAXIMIZES: "m_a_x_i_m_i_z_e_s", GlobalProfit: "global_profit", subject: "subject", to: "to", TaxRegulations: "tax_regulations" }, outputId: "optimal_transfer_price" },
  ],
  reportTemplate: {
    title: "Transfer Fiyatlandırması Optimize Edici Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
