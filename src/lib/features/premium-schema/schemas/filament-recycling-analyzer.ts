
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FILAMENT_RECYCLING_SCHEMA: PremiumCalculatorSchema = {
  id: "filament-recycling-analyzer", legacyPaidSlug: "filament-recycling-analyzer",
  name: "Filament Recycling Economy Analyzer", name_i18n: {"en":"Filament Recycling Economy Analyzer"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "If the recycling economics of 3D printing filament is not calculated, a balance between raw material cost and sustainability targets cannot be established.", painStatement_i18n: {"en":"If the recycling economics of 3D printing filament is not calculated, a balance between raw material cost and sustainability targets cannot be established."},
  inputs: [
    { id: "virginPrice", label: "Virgin filament price", label_i18n: {"en":"Virgin filament price"}, type: "number", unit: "USD/kg", required: true, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Virgin filament price", expertMeaning_i18n: {"en":"Virgin filament price"} },
    { id: "virginScrapPct", label: "Virgin material scrap rate", label_i18n: {"en":"Virgin material scrap rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Virgin material scrap rate", expertMeaning_i18n: {"en":"Virgin material scrap rate"} },
    { id: "virginTransport", label: "Saf material freight", label_i18n: {"en":"Saf material freight"}, type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Transport cost per kg", expertMeaning_i18n: {"en":"Transport cost per kg"} },
    { id: "collectCost", label: "Toplama Cost", label_i18n: {"en":"Toplama Cost"}, type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Collection cost per kg", expertMeaning_i18n: {"en":"Collection cost per kg"} },
    { id: "sortCost", label: "Sorting cost per kg", label_i18n: {"en":"Sorting cost per kg"}, type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Sorting cost per kg", expertMeaning_i18n: {"en":"Sorting cost per kg"} },
    { id: "pelletCost", label: "Pelet Cost", label_i18n: {"en":"Pelet Cost"}, type: "number", unit: "USD/kg", required: false, smartDefault: 4, validation: { min: 0 }, helper: "", expertMeaning: "Pelletizing cost", expertMeaning_i18n: {"en":"Pelletizing cost"} },
    { id: "recyclingYield", label: "Recycling process yield", label_i18n: {"en":"Recycling process yield"}, type: "number", unit: "%", required: true, smartDefault: 80, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Recycling process yield", expertMeaning_i18n: {"en":"Recycling process yield"} },
    { id: "productionVolume", label: "Annual production volume", label_i18n: {"en":"Annual production volume"}, type: "number", unit: "kg", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume"} },
    { id: "capex", label: "Recycling equipment capex", label_i18n: {"en":"Recycling equipment capex"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Recycling equipment capex", expertMeaning_i18n: {"en":"Recycling equipment capex"} },
  ],
  outputs: [
    { id: "virginCost", label: "Saf Filament Cost", label_i18n: {"en":"Saf Filament Cost"}, unit: "USD/kg", format: "currency" },
    { id: "recycledCost", label: "Return Donusum Cost", label_i18n: {"en":"Return Donusum Cost"}, unit: "USD/kg", format: "currency" },
    { id: "roi", label: "Return Donusum ROI", label_i18n: {"en":"Return Donusum ROI"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 30, critical: 10, direction: "lower_is_bad", warningMessage: "ROI < %30 — Return on conversion investment should be questioned.", warningMessage_i18n: {"en":"ROI < %30 — Return on conversion investment should be questioned."}, criticalMessage: "ROI < %10 — Investment is not feasible.", criticalMessage_i18n: {"en":"ROI < %10 — Investment is not feasible."} }],
  formulaPipeline: [
    { formulaId: "cost.filament_virgin", inputMap: {
        priceV: "virginPrice",
        scrapV: "virginScrapPct",
        transpV: "virginTransport"
      }, outputId: "virginCost" },
    { formulaId: "cost.filament_recycled", inputMap: {
        collect: "collectCost",
        sort: "sortCost",
        pellet: "pelletCost",
        yield: "recyclingYield"
      }, outputId: "recycledCost" },
    { formulaId: "cost.filament_roi", inputMap: {
        capex: "capex",
        costV: "virginCost",
        totalR: "recycledCost",
        volume: "productionVolume"
      }, outputId: "roi" },
  ],
  reportTemplate: { title: "Filament Recycling Report", title_i18n: {"en":"Filament Recycling Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Virgin = Price×(1+Scrap%)+Transport.", "Recycled = (Collect+Sort+Pellet)/Yield.", "ROI = (Virgin-Recycled)×Vol/Capex."],assumptionNotes_i18n:[{"en":"Virgin = Price×(1+Scrap%)+Transport."},{"en":"Recycled = (Collect+Sort+Pellet)/Yield."},{"en":"ROI = (Virgin-Recycled)×Vol/Capex."}] },
};
