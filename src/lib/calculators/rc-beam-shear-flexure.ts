/**
 * RC Beam Shear & Flexure Capacity Check
 * Reference: EN 1992-1-1, ACI 318-19
 * 
 * Input: RCBeamInput
 * Output: RCBeamResult
 */

export interface RCBeamInput {
  designStandard: "EN_1992_1_1" | "ACI_318";

  // Common
  b_w: number;   // Beam width (mm)
  h: number;     // Beam height (mm)
  d: number;     // Effective depth (mm)
  A_s: number;   // Tension reinforcement area (mm²)
  A_sv?: number; // Shear reinforcement area (mm²)
  s_v?: number;  // Stirrup spacing (mm)
  M_Ed: number;  // Design bending moment (kN·m)
  V_Ed: number;  // Design shear force (kN)

  // EC2 specific
  f_ck?: number;    // Concrete cylinder strength (MPa)
  f_yk?: number;    // Steel yield strength (MPa)
  gamma_c?: number; // Concrete partial factor
  gamma_s?: number; // Steel partial factor
  alpha_cc?: number;// Long-term factor
  cot_theta?: number;// Strut inclination
  N_Ed?: number;    // Axial force (kN) – compression positive

  // ACI specific
  f_c_prime?: number;  // Concrete compressive strength (psi or MPa)
  f_y?: number;        // Steel yield strength (MPa)
  E_s?: number;        // Steel elastic modulus (MPa)
  lambda_concrete?: number; // Lightweight factor
  phi_v?: number;      // Shear reduction factor
}

export interface FMEARow {
  failureMode: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  likelihood: number;
  detection: number;
  RPN: number;
}

export interface AuditEntry {
  timestamp: string;
  tool_id: string;
  designStandard: string;
  inputHash: string;
  UC_flexure: number;
  UC_shear: number;
  UC: number;
  status: "PASS" | "WARN" | "FAIL";
  warningsCount: number;
}

export interface RCBeamResult {
  // Flexure
  M_Rd: number;          // Design flexural capacity (kN·m)
  UC_flexure: number;    // Flexural utilization

  // Shear
  V_Rd: number;          // Design shear capacity (kN)
  UC_shear: number;      // Shear utilization

  // Governing
  UC: number;            // Governing utilization
  governingMode: "FLEXURE" | "SHEAR";

  // Status
  status: "PASS" | "WARN" | "FAIL";

  // Detailed intermediates
  rho_l: number;         // Tension reinforcement ratio
  x?: number;            // Neutral axis depth (mm)
  z?: number;            // Lever arm (mm)

  // Warnings
  warnings: Array<{
    severity: "CRITICAL" | "WARNING" | "INFO";
    source: string;
    message: string;
  }>;

  // FMEA
  fmea: FMEARow[];

  // Audit
  audit: AuditEntry;
}

/**
 * Calculate RC Beam Shear & Flexure capacity following
 * EN 1992-1-1 or ACI 318 depending on designStandard.
 * Throws Error on invalid input (fail-closed).
 */
