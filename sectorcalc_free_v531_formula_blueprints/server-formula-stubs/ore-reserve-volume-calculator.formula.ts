import "server-only";

export const toolKey = "ore-reserve-volume-calculator";
export const formulaVersion = "1.0.0";
export const formulaProfile = "cost-buildup-and-margin";

export interface FormulaInputMap {
  [key: string]: number;
}

export interface FormulaOutputItem {
  id: string;
  value: number;
  unit: string;
}

function finite(value: number): number {
  if (!Number.isFinite(value)) throw new Error("Non-finite calculation result");
  return value;
}

function read(inputs: FormulaInputMap, key: string, fallback = 0): number {
  const value = inputs[key];
  if (value === undefined || value === null) return fallback;
  if (!Number.isFinite(value)) throw new Error(`Invalid numeric input: ${key}`);
  return value;
}

export function calculate(inputs: FormulaInputMap): FormulaOutputItem[] {
  // Server-only V5.3.1 formula stub generated for Cursor integration.
  // Replace profile dispatcher with the project's typed deterministic engine if one exists.
  const outputs: FormulaOutputItem[] = [];
  const profile = formulaProfile;

  if (profile === "finance-ratio-and-cash-flow") {
    const initialAmount = read(inputs, "initial_amount", 0);
    const finalAmount = read(inputs, "final_amount", 0);
    const periods = Math.max(read(inputs, "periods", 1), 1e-9);
    const cashFlow = read(inputs, "cash_flow", 0);
    const gain = finalAmount - initialAmount + cashFlow * periods;
    const ratio = initialAmount > 0 ? gain / initialAmount : 0;
    const annualized = initialAmount > 0 && finalAmount > 0 ? Math.pow(finalAmount / initialAmount, 1 / periods) - 1 : 0;
    outputs.push({ id: "primary_result", value: finite(ratio), unit: "decimal" });
    outputs.push({ id: "annualized_result", value: finite(annualized * 100), unit: "%" });
    return outputs;
  }

  if (profile === "structural-beam-serviceability-strength") {
    const span = Math.max(read(inputs, "span_length", 0), 1e-9);
    const uniformLoad = read(inputs, "distributed_load", 0);
    const pointLoad = read(inputs, "point_load", 0);
    const modulus = Math.max(read(inputs, "elastic_modulus", 0), 1e-9);
    const inertia = Math.max(read(inputs, "second_moment_area", 0), 1e-18);
    const sectionModulus = Math.max(read(inputs, "section_modulus", 0), 1e-18);
    const reaction = uniformLoad * span / 2 + pointLoad / 2;
    const moment = uniformLoad * span * span / 8 + pointLoad * span / 4;
    const deflection = 5 * uniformLoad * Math.pow(span, 4) / (384 * modulus * inertia) + pointLoad * Math.pow(span, 3) / (48 * modulus * inertia);
    outputs.push({ id: "maximum_reaction", value: finite(reaction), unit: "N" });
    outputs.push({ id: "maximum_bending_moment", value: finite(moment), unit: "N*m" });
    outputs.push({ id: "maximum_deflection", value: finite(deflection), unit: "m" });
    outputs.push({ id: "bending_stress", value: finite(moment / sectionModulus), unit: "Pa" });
    return outputs;
  }

  if (profile === "shaft-torsion-and-twist") {
    const torque = read(inputs, "torque", 0);
    const length = Math.max(read(inputs, "shaft_length", 0), 1e-9);
    const polarMoment = Math.max(read(inputs, "polar_moment", 0), 1e-18);
    const shearModulus = Math.max(read(inputs, "shear_modulus", 0), 1e-9);
    const radius = Math.max(read(inputs, "outer_radius", 0), 1e-12);
    outputs.push({ id: "angle_of_twist", value: finite(torque * length / (shearModulus * polarMoment)), unit: "rad" });
    outputs.push({ id: "maximum_shear_stress", value: finite(torque * radius / polarMoment), unit: "Pa" });
    return outputs;
  }

  if (profile === "mechanical-stress-capacity") {
    const force = read(inputs, "force", 0);
    const area = Math.max(read(inputs, "area", 0), 1e-18);
    const allowable = Math.max(read(inputs, "allowable_stress", 0), 1e-9);
    const safetyFactor = Math.max(read(inputs, "safety_factor", 1), 1e-9);
    const stress = force / area;
    const designAllowable = allowable / safetyFactor;
    outputs.push({ id: "normal_stress", value: finite(stress), unit: "Pa" });
    outputs.push({ id: "utilization_ratio", value: finite(stress / designAllowable), unit: "ratio" });
    return outputs;
  }

  if (profile === "fluid-pressure-flow-power") {
    const density = read(inputs, "fluid_density", 1000);
    const flowRate = read(inputs, "flow_rate", 0);
    const head = read(inputs, "head", 0);
    const efficiency = Math.max(read(inputs, "efficiency", 1), 1e-9);
    const pressure = read(inputs, "pressure", 0);
    const hydraulicPower = density * 9.80665 * flowRate * head;
    outputs.push({ id: "hydraulic_power", value: finite(hydraulicPower), unit: "W" });
    outputs.push({ id: "shaft_power", value: finite(hydraulicPower / efficiency), unit: "W" });
    outputs.push({ id: "pressure_head", value: finite(pressure / Math.max(density * 9.80665, 1e-9)), unit: "m" });
    return outputs;
  }

  if (profile === "electrical-frequency-impedance-resolution") {
    const frequency = Math.max(read(inputs, "frequency", 0), 1e-12);
    const capacitance = read(inputs, "capacitance", 0);
    const inductance = read(inputs, "inductance", 0);
    const resistance = read(inputs, "resistance", 0);
    const capacitive = capacitance > 0 ? 1 / (2 * Math.PI * frequency * capacitance) : 0;
    const inductive = inductance > 0 ? 2 * Math.PI * frequency * inductance : 0;
    const reactance = inductive || capacitive;
    outputs.push({ id: "reactance", value: finite(reactance), unit: "ohm" });
    outputs.push({ id: "impedance", value: finite(Math.hypot(resistance, reactance)), unit: "ohm" });
    outputs.push({ id: "time_constant", value: finite(resistance * Math.max(capacitance, 0)), unit: "s" });
    return outputs;
  }

  // Default cost and operations profile.
  const materialCost = read(inputs, "material_cost", 0);
  const laborCost = read(inputs, "labor_cost", 0);
  const overheadCost = read(inputs, "overhead_cost", 0);
  const wasteRate = Math.min(Math.max(read(inputs, "waste_rate", 0), 0), 0.999999);
  const sellingPrice = read(inputs, "selling_price", 0);
  const adjustedMaterialCost = materialCost / (1 - wasteRate);
  const totalCost = adjustedMaterialCost + laborCost + overheadCost;
  outputs.push({ id: "total_cost", value: finite(totalCost), unit: "USD" });
  outputs.push({ id: "gross_margin", value: finite(sellingPrice > 0 ? (sellingPrice - totalCost) / sellingPrice : 0), unit: "decimal" });
  outputs.push({ id: "margin_leakage", value: finite(adjustedMaterialCost - materialCost), unit: "USD" });
  return outputs;
}
