/**
 * Tool #41 — Filament Recycling
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FILAMENT_RECYCLING_SCHEMA: PremiumCalculatorSchema = {
  id: "filament-recycling-analyzer", legacyPaidSlug: "filament-recycling-analyzer",
  name: "Filament Geri Dönüşüm Ekonomisi Analizi", sectorSlug: "sheet-metal", category: "cost",
  painStatement: "3D baskı filamentinde geri dönüşüm ekonomisi hesaplanmazsa hammadde maliyeti ve sürdürülebilirlik hedefleri arasında denge kurulamaz.",
  inputs: [
    { id: "virginPrice", label: "Saf Filament Fiyatı", type: "number", unit: "USD/kg", required: true, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Virgin filament price" },
    { id: "virginScrapPct", label: "Saf Fire Oranı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Virgin material scrap rate" },
    { id: "virginTransport", label: "Saf Malzeme Navlun", type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Transport cost per kg" },
    { id: "collectCost", label: "Toplama Maliyeti", type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Collection cost per kg" },
    { id: "sortCost", label: "Ayırma Maliyeti", type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Sorting cost per kg" },
    { id: "pelletCost", label: "Pelet Maliyeti", type: "number", unit: "USD/kg", required: false, smartDefault: 4, validation: { min: 0 }, helper: "", expertMeaning: "Pelletizing cost" },
    { id: "recyclingYield", label: "Geri Dönüşüm Verimi", type: "number", unit: "%", required: true, smartDefault: 80, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Recycling process yield" },
    { id: "productionVolume", label: "Yıllık Üretim Hacmi", type: "number", unit: "kg", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual production volume" },
    { id: "capex", label: "Yatırım (Capex)", type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Recycling equipment capex" },
  ],
  outputs: [
    { id: "virginCost", label: "Saf Filament Maliyeti", unit: "USD/kg", format: "currency" },
    { id: "recycledCost", label: "Geri Dönüşüm Maliyeti", unit: "USD/kg", format: "currency" },
    { id: "roi", label: "Geri Dönüşüm ROI", unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 30, critical: 10, direction: "lower_is_bad", warningMessage: "ROI < %30 — geri dönüşüm yatırımı sorgulanmalı.", criticalMessage: "ROI < %10 — yatırım fizibil değil." }],
  formulaPipeline: [
    { formulaId: "cost.filament_virgin", inputMap: { virginPrice: "virginPrice", virginScrapPct: "virginScrapPct", virginTransport: "virginTransport" }, outputId: "virginCost" },
    { formulaId: "cost.filament_recycled", inputMap: { collectCost: "collectCost", sortCost: "sortCost", pelletCost: "pelletCost", recyclingYield: "recyclingYield" }, outputId: "recycledCost" },
    { formulaId: "cost.filament_roi", inputMap: { virginCost: "virginCost", recycledCost: "recycledCost", productionVolume: "productionVolume", capex: "capex" }, outputId: "roi" },
  ],
  reportTemplate: { title: "Filament Recycling Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Virgin = Price×(1+Scrap%)+Transport.", "Recycled = (Collect+Sort+Pellet)/Yield.", "ROI = (Virgin-Recycled)×Vol/Capex."] },
};
