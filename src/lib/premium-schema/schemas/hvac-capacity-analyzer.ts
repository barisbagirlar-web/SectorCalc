/**
 * Tool #51 — HVAC Kapasite
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const HVAC_CAPACITY_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-capacity-analyzer", legacyPaidSlug: "hvac-capacity-analyzer",
  name: "HVAC Kapasite & Enerji Maliyet Analizi", sectorSlug: "construction", category: "measurement",
  painStatement: "HVAC kapasite hesabı (duyulur/gizli ısı, tonaj, EER) yapılmadan doğru klima sistemi seçimi ve enerji maliyeti tahmini mümkün değildir.",
  inputs: [
    { id: "cfm", label: "Hava Debisi (CFM)", type: "number", unit: "cfm", required: true, smartDefault: 2000, validation: { min: 1 }, helper: "", expertMeaning: "Air flow in CFM" },
    { id: "deltaTemp", label: "Sıcaklık Farkı (ΔT)", type: "number", unit: "°F", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Temperature difference" },
    { id: "deltaHumidity", label: "Nem Farkı (ΔW)", type: "number", unit: "gr/lb", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Humidity ratio difference" },
    { id: "eer", label: "EER (Enerji Verimlilik Oranı)", type: "number", unit: "BTU/W", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Energy Efficiency Ratio" },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", type: "number", unit: "saat/yıl", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours" },
    { id: "elecRate", label: "Elektrik Tarifesi", type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate" },
  ],
  outputs: [
    { id: "sensible", label: "Duyulur Isı", unit: "BTU/saat", format: "number" },
    { id: "totalBtu", label: "Toplam Isı Yükü", unit: "BTU/saat", format: "number" },
    { id: "tons", label: "Kapasite (Ton)", unit: "ton", format: "number" },
    { id: "annualCost", label: "Yıllık Enerji Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "annualCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Enerji maliyeti > $5000 — EER iyileştirilmeli.", criticalMessage: "Maliyet > $15000 — sistem yenileme değerlendirilmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.hvac_sensible", inputMap: { cfm: "cfm", deltaTemp: "deltaTemp" }, outputId: "sensible" },
    { formulaId: "measurement.hvac_latent", inputMap: { cfm: "cfm", deltaHumidity: "deltaHumidity" }, outputId: "latent" },
    { formulaId: "measurement.hvac_total_btu", inputMap: { sensible: "sensible", latent: "latent" }, outputId: "totalBtu" },
    { formulaId: "measurement.hvac_tons", inputMap: { totalBtu: "totalBtu" }, outputId: "tons" },
    { formulaId: "cost.hvac_annual_cost", inputMap: { totalBtu: "totalBtu", eer: "eer", operatingHours: "operatingHours", elecRate: "elecRate" }, outputId: "annualCost" },
  ],
  reportTemplate: { title: "HVAC Capacity Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Sensible = 1.08×CFM×ΔT. Latent = 0.68×CFM×ΔW.", "Total = Sensible+Latent. Tons = Total/12000.", "Cost = (Total/EER)×Hours×ElecRate."] },
};
