/**
 * Tool #48 — Hacimsel Ağırlık
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const VOLUMETRIC_WEIGHT_SCHEMA: PremiumCalculatorSchema = {
  id: "volumetric-weight-chargeable-analyzer", legacyPaidSlug: "volumetric-weight-chargeable-analyzer",
  name: "Hacimsel Ağırlık & Taşıma Maliyet Analizi", sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Hacimsel ağırlık doğru hesaplanmazsa taşıma maliyeti beklenenden yüksek çıkar ve navlun optimizasyonu yapılamaz.",
  inputs: [
    { id: "length", label: "Uzunluk", type: "number", unit: "cm", required: true, smartDefault: 60, validation: { min: 0.1 }, helper: "", expertMeaning: "Package length" },
    { id: "width", label: "Genişlik", type: "number", unit: "cm", required: true, smartDefault: 40, validation: { min: 0.1 }, helper: "", expertMeaning: "Package width" },
    { id: "height", label: "Yükseklik", type: "number", unit: "cm", required: true, smartDefault: 30, validation: { min: 0.1 }, helper: "", expertMeaning: "Package height" },
    { id: "grossWeight", label: "Brüt Ağırlık", type: "number", unit: "kg", required: true, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Gross weight" },
    { id: "transportMode", label: "Taşıma Modu", type: "select", unit: "", enumValues: ["hava", "kara", "deniz"], required: true, smartDefault: "hava", helper: "", expertMeaning: "Transport mode" },
    { id: "freightRate", label: "Navlun Birim Fiyatı", type: "number", unit: "USD/kg", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Freight rate per kg" },
  ],
  outputs: [
    { id: "volWeight", label: "Hacimsel Ağırlık", unit: "kg", format: "number" },
    { id: "chargeable", label: "Ücrete Esas Ağırlık", unit: "kg", format: "number" },
    { id: "freightCost", label: "Taşıma Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "freightCost", warning: 50, critical: 100, direction: "higher_is_bad", warningMessage: "Taşıma > $50 — ambalaj optimizasyonu önerilir.", criticalMessage: "Taşıma > $100 — hacimsel ağırlık fazla, ambalaj küçültülmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.volumetric_weight_air", inputMap: { length: "length", width: "width", height: "height" }, outputId: "volWeight" },
    { formulaId: "measurement.volumetric_chargeable", inputMap: { grossWeight: "grossWeight", volWeight: "volWeight" }, outputId: "chargeable" },
    { formulaId: "cost.volumetric_freight", inputMap: { chargeable: "chargeable", freightRate: "freightRate" }, outputId: "freightCost" },
  ],
  reportTemplate: { title: "Volumetric Weight Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Air: (L×W×H)/6000. Road: /5000. Sea: /1000.", "Chargeable = MAX(Gross, VolWeight).", "Freight = Chargeable × Rate."] },
};
