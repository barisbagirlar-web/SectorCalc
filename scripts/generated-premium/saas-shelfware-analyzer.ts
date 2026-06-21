/**
 * SaaS Shelfware Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SAASSHELFWARE_SCHEMA: PremiumCalculatorSchema = {
  id: "saas-shelfware-analyzer",
  legacyPaidSlug: "saas-shelfware-analyzer",
  name: "SaaS Shelfware Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "SaaS Shelfware Maliyet — premium analysis tool.",
  inputs: [
    { id: "satin_alinan_lisans", label: "Satın Alınan Lisans", type: "number", required: true },
    { id: "aktif_kullanici", label: "Aktif Kullanıcı", type: "number", required: true },
    { id: "toplam_sozlesme_bedeli", label: "Toplam Sözleşme Bedeli", type: "number", required: true },
    { id: "tier_fiyat_farki", label: "Tier Fiyat Farkı", type: "number", required: true },
    { id: "kullanilantoplam_ozellik", label: "Kullanılan/Toplam Özellik", type: "number", required: true },
    { id: "asim_kullanim_bedeli", label: "Aşım Kullanım Bedeli", type: "number", required: true },
  ],
  outputs: [
    { id: "total_licenses", label: "Total Licenses", unit: "currency", format: "currency" },
    { id: "active_users", label: "Active Users", unit: "currency", format: "currency" },
    { id: "shelfware_pct", label: "Shelfware Pct", unit: "currency", format: "currency" },
    { id: "shelfware_cost", label: "Shelfware Cost", unit: "currency", format: "currency" },
    { id: "utilization_rate", label: "Utilization Rate", unit: "currency", format: "currency" },
    { id: "feature_adoption", label: "Feature Adoption", unit: "currency", format: "currency" },
    { id: "optimization_savings", label: "Optimization Savings", unit: "currency", format: "currency" },
    { id: "true_up_cost", label: "True Up Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_0", inputMap: { PurchasedLicenses: "purchased_licenses" }, outputId: "total_licenses" },
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_1", inputMap: { UsersLoggedInLast30Days: "users_logged_in_last30_days" }, outputId: "active_users" },
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_2", inputMap: { TotalLicenses: "total_licenses", ActiveUsers: "active_users" }, outputId: "shelfware_pct" },
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_3", inputMap: { ShelfwarePct: "shelfware_pct", TotalContractValue: "total_contract_value" }, outputId: "shelfware_cost" },
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_4", inputMap: { ActiveUsers: "active_users", TotalLicenses: "total_licenses" }, outputId: "utilization_rate" },
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_5", inputMap: { FeaturesUsed: "features_used", TotalFeatures: "total_features" }, outputId: "feature_adoption" },
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_6", inputMap: { ShelfwareCost: "shelfware_cost", UnderutilizedTierPriceDiff: "underutilized_tier_price_diff", Users: "users" }, outputId: "optimization_savings" },
    { formulaId: "custom.saas_shelfware_maliyet_analyzer_7", inputMap: { ActualUsage: "actual_usage", ContractedUsage: "contracted_usage", OverageRate: "overage_rate" }, outputId: "true_up_cost" },
  ],
  reportTemplate: {
    title: "SaaS Shelfware Maliyet Report",
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
