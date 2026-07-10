// SectorCalc PRO V2 — True Employee Cost Presets

import type { ProPreset } from "../proToolRegistry";

export const EMPLOYEE_COST_PRESETS: ProPreset[] = [
  {
    label: "Manufacturing technician ($45k salary)",
    values: {
      labor_rate: "45000", overhead_rate: "350000",
    },
    units: {
      labor_rate: "USD", overhead_rate: "USD",
    },
  },
  {
    label: "Senior engineer ($95k salary)",
    values: {
      labor_rate: "95000", overhead_rate: "500000",
    },
    units: {
      labor_rate: "USD", overhead_rate: "USD",
    },
  },
];
