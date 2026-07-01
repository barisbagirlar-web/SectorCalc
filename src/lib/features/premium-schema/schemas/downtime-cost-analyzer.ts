/**
 * Tool #5 — Arıza Süresi Maliyeti (Downtime Cost)
 * 6-component total cost
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DOWNTIME_COST_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "downtime-cost-analyzer", legacyPaidSlug: "downtime-cost-analyzer",
  name: "Arıza Süresi Maliyet Analizi", name_i18n: {"en":"Downtime Cost Analyzer"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Plansız duruşların gerçek maliyeti sadece kayıp üretim değil; işçilik, enerji, kalite ve müşteri cezalarını da içerir. Bu araç 6 bileşenli toplam duruş maliyetini hesaplar.", painStatement_i18n: {"en":"Plansız duruşların gerçek maliyeti sadece kayıp üretim değil; işçilik, enerji, kalite ve müşteri cezalarını da içerir. Bu araç 6 bileşenli toplam duruş maliyetini hesaplar."},
  inputs: [
    { id: "downtimeHours", label: "Arıza Süresi", label_i18n: {"en":"Total downtime hours"}, type: "number", unit: "saat", required: true, smartDefault: 4, validation: { min: 0 }, helper: "", expertMeaning: "Total downtime hours", expertMeaning_i18n: {"en":"Total downtime hours"} },
    { id: "affectedWorkers", label: "Etkilenen İşçi", label_i18n: {"en":"Number of idle workers"}, type: "number", unit: "kişi", required: true, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Number of idle workers", expertMeaning_i18n: {"en":"Number of idle workers"} },
    { id: "avgHourlyRate", label: "Ortalama Saatlik Ücret", label_i18n: {"en":"Average wage rate"}, type: "number", unit: "USD/saat", required: true, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Average wage rate", expertMeaning_i18n: {"en":"Average wage rate"} },
    { id: "lineCapacityPerHour", label: "Hat Kapasitesi", label_i18n: {"en":"Hat Kapasitesi"}, type: "number", unit: "adet/saat", required: true, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Production line capacity per hour", expertMeaning_i18n: {"en":"Production line capacity per hour"} },
    { id: "contributionMarginPerUnit", label: "Birim Katkı Marjı", label_i18n: {"en":"Contribution margin per unit"}, type: "number", unit: "USD", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Contribution margin per unit", expertMeaning_i18n: {"en":"Contribution margin per unit"} },
    { id: "idlePowerKw", label: "Boşta Güç Tüketimi", label_i18n: {"en":"Power consumption during idle"}, type: "number", unit: "kW", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Power consumption during idle", expertMeaning_i18n: {"en":"Power consumption during idle"} },
    { id: "electricityRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity unit cost", expertMeaning_i18n: {"en":"Electricity unit cost"} },
    { id: "overtimeHours", label: "Fazla Mesai Saati", label_i18n: {"en":"Fazla Mesai Saati"}, type: "number", unit: "saat", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Recovery overtime hours", expertMeaning_i18n: {"en":"Recovery overtime hours"} },
    { id: "overtimeRate", label: "Fazla Mesai Ücreti", label_i18n: {"en":"Overtime hourly rate (1.5x)"}, type: "number", unit: "USD/saat", required: false, smartDefault: 37.5, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hourly rate (1.5x)", expertMeaning_i18n: {"en":"Overtime hourly rate (1.5x)"} },
    { id: "startupScrapUnits", label: "Startup Hurda", label_i18n: {"en":"Startup Hurda"}, type: "number", unit: "adet", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Scrap after restart", expertMeaning_i18n: {"en":"Scrap after restart"} },
    { id: "unitCost", label: "Birim Maliyet", label_i18n: {"en":"Birim Maliyet"}, type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Cost per scrapped unit", expertMeaning_i18n: {"en":"Cost per scrapped unit"} },
    { id: "lateDeliveryPenalty", label: "Gecikme Cezası", label_i18n: {"en":"Customer late penalty"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Customer late penalty", expertMeaning_i18n: {"en":"Customer late penalty"} },
    { id: "mtbfHours", label: "MTBF", label_i18n: {"en":"MTBF"}, type: "number", unit: "saat", required: false, smartDefault: 8760, validation: { min: 0 }, helper: "", expertMeaning: "Mean Time Between Failures", expertMeaning_i18n: {"en":"Mean Time Between Failures"} },
  ],
  outputs: [
    { id: "directLaborLoss", label: "Direkt İşçilik Kaybı", label_i18n: {"en":"Direkt Iscilik Kayb"}, unit: "USD", format: "currency" },
    { id: "productionLoss", label: "Üretim Kaybı", label_i18n: {"en":"Uretim Kayb"}, unit: "USD", format: "currency" },
    { id: "energyWaste", label: "Enerji İsrafı", label_i18n: {"en":"Enerji Israf"}, unit: "USD", format: "currency" },
    { id: "recoveryCost", label: "Kurtarma Maliyeti", label_i18n: {"en":"Kurtarma Maliyeti"}, unit: "USD", format: "currency" },
    { id: "qualityLoss", label: "Kalite Kaybı", label_i18n: {"en":"Kalite Kayb"}, unit: "USD", format: "currency" },
    { id: "totalDowntimeCost", label: "Toplam Duruş Maliyeti", label_i18n: {"en":"Toplam Durus Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalDowntimeCost", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Duruş maliyeti > $10K — önleyici bakım planı gözden geçirilmeli.", warningMessage_i18n: {"en":"Duruş maliyeti > $10K — önleyici bakım planı gözden geçirilmeli."}, criticalMessage: "Duruş maliyeti > $50K — acil kök neden analizi gerekiyor.", criticalMessage_i18n: {"en":"Duruş maliyeti > $50K — acil kök neden analizi gerekiyor."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.downtime_labor", inputMap: { downtimeHours: "downtimeHours", affectedWorkers: "affectedWorkers", avgHourlyRate: "avgHourlyRate" }, outputId: "directLaborLoss" },
    { formulaId: "cost.downtime_production", inputMap: { downtimeHours: "downtimeHours", lineCapacityPerHour: "lineCapacityPerHour", contributionMarginPerUnit: "contributionMarginPerUnit" }, outputId: "productionLoss" },
    { formulaId: "cost.downtime_energy", inputMap: { idlePowerKw: "idlePowerKw", downtimeHours: "downtimeHours", electricityRate: "electricityRate" }, outputId: "energyWaste" },
    { formulaId: "cost.downtime_recovery", inputMap: { overtimeHours: "overtimeHours", overtimeRate: "overtimeRate" }, outputId: "recoveryCost" },
    { formulaId: "cost.downtime_quality", inputMap: { startupScrapUnits: "startupScrapUnits", unitCost: "unitCost" }, outputId: "qualityLoss" },
    { formulaId: "cost.downtime_total", inputMap: { directLaborLoss: "directLaborLoss", productionLoss: "productionLoss", energyWaste: "energyWaste", recoveryCost: "recoveryCost", qualityLoss: "qualityLoss", penalty: "lateDeliveryPenalty" }, outputId: "totalDowntimeCost" },
  ],
  reportTemplate: { title: "Downtime Cost Analysis Report", title_i18n: {"en":"Downtime Cost Analysis Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Direct labor loss = Downtime × Workers × Rate × (1+burden).", "Production loss = Downtime × Capacity × Contribution Margin.", "Energy waste = Idle Power × Hours × Rate.", "Maintenance burden rate assumed 30% of base wage."],assumptionNotes_i18n:[{"en":"Direct labor loss = Downtime × Workers × Rate × (1+burden)."},{"en":"Production loss = Downtime × Capacity × Contribution Margin."},{"en":"Energy waste = Idle Power × Hours × Rate."},{"en":"Maintenance burden rate assumed 30% of base wage."}] },
};
