/**
 * Tool #28 — Tohum Oranı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SEED_RATE_SCHEMA: PremiumCalculatorSchema = {
  id: "seed-rate-analyzer", legacyPaidSlug: "seed-rate-analyzer",
  name: "Tohum Oranı ve Maliyet Analizi", name_i18n: {"en":"Seed Rate and Cost Analysis","tr":"Tohum Oranı ve Maliyet Analizi"}, sectorSlug: "food", category: "cost",
  painStatement: "Tohum oranı ve çimlenme kaybı hesaplanmazsa ekim maliyeti gereksiz artar ve verim düşer.", painStatement_i18n: {"en":"If seed rate and germination loss are not calculated, planting cost increases unnecessarily and yield drops.","tr":"Tohum oranı ve çimlenme kaybı hesaplanmazsa ekim maliyeti gereksiz artar ve verim düşer."},
  inputs: [
    { id: "fieldArea", label: "Tarla Alanı", label_i18n: {"en":"Tarla Alanı","tr":"Tarla Alanı"}, type: "number", unit: "dekar", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Field area in decares", expertMeaning_i18n: {"en":"Field area in decares","tr":"Field area in decares"} },
    { id: "seedPerDecare", label: "Dekar Başına Tohum", label_i18n: {"en":"Dekar Başına Tohum","tr":"Dekar Başına Tohum"}, type: "number", unit: "kg/dekar", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Seed rate per decare", expertMeaning_i18n: {"en":"Seed rate per decare","tr":"Seed rate per decare"} },
    { id: "seedUnitCost", label: "Tohum Birim Maliyeti", label_i18n: {"en":"Tohum Birim Maliyeti","tr":"Tohum Birim Maliyeti"}, type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0.01 }, helper: "", expertMeaning: "Seed cost per kg", expertMeaning_i18n: {"en":"Seed cost per kg","tr":"Seed cost per kg"} },
    { id: "germinationRate", label: "Çimlenme Oranı", label_i18n: {"en":"Çimlenme Oranı","tr":"Çimlenme Oranı"}, type: "number", unit: "%", required: true, smartDefault: 90, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected germination rate", expertMeaning_i18n: {"en":"Expected germination rate","tr":"Expected germination rate"} },
    { id: "wasteRateSeeds", label: "Tohum Fire Oranı", label_i18n: {"en":"Tohum Fire Oranı","tr":"Tohum Fire Oranı"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Seed waste percentage", expertMeaning_i18n: {"en":"Seed waste percentage","tr":"Seed waste percentage"} },
    { id: "desiredStandCount", label: "Hedef Bitki Sayısı", label_i18n: {"en":"Hedef Bitki Sayısı","tr":"Hedef Bitki Sayısı"}, type: "number", unit: "adet/dekar", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Target plant stand per decare", expertMeaning_i18n: {"en":"Target plant stand per decare","tr":"Target plant stand per decare"} },
  ],
  outputs: [
    { id: "seedRequirement", label: "Toplam Tohum İhtiyacı", label_i18n: {"en":"Total Seed Requirement","tr":"Toplam Tohum İhtiyacı"}, unit: "kg", format: "number" },
    { id: "seedCostTotal", label: "Toplam Tohum Maliyeti", label_i18n: {"en":"Toplam Tohum Maliyeti","tr":"Toplam Tohum Maliyeti"}, unit: "USD", format: "currency" },
    { id: "seedFinancialLoss", label: "Fire ve Çimlenme Kaybı", label_i18n: {"en":"Waste and Germination Loss","tr":"Fire ve Çimlenme Kaybı"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "seedFinancialLoss", warning: 1000, critical: 3000, direction: "higher_is_bad", warningMessage: "Tohum kaybı > $1K — ekim hassasiyeti artırılmalı.", warningMessage_i18n: {"en":"Seed loss > $1K — increase planting precision.","tr":"Tohum kaybı > $1K — ekim hassasiyeti artırılmalı."}, criticalMessage: "Tohum kaybı > $3K — tohum kalitesi ve ekim yöntemi gözden geçirilmeli.", criticalMessage_i18n: {"en":"Seed loss > $3K — review seed quality and planting method.","tr":"Tohum kaybı > $3K — tohum kalitesi ve ekim yöntemi gözden geçirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.seed_requirement", inputMap: { fieldArea: "fieldArea", seedPerDecare: "seedPerDecare", germinationRate: "germinationRate", wasteRateSeeds: "wasteRateSeeds" }, outputId: "seedRequirement" },
    { formulaId: "cost.seed_cost_total", inputMap: { seedRequirement: "seedRequirement", seedUnitCost: "seedUnitCost" }, outputId: "seedCostTotal" },
    { formulaId: "cost.seed_financial_loss", inputMap: { seedCostTotal: "seedCostTotal", germinationRate: "germinationRate", wasteRateSeeds: "wasteRateSeeds" }, outputId: "seedFinancialLoss" },
  ],
  reportTemplate: { title: "Seed Rate & Cost Report", title_i18n: {"en":"Seed Rate & Cost Report","tr":"Tohum Oranı ve Maliyet Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 20, assumptionNotes: ["Seed req. = Area × Rate / (Germ% × (1−Waste%)).", "Total cost = Requirement × UnitCost.", "Loss = Cost × (1 − Germ%) + Waste adjustment."],assumptionNotes_i18n:[{"en":"Seed req. = Area × Rate / (Germ% × (1−Waste%)).","tr":"Tohum iht. = Alan × Oran / (Çimlenme% × (1−Fire%))."},{"en":"Total cost = Requirement × UnitCost.","tr":"Toplam maliyet = İhtiyaç × BirimMaliyet."},{"en":"Loss = Cost × (1 − Germ%) + Waste adjustment.","tr":"Kayıp = Maliyet × (1 − Çimlenme%) + Fire düzeltmesi."}] },
};
