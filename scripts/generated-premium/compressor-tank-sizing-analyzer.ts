/**
 * Kompresör Tankı Boyutlandırma — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const COMPRESSORTANKSIZING_SCHEMA: PremiumCalculatorSchema = {
  id: "compressor-tank-sizing-analyzer",
  legacyPaidSlug: "compressor-tank-sizing-analyzer",
  name: "Kompresör Tankı Boyutlandırma",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kompresör Tankı Boyutlandırma — premium analysis tool.",
  inputs: [
    { id: "kompresor_debisi_q_m3min", label: "Kompresör Debisi Q m3/min", type: "number", required: true },
    { id: "maxmin_basinc_bar", label: "Max/Min Basınç bar", type: "number", required: true },
    { id: "hedef_dolum_suresi_sn", label: "Hedef Dolum Süresi sn", type: "number", required: true },
    { id: "izin_verilen_max_startsaat", label: "İzin Verilen Max Start/Saat", type: "number", required: true },
    { id: "tank_litre_fiyati", label: "Tank Litre Fiyatı", type: "number", required: true },
    { id: "mevcut_tank_hacmi", label: "Mevcut Tank Hacmi", type: "number", required: true },
  ],
  outputs: [
    { id: "v__tank", label: "V_ Tank", unit: "currency", format: "currency" },
    { id: "t", label: "t", unit: "currency", format: "currency" },
    { id: "q", label: "Q", unit: "currency", format: "currency" },
    { id: "p__max", label: "P_ Max", unit: "currency", format: "currency" },
    { id: "p__min", label: "P_ Min", unit: "currency", format: "currency" },
    { id: "cycle_time", label: "Cycle Time", unit: "currency", format: "currency" },
    { id: "cycles_per_hour", label: "Cycles Per Hour", unit: "currency", format: "currency" },
    { id: "motor_start_limit", label: "Motor Start Limit", unit: "currency", format: "currency" },
    { id: "cost__tank", label: "Cost_ Tank", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_0", inputMap: { P_atm: "p_atm", P_Max: "p__max", P_Min: "p__min" }, outputId: "v__tank" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_1", inputMap: { TimeToFill: "time_to_fill" }, outputId: "t" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_2", inputMap: { FreeAirDelivery: "free_air_delivery" }, outputId: "q" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_3", inputMap: { CutOutPressure: "cut_out_pressure" }, outputId: "p__max" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_4", inputMap: { CutInPressure: "cut_in_pressure" }, outputId: "p__min" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_5", inputMap: { V_Tank: "v__tank", P_Max: "p__max", P_Min: "p__min", P_atm: "p_atm" }, outputId: "cycle_time" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_6", inputMap: { CycleTime: "cycle_time" }, outputId: "cycles_per_hour" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_7", inputMap: { CyclesPerHour: "cycles_per_hour", MaxStarts: "izin_verilen_max_startsaat", FAIL: "f_a_i_l", PASS: "p_a_s_s" }, outputId: "motor_start_limit" },
    { formulaId: "custom.kompresor_tanki_boyutlandirma_analyzer_8", inputMap: { Volume: "volume", PricePerLiter: "price_per_liter" }, outputId: "cost__tank" },
  ],
  reportTemplate: {
    title: "Kompresör Tankı Boyutlandırma Report",
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
