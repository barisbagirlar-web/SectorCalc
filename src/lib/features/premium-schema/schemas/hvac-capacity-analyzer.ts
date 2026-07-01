/**
 * Tool #51 — HVAC Kapasite
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HVAC_CAPACITY_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-capacity-analyzer", legacyPaidSlug: "hvac-capacity-analyzer",
  name: "HVAC Capacity & Energy Cost Analyzer", name_i18n: {"en":"HVAC Capacity & Energy Cost Analyzer"}, sectorSlug: "construction", category: "measurement",
  painStatement: "HVAC kapasite hesabı (duyulur/gizli ısı, tonaj, EER) yapılmadan doğru klima sistemi seçimi ve enerji maliyeti tahmini mümkün değildir.", painStatement_i18n: {"en":"HVAC capacity calculation (duyulur/gizli heat, tonnage, EER) without accurate AC system selection ve energy Cost Estimated possible değildir."},
  inputs: [
    { id: "cfm", label: "Hava Debisi (CFM)", label_i18n: {"en":"Air Flow (CFM)"}, type: "number", unit: "cfm", required: true, smartDefault: 2000, validation: { min: 1 }, helper: "", expertMeaning: "Air flow in CFM", expertMeaning_i18n: {"en":"Air flow in CFM"} },
    { id: "deltaTemp", label: "Temperature difference", label_i18n: {"en":"Temperature difference"}, type: "number", unit: "°F", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Temperature difference", expertMeaning_i18n: {"en":"Temperature difference"} },
    { id: "deltaHumidity", label: "Humidity ratio difference", label_i18n: {"en":"Humidity ratio difference"}, type: "number", unit: "gr/lb", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Humidity ratio difference", expertMeaning_i18n: {"en":"Humidity ratio difference"} },
    { id: "eer", label: "Energy Efficiency Ratio", label_i18n: {"en":"Energy Efficiency Ratio"}, type: "number", unit: "BTU/W", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Energy Efficiency Ratio", expertMeaning_i18n: {"en":"Energy Efficiency Ratio"} },
    { id: "operatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "saat/yıl", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours"} },
    { id: "elecRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate", expertMeaning_i18n: {"en":"Electricity rate"} },
  ],
  outputs: [
    { id: "sensible", label: "Duyulur Is", label_i18n: {"en":"Sensible Heat"}, unit: "BTU/saat", format: "number" },
    { id: "totalBtu", label: "Total Heat Load", label_i18n: {"en":"Total Heat Load"}, unit: "BTU/saat", format: "number" },
    { id: "tons", label: "Capacity (Tons)", label_i18n: {"en":"Capacity (Tons)"}, unit: "ton", format: "number" },
    { id: "annualCost", label: "Annual Energy Cost", label_i18n: {"en":"Annual Energy Cost"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "annualCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Enerji maliyeti > $5000 — EER iyileştirilmeli.", warningMessage_i18n: {"en":"energy Cost > $5000 — EER iyileştirilmeli."}, criticalMessage: "Maliyet > $15000 — sistem yenileme değerlendirilmeli.", criticalMessage_i18n: {"en":"Cost > $15000 — System replacement değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.hvac_sensible", inputMap: { cfm: "cfm", deltaTemp: "deltaTemp" ,
        deltaT: "deltaT"}, outputId: "sensible" },
    { formulaId: "measurement.hvac_latent", inputMap: { cfm: "cfm", deltaHumidity: "deltaHumidity" ,
        deltaW: "deltaW"}, outputId: "latent" },
    { formulaId: "measurement.hvac_total_btu", inputMap: { sensible: "sensible", latent: "latent" }, outputId: "totalBtu" },
    { formulaId: "measurement.hvac_tons", inputMap: { totalBtu: "totalBtu" ,
        totalLoad: "totalLoad"}, outputId: "tons" },
    { formulaId: "cost.hvac_annual_cost", inputMap: {
        eer: "eer",
        elecRate: "elecRate",
        totalLoad: "totalBtu",
        hours: "operatingHours"
      }, outputId: "annualCost" },
  ],
  reportTemplate: { title: "HVAC Capacity Report", title_i18n: {"en":"HVAC Capacity Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Sensible = 1.08×CFM×ΔT. Latent = 0.68×CFM×ΔW.", "Total = Sensible+Latent. Tons = Total/12000.", "Cost = (Total/EER)×Hours×ElecRate."],assumptionNotes_i18n:[{"en":"Sensible = 1.08×CFM×ΔT. Latent = 0.68×CFM×ΔW."},{"en":"Total = Sensible+Latent. Tons = Total/12000."},{"en":"Cost = (Total/EER)×Hours×ElecRate."}] },
};
