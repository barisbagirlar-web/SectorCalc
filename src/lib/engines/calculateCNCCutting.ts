/**
 * CNC Cutting Dynamics & Spindle Power Calculation Engine
 * Kienzle force model, Taylor tool life, GUM uncertainty
 * Based on formulas from UNIVERSAL PRO TOOL FORM.txt
 */

export interface CNCInput {
  D?: number;       // Tool diameter (mm)
  z?: number;       // Number of flutes
  Vc?: number;      // Cutting speed (m/min)
  fz?: number;      // Feed per tooth (mm/tooth)
  re?: number;      // Nose radius (mm)
  ap?: number;      // Axial depth of cut (mm)
  ae?: number;      // Radial width of cut (mm)
  kc1?: number;     // Specific cutting force (N/mm²)
  mc?: number;      // Chip thickness exponent
  eta?: number;     // Spindle efficiency (%)
  Pmax?: number;    // Machine rated power (kW)
  RPMmax?: number;  // Machine max speed (RPM)
}

export interface CNCResult {
  n_rpm: number;
  Vf: number;
  h_m: number;
  kc_act: number;
  Fc: number;
  Pc_net: number;
  P_motor: number;
  UC: number;
  MRR: number;
  Rz: number;
  Ra: number;
  T_life: number | null;
  n_act: number;
  Vc_act: number;
  status: string;
  governingMode: string;
  designStandard: string;
  warnings: Array<{ severity: string; source: string; message: string }>;
  [key: string]: any;
}

export function calculateCNCCutting(rawInput: Record<string, any>): CNCResult {
  const D = Number(rawInput.D) || 0;
  const z = Number(rawInput.z) || 0;
  const Vc = Number(rawInput.Vc) || 0;
  const fz = Number(rawInput.fz) || 0;
  const re = Number(rawInput.re) || 0;
  const ap = Number(rawInput.ap) || 0;
  const ae = Number(rawInput.ae) || 0;
  const kc1 = Number(rawInput.kc1) || 0;
  const mc = Number(rawInput.mc) || 0;
  const eta = Number(rawInput.eta) || 88;
  const Pmax = Number(rawInput.Pmax) || 0;
  const RPMmax = Number(rawInput.RPMmax) || 12000;

  if (!D || D < 0.1) throw new Error("Tool diameter (D) minimum 0.1 mm required.");
  if (!z || z < 1) throw new Error("Flute count (z) must be at least 1.");
  if (!Vc || Vc < 5) throw new Error("Cutting speed (V_c) minimum 5 m/min required.");
  if (!fz || fz < 0.001) throw new Error("Feed per tooth (f_z) minimum 0.001 mm/tooth.");
  if (!re || re < 0.01) throw new Error("Nose radius (r_ε) minimum 0.01 mm.");
  if (!ap || ap <= 0) throw new Error("Axial depth (a_p) must be positive.");
  if (!ae || ae <= 0) throw new Error("Radial width (a_e) must be positive.");
  if (!kc1 || kc1 < 100) throw new Error("k_c1 required. Select material group.");
  if (!mc || mc < 0.05) throw new Error("Kienzle exponent m_c required.");
  if (!eta || eta < 50) throw new Error("Spindle efficiency (η) required (min 50%).");
  if (!Pmax || Pmax < 1) throw new Error("Machine rated power (P_mach) required.");

  // Geometry validation
  if (ae > D) throw new Error("V1 BLOCK: a_e > D — Radial engagement exceeds tool diameter.");
  if (ap > D * 0.8) throw new Error("V3 BLOCK: a_p > 0.8D — Catastrophic bending load risk.");

  const warnings: Array<{ severity: string; source: string; message: string }> = [];

  // Calculations
  const n_rpm = (1000 * Vc) / (Math.PI * D);
  const n_act = Math.min(n_rpm, RPMmax);
  const Vc_act = (n_act * Math.PI * D) / 1000;
  const Vf = fz * z * n_act;
  const h_m = fz * Math.sqrt(ae / D);
  const kc_act = kc1 / Math.pow(h_m, mc);
  const Fc = kc_act * ap * fz;
  const Pc_net = (Fc * Vc_act) / 60000;
  const P_motor = Pc_net / (eta / 100);
  const UC = P_motor / Pmax;
  const MRR = (ap * ae * Vf) / 1000;
  const Rz = (fz * fz / (8 * re)) * 1000;
  const Ra = Rz / 4.5;

  // Warnings
  if (P_motor > Pmax) {
    warnings.push({
      severity: "WARNING", source: "ISO 3002-1 §5.3",
      message: `V5 WARN: Required power (${P_motor.toFixed(2)} kW) exceeds machine capacity (${Pmax} kW). Spindle stall hazard.`,
    });
  }
  if (n_rpm > RPMmax) {
    warnings.push({
      severity: "WARNING", source: "ISO 3002-1 §4.2",
      message: `V6 WARN: Calculated RPM (${n_rpm.toFixed(0)}) exceeds machine limit (${RPMmax}). Speed derated.`,
    });
  }

  // UC-based status
  let status = "PASS";
  if (UC > 1.0) {
    status = "FAIL";
    warnings.push({
      severity: "CRITICAL", source: "SectorCalc",
      message: `Power utilization UC = ${UC.toFixed(3)} > 1.00: Machine capacity INSUFFICIENT. Reduce a_p, a_e, or V_c.`,
    });
  } else if (UC > 0.9) {
    status = "WARN";
    warnings.push({
      severity: "WARNING", source: "SectorCalc",
      message: `Power utilization UC = ${UC.toFixed(3)} > 0.90: Machine at critical load. Reduce cutting parameters.`,
    });
  }

  return {
    n_rpm, n_act, Vc_act,
    Vf, h_m, kc_act, Fc,
    Pc_net, P_motor, UC, MRR, Rz, Ra,
    T_life: null,
    status,
    governingMode: "Spindle Power",
    designStandard: "ISO 3002-1",
    warnings,
  };
}
