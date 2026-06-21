/**
 * CLOUD FIRE ELIMINATION — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CLOUDWASTEELIMINATION_SCHEMA: PremiumCalculatorSchema = {
  id: "cloud-waste-elimination-analyzer",
  legacyPaidSlug: "cloud-waste-elimination-analyzer",
  name: "CLOUD FIRE ELIMINATION",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CLOUD FIRE ELIMINATION — premium analysis tool.",
  inputs: [
    { id: "bagimsiz_diskatil_snapshot", label: "Bağımsız Disk/Atıl Snapshot", type: "number", required: true },
    { id: "mevcutrightsized_maliyet", label: "Mevcut/Right-Sized Maliyet", type: "number", required: true },
    { id: "spot_orani", label: "Spot Oranı", type: "number", required: true },
    { id: "mesai_disi_sunucu", label: "Mesai Dışı Sunucu", type: "number", required: true },
  ],
  outputs: [
    { id: "zombie_cost", label: "Zombie Cost", unit: "currency", format: "currency" },
    { id: "oversizing_savings", label: "Oversizing Savings", unit: "currency", format: "currency" },
    { id: "spot_savings", label: "Spot Savings", unit: "currency", format: "currency" },
    { id: "reserved_savings", label: "Reserved Savings", unit: "currency", format: "currency" },
    { id: "idle_hours_cost", label: "Idle Hours Cost", unit: "currency", format: "currency" },
    { id: "total_waste", label: "Total Waste", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cloud_fire_elimination_analyzer_0", inputMap: { UnattachedVolumes: "unattached_volumes", Rate: "rate", IdleLBs: "idle_l_bs", OrphanSnapshots: "orphan_snapshots", StorageRate: "storage_rate" }, outputId: "zombie_cost" },
    { formulaId: "custom.cloud_fire_elimination_analyzer_1", inputMap: { CurrentCost: "current_cost", RightSizedCost: "right_sized_cost", Uptime: "uptime" }, outputId: "oversizing_savings" },
    { formulaId: "custom.cloud_fire_elimination_analyzer_2", inputMap: { OnDemand: "on_demand", Spot: "spot_orani", FaultTolerantHours: "fault_tolerant_hours" }, outputId: "spot_savings" },
    { formulaId: "custom.cloud_fire_elimination_analyzer_3", inputMap: { OnDemand: "on_demand", Reserved: "reserved", CommitUtil: "commit_util" }, outputId: "reserved_savings" },
    { formulaId: "custom.cloud_fire_elimination_analyzer_4", inputMap: { NonBizHours: "non_biz_hours", RunningInstances: "running_instances", HourlyRate: "hourly_rate" }, outputId: "idle_hours_cost" },
    { formulaId: "custom.cloud_fire_elimination_analyzer_5", inputMap: { Zombie: "zombie", Oversizing: "oversizing", Spot: "spot_orani", Reserved: "reserved", Idle: "idle" }, outputId: "total_waste" },
  ],
  reportTemplate: {
    title: "CLOUD FIRE ELIMINATION Report",
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
