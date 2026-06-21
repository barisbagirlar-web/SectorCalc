/**
 * Mağaza Saatlik Ücret — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SHOPHOURLYRATE_SCHEMA: PremiumCalculatorSchema = {
  id: "shop-hourly-rate-analyzer",
  legacyPaidSlug: "shop-hourly-rate-analyzer",
  name: "Mağaza Saatlik Ücret",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Mağaza Saatlik Ücret — premium analysis tool.",
  inputs: [
    { id: "teknisyenidari_ucretler", label: "Teknisyen/İdari Ücretler", type: "number", required: true },
    { id: "faturalanabilir_saat_hedefi", label: "Faturalanabilir Saat Hedefi", type: "number", required: true },
    { id: "kirafaturasigorta", label: "Kira/Fatura/Sigorta", type: "number", required: true },
    { id: "amortisman", label: "Amortisman", type: "number", required: true },
    { id: "hedef_kr_marji", label: "Hedef Kâr Marjı", type: "number", required: true },
    { id: "gercek_faturalama_ucreti", label: "Gerçek Faturalama Ücreti", type: "number", required: true },
  ],
  outputs: [
    { id: "direct_labor", label: "Direct Labor", unit: "currency", format: "currency" },
    { id: "indirect_labor", label: "Indirect Labor", unit: "currency", format: "currency" },
    { id: "overhead", label: "Overhead", unit: "currency", format: "currency" },
    { id: "total_shop_cost", label: "Total Shop Cost", unit: "currency", format: "currency" },
    { id: "billable_hours", label: "Billable Hours", unit: "currency", format: "currency" },
    { id: "shop_hourly_rate", label: "Shop Hourly Rate", unit: "currency", format: "currency" },
    { id: "effective_margin", label: "Effective Margin", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.magaza_saatlik_ucret_analyzer_0", inputMap: { TechnicianWages: "technician_wages" }, outputId: "direct_labor" },
    { formulaId: "custom.magaza_saatlik_ucret_analyzer_1", inputMap: { ManagerWages: "manager_wages", AdminWages: "admin_wages" }, outputId: "indirect_labor" },
    { formulaId: "custom.magaza_saatlik_ucret_analyzer_2", inputMap: { Rent: "rent", Utilities: "utilities", Insurance: "insurance", Tools: "tools", Depreciation: "depreciation" }, outputId: "overhead" },
    { formulaId: "custom.magaza_saatlik_ucret_analyzer_3", inputMap: { DirectLabor: "direct_labor", IndirectLabor: "indirect_labor", Overhead: "overhead" }, outputId: "total_shop_cost" },
    { formulaId: "custom.magaza_saatlik_ucret_analyzer_4", inputMap: { TotalAvailableHours: "total_available_hours", UtilizationRate: "utilization_rate" }, outputId: "billable_hours" },
    { formulaId: "custom.magaza_saatlik_ucret_analyzer_5", inputMap: { TotalShopCost: "total_shop_cost", BillableHours: "billable_hours" }, outputId: "shop_hourly_rate" },
    { formulaId: "custom.magaza_saatlik_ucret_analyzer_6", inputMap: { ActualBillingRate: "actual_billing_rate", ShopHourlyRate: "shop_hourly_rate" }, outputId: "effective_margin" },
  ],
  reportTemplate: {
    title: "Mağaza Saatlik Ücret Report",
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
