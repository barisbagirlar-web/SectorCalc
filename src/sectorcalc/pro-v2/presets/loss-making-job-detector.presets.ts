// SectorCalc PRO V2 — Loss Making Job Detector Presets

import type { ProPreset } from "../proToolRegistry";

export const LOSS_DETECTOR_PRESETS: ProPreset[] = [
  {
    label: "Standard margin job (100 units)",
    values: {
      machine_rate: "85", material_cost: "300", labor_rate: "55",
      overhead_rate: "75", defect_or_loss_cost: "20",
      target_margin: "25", batch_quantity: "100", annual_volume: "5000",
    },
    units: {
      machine_rate: "USD/h", material_cost: "USD", labor_rate: "USD/h",
      overhead_rate: "USD", defect_or_loss_cost: "USD",
      target_margin: "%", batch_quantity: "units", annual_volume: "units",
    },
  },
  {
    label: "Loss-making job review (50 units)",
    values: {
      machine_rate: "120", material_cost: "450", labor_rate: "80",
      overhead_rate: "120", defect_or_loss_cost: "50",
      target_margin: "20", batch_quantity: "50", annual_volume: "2000",
    },
    units: {
      machine_rate: "USD/h", material_cost: "USD", labor_rate: "USD/h",
      overhead_rate: "USD", defect_or_loss_cost: "USD",
      target_margin: "%", batch_quantity: "units", annual_volume: "units",
    },
  },
];
