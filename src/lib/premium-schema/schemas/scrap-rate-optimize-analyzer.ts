/**
 * Tool #50 — Hurda Oranı Optimize
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SCRAP_OPTIMIZE_SCHEMA: PremiumCalculatorSchema = {
  id: "scrap-rate-optimize-analyzer", legacyPaidSlug: "scrap-rate-optimize-analyzer",
  name: "Hurda Oranı Optimizasyon & Pareto Analizi", sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Hurda maliyeti sadece malzeme kaybı değildir; işçilik, makine ve fırsat maliyetini de içerir. Kaynak bazlı Pareto analizi gerekir.",
  inputs: [
    { id: "scrapQty", label: "Hurda Miktarı", type: "number", unit: "adet/yıl", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual scrap quantity" },
    { id: "totalInput", label: "Toplam Üretim Girdisi", type: "number", unit: "adet/yıl", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Total input quantity" },
    { id: "matCost", label: "Hammadde Maliyeti/Adet", type: "number", unit: "USD", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Material cost per unit" },
    { id: "cycleTime", label: "Çevrim Süresi", type: "number", unit: "dak", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Cycle time per part" },
    { id: "labRate", label: "İşçilik Saat Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Labor hourly rate" },
    { id: "machRate", label: "Makine Saat Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Machine hourly rate" },
    { id: "unitMargin", label: "Birim Kâr Marjı", type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin per unit" },
    { id: "salvage", label: "Kurtarma Geliri/Adet", type: "number", unit: "USD", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Salvage value per scrap" },
    { id: "benchmarkRate", label: "Hedef (Benchmark) Hurda Oranı", type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target scrap rate" },
    { id: "impFactor", label: "İyileştirme Faktörü", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected improvement" },
  ],
  outputs: [
    { id: "currentScrapRate", label: "Mevcut Hurda Oranı", unit: "%", format: "percentage" },
    { id: "totalScrapCost", label: "Toplam Hurda Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "currentScrapRate", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Hurda oranı > %5 — iyileştirme programı başlatılmalı.", criticalMessage: "Hurda oranı > %10 — acil proses iyileştirme." }],
  formulaPipeline: [
    { formulaId: "cost.scrap_optimize_total", inputMap: { scrapMaterialCost: "matCost", scrapLaborCost: "cycleTime", scrapOverhead: "machRate", scrapOpportunity: "unitMargin", scrapSalvage: "salvage" }, outputId: "totalScrapCost" },
  ],
  reportTemplate: { title: "Scrap Rate Optimization Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["ScrapRate = ScrapQty/TotalInput.", "Total = Scrap×(MatCost+Labor+OH+Margin)-Salvage.", "Target = Benchmark×(1-ImpFactor)."] },
};
