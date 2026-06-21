/**
 * ARIZA SÜRESİ MALİYETİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOWNTIMECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "downtime-cost-analyzer",
  legacyPaidSlug: "downtime-cost-analyzer",
  name: "ARIZA SÜRESİ MALİYETİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ARIZA SÜRESİ MALİYETİ — premium analysis tool.",
  inputs: [
    { id: "ariza_suresi", label: "Arıza Süresi", type: "number", required: true },
    { id: "etkilenen_isci", label: "Etkilenen İşçi", type: "number", required: true },
    { id: "saatlik_ucret", label: "Saatlik Ücret", type: "number", required: true },
    { id: "hat_kapasitesi", label: "Hat Kapasitesi", type: "number", required: true },
    { id: "birim_marj", label: "Birim Marj", type: "number", required: true },
    { id: "bosta_guc", label: "Boşta Güç", type: "number", required: true },
    { id: "marka_hasar_carpani", label: "Marka Hasar Çarpanı", type: "number", required: true },
  ],
  outputs: [
    { id: "direct_labor_loss", label: "Direct Labor Loss", unit: "currency", format: "currency" },
    { id: "production_loss", label: "Production Loss", unit: "currency", format: "currency" },
    { id: "energy_waste", label: "Energy Waste", unit: "currency", format: "currency" },
    { id: "recovery_cost", label: "Recovery Cost", unit: "currency", format: "currency" },
    { id: "total_downtime_cost", label: "Total Downtime Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ariza_suresi_maliyeti_analyzer_0", inputMap: { DowntimeHours: "downtime_hours", AffectedWorkers: "affected_workers", AvgHourlyRate: "avg_hourly_rate", BurdenRate: "burden_rate" }, outputId: "direct_labor_loss" },
    { formulaId: "custom.ariza_suresi_maliyeti_analyzer_1", inputMap: { DowntimeHours: "downtime_hours", LineCapacity: "line_capacity", ContributionMargin: "contribution_margin" }, outputId: "production_loss" },
    { formulaId: "custom.ariza_suresi_maliyeti_analyzer_2", inputMap: { IdlePowerKW: "idle_power_k_w", DowntimeHours: "downtime_hours", ElectricityRate: "electricity_rate" }, outputId: "energy_waste" },
    { formulaId: "custom.ariza_suresi_maliyeti_analyzer_3", inputMap: { OvertimeHours: "overtime_hours", OvertimeRate: "overtime_rate", CrewSize: "crew_size" }, outputId: "recovery_cost" },
    { formulaId: "custom.ariza_suresi_maliyeti_analyzer_4", inputMap: { DirectLaborLoss: "direct_labor_loss", ProductionLoss: "production_loss", EnergyWaste: "energy_waste", RecoveryCost: "recovery_cost", QualityLoss: "quality_loss", Penalty: "penalty" }, outputId: "total_downtime_cost" },
  ],
  reportTemplate: {
    title: "ARIZA SÜRESİ MALİYETİ Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