export function calculateRCBeamShearFlexure(input: RCBeamInput): RCBeamResult {
  const { designStandard, b_w, h, d, A_s, M_Ed, V_Ed } = input;

  // ─── BLOCKING VALIDATIONS ───────────────────────────────────────────
  if (b_w <= 0) throw new Error("b_w (beam width) must be > 0 mm.");
  if (h <= 0) throw new Error("h (beam height) must be > 0 mm.");
  if (d <= 0) throw new Error("d (effective depth) must be > 0 mm.");
  if (d >= h) throw new Error("d (effective depth) must be < h (beam height).");
  if (A_s <= 0) throw new Error("A_s (tension reinforcement) must be > 0 mm².");
  if (M_Ed < 0) throw new Error("M_Ed (design moment) cannot be negative.");
  if (V_Ed < 0) throw new Error("V_Ed (design shear) cannot be negative.");
  if (input.A_sv && !input.s_v) throw new Error("s_v (stirrup spacing) required when A_sv is provided.");

  if (designStandard === "EN_1992_1_1") {
    if (!input.f_ck) throw new Error("f_ck (concrete strength) required for EN 1992-1-1.");
  } else if (designStandard === "ACI_318") {
    if (!input.f_c_prime) throw new Error("f_c_prime (concrete strength) required for ACI 318.");
  }

  const warnings: RCBeamResult["warnings"] = [];
  let M_Rd: number;
  let V_Rd: number;
  let UC_flexure: number;
  let UC_shear: number;
  let x: number | undefined;
  let z: number | undefined;
  let fmea: FMEARow[];

  // Compute rho_l (tension reinforcement ratio)
  const rho_l = A_s / (b_w * d);

  if (designStandard === "EN_1992_1_1") {
    // ─── EC2 BRANCH ───────────────────────────────────────────────────
    const f_ck = input.f_ck!;
    const f_yk = input.f_yk ?? 500;
    const gamma_c = input.gamma_c ?? 1.5;
    const gamma_s = input.gamma_s ?? 1.15;
    const alpha_cc = input.alpha_cc ?? 0.85;
    const cot_theta = input.cot_theta ?? 2.5;
    const N_Ed = input.N_Ed ?? 0;

    const f_cd = alpha_cc * f_ck / gamma_c;
    const f_yd = f_yk / gamma_s;

    const lambda_ec2 = f_ck <= 50 ? 0.8 : 0.8 - (f_ck - 50) / 400;
    const eta_ec2 = f_ck <= 50 ? 1.0 : 1.0 - (f_ck - 50) / 200;

    // Neutral axis
    x = (A_s * f_yd) / (eta_ec2 * f_cd * b_w * lambda_ec2);
    const z_comp = Math.min(d - 0.5 * lambda_ec2 * x, 0.95 * d);
    z = z_comp;

    // Flexural capacity
    M_Rd = (A_s * f_yd * z) / 1e6; // kN·m

    // Shear
    const k = Math.min(1 + Math.sqrt(200 / d), 2.0);
    const rho_l_limited = Math.min(A_s / (b_w * d), 0.02);
    const sigma_cp = N_Ed / (b_w * d) * 1000; // kPa → N/mm² (MPa)
    const C_Rdc = 0.18 / gamma_c;
    const v_min = 0.035 * Math.pow(k, 1.5) * Math.sqrt(f_ck);

    const V_Rdc = Math.max(
      C_Rdc * k * Math.pow(100 * rho_l_limited * f_ck, 1 / 3) + 0.15 * sigma_cp,
      v_min + 0.15 * sigma_cp
    ) * b_w * d / 1000; // kN

    let V_Rds = 0;
    if (input.A_sv && input.s_v && input.s_v > 0) {
      const f_ywd = f_yd;
      const A_sw = input.A_sv;
      V_Rds = (A_sw / input.s_v) * z * f_ywd * cot_theta / 1000; // kN
    }

    const v1 = f_ck <= 50 ? 0.6 : 0.6 * (1 - (f_ck - 50) / 200);
    const V_Rdmax = (b_w * z * v1 * f_cd) / (cot_theta + 1 / cot_theta) / 1000; // kN

    V_Rd = Math.min(V_Rds > 0 ? V_Rds : Infinity, V_Rdmax);

    UC_flexure = M_Ed / M_Rd;
    UC_shear = V_Ed / V_Rd;

    // Warnings
    if (V_Rds > V_Rdmax) {
      warnings.push({
        severity: "WARNING",
        source: "EN 1992-1-1 §6.2.3",
        message: `V_Rds (${V_Rds.toFixed(1)} kN) exceeds V_Rdmax (${V_Rdmax.toFixed(1)} kN). Concrete strut crushing governs. Increase section or reduce stirrups.`,
      });
    }
    if (x / d > 0.45) {
      warnings.push({
        severity: "WARNING",
        source: "EN 1992-1-1 §5.5(4)",
        message: `x/d = ${(x / d).toFixed(3)} > 0.45. Neutral axis depth limit exceeded. Compression zone may be insufficient.`,
      });
    }

    // FMEA entries
    fmea = buildEC2FMEA(x / d, V_Rds, V_Rdmax, rho_l, M_Ed, M_Rd, V_Ed, V_Rd);

  } else {
    // ─── ACI BRANCH ───────────────────────────────────────────────────
    const f_c_prime = input.f_c_prime!;
    const f_y = input.f_y ?? 420;
    const E_s = input.E_s ?? 200000;
    const lambda_ac = input.lambda_concrete ?? 1.0;
    const phi_v = input.phi_v ?? 0.75;

    // Flexure
    const beta1 = f_c_prime <= 28 ? 0.85 : Math.max(0.85 - 0.05 * (f_c_prime - 28) / 7, 0.65);
    const a = (A_s * f_y) / (0.85 * f_c_prime * b_w);
    const c = a / beta1;

    const epsilon_t = 0.003 * (d - c) / c;
    let phi_f: number;
    if (epsilon_t >= 0.005) {
      phi_f = 0.9; // Tension-controlled
    } else if (epsilon_t >= 0.002) {
      phi_f = 0.65 + 0.25 * (epsilon_t - 0.002) / 0.003; // Transition
    } else {
      phi_f = 0.65; // Compression-controlled
    }

    const M_n = (A_s * f_y * (d - a / 2)) / 1e6; // kN·m
    M_Rd = phi_f * M_n;

    x = c;
    z = d - a / 2;

    // Shear
    const V_c = 0.17 * lambda_ac * Math.sqrt(f_c_prime) * b_w * d / 1000; // kN
    let V_s = 0;
    const A_v = input.A_sv ?? 0;
    if (A_v > 0 && input.s_v && input.s_v > 0) {
      V_s = (A_v * f_y * d) / input.s_v / 1000; // kN
    }

    const V_s_max = 0.66 * Math.sqrt(f_c_prime) * b_w * d / 1000; // kN
    V_Rd = phi_v * (V_c + V_s);

    UC_flexure = M_Ed / M_Rd;
    UC_shear = V_Ed / V_Rd;

    // Warnings
    if (V_s > V_s_max) {
      warnings.push({
        severity: "WARNING",
        source: "ACI 318 §11.5.7.2",
        message: `V_s (${V_s.toFixed(1)} kN) exceeds V_s_max (${V_s_max.toFixed(1)} kN). Stirrup spacing too large or section insufficient.`,
      });
    }
    if (epsilon_t < 0.005) {
      warnings.push({
        severity: "WARNING",
        source: "ACI 318 §9.3.3",
        message: `ε_t = ${epsilon_t.toFixed(5)} < 0.005. Section not tension-controlled. Ductility limited, φ_f = ${phi_f.toFixed(2)}.`,
      });
    }

    // FMEA entries
    fmea = buildACIFMEA(epsilon_t, phi_f, V_s, V_s_max, rho_l, M_Ed, M_Rd, V_Ed, V_Rd);
  }

  const governingMode = UC_flexure >= UC_shear ? "FLEXURE" : "SHEAR";
  const UC = Math.max(UC_flexure, UC_shear);

  // Status
  let status: "PASS" | "WARN" | "FAIL";
  if (UC > 1.0) {
    status = "FAIL";
    warnings.push({
      severity: "CRITICAL",
      source: "Capacity Check",
      message: `UC = ${UC.toFixed(3)} > 1.00. Section FAILS. Governing mode: ${governingMode}. Section must be redesigned.`,
    });
  } else if (UC > 0.90) {
    status = "WARN";
    warnings.push({
      severity: "WARNING",
      source: "Engineering Review",
      message: `UC = ${UC.toFixed(3)} between 0.90–1.00. Engineering review required before acceptance.`,
    });
  } else {
    status = "PASS";
  }

  // Stirrup spacing check
  if (input.A_sv && input.s_v && input.s_v > d / 2) {
    warnings.push({
      severity: "WARNING",
      source: designStandard === "EN_1992_1_1" ? "EN 1992-1-1 §9.2.2" : "ACI 318 §11.5.5",
      message: `Stirrup spacing s_v = ${input.s_v} mm exceeds maximum permitted (approx ${(d / 2).toFixed(0)} mm). Review detailing rules.`,
    });
  }

  // Audit entry
  const inputStr = `${designStandard}_${b_w}_${h}_${d}_${A_s}_${M_Ed}_${V_Ed}_${input.f_ck ?? ""}_${input.f_c_prime ?? ""}`;
  const inputHash = Array.from(inputStr).reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0).toString(16);

  const audit = {
    timestamp: new Date().toISOString(),
    tool_id: "PRO_117",
    designStandard,
    inputHash,
    UC_flexure,
    UC_shear,
    UC,
    status,
    warningsCount: warnings.length,
  };

  return {
    M_Rd,
    UC_flexure,
    V_Rd,
    UC_shear,
    UC,
    governingMode,
    status,
    rho_l,
    x,
    z,
    warnings,
    fmea,
    audit,
  };
}

