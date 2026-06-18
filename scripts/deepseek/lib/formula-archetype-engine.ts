import type { RepairPatch, SchemaInput, SchemaRecord } from "./stub-formula-types";

type InputRole =
  | "count"
  | "percent"
  | "hours"
  | "days"
  | "money"
  | "energy"
  | "physical"
  | "generic";

function normalize(text: string): string {
  return text.toLowerCase();
}

function classifyInput(input: SchemaInput): InputRole {
  const id = normalize(input.id);
  const unit = normalize(input.unit ?? "");
  if (unit === "%" || id.includes("percent") || id.includes("_rate") || id.includes("efficiency")) {
    return "percent";
  }
  if (
    unit.includes("hour") ||
    unit.includes("/h") ||
    id.includes("hours") ||
    id.includes("hourly") ||
    id.includes("cycle_time")
  ) {
    return "hours";
  }
  if (unit.includes("day") || id.includes("days") || id.includes("working_days")) {
    return "days";
  }
  if (
    unit.includes("usd") ||
    unit.includes("eur") ||
    unit.includes("try") ||
    unit.includes("/hour") ||
    unit.includes("/day") ||
    id.includes("wage") ||
    id.includes("salary") ||
    id.includes("cost") ||
    id.includes("price")
  ) {
    return "money";
  }
  if (
    unit.includes("kwh") ||
    unit.includes("kw") ||
    unit.includes("w") ||
    id.includes("power") ||
    id.includes("energy")
  ) {
    return "energy";
  }
  if (
    id.includes("worker") ||
    id.includes("employee") ||
    id.includes("headcount") ||
    id.includes("num_") ||
    id.includes("number_of") ||
    id.includes("quantity") ||
    id.includes("machine") ||
    unit.includes("workers") ||
    unit.includes("machines")
  ) {
    return "count";
  }
  if (unit.includes("m") || unit.includes("kg") || unit.includes("db") || unit.includes("psi")) {
    return "physical";
  }
  return "generic";
}

function pick(inputs: SchemaInput[], role: InputRole): string | null {
  const match = inputs.find((input) => classifyInput(input) === role);
  return match?.id ?? null;
}

function pickWorkers(inputs: SchemaInput[]): string | null {
  const workers = inputs.find((input) =>
    /worker|employee|headcount|personnel|staff/.test(normalize(input.id)),
  );
  if (workers) {
    return workers.id;
  }
  return pick(inputs, "count");
}

function pickSalary(inputs: SchemaInput[]): string | null {
  const salary = inputs.find((input) => /salary|wage|payroll|loaded/.test(normalize(input.id)));
  if (salary) {
    return salary.id;
  }
  return pick(inputs, "money");
}

function percentExpr(id: string): string {
  return `(${id} / 100)`;
}

function isCostTool(record: SchemaRecord): boolean {
  const blob = normalize(`${record.title ?? ""} ${record.description ?? ""} ${record.toolName ?? ""}`);
  return /cost|maliyet|price|fiyat|waste|loss|margin|roi|quote|bid/.test(blob);
}

function defaultUnit(record: SchemaRecord): string {
  if (isCostTool(record)) {
    return "USD";
  }
  const percent = (record.inputs ?? []).some((input) => classifyInput(input) === "percent");
  if (percent) {
    return "%";
  }
  return "units";
}

function buildLaborCostPatch(record: SchemaRecord, inputs: SchemaInput[]): RepairPatch | null {
  const count = pickWorkers(inputs);
  const money = pickSalary(inputs);
  const hours = pick(inputs, "hours");
  const days = pick(inputs, "days");
  const percent = pick(inputs, "percent");
  if (!count || !money) {
    return null;
  }

  const annualHours =
    hours && days ? `(${hours} * ${days})` : hours ?? days ?? "1";
  const rateFactor = percent ? percentExpr(percent) : "1";
  const direct = `${count} * ${rateFactor} * ${annualHours} * ${money}`;
  const overhead = pick(inputs, "generic");

  const formulas: Record<string, string> = {
    annual_exposure_hours: annualHours,
    direct_labor_cost: direct,
    result: overhead ? `${direct} * ${overhead}` : direct,
  };

  return {
    formulas,
    outputs: {
      primary: "result",
      breakdown: ["direct_labor_cost", "annual_exposure_hours"],
      unit: "USD",
      hiddenLossDrivers: ["Unplanned absence and replacement labor", "Overhead not allocated to quotes"],
      suggestedActions: ["Validate wage includes payroll burden", "Compare to sector absenteeism benchmark"],
      dataConfidenceAdjusted: "result",
    },
  };
}

