/**
 * Tool #21 — Muda Atık Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MUDA_WASTE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "muda-waste-cost-analyzer", legacyPaidSlug: "muda-waste-cost-analyzer",
  name: "Muda Atık Maliyet Analizi", sectorSlug: "quality", category: "cost",
  painStatement: "7 muda kaynağının her biri ayrı hesaplanmazsa toplam israf maliyeti gizli kalır ve iyileştirme önceliklendirilemez.",
  inputs: [
    { id: "overproductionCost", label: "Aşırı Üretim Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Overproduction waste cost" },
    { id: "waitingCost", label: "Bekleme Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Waiting waste cost" },
    { id: "transportCost", label: "Gereksiz Taşıma Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 12000, validation: { min: 0 }, helper: "", expertMeaning: "Unnecessary transport cost" },
    { id: "overprocessingCost", label: "Gereksiz İşlem Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Overprocessing waste cost" },
    { id: "inventoryCost", label: "Fazla Stok Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 20000, validation: { min: 0 }, helper: "", expertMeaning: "Excess inventory cost" },
    { id: "motionCost", label: "Gereksiz Hareket Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Unnecessary motion cost" },
    { id: "defectCost", label: "Hata/Defo Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "Defect/rework cost" },
  ],
  outputs: [
    { id: "mudaOverproduction", label: "Aşırı Üretim İsrafı", unit: "USD/yıl", format: "currency" },
    { id: "mudaWaiting", label: "Bekleme İsrafı", unit: "USD/yıl", format: "currency" },
    { id: "mudaTransport", label: "Taşıma İsrafı", unit: "USD/yıl", format: "currency" },
    { id: "mudaOverprocessing", label: "Gereksiz İşlem İsrafı", unit: "USD/yıl", format: "currency" },
    { id: "mudaInventory", label: "Stok İsrafı", unit: "USD/yıl", format: "currency" },
    { id: "mudaMotion", label: "Hareket İsrafı", unit: "USD/yıl", format: "currency" },
    { id: "mudaDefects", label: "Hata İsrafı", unit: "USD/yıl", format: "currency" },
    { id: "mudaTotal", label: "Toplam Muda Maliyeti", unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "mudaTotal", warning: 50000, critical: 120000, direction: "higher_is_bad", warningMessage: "Toplam muda > $50K — yalın dönüşüm programı başlatılmalı.", criticalMessage: "Toplam muda > $120K — acil kaizen atölyesi planlanmalı." }],
  formulaPipeline: [
    { formulaId: "cost.muda_overproduction", inputMap: { overproductionCost: "overproductionCost" }, outputId: "mudaOverproduction" },
    { formulaId: "cost.muda_waiting", inputMap: { waitingCost: "waitingCost" }, outputId: "mudaWaiting" },
    { formulaId: "cost.muda_transport", inputMap: { transportCost: "transportCost" }, outputId: "mudaTransport" },
    { formulaId: "cost.muda_overprocessing", inputMap: { overprocessingCost: "overprocessingCost" }, outputId: "mudaOverprocessing" },
    { formulaId: "cost.muda_inventory", inputMap: { inventoryCost: "inventoryCost" }, outputId: "mudaInventory" },
    { formulaId: "cost.muda_motion", inputMap: { motionCost: "motionCost" }, outputId: "mudaMotion" },
    { formulaId: "cost.muda_defects", inputMap: { defectCost: "defectCost" }, outputId: "mudaDefects" },
    { formulaId: "cost.muda_total", inputMap: { mudaOverproduction: "mudaOverproduction", mudaWaiting: "mudaWaiting", mudaTransport: "mudaTransport", mudaOverprocessing: "mudaOverprocessing", mudaInventory: "mudaInventory", mudaMotion: "mudaMotion", mudaDefects: "mudaDefects" }, outputId: "mudaTotal" },
  ],
  reportTemplate: { title: "Muda Waste Cost Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["7 muda kaynağı ayrı ayrı girilir.", "Toplam israf = Σ(her bir muda kalemi).", "Pareto analizi ile önceliklendirme yapılmalıdır."] },
};
