/**
 * Tool #57 — İskele Kiralama
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SCAFFOLD_RENTAL_SCHEMA: PremiumCalculatorSchema = {
  id: "scaffold-rental-cost-analyzer", legacyPaidSlug: "scaffold-rental-cost-analyzer",
  name: "İskele Kiralama & Süre Optimizasyonu", name_i18n: {"en":"Scaffold Rental & Duration Optimization","tr":"İskele Kiralama & Süre Optimizasyonu"}, sectorSlug: "construction", category: "cost",
  painStatement: "İskele kiralama süresi ve alanı optimize edilmezse gereksiz kira, işçilik ve nakliye maliyeti oluşur.", painStatement_i18n: {"en":"If scaffold rental duration and area are not optimized, unnecessary rent, labor, and transportation costs occur.","tr":"İskele kiralama süresi ve alanı optimize edilmezse gereksiz kira, işçilik ve nakliye maliyeti oluşur."},
  inputs: [
    { id: "buildingPerimeter", label: "Bina Çevresi", label_i18n: {"en":"Building perimeter","tr":"Bina Çevresi"}, type: "number", unit: "m", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Building perimeter", expertMeaning_i18n: {"en":"Building perimeter","tr":"bina çevresi"} },
    { id: "buildingHeight", label: "Bina Yüksekliği", label_i18n: {"en":"Building height","tr":"Bina Yüksekliği"}, type: "number", unit: "m", required: true, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Building height", expertMeaning_i18n: {"en":"Building height","tr":"bina yüksekliği"} },
    { id: "rentalRatePerM2", label: "m² Kiralama Bedeli", label_i18n: {"en":"Rental Rate per m²","tr":"m² Kiralama Bedeli"}, type: "number", unit: "USD/m²/ay", required: true, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Monthly rental rate per m²", expertMeaning_i18n: {"en":"Monthly rental rate per m²","tr":"Aylık m² kiralama bedeli"} },
    { id: "rentalDuration", label: "Kiralama Süresi", label_i18n: {"en":"Rental duration","tr":"Kiralama Süresi"}, type: "number", unit: "ay", required: true, smartDefault: 6, validation: { min: 0.5 }, helper: "", expertMeaning: "Rental duration", expertMeaning_i18n: {"en":"Rental duration","tr":"kiralama süresi"} },
    { id: "erectionRate", label: "Montaj İşçilik (m² başına)", label_i18n: {"en":"Erection labor rate per m²","tr":"Montaj İşçilik (m² başına)"}, type: "number", unit: "USD/m²", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Erection labor rate per m²", expertMeaning_i18n: {"en":"Erection labor rate per m²","tr":"montaj i̇şçilik (m² başına)"} },
    { id: "dismantleRate", label: "Söküm İşçilik (m² başına)", label_i18n: {"en":"Dismantle labor rate per m²","tr":"Söküm İşçilik (m² başına)"}, type: "number", unit: "USD/m²", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Dismantle labor rate per m²", expertMeaning_i18n: {"en":"Dismantle labor rate per m²","tr":"söküm i̇şçilik (m² başına)"} },
    { id: "transportCost", label: "Nakliye Maliyeti", label_i18n: {"en":"Transportation Cost","tr":"Nakliye Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Transport cost", expertMeaning_i18n: {"en":"Transport cost","tr":"Nakliye maliyeti"} },
    { id: "overrunCost", label: "Süre Aşımı Maliyeti", label_i18n: {"en":"Overrun extension cost","tr":"Süre Aşımı Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "", expertMeaning: "Overrun extension cost", expertMeaning_i18n: {"en":"Overrun extension cost","tr":"süre aşımı maliyeti"} },
  ],
  outputs: [
    { id: "scaffoldArea", label: "İskele Alanı", label_i18n: {"en":"Iskele Alan","tr":"İskele Alanı"}, unit: "m²", format: "number" },
    { id: "rental", label: "Kiralama Maliyeti", label_i18n: {"en":"Rental Cost","tr":"Kiralama Maliyeti"}, unit: "USD", format: "currency" },
    { id: "laborCost", label: "İşçilik Maliyeti", label_i18n: {"en":"Labor Cost","tr":"İşçilik Maliyeti"}, unit: "USD", format: "currency" },
    { id: "total", label: "Toplam İskele Maliyeti", label_i18n: {"en":"Toplam Iskele Maliyeti","tr":"Toplam İskele Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "total", warning: 50000, critical: 100000, direction: "higher_is_bad", warningMessage: "Maliyet > $50K — kiralama süresi veya alanı optimize edilmeli.", warningMessage_i18n: {"en":"Maliyet > $50K — kiralama süresi veya alanı optimize edilmeli.","tr":"Maliyet > $50K — kiralama süresi veya alanı optimize edilmeli."}, criticalMessage: "Maliyet > $100K — alternatif iskele sistemi değerlendirilmeli.", criticalMessage_i18n: {"en":"Maliyet > $100K — alternatif iskele sistemi değerlendirilmeli.","tr":"Maliyet > $100K — alternatif iskele sistemi değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.scaffold_area", inputMap: { buildingPerimeter: "buildingPerimeter", buildingHeight: "buildingHeight" }, outputId: "scaffoldArea" },
    { formulaId: "cost.scaffold_rental", inputMap: { scaffoldArea: "scaffoldArea", rentalRatePerM2: "rentalRatePerM2", rentalDuration: "rentalDuration" }, outputId: "rental" },
    { formulaId: "cost.scaffold_labor", inputMap: { scaffoldArea: "scaffoldArea", erectionRate: "erectionRate", dismantleRate: "dismantleRate" }, outputId: "laborCost" },
    { formulaId: "cost.scaffold_total", inputMap: { rental: "rental", laborCost: "laborCost", transportCost: "transportCost", overrunCost: "overrunCost" }, outputId: "total" },
  ],
  reportTemplate: { title: "Scaffold Rental Cost Report", title_i18n: {"en":"Scaffold Rental Cost Report","tr":"İskele Kiralama Maliyet Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Area = Perimeter × Height.", "Rental = Area×Rate×Dur. Labor = Area×(Erect+Dism).", "Total = Rental+Labor+Transport+Overrun."],assumptionNotes_i18n:[{"en":"Area = Perimeter × Height.","tr":"Area = Perimeter × Height."},{"en":"Rental = Area×Rate×Dur. Labor = Area×(Erect+Dism).","tr":"Rental = Area×Rate×Dur. Labor = Area×(Erect+Dism)."},{"en":"Total = Rental+Labor+Transport+Overrun.","tr":"Total = Rental+Labor+Transport+Overrun."}] },
};