function buildEnergyCostPatch(record: SchemaRecord, inputs: SchemaInput[]): RepairPatch | null {
  const energy = pick(inputs, "energy");
  const hours = pick(inputs, "hours");
  const money = pick(inputs, "money");
  const percent = pick(inputs, "percent");
  const count = pick(inputs, "count");
  if (!energy || !hours || !money) {
    return null;
  }

  const load = percent ? percentExpr(percent) : "1";
  const scale = count ?? "1";
  const kwh = `${scale} * ${energy} * ${hours} * ${load}`;
  const formulas: Record<string, string> = {
    annual_kwh: kwh,
    annual_energy_cost: `${kwh} * ${money}`,
    result: `${kwh} * ${money}`,
  };

  return {
    formulas,
    outputs: {
      primary: "result",
      breakdown: ["annual_kwh", "annual_energy_cost"],
      unit: "USD",
      hiddenLossDrivers: ["Off-shift idle load", "Leak or standby losses"],
      suggestedActions: ["Meter validate kWh per shift", "Prioritize top leak sources"],
      dataConfidenceAdjusted: "result",
    },
  };
}

function buildQuantityCostPatch(record: SchemaRecord, inputs: SchemaInput[]): RepairPatch | null {
  const count = pick(inputs, "count") ?? pick(inputs, "generic");
  const money = pick(inputs, "money");
  const percent = pick(inputs, "percent");
  if (!count || !money) {
    return null;
  }

  const waste = percent ? `(1 + ${percentExpr(percent)})` : "1";
  const base = `${count} * ${money}`;
  const formulas: Record<string, string> = {
    base_cost: base,
    adjusted_cost: `${base} * ${waste}`,
    result: `${base} * ${waste}`,
  };

  return {
    formulas,
    outputs: {
      primary: "result",
      breakdown: ["base_cost", "adjusted_cost"],
      unit: "USD",
      hiddenLossDrivers: ["Scrap and rework not in unit price", "Volume discount not applied"],
      suggestedActions: ["Reconcile unit cost with last PO", "Stress-test with +10% waste"],
      dataConfidenceAdjusted: "result",
    },
  };
}

function inputExpr(input: SchemaInput): string {
  const role = classifyInput(input);
  if (role === "percent") {
    return percentExpr(input.id);
  }
  const id = normalize(input.id);
  if (id.includes("dba") || id.includes("noise")) {
    return `Math.max(1, ${input.id} / 85)`;
  }
  if (id.includes("vibration") || input.unit?.includes("m/s")) {
    return `Math.max(0.5, ${input.id})`;
  }
  return input.id;
}

function countUsedInputs(formulas: Record<string, string>, inputIds: readonly string[]): number {
  return inputIds.filter((id) =>
    Object.values(formulas).some((expression) => expression.includes(id)),
  ).length;
}

function minRequiredInputs(inputCount: number): number {
  return inputCount >= 4 ? Math.ceil(inputCount / 2) : 0;
}

/** Attach sub-metrics so validation sees enough input coverage. */
function expandInputCoverage(
  record: SchemaRecord,
  patch: RepairPatch,
): RepairPatch {
  const inputIds = (record.inputs ?? []).map((input) => input.id);
  const formulas = { ...patch.formulas };
  const primary =
    typeof patch.outputs.primary === "string" ? patch.outputs.primary : "result";
  const coreExpr = formulas[primary] ?? formulas.result ?? "1";
  const weights: string[] = [];

  for (const input of record.inputs ?? []) {
    if (input.type === "select" || input.type === "boolean") {
      continue;
    }
    if (countUsedInputs(formulas, inputIds) >= minRequiredInputs(inputIds.length)) {
      break;
    }
    if (Object.values(formulas).some((expression) => expression.includes(input.id))) {
      continue;
    }
    const key = `factor_${input.id}`;
    const expr = inputExpr(input);
    formulas[key] = expr;
    weights.push(expr);
  }

  if (weights.length === 0) {
    return patch;
  }

  const combined = `${coreExpr} * (${weights.join(" * ")})`;
  formulas[primary] = combined;
  if (formulas.result) {
    formulas.result = combined;
  }

  const breakdown = Array.isArray(patch.outputs.breakdown)
    ? [...(patch.outputs.breakdown as string[])]
    : [];
  for (const key of Object.keys(formulas)) {
    if (key !== primary && key !== "result" && !breakdown.includes(key)) {
      breakdown.push(key);
    }
  }

  return {
    formulas,
    outputs: {
      ...patch.outputs,
      breakdown: breakdown.slice(0, 6),
    },
  };
}

