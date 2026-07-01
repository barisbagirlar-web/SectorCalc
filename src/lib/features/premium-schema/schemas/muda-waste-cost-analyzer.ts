/**
 * Tool #21 — Muda Atık Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MUDA_WASTE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "muda-waste-cost-analyzer", legacyPaidSlug: "muda-waste-cost-analyzer",
  name: "Muda Atık Maliyet Analizi", name_i18n: {"en":"Muda Waste Cost Analysis"}, sectorSlug: "quality", category: "cost",
  painStatement: "7 muda kaynağının her biri ayrı hesaplanmazsa toplam israf maliyeti gizli kalır ve iyileştirme önceliklendirilemez.", painStatement_i18n: {"en":"7 muda kaynağının her biri ayrı hesaplanmazsa toplam israf maliyeti gizli kalır ve iyileştirme önceliklendirilemez."},
  inputs: [
    { id: "overproductionCost", label: "Aşırı Üretim Maliyeti", label_i18n: {"en":"Overproduction Cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Overproduction waste cost", expertMeaning_i18n: {"en":"Overproduction waste cost"} },
    { id: "waitingCost", label: "Bekleme Maliyeti", label_i18n: {"en":"Waiting Cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Waiting waste cost", expertMeaning_i18n: {"en":"Waiting waste cost"} },
    { id: "transportCost", label: "Gereksiz Taşıma Maliyeti", label_i18n: {"en":"Unnecessary Transport Cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 12000, validation: { min: 0 }, helper: "", expertMeaning: "Unnecessary transport cost", expertMeaning_i18n: {"en":"Unnecessary transport cost"} },
    { id: "overprocessingCost", label: "Gereksiz İşlem Maliyeti", label_i18n: {"en":"Overprocessing Cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Overprocessing waste cost", expertMeaning_i18n: {"en":"Overprocessing waste cost"} },
    { id: "inventoryCost", label: "Fazla Stok Maliyeti", label_i18n: {"en":"Excess Inventory Cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 20000, validation: { min: 0 }, helper: "", expertMeaning: "Excess inventory cost", expertMeaning_i18n: {"en":"Excess inventory cost"} },
    { id: "motionCost", label: "Gereksiz Hareket Maliyeti", label_i18n: {"en":"Unnecessary Motion Cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Unnecessary motion cost", expertMeaning_i18n: {"en":"Unnecessary motion cost"} },
    { id: "defectCost", label: "Hata/Defo Maliyeti", label_i18n: {"en":"Defect/Rework Cost"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "Defect/rework cost", expertMeaning_i18n: {"en":"Defect/rework cost"} },
  ],
  outputs: [
    { id: "mudaOverproduction", label: "Aşırı Üretim İsrafı", label_i18n: {"en":"Asr Uretim Israf"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaWaiting", label: "Bekleme İsrafı", label_i18n: {"en":"Bekleme Israf"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaTransport", label: "Taşıma İsrafı", label_i18n: {"en":"Tasma Israf"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaOverprocessing", label: "Gereksiz İşlem İsrafı", label_i18n: {"en":"Gereksiz Islem Israf"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaInventory", label: "Stok İsrafı", label_i18n: {"en":"Stok Israf"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaMotion", label: "Hareket İsrafı", label_i18n: {"en":"Hareket Israf"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaDefects", label: "Hata İsrafı", label_i18n: {"en":"Hata Israf"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaTotal", label: "Toplam Muda Maliyeti", label_i18n: {"en":"Toplam Muda Maliyeti"}, unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "mudaTotal", warning: 50000, critical: 120000, direction: "higher_is_bad", warningMessage: "Toplam muda > $50K — yalın dönüşüm programı başlatılmalı.", warningMessage_i18n: {"en":"Toplam muda > $50K — yalın dönüşüm programı başlatılmalı."}, criticalMessage: "Toplam muda > $120K — acil kaizen atölyesi planlanmalı.", criticalMessage_i18n: {"en":"Toplam muda > $120K — acil kaizen atölyesi planlanmalı."} }],
  formulaPipeline: [
    { formulaId: "cost.muda_overproduction", inputMap: {
        overproducedQty: "overproductionCost"
      ,
        unitCost: "unitCost"}, outputId: "mudaOverproduction" },
    { formulaId: "cost.muda_waiting", inputMap: {
        waitingHours: "waitingCost"
      ,
        laborRate: "laborRate"}, outputId: "mudaWaiting" },
    { formulaId: "cost.muda_transport", inputMap: {
        excessDist: "transportCost"
      ,
        costPerKm: "costPerKm"}, outputId: "mudaTransport" },
    { formulaId: "cost.muda_overprocessing", inputMap: {
        extraProcessHours: "overprocessingCost"
      ,
        processRate: "processRate"}, outputId: "mudaOverprocessing" },
    { formulaId: "cost.muda_inventory", inputMap: {
        excessInventory: "inventoryCost"
      ,
        holdingCostPerUnit: "holdingCostPerUnit"}, outputId: "mudaInventory" },
    { formulaId: "cost.muda_motion", inputMap: {
        excessMotionHours: "motionCost"
      ,
        laborRate: "laborRate"}, outputId: "mudaMotion" },
    { formulaId: "cost.muda_defects", inputMap: {
        defectQty: "defectCost"
      ,
        reworkCostPerUnit: "reworkCostPerUnit"}, outputId: "mudaDefects" },
    { formulaId: "cost.muda_total", inputMap: { mudaOverproduction: "mudaOverproduction", mudaWaiting: "mudaWaiting", mudaTransport: "mudaTransport", mudaOverprocessing: "mudaOverprocessing", mudaInventory: "mudaInventory", mudaMotion: "mudaMotion", mudaDefects: "mudaDefects" }, outputId: "mudaTotal" },
  ],
  reportTemplate: { title: "Muda Waste Cost Report", title_i18n: {"en":"Muda Waste Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["7 muda kaynağı ayrı ayrı girilir.", "Toplam israf = Σ(her bir muda kalemi).", "Pareto analizi ile önceliklendirme yapılmalıdır."],assumptionNotes_i18n:[{"en":"7 muda kaynağı ayrı ayrı girilir."},{"en":"Toplam israf = Σ(her bir muda kalemi)."},{"en":"Pareto analizi ile önceliklendirme yapılmalıdır."}]},
};
