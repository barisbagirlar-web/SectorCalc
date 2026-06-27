// ═══════════════════════════════════════════════════════════════════════════
// SectorCalc Pro — Industrial-Grade Tool Schemas
// Sequence: 94 → 98  (PRO_101 · PRO_102 · PRO_103 · PRO_104 · PRO_105)
// Language: Pure Technical English
// Target Users: Structural engineers, CNC machinists, fitters, welders,
//               construction & steel fabrication technicians, surveyors
// Quality Level: TÜV-certifiable · ISO 9001 · ECMI-aligned · Global market
// Standards: ISO / EN / ASME / DIN / AWS / BS referenced per tool
// ═══════════════════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────────────────
// TOOL 94 / PRO_101
// Hollow Section (RHS/SHS/CHS) Beam-Column Combined Loading Check
// Standards: EN 1993-1-1 (EC3) · AISC 360-22 · CIDECT Design Guide 2
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_101",
  "tool_name": "Hollow Section (RHS/SHS/CHS) Beam-Column — Combined Axial + Bending Interaction Check",
  "category": "Structural Steel / Steel Fabrication",
  "scope": "single_operation",
  "primary_operation": "hollow_section_beam_column",

  "inputs": [
    {
      "id": "section_type",
      "name": "Hollow Section Type",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "RHS — Rectangular Hollow Section", "value": "RHS" },
        { "label": "SHS — Square Hollow Section", "value": "SHS" },
        { "label": "CHS — Circular Hollow Section", "value": "CHS" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "RHS"
    },
    {
      "id": "N_Ed_kn",
      "name": "Factored Axial Load (N_Ed / P_u)",
      "unit": "kN",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0,
      "absolute_max": 50000,
      "note": "Positive = compression; negative = tension"
    },
    {
      "id": "M_Ed_knm",
      "name": "Factored Bending Moment (M_Ed / M_u)",
      "unit": "kN·m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0,
      "absolute_max": 10000
    },
    {
      "id": "A_mm2",
      "name": "Cross-Sectional Area (A)",
      "unit": "mm²",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 100,
      "absolute_max": 100000,
      "note": "From CIDECT/manufacturer tables: RHS 200×100×8 → A=4448 mm²; SHS 150×150×8 → A=4448 mm²"
    },
    {
      "id": "Wpl_y_cm3",
      "name": "Plastic Section Modulus About Bending Axis (W_pl,y)",
      "unit": "cm³",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 1,
      "absolute_max": 100000
    },
    {
      "id": "I_y_cm4",
      "name": "Second Moment of Area About Bending Axis (I_y)",
      "unit": "cm⁴",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 1,
      "absolute_max": 5000000
    },
    {
      "id": "fy_mpa",
      "name": "Steel Yield Strength (f_y)",
      "unit": "MPa",
      "type": "enum",
      "options": [
        { "label": "S235 — 235 MPa", "value": 235 },
        { "label": "S275 — 275 MPa", "value": 275 },
        { "label": "S355 — 355 MPa", "value": 355 },
        { "label": "S420 — 420 MPa", "value": 420 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 355
    },
    {
      "id": "L_eff_m",
      "name": "Effective Buckling Length (L_cr)",
      "unit": "m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.2,
      "absolute_max": 30
    },
    {
      "id": "i_y_mm",
      "name": "Radius of Gyration About Bending Axis (i_y)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 5,
      "absolute_max": 300
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Compression Resistance (N_Rd)",
      "expression": "NRd_kn = A_mm2 * fy_mpa / (1.0 * 1000)",
      "output": "NRd_kn",
      "unit": "kN",
      "reference": "EC3 §6.2.4 — N_c,Rd = A·f_y/γ_M0; γ_M0=1.0; CHS/RHS Class 1/2 cross-section"
    },
    {
      "id": "F2",
      "name": "Non-Dimensional Slenderness (λ̄) & Buckling Reduction (χ)",
      "expression": "lambda_bar = (L_eff_m * 1000 / i_y_mm) / (Math.PI * Math.sqrt(210000 / fy_mpa)); phi_buck = 0.5 * (1 + 0.21 * (lambda_bar - 0.2) + Math.pow(lambda_bar, 2)); chi = Math.min(1.0, 1 / (phi_buck + Math.sqrt(Math.pow(phi_buck, 2) - Math.pow(lambda_bar, 2))))",
      "output": "lambda_bar, chi",
      "unit": "dimensionless",
      "reference": "EC3 §6.3.1.2 — λ̄ = (L_cr/i)/(π√(E/f_y)); buckling curve 'a' (α=0.21) for hollow sections"
    },
    {
      "id": "F3",
      "name": "Flexural Buckling Resistance (N_b,Rd)",
      "expression": "NbRd_kn = chi * A_mm2 * fy_mpa / 1000",
      "output": "NbRd_kn",
      "unit": "kN",
      "reference": "EC3 §6.3.1.1 — N_b,Rd = χ·A·f_y/γ_M1; γ_M1=1.0"
    },
    {
      "id": "F4",
      "name": "Moment Resistance (M_Rd)",
      "expression": "MRd_knm = Wpl_y_cm3 * 1e3 * fy_mpa / 1e6",
      "output": "MRd_knm",
      "unit": "kN·m",
      "reference": "EC3 §6.2.5 — M_pl,Rd = W_pl,y·f_y/γ_M0; Class 1/2 section"
    },
    {
      "id": "F5",
      "name": "EC3 Combined Interaction Check (Eq.6.61 / 6.62)",
      "expression": "k_yy = 1 + (lambda_bar - 0.2) * N_Ed_kn / NbRd_kn; k_yy = Math.min(k_yy, 1.0 + 0.8 * N_Ed_kn / NbRd_kn); UC_6_61 = N_Ed_kn / NbRd_kn + k_yy * M_Ed_knm / MRd_knm",
      "output": "UC_6_61, k_yy",
      "unit": "dimensionless",
      "reference": "EC3 §6.3.3 Eq.(6.61) — N_Ed/N_b,Rd + k_yy·M_y,Ed/M_y,Rd ≤ 1.0"
    },
    {
      "id": "F6",
      "name": "Cross-Section Check (Eq.6.31) — Local Plasticity",
      "expression": "UC_cross = N_Ed_kn / NRd_kn + M_Ed_knm / MRd_knm",
      "output": "UC_cross",
      "unit": "dimensionless",
      "reference": "EC3 §6.2.9.1 simplified: N_Ed/N_c,Rd + M_Ed/M_Rd ≤ 1.0 for Class 1/2; conservative"
    }
  ],

  "engine_rules": {
    "standards": ["EN 1993-1-1:2022 §6.2.9, §6.3.1, §6.3.3", "CIDECT Design Guide 2 (2nd Ed.)", "AISC 360-22 Chapter H", "EN 10219-1:2006"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "UC_6_61 > 1.0", "action": "BLOCK", "message": "Beam-column interaction check failed (EC3 Eq.6.61 > 1.0) — increase section size, reduce effective length, or reduce applied loads" },
        { "id": "V2", "condition": "UC_cross > 1.0", "action": "BLOCK", "message": "Cross-section combined loading check failed — section yields locally; use plastic moment capacity only if section is Class 1" },
        { "id": "V3", "condition": "lambda_bar > 2.0", "action": "WARN", "message": "Non-dimensional slenderness > 2.0: highly slender — buckling governs heavily; N_b,Rd < 0.25·N_Rd; intermediate bracing strongly recommended" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "UC_6_61 > 0.90 || UC_cross > 0.90", "severity": "CRITICAL", "message": "Utilisation ratio > 90%: minimal safety reserve — verify load combinations include all accidental and wind/seismic actions; do not proceed without structural engineer sign-off" },
      { "id": "W2", "trigger": "N_Ed_kn > NbRd_kn * 0.7 && M_Ed_knm > MRd_knm * 0.3", "severity": "WARNING", "message": "High axial + moderate moment: k_yy amplification significant — consider moment connection detail to reduce effective eccentricity" },
      { "id": "W3", "trigger": "lambda_bar > 1.5 && section_type === 'CHS'", "severity": "INFO", "message": "Slender CHS column: LTB does not apply for CHS — only flexural buckling governs; CHS advantage over open sections is fully realised here" },
      { "id": "W4", "trigger": "L_eff_m > 8 && fy_mpa === 235", "severity": "INFO", "message": "Long column in S235: consider S355 to reduce section size — same χ at lower weight for slenderness-governed design" },
      { "id": "W5", "trigger": "chi < 0.5", "severity": "CRITICAL", "message": "Buckling factor χ < 0.5: more than 50% of section capacity lost to buckling — verify effective length assumptions; pinned connections often provide partial restraint; consider intermediate bracing" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 95 / PRO_102
// Precision Boring & Reaming — Dimensional Tolerance, Fit & Surface Finish
// Standards: ISO 286-1 · ISO 286-2 · ISO 2768 · DIN 7162 · ASME B4.1
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_102",
  "tool_name": "Precision Boring & Reaming — ISO Fit Selection, Tolerance Band & Achievable Surface Roughness",
  "category": "CNC Machining / Precision Engineering / Metrology",
  "scope": "single_operation",
  "primary_operation": "boring_reaming",

  "inputs": [
    {
      "id": "nominal_diameter_mm",
      "name": "Nominal Bore Diameter (D)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 1,
      "absolute_max": 3150,
      "note": "ISO 286-1 diameter steps: ≤3 / 3–6 / 6–10 / 10–18 / 18–30 / 30–50 / 50–80 / 80–120 mm"
    },
    {
      "id": "ISO_hole_tolerance",
      "name": "ISO Hole Tolerance Grade (IT Grade)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "IT5 — Precision bearings, gauge bores (Ra ≤ 0.4 µm)", "value": 5 },
        { "label": "IT6 — General precision, ball bearings (Ra ≤ 0.8 µm)", "value": 6 },
        { "label": "IT7 — Standard fits, sliding/location (Ra ≤ 1.6 µm)", "value": 7 },
        { "label": "IT8 — Medium precision, loose fits (Ra ≤ 3.2 µm)", "value": 8 },
        { "label": "IT9 — Coarse press fits, rough bores (Ra ≤ 6.3 µm)", "value": 9 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 7
    },
    {
      "id": "hole_fundamental_deviation",
      "name": "Hole Fundamental Deviation (Position Code)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "H — Zero lower deviation (standard hole basis)", "value": "H" },
        { "label": "G — Small positive clearance", "value": "G" },
        { "label": "F — Running fits", "value": "F" },
        { "label": "N — Transition, interference possible", "value": "N" },
        { "label": "P — Light press fit", "value": "P" },
        { "label": "K — Transition fit", "value": "K" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "H"
    },
    {
      "id": "shaft_designation",
      "name": "Mating Shaft Designation (e.g. h6, f7, k6)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "h6 — Precision sliding / location clearance", "value": "h6" },
        { "label": "h7 — Standard clearance fit", "value": "h7" },
        { "label": "f7 — Easy running fit", "value": "f7" },
        { "label": "g6 — Close running fit", "value": "g6" },
        { "label": "k6 — Transition / light press", "value": "k6" },
        { "label": "p6 — Press fit (permanent assembly)", "value": "p6" },
        { "label": "s6 — Force fit", "value": "s6" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "h6"
    },
    {
      "id": "boring_tool",
      "name": "Boring / Reaming Operation",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Fine boring (CBN/carbide) — IT5–IT6, Ra 0.2–0.8 µm", "value": "fine_boring" },
        { "label": "Reaming (HSS/carbide) — IT6–IT7, Ra 0.4–1.6 µm", "value": "reaming" },
        { "label": "Rough boring — IT9–IT11, Ra 3.2–12.5 µm", "value": "rough_boring" },
        { "label": "Honing after boring — IT5–IT6, Ra 0.05–0.4 µm", "value": "honing" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "reaming"
    },
    {
      "id": "Vc_m_min",
      "name": "Cutting Speed (V_c)",
      "unit": "m/min",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 80,
      "absolute_min": 5,
      "absolute_max": 500,
      "note": "Reaming steel: 8–15 m/min; boring steel: 60–180 m/min; boring aluminium: 200–500 m/min"
    },
    {
      "id": "feed_per_rev_mm",
      "name": "Feed per Revolution (f_r)",
      "unit": "mm/rev",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 0.1,
      "absolute_min": 0.005,
      "absolute_max": 2.0,
      "note": "Reaming: 0.1–0.5 mm/rev; fine boring: 0.03–0.15 mm/rev; rough boring: 0.2–1.0 mm/rev"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "IT Tolerance Value (IT) for Nominal Diameter",
      "expression": "D_mean = Math.sqrt(Math.max(1, nominal_diameter_mm - 3) * nominal_diameter_mm); i_micron = 0.45 * Math.pow(D_mean, 1/3) + 0.001 * D_mean; const IT_factor = {5:7, 6:10, 7:16, 8:25, 9:40}; IT_um = IT_factor[ISO_hole_tolerance] * i_micron",
      "output": "IT_um",
      "unit": "µm",
      "reference": "ISO 286-1:2010 §4.2 — IT = c × i; i = 0.45·D_mean^(1/3) + 0.001·D_mean; IT7 factor = 16"
    },
    {
      "id": "F2",
      "name": "Hole Limits (Upper and Lower Deviation for H-basis)",
      "expression": "EI_um = 0; ES_um = IT_um; bore_min_mm = nominal_diameter_mm + EI_um/1000; bore_max_mm = nominal_diameter_mm + ES_um/1000",
      "output": "bore_min_mm, bore_max_mm",
      "unit": "mm",
      "reference": "ISO 286-1 — H basis: EI = 0 (lower deviation); ES = +IT; bore Φ_min to Φ_max"
    },
    {
      "id": "F3",
      "name": "Typical Shaft Tolerance Band (for common fits)",
      "expression": "const shaft_offsets = {h6:{ei:-IT_um*0.4, es:0}, h7:{ei:-IT_um*0.6, es:0}, f7:{ei:-IT_um*1.6, es:-IT_um}, g6:{ei:-IT_um*0.7, es:-IT_um*0.3}, k6:{ei:0, es:IT_um*0.5}, p6:{ei:IT_um*0.5, es:IT_um*1.2}, s6:{ei:IT_um*1.2, es:IT_um*2.0}}; const sf = shaft_offsets[shaft_designation]; shaft_min_mm = nominal_diameter_mm + sf.ei/1000; shaft_max_mm = nominal_diameter_mm + sf.es/1000",
      "output": "shaft_min_mm, shaft_max_mm",
      "unit": "mm",
      "reference": "ISO 286-1 Table 3 — shaft fundamental deviations; approximate for common designations"
    },
    {
      "id": "F4",
      "name": "Fit Limits — Maximum Clearance & Maximum Interference",
      "expression": "max_clearance_um = (bore_max_mm - shaft_min_mm) * 1000; min_clearance_um = (bore_min_mm - shaft_max_mm) * 1000",
      "output": "max_clearance_um, min_clearance_um",
      "unit": "µm",
      "reference": "Clearance > 0 = clearance fit; < 0 = interference; between = transition — ISO 286-1 §3"
    },
    {
      "id": "F5",
      "name": "Spindle Speed & Table Feed Rate",
      "expression": "n_rpm = Vc_m_min * 1000 / (Math.PI * nominal_diameter_mm); Vf_mm_min = n_rpm * feed_per_rev_mm",
      "output": "n_rpm, Vf_mm_min",
      "unit": "rpm, mm/min",
      "reference": "n = V_c × 1000 / (π × D); V_f = n × f_r — machining parameter calculation"
    },
    {
      "id": "F6",
      "name": "Achievable Ra & Process Capability Check",
      "expression": "const Ra_cap = {fine_boring:[0.2,0.8], reaming:[0.4,1.6], rough_boring:[3.2,12.5], honing:[0.05,0.4]}; const rc = Ra_cap[boring_tool]; Ra_achievable_min=rc[0]; Ra_achievable_max=rc[1]; const IT_Ra_map = {5:0.4, 6:0.8, 7:1.6, 8:3.2, 9:6.3}; Ra_req_max = IT_Ra_map[ISO_hole_tolerance]; process_capable = Ra_achievable_max <= Ra_req_max",
      "output": "Ra_achievable_min, Ra_achievable_max, process_capable",
      "unit": "µm, µm, boolean",
      "reference": "ISO 2768 / Kalpakjian §26 — surface roughness vs IT grade correlation; process must achieve Ra ≤ Ra_req"
    }
  ],

  "engine_rules": {
    "standards": ["ISO 286-1:2010", "ISO 286-2:2010 (preferred fits)", "ISO 2768-1:1989", "ASME B4.1-1967 (R2018)", "DIN 7162:1963"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "!process_capable", "action": "WARN", "message": "Selected boring/reaming process cannot achieve required Ra for specified IT grade — upgrade to finer process (e.g., add honing after boring for IT5/IT6)" },
        { "id": "V2", "condition": "min_clearance_um > 200 && shaft_designation !== 'f7'", "action": "WARN", "message": "Minimum clearance > 200 µm: very loose fit — verify shaft designation is correct; this may cause bearing misalignment or excessive play" },
        { "id": "V3", "condition": "Vf_mm_min > 500 && boring_tool === 'reaming'", "action": "WARN", "message": "Table feed > 500 mm/min for reaming: excessive — maximum feed for reaming is typically 150 mm/min; higher feeds cause chatter marks and dimensional errors" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "min_clearance_um < -50 && shaft_designation !== 'p6' && shaft_designation !== 's6'", "severity": "CRITICAL", "message": "Unexpected interference fit: verify shaft designation — transition fits (k6) can have interference but assembly may require press or thermal expansion method" },
      { "id": "W2", "trigger": "IT_um < 10 && boring_tool === 'rough_boring'", "severity": "CRITICAL", "message": "IT tolerance < 10 µm required but rough boring selected: this process cannot hold ≤ IT5 — mandatory fine boring or honing; tool setup and thermal stabilisation critical" },
      { "id": "W3", "trigger": "nominal_diameter_mm > 500 && ISO_hole_tolerance <= 6", "severity": "WARNING", "message": "Large bore (D > 500 mm) with tight IT6 tolerance: thermal expansion alone can exceed IT value — workpiece must be measured at 20°C ±1°C per ISO 1 temperature standard" },
      { "id": "W4", "trigger": "Vc_m_min > 150 && boring_tool === 'reaming'", "severity": "WARNING", "message": "Reaming speed > 150 m/min: built-up edge and chatter risk — reaming is inherently a low-speed finishing process; reduce to 8–15 m/min for steel, 30–50 m/min for aluminium" },
      { "id": "W5", "trigger": "max_clearance_um - min_clearance_um > IT_um * 3", "severity": "INFO", "message": "Wide clearance band relative to IT: verify mating shaft tolerance is correctly specified — total system clearance variation may affect running accuracy or press-fit security" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 96 / PRO_103
// Welded Steel Connection — T-Joint & Angle Bracket Moment Capacity
// Standards: EN 1993-1-8 · AISC Design Guide 16 · AWS D1.1 · SCI P207
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_103",
  "tool_name": "Welded T-Joint & Angle Bracket — Weld Group Moment, Shear & Torsion Capacity",
  "category": "Steel Fabrication / Structural Connections",
  "scope": "single_operation",
  "primary_operation": "welded_connection_moment",

  "inputs": [
    {
      "id": "weld_leg_mm",
      "name": "Fillet Weld Leg Size (a_leg)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 3,
      "absolute_max": 30
    },
    {
      "id": "weld_pattern",
      "name": "Weld Group Pattern",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "3-sided rectangle (top + 2 sides, open bottom)", "value": "3_side" },
        { "label": "4-sided rectangle (all sides)", "value": "4_side" },
        { "label": "2 vertical lines (parallel welds)", "value": "2_vert" },
        { "label": "Bracket — two horizontal lines", "value": "2_horiz" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "4_side"
    },
    {
      "id": "plate_width_mm",
      "name": "Connection Plate Width (b)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 40,
      "absolute_max": 1000
    },
    {
      "id": "plate_height_mm",
      "name": "Connection Plate Height (d)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 40,
      "absolute_max": 1000
    },
    {
      "id": "V_Ed_kn",
      "name": "Applied Shear Force (V_Ed)",
      "unit": "kN",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0,
      "absolute_max": 5000
    },
    {
      "id": "M_Ed_knm",
      "name": "Applied In-Plane Bending Moment (M_Ed)",
      "unit": "kN·m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0,
      "absolute_max": 2000
    },
    {
      "id": "eccentricity_mm",
      "name": "Load Eccentricity from Weld Group Centroid (e)",
      "unit": "mm",
      "type": "number",
      "required": false,
      "confidence_label": "GÜÇLÜ",
      "default": 0,
      "absolute_min": 0,
      "absolute_max": 500,
      "note": "Bracket with standoff distance: e = horizontal distance from load to weld group centroid"
    },
    {
      "id": "filler_fexx_mpa",
      "name": "Filler Metal Classification Strength (F_EXX)",
      "unit": "MPa",
      "type": "enum",
      "options": [
        { "label": "E70 / ER70S — 483 MPa (most common)", "value": 483 },
        { "label": "E80 — 552 MPa", "value": 552 },
        { "label": "E90 — 621 MPa", "value": 621 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 483
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Weld Group Throat Area & Properties",
      "expression": "a_throat = weld_leg_mm * 0.707; const patterns = {three_side: {A: (2*plate_height_mm + plate_width_mm)*a_throat, Iy: (2*Math.pow(plate_height_mm,3)/12 + plate_width_mm*Math.pow(plate_height_mm/2,2))*a_throat/1e6}, four_side: {A: 2*(plate_width_mm+plate_height_mm)*a_throat, Iy: (2*plate_width_mm*Math.pow(plate_height_mm/2,2) + 2*Math.pow(plate_height_mm,3)/12)*a_throat/1e6}}; const wp = patterns['four_side']; Aw_mm2 = 2*(plate_width_mm + plate_height_mm) * a_throat; Iy_mm4 = (2*plate_width_mm*Math.pow(plate_height_mm,2)/4 + 2*Math.pow(plate_height_mm,3)/12) * a_throat",
      "output": "Aw_mm2, Iy_mm4",
      "unit": "mm², mm⁴",
      "reference": "Weld group elastic properties — Blodgett 'Design of Welded Structures' §7.4; AISC DG16 §3.2"
    },
    {
      "id": "F2",
      "name": "Allowable Weld Shear Stress (f_w,allow)",
      "expression": "f_w_allow_mpa = 0.75 * 0.6 * filler_fexx_mpa",
      "output": "f_w_allow_mpa",
      "unit": "MPa",
      "reference": "AWS D1.1-2020 §2.4.1 / AISC 360-22 §J2.4 — φ·f_w = 0.75 × 0.6·F_EXX on effective throat area"
    },
    {
      "id": "F3",
      "name": "Direct Shear Stress in Weld (f_v)",
      "expression": "fv_mpa = V_Ed_kn * 1000 / Aw_mm2",
      "output": "fv_mpa",
      "unit": "MPa",
      "reference": "f_v = V / A_w — direct shear on weld throat"
    },
    {
      "id": "F4",
      "name": "Bending Stress in Weld from In-Plane Moment (f_b)",
      "expression": "M_total_Nmm = (M_Ed_knm + V_Ed_kn * eccentricity_mm / 1000) * 1e6; fb_mpa = M_total_Nmm * (plate_height_mm / 2) / Iy_mm4",
      "output": "fb_mpa",
      "unit": "MPa",
      "reference": "f_b = M × c / I_y; c = d/2 (extreme fibre distance) — elastic weld group analysis per Blodgett §7.4"
    },
    {
      "id": "F5",
      "name": "Resultant Weld Stress & Utilisation (Vector Sum)",
      "expression": "f_resultant_mpa = Math.sqrt(Math.pow(fv_mpa, 2) + Math.pow(fb_mpa, 2)); UC_weld = f_resultant_mpa / f_w_allow_mpa",
      "output": "f_resultant_mpa, UC_weld",
      "unit": "MPa, dimensionless",
      "reference": "Vector sum: f_res = √(f_v² + f_b²); UC = f_res / f_allow — elastic vector method per AISC DG16"
    },
    {
      "id": "F6",
      "name": "Required Weld Leg for Demand (a_required)",
      "expression": "a_req_mm = Math.ceil(weld_leg_mm * UC_weld / 0.707 * 0.707)",
      "output": "a_req_mm",
      "unit": "mm",
      "reference": "Required leg = current leg × UC_weld (if UC > 1, scale up proportionally)"
    }
  ],

  "engine_rules": {
    "standards": ["AISC Design Guide 16 (Flush and Extended End-Plate Moment Connections)", "AWS D1.1-2020 §2.4", "EN 1993-1-8:2005 §4.5", "SCI P207:1995"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "UC_weld > 1.0", "action": "BLOCK", "message": "Weld group overstressed — increase weld leg size, extend weld pattern to 4-sided, or reduce applied loads" },
        { "id": "V2", "condition": "weld_leg_mm < 5 && M_Ed_knm > 5", "action": "WARN", "message": "Small weld leg under significant moment: moment arm is short — minimum 6 mm leg recommended for moment connections; quality control of small welds is difficult" },
        { "id": "V3", "condition": "eccentricity_mm > plate_height_mm && V_Ed_kn > 20", "action": "WARN", "message": "Large eccentricity relative to plate height: torsion-like loading — verify weld group polar moment of inertia; instantaneous centre of rotation method may be required for high eccentricity" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "UC_weld > 0.85", "severity": "WARNING", "message": "Weld utilisation > 85%: increase leg by 2 mm increments — note that a 25% increase in leg size (e.g., 8 → 10 mm) increases capacity by 25% for the same pattern" },
      { "id": "W2", "trigger": "fb_mpa > fv_mpa * 3", "severity": "INFO", "message": "Bending stress dominates (>3× shear): verify that weld configuration is optimised — adding weld at extreme fibres (top/bottom) is most efficient for moment resistance" },
      { "id": "W3", "trigger": "weld_pattern === '2_vert' && M_Ed_knm > 0", "severity": "WARNING", "message": "Two vertical welds under moment: very low horizontal polar moment — moment creates high horizontal force with no top/bottom horizontal weld to resist it; switch to 4-sided weld pattern" },
      { "id": "W4", "trigger": "eccentricity_mm > 200 && V_Ed_kn > 50", "severity": "CRITICAL", "message": "Large bracket eccentricity (> 200 mm) with high shear: significant eccentric moment — verify weld group using instantaneous centre method per AISC Manual Table 8-4 for accurate capacity" },
      { "id": "W5", "trigger": "a_req_mm > plate_width_mm * 0.5 / 0.707", "severity": "WARNING", "message": "Required weld leg exceeds half the plate thickness: weld will be as thick as the plate — verify plate adequate strength and consider full-penetration butt weld instead" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 97 / PRO_104
// Masonry Wall — Axial Load, Eccentricity & Slenderness Capacity
// Standards: EN 1996-1-1 (EC6) · ACI 530-13 · BS 5628-1 · ASTM C90
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_104",
  "tool_name": "Masonry Load-Bearing Wall — Axial Capacity, Slenderness Reduction & Eccentricity Check",
  "category": "Construction / Masonry Structures",
  "scope": "single_operation",
  "primary_operation": "masonry_wall",

  "inputs": [
    {
      "id": "wall_height_m",
      "name": "Clear Wall Height (h)",
      "unit": "m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.5,
      "absolute_max": 20
    },
    {
      "id": "wall_thickness_mm",
      "name": "Wall Thickness (t)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 75,
      "absolute_max": 500,
      "note": "Standard: 100 mm block, 140 mm, 190 mm, 200 mm, 215 mm (brick), 250 mm, 300 mm"
    },
    {
      "id": "fk_mpa",
      "name": "Masonry Characteristic Compressive Strength (f_k)",
      "unit": "MPa",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 5.0,
      "absolute_min": 1.0,
      "absolute_max": 30.0,
      "note": "EN 1996 Table NA.1: 100 mm dense block + M4 mortar → f_k ≈ 3.5–6 MPa; engineering brick + M12 → 8–15 MPa"
    },
    {
      "id": "gamma_M",
      "name": "Partial Safety Factor for Masonry (γ_M)",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "γ_M = 1.5 — Category I units, controlled site", "value": 1.5 },
        { "label": "γ_M = 2.0 — Category II units, standard site", "value": 2.0 },
        { "label": "γ_M = 2.5 — Non-classified / existing masonry", "value": 2.5 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 2.0
    },
    {
      "id": "N_Ed_kn_m",
      "name": "Design Vertical Load per Unit Length of Wall (N_Ed)",
      "unit": "kN/m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.1,
      "absolute_max": 5000
    },
    {
      "id": "eccentricity_mm",
      "name": "Load Eccentricity at Mid-Height (e_mid)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 10,
      "absolute_min": 0,
      "absolute_max": 200,
      "note": "EN 1996-1-1 §6.1.2.2: e_mid = e_i + e_hi; e_i = accidental eccentricity = h_eff/450; e_hi from horizontal loads"
    },
    {
      "id": "end_condition",
      "name": "Wall End / Support Restraint Condition",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Pinned top and bottom (h_eff = 1.0·h)", "value": 1.0 },
        { "label": "Fixed bottom, pinned top (h_eff = 0.75·h)", "value": 0.75 },
        { "label": "Fixed top and bottom (h_eff = 0.75·h EC6)", "value": 0.75 },
        { "label": "Free top, fixed bottom / cantilever (h_eff = 2.0·h)", "value": 2.0 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": 0.75
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Effective Height & Slenderness Ratio (λ)",
      "expression": "h_eff_m = wall_height_m * end_condition; lambda = h_eff_m * 1000 / wall_thickness_mm",
      "output": "h_eff_m, lambda",
      "unit": "m, dimensionless",
      "reference": "EN 1996-1-1:2005 §5.5.1.2 — h_eff = ρ_n × h; EC6 §6.1.2.2 maximum λ = 27"
    },
    {
      "id": "F2",
      "name": "Design Compressive Strength (f_d)",
      "expression": "fd_mpa = fk_mpa / gamma_M",
      "output": "fd_mpa",
      "unit": "MPa",
      "reference": "EC6 §6.1.2.1 — f_d = f_k / γ_M; design strength accounting for workmanship and material class"
    },
    {
      "id": "F3",
      "name": "Capacity Reduction Factor for Slenderness (Φ_m)",
      "expression": "e_rel = eccentricity_mm / wall_thickness_mm; A_phi = 1 - 2 * e_rel; Phi_m = Math.max(A_phi * (1 - (lambda/140)^2), 0.0)",
      "output": "Phi_m",
      "unit": "dimensionless",
      "reference": "EN 1996-1-1 §6.1.2.2 Eq.(G.2) — Φ_m = (1−2e/t)(1−(λ/140)²); Annex G simplified method"
    },
    {
      "id": "F4",
      "name": "Design Vertical Load Resistance (N_Rd)",
      "expression": "NRd_kn_m = Phi_m * wall_thickness_mm * fd_mpa",
      "output": "NRd_kn_m",
      "unit": "kN/m",
      "reference": "EC6 §6.1.2.1 — N_Rd = Φ_m × t × f_d (per unit length); t in mm, f_d in MPa → kN/m"
    },
    {
      "id": "F5",
      "name": "Demand-Capacity Ratio (DCR) & Utilisation",
      "expression": "DCR = N_Ed_kn_m / NRd_kn_m; e_limit_mm = wall_thickness_mm / 3",
      "output": "DCR, e_limit_mm",
      "unit": "dimensionless, mm",
      "reference": "DCR ≤ 1.0 required; e_limit = t/3 per EC6 §6.1.2.2 — maximum allowable eccentricity"
    },
    {
      "id": "F6",
      "name": "Minimum Required Wall Thickness for Load (t_req)",
      "expression": "t_req_mm = Math.ceil(N_Ed_kn_m / (Phi_m * fd_mpa))",
      "output": "t_req_mm",
      "unit": "mm",
      "reference": "Rearranged from N_Rd: t_req = N_Ed / (Φ_m × f_d); round up to standard block size"
    }
  ],

  "engine_rules": {
    "standards": ["EN 1996-1-1:2005 (EC6) §5.5, §6.1", "ACI 530-13 §2.3", "BS 5628-1:2005 §28", "EN 771-3 (aggregate concrete masonry units)"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "DCR > 1.0", "action": "BLOCK", "message": "Wall load capacity exceeded — increase thickness, use higher-strength masonry units, or reduce applied load" },
        { "id": "V2", "condition": "lambda > 27", "action": "BLOCK", "message": "Slenderness ratio > 27: EC6 §6.1.2.2 maximum limit — wall is too slender; add pilasters, returns, or intermediate lateral supports" },
        { "id": "V3", "condition": "eccentricity_mm > wall_thickness_mm / 3", "action": "WARN", "message": "Eccentricity exceeds t/3: EC6 §6.1.2.2 limit — Φ_m approaches zero; review structural layout to reduce eccentricity; consider larger wall thickness" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "lambda > 20 && end_condition === 1.0", "severity": "WARNING", "message": "High slenderness with pinned ends: Φ_m strongly reduced — adding simple floor/roof tie at top converts to fixed-pin (ρ=0.75), increasing N_Rd by ~25%" },
      { "id": "W2", "trigger": "fk_mpa < 3.5 && N_Ed_kn_m > 100", "severity": "WARNING", "message": "Low-strength masonry under significant load: specify minimum M4 mortar and Category I units with testing — avoid using generic f_k without material testing on site" },
      { "id": "W3", "trigger": "DCR > 0.80", "severity": "WARNING", "message": "Utilisation > 80%: marginal capacity for concentrated loads (beam bearings) — verify bearing stress at load introduction point per EC6 §6.1.3" },
      { "id": "W4", "trigger": "wall_thickness_mm < 100 && N_Ed_kn_m > 50", "severity": "CRITICAL", "message": "Thin wall (< 100 mm) under significant vertical load: structural masonry requires minimum 100 mm; check if wall is load-bearing or partition — reclassify if non-structural" },
      { "id": "W5", "trigger": "eccentricity_mm > wall_thickness_mm * 0.25 && lambda > 18", "severity": "CRITICAL", "message": "Combined high eccentricity + slenderness: double penalty on Φ_m — capacity is severely reduced; detailed second-order analysis required per EC6 Annex G" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 98 / PRO_105
// CNC Grinding — Wheel Speed, Material Removal Rate, G-Ratio & Thermal Check
// Standards: ANSI B7.1 · EN 13236 · ISO 525 · Grinding Wheel Manufacturers Association
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_105",
  "tool_name": "CNC Cylindrical Grinding — Wheel Speed, Q-Prime MRR, G-Ratio & Grinding Burn Prevention",
  "category": "CNC Machining / Precision Grinding",
  "scope": "single_operation",
  "primary_operation": "cylindrical_grinding",

  "inputs": [
    {
      "id": "wheel_diameter_mm",
      "name": "Grinding Wheel Outside Diameter (D_s)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 100,
      "absolute_max": 750,
      "note": "Standard sizes: 200, 250, 300, 350, 400, 450, 500 mm for cylindrical OD grinding"
    },
    {
      "id": "wheel_speed_rpm",
      "name": "Wheel Rotational Speed (n_s)",
      "unit": "rpm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 500,
      "absolute_max": 10000,
      "note": "Never exceed wheel's maximum RPM stamped on blotter — ANSI B7.1 §6.3 mandatory check"
    },
    {
      "id": "workpiece_diameter_mm",
      "name": "Workpiece Diameter (D_w)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 5,
      "absolute_max": 1000
    },
    {
      "id": "workpiece_speed_rpm",
      "name": "Workpiece Rotational Speed (n_w)",
      "unit": "rpm",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 200,
      "absolute_min": 10,
      "absolute_max": 2000,
      "note": "Typical OD grinding: 100–400 rpm; higher speeds increase temperature and heat generation"
    },
    {
      "id": "infeed_mm_pass",
      "name": "Radial Infeed per Pass (a_e)",
      "unit": "mm/pass",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.001,
      "absolute_max": 1.0,
      "note": "Roughing: 0.02–0.05 mm/pass; semi-finish: 0.005–0.02; finish: 0.001–0.005; sparking-out: 0"
    },
    {
      "id": "traverse_feed_mm_rev",
      "name": "Axial Traverse Feed per Workpiece Revolution (f_a)",
      "unit": "mm/rev",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 2.0,
      "absolute_min": 0.1,
      "absolute_max": 20,
      "note": "f_a = fraction of wheel width B: roughing ≈ 0.5–0.8B; finishing ≈ 0.1–0.3B"
    },
    {
      "id": "wheel_grade_hardness",
      "name": "Wheel Grade / Hardness",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "F/G — Soft (vitrified, soft workpieces, heavy stock)", "value": "soft" },
        { "label": "H/I/J — Medium-soft", "value": "medium_soft" },
        { "label": "K/L/M — Medium (general purpose)", "value": "medium" },
        { "label": "N/O/P — Medium-hard (hard materials, small contact)", "value": "medium_hard" },
        { "label": "Q/R/S — Hard (fine finish, very hard materials)", "value": "hard" }
      ],
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": "medium"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Wheel Peripheral Speed (V_s)",
      "expression": "Vs_m_s = Math.PI * wheel_diameter_mm / 1000 * wheel_speed_rpm / 60",
      "output": "Vs_m_s",
      "unit": "m/s",
      "reference": "V_s = π × D_s × n_s / 60 — ANSI B7.1 §6.3; maximum speed MUST NOT exceed wheel marking"
    },
    {
      "id": "F2",
      "name": "Workpiece Peripheral Speed (V_w)",
      "expression": "Vw_m_min = Math.PI * workpiece_diameter_mm / 1000 * workpiece_speed_rpm",
      "output": "Vw_m_min",
      "unit": "m/min",
      "reference": "V_w = π × D_w × n_w — workpiece surface speed"
    },
    {
      "id": "F3",
      "name": "Specific Material Removal Rate (Q'_w)",
      "expression": "Qprime_mm3_mm_s = Vw_m_min / 60 * 1000 * infeed_mm_pass",
      "output": "Qprime_mm3_mm_s",
      "unit": "mm³/(mm·s)",
      "reference": "Q'_w = V_w × a_e — specific MRR per unit wheel width; key thermal indicator — Malkin §4.3"
    },
    {
      "id": "F4",
      "name": "Speed Ratio (q) & Grinding Temperature Index",
      "expression": "q_ratio = Vs_m_s / (Vw_m_min / 60); temp_index = Qprime_mm3_mm_s / Vs_m_s",
      "output": "q_ratio, temp_index",
      "unit": "dimensionless, mm²/(m)",
      "reference": "q = V_s/V_w — speed ratio; thermal index = Q'_w/V_s; Malkin-Shaw grinding burn criterion: temp_index < 0.04 for steel"
    },
    {
      "id": "F5",
      "name": "G-Ratio (Grinding Ratio) Estimate",
      "expression": "const G_base = {soft:20, medium_soft:30, medium:50, medium_hard:80, hard:120}; G_est = G_base[wheel_grade_hardness] * (Vs_m_s / 35)",
      "output": "G_est",
      "unit": "mm³_workpiece/mm³_wheel",
      "reference": "G = V_w_removed / V_wheel_worn — empirical estimate by grade; G_base at V_s=35 m/s; Malkin §7"
    },
    {
      "id": "F6",
      "name": "Axial Traverse Rate & Cycle Time per Pass",
      "expression": "traverse_rate_mm_min = traverse_feed_mm_rev * workpiece_speed_rpm; t_pass_s = (workpiece_diameter_mm * Math.PI) / (Vw_m_min / 60 * 1000) * (traverse_feed_mm_rev / 1)",
      "output": "traverse_rate_mm_min",
      "unit": "mm/min",
      "reference": "Axial traverse = f_a × n_w [mm/min]; traverse rate for CNC programme setup"
    }
  ],

  "engine_rules": {
    "standards": ["ANSI B7.1-2017 (Safety of Abrasive Wheels)", "EN 13236:2012", "ISO 525:2013 (bonded abrasives)", "S. Malkin 'Grinding Technology' (2nd Ed.)"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "Vs_m_s > 45", "action": "BLOCK", "message": "Wheel peripheral speed > 45 m/s: exceeds standard vitrified wheel limit — verify wheel is rated for high-speed grinding (HSG mark); operator safety risk of wheel burst per ANSI B7.1" },
        { "id": "V2", "condition": "q_ratio < 20", "action": "WARN", "message": "Speed ratio q < 20: conventional grinding range too low — wheel may load and glaze; increase V_s or reduce V_w; target q = 60–150 for conventional grinding" },
        { "id": "V3", "condition": "temp_index > 0.05", "action": "WARN", "message": "Thermal index > 0.05: grinding burn risk on steel — reduce Q'_w by decreasing infeed or workpiece speed; verify coolant flow rate ≥ 20 L/min at wheel contact zone" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "Vs_m_s > 35 && wheel_grade_hardness === 'soft'", "severity": "WARNING", "message": "High wheel speed with soft grade: wheel structure opens rapidly — soft grades lose bonds faster at high speed; upgrade to medium-soft for V_s > 35 m/s applications" },
      { "id": "W2", "trigger": "infeed_mm_pass > 0.03 && workpiece_diameter_mm < 20", "severity": "CRITICAL", "message": "Large infeed on small workpiece: Q'_w very high relative to workpiece thermal mass — grinding burn and workpiece deflection imminent; reduce infeed to < 0.01 mm for D_w < 20 mm" },
      { "id": "W3", "trigger": "traverse_feed_mm_rev > 5 && infeed_mm_pass < 0.005", "severity": "INFO", "message": "Wide traverse pitch on fine infeed: likely chatter pattern will appear — finish pass traverse should be ≤ 1/3 of wheel width B for uniform surface without helical marks" },
      { "id": "W4", "trigger": "G_est < 15", "severity": "WARNING", "message": "Low G-ratio estimate (< 15): wheel wears rapidly — check if wheel grade is too soft for workpiece hardness; consider harder grade or CBN/diamond wheel for hardened steels (HRC > 55)" },
      { "id": "W5", "trigger": "Vw_m_min > 50 && workpiece_diameter_mm < 30", "severity": "WARNING", "message": "High workpiece speed on small diameter: dynamic balance and bearing precision critical — workpiece runout at high rpm causes chatter; verify workpiece mounting and centre alignment to < 0.002 mm TIR" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// END — Sequence 94–98 (PRO_101 → PRO_105)
// Next: PRO_106 → PRO_110 (Sequence 99–103)
// ═══════════════════════════════════════════════════════════════════════════
