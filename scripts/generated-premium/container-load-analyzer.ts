/**
 * Konteyner Yükü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CONTAINERLOAD_SCHEMA: PremiumCalculatorSchema = {
  id: "container-load-analyzer",
  legacyPaidSlug: "container-load-analyzer",
  name: "Konteyner Yükü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Konteyner Yükü — premium analysis tool.",
  inputs: [
    { id: "konteyner_tipi", label: "Konteyner Tipi", type: "text", required: true },
    { id: "ic_hacimpayload", label: "İç Hacim/Payload", type: "number", required: true },
    { id: "paletkoli_olculeri", label: "Palet/Koli Ölçüleri", type: "array", required: true },
    { id: "brut_agirlik", label: "Brüt Ağırlık", type: "array", required: true },
    { id: "konteyner_tasima_bedeli", label: "Konteyner Taşıma Bedeli", type: "number", required: true },
    { id: "istifleme_kisiti", label: "İstifleme Kısıtı", type: "text", required: true },
  ],
  outputs: [
    { id: "volume__utilization", label: "Volume_ Utilization", unit: "currency", format: "currency" },
    { id: "weight__utilization", label: "Weight_ Utilization", unit: "currency", format: "currency" },
    { id: "chargeable_weight", label: "Chargeable Weight", unit: "currency", format: "currency" },
    { id: "load_efficiency", label: "Load Efficiency", unit: "currency", format: "currency" },
    { id: "wasted_space_cost", label: "Wasted Space Cost", unit: "currency", format: "currency" },
    { id: "pallet_stacking", label: "Pallet Stacking", unit: "currency", format: "currency" },
    { id: "max_pallets", label: "Max Pallets", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.konteyner_yuku_analyzer_0", inputMap: { ItemVolume_i: "item_volume_i", ContainerMaxVolume: "container_max_volume" }, outputId: "volume__utilization" },
    { formulaId: "custom.konteyner_yuku_analyzer_1", inputMap: { ItemWeight_i: "item_weight_i", ContainerMaxPayload: "container_max_payload" }, outputId: "weight__utilization" },
    { formulaId: "custom.konteyner_yuku_analyzer_2", inputMap: { GrossWeight: "gross_weight", VolumetricWeight: "volumetric_weight" }, outputId: "chargeable_weight" },
    { formulaId: "custom.konteyner_yuku_analyzer_3", inputMap: { Volume_Utilization: "volume__utilization", Weight_Utilization: "weight__utilization" }, outputId: "load_efficiency" },
    { formulaId: "custom.konteyner_yuku_analyzer_4", inputMap: { LoadEfficiency: "load_efficiency", FreightCost: "freight_cost" }, outputId: "wasted_space_cost" },
    { formulaId: "custom.konteyner_yuku_analyzer_5", inputMap: { Floor: "floor", ContainerHeight: "container_height", PalletHeight: "pallet_height" }, outputId: "pallet_stacking" },
    { formulaId: "custom.konteyner_yuku_analyzer_6", inputMap: { PalletStacking: "pallet_stacking", FloorArea_Pallets: "floor_area__pallets", WeightLimit: "weight_limit", PalletWeight: "pallet_weight" }, outputId: "max_pallets" },
  ],
  reportTemplate: {
    title: "Konteyner Yükü Report",
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
