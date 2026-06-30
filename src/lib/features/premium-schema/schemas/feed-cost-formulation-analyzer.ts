/**
 * Tool #56 — İlerleme Yem Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FEED_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "feed-cost-formulation-analyzer", legacyPaidSlug: "feed-cost-formulation-analyzer",
  name: "İlerleme Yem Maliyeti & FCR Analizi", name_i18n: {"en":"ilerleme Yem Maliyeti & FCR Analizi","tr":"İlerleme Yem Maliyeti & FCR Analizi"}, sectorSlug: "food", category: "cost",
  painStatement: "Yem formülasyonunda hammadde maliyeti, işleme ve FCR analiz edilmezse kg başına canlı ağırlık maliyeti kontrol edilemez.", painStatement_i18n: {"en":"Yem formülasyonunda hammadde maliyeti, işleme ve FCR analiz edilmezse kg başına canlı ağırlık maliyeti kontrol edilemez.","tr":"Yem formülasyonunda hammadde maliyeti, işleme ve FCR analiz edilmezse kg başına canlı ağırlık maliyeti kontrol edilemez."},
  inputs: [
    { id: "inclusionRates", label: "Kullanım Oranları (%, virgülle)", label_i18n: {"en":"Ingredient inclusion rates","tr":"Kullanım Oranları (%, virgülle)"}, type: "number", unit: "%", array: true, required: true, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Ingredient inclusion rates", expertMeaning_i18n: {"en":"Ingredient inclusion rates","tr":"kullanım oranları (%, virgülle)"} },
    { id: "prices", label: "Hammadde Fiyatları (USD/ton, virgülle)", label_i18n: {"en":"Ingredient prices","tr":"Hammadde Fiyatları (USD/ton, virgülle)"}, type: "number", unit: "USD/ton", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Ingredient prices", expertMeaning_i18n: {"en":"Ingredient prices","tr":"hammadde fiyatları (usd/ton, virgülle)"} },
    { id: "grindCost", label: "Öğütme Maliyeti", label_i18n: {"en":"Grinding cost per ton","tr":"Öğütme Maliyeti"}, type: "number", unit: "USD/ton", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Grinding cost per ton", expertMeaning_i18n: {"en":"Grinding cost per ton","tr":"öğütme maliyeti"} },
    { id: "mixCost", label: "Karıştırma Maliyeti", label_i18n: {"en":"Mixing cost per ton","tr":"Karıştırma Maliyeti"}, type: "number", unit: "USD/ton", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Mixing cost per ton", expertMeaning_i18n: {"en":"Mixing cost per ton","tr":"karıştırma maliyeti"} },
    { id: "pelletCost", label: "Pelet Maliyeti", label_i18n: {"en":"Pelet Maliyeti","tr":"Pelet Maliyeti"}, type: "number", unit: "USD/ton", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Pelletizing cost", expertMeaning_i18n: {"en":"Pelletizing cost","tr":"Pelletizing cost"} },
    { id: "shrinkRate", label: "Fire Oranı", label_i18n: {"en":"Shrinkage rate","tr":"Fire Oranı"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 10 }, helper: "", expertMeaning: "Shrinkage rate", expertMeaning_i18n: {"en":"Shrinkage rate","tr":"fire oranı"} },
    { id: "feedConsumed", label: "Tüketilen Yem", label_i18n: {"en":"Total feed consumed","tr":"Tüketilen Yem"}, type: "number", unit: "kg", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total feed consumed", expertMeaning_i18n: {"en":"Total feed consumed","tr":"tüketilen yem"} },
    { id: "weightGain", label: "Canlı Ağırlık Artışı", label_i18n: {"en":"Live weight gain","tr":"Canlı Ağırlık Artışı"}, type: "number", unit: "kg", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Live weight gain", expertMeaning_i18n: {"en":"Live weight gain","tr":"canlı ağırlık artışı"} },
  ],
  outputs: [
    { id: "baseCost", label: "Baz Yem Maliyeti", label_i18n: {"en":"Baz Yem Maliyeti","tr":"Baz Yem Maliyeti"}, unit: "USD/ton", format: "currency" },
    { id: "fcr", label: "FCR (Yem Dönüşüm Oranı)", label_i18n: {"en":"FCR (Yem Donusum Oran)","tr":"FCR (Yem Dönüşüm Oranı)"}, unit: "", format: "number" },
    { id: "costPerKgGain", label: "kg Kazanç Maliyeti", label_i18n: {"en":"kg Kazanc Maliyeti","tr":"kg Kazanç Maliyeti"}, unit: "USD/kg", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "fcr", warning: 2.5, critical: 3.0, direction: "higher_is_bad", warningMessage: "FCR > 2.5 — yem verimliliği düşük.", warningMessage_i18n: {"en":"FCR > 2.5 — yem verimliliği düşük.","tr":"FCR > 2.5 — yem verimliliği düşük."}, criticalMessage: "FCR > 3.0 — rasyon optimizasyonu acil.", criticalMessage_i18n: {"en":"FCR > 3.0 — rasyon optimizasyonu acil.","tr":"FCR > 3.0 — rasyon optimizasyonu acil."} }],
  formulaPipeline: [
    { formulaId: "cost.feed_base_cost", inputMap: { inclusionRates: "inclusionRates", prices: "prices" ,
        inclRates: "inclRates"}, outputId: "baseCost" },
    { formulaId: "measurement.feed_fcr", inputMap: {
        weightGain: "weightGain",
        feedCons: "feedConsumed"
      }, outputId: "fcr" },
    { formulaId: "cost.feed_cost_per_kg", inputMap: {
        baseCost: "baseCost",
        shrinkRate: "shrinkRate",
        fcr: "fcr",
        procCost: "grindCost",
        addCost: "mixCost"
      }, outputId: "costPerKgGain" },
  ],
  reportTemplate: { title: "Feed Cost Formulation Report", title_i18n: {"en":"Feed Cost Formulation Report","tr":"Feed Cost Formulation Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Base = Σ(Inclusion%×Price/100).", "FCR = FeedConsumed/WeightGain.", "Cost/kg = (Base+Proc+Add+Shrink)×FCR/1000."],assumptionNotes_i18n:[{"en":"Base = Σ(Inclusion%×Price/100).","tr":"Base = Σ(Inclusion%×Price/100)."},{"en":"FCR = FeedConsumed/WeightGain.","tr":"FCR = FeedConsumed/WeightGain."},{"en":"Cost/kg = (Base+Proc+Add+Shrink)×FCR/1000.","tr":"Cost/kg = (Base+Proc+Add+Shrink)×FCR/1000."}] },
};
