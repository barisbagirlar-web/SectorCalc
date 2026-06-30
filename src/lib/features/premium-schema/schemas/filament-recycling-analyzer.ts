/**
 * Tool #41 — Filament Recycling
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FILAMENT_RECYCLING_SCHEMA: PremiumCalculatorSchema = {
  id: "filament-recycling-analyzer", legacyPaidSlug: "filament-recycling-analyzer",
  name: "Filament Geri Dönüşüm Ekonomisi Analizi", name_i18n: {"en":"Filament Geri Donusum Ekonomisi Analizi","tr":"Filament Geri Dönüşüm Ekonomisi Analizi"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "3D baskı filamentinde geri dönüşüm ekonomisi hesaplanmazsa hammadde maliyeti ve sürdürülebilirlik hedefleri arasında denge kurulamaz.", painStatement_i18n: {"en":"3D baskı filamentinde geri dönüşüm ekonomisi hesaplanmazsa hammadde maliyeti ve sürdürülebilirlik hedefleri arasında denge kurulamaz.","tr":"3D baskı filamentinde geri dönüşüm ekonomisi hesaplanmazsa hammadde maliyeti ve sürdürülebilirlik hedefleri arasında denge kurulamaz."},
  inputs: [
    { id: "virginPrice", label: "Saf Filament Fiyatı", label_i18n: {"en":"Virgin filament price","tr":"Saf Filament Fiyatı"}, type: "number", unit: "USD/kg", required: true, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Virgin filament price", expertMeaning_i18n: {"en":"Virgin filament price","tr":"saf filament fiyatı"} },
    { id: "virginScrapPct", label: "Saf Fire Oranı", label_i18n: {"en":"Virgin material scrap rate","tr":"Saf Fire Oranı"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Virgin material scrap rate", expertMeaning_i18n: {"en":"Virgin material scrap rate","tr":"saf fire oranı"} },
    { id: "virginTransport", label: "Saf Malzeme Navlun", label_i18n: {"en":"Saf Malzeme Navlun","tr":"Saf Malzeme Navlun"}, type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Transport cost per kg", expertMeaning_i18n: {"en":"Transport cost per kg","tr":"Transport cost per kg"} },
    { id: "collectCost", label: "Toplama Maliyeti", label_i18n: {"en":"Toplama Maliyeti","tr":"Toplama Maliyeti"}, type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Collection cost per kg", expertMeaning_i18n: {"en":"Collection cost per kg","tr":"Collection cost per kg"} },
    { id: "sortCost", label: "Ayırma Maliyeti", label_i18n: {"en":"Sorting cost per kg","tr":"Ayırma Maliyeti"}, type: "number", unit: "USD/kg", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Sorting cost per kg", expertMeaning_i18n: {"en":"Sorting cost per kg","tr":"ayırma maliyeti"} },
    { id: "pelletCost", label: "Pelet Maliyeti", label_i18n: {"en":"Pelet Maliyeti","tr":"Pelet Maliyeti"}, type: "number", unit: "USD/kg", required: false, smartDefault: 4, validation: { min: 0 }, helper: "", expertMeaning: "Pelletizing cost", expertMeaning_i18n: {"en":"Pelletizing cost","tr":"Pelletizing cost"} },
    { id: "recyclingYield", label: "Geri Dönüşüm Verimi", label_i18n: {"en":"Recycling process yield","tr":"Geri Dönüşüm Verimi"}, type: "number", unit: "%", required: true, smartDefault: 80, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Recycling process yield", expertMeaning_i18n: {"en":"Recycling process yield","tr":"geri dönüşüm verimi"} },
    { id: "productionVolume", label: "Yıllık Üretim Hacmi", label_i18n: {"en":"Annual production volume","tr":"Yıllık Üretim Hacmi"}, type: "number", unit: "kg", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume","tr":"yıllık üretim hacmi"} },
    { id: "capex", label: "Yatırım (Capex)", label_i18n: {"en":"Recycling equipment capex","tr":"Yatırım (Capex)"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Recycling equipment capex", expertMeaning_i18n: {"en":"Recycling equipment capex","tr":"yatırım (capex)"} },
  ],
  outputs: [
    { id: "virginCost", label: "Saf Filament Maliyeti", label_i18n: {"en":"Saf Filament Maliyeti","tr":"Saf Filament Maliyeti"}, unit: "USD/kg", format: "currency" },
    { id: "recycledCost", label: "Geri Dönüşüm Maliyeti", label_i18n: {"en":"Geri Donusum Maliyeti","tr":"Geri Dönüşüm Maliyeti"}, unit: "USD/kg", format: "currency" },
    { id: "roi", label: "Geri Dönüşüm ROI", label_i18n: {"en":"Geri Donusum ROI","tr":"Geri Dönüşüm ROI"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 30, critical: 10, direction: "lower_is_bad", warningMessage: "ROI < %30 — geri dönüşüm yatırımı sorgulanmalı.", warningMessage_i18n: {"en":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı.","tr":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı."}, criticalMessage: "ROI < %10 — yatırım fizibil değil.", criticalMessage_i18n: {"en":"ROI < %10 — yatırım fizibil değil.","tr":"ROI < %10 — yatırım fizibil değil."} }],
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
  reportTemplate: { title: "Filament Recycling Report", title_i18n: {"en":"Filament Recycling Report","tr":"Filament Recycling Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Virgin = Price×(1+Scrap%)+Transport.", "Recycled = (Collect+Sort+Pellet)/Yield.", "ROI = (Virgin-Recycled)×Vol/Capex."],assumptionNotes_i18n:[{"en":"Virgin = Price×(1+Scrap%)+Transport.","tr":"Virgin = Price×(1+Scrap%)+Transport."},{"en":"Recycled = (Collect+Sort+Pellet)/Yield.","tr":"Recycled = (Collect+Sort+Pellet)/Yield."},{"en":"ROI = (Virgin-Recycled)×Vol/Capex.","tr":"ROI = (Virgin-Recycled)×Vol/Capex."}] },
};
