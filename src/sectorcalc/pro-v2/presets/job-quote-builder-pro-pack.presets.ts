// SectorCalc PRO V2 — Job Quote Builder Presets

import type { ProPreset } from "../proToolRegistry";

export const QUOTE_BUILDER_PRESETS: ProPreset[] = [
  {
    label: "Standard production quote (500 units)",
    values: {
      machine_rate: "85", cycle_time: "12", setup_time: "8", batch_quantity: "500",
      material_cost: "25", labor_rate: "45", overhead_rate: "350000",
      annual_volume: "100000", target_margin: "30",
      defect_or_loss_cost: "12000", uncertainty_multiplier: "1.1",
    },
    units: {
      machine_rate: "USD", cycle_time: "min", setup_time: "min", batch_quantity: "units",
      material_cost: "USD", labor_rate: "USD/h", overhead_rate: "USD",
      annual_volume: "units", target_margin: "%",
      defect_or_loss_cost: "USD", uncertainty_multiplier: "factor 0-1",
    },
  },
  {
    label: "High-precision job quote (200 units)",
    values: {
      machine_rate: "150", cycle_time: "20", setup_time: "30", batch_quantity: "200",
      material_cost: "85", labor_rate: "75", overhead_rate: "500000",
      annual_volume: "50000", target_margin: "35",
      defect_or_loss_cost: "25000", uncertainty_multiplier: "1.15",
    },
    units: {
      machine_rate: "USD", cycle_time: "min", setup_time: "min", batch_quantity: "units",
      material_cost: "USD", labor_rate: "USD/h", overhead_rate: "USD",
      annual_volume: "units", target_margin: "%",
      defect_or_loss_cost: "USD", uncertainty_multiplier: "factor 0-1",
    },
  },
];
