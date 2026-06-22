/**
 * Tool #21 — Muda Atık Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MUDA_WASTE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "muda-waste-cost-analyzer", legacyPaidSlug: "muda-waste-cost-analyzer",
  name: "Muda Atık Maliyet Analizi", name_i18n: {"en":"Muda Waste Cost Analysis","tr":"Muda Atık Maliyet Analizi"}, sectorSlug: "quality", category: "cost",
  painStatement: "7 muda kaynağının her biri ayrı hesaplanmazsa toplam israf maliyeti gizli kalır ve iyileştirme önceliklendirilemez.", painStatement_i18n: {"en":"7 muda kaynağının her biri ayrı hesaplanmazsa toplam israf maliyeti gizli kalır ve iyileştirme önceliklendirilemez.","tr":"7 muda kaynağının her biri ayrı hesaplanmazsa toplam israf maliyeti gizli kalır ve iyileştirme önceliklendirilemez."},
  inputs: [
    { id: "overproductionCost", label: "Aşırı Üretim Maliyeti", label_i18n: {"en":"Overproduction Cost","tr":"Aşırı Üretim Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Overproduction waste cost", expertMeaning_i18n: {"en":"Overproduction waste cost","tr":"Overproduction waste cost"} },
    { id: "waitingCost", label: "Bekleme Maliyeti", label_i18n: {"en":"Waiting Cost","tr":"Bekleme Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Waiting waste cost", expertMeaning_i18n: {"en":"Waiting waste cost","tr":"Waiting waste cost"} },
    { id: "transportCost", label: "Gereksiz Taşıma Maliyeti", label_i18n: {"en":"Unnecessary Transport Cost","tr":"Gereksiz Taşıma Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 12000, validation: { min: 0 }, helper: "", expertMeaning: "Unnecessary transport cost", expertMeaning_i18n: {"en":"Unnecessary transport cost","tr":"Unnecessary transport cost"} },
    { id: "overprocessingCost", label: "Gereksiz İşlem Maliyeti", label_i18n: {"en":"Overprocessing Cost","tr":"Gereksiz İşlem Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Overprocessing waste cost", expertMeaning_i18n: {"en":"Overprocessing waste cost","tr":"Overprocessing waste cost"} },
    { id: "inventoryCost", label: "Fazla Stok Maliyeti", label_i18n: {"en":"Excess Inventory Cost","tr":"Fazla Stok Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 20000, validation: { min: 0 }, helper: "", expertMeaning: "Excess inventory cost", expertMeaning_i18n: {"en":"Excess inventory cost","tr":"Fazla stok maliyeti"} },
    { id: "motionCost", label: "Gereksiz Hareket Maliyeti", label_i18n: {"en":"Unnecessary Motion Cost","tr":"Gereksiz Hareket Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Unnecessary motion cost", expertMeaning_i18n: {"en":"Unnecessary motion cost","tr":"Gereksiz hareket maliyeti"} },
    { id: "defectCost", label: "Hata/Defo Maliyeti", label_i18n: {"en":"Defect/Rework Cost","tr":"Hata/Defo Maliyeti"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "Defect/rework cost", expertMeaning_i18n: {"en":"Defect/rework cost","tr":"Hata/defo maliyeti"} },
  ],
  outputs: [
    { id: "mudaOverproduction", label: "Aşırı Üretim İsrafı", label_i18n: {"en":"Aşırı Üretim İsrafı","tr":"Aşırı Üretim İsrafı"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaWaiting", label: "Bekleme İsrafı", label_i18n: {"en":"Bekleme İsrafı","tr":"Bekleme İsrafı"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaTransport", label: "Taşıma İsrafı", label_i18n: {"en":"Taşıma İsrafı","tr":"Taşıma İsrafı"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaOverprocessing", label: "Gereksiz İşlem İsrafı", label_i18n: {"en":"Gereksiz İşlem İsrafı","tr":"Gereksiz İşlem İsrafı"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaInventory", label: "Stok İsrafı", label_i18n: {"en":"Stok İsrafı","tr":"Stok İsrafı"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaMotion", label: "Hareket İsrafı", label_i18n: {"en":"Hareket İsrafı","tr":"Hareket İsrafı"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaDefects", label: "Hata İsrafı", label_i18n: {"en":"Hata İsrafı","tr":"Hata İsrafı"}, unit: "USD/yıl", format: "currency" },
    { id: "mudaTotal", label: "Toplam Muda Maliyeti", label_i18n: {"en":"Toplam Muda Maliyeti","tr":"Toplam Muda Maliyeti"}, unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "mudaTotal", warning: 50000, critical: 120000, direction: "higher_is_bad", warningMessage: "Toplam muda > $50K — yalın dönüşüm programı başlatılmalı.", warningMessage_i18n: {"en":"Toplam muda > $50K — yalın dönüşüm programı başlatılmalı.","tr":"Toplam muda > $50K — yalın dönüşüm programı başlatılmalı."}, criticalMessage: "Toplam muda > $120K — acil kaizen atölyesi planlanmalı.", criticalMessage_i18n: {"en":"Toplam muda > $120K — acil kaizen atölyesi planlanmalı.","tr":"Toplam muda > $120K — acil kaizen atölyesi planlanmalı."} }],
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
  reportTemplate: { title: "Muda Waste Cost Report", title_i18n: {"en":"Muda Waste Cost Report","tr":"Muda Waste Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["7 muda kaynağı ayrı ayrı girilir.", "Toplam israf = Σ(her bir muda kalemi).", "Pareto analizi ile önceliklendirme yapılmalıdır."],assumptionNotes_i18n:[{"en":"7 muda kaynağı ayrı ayrı girilir.","tr":"7 muda kaynağı ayrı ayrı girilir."},{"en":"Toplam israf = Σ(her bir muda kalemi).","tr":"Toplam israf = Σ(her bir muda kalemi)."},{"en":"Pareto analizi ile önceliklendirme yapılmalıdır.","tr":"Pareto analizi ile önceliklendirme yapılmalıdır."}]},
};
