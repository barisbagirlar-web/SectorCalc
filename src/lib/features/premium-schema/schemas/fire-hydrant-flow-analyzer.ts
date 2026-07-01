/**
 * Tool #37 — Yangın Hidrantı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FIRE_HYDRANT_SCHEMA: PremiumCalculatorSchema = {
  id: "fire-hydrant-flow-analyzer", legacyPaidSlug: "fire-hydrant-flow-analyzer",
  name: "Fire Hydrant Flow Analyzer", name_i18n: {"en":"waste Hydrant Flow Analyzer"}, sectorSlug: "quality", category: "measurement",
  painStatement: "Yangın hidrantlarının debisi ve mevcut akış kapasitesi düzenli ölçülmezse yangın anında yetersiz su basıncı felakete yol açabilir. Uyumsuzluk durumunda cezai yaptırım ve sigorta sorunları oluşur.", painStatement_i18n: {"en":"If fire hydrant flow rate and current flow capacity are not measured regularly, water is wasted instantly and insufficient water pressure can lead to disaster. In case of non-compliance, penal sanctions and insurance issues arise."},
  inputs: [
    { id: "hydrantDiameter", label: "Hydrant outlet diameter", label_i18n: {"en":"Hydrant outlet diameter"}, type: "number", unit: "mm", required: true, smartDefault: 100, validation: { min: 25 }, helper: "", expertMeaning: "Hydrant outlet diameter", expertMeaning_i18n: {"en":"Hydrant outlet diameter"} },
    { id: "staticPressure", label: "Static pressure at hydrant", label_i18n: {"en":"Static pressure at hydrant"}, type: "number", unit: "bar", required: true, smartDefault: 4, validation: { min: 0.5 }, helper: "", expertMeaning: "Static pressure at hydrant", expertMeaning_i18n: {"en":"Static pressure at hydrant"} },
    { id: "residualPressure", label: "Residual pressure during flow", label_i18n: {"en":"Residual pressure during flow"}, type: "number", unit: "bar", required: true, smartDefault: 2.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Residual pressure during flow", expertMeaning_i18n: {"en":"Residual pressure during flow"} },
    { id: "flowTestDuration", label: "Test Süresi", label_i18n: {"en":"Flow test duration"}, type: "number", unit: "dk", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Flow test duration", expertMeaning_i18n: {"en":"Flow test duration"} },
    { id: "requiredFlow", label: "Gerekli Minimum Debi", label_i18n: {"en":"required Minimum Flow"}, type: "number", unit: "L/dk", required: true, smartDefault: 1000, validation: { min: 100 }, helper: "", expertMeaning: "Minimum required flow rate", expertMeaning_i18n: {"en":"Minimum required flow rate"} },
    { id: "numHydrants", label: "Total hydrants in facility", label_i18n: {"en":"Total hydrants in facility"}, type: "number", unit: "adet", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Total hydrants in facility", expertMeaning_i18n: {"en":"Total hydrants in facility"} },
    { id: "complianceFine", label: "Penalty per non-compliant hydrant", label_i18n: {"en":"Penalty per non-compliant hydrant"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Penalty per non-compliant hydrant", expertMeaning_i18n: {"en":"Penalty per non-compliant hydrant"} },
  ],
  outputs: [
    { id: "hydrantFlow", label: "Hidrant Debi Kapasitesi", label_i18n: {"en":"Hidrant Flow Capacity"}, unit: "L/dk", format: "number" },
    { id: "availableFlow", label: "Kullanlabilir Aks", label_i18n: {"en":"Kullanlabilir Aks"}, unit: "L/dk", format: "number" },
    { id: "hydrantCompliance", label: "Uyumluluk Durumu", label_i18n: {"en":"Uyumluluk Durumu"}, unit: "puan", format: "score" },
    { id: "complianceCost", label: "Uyumsuzluk Maliyeti", label_i18n: {"en":"Uyumsuzluk Cost"}, unit: "USD", format: "currency" },
  ],
  thresholds: [
    { fieldId: "hydrantCompliance", warning: 70, critical: 40, direction: "lower_is_bad", warningMessage: "Uyum skoru < 70 — bakım planı oluşturulmalı.", warningMessage_i18n: {"en":"Compliance score < 70 — maintenance plan should be created."}, criticalMessage: "Uyum skoru < 40 — acil hidrant yenileme programı gerekli.", criticalMessage_i18n: {"en":"Uyum skoru < 40 — urgent hidrant replacement program gerekli."} },
    { fieldId: "complianceCost", warning: 10000, critical: 30000, direction: "higher_is_bad", warningMessage: "Uyumsuzluk riski > $10K — sigorta gözden geçirilmeli.", warningMessage_i18n: {"en":"Non-compliance risk > $10K — insurance should be reviewed."}, criticalMessage: "Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek.", criticalMessage_i18n: {"en":"Non-compliance risk > $30K — legal sanction risk is high."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.hydrant_flow", inputMap: {
        hydrantPressure: "hydrantDiameter",
        orificeCoefficient: "staticPressure",
        residualPressure: "residualPressure"
      }, outputId: "hydrantFlow" },
    { formulaId: "measurement.available_flow", inputMap: {
        hydrantFlow: "hydrantFlow",
        requiredFlow: "staticPressure",
        residualPressure: "residualPressure"
      }, outputId: "availableFlow" },
    { formulaId: "cost.hydrant_compliance", inputMap: {
        deficientHydrants: "hydrantFlow",
        remediationCost: "requiredFlow",
        numHydrants: "numHydrants"
      }, outputId: "hydrantCompliance" },
    { formulaId: "cost.hydrant_compliance_penalty", inputMap: { hydrantCompliance: "hydrantCompliance", complianceFine: "complianceFine", numHydrants: "numHydrants" ,
        deficientHydrants: "deficientHydrants",
        penaltyPerHydrant: "penaltyPerHydrant"}, outputId: "complianceCost" },
  ],
  reportTemplate: { title: "Yangın Hidrantı Akış Analiz Raporu", title_i18n: {"en":"Fire Hydrant Flow Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Hidrant debisi çap ve basınç düşümüne göre hesaplanır.", "Kullanılabilir akış statik ve rezidüel basınç farkına dayanır.", "Uyumluluk skoru NFPA standardı referans alınarak belirlenir."],assumptionNotes_i18n:[{"en":"Hydrant flow rate is calculated based on diameter and pressure drop."},{"en":"Available flow depends on the difference between static and residual pressure."},{"en":"Compliance score is determined with reference to the NFPA standard."}] },
};
