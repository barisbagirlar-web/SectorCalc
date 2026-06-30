/**
 * RC Beam Shear & Flexure Calculation Engine
 * EN 1992-1-1 and ACI 318 dual-branch calculator
 * 
 * Input: flat record matching PRO_117 input schema
 * Output: CalculationResult with UC, M_Rd, V_Rd, status, warnings
 */

export interface RCBeamInput {
  designStandard?: string;
  b_w?: number;
  h?: number;
  d?: number;
  A_s?: number;
  A_sv?: number;
  s_v?: number;
  M_Ed?: number;
  V_Ed?: number;
  // EC2 branch
  f_ck?: number;
  f_yk?: number;
  gamma_c?: number;
  gamma_s?: number;
  alpha_cc?: number;
  cot_theta?: number;
  N_Ed?: number;
  // ACI branch
  f_c_prime?: number;
  f_y?: number;
  E_s?: number;
  lambda_concrete?: number;
  phi_v?: number;
}

export interface RCBeamResult {
  M_Rd?: number;
  V_Rd?: number;
  UC_flexure?: number;
  UC_shear?: number;
  UC?: number;
  governingMode?: string;
  status: string;
  rho_l?: number;
  x?: number;
  z?: number;
  f_cd?: number;
  f_yd?: number;
  V_Rdc?: number;
  V_Rds?: number;
  V_Rdmax?: number;
  a?: number;
  c?: number;
  epsilon_t?: number;
  phi_f?: number;
  V_c?: number;
  V_s?: number;
  warnings: Array<{ severity: string; source: string; message: string }>;
  [key: string]: any;
}

function validate(input: RCBeamInput): string[] {
  const errors: string[] = [];
  const std = input.designStandard || "EN_1992_1_1";

  if (!input.b_w || input.b_w <= 0) errors.push("b_w <= 0 — Beam width must be positive.");
  if (!input.h || input.h <= 0) errors.push("h <= 0 — Beam height must be positive.");
  if (!input.d || input.d <= 0) errors.push("d <= 0 — Effective depth must be positive.");
  if (input.d && input.h && input.d >= input.h) errors.push("d >= h — Effective depth exceeds total height.");
  if (!input.A_s || input.A_s <= 0) errors.push("A_s <= 0 — Tension reinforcement area must be positive.");
  if (input.M_Ed === undefined || input.M_Ed < 0) errors.push("M_Ed < 0 — Design moment must be ≥ 0.");
  if (input.V_Ed === undefined || input.V_Ed < 0) errors.push("V_Ed < 0 — Design shear must be ≥ 0.");
  if (input.A_sv && input.A_sv > 0 && (!input.s_v || input.s_v <= 0)) errors.push("A_sv > 0 but s_v missing — Stirrup spacing required when shear reinforcement provided.");

  if (std === "EN_1992_1_1") {
    if (!input.f_ck || input.f_ck <= 0) errors.push("f_ck required for EN 1992-1-1.");
    if (!input.f_yk || input.f_yk <= 0) errors.push("f_yk required for EN 1992-1-1.");
  }
  if (std === "ACI_318") {
    if (!input.f_c_prime || input.f_c_prime <= 0) errors.push("f'_c required for ACI 318.");
    if (!input.f_y || input.f_y <= 0) errors.push("f_y required for ACI 318.");
  }

  return errors;
}

