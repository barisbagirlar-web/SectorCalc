// SectorCalc PRO V2 — Base Field Contract Types
// Defines the shared field contract structure used by all PRO V2 tools.

export type UnitFamily =
  | "length"
  | "small_length"
  | "area"
  | "volume"
  | "mass"
  | "time"
  | "speed"
  | "flow"
  | "pressure"
  | "temperature"
  | "force"
  | "torque"
  | "power"
  | "energy"
  | "energy_per_period"
  | "energy_price"
  | "currency"
  | "labor_rate"
  | "shop_rate"
  | "material_cost"
  | "cost_rate"
  | "cost_per_unit"
  | "percentage"
  | "factor"
  | "density"
  | "emissions"
  | "production_rate"
  | "finance_period"
  | "interest_rate"
  | "margin_rate";

export interface UnitOption {
  unit: string;
  label: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type FieldInputType = "number" | "select" | "text";

export interface ProFieldContract {
  id: string;
  label: string;
  symbol: string;
  type: FieldInputType;
  unitFamily?: UnitFamily;
  defaultUnit?: string;
  allowedUnits?: UnitOption[];
  options?: SelectOption[];
  required: boolean;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string;
  hidden?: boolean;
}

export interface ProFieldGroup {
  title: string;
  description?: string;
  fields: ProFieldContract[];
}

export interface ProToolFieldContract {
  toolKey: string;
  toolName: string;
  groups: ProFieldGroup[];
  units: Record<string, string>;
}
