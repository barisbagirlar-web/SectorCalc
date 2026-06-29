import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CUT_FILL_BALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "cut-fill-balance-analyzer", legacyPaidSlug: "cut-fill-balance-analyzer",
  name: "Kesme-Dolgu Denge Analizi", name_i18n: {"en":"Cut-Fill Balance Analysis","tr":"Kesme-Dolgu Denge Analizi"}, sectorSlug: "construction", category: "measurement",
  painStatement: "Kazı-dolgu dengesi hesaplanmazsa, fazla hafriyat veya ödünç malzeme maliyeti kontrol edilemez.", painStatement_i18n: {"en":"If cut-fill balance is not calculated, excess excavation or borrow material cost cannot be controlled.","tr":"Kazı-dolgu dengesi hesaplanmazsa, fazla hafriyat veya ödünç malzeme maliyeti kontrol edilemez."},
  inputs: [
    { id: "cutVolume", label: "Kazı Hacmi", label_i18n: {"en":"Cut Volume","tr":"Kazı Hacmi"}, type: "number", unit: "m³", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Total cut volume", expertMeaning_i18n: {"en":"Total cut volume","tr":"Toplam kazı hacmi"} },
    { id: "fillVolume", label: "Dolgu Hacmi", label_i18n: {"en":"Fill Volume","tr":"Dolgu Hacmi"}, type: "number", unit: "m³", required: true, smartDefault: 4500, validation: { min: 0 }, helper: "", expertMeaning: "Total fill volume", expertMeaning_i18n: {"en":"Total fill volume","tr":"Toplam dolgu hacmi"} },
    { id: "shrinkageFactor", label: "Sıkışma Faktörü", label_i18n: {"en":"Shrinkage Factor","tr":"Sıkışma Faktörü"}, type: "number", unit: "", required: false, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Compaction shrinkage", expertMeaning_i18n: {"en":"Compaction shrinkage","tr":"Sıkışma büzülmesi"} },
    { id: "swellFactor", label: "Kabarma Faktörü", label_i18n: {"en":"Swell Factor","tr":"Kabarma Faktörü"}, type: "number", unit: "", required: false, smartDefault: 1.25, validation: { min: 1 }, helper: "", expertMeaning: "Material swell factor", expertMeaning_i18n: {"en":"Material swell factor","tr":"Malzeme kabarma faktörü"} },
    { id: "haulCost", label: "Nakliye Birim Fiyatı", label_i18n: {"en":"Haul Unit Cost","tr":"Nakliye Birim Fiyatı"}, type: "number", unit: "USD/m³-km", required: true, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Haul cost per m³-km", expertMeaning_i18n: {"en":"Haul cost per m³-km","tr":"m³-km başına nakliye maliyeti"} },
    { id: "borrowDistance", label: "Ödünç Malzeme Mesafesi", label_i18n: {"en":"Borrow Material Distance","tr":"Ödünç Malzeme Mesafesi"}, type: "number", unit: "km", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Borrow pit distance", expertMeaning_i18n: {"en":"Borrow pit distance","tr":"Ödünç malzeme ocağı mesafesi"} },
    { id: "wasteDistance", label: "Depo Sahası Mesafesi", label_i18n: {"en":"Waste Site Distance","tr":"Depo Sahası Mesafesi"}, type: "number", unit: "km", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Waste site distance", expertMeaning_i18n: {"en":"Waste site distance","tr":"Depo sahası mesafesi"} },
  ],
  outputs: [
    { id: "netBalance", label: "Net Denge", label_i18n: {"en":"Net Balance","tr":"Net Denge"}, unit: "m³", format: "number" },
    { id: "borrowRequired", label: "Ödünç Malzeme", label_i18n: {"en":"Borrow Material","tr":"Ödünç Malzeme"}, unit: "m³", format: "number" },
    { id: "wasteRequired", label: "Fazla Malzeme", label_i18n: {"en":"Waste Material","tr":"Fazla Malzeme"}, unit: "m³", format: "number" },
    { id: "totalHaulCost", label: "Toplam Nakliye Maliyeti", label_i18n: {"en":"Total Haul Cost","tr":"Toplam Nakliye Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "borrowRequired", warning: 500, critical: 2000, direction: "higher_is_bad", warningMessage: "Ödünç > 500m³ — maliyet artışı beklenir.", warningMessage_i18n: {"en":"Borrow > 500m³ — cost increase expected.","tr":"Ödünç > 500m³ — maliyet artışı beklenir."}, criticalMessage: "Ödünç > 2000m³ — proje ekonomisi riskli.", criticalMessage_i18n: {"en":"Borrow > 2000m³ — project economics at risk.","tr":"Ödünç > 2000m³ — proje ekonomisi riskli."} }],
  formulaPipeline: [
    { formulaId: "measurement.cut_fill_net", inputMap: { cutVolume: "cutVolume", fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor" }, outputId: "netBalance" },
    { formulaId: "measurement.cut_fill_borrow", inputMap: { fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor", cutVolume: "cutVolume" }, outputId: "borrowRequired" },
    { formulaId: "measurement.cut_fill_waste", inputMap: { cutVolume: "cutVolume", fillVolume: "fillVolume", shrinkageFactor: "shrinkageFactor" }, outputId: "wasteRequired" },
    { formulaId: "cost.cut_fill_haul", inputMap: { borrowRequired: "borrowRequired", borrowDistance: "borrowDistance", wasteRequired: "wasteRequired", wasteDistance: "wasteDistance", haulCost: "haulCost" }, outputId: "totalHaulCost" },
  ],
  reportTemplate: { title: "Kesme-Dolgu Denge Raporu", title_i18n: {"en":"Cut-Fill Balance Report","tr":"Kesme-Dolgu Denge Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Net Denge = Kazı - (Dolgu × Sıkışma).", "Ödünç = max(0, Dolgu×Sıkışma - Kazı).", "Nakliye = Hacim × Mesafe × Birim Fiyat."],assumptionNotes_i18n:[{"en":"Net Balance = Cut - (Fill × Shrinkage).","tr":"Net Denge = Kazı - (Dolgu × Sıkışma)."},{"en":"Borrow = max(0, Fill×Shrinkage - Cut).","tr":"Ödünç = max(0, Dolgu×Sıkışma - Kazı)."},{"en":"Haul = Volume × Distance × Unit Cost.","tr":"Nakliye = Hacim × Mesafe × Birim Fiyat."}] },
};
