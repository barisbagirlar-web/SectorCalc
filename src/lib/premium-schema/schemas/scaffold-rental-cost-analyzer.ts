/**
 * Tool #57 — İskele Kiralama
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SCAFFOLD_RENTAL_SCHEMA: PremiumCalculatorSchema = {
  id: "scaffold-rental-cost-analyzer", legacyPaidSlug: "scaffold-rental-cost-analyzer",
  name: "İskele Kiralama & Süre Optimizasyonu", sectorSlug: "construction", category: "cost",
  painStatement: "İskele kiralama süresi ve alanı optimize edilmezse gereksiz kira, işçilik ve nakliye maliyeti oluşur.",
  inputs: [
    { id: "buildingPerimeter", label: "Bina Çevresi", type: "number", unit: "m", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Building perimeter" },
    { id: "buildingHeight", label: "Bina Yüksekliği", type: "number", unit: "m", required: true, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Building height" },
    { id: "rentalRatePerM2", label: "m² Kiralama Bedeli", type: "number", unit: "USD/m²/ay", required: true, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Monthly rental rate per m²" },
    { id: "rentalDuration", label: "Kiralama Süresi", type: "number", unit: "ay", required: true, smartDefault: 6, validation: { min: 0.5 }, helper: "", expertMeaning: "Rental duration" },
    { id: "erectionRate", label: "Montaj İşçilik (m² başına)", type: "number", unit: "USD/m²", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Erection labor rate per m²" },
    { id: "dismantleRate", label: "Söküm İşçilik (m² başına)", type: "number", unit: "USD/m²", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Dismantle labor rate per m²" },
    { id: "transportCost", label: "Nakliye Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Transport cost" },
    { id: "overrunCost", label: "Süre Aşımı Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "", expertMeaning: "Overrun extension cost" },
  ],
  outputs: [
    { id: "scaffoldArea", label: "İskele Alanı", unit: "m²", format: "number" },
    { id: "rental", label: "Kiralama Maliyeti", unit: "USD", format: "currency" },
    { id: "laborCost", label: "İşçilik Maliyeti", unit: "USD", format: "currency" },
    { id: "total", label: "Toplam İskele Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "total", warning: 50000, critical: 100000, direction: "higher_is_bad", warningMessage: "Maliyet > $50K — kiralama süresi veya alanı optimize edilmeli.", criticalMessage: "Maliyet > $100K — alternatif iskele sistemi değerlendirilmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.scaffold_area", inputMap: { buildingPerimeter: "buildingPerimeter", buildingHeight: "buildingHeight" }, outputId: "scaffoldArea" },
    { formulaId: "cost.scaffold_rental", inputMap: { scaffoldArea: "scaffoldArea", rentalRatePerM2: "rentalRatePerM2", rentalDuration: "rentalDuration" }, outputId: "rental" },
    { formulaId: "cost.scaffold_labor", inputMap: { scaffoldArea: "scaffoldArea", erectionRate: "erectionRate", dismantleRate: "dismantleRate" }, outputId: "laborCost" },
    { formulaId: "cost.scaffold_total", inputMap: { rental: "rental", laborCost: "laborCost", transportCost: "transportCost", overrunCost: "overrunCost" }, outputId: "total" },
  ],
  reportTemplate: { title: "Scaffold Rental Cost Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Area = Perimeter × Height.", "Rental = Area×Rate×Dur. Labor = Area×(Erect+Dism).", "Total = Rental+Labor+Transport+Overrun."] },
};