// ─── FMEA BUILDERS ──────────────────────────────────────────────────────────

function buildEC2FMEA(
  xdRatio: number,
  V_Rds: number,
  V_Rdmax: number,
  rho_l: number,
  M_Ed: number,
  M_Rd: number,
  V_Ed: number,
  V_Rd: number,
): FMEARow[] {
  return [
    {
      failureMode: "Flexural yielding",
      description: "Tension steel yields before concrete crushes. Ductile failure mode if ρ_l ≤ ρ_bal.",
      severity: "MEDIUM",
      likelihood: rho_l > 0.02 ? 7 : 4,
      detection: 3,
      RPN: rho_l > 0.02 ? 147 : 48,
    },
    {
      failureMode: "Compression-controlled brittle failure",
      description: "Neutral axis too deep. Concrete crushes before steel yields. Low ductility.",
      severity: "HIGH",
      likelihood: xdRatio > 0.45 ? 8 : 3,
      detection: 4,
      RPN: xdRatio > 0.45 ? 256 : 36,
    },
    {
      failureMode: "Diagonal shear failure",
      description: "Diagonal tension crack propagates through web. Sudden failure without warning.",
      severity: "HIGH",
      likelihood: V_Ed > V_Rd * 0.9 ? 7 : 4,
      detection: 5,
      RPN: V_Ed > V_Rd * 0.9 ? 280 : 80,
    },
    {
      failureMode: "Concrete strut crushing",
      description: "Web crushing before stirrup yielding. Section too slender or stirrups too strong.",
      severity: "HIGH",
      likelihood: V_Rds > V_Rdmax ? 8 : 3,
      detection: 2,
      RPN: V_Rds > V_Rdmax ? 128 : 18,
    },
    {
      failureMode: "Stirrup yielding",
      description: "Stirrups yield before concrete strut crushes. Ductile but large shear deformations.",
      severity: "MEDIUM",
      likelihood: V_Rds <= V_Rdmax && V_Ed > V_Rd * 0.9 ? 6 : 3,
      detection: 4,
      RPN: 72,
    },
    {
      failureMode: "Anchorage failure",
      description: "Insufficient development length. Bar pull-out at support.",
      severity: "HIGH",
      likelihood: M_Ed > M_Rd * 0.8 ? 5 : 3,
      detection: 6,
      RPN: M_Ed > M_Rd * 0.8 ? 180 : 90,
    },
    {
      failureMode: "Bar placement error",
      description: "Actual d less than assumed due to placement tolerance or congestion.",
      severity: "HIGH",
      likelihood: 4,
      detection: 7,
      RPN: 196,
    },
    {
      failureMode: "Material strength mismatch",
      description: "Actual f_ck or f_yk below specified grade. Compliance failure.",
      severity: "HIGH",
      likelihood: 3,
      detection: 5,
      RPN: 90,
    },
  ];
}

