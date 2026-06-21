/**
 * Kaynak Hacmi ve Maliyeti — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WELDVOLUMECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "weld-volume-cost-analyzer",
  legacyPaidSlug: "weld-volume-cost-analyzer",
  name: "Kaynak Hacmi ve Maliyeti",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kaynak Hacmi ve Maliyeti — premium analysis tool.",
  inputs: [
    { id: "kaynak_boyu_leg", label: "Kaynak Boyu Leg", type: "number", required: true },
    { id: "uzunluk", label: "Uzunluk", type: "number", required: true },
    { id: "tel_capiekim_verimi", label: "Tel Çapı/Ekim Verimi", type: "number", required: true },
    { id: "gaz_debisi", label: "Gaz Debisi", type: "number", required: true },
    { id: "voltajakim", label: "Voltaj/Akım", type: "number", required: true },
    { id: "telgaz_kgm3_fiyati", label: "Tel/Gaz kg/m3 Fiyatı", type: "number", required: true },
    { id: "iscilik_saati", label: "İşçilik Saati", type: "number", required: true },
    { id: "elektrik", label: "Elektrik", type: "number", required: true },
  ],
  outputs: [
    { id: "area__weld", label: "Area_ Weld", unit: "currency", format: "currency" },
    { id: "volume__weld", label: "Volume_ Weld", unit: "currency", format: "currency" },
    { id: "weight__deposited", label: "Weight_ Deposited", unit: "currency", format: "currency" },
    { id: "weight__electrode", label: "Weight_ Electrode", unit: "currency", format: "currency" },
    { id: "cost__filler", label: "Cost_ Filler", unit: "currency", format: "currency" },
    { id: "cost__gas", label: "Cost_ Gas", unit: "currency", format: "currency" },
    { id: "cost__power", label: "Cost_ Power", unit: "currency", format: "currency" },
    { id: "total_weld_cost", label: "Total Weld Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_0", inputMap: { Leg: "kaynak_boyu_leg" }, outputId: "area__weld" },
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_1", inputMap: { Area_Weld: "area__weld", Length: "length" }, outputId: "volume__weld" },
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_2", inputMap: { Volume_Weld: "volume__weld", Density: "density" }, outputId: "weight__deposited" },
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_3", inputMap: { Weight_Deposited: "weight__deposited", DepositionEfficiency: "deposition_efficiency" }, outputId: "weight__electrode" },
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_4", inputMap: { Weight_Electrode: "weight__electrode", PricePerKg: "price_per_kg" }, outputId: "cost__filler" },
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_5", inputMap: { GasFlowRate: "gas_flow_rate", ArcTime: "arc_time", GasPrice: "gas_price" }, outputId: "cost__gas" },
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_6", inputMap: { Voltage: "voltage", Current: "current", ArcTime: "arc_time", MachineEff: "machine_eff", ElecRate: "elec_rate" }, outputId: "cost__power" },
    { formulaId: "custom.kaynak_hacmi_ve_maliyeti_analyzer_7", inputMap: { Cost_Filler: "cost__filler", Cost_Gas: "cost__gas", Cost_Power: "cost__power", ArcTime: "arc_time", DepositionRate: "deposition_rate", LaborRate: "labor_rate" }, outputId: "total_weld_cost" },
  ],
  reportTemplate: {
    title: "Kaynak Hacmi ve Maliyeti Report",
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