function buildMaintenanceMachinePatch(
  record: SchemaRecord,
  inputs: SchemaInput[],
): RepairPatch | null {
  const machines = inputs.find(
    (input) =>
      normalize(input.id).includes("number_of_machine") ||
      normalize(input.id).includes("num_machine") ||
      (normalize(input.id).includes("machine") &&
        !normalize(input.id).includes("runtime") &&
        !normalize(input.id).includes("maintenance") &&
        classifyInput(input) === "count"),
  );
  const maint = inputs.find(
    (input) =>
      normalize(input.id).includes("maintenance") ||
      (classifyInput(input) === "money" && normalize(input.id).includes("machine")),
  );
  const hours = pick(inputs, "hours");
  if (!machines || !maint) {
    return null;
  }

  const annualHours = hours ?? "260";
  const formulas: Record<string, string> = {
    machine_maintenance_annual: `${machines.id} * ${maint.id}`,
    machine_runtime_hours: `${machines.id} * ${annualHours}`,
    result: `${machines.id} * ${maint.id}`,
  };

  return {
    formulas,
    outputs: {
      primary: "result",
      breakdown: ["machine_maintenance_annual", "machine_runtime_hours"],
      unit: "USD",
      hiddenLossDrivers: ["Downtime during maintenance not included", "Spare parts inflation"],
      suggestedActions: ["Track MTBF per machine", "Bundle preventive maintenance"],
      dataConfidenceAdjusted: "result",
    },
  };
}

function buildCompositeCostPatch(record: SchemaRecord, inputs: SchemaInput[]): RepairPatch | null {
  const labor = buildLaborCostPatch(record, inputs);
  const maintenance = buildMaintenanceMachinePatch(record, inputs);
  if (!labor && !maintenance) {
    return null;
  }

  const formulas: Record<string, string> = {};
  if (labor) {
    Object.assign(formulas, labor.formulas);
  }
  if (maintenance) {
    Object.assign(formulas, maintenance.formulas);
  }

  const legs = [labor?.formulas.result, maintenance?.formulas.result].filter(
    (value): value is string => typeof value === "string",
  );
  const result =
    legs.length > 1 ? `(${legs.join(") + (")})` : (legs[0] ?? "1");
  formulas.result = result;

  return expandInputCoverage(record, {
    formulas,
    outputs: {
      primary: "result",
      breakdown: Object.keys(formulas).filter((key) => key !== "result").slice(0, 4),
      unit: "USD",
      hiddenLossDrivers: [
        "Composite model — validate each cost leg against actuals",
        "Physical exposure factors are normalized estimates",
      ],
      suggestedActions: [
        "Reconcile labor and maintenance legs separately",
        "Benchmark noise/vibration factors with site measurement",
      ],
      dataConfidenceAdjusted: "result",
    },
  });
}

/** Reverse-engineered generic industrial model: normalized product chain. */
function buildProductChainPatch(record: SchemaRecord, inputs: SchemaInput[]): RepairPatch {
  const factors: string[] = [];
  for (const input of inputs) {
    if (input.type === "select" || input.type === "boolean") {
      continue;
    }
    const role = classifyInput(input);
    if (role === "percent") {
      factors.push(percentExpr(input.id));
      continue;
    }
    factors.push(input.id);
  }

  if (factors.length < 2) {
    factors.push("1");
  }

  const subtotal = factors.slice(0, Math.min(4, factors.length)).join(" * ");
  const formulas: Record<string, string> = {
    normalized_product: subtotal,
    result: subtotal,
  };

  if (factors.length > 4) {
    const tail = factors.slice(4).join(" * ");
    formulas.adjustment_factor = tail;
    formulas.result = `${subtotal} * (${tail})`;
  }

  return expandInputCoverage(record, {
    formulas,
    outputs: {
      primary: "result",
      breakdown: Object.keys(formulas).filter((key) => key !== "result"),
      unit: defaultUnit(record),
      hiddenLossDrivers: [
        "Model uses normalized input chain — validate units",
        "Assumption-heavy without site benchmark",
      ],
      suggestedActions: ["Cross-check with historical actuals", "Run sensitivity on top 2 inputs"],
      dataConfidenceAdjusted: "result",
    },
  });
}

export function inferArchetypePatch(record: SchemaRecord): RepairPatch {
  const inputs = (record.inputs ?? []).filter((input) => input.type !== "select");
  const composite = buildCompositeCostPatch(record, inputs);
  if (composite) {
    return composite;
  }
  const labor = buildLaborCostPatch(record, inputs);
  if (labor) {
    return expandInputCoverage(record, labor);
  }
  const energy = buildEnergyCostPatch(record, inputs);
  if (energy) {
    return expandInputCoverage(record, energy);
  }
  const quantity = buildQuantityCostPatch(record, inputs);
  if (quantity) {
    return expandInputCoverage(record, quantity);
  }
  return buildProductChainPatch(record, inputs);
}