function buildACIFMEA(
  epsilon_t: number,
  phi_f: number,
  V_s: number,
  V_s_max: number,
  rho_l: number,
  M_Ed: number,
  M_Rd: number,
  V_Ed: number,
  V_Rd: number,
): FMEARow[] {
  return [
    {
      failureMode: "Flexural yielding",
      description: "Tension-controlled flexural failure. Ductile if ε_t ≥ 0.005.",
      severity: "MEDIUM",
      likelihood: epsilon_t < 0.005 ? 7 : 4,
      detection: 3,
      RPN: epsilon_t < 0.005 ? 147 : 48,
    },
    {
      failureMode: "Compression-controlled brittle failure",
      description: "Net tensile strain below 0.002. Concrete crushes before steel yields.",
      severity: "HIGH",
      likelihood: epsilon_t < 0.002 ? 9 : 2,
      detection: 4,
      RPN: epsilon_t < 0.002 ? 288 : 32,
    },
    {
      failureMode: "Diagonal shear failure",
      description: "Diagonal tension crack without adequate stirrups.",
      severity: "HIGH",
      likelihood: V_Ed > V_Rd * 0.9 ? 7 : 4,
      detection: 5,
      RPN: V_Ed > V_Rd * 0.9 ? 280 : 80,
    },
    {
      failureMode: "Concrete strut crushing",
      description: "Web crushing limit exceeded.",
      severity: "HIGH",
      likelihood: V_s > V_s_max ? 9 : 3,
      detection: 2,
      RPN: V_s > V_s_max ? 162 : 18,
    },
    {
      failureMode: "Stirrup yielding",
      description: "Excessive stirrup stress. Large crack widths.",
      severity: "MEDIUM",
      likelihood: V_s > 0 && V_Ed > V_Rd * 0.9 ? 6 : 3,
      detection: 4,
      RPN: 72,
    },
    {
      failureMode: "Anchorage failure",
      description: "Bond slip at support. Insufficient development length.",
      severity: "HIGH",
      likelihood: M_Ed > M_Rd * 0.8 ? 5 : 3,
      detection: 6,
      RPN: M_Ed > M_Rd * 0.8 ? 180 : 90,
    },
    {
      failureMode: "Bar placement error",
      description: "Actual d less than assumed. Congestion or poor detailing.",
      severity: "HIGH",
      likelihood: 4,
      detection: 7,
      RPN: 196,
    },
    {
      failureMode: "Material strength mismatch",
      description: "Actual f_c or f_y below specified. Compliance failure.",
      severity: "HIGH",
      likelihood: 3,
      detection: 5,
      RPN: 90,
    },
  ];
}