export function calculateRCBeamShearFlexure(rawInput: Record<string, any>): RCBeamResult {
  const input: RCBeamInput = {
    designStandard: rawInput.designStandard || "EN_1992_1_1",
    b_w: Number(rawInput.b_w) || 0,
    h: Number(rawInput.h) || 0,
    d: Number(rawInput.d) || 0,
    A_s: Number(rawInput.A_s) || 0,
    A_sv: Number(rawInput.A_sv) || 0,
    s_v: Number(rawInput.s_v) || 0,
    M_Ed: Number(rawInput.M_Ed) || 0,
    V_Ed: Number(rawInput.V_Ed) || 0,
    // EC2
    f_ck: Number(rawInput.f_ck) || 0,
    f_yk: Number(rawInput.f_yk) || 500,
    gamma_c: Number(rawInput.gamma_c) || 1.5,
    gamma_s: Number(rawInput.gamma_s) || 1.15,
    alpha_cc: Number(rawInput.alpha_cc) || 0.85,
    cot_theta: Number(rawInput.cot_theta) || 2.5,
    N_Ed: Number(rawInput.N_Ed) || 0,
    // ACI
    f_c_prime: Number(rawInput.f_c_prime) || 0,
    f_y: Number(rawInput.f_y) || 420,
    E_s: Number(rawInput.E_s) || 200000,
    lambda_concrete: Number(rawInput.lambda_concrete) || 1.0,
    phi_v: Number(rawInput.phi_v) || 0.75,
  };

  const errors = validate(input);
  if (errors.length > 0) {
    throw new Error("Validation failed:\n" + errors.join("\n"));
  }

  const warnings: Array<{ severity: string; source: string; message: string }> = [];
  const result: RCBeamResult = { status: "PASS", warnings };
  const std = input.designStandard!;

  if (std === "EN_1992_1_1") {
    const gamma_c = input.gamma_c!;
    const gamma_s = input.gamma_s!;

    const f_cd = input.alpha_cc! * input.f_ck! / gamma_c;
    const f_yd = input.f_yk! / gamma_s;
    const rho_l = input.A_s! / (input.b_w! * input.d!);

    const lambda_val = input.f_ck! <= 50 ? 0.8 : 0.8 - (input.f_ck! - 50) / 400;
    const eta = input.f_ck! <= 50 ? 1.0 : 1.0 - (input.f_ck! - 50) / 200;

    const x = input.A_s! * f_yd / (eta * f_cd * input.b_w! * lambda_val);
    const z = Math.min(input.d! - 0.5 * lambda_val * x, 0.95 * input.d!);

    const M_Rd = input.A_s! * f_yd * z / 1e6;

    const k = Math.min(1 + Math.sqrt(200 / input.d!), 2.0);
    const rho_l_limited = Math.min(rho_l, 0.02);
    const sigma_cp = input.N_Ed! / (input.b_w! * input.d!) * 1000;
    const V_Rdc_raw = (0.18 / gamma_c) * k * Math.pow(100 * rho_l_limited * input.f_ck!, 1/3);
    const v_min = 0.035 * Math.pow(k, 1.5) * Math.pow(input.f_ck!, 0.5);
    const V_Rdc = Math.max(V_Rdc_raw + 0.15 * sigma_cp, v_min + 0.15 * sigma_cp) * input.b_w! * input.d! / 1000;

    let V_Rds = Infinity;
    let V_Rdmax = Infinity;
    let V_Rd = Infinity;

    if (input.A_sv! > 0 && input.s_v! > 0) {
      V_Rds = input.A_sv! / input.s_v! * z * f_yd * input.cot_theta! / 1000;
      const v1 = input.f_ck! <= 50 ? 0.6 : 0.6 * (1 - (input.f_ck! - 50) / 200);
      const cotTheta = input.cot_theta!;
      const tanTheta = 1 / cotTheta;
      V_Rdmax = input.b_w! * z * v1 * f_cd / (cotTheta + tanTheta) / 1000;
      V_Rd = Math.min(V_Rds, V_Rdmax);

      if (V_Rds > V_Rdmax) {
        warnings.push({ severity: "WARNING", source: "EN 1992-1-1 §6.2.3", message: "V_Rds > V_Rdmax: Shear stirrups yield before strut reaches capacity. Reduce stirrup spacing or increase section." });
      }
    } else {
      V_Rd = V_Rdc;
      warnings.push({ severity: "INFO", source: "EN 1992-1-1 §6.2.2", message: "No shear reinforcement provided. V_Rd = V_Rdc (concrete contribution only). Stirrups required per EN 1992-1-1 §9.2.2." });
    }

    const UC_flexure = input.M_Ed! / M_Rd;
    const UC_shear = input.V_Ed! / V_Rd;
    const UC = Math.max(UC_flexure, UC_shear);

    const x_over_d = x / input.d!;
    if (x_over_d > 0.45) {
      warnings.push({ severity: "WARNING", source: "EN 1992-1-1 §5.5(4)", message: `x/d = ${x_over_d.toFixed(3)} > 0.45: Neutral axis depth exceeds ductility limit. Compression reinforcement may be required.` });
    }

    result.M_Rd = M_Rd;
    result.V_Rd = V_Rd;
    result.UC_flexure = UC_flexure;
    result.UC_shear = UC_shear;
    result.UC = UC;
    result.f_cd = f_cd;
    result.f_yd = f_yd;
    result.rho_l = rho_l;
    result.x = x;
    result.z = z;
    result.V_Rdc = V_Rdc;
    result.V_Rds = V_Rds;
    result.V_Rdmax = V_Rdmax;
    result.governingMode = UC_flexure >= UC_shear ? "Flexure" : "Shear";
    result.designStandard = "EN 1992-1-1";

  } else {
    // ACI 318 branch
    const beta1 = input.f_c_prime! <= 28 ? 0.85 : Math.max(0.85 - 0.05 * (input.f_c_prime! - 28) / 7, 0.65);
    const a = input.A_s! * input.f_y! / (0.85 * input.f_c_prime! * input.b_w!);
    const c = a / beta1;
    const epsilon_t = 0.003 * (input.d! - c) / c;

    let phi_f: number;
    if (epsilon_t >= 0.005) {
      phi_f = 0.9;
    } else if (epsilon_t >= 0.002) {
      phi_f = 0.65 + 0.25 * (epsilon_t - 0.002) / 0.003;
    } else {
      phi_f = 0.65;
    }

    const M_n = input.A_s! * input.f_y! * (input.d! - a / 2);
    const M_Rd = phi_f * M_n / 1e6;
    const rho_l = input.A_s! / (input.b_w! * input.d!);

    let V_c = 0;
    let V_s = 0;
    let V_Rd = 0;

    V_c = 0.17 * input.lambda_concrete! * Math.sqrt(input.f_c_prime!) * input.b_w! * input.d! / 1000;

    if (input.A_sv! > 0 && input.s_v! > 0) {
      V_s = input.A_sv! * input.f_y! * input.d! / input.s_v! / 1000;
      V_Rd = input.phi_v! * (V_c + V_s);

      const V_s_max = 0.66 * Math.sqrt(input.f_c_prime!) * input.b_w! * input.d! / 1000;
      if (V_s > V_s_max) {
        warnings.push({ severity: "WARNING", source: "ACI 318 §22.5.1.2", message: `V_s exceeds V_s,max = ${V_s_max.toFixed(1)} kN. Stirrup spacing too large or section inadequate.` });
      }
    } else {
      V_Rd = input.phi_v! * V_c;
      warnings.push({ severity: "INFO", source: "ACI 318 §9.6.3", message: "No shear reinforcement. Minimum Av required per ACI 318 §9.6.3." });
    }

    if (epsilon_t < 0.005) {
      warnings.push({ severity: "WARNING", source: "ACI 318 §21.2.2", message: `ε_t = ${epsilon_t.toFixed(4)} < 0.005: Section is compression-controlled (brittle failure risk). Tension-controlled limit requires φ_f = 0.9.` });
    }

    const UC_flexure = input.M_Ed! / M_Rd;
    const UC_shear = input.V_Ed! / V_Rd;
    const UC = Math.max(UC_flexure, UC_shear);

    result.M_Rd = M_Rd;
    result.V_Rd = V_Rd;
    result.UC_flexure = UC_flexure;
    result.UC_shear = UC_shear;
    result.UC = UC;
    result.a = a;
    result.c = c;
    result.epsilon_t = epsilon_t;
    result.phi_f = phi_f;
    result.V_c = V_c;
    result.V_s = V_s;
    result.rho_l = rho_l;
    result.governingMode = UC_flexure >= UC_shear ? "Flexure" : "Shear";
    result.designStandard = "ACI 318";
  }

  // Post-processing: status from UC
  if (result.UC! > 1.0) {
    result.status = "FAIL";
    warnings.push({ severity: "CRITICAL", source: "SectorCalc", message: `UC = ${result.UC!.toFixed(3)} > 1.00: Section capacity is INSUFFICIENT. Governing mode: ${result.governingMode}. Increase section or reinforcement.` });
  } else if (result.UC! > 0.9) {
    result.status = "WARN";
    warnings.push({ severity: "WARNING", source: "SectorCalc", message: `UC = ${result.UC!.toFixed(3)}: Section utilization is critically high (UC > 0.90). Engineering review required before acceptance.` });
  } else {
    result.status = "PASS";
  }

  return result;
}
