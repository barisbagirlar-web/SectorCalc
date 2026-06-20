import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CUT_FILL_BALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "cut-fill-balance-analyzer", legacyPaidSlug: "cut-fill-balance-analyzer",
  name: "Kesme-Dolgu Denge Analizi", sectorSlug: "construction", category: "measurement",
  painStatement: "Kazı-dolgu dengesi hesaplanmazsa, fazla hafriyat veya ödünç malzeme maliyeti kontrol edilemez.",
  inputs: [
    { id: "cutVolume", label: "Kazı Hacmi", type: "number", unit: "m³", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Total cut volume" },
    { id: "fillVolume", label: "Dolgu Hacmi", type: "number", unit: "m³", required: true, smartDefault: 4500, validation: { min: 0 }, helper: "", expertMeaning: "Total fill volume" },
    { id: "shrinkageFactor", label: "Sıkışma Faktörü", type: "number", unit: "", required: false, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Compaction shrinkage" },
    { id: "swellFactor", label: "Kabarma Faktörü", type: "number", unit: "", required: false, smartDefault: 1.25, validation: { min: 1 }, helper: "", expertMeaning: "Material swell factor" },
    { id: "haulCost", label: "Nakliye Birim Fiyatı", type: "number", unit: "USD/m³-km", required: true, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Haul cost per m³-km" },
    { id: "borrowDistance", label: "Ödünç Malzeme Mesafesi", type: "number", unit: "km", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Borrow pit distance" },
    { id: "wasteDistance", label: "Depo Sahası Mesafesi", type: "number", unit: "km", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Waste site distance" },
  ],
  outputs: [
    { id: "netBalance", label: "Net Denge", unit: "m³", format: "number" },
    { id: "borrowRequired", label: "Ödünç Malzeme", unit: "m³", format: "number" },
    { id: "wasteRequired", label: "Fazla Malzeme", unit: "m³", format: "number" },
    { id: "totalHaulCost", label: "Toplam Nakliye Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "borrowRequired", warning: 500, critical: 2000, direction: "higher_is_bad", warningMessage: "Ödünç > 500m³ — maliyet artışı beklenir.", criticalMessage: "Ödünç > 2000m³ — proje ekonomisi riskli." }],
  formulaPipeline: [
    { formulaId: "measurement.cut_fill_net", inputMap: { cutVolume: "cutVolume", fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor" }, outputId: "netBalance" },
    { formulaId: "measurement.cut_fill_borrow", inputMap: { fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor", cutVolume: "cutVolume" }, outputId: "borrowRequired" },
    { formulaId: "measurement.cut_fill_waste", inputMap: { cutVolume: "cutVolume", fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor" }, outputId: "wasteRequired" },
    { formulaId: "cost.cut_fill_haul", inputMap: { borrowRequired: "borrowRequired", borrowDistance: "borrowDistance", wasteRequired: "wasteRequired", wasteDistance: "wasteDistance", haulCost: "haulCost" }, outputId: "totalHaulCost" },
  ],
  reportTemplate: { title: "Kesme-Dolgu Denge Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Net Denge = Kazı - (Dolgu × Sıkışma).", "Ödünç = max(0, Dolgu×Sıkışma - Kazı).", "Nakliye = Hacim × Mesafe × Birim Fiyat."] },
};
