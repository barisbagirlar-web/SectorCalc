// ═══════════════════════════════════════════════════════════════════════════
// SectorCalc Pro — Industrial-Grade Tool Schemas
// Sequence: 89 → 93  (PRO_096 · PRO_097 · PRO_098 · PRO_099 · PRO_100)
// Language: Pure Technical English
// Target Users: Structural engineers, CNC machinists, fitters, welders,
//               construction & steel fabrication technicians, surveyors
// Quality Level: TÜV-certifiable · ISO 9001 · ECMI-aligned
// Standards: ISO / EN / ASME / DIN / AWS / BS referenced per tool
// ═══════════════════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────────────────
// TOOL 89 / PRO_096
// Steel Fillet Weld Throat & Leg Size — Shear & Tension Capacity
// Standards: AWS D1.1-2020 · EN 1993-1-8 (EC3) · ISO 2553 · BS EN 1011-1
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_096",
  "tool_name": "Fillet Weld Sizing — Effective Throat, Shear Capacity & Minimum Leg Size per AWS D1.1 / EC3",
  "category": "Steel Fabrication / Welding Engineering",
  "scope": "single_operation",
  "primary_operation": "fillet_weld",

  "inputs": [
    {
      "id": "V_demand_kn",
      "name": "Applied Shear Force on Weld Group (V_u / V_Ed)",
      "unit": "kN",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.1,
      "absolute_max": 50000
    },
    {
      "id": "N_demand_kn",
      "name": "Applied Normal (Tension/Compression) Force on Weld (N_u / N_Ed)",
      "unit": "kN",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0,
      "absolute_max": 50000
    },
    {
      "id": "weld_length_mm",
      "name": "Effective Weld Length (L_eff) — excluding craters",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 10,
      "absolute_max": 20000,
      "note": "AWS D1.1 §2.5: L_eff = L_total − 2×leg size (end craters); minimum L_eff ≥ 4×leg size"
    },
    {
      "id": "base_metal_Fy_mpa",
      "name": "Base Metal Yield Strength (F_y / f_y)",
      "unit": "MPa",
      "type": "enum",
      "options": [
        { "label": "S235 / A36 — F_y = 235 MPa", "value": 235 },
        { "label": "S275 / A572-40 — F_y = 275 MPa", "value": 275 },
        { "label": "S355 / A572-50 — F_y = 355 MPa", "value": 355 },
        { "label": "S460 / A514 — F_y = 460 MPa", "value": 460 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 355
    },
    {
      "id": "filler_metal_fexx_mpa",
      "name": "Filler Metal Classification Strength (F_EXX)",
      "unit": "MPa",
      "type": "enum",
      "options": [
        { "label": "E6013 / ER70S-3 — F_EXX = 483 MPa", "value": 483 },
        { "label": "E7018 / ER70S-6 — F_EXX = 483 MPa (AWS E70)", "value": 483 },
        { "label": "E8018 — F_EXX = 552 MPa", "value": 552 },
        { "label": "E9018 — F_EXX = 621 MPa", "value": 621 },
        { "label": "E10018 — F_EXX = 690 MPa", "value": 690 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 483
    },
    {
      "id": "thicker_part_mm",
      "name": "Thickness of Thicker Connected Part (t_max)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 3,
      "absolute_max": 100,
      "note": "Controls minimum leg size per AWS D1.1 Table 8.8 and EN 1993-1-8 §4.5.3"
    },
    {
      "id": "weld_standard",
      "name": "Design Standard",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "AWS D1.1-2020 (LRFD)", "value": "AWS" },
        { "label": "EN 1993-1-8:2005 (EC3)", "value": "EC3" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "AWS"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Minimum Required Leg Size (a_min) by Base Plate Thickness",
      "expression": "a_min_aws_mm = (thicker_part_mm <= 6) ? 3 : (thicker_part_mm <= 12) ? 5 : (thicker_part_mm <= 19) ? 6 : (thicker_part_mm <= 38) ? 8 : 10; a_min_ec3_mm = Math.max(Math.sqrt(thicker_part_mm) - 0.5, 3); a_min_mm = (weld_standard === 'AWS') ? a_min_aws_mm : a_min_ec3_mm",
      "output": "a_min_mm",
      "unit": "mm",
      "reference": "AWS D1.1-2020 Table 8.8 (prequalified minimum weld size); EN 1993-1-8 §4.5.3.1 — a_min = √t_max − 0.5 mm"
    },
    {
      "id": "F2",
      "name": "Required Minimum Leg Size from Demand (a_req from capacity)",
      "expression": "F_w_mpa = (weld_standard === 'AWS') ? 0.6 * filler_metal_fexx_mpa * 0.707 : (filler_metal_fexx_mpa / Math.sqrt(3)) / 1.25; demand_kn_mm = Math.sqrt(Math.pow(V_demand_kn, 2) + Math.pow(N_demand_kn, 2)) / weld_length_mm; a_req_mm = demand_kn_mm * 1000 / F_w_mpa",
      "output": "a_req_mm",
      "unit": "mm",
      "reference": "AWS §2.4.1: φ·F_w = 0.75 × 0.6·F_EXX × 0.707; EC3 §4.5.3.3: F_w,Rd = f_u/(√3·β_w·γ_M2)"
    },
    {
      "id": "F3",
      "name": "Design Leg Size (a_design) — Governing",
      "expression": "a_design_mm = Math.ceil(Math.max(a_min_mm, a_req_mm))",
      "output": "a_design_mm",
      "unit": "mm",
      "reference": "Governing size = maximum of code minimum and calculated requirement; round up to nearest mm"
    },
    {
      "id": "F4",
      "name": "Effective Throat (a_eff) & Weld Area",
      "expression": "a_eff_mm = a_design_mm * 0.707; A_w_mm2 = a_eff_mm * weld_length_mm",
      "output": "a_eff_mm, A_w_mm2",
      "unit": "mm, mm²",
      "reference": "Throat = leg × cos45° = leg × 0.707 — ISO 2553:2019 §3.6; theoretical throat for equal-leg fillet"
    },
    {
      "id": "F5",
      "name": "Weld Capacity — Shear on Throat (φR_n / F_w,Rd)",
      "expression": "F_w_mpa = (weld_standard === 'AWS') ? 0.75 * 0.6 * filler_metal_fexx_mpa : filler_metal_fexx_mpa / (Math.sqrt(3) * 1.25); phi_Rn_kn = F_w_mpa * A_w_mm2 / 1000",
      "output": "phi_Rn_kn",
      "unit": "kN",
      "reference": "AWS §2.4.1 φR_n = 0.75 × 0.6·F_EXX × A_w; EC3 §4.5.3.3 F_w,Rd = f_vw,d × A_w"
    },
    {
      "id": "F6",
      "name": "Resultant Demand & Utilisation Ratio",
      "expression": "V_resultant_kn = Math.sqrt(Math.pow(V_demand_kn, 2) + Math.pow(N_demand_kn, 2)); DCR_weld = V_resultant_kn / phi_Rn_kn",
      "output": "DCR_weld, V_resultant_kn",
      "unit": "dimensionless, kN",
      "reference": "Resultant force vector check; DCR ≤ 1.0 required — AWS §2.4.1 / EC3 §4.5.3"
    }
  ],

  "engine_rules": {
    "standards": ["AWS D1.1-2020 §2.4, Table 8.8", "EN 1993-1-8:2005 §4.5.3", "ISO 2553:2019", "BS EN 1011-1:2009"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "DCR_weld > 1.0", "action": "BLOCK", "message": "Weld group overstressed — increase leg size, add weld length, or select higher-strength filler metal" },
        { "id": "V2", "condition": "a_design_mm < a_min_mm", "action": "BLOCK", "message": "Design leg size below code minimum for plate thickness — minimum leg size per AWS Table 8.8 / EC3 §4.5.3 must be met regardless of calculated demand" },
        { "id": "V3", "condition": "weld_length_mm < 4 * a_design_mm", "action": "WARN", "message": "Weld length < 4× leg size: weld too short relative to size — AWS D1.1 §2.5 minimum effective length requirement violated; increase length or reduce leg size" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "a_design_mm > thicker_part_mm * 0.75", "severity": "CRITICAL", "message": "Weld leg > 75% of plate thickness: excessive heat input risk — risk of burn-through and distortion; maximum weld leg = t − 1.5 mm for plates < 12 mm per AWS §2.5.2" },
      { "id": "W2", "trigger": "DCR_weld > 0.85", "severity": "WARNING", "message": "Weld utilisation > 85%: limited reserve for dynamic or fatigue loading — increase leg size by minimum 2 mm or add return welds at ends" },
      { "id": "W3", "trigger": "filler_metal_fexx_mpa < base_metal_Fy_mpa * 1.2", "severity": "WARNING", "message": "Undermatching filler metal: F_EXX < 1.2×F_y of base metal — acceptable for ductility in some cases, but verify per AWS D1.1 Annex I for high-strength steel" },
      { "id": "W4", "trigger": "a_design_mm < 5 && V_demand_kn > 50", "severity": "WARNING", "message": "Small weld leg under high load: verify welder qualification — leg size < 5 mm requires special quality control per ISO 3834-2" },
      { "id": "W5", "trigger": "N_demand_kn > V_demand_kn * 0.5", "severity": "INFO", "message": "Significant tension component: combined stress state — verify weld orientation; transverse welds to applied tension are 50% stronger than longitudinal per AWS Annex B" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 90 / PRO_097
// CNC Thread Milling — Lead, Helix Angle, Tap Drill & Feed Rate
// Standards: ISO 68-1 · ISO 965-1 · DIN 13-1 · ASME B1.13M
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_097",
  "tool_name": "CNC Thread Milling & Tapping — Tap Drill Diameter, Helix Angle, Lead & Cutting Parameters",
  "category": "CNC Machining / Threading Operations",
  "scope": "single_operation",
  "primary_operation": "thread_milling",

  "inputs": [
    {
      "id": "thread_designation",
      "name": "Thread Designation",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "M6 × 1.0 — d2=5.350, d1=4.917 mm", "value": "M6" },
        { "label": "M8 × 1.25 — d2=7.188, d1=6.647 mm", "value": "M8" },
        { "label": "M10 × 1.5 — d2=9.026, d1=8.376 mm", "value": "M10" },
        { "label": "M12 × 1.75 — d2=10.863, d1=10.106 mm", "value": "M12" },
        { "label": "M16 × 2.0 — d2=14.701, d1=13.835 mm", "value": "M16" },
        { "label": "M20 × 2.5 — d2=18.376, d1=17.294 mm", "value": "M20" },
        { "label": "M24 × 3.0 — d2=22.051, d1=20.752 mm", "value": "M24" },
        { "label": "M30 × 3.5 — d2=27.727, d1=26.211 mm", "value": "M30" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "M12"
    },
    {
      "id": "thread_tolerance_class",
      "name": "Thread Tolerance Class (Internal)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "6H — Standard engineering fit", "value": "6H" },
        { "label": "5H — Close fit, precision", "value": "5H" },
        { "label": "7H — Free fit, plated components", "value": "7H" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "6H"
    },
    {
      "id": "workpiece_material_group",
      "name": "Workpiece Material Group (ISO 513)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "P — Steel (Vc=10–25 m/min for tapping)", "value": "P" },
        { "label": "M — Stainless steel (Vc=5–12 m/min)", "value": "M" },
        { "label": "K — Cast iron (Vc=15–30 m/min)", "value": "K" },
        { "label": "N — Aluminium / non-ferrous (Vc=30–80 m/min)", "value": "N" },
        { "label": "S — Heat-resistant superalloys (Vc=3–8 m/min)", "value": "S" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "P"
    },
    {
      "id": "thread_depth_mm",
      "name": "Required Thread Engagement Depth (L_eng)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 2,
      "absolute_max": 150,
      "note": "ISO 898-1: minimum engagement = 1.0D for steel-in-steel; 1.5D for bolt into aluminium"
    },
    {
      "id": "Vc_m_min",
      "name": "Cutting Speed for Tapping / Thread Milling (V_c)",
      "unit": "m/min",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 15,
      "absolute_min": 1,
      "absolute_max": 120
    },
    {
      "id": "coolant_type",
      "name": "Coolant / Lubrication Strategy",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Through-tool flood coolant — full speed", "value": "flood" },
        { "label": "MQL (minimum quantity lubrication) — reduce Vc 20%", "value": "MQL" },
        { "label": "Dry — reduce Vc 40%", "value": "dry" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "flood"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Thread Geometry — Pitch, Minor Diameter & Tap Drill Size",
      "expression": "const TH = {M6:{D:6,p:1.0,d1:4.917,d2:5.350}, M8:{D:8,p:1.25,d1:6.647,d2:7.188}, M10:{D:10,p:1.5,d1:8.376,d2:9.026}, M12:{D:12,p:1.75,d1:10.106,d2:10.863}, M16:{D:16,p:2.0,d1:13.835,d2:14.701}, M20:{D:20,p:2.5,d1:17.294,d2:18.376}, M24:{D:24,p:3.0,d1:20.752,d2:22.051}, M30:{D:30,p:3.5,d1:26.211,d2:27.727}}; const t=TH[thread_designation]; nominal_D=t.D; pitch_mm=t.p; d1_mm=t.d1; d2_mm=t.d2; tap_drill_mm = d1_mm + (thread_tolerance_class==='7H' ? 0.2 : thread_tolerance_class==='5H' ? 0.0 : 0.1)",
      "output": "tap_drill_mm, pitch_mm",
      "unit": "mm",
      "reference": "ISO 68-1:1998 / ISO 965-1:1998 — basic profile; tap drill = d1 + tolerance allowance per 6H/5H/7H"
    },
    {
      "id": "F2",
      "name": "Helix Angle (α) at Thread Pitch Diameter",
      "expression": "alpha_deg = Math.atan(pitch_mm / (Math.PI * d2_mm)) * 180 / Math.PI",
      "output": "alpha_deg",
      "unit": "°",
      "reference": "tan(α) = p / (π × d₂) — ISO 5408; helix angle at pitch cylinder; typical 2–6° for coarse metric"
    },
    {
      "id": "F3",
      "name": "Corrected Cutting Speed for Coolant Strategy",
      "expression": "Vc_factor = {flood:1.0, MQL:0.80, dry:0.60}[coolant_type]; Vc_corrected = Vc_m_min * Vc_factor",
      "output": "Vc_corrected",
      "unit": "m/min",
      "reference": "Coolant reduction factors — Sandvik C-2920 §12.4; dry threading requires significant speed reduction"
    },
    {
      "id": "F4",
      "name": "Spindle Speed for Tapping / Thread Milling (n)",
      "expression": "n_rpm = Vc_corrected * 1000 / (Math.PI * nominal_D)",
      "output": "n_rpm",
      "unit": "rpm",
      "reference": "n = V_c × 1000 / (π × D) — applied to nominal thread diameter"
    },
    {
      "id": "F5",
      "name": "Synchronised Feed Rate (V_f) — Rigid Tapping",
      "expression": "Vf_mm_min = n_rpm * pitch_mm",
      "output": "Vf_mm_min",
      "unit": "mm/min",
      "reference": "V_f = n × p — rigid tapping synchronisation; F_per_rev = p (exact); CNC G84 / G74 cycle"
    },
    {
      "id": "F6",
      "name": "Cutting Torque Estimate (M_c) & Spindle Load Check",
      "expression": "const Vc_mult = {P:1.0, M:1.8, K:0.7, N:0.4, S:2.5}[workpiece_material_group]; Mc_Nm = 0.00022 * Vc_mult * Math.pow(nominal_D, 2.6) * pitch_mm",
      "output": "Mc_Nm",
      "unit": "N·m",
      "reference": "Approximate tapping torque: M_c = C_m × D^2.6 × p; C_m empirical per material group — Titex / Walter reference data"
    }
  ],

  "engine_rules": {
    "standards": ["ISO 68-1:1998", "ISO 965-1:1998", "DIN 13-1:1999", "ASME B1.13M-2005", "Sandvik C-2920 §12"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "tap_drill_mm > nominal_D * 0.95", "action": "BLOCK", "message": "Tap drill diameter > 95% of nominal: insufficient thread material — tap drill calculation error; verify thread pitch" },
        { "id": "V2", "condition": "thread_depth_mm < nominal_D * 0.8 && workpiece_material_group !== 'P'", "action": "WARN", "message": "Thread engagement < 0.8D in non-steel material: strip-out risk — increase engagement to minimum 1.5D for aluminium, 2.0D for plastics" },
        { "id": "V3", "condition": "n_rpm > 10000 && nominal_D > 10", "action": "WARN", "message": "High speed on large tap (D > 10 mm): cutting speed is aggressive — verify machine spindle torque rating at this RPM; tap breakage risk increases significantly" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "workpiece_material_group === 'M' && coolant_type === 'dry'", "severity": "CRITICAL", "message": "Dry tapping in stainless steel: tap seizure imminent — stainless work-hardens rapidly; mandatory MQL or flood coolant; reduce Vc to ≤ 8 m/min" },
      { "id": "W2", "trigger": "workpiece_material_group === 'S' && Vc_m_min > 6", "action": "WARNING", "message": "Cutting speed too high for superalloy threading: V_c > 6 m/min in Ni/Ti alloys causes rapid BUE and tap fracture — reduce to 3–5 m/min and use HSSE-PM or solid carbide tap" },
      { "id": "W3", "trigger": "alpha_deg < 2", "severity": "INFO", "message": "Very small helix angle (< 2°): fine pitch thread — chip evacuation critical; use spiral flute tap (right-hand helix) for blind holes to eject chips upward" },
      { "id": "W4", "trigger": "Vf_mm_min > 500 && nominal_D < 8", "severity": "WARNING", "message": "High feed rate on small tap: synchronisation error of ±1 rpm causes proportionally large pitch error — verify CNC rigid tapping encoder resolution; use compensation chuck below M8" },
      { "id": "W5", "trigger": "thread_depth_mm > nominal_D * 2.5", "severity": "WARNING", "message": "Deep blind hole threading: chip accumulation risk — use spiral flute tap and retract every 5 mm for chip evacuation; flood coolant at maximum pressure mandatory" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 91 / PRO_098
// Steel Beam Deflection & Camber — Service Load Check
// Standards: EN 1993-1-1 §7 · AISC 360-22 · SCI P355 · BS 5950-1
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_098",
  "tool_name": "Steel Beam Deflection Under Service Load — Elastic Deflection, Camber & L/d Efficiency",
  "category": "Structural Steel / Construction Engineering",
  "scope": "single_operation",
  "primary_operation": "beam_deflection",

  "inputs": [
    {
      "id": "span_m",
      "name": "Beam Clear Span (L)",
      "unit": "m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.5,
      "absolute_max": 60
    },
    {
      "id": "w_dead_kn_m",
      "name": "Unfactored Dead Load (Uniformly Distributed) (g_k)",
      "unit": "kN/m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0,
      "absolute_max": 500
    },
    {
      "id": "w_live_kn_m",
      "name": "Unfactored Live / Imposed Load (UDL) (q_k)",
      "unit": "kN/m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0,
      "absolute_max": 500
    },
    {
      "id": "P_point_kn",
      "name": "Concentrated Point Load at Midspan (P_k)",
      "unit": "kN",
      "type": "number",
      "required": false,
      "confidence_label": "KESİN",
      "default": 0,
      "absolute_min": 0,
      "absolute_max": 10000
    },
    {
      "id": "Ix_cm4",
      "name": "Second Moment of Area About Strong Axis (I_x)",
      "unit": "cm⁴",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 10,
      "absolute_max": 10000000,
      "note": "From section tables: UB 406×178×67 → I_x = 24330 cm⁴; IPE 360 → I_x = 16270 cm⁴"
    },
    {
      "id": "beam_depth_mm",
      "name": "Overall Beam Depth (d)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 50,
      "absolute_max": 1500
    },
    {
      "id": "end_condition",
      "name": "Beam End Support Condition",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Simply supported (pinned-roller) — C_δ = 5/384", "value": "SS" },
        { "label": "Fixed-fixed (fully restrained) — C_δ = 1/384", "value": "FF" },
        { "label": "Fixed-pinned — C_δ = 1/185", "value": "FP" },
        { "label": "Cantilever — C_δ = 1/8", "value": "cant" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "SS"
    },
    {
      "id": "deflection_limit_ratio",
      "name": "Allowable Deflection Limit (L / n)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "L/200 — Industrial floors, plant rooms", "value": 200 },
        { "label": "L/250 — General floors (EN 1993-1-1 §7)", "value": 250 },
        { "label": "L/360 — Plaster ceiling / brittle finishes", "value": 360 },
        { "label": "L/500 — Sensitive equipment, precision floors", "value": 500 },
        { "label": "L/600 — Overhead cranes (AWS D1.1)", "value": 600 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 360
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Deflection Coefficient (C_δ) by End Condition",
      "expression": "Cd_map = {SS: 5/384, FF: 1/384, FP: 1/185, cant: 1/8}; Cd = Cd_map[end_condition]",
      "output": "Cd",
      "unit": "dimensionless",
      "reference": "Beam deflection coefficients — Roark's Formulas for Stress & Strain 8th Ed. §8.1; EN 1993-1-1 §7"
    },
    {
      "id": "F2",
      "name": "Dead Load Deflection (δ_DL)",
      "expression": "E_steel = 210000; I_m4 = Ix_cm4 * 1e-8; L_m = span_m; delta_DL_mm = Cd * w_dead_kn_m * 1000 * Math.pow(L_m, 4) / (E_steel * 1e6 * I_m4) * 1000",
      "output": "delta_DL_mm",
      "unit": "mm",
      "reference": "δ = C_δ × w × L⁴ / (E × I); E = 210,000 MPa for steel — EN 1993-1-1 §3.2.6"
    },
    {
      "id": "F3",
      "name": "Live Load Deflection (δ_LL) — Governs for Limits",
      "expression": "delta_LL_mm = Cd * w_live_kn_m * 1000 * Math.pow(span_m, 4) / (210000e6 * Ix_cm4 * 1e-8) * 1000 + (P_point_kn > 0 ? 1/48 * P_point_kn * 1000 * Math.pow(span_m, 3) / (210000e6 * Ix_cm4 * 1e-8) * 1000 : 0)",
      "output": "delta_LL_mm",
      "unit": "mm",
      "reference": "Live load + point load deflections superimposed; midspan point load δ = PL³/(48EI) for SS beam"
    },
    {
      "id": "F4",
      "name": "Total Deflection (δ_total) & Allowable Limit",
      "expression": "delta_total_mm = delta_DL_mm + delta_LL_mm; delta_allow_mm = span_m * 1000 / deflection_limit_ratio",
      "output": "delta_total_mm, delta_allow_mm",
      "unit": "mm",
      "reference": "Allowable = L/n; total = δ_DL + δ_LL — EN 1993-1-1 §7.2 Table NA.3 / AISC DG3"
    },
    {
      "id": "F5",
      "name": "Span-to-Depth Ratio (L/d) — Efficiency Check",
      "expression": "Ld_ratio = span_m * 1000 / beam_depth_mm",
      "output": "Ld_ratio",
      "unit": "dimensionless",
      "reference": "L/d efficiency: floors 18–24; purlins 20–30; crane beams 12–16 — SCI P355 §3.2 design guidance"
    },
    {
      "id": "F6",
      "name": "Recommended Camber & Deflection Utilisation",
      "expression": "camber_mm = (delta_DL_mm > 10) ? Math.round(delta_DL_mm * 0.75) : 0; deflection_util = delta_LL_mm / delta_allow_mm",
      "output": "camber_mm, deflection_util",
      "unit": "mm, dimensionless",
      "reference": "Camber = 75% of dead load deflection per AISC Code of Standard Practice §6.1; δ_LL / δ_allow ≤ 1.0"
    }
  ],

  "engine_rules": {
    "standards": ["EN 1993-1-1:2022 §7.2", "AISC 360-22 Appendix 2", "SCI P355:2011", "BS 5950-1:2000 §2.5.2"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "deflection_util > 1.0", "action": "WARN", "message": "Live load deflection exceeds allowable limit — increase section size (I_x), reduce span with intermediate support, or accept lower deflection limit" },
        { "id": "V2", "condition": "delta_total_mm > span_m * 10", "action": "WARN", "message": "Total deflection exceeds L/100: extreme deflection — verify input values; beam is severely undersized or span is unrealistic for this load" },
        { "id": "V3", "condition": "Ld_ratio > 30 && w_live_kn_m > 5", "action": "WARN", "message": "L/d > 30 with significant live load: shallow beam will deflect excessively — consider L/d ≤ 20 as starting point for preliminary sizing under office / industrial loads" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "camber_mm > 0 && end_condition !== 'SS'", "severity": "INFO", "message": "Camber specified on non-simply-supported beam: verify that end connection allows free rotation and that camber direction is consistent with actual dead load deflection shape" },
      { "id": "W2", "trigger": "deflection_util > 0.85", "severity": "WARNING", "message": "Deflection utilisation > 85%: marginal — consider one section deeper; increasing depth by 50 mm typically reduces δ by 15–20% for the same weight" },
      { "id": "W3", "trigger": "delta_DL_mm > span_m * 1000 / 400", "severity": "WARNING", "message": "Dead load deflection > L/400: significant long-term creep and ponding risk on flat roofs — EC3 recommends δ_DL + creep < L/300 for roofs per §7.2.1" },
      { "id": "W4", "trigger": "deflection_limit_ratio >= 500 && Ld_ratio > 20", "severity": "WARNING", "message": "Precision deflection limit on shallow beam: floor vibration may govern before deflection limit — check natural frequency per SCI P354 (fn > 4 Hz for office floors)" },
      { "id": "W5", "trigger": "end_condition === 'cant' && span_m > 3", "severity": "CRITICAL", "message": "Long cantilever (> 3 m): deflection tip grows as L³; very sensitive to load position — verify back-span anchorage and connection rotation capacity; dynamic check mandatory per SCI P076" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 92 / PRO_099
// Surface Roughness Conversion & Ra/Rz/Rq/Rt Equivalence
// Standards: ISO 4287:1997 · ISO 4288:1996 · ISO 1302:2002 · ASME B46.1
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_099",
  "tool_name": "Surface Roughness Conversion — Ra, Rz, Rq, Rt & Machining Process Capability",
  "category": "Quality Engineering / Metrology / CNC Machining",
  "scope": "process_agnostic",
  "primary_operation": "surface_roughness",

  "inputs": [
    {
      "id": "Ra_um",
      "name": "Arithmetic Mean Roughness (Ra)",
      "unit": "µm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.001,
      "absolute_max": 400,
      "note": "ISO 4287 §4.2.1 — Ra: most universal specification parameter; measured by profilometer"
    },
    {
      "id": "machining_process",
      "name": "Machining / Finishing Process",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Grinding (cylindrical / surface) — Ra 0.1–1.6 µm", "value": "grinding" },
        { "label": "Turning (finish) — Ra 0.8–3.2 µm", "value": "turning_finish" },
        { "label": "Turning (rough) — Ra 3.2–12.5 µm", "value": "turning_rough" },
        { "label": "Milling (finish) — Ra 0.8–3.2 µm", "value": "milling_finish" },
        { "label": "Milling (rough) — Ra 3.2–12.5 µm", "value": "milling_rough" },
        { "label": "Honing — Ra 0.05–0.4 µm", "value": "honing" },
        { "label": "Lapping — Ra 0.01–0.2 µm", "value": "lapping" },
        { "label": "EDM (spark erosion) — Ra 0.4–6.3 µm", "value": "edm" },
        { "label": "Shot blasting — Ra 6.3–25 µm", "value": "shot_blast" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "turning_finish"
    },
    {
      "id": "cutoff_lambda_c_mm",
      "name": "Evaluation Cut-off Length (λ_c)",
      "unit": "mm",
      "type": "enum",
      "options": [
        { "label": "0.08 mm — Ra 0.006–0.02 µm (superfinish)", "value": 0.08 },
        { "label": "0.25 mm — Ra 0.02–0.1 µm", "value": 0.25 },
        { "label": "0.8 mm — Ra 0.1–2.0 µm (standard)", "value": 0.8 },
        { "label": "2.5 mm — Ra 2.0–10 µm", "value": 2.5 },
        { "label": "8.0 mm — Ra 10–80 µm (rough surfaces)", "value": 8.0 }
      ],
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 0.8,
      "note": "ISO 4288:1996 Table 1 — standard cut-off selection based on expected Ra range"
    },
    {
      "id": "N_value",
      "name": "ISO Surface Finish N-Number (N1–N12)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "N1 — Ra=0.025 µm (mirror finish)", "value": 1 },
        { "label": "N2 — Ra=0.05 µm", "value": 2 },
        { "label": "N3 — Ra=0.1 µm (precision ground)", "value": 3 },
        { "label": "N4 — Ra=0.2 µm", "value": 4 },
        { "label": "N5 — Ra=0.4 µm (ground)", "value": 5 },
        { "label": "N6 — Ra=0.8 µm (fine finish)", "value": 6 },
        { "label": "N7 — Ra=1.6 µm (machine finish)", "value": 7 },
        { "label": "N8 — Ra=3.2 µm (standard machine)", "value": 8 },
        { "label": "N9 — Ra=6.3 µm (rough machine)", "value": 9 },
        { "label": "N10 — Ra=12.5 µm (very rough)", "value": 10 },
        { "label": "N11 — Ra=25 µm", "value": 11 },
        { "label": "N12 — Ra=50 µm (unmachined)", "value": 12 }
      ],
      "required": false,
      "confidence_label": "GÜÇLÜ",
      "default": 7
    },
    {
      "id": "measurement_traverse_mm",
      "name": "Measurement Traverse Length (L_t)",
      "unit": "mm",
      "type": "number",
      "required": false,
      "confidence_label": "VARSAYIM",
      "default": 4.0,
      "absolute_min": 0.4,
      "absolute_max": 40,
      "note": "ISO 4288: L_t = 5 × λ_c for standard measurement (5 sampling lengths)"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Rz (Ten-Point Height / Maximum Height) from Ra",
      "expression": "Rz_um = Ra_um * 7.2",
      "output": "Rz_um",
      "unit": "µm",
      "reference": "ISO 4287 — empirical ratio Rz ≈ 7.2 × Ra for turned and ground surfaces (range 4–10×); ISO 1302:2002 §4.3"
    },
    {
      "id": "F2",
      "name": "Rq (Root Mean Square Roughness) from Ra",
      "expression": "Rq_um = Ra_um * 1.11",
      "output": "Rq_um",
      "unit": "µm",
      "reference": "Rq ≈ 1.11 × Ra for Gaussian height distribution — ISO 4287 §4.2.2; used in tribology and bearing contact analysis"
    },
    {
      "id": "F3",
      "name": "Rt (Total Profile Height — Maximum Peak to Valley) from Ra",
      "expression": "Rt_um = Ra_um * 10",
      "output": "Rt_um",
      "unit": "µm",
      "reference": "Rt ≈ 10 × Ra (conservative estimate for machined surfaces) — Whitehouse 'Surfaces and their Measurement' §3"
    },
    {
      "id": "F4",
      "name": "ISO N-Number Ra Equivalence (from N-number input)",
      "expression": "Ra_from_N_um = 0.025 * Math.pow(2, N_value - 1)",
      "output": "Ra_from_N_um",
      "unit": "µm",
      "reference": "ISO 1302:2002 Table 1 — Ra_N = 0.025 × 2^(N−1); N7 = 1.6 µm; N9 = 6.3 µm"
    },
    {
      "id": "F5",
      "name": "ASME B46.1 CLA (Centreline Average) — US Microinch Conversion",
      "expression": "Ra_microinch = Ra_um * 39.37; Rz_microinch = Rz_um * 39.37",
      "output": "Ra_microinch, Rz_microinch",
      "unit": "µin",
      "reference": "1 µm = 39.37 µin — ASME B46.1-2019 §1.1; CLA (US) = Ra (ISO)"
    },
    {
      "id": "F6",
      "name": "Achievable Ra Range & Process Capability Assessment",
      "expression": "const PR = {grinding:[0.1,1.6], turning_finish:[0.8,3.2], turning_rough:[3.2,12.5], milling_finish:[0.8,3.2], milling_rough:[3.2,12.5], honing:[0.05,0.4], lapping:[0.01,0.2], edm:[0.4,6.3], shot_blast:[6.3,25]}; const r=PR[machining_process]; Ra_min_proc=r[0]; Ra_max_proc=r[1]; in_range = Ra_um >= Ra_min_proc && Ra_um <= Ra_max_proc",
      "output": "Ra_min_proc, Ra_max_proc, in_range",
      "unit": "µm, µm, boolean",
      "reference": "Process capability ranges — Kalpakjian Manufacturing Engineering 7th Ed. §26; ISO 286-2 surface finish correlation"
    }
  ],

  "engine_rules": {
    "standards": ["ISO 4287:1997", "ISO 4288:1996", "ISO 1302:2002", "ASME B46.1-2019", "EN ISO 13565-1"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "!in_range", "action": "WARN", "message": "Specified Ra is outside the normal capability of the selected machining process — verify process selection or accept that special tooling, passes, and conditions are required" },
        { "id": "V2", "condition": "Ra_um < 0.05 && machining_process !== 'lapping' && machining_process !== 'honing'", "action": "WARN", "message": "Ra < 0.05 µm with standard machining: only achievable by lapping, superfinishing, or polishing — specify correct process" },
        { "id": "V3", "condition": "measurement_traverse_mm < 5 * cutoff_lambda_c_mm", "action": "WARN", "message": "Traverse length < 5 × cut-off length: ISO 4288 requires minimum 5 sampling lengths for reliable Ra measurement — increase traverse length" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "Ra_um < 0.4 && machining_process === 'edm'", "severity": "WARNING", "message": "Ra < 0.4 µm from EDM: requires mirror EDM with very low energy settings — expect 5–10× longer machining time vs standard EDM at Ra 1.6 µm" },
      { "id": "W2", "trigger": "Ra_um > 3.2 && N_value <= 7", "severity": "WARNING", "message": "Ra inconsistency: specified Ra > 3.2 µm but N-value requests ≤ 1.6 µm — review which parameter is the actual requirement; Ra from profilometer takes precedence" },
      { "id": "W3", "trigger": "Rz_um > 25 && machining_process === 'turning_finish'", "severity": "INFO", "message": "High Rz on finish turning: check insert nose condition and cutting parameters — Rz > 25 µm suggests chatter or built-up edge; increase Vc or reduce feed" },
      { "id": "W4", "trigger": "Ra_um < 0.2 && cutoff_lambda_c_mm > 0.8", "severity": "WARNING", "message": "Very fine surface with long cut-off: ISO 4288 requires λ_c = 0.25 mm for Ra < 0.1 µm — using 0.8 mm cut-off will include waviness in Ra and give falsely high reading" },
      { "id": "W5", "trigger": "Ra_from_N_um > Ra_um * 2 || Ra_from_N_um < Ra_um * 0.5", "severity": "INFO", "message": "N-number and Ra values are inconsistent by more than 2×: specify one parameter and derive the other — do not independently specify both to avoid conflicting drawing requirements" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 93 / PRO_100
// Concrete Reinforcing Bar Splice Length & Development Length
// Standards: ACI 318-19 · EN 1992-1-1 (EC2) · BS 8110 · ISO 6935-2
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_100",
  "tool_name": "Rebar Development & Lap Splice Length — Tension, Compression & Seismic Requirements",
  "category": "Concrete Construction / Reinforcement Engineering",
  "scope": "single_operation",
  "primary_operation": "rebar_development_splice",

  "inputs": [
    {
      "id": "bar_diameter_mm",
      "name": "Rebar Nominal Diameter (d_b)",
      "unit": "mm",
      "type": "enum",
      "options": [8, 10, 12, 14, 16, 20, 25, 28, 32, 36, 40],
      "required": true,
      "confidence_label": "KESİN",
      "default": 16
    },
    {
      "id": "fy_mpa",
      "name": "Rebar Yield Strength (f_y)",
      "unit": "MPa",
      "type": "enum",
      "options": [
        { "label": "B500B / Grade 60 — 500 MPa (EN ISO 6935-2)", "value": 500 },
        { "label": "B420 — 420 MPa", "value": 420 },
        { "label": "Grade 40 (ASTM) — 280 MPa", "value": 280 },
        { "label": "ASTM A615 Grade 80 — 550 MPa", "value": 550 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 500
    },
    {
      "id": "fc_prime_mpa",
      "name": "Concrete Compressive Strength (f'_c / f_ck)",
      "unit": "MPa",
      "type": "enum",
      "options": [20, 25, 28, 30, 32, 35, 40, 45, 50],
      "required": true,
      "confidence_label": "KESİN",
      "default": 30
    },
    {
      "id": "cover_mm",
      "name": "Concrete Cover to Bar Surface (c)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "default": 40,
      "absolute_min": 15,
      "absolute_max": 100,
      "note": "ACI 318 §20.6.1: columns/beams min 40 mm; slabs min 20 mm; exposure class XS: min 50 mm"
    },
    {
      "id": "bar_spacing_mm",
      "name": "Clear Spacing Between Bars (c_s)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "default": 75,
      "absolute_min": 20,
      "absolute_max": 500,
      "note": "ACI §25.2.1: minimum clear spacing ≥ d_b, 25 mm, or 4/3 × aggregate size"
    },
    {
      "id": "load_type",
      "name": "Rebar Loading Condition",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Tension — standard development", "value": "tension" },
        { "label": "Compression — compression development", "value": "compression" },
        { "label": "Tension — seismic (Class SDC D/E/F or DCM/DCH)", "value": "seismic" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "tension"
    },
    {
      "id": "transverse_reinforcement",
      "name": "Transverse Reinforcement Along Splice",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Ties/stirrups present meeting ACI §25.5.2 or EC2 §8.7", "value": "ties" },
        { "label": "No transverse reinforcement", "value": "none" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "ties"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "ACI 318-19 Development Length in Tension (l_d)",
      "expression": "lambda = 1.0; psi_t = 1.0; psi_e = 1.0; psi_s = (bar_diameter_mm <= 19) ? 0.8 : 1.0; cb = Math.min(cover_mm + bar_diameter_mm/2, bar_spacing_mm/2 + bar_diameter_mm/2); Ktr = (transverse_reinforcement === 'ties') ? 40 * 0.00129 * bar_diameter_mm / bar_diameter_mm * 10 : 0; cb_plus_Ktr_db = Math.min((cb + Ktr) / bar_diameter_mm, 2.5); ld_ACI_mm = (3 * fy_mpa * psi_t * psi_e * psi_s * lambda / (40 * lambda * Math.sqrt(fc_prime_mpa) * cb_plus_Ktr_db)) * bar_diameter_mm",
      "output": "ld_ACI_mm",
      "unit": "mm",
      "reference": "ACI 318-19 §25.4.2.3 Eq.(25.4.2.3a) — l_d = (3f_y ψ_t ψ_e ψ_s λ)/(40λ√f'_c × (c_b+K_tr)/d_b) × d_b"
    },
    {
      "id": "F2",
      "name": "EC2 Design Anchorage Length (l_bd)",
      "expression": "fbd_mpa = 2.25 * 1.0 * 1.0 * 0.21 * Math.pow(fc_prime_mpa, 2/3); lb_req_mm = (bar_diameter_mm / 4) * (fy_mpa / (1.15 * fbd_mpa)); alpha1=1.0; alpha2=Math.max(1 - 0.15*(cover_mm - bar_diameter_mm)/bar_diameter_mm, 0.7); lbd_EC2_mm = Math.max(alpha1 * alpha2 * lb_req_mm, Math.max(0.3 * lb_req_mm, 10 * bar_diameter_mm, 100))",
      "output": "lbd_EC2_mm",
      "unit": "mm",
      "reference": "EN 1992-1-1:2004 §8.4.4 — f_bd = 2.25η₁η₂f_ctd; l_b,req = (d_b/4)·(σ_sd/f_bd); l_bd = α₁α₂...·l_b,req"
    },
    {
      "id": "F3",
      "name": "Tension Lap Splice Length (l_s)",
      "expression": "splice_factor = (load_type === 'seismic') ? 1.7 : (transverse_reinforcement === 'none') ? 1.3 : 1.3; ld_governing = Math.max(ld_ACI_mm, lbd_EC2_mm); ls_mm = ld_governing * splice_factor",
      "output": "ls_mm",
      "unit": "mm",
      "reference": "ACI 318-19 §25.5.2 — Class B splice: 1.3 × l_d; seismic per §18.8.2.3: 1.7 × l_d in potential hinge zones"
    },
    {
      "id": "F4",
      "name": "Compression Development Length (l_dc)",
      "expression": "ldc_ACI_mm = (fy_mpa <= 420) ? Math.max(0.24 * fy_mpa / Math.sqrt(fc_prime_mpa) * bar_diameter_mm, 0.043 * fy_mpa * bar_diameter_mm) : Math.max((0.25 * fy_mpa - 24) / Math.sqrt(fc_prime_mpa) * bar_diameter_mm, 0.043 * fy_mpa * bar_diameter_mm); ldc_mm = Math.max(ldc_ACI_mm, 200)",
      "output": "ldc_mm",
      "unit": "mm",
      "reference": "ACI 318-19 §25.4.9 — compression development length; minimum 200 mm"
    },
    {
      "id": "F5",
      "name": "Governing Development / Splice Length",
      "expression": "l_governing_mm = (load_type === 'compression') ? ldc_mm : ls_mm; l_bars = Math.ceil(l_governing_mm / bar_diameter_mm)",
      "output": "l_governing_mm, l_bars",
      "unit": "mm, bar diameters",
      "reference": "Governing length expressed in bar diameters for field verification; field check: L_splice / d_b"
    },
    {
      "id": "F6",
      "name": "Minimum Concrete Concrete Compressive Strength for Bar Diameter",
      "expression": "fc_min_recommended_mpa = (bar_diameter_mm >= 32) ? 35 : (bar_diameter_mm >= 25) ? 28 : 20; fc_adequate = fc_prime_mpa >= fc_min_recommended_mpa",
      "output": "fc_min_recommended_mpa, fc_adequate",
      "unit": "MPa, boolean",
      "reference": "ACI 318-19 Commentary §R25.4 — large bars in low-strength concrete require excessive development lengths; minimum f'_c recommendation"
    }
  ],

  "engine_rules": {
    "standards": ["ACI 318-19 §25.4, §25.5", "EN 1992-1-1:2004 §8.4, §8.7", "ACI 318-19 §18.8 (seismic)", "ISO 6935-2:2015", "BS 8110-1:1997 §3.12"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "cover_mm < bar_diameter_mm", "action": "BLOCK", "message": "Concrete cover less than bar diameter: ACI §20.6.1 minimum cover requirement violated — fire resistance, corrosion protection, and bond transfer all inadequate" },
        { "id": "V2", "condition": "bar_spacing_mm < bar_diameter_mm", "action": "WARN", "message": "Clear bar spacing less than bar diameter: ACI §25.2.1 minimum spacing violated — concrete cannot flow between bars; splitting failure and poor consolidation" },
        { "id": "V3", "condition": "load_type === 'seismic' && fc_prime_mpa < 25", "action": "WARN", "message": "Seismic splices in low-strength concrete: ACI 318 §18.12.2 recommends f'_c ≥ 25 MPa in special moment frames; low concrete strength requires significantly longer lap lengths" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "l_governing_mm > 60 * bar_diameter_mm", "severity": "WARNING", "message": "Lap splice > 60 bar diameters: very long splice — consider mechanical couplers (ISO 15835-1) or welded splices to reduce congestion; check if staggering splices is feasible" },
      { "id": "W2", "trigger": "load_type === 'seismic' && bar_diameter_mm > 28", "severity": "CRITICAL", "message": "Large bar (d_b > 28 mm) in seismic zone: ACI 318 §18.8.2.1 prohibits lap splices within beam-column joints and in potential plastic hinge zones — use mechanical couplers" },
      { "id": "W3", "trigger": "transverse_reinforcement === 'none' && load_type === 'tension'", "severity": "WARNING", "message": "No transverse reinforcement on tension splice: splitting failure risk — provide minimum ties per ACI §25.5.2; minimum 2 ties within splice length at third-points" },
      { "id": "W4", "trigger": "!fc_adequate && bar_diameter_mm >= 25", "severity": "WARNING", "message": "Concrete strength below recommended for large bars: development length will be excessive and bond stress may cause splitting — upgrade to recommended f'_c" },
      { "id": "W5", "trigger": "lbd_EC2_mm > ld_ACI_mm * 1.5", "severity": "INFO", "message": "EC2 development length > 1.5× ACI value: significant code disparity — verify which standard governs for the project; EC2 tends to be more conservative for poor cover conditions" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// END — Sequence 89–93 (PRO_096 → PRO_100)
// Next: PRO_101 → PRO_105 (Sequence 94–98)
// ═══════════════════════════════════════════════════════════════════════════
