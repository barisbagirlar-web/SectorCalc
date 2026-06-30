/**
 * Tool #51 — HVAC Kapasite
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HVAC_CAPACITY_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-capacity-analyzer", legacyPaidSlug: "hvac-capacity-analyzer",
  name: "HVAC Kapasite & Enerji Maliyet Analizi", name_i18n: {"en":"HVAC Kapasite & Enerji Maliyet Analizi","tr":"HVAC Kapasite & Enerji Maliyet Analizi"}, sectorSlug: "construction", category: "measurement",
  painStatement: "HVAC kapasite hesabı (duyulur/gizli ısı, tonaj, EER) yapılmadan doğru klima sistemi seçimi ve enerji maliyeti tahmini mümkün değildir.", painStatement_i18n: {"en":"HVAC kapasite hesabı (duyulur/gizli ısı, tonaj, EER) yapılmadan doğru klima sistemi seçimi ve enerji maliyeti tahmini mümkün değildir.","tr":"HVAC kapasite hesabı (duyulur/gizli ısı, tonaj, EER) yapılmadan doğru klima sistemi seçimi ve enerji maliyeti tahmini mümkün değildir."},
  inputs: [
    { id: "cfm", label: "Hava Debisi (CFM)", label_i18n: {"en":"Hava Debisi (CFM)","tr":"Hava Debisi (CFM)"}, type: "number", unit: "cfm", required: true, smartDefault: 2000, validation: { min: 1 }, helper: "", expertMeaning: "Air flow in CFM", expertMeaning_i18n: {"en":"Air flow in CFM","tr":"Air flow in CFM"} },
    { id: "deltaTemp", label: "Sıcaklık Farkı (ΔT)", label_i18n: {"en":"Temperature difference","tr":"Sıcaklık Farkı (ΔT)"}, type: "number", unit: "°F", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Temperature difference", expertMeaning_i18n: {"en":"Temperature difference","tr":"sıcaklık farkı (δt)"} },
    { id: "deltaHumidity", label: "Nem Farkı (ΔW)", label_i18n: {"en":"Humidity ratio difference","tr":"Nem Farkı (ΔW)"}, type: "number", unit: "gr/lb", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Humidity ratio difference", expertMeaning_i18n: {"en":"Humidity ratio difference","tr":"nem farkı (δw)"} },
    { id: "eer", label: "EER (Enerji Verimlilik Oranı)", label_i18n: {"en":"Energy Efficiency Ratio","tr":"EER (Enerji Verimlilik Oranı)"}, type: "number", unit: "BTU/W", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Energy Efficiency Ratio", expertMeaning_i18n: {"en":"Energy Efficiency Ratio","tr":"eer (enerji verimlilik oranı)"} },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", label_i18n: {"en":"Annual operating hours","tr":"Yıllık Çalışma Saati"}, type: "number", unit: "saat/yıl", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours","tr":"yıllık çalışma saati"} },
    { id: "elecRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Elektrik Tarifesi","tr":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate", expertMeaning_i18n: {"en":"Electricity rate","tr":"Electricity rate"} },
  ],
  outputs: [
    { id: "sensible", label: "Duyulur Isı", label_i18n: {"en":"Duyulur Is","tr":"Duyulur Isı"}, unit: "BTU/saat", format: "number" },
    { id: "totalBtu", label: "Toplam Isı Yükü", label_i18n: {"en":"Toplam Is Yuku","tr":"Toplam Isı Yükü"}, unit: "BTU/saat", format: "number" },
    { id: "tons", label: "Kapasite (Ton)", label_i18n: {"en":"Kapasite (Ton)","tr":"Kapasite (Ton)"}, unit: "ton", format: "number" },
    { id: "annualCost", label: "Yıllık Enerji Maliyeti", label_i18n: {"en":"Yllk Enerji Maliyeti","tr":"Yıllık Enerji Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "annualCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Enerji maliyeti > $5000 — EER iyileştirilmeli.", warningMessage_i18n: {"en":"Enerji maliyeti > $5000 — EER iyileştirilmeli.","tr":"Enerji maliyeti > $5000 — EER iyileştirilmeli."}, criticalMessage: "Maliyet > $15000 — sistem yenileme değerlendirilmeli.", criticalMessage_i18n: {"en":"Maliyet > $15000 — sistem yenileme değerlendirilmeli.","tr":"Maliyet > $15000 — sistem yenileme değerlendirilmeli."} }],
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
  reportTemplate: { title: "HVAC Capacity Report", title_i18n: {"en":"HVAC Capacity Report","tr":"HVAC Capacity Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Sensible = 1.08×CFM×ΔT. Latent = 0.68×CFM×ΔW.", "Total = Sensible+Latent. Tons = Total/12000.", "Cost = (Total/EER)×Hours×ElecRate."],assumptionNotes_i18n:[{"en":"Sensible = 1.08×CFM×ΔT. Latent = 0.68×CFM×ΔW.","tr":"Sensible = 1.08×CFM×ΔT. Latent = 0.68×CFM×ΔW."},{"en":"Total = Sensible+Latent. Tons = Total/12000.","tr":"Total = Sensible+Latent. Tons = Total/12000."},{"en":"Cost = (Total/EER)×Hours×ElecRate.","tr":"Cost = (Total/EER)×Hours×ElecRate."}] },
};
