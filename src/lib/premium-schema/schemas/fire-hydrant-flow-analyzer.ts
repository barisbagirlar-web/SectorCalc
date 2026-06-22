/**
 * Tool #37 — Yangın Hidrantı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FIRE_HYDRANT_SCHEMA: PremiumCalculatorSchema = {
  id: "fire-hydrant-flow-analyzer", legacyPaidSlug: "fire-hydrant-flow-analyzer",
  name: "Yangın Hidrantı Akış Analizi", name_i18n: {"en":"Yangin Hidranti Akis Analizi","tr":"Yangın Hidrantı Akış Analizi"}, sectorSlug: "quality", category: "measurement",
  painStatement: "Yangın hidrantlarının debisi ve mevcut akış kapasitesi düzenli ölçülmezse yangın anında yetersiz su basıncı felakete yol açabilir. Uyumsuzluk durumunda cezai yaptırım ve sigorta sorunları oluşur.", painStatement_i18n: {"en":"Yangın hidrantlarının debisi ve mevcut akış kapasitesi düzenli ölçülmezse yangın anında yetersiz su basıncı felakete yol açabilir. Uyumsuzluk durumunda cezai yaptırım ve sigorta sorunları oluşur.","tr":"Yangın hidrantlarının debisi ve mevcut akış kapasitesi düzenli ölçülmezse yangın anında yetersiz su basıncı felakete yol açabilir. Uyumsuzluk durumunda cezai yaptırım ve sigorta sorunları oluşur."},
  inputs: [
    { id: "hydrantDiameter", label: "Hidrant Çapı", label_i18n: {"en":"Hydrant outlet diameter","tr":"Hidrant Çapı"}, type: "number", unit: "mm", required: true, smartDefault: 100, validation: { min: 25 }, helper: "", expertMeaning: "Hydrant outlet diameter", expertMeaning_i18n: {"en":"Hydrant outlet diameter","tr":"hidrant çapı"} },
    { id: "staticPressure", label: "Statik Basınç", label_i18n: {"en":"Static pressure at hydrant","tr":"Statik Basınç"}, type: "number", unit: "bar", required: true, smartDefault: 4, validation: { min: 0.5 }, helper: "", expertMeaning: "Static pressure at hydrant", expertMeaning_i18n: {"en":"Static pressure at hydrant","tr":"statik basınç"} },
    { id: "residualPressure", label: "Rezidüel Basınç", label_i18n: {"en":"Residual pressure during flow","tr":"Rezidüel Basınç"}, type: "number", unit: "bar", required: true, smartDefault: 2.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Residual pressure during flow", expertMeaning_i18n: {"en":"Residual pressure during flow","tr":"rezidüel basınç"} },
    { id: "flowTestDuration", label: "Test Süresi", label_i18n: {"en":"Flow test duration","tr":"Test Süresi"}, type: "number", unit: "dk", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Flow test duration", expertMeaning_i18n: {"en":"Flow test duration","tr":"test süresi"} },
    { id: "requiredFlow", label: "Gerekli Minimum Debi", label_i18n: {"en":"Gerekli Minimum Debi","tr":"Gerekli Minimum Debi"}, type: "number", unit: "L/dk", required: true, smartDefault: 1000, validation: { min: 100 }, helper: "", expertMeaning: "Minimum required flow rate", expertMeaning_i18n: {"en":"Minimum required flow rate","tr":"Minimum required flow rate"} },
    { id: "numHydrants", label: "Hidrant Sayısı", label_i18n: {"en":"Total hydrants in facility","tr":"Hidrant Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Total hydrants in facility", expertMeaning_i18n: {"en":"Total hydrants in facility","tr":"hidrant sayısı"} },
    { id: "complianceFine", label: "Uyumsuzluk Cezası", label_i18n: {"en":"Penalty per non-compliant hydrant","tr":"Uyumsuzluk Cezası"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Penalty per non-compliant hydrant", expertMeaning_i18n: {"en":"Penalty per non-compliant hydrant","tr":"uyumsuzluk cezası"} },
  ],
  outputs: [
    { id: "hydrantFlow", label: "Hidrant Debi Kapasitesi", label_i18n: {"en":"Hidrant Debi Kapasitesi","tr":"Hidrant Debi Kapasitesi"}, unit: "L/dk", format: "number" },
    { id: "availableFlow", label: "Kullanılabilir Akış", label_i18n: {"en":"Kullanlabilir Aks","tr":"Kullanılabilir Akış"}, unit: "L/dk", format: "number" },
    { id: "hydrantCompliance", label: "Uyumluluk Durumu", label_i18n: {"en":"Uyumluluk Durumu","tr":"Uyumluluk Durumu"}, unit: "puan", format: "score" },
    { id: "complianceCost", label: "Uyumsuzluk Maliyeti", label_i18n: {"en":"Uyumsuzluk Maliyeti","tr":"Uyumsuzluk Maliyeti"}, unit: "USD", format: "currency" },
  ],
  thresholds: [
    { fieldId: "hydrantCompliance", warning: 70, critical: 40, direction: "lower_is_bad", warningMessage: "Uyum skoru < 70 — bakım planı oluşturulmalı.", warningMessage_i18n: {"en":"Uyum skoru < 70 — bakım planı oluşturulmalı.","tr":"Uyum skoru < 70 — bakım planı oluşturulmalı."}, criticalMessage: "Uyum skoru < 40 — acil hidrant yenileme programı gerekli.", criticalMessage_i18n: {"en":"Uyum skoru < 40 — acil hidrant yenileme programı gerekli.","tr":"Uyum skoru < 40 — acil hidrant yenileme programı gerekli."} },
    { fieldId: "complianceCost", warning: 10000, critical: 30000, direction: "higher_is_bad", warningMessage: "Uyumsuzluk riski > $10K — sigorta gözden geçirilmeli.", warningMessage_i18n: {"en":"Uyumsuzluk riski > $10K — sigorta gözden geçirilmeli.","tr":"Uyumsuzluk riski > $10K — sigorta gözden geçirilmeli."}, criticalMessage: "Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek.", criticalMessage_i18n: {"en":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek.","tr":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.hydrant_flow", inputMap: { hydrantDiameter: "hydrantDiameter", staticPressure: "staticPressure", residualPressure: "residualPressure" }, outputId: "hydrantFlow" },
    { formulaId: "measurement.available_flow", inputMap: { hydrantFlow: "hydrantFlow", staticPressure: "staticPressure", residualPressure: "residualPressure" }, outputId: "availableFlow" },
    { formulaId: "cost.hydrant_compliance", inputMap: { hydrantFlow: "hydrantFlow", requiredFlow: "requiredFlow", numHydrants: "numHydrants" }, outputId: "hydrantCompliance" },
    { formulaId: "cost.hydrant_compliance_penalty", inputMap: { hydrantCompliance: "hydrantCompliance", complianceFine: "complianceFine", numHydrants: "numHydrants" }, outputId: "complianceCost" },
  ],
  reportTemplate: { title: "Yangın Hidrantı Akış Analiz Raporu", title_i18n: {"en":"Yangın Hidrantı Akış Analiz Raporu","tr":"Yangın Hidrantı Akış Analiz Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Hidrant debisi çap ve basınç düşümüne göre hesaplanır.", "Kullanılabilir akış statik ve rezidüel basınç farkına dayanır.", "Uyumluluk skoru NFPA standardı referans alınarak belirlenir."],assumptionNotes_i18n:[{"en":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır.","tr":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır."},{"en":"Kullanılabilir akış statik ve rezidüel basınç farkına dayanır.","tr":"Kullanılabilir akış statik ve rezidüel basınç farkına dayanır."},{"en":"Uyumluluk skoru NFPA standardı referans alınarak belirlenir.","tr":"Uyumluluk skoru NFPA standardı referans alınarak belirlenir."}] },
};
