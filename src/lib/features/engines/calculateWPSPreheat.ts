/**
 * WPS Preheat Temperature & Carbon Equivalent Calculation Engine
 * EN 1011-2 and AWS D1.1 dual-branch preheat calculator
 * Based on PRO_043.json formulas + UNIVERSAL PRO TOOL FORM.txt
 */

export interface WeldInput {
  arc_voltage_v?: number;
  welding_current_a?: number;
  travel_speed_mm_min?: number;
  thermal_efficiency?: number;
  base_metal_CE?: number;
  plate_thickness_mm?: number;
  hydrogen_content?: number;
}

export interface WeldResult {
  HI_kj_mm: number;
  HAZ_mm: number;
  T_preheat_c: number;
  T_preheat_aws_c: number;
  T_preheat_gov_c: number;
  t85_s: number;
  CET: number;
  status: string;
  designStandard: string;
  warnings: Array<{ severity: string; source: string; message: string }>;
  [key: string]: any;
}

export function calculateWPSPreheat(rawInput: Record<string, any>): WeldResult {
  const U = Number(rawInput.arc_voltage_v) || 0;
  const I = Number(rawInput.welding_current_a) || 0;
  const v = Number(rawInput.travel_speed_mm_min) || 0;
  const eta = Number(rawInput.thermal_efficiency) || 0.8;
  const CE = Number(rawInput.base_metal_CE) || 0;
  const t = Number(rawInput.plate_thickness_mm) || 0;
  const Hd = Number(rawInput.hydrogen_content) || 10;

  if (!U || U < 10) throw new Error("Arc voltage (U) minimum 10 V required.");
  if (!I || I < 20) throw new Error("Welding current (I) minimum 20 A required.");
  if (!v || v < 50) throw new Error("Travel speed (v) minimum 50 mm/min required.");
  if (!CE || CE < 0.1) throw new Error("Carbon equivalent (CE_IIW) required (min 0.1).");
  if (!t || t < 3) throw new Error("Plate thickness (t) minimum 3 mm required.");

  const warnings: Array<{ severity: string; source: string; message: string }> = [];

  // Calculations - simplified from PRO_043.json formulas
  const HI_kj_mm = (U * I * eta * 60) / (v * 1000);
  const HAZ_mm = 0.9 * HI_kj_mm / (4.13e-3 * t);

  // CET method (EN 1011-2 Annex C) - simplified
  const CET = CE * 0.75 + 0.25;
  const T_preheat_c = Math.max(0,
    350 * Math.sqrt(
      Math.max(0.001,
        CET - 0.1 * Math.log10(Math.max(HI_kj_mm * 1000, 0.001)) +
        0.015 * Math.log10(Math.max(Hd, 0.1)) +
        0.005 * Math.log10(Math.max(t, 1))
      )
    ) - 0.08 * t
  );

  // AWS D1.1 Table 3.2 - simplified
  let T_preheat_aws_c: number;
  if (CE < 0.40) T_preheat_aws_c = 10;
  else if (CE < 0.45) T_preheat_aws_c = 66;
  else if (CE < 0.50) T_preheat_aws_c = 107;
  else T_preheat_aws_c = 150;

  const T_preheat_gov_c = Math.max(T_preheat_c, T_preheat_aws_c, 10);

  // t8/5 cooling rate - simplified Seyffarth thin-plate
  const t85_s = Math.max(0,
    (6700 - 5 * T_preheat_gov_c) * HI_kj_mm *
    (Math.pow(1 / Math.max(300 - T_preheat_gov_c, 1), 2) -
     Math.pow(1 / Math.max(700 - T_preheat_gov_c, 1), 2)) * 1e-3
  );

  // Validation warnings
  if (HI_kj_mm > 3.5) {
    warnings.push({ severity: "CRITICAL", source: "AWS D1.1 Table 3.2",
      message: `V1 BLOCK: Heat input ${HI_kj_mm.toFixed(2)} kJ/mm > 3.5: excessive - grain coarsening.` });
  }
  if (HI_kj_mm < 0.3) {
    warnings.push({ severity: "CRITICAL", source: "EN 1011-2:2001",
      message: `V2 BLOCK: Heat input ${HI_kj_mm.toFixed(2)} kJ/mm < 0.3: very high cooling rate.` });
  }
  if (CE > 0.50) {
    warnings.push({ severity: "WARNING", source: "EN 1011-2:2001 Annex C",
      message: `CE = ${CE.toFixed(3)} > 0.50: High cold cracking susceptibility. PWHT recommended.` });
  }
  if (T_preheat_gov_c > 150) {
    warnings.push({ severity: "WARNING", source: "AWS D1.1 §4.11",
      message: `Preheat > 150°C: verify interpass temperature control.` });
  }

  let status = "PASS";
  if (HI_kj_mm > 3.5 || HI_kj_mm < 0.3) status = "FAIL";
  else if (CE > 0.50) status = "WARN";

  return {
    HI_kj_mm: Math.round(HI_kj_mm * 1000) / 1000,
    HAZ_mm: Math.round(HAZ_mm * 100) / 100,
    T_preheat_c: Math.round(T_preheat_c),
    T_preheat_aws_c: Math.round(T_preheat_aws_c),
    T_preheat_gov_c: Math.round(T_preheat_gov_c),
    t85_s: Math.round(t85_s * 10) / 10,
    CET: Math.round(CET * 100) / 100,
    status,
    designStandard: "EN 1011-2 / AWS D1.1",
    warnings,
  };
}
