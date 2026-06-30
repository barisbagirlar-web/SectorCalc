/**
 * Advanced OEE & 6 Big Loss Financial Converter Calculation Engine
 * ISO 22400-2 time model, JIPM TPM benchmarks
 * Based on formulas from UNIVERSAL PRO TOOL FORM.txt
 */

export interface OEEInput {
  T_planned?: number;   // Planned production time (h)
  T_down?: number;      // Unplanned downtime (h)
  T_setup?: number;     // Setup & changeover time (h)
  CT_ideal?: number;    // Ideal cycle time (h/unit)
  N_total?: number;     // Total parts produced
  N_good?: number;      // Good parts (first pass)
  CM_unit?: number;     // Contribution margin per unit (USD)
}

export interface OEEResult {
  OT: number;
  Av: number;
  Pf: number;
  Qu: number;
  OEE: number;
  N_max_theo: number;
  N_lost: number;
  L_financial: number;
  DPMO: number;
  status: string;
  governingMode: string;
  designStandard: string;
  hidden_capacity: number;
  warnings: Array<{ severity: string; source: string; message: string }>;
  [key: string]: any;
}

export function calculateOEE(rawInput: Record<string, any>): OEEResult {
  const Tp = Number(rawInput.T_planned) || 0;
  const Td = Number(rawInput.T_down) || 0;
  const Ts = Number(rawInput.T_setup) || 0;
  const CT = Number(rawInput.CT_ideal) || 0;
  const Nt = Number(rawInput.N_total) || 0;
  const Ng = Number(rawInput.N_good) || 0;
  const CM = Number(rawInput.CM_unit) || 0;

  if (!Tp || Tp < 0.5) throw new Error("Planned production time (T_p) minimum 0.5 h required.");
  if (!CT || CT <= 0) throw new Error("V3 BLOCK: Ideal cycle time must be positive.");
  if (!Nt || Nt < 1) throw new Error("Total parts (N_tot) must be at least 1.");
  if (Ng > Nt) throw new Error("V1 BLOCK: Good parts cannot exceed total parts.");

  const OT = Tp - Td - Ts;
  if (OT <= 0) throw new Error("V2 BLOCK: Operating Time ≤ 0. Downtime + setup exceeds planned time.");

  const warnings: Array<{ severity: string; source: string; message: string }> = [];

  // Calculations
  const Av = (OT / Tp) * 100;
  const Pf_raw = ((CT * Nt) / OT) * 100;

  if (Pf_raw > 105) {
    warnings.push({
      severity: "WARNING", source: "ISO 22400-2 §3.2.4.4",
      message: "V4 WARN: Performance > 105%: Ideal cycle time likely too long. Data inconsistency.",
    });
  }

  const Pf = Math.min(Pf_raw, 100);
  const Qu = (Ng / Nt) * 100;
  const OEE = (Av / 100) * (Pf / 100) * (Qu / 100) * 100;
  const N_max_theo = Tp / CT;
  const N_lost = Math.max(0, N_max_theo - Ng);
  const L_financial = N_lost * CM;
  const DPMO = ((Nt - Ng) / Nt) * 1_000_000;
  const hidden_capacity = Math.max(0, (85 - OEE) / 100 * N_max_theo);

  // Warnings based on benchmarks
  if (OEE < 65) {
    warnings.push({
      severity: "CRITICAL", source: "JIPM TPM World-Class Benchmark",
      message: `OEE CRITICAL: ${OEE.toFixed(1)}%. JIPM target ≥85%. Hidden capacity: ~${Math.round(hidden_capacity)} units/period. Immediate TPM intervention required.`,
    });
  } else if (OEE < 85) {
    warnings.push({
      severity: "WARNING", source: "JIPM TPM",
      message: `OEE Improvement Opportunity: ${OEE.toFixed(1)}%. Gap of ${(85 - OEE).toFixed(1)}pp = ~$${Math.round(L_financial * (85 - OEE) / (100 - OEE))} unrealized CM/period.`,
    });
  }
  if (Pf < 85) {
    warnings.push({
      severity: "WARNING", source: "ISO 22400-2 Phantom Losses",
      message: `Phantom Loss: Performance ${Pf.toFixed(1)}%. Micro-stops / speed reductions detected. Deploy MES/IIoT logging.`,
    });
  }
  if (Qu < 98) {
    warnings.push({
      severity: "WARNING", source: "Six Sigma DPMO",
      message: `Quality Loss: FPY = ${Qu.toFixed(2)}% → DPMO = ${Math.round(DPMO)}. SPC/Cpk + Poka-yoke recommended.`,
    });
  }

  let status = "PASS";
  if (OEE < 65) status = "FAIL";
  else if (OEE < 85) status = "WARN";

  return {
    OT: Math.round(OT * 100) / 100,
    Av: Math.round(Av * 10) / 10,
    Pf: Math.round(Pf * 10) / 10,
    Qu: Math.round(Qu * 10) / 10,
    OEE: Math.round(OEE * 10) / 10,
    N_max_theo: Math.round(N_max_theo),
    N_lost: Math.round(N_lost),
    L_financial: Math.round(L_financial),
    DPMO: Math.round(DPMO),
    hidden_capacity: Math.round(hidden_capacity),
    status,
    governingMode: "Overall Equipment Effectiveness",
    designStandard: "ISO 22400-2:2014",
    warnings,
  };
}
