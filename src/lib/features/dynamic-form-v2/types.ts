export type ToolInputBenchmark = {
  label: string;
  value: number;
  unit?: string;
  type?: "ratio";
};

export type ToolInputField = {
  id: string;
  name: string;
  symbol: string;
  unit: string;
  allowed_values?: string[];
  default?: number | string | boolean;
  absolute_min?: number;
  absolute_max?: number;
  resolution?: number;
  confidence_label: string;
  note: string;
  reference?: string;
  /** Unit family key matching FAM in unit-conversion (e.g. "length", "mass", "currency"). Enables unit switching popover. */
  unit_family?: string;
  /** Industry benchmarks displayed in ref strip (e.g. [{label:"Air IATA",value:6000}]) */
  benchmarks?: ToolInputBenchmark[];
};

export type ToolFormula = {
  id: string;
  output: string;
  expression: string;
  uncertainty_expression?: string;
};

export type ToolOutput = {
  id: string;
  name?: string;
  unit: string;
  precision?: number | null;
  confidence_label?: string;
  enum_labels?: Record<string, string>;
};

export type ValidationRule = {
  id: string;
  condition: string;
  message: string;
};

export type SmartWarning = {
  id: string;
  trigger: string;
  severity: string;
  message: string;
};

export type InputGroup = {
  id: string;
  title: string;
  fields: string[];
};

export type ResolverConfig = {
  title: string;
  bars: Array<{ label: string; ref: string }>;
  binding: string;
  map?: Record<string, number>;
  unit: string;
  note: string;
};

export type BreakdownConfig = {
  title: string;
  total: string;
  parts: Array<{ ref: string; label: string }>;
};

export type InsightBlock = {
  title: string;
  conf: string;
  verdict?: boolean;
  tone?: string;
  when?: string;
  lines: string[];
  levers?: string[];
};

export type TornadoConfig = {
  primary: string;
  inputs: string[];
  variation_pct: number;
  top_n: number;
};

export type InterpretationRule = {
  id: string;
  condition: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  recommendation: string;
};

export type UIContract = {
  input_groups: InputGroup[];
  result_cards: string[];
  primary: string;
  currency_input: string;
  decision_output: string;
  decision_note: string;
  resolver?: ResolverConfig;
  breakdown?: BreakdownConfig;
  insights?: InsightBlock[];
  primary_uncertainty?: string;
  /** Tornado sensitivity analysis config */
  tornado?: TornadoConfig;
  /** Rule-based interpretation engine rules */
  interpretations?: InterpretationRule[];
};

export type ToolData = {
  tool_id: string;
  tool_name: string;
  category: string;
  risk_level: string;
  formula_version: string;
  traceability_id: string;
  standards: string[];
  inputs: ToolInputField[];
  formulas: ToolFormula[];
  outputs: ToolOutput[];
  engine_rules: {
    validation: { rules: ValidationRule[] };
    smart_warnings: SmartWarning[];
  };
  ui_contract: UIContract;
};
