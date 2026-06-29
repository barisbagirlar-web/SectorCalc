// ═══════════════════════════════════════════════════════════════════════════
// SectorCalc Pro — Industrial-Grade Tool Schemas
// Sequence: 84 → 88  (PRO_091 · PRO_092 · PRO_093 · PRO_094 · PRO_095)
// Language: Pure Technical English
// Standards: ISO / ASME / API / IEC / AISC / AWS referenced per tool
// Rule Engine: min 7 inputs · min 6 formulas · min 3 validations · min 5 warnings
// ═══════════════════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────────────────
// TOOL 84 / PRO_091
// Chiller Plant Free-Cooling (Economiser) Switchover & Annual Savings
// Standards: ASHRAE 90.1-2022 · CIBSE TM21 · EN 14511 · ASHRAE 55
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_091",
  "tool_name": "Chiller Plant Free-Cooling Economiser — Switchover Temperature, Annual Hours & Energy Saving",
  "category": "HVAC / Energy Management",
  "scope": "single_operation",
  "primary_operation": "free_cooling_economiser",

  "inputs": [
    {
      "id": "chiller_COP",
      "name": "Chiller Full-Load COP (rated condition)",
      "unit": "dimensionless",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 2.0,
      "absolute_max": 9.0,
      "note": "AHRI 551/591 rating at 7/12°C CHWS/R, 30/35°C CWS/R"
    },
    {
      "id": "chilled_water_supply_c",
      "name": "Chilled Water Supply Set-Point (T_CHWS)",
      "unit": "°C",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "default": 7,
      "absolute_min": 4,
      "absolute_max": 18
    },
    {
      "id": "approach_temp_k",
      "name": "Cooling Tower / Dry Cooler Approach Temperature (ΔT_approach)",
      "unit": "K",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 4,
      "absolute_min": 1,
      "absolute_max": 12,
      "note": "Wet cooling tower: approach = T_CW,out − T_wb; dry cooler: approach = T_fluid,out − T_db"
    },
    {
      "id": "heat_exchanger_dT_k",
      "name": "Plate Heat Exchanger Temperature Approach (ΔT_HX)",
      "unit": "K",
      "type": "number",
      "required": true,
      "confidence_label": "VARSAYIM",
      "default": 2,
      "absolute_min": 0.5,
      "absolute_max": 8,
      "note": "Brazed plate HX: ΔT_HX = 1.5–3 K; gasketed frame: 2–5 K"
    },
    {
      "id": "design_cooling_load_kw",
      "name": "Design Peak Cooling Load (Q_design)",
      "unit": "kW",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 50,
      "absolute_max": 100000
    },
    {
      "id": "annual_cooling_hours",
      "name": "Annual Full-Load Equivalent Cooling Hours (FLEH)",
      "unit": "h/yr",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 3000,
      "absolute_min": 200,
      "absolute_max": 8760
    },
    {
      "id": "site_climate_zone",
      "name": "Site Climate Zone — Bin Hours Below Switchover",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Cold (Helsinki, Moscow) — ~4500 h/yr below 5°C wb", "value": 4500 },
        { "label": "Temperate (London, Paris) — ~3000 h/yr", "value": 3000 },
        { "label": "Mediterranean (Barcelona, Rome) — ~1500 h/yr", "value": 1500 },
        { "label": "Warm (Dubai, Singapore) — ~300 h/yr", "value": 300 }
      ],
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 3000
    },
    {
      "id": "electricity_rate_usd_kwh",
      "name": "Electricity Tariff",
      "unit": "USD/kWh",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 0.10,
      "absolute_min": 0.03,
      "absolute_max": 0.50
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Switchover Wet-Bulb Temperature (T_wb,sw)",
      "expression": "T_wb_sw_c = chilled_water_supply_c - approach_temp_k - heat_exchanger_dT_k",
      "output": "T_wb_sw_c",
      "unit": "°C",
      "reference": "T_wb,sw = T_CHWS − ΔT_approach − ΔT_HX — ASHRAE 90.1-2022 §6.5.1.1; below this outdoor WB, free-cooling is feasible"
    },
    {
      "id": "F2",
      "name": "Annual Free-Cooling Hours (h_FC)",
      "expression": "h_FC = Math.min(site_climate_zone, annual_cooling_hours)",
      "output": "h_FC",
      "unit": "h/yr",
      "reference": "Free-cooling hours = min(bin hours below T_wb,sw, total cooling hours) — CIBSE TM21 §4.2"
    },
    {
      "id": "F3",
      "name": "Free-Cooling Fraction (F_FC)",
      "expression": "F_FC = h_FC / annual_cooling_hours",
      "output": "F_FC",
      "unit": "dimensionless",
      "reference": "Fraction of annual cooling delivered without mechanical refrigeration"
    },
    {
      "id": "F4",
      "name": "Annual Chiller Energy — Baseline (E_chiller_base)",
      "expression": "E_chiller_base_kwh = design_cooling_load_kw / chiller_COP * annual_cooling_hours",
      "output": "E_chiller_base_kwh",
      "unit": "kWh/yr",
      "reference": "Baseline: all cooling via chiller at full-load COP — ASHRAE 90.1 §11 baseline building"
    },
    {
      "id": "F5",
      "name": "Annual Energy Saving with Free-Cooling (E_saving)",
      "expression": "pump_fan_parasitic_kw = design_cooling_load_kw * 0.03; E_saving_kwh = (design_cooling_load_kw / chiller_COP - pump_fan_parasitic_kw) * h_FC",
      "output": "E_saving_kwh",
      "unit": "kWh/yr",
      "reference": "E_saving = (Q/COP − P_parasitic) × h_FC; parasitic = 3% of load for CT fan + HX pump — CIBSE TM21 §5"
    },
    {
      "id": "F6",
      "name": "Annual Cost Saving & Simple Payback vs HX Capital",
      "expression": "cost_saving_usd = E_saving_kwh * electricity_rate_usd_kwh; HX_cost_est_usd = design_cooling_load_kw * 40; payback_yr = HX_cost_est_usd / cost_saving_usd",
      "output": "cost_saving_usd, payback_yr",
      "unit": "USD/yr, years",
      "reference": "HX installed cost ≈ 40 USD/kW (brazed plate, 2024 estimate); payback = CAPEX / annual saving"
    }
  ],

  "engine_rules": {
    "standards": ["ASHRAE 90.1-2022 §6.5.1.1", "CIBSE TM21:2016 (Minimising fan energy)", "EN 14511:2018", "ASHRAE Fundamentals 2021 Ch.35"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "T_wb_sw_c < 0 && site_climate_zone < 1000", "action": "WARN", "message": "Switchover WB temperature below 0°C in warm climate: free-cooling hours will be negligible — evaluate dry cooler or adiabatic pre-cooling to raise T_wb,sw" },
        { "id": "V2", "condition": "chilled_water_supply_c < 6 && heat_exchanger_dT_k < 1.5", "action": "WARN", "message": "Very low CHWS temp with tight HX approach: fouling will increase ΔT_HX rapidly — specify minimum HX surface oversize of 20% per TEMA C" },
        { "id": "V3", "condition": "F_FC > 0.8", "action": "WARN", "message": "Free-cooling fraction > 80%: chiller operates less than 20% of time — evaluate chiller downsizing or VFD for part-load optimisation; chiller may fall below minimum unload point" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "payback_yr < 2", "severity": "INFO", "message": "Free-cooling payback < 2 years: strong ROI — prioritise HX installation in next capital cycle; consider controls upgrade for automatic switchover per ASHRAE 90.1 §6.5.1" },
      { "id": "W2", "trigger": "site_climate_zone < 500", "severity": "WARNING", "message": "Warm climate with few free-cooling hours: marginal economic case — evaluate night-time free-cooling for data centres where T_wb is lower overnight" },
      { "id": "W3", "trigger": "approach_temp_k > 6", "severity": "WARNING", "message": "High cooling tower approach (>6 K): tower fouled or undersized — cleaning or replacement can recover 2–3 K and extend free-cooling season significantly" },
      { "id": "W4", "trigger": "E_saving_kwh > E_chiller_base_kwh * 0.5", "severity": "INFO", "message": "Free-cooling saves >50% of baseline chiller energy: very favourable climate — evaluate tri-mode (full/partial/zero mechanical) controls for transitional hours" },
      { "id": "W5", "trigger": "chiller_COP < 4 && site_climate_zone > 2000", "severity": "WARNING", "message": "Low-efficiency chiller in cold climate: both free-cooling AND chiller replacement are warranted — combined ROI should be modelled jointly" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 85 / PRO_092
// Cathodic Protection — Sacrificial Anode Current Demand & Anode Life
// Standards: DNV-RP-B401 · ISO 15589-2 · NACE SP0169 · EN 12954
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_092",
  "tool_name": "Cathodic Protection Design — Sacrificial Anode Current Demand, Mass & Service Life",
  "category": "Corrosion Engineering / Asset Integrity",
  "scope": "single_operation",
  "primary_operation": "cathodic_protection",

  "inputs": [
    {
      "id": "structure_area_m2",
      "name": "Bare (Uncoated) Steel Surface Area (A_s)",
      "unit": "m²",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 1,
      "absolute_max": 1000000
    },
    {
      "id": "coating_breakdown_pct",
      "name": "Coating Breakdown Factor at End of Life (f_c)",
      "unit": "%",
      "type": "number",
      "required": true,
      "confidence_label": "VARSAYIM",
      "default": 10,
      "absolute_min": 1,
      "absolute_max": 100,
      "note": "DNV-RP-B401 Table 10-1: well-coated new: 3–5%; aged coating: 10–25%; bare/uncoated: 100%"
    },
    {
      "id": "current_density_mA_m2",
      "name": "Design Current Density (i_c) — Mean Value",
      "unit": "mA/m²",
      "type": "number",
      "required": true,
      "confidence_label": "VARSAYIM",
      "default": 25,
      "absolute_min": 5,
      "absolute_max": 200,
      "note": "DNV-RP-B401 Table 10-3: North Sea seabed ≈ 20–25 mA/m²; tropical shallow water ≈ 50–80 mA/m²; soil ≈ 10–30 mA/m²"
    },
    {
      "id": "design_life_yr",
      "name": "Cathodic Protection Design Life (T_d)",
      "unit": "years",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "default": 25,
      "absolute_min": 1,
      "absolute_max": 50
    },
    {
      "id": "anode_material",
      "name": "Sacrificial Anode Material",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Zinc (seawater) — ε=780 Ah/kg, E=−1.05 V vs Ag/AgCl", "value": "Zn" },
        { "label": "Aluminium-Indium (offshore) — ε=2000 Ah/kg, E=−1.05 V", "value": "AlIn" },
        { "label": "Magnesium (soil/freshwater) — ε=1230 Ah/kg, E=−1.55 V", "value": "Mg" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "AlIn"
    },
    {
      "id": "anode_utilisation_pct",
      "name": "Anode Utilisation Factor (u)",
      "unit": "%",
      "type": "number",
      "required": false,
      "confidence_label": "VARSAYIM",
      "default": 80,
      "absolute_min": 50,
      "absolute_max": 95,
      "note": "DNV-RP-B401 §6.4: bracelet anodes u=0.80; flush-mounted u=0.90; stand-off u=0.85"
    },
    {
      "id": "protection_potential_mv",
      "name": "Target Protection Potential (E_prot)",
      "unit": "mV vs Ag/AgCl/seawater",
      "type": "enum",
      "options": [
        { "label": "−800 mV — ISO 15589-2 minimum (aerobic soil/seawater)", "value": -800 },
        { "label": "−850 mV — NACE SP0169 standard criterion", "value": -850 },
        { "label": "−900 mV — Elevated temperature or H₂S service", "value": -900 }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": -850
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Exposed (Uncoated) Effective Area (A_eff)",
      "expression": "A_eff_m2 = structure_area_m2 * coating_breakdown_pct / 100",
      "output": "A_eff_m2",
      "unit": "m²",
      "reference": "A_eff = A_s × f_c — DNV-RP-B401 §6.2; coating breakdown factor applied to bare area"
    },
    {
      "id": "F2",
      "name": "Mean Current Demand (I_c,mean)",
      "expression": "Ic_mean_A = A_eff_m2 * current_density_mA_m2 / 1000",
      "output": "Ic_mean_A",
      "unit": "A",
      "reference": "I_c = i_c × A_eff — DNV-RP-B401 §6.3.1 Eq.(6.1)"
    },
    {
      "id": "F3",
      "name": "Total Charge Required Over Design Life (Q_T)",
      "expression": "Q_T_Ah = Ic_mean_A * design_life_yr * 8760",
      "output": "Q_T_Ah",
      "unit": "A·h",
      "reference": "Q_T = I_c,mean × T_d × 8760 — total coulombs required over design life"
    },
    {
      "id": "F4",
      "name": "Total Anode Net Mass Required (M_a)",
      "expression": "const ECA = {Zn:780, AlIn:2000, Mg:1230}[anode_material]; Ma_kg = Q_T_Ah / (ECA * anode_utilisation_pct / 100)",
      "output": "Ma_kg",
      "unit": "kg",
      "reference": "M_a = Q_T / (ε × u) — DNV-RP-B401 §6.4 Eq.(6.3); ε = electrochemical capacity in Ah/kg"
    },
    {
      "id": "F5",
      "name": "Number of Standard Anodes Required (N_a)",
      "expression": "anode_std_mass_kg = (anode_material === 'Mg') ? 5 : 15; N_a = Math.ceil(Ma_kg / anode_std_mass_kg)",
      "output": "N_a",
      "unit": "count",
      "reference": "N_a = M_a / m_std; standard bracelet anode: Al-In 15 kg; Mg 5 kg net mass — DNV Table 10-4"
    },
    {
      "id": "F6",
      "name": "Driving Voltage & Current Output Check",
      "expression": "const E_anode = {Zn:-1050, AlIn:-1050, Mg:-1550}[anode_material]; dE_mv = E_anode - protection_potential_mv; resistance_est_ohm = 0.315 * Math.sqrt(A_eff_m2 / N_a) / 10; I_output_A = dE_mv / 1000 / resistance_est_ohm",
      "output": "dE_mv, I_output_A",
      "unit": "mV, A",
      "reference": "Driving voltage ΔE = E_anode − E_prot; current = ΔE/R_a; R_a from Dwight formula — DNV-RP-B401 §7"
    }
  ],

  "engine_rules": {
    "standards": ["DNV-RP-B401:2021", "ISO 15589-2:2012", "NACE SP0169-2013", "EN 12954:2019"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "coating_breakdown_pct === 100 && current_density_mA_m2 < 30", "action": "WARN", "message": "Bare steel with low current density: verify environment — bare steel in stagnant seawater may require 50–100 mA/m² per DNV Table 10-3" },
        { "id": "V2", "condition": "anode_material === 'Zn' && current_density_mA_m2 > 50", "action": "WARN", "message": "Zinc anodes at high current density: driving voltage insufficient for tropical warm water — switch to Al-In alloy with higher electrochemical efficiency" },
        { "id": "V3", "condition": "Ma_kg > 100000", "action": "WARN", "message": "Total anode mass > 100 tonnes: very large CP system — evaluate impressed current cathodic protection (ICCP) for structures > 20,000 m²; lower OPEX despite higher CAPEX" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "design_life_yr > 20 && anode_material === 'Zn'", "severity": "WARNING", "message": "Zinc anodes for 20+ year design life: mass penalty is severe — Al-In provides 2.6× more charge per kg at same potential; mandatory for deepwater and long-life structures per DNV §5.2" },
      { "id": "W2", "trigger": "dE_mv < 150", "severity": "CRITICAL", "message": "Driving voltage < 150 mV: anode current output will be marginal — verify polarisation resistance of structure; may need to increase anode count by 40% for adequate protection" },
      { "id": "W3", "trigger": "protection_potential_mv < -900 && anode_material === 'Mg'", "severity": "WARNING", "message": "Over-protection risk with Mg anodes (E < −900 mV): hydrogen embrittlement possible on high-strength steels (Fy > 550 MPa) — limit to −950 mV per NACE SP0169 §6.2.2" },
      { "id": "W4", "trigger": "A_eff_m2 > 5000 && N_a < 20", "severity": "WARNING", "message": "Large exposed area with few anodes: current distribution will be uneven — increase anode count and space evenly; maximum spacing = 3 m for bare surfaces per DNV §10.3" },
      { "id": "W5", "trigger": "coating_breakdown_pct < 3", "severity": "INFO", "message": "Low coating breakdown (<3%): CP demand is minimal — verify coating integrity with holiday detection per NACE SP0188; CP as backup protection only" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 86 / PRO_093
// Boiler Efficiency & Flue Gas Analysis — Indirect Method
// Standards: ASME PTC 4-2013 · EN 12952-15 · IS 8753 · CIBSE
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_093",
  "tool_name": "Steam Boiler Thermal Efficiency — Indirect Loss Method, Flue Gas Dew Point & Stack Heat Loss",
  "category": "Energy Management / Steam Systems",
  "scope": "single_operation",
  "primary_operation": "steam_boiler",

  "inputs": [
    {
      "id": "fuel_type",
      "name": "Fuel Type",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Natural gas — LHV=47500 kJ/kg, C=75%, H=24%, S=0%", "value": "NG" },
        { "label": "Fuel oil No.6 HFO — LHV=40600 kJ/kg, C=86%, H=11%, S=2.5%", "value": "HFO" },
        { "label": "LPG Propane — LHV=46350 kJ/kg, C=82%, H=18%, S=0%", "value": "LPG" },
        { "label": "Coal (bituminous) — LHV=26000 kJ/kg, C=73%, H=5%, S=1.5%", "value": "Coal" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "NG"
    },
    {
      "id": "flue_gas_O2_pct",
      "name": "Flue Gas O₂ Concentration (dry basis)",
      "unit": "%",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.5,
      "absolute_max": 18,
      "note": "Measured by portable O₂ analyser; natural gas target: 2–3% O₂"
    },
    {
      "id": "stack_temp_c",
      "name": "Flue Gas Exit (Stack) Temperature (T_stack)",
      "unit": "°C",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 100,
      "absolute_max": 700
    },
    {
      "id": "ambient_temp_c",
      "name": "Combustion Air Inlet Temperature (T_amb)",
      "unit": "°C",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "default": 25,
      "absolute_min": -20,
      "absolute_max": 55
    },
    {
      "id": "CO_stack_ppm",
      "name": "Flue Gas CO Concentration (dry basis)",
      "unit": "ppm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "default": 50,
      "absolute_min": 0,
      "absolute_max": 5000,
      "note": "< 100 ppm: good combustion; > 400 ppm: incomplete combustion — EN 303-5 limit: 250 ppm"
    },
    {
      "id": "boiler_rated_kw",
      "name": "Boiler Rated Output (Q_rated)",
      "unit": "kW",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 10,
      "absolute_max": 500000
    },
    {
      "id": "radiation_loss_pct",
      "name": "Surface Radiation & Convection Loss (% of fired duty)",
      "unit": "%",
      "type": "number",
      "required": false,
      "confidence_label": "VARSAYIM",
      "default": 0.5,
      "absolute_min": 0.1,
      "absolute_max": 3.0,
      "note": "ASME PTC 4 Appendix B: well-insulated gas boiler ≈ 0.3–0.8%; older/larger ≈ 0.5–1.5%"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Excess Air Percentage (XS_air)",
      "expression": "XS_air_pct = flue_gas_O2_pct * 100 / (21 - flue_gas_O2_pct)",
      "output": "XS_air_pct",
      "unit": "%",
      "reference": "XS_air = O₂% × 100 / (21 − O₂%) — ASME PTC 4-2013 §5.3 Eq.(5.2)"
    },
    {
      "id": "F2",
      "name": "Fuel Composition Parameters by Type",
      "expression": "const FC = {NG:{LHV:47500,C:0.75,H:0.24,S:0}, HFO:{LHV:40600,C:0.86,H:0.11,S:0.025}, LPG:{LHV:46350,C:0.82,H:0.18,S:0}, Coal:{LHV:26000,C:0.73,H:0.05,S:0.015}}; const fp = FC[fuel_type]; LHV_kj_kg=fp.LHV; C_frac=fp.C; H_frac=fp.H; S_frac=fp.S",
      "output": "LHV_kj_kg",
      "unit": "kJ/kg",
      "reference": "Fuel composition from EN 12952-15 Table A.1 / ASME PTC 4 Appendix C"
    },
    {
      "id": "F3",
      "name": "Dry Flue Gas Heat Loss (L_fg)",
      "expression": "m_air_stoich = 11.5 * C_frac + 34.5 * H_frac + 4.3 * S_frac; m_fg_kg_kg = m_air_stoich * (1 + XS_air_pct/100) + 1; cp_fg = 1.004 + 0.000254 * stack_temp_c; L_fg_pct = m_fg_kg_kg * cp_fg * (stack_temp_c - ambient_temp_c) / LHV_kj_kg * 100",
      "output": "L_fg_pct",
      "unit": "%",
      "reference": "L_DFG = m_fg × c_p,fg × ΔT / LHV × 100 — ASME PTC 4 §5.4 Eq.(5.11)"
    },
    {
      "id": "F4",
      "name": "Incomplete Combustion Loss — CO (L_CO)",
      "expression": "L_CO_pct = CO_stack_ppm * 3.5e-4 * (XS_air_pct + 100) / 100",
      "output": "L_CO_pct",
      "unit": "%",
      "reference": "L_CO ≈ CO_ppm × 3.5×10⁻⁴ × (1 + XS/100) — simplified Ostwald formula; ASME PTC 4 §5.8"
    },
    {
      "id": "F5",
      "name": "Net Thermal Efficiency (η_th)",
      "expression": "eta_th_pct = 100 - L_fg_pct - L_CO_pct - radiation_loss_pct",
      "output": "eta_th_pct",
      "unit": "%",
      "reference": "η = 100 − ΣLosses (indirect method) — EN 12952-15 §7.3; ASME PTC 4 §5.1"
    },
    {
      "id": "F6",
      "name": "Flue Gas Acid Dew Point Temperature (T_dew)",
      "expression": "T_dew_c = (fuel_type === 'HFO' || fuel_type === 'Coal') ? 120 + 18 * Math.log10(S_frac * 1000) : 55",
      "output": "T_dew_c",
      "unit": "°C",
      "reference": "Müller-Kirchenbauer dew point: T_dew ≈ 120 + 18·log(SO₃ ppm) for S-bearing fuels; H₂SO₄ formation — EN 15502-1 §B.4"
    }
  ],

  "engine_rules": {
    "standards": ["ASME PTC 4-2013 (Fired Steam Generators)", "EN 12952-15:2016", "EN 303-5:2021 (CO limits)", "IS 8753:1978"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "eta_th_pct < 75", "action": "WARN", "message": "Boiler efficiency < 75%: critically low — stack temperature and/or excess air are excessive; immediate combustion optimisation and flue gas audit required" },
        { "id": "V2", "condition": "CO_stack_ppm > 400", "action": "WARN", "message": "CO > 400 ppm: incomplete combustion — adjust air-to-fuel ratio; CO > 1000 ppm indicates safety risk of CO accumulation in boiler room" },
        { "id": "V3", "condition": "stack_temp_c < T_dew_c + 10", "action": "WARN", "message": "Stack temperature within 10°C of acid dew point: sulphuric acid condensation risk — economiser and stack lining corrosion; maintain stack temperature ≥ T_dew + 20°C" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "XS_air_pct > 30", "severity": "CRITICAL", "message": "Excess air > 30%: major energy waste — each 10% excess air at 250°C stack raises stack loss ≈ 0.6%; install O₂ trim control for continuous optimisation" },
      { "id": "W2", "trigger": "stack_temp_c > 250 && fuel_type === 'NG'", "severity": "WARNING", "message": "Stack temperature > 250°C on gas-fired boiler: economiser opportunity — recovering heat to 130°C typically saves 4–8% fuel; verify dew point before sizing" },
      { "id": "W3", "trigger": "eta_th_pct < 88 && fuel_type === 'NG'", "severity": "WARNING", "message": "Natural gas boiler below 88% efficiency: condensing technology available — condensing boilers achieve 92–97% (NCV basis) by recovering latent heat of flue gas water vapour" },
      { "id": "W4", "trigger": "flue_gas_O2_pct < 1.5 && CO_stack_ppm > 200", "severity": "CRITICAL", "message": "Low O₂ + high CO: sub-stoichiometric combustion — immediate safety risk of CO poisoning and explosion; increase combustion air immediately and check burner condition" },
      { "id": "W5", "trigger": "L_fg_pct > 15", "severity": "WARNING", "message": "Stack loss > 15%: dominant efficiency penalty — target: natural gas boiler stack loss ≤ 10% at 230°C stack; prioritise air preheating or economiser installation" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 87 / PRO_094
// Retaining Wall Stability — Overturning, Sliding & Bearing Pressure
// Standards: EN 1997-1 (EC7) · ASCE 7-22 · NAVFAC DM-7.2 · BS 8002
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_094",
  "tool_name": "Cantilever Retaining Wall — Overturning, Sliding, Bearing & Global Stability Check",
  "category": "Geotechnical Engineering / Civil Structures",
  "scope": "single_operation",
  "primary_operation": "retaining_wall",

  "inputs": [
    {
      "id": "wall_height_m",
      "name": "Total Retained Height (H)",
      "unit": "m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.5,
      "absolute_max": 15
    },
    {
      "id": "base_width_m",
      "name": "Wall Base Width (B)",
      "unit": "m",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.5,
      "absolute_max": 20
    },
    {
      "id": "phi_backfill_deg",
      "name": "Backfill Friction Angle (φ_b)",
      "unit": "°",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 30,
      "absolute_min": 20,
      "absolute_max": 45,
      "note": "Compacted granular fill ≈ 32–38°; gravel ≈ 35–42°; sandy silt ≈ 28–32°"
    },
    {
      "id": "gamma_backfill_kn_m3",
      "name": "Backfill Unit Weight (γ_b)",
      "unit": "kN/m³",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 18,
      "absolute_min": 14,
      "absolute_max": 22
    },
    {
      "id": "surcharge_kpa",
      "name": "Uniform Surcharge on Retained Surface (q_s)",
      "unit": "kPa",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 10,
      "absolute_min": 0,
      "absolute_max": 200,
      "note": "Highway: 10–20 kPa; railway: 20–50 kPa; construction traffic: 12 kPa per AASHTO"
    },
    {
      "id": "wall_concrete_kn_m3",
      "name": "Concrete Unit Weight (γ_c)",
      "unit": "kN/m³",
      "type": "number",
      "required": false,
      "confidence_label": "KESİN",
      "default": 24,
      "absolute_min": 22,
      "absolute_max": 26
    },
    {
      "id": "phi_base_deg",
      "name": "Base-Soil Friction Angle (φ_base)",
      "unit": "°",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 25,
      "absolute_min": 10,
      "absolute_max": 40,
      "note": "Concrete on soil: δ = 2/3·φ_soil; rough concrete on gravel: δ ≈ φ_soil"
    },
    {
      "id": "q_allow_kpa",
      "name": "Allowable Bearing Pressure of Foundation Soil (q_allow)",
      "unit": "kPa",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "absolute_min": 50,
      "absolute_max": 1000,
      "note": "From geotechnical investigation; sand ≈ 150–300 kPa; gravel ≈ 300–600 kPa; clay varies widely"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Rankine Active Earth Pressure Coefficient (Ka)",
      "expression": "phi_rad = phi_backfill_deg * Math.PI / 180; Ka = Math.pow(Math.tan(Math.PI/4 - phi_rad/2), 2)",
      "output": "Ka",
      "unit": "dimensionless",
      "reference": "Ka = tan²(45 − φ/2) — Rankine (1857); valid for horizontal backfill with no wall friction"
    },
    {
      "id": "F2",
      "name": "Total Active Thrust & Surcharge Force (per unit length)",
      "expression": "Pa_soil_kn_m = 0.5 * Ka * gamma_backfill_kn_m3 * Math.pow(wall_height_m, 2); Pa_surcharge_kn_m = Ka * surcharge_kpa * wall_height_m; Pa_total_kn_m = Pa_soil_kn_m + Pa_surcharge_kn_m",
      "output": "Pa_total_kn_m",
      "unit": "kN/m",
      "reference": "P_a = ½·K_a·γ·H² + K_a·q_s·H — EN 1997-1 §9.5.2; forces per unit wall length"
    },
    {
      "id": "F3",
      "name": "Overturning Moment & Restoring Moment (about toe)",
      "expression": "M_OT = Pa_soil_kn_m * wall_height_m/3 + Pa_surcharge_kn_m * wall_height_m/2; W_wall_kn_m = wall_concrete_kn_m3 * base_width_m * 0.3; W_soil_kn_m = gamma_backfill_kn_m3 * wall_height_m * (base_width_m * 0.6); M_R = (W_wall_kn_m + W_soil_kn_m) * base_width_m / 2",
      "output": "M_OT, M_R",
      "unit": "kN·m/m",
      "reference": "Moments about toe; W_wall = γ_c × B × t_stem (t=0.3 B approx); M_R = W × B/2 — NAVFAC DM-7.2 §5.2"
    },
    {
      "id": "F4",
      "name": "Overturning Safety Factor (OTF)",
      "expression": "OTF = M_R / M_OT",
      "output": "OTF",
      "unit": "dimensionless",
      "reference": "OTF ≥ 2.0 static (ASCE 7 / EC7 DA1-1); ≥ 1.5 seismic — required minimum varies by code"
    },
    {
      "id": "F5",
      "name": "Sliding Safety Factor (SSF)",
      "expression": "phi_base_rad = phi_base_deg * Math.PI / 180; W_total = W_wall_kn_m + W_soil_kn_m; F_resist = W_total * Math.tan(phi_base_rad); SSF = F_resist / Pa_total_kn_m",
      "output": "SSF",
      "unit": "dimensionless",
      "reference": "SSF = W·tan(δ) / P_a — EN 1997-1 §6.5.3; minimum SSF ≥ 1.5 (static)"
    },
    {
      "id": "F6",
      "name": "Maximum Bearing Pressure Under Footing (q_max)",
      "expression": "W_total_kn_m = W_wall_kn_m + W_soil_kn_m; e = base_width_m/2 - (M_R - M_OT)/W_total_kn_m; q_max_kpa = W_total_kn_m/base_width_m * (1 + 6*e/base_width_m)",
      "output": "q_max_kpa",
      "unit": "kPa",
      "reference": "q_max = N/B × (1 + 6e/B) — eccentric loading; e = eccentricity from centroid — EC7 §6.5.4"
    }
  ],

  "engine_rules": {
    "standards": ["EN 1997-1:2004 (EC7) §6, §9", "ASCE 7-22 §11 (seismic)", "NAVFAC DM-7.2 §5", "BS 8002:2015"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "OTF < 1.5", "action": "BLOCK", "message": "Overturning safety factor < 1.5: wall will overturn — increase base width, add heel extension, or install ground anchor" },
        { "id": "V2", "condition": "SSF < 1.2", "action": "BLOCK", "message": "Sliding safety factor < 1.2: wall will slide — add base key, increase base width, or install batter piles" },
        { "id": "V3", "condition": "q_max_kpa > q_allow_kpa", "action": "WARN", "message": "Maximum bearing pressure exceeds allowable: foundation failure risk — widen base, reduce eccentricity, or improve ground by compaction or piling" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "OTF < 2.0", "severity": "WARNING", "message": "OTF < 2.0: EN 1997-1 DA1 requirement not met for permanent structures — increase base width to B ≥ 0.6H for typical granular backfill" },
      { "id": "W2", "trigger": "SSF < 1.5", "severity": "WARNING", "message": "Sliding SF < 1.5: marginal — NAVFAC DM-7.2 requires SSF ≥ 1.5; add shear key 300 mm deep at front third of base for significant resistance improvement" },
      { "id": "W3", "trigger": "surcharge_kpa > 20 && phi_backfill_deg < 28", "severity": "WARNING", "message": "High surcharge on weak backfill: active pressure substantially elevated — verify drainage behind wall; waterlogged granular fill can reach K_0 = 1.0" },
      { "id": "W4", "trigger": "wall_height_m > 6 && OTF < 2.5", "severity": "CRITICAL", "message": "High wall with marginal OTF: seismic loading will reduce OTF further — ASCE 7 §11 seismic lateral earth pressure adds 50–100% to static thrust; perform seismic analysis" },
      { "id": "W5", "trigger": "q_max_kpa > q_allow_kpa * 0.8", "severity": "WARNING", "message": "Bearing pressure > 80% of allowable: settlement risk under sustained surcharge — monitor differential settlement; consider ground improvement if soft soil detected below" }
    ]
  }
},


// ───────────────────────────────────────────────────────────────────────────
// TOOL 88 / PRO_095
// Biomass Combustion — Fuel Moisture, Net Calorific Value & Boiler Sizing
// Standards: EN ISO 18134 · EN ISO 17225 · EN 303-5 · ASTM E871
// ───────────────────────────────────────────────────────────────────────────
{
  "tool_id": "PRO_095",
  "tool_name": "Biomass Combustion — Moisture-Corrected NCV, Combustion Air & Boiler Rating",
  "category": "Renewable Energy / Biomass / Energy Management",
  "scope": "single_operation",
  "primary_operation": "biomass_combustion",

  "inputs": [
    {
      "id": "biomass_type",
      "name": "Biomass Fuel Type",
      "unit": "dimensionless",
      "type": "enum",
      "options": [
        { "label": "Wood chips (forest residue) — GCV_dry=19500 kJ/kg", "value": "wood_chips" },
        { "label": "Wood pellets EN ISO 17225-2 — GCV_dry=19800 kJ/kg", "value": "pellets" },
        { "label": "Agricultural straw — GCV_dry=17500 kJ/kg", "value": "straw" },
        { "label": "Miscanthus — GCV_dry=18000 kJ/kg", "value": "miscanthus" },
        { "label": "Sawdust / wood shavings — GCV_dry=19000 kJ/kg", "value": "sawdust" }
      ],
      "required": true,
      "confidence_label": "KESİN",
      "default": "wood_chips"
    },
    {
      "id": "moisture_content_pct",
      "name": "Fuel Moisture Content (M) — as-received basis",
      "unit": "% w/w",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 5,
      "absolute_max": 60,
      "note": "EN ISO 18134-3 gravimetric method; fresh wood: 40–55%; air-dried: 20–30%; pellets: 8–12%"
    },
    {
      "id": "H_content_dry_pct",
      "name": "Hydrogen Content of Dry Fuel (H_dry)",
      "unit": "%",
      "type": "number",
      "required": false,
      "confidence_label": "VARSAYIM",
      "default": 6.0,
      "absolute_min": 3,
      "absolute_max": 8,
      "note": "From ultimate analysis EN ISO 16948; woody biomass ≈ 5.8–6.2%; straw ≈ 5.5–6.0%"
    },
    {
      "id": "boiler_output_kw",
      "name": "Required Boiler Rated Heat Output (Q_boiler)",
      "unit": "kW",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 10,
      "absolute_max": 500000
    },
    {
      "id": "boiler_efficiency_pct",
      "name": "Boiler Thermal Efficiency (η_boiler)",
      "unit": "%",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 82,
      "absolute_min": 65,
      "absolute_max": 94,
      "note": "EN 303-5 Class 5 (pellets): ≥ 88%; wood chips direct: 75–85%; stoker-fired straw: 78–86%"
    },
    {
      "id": "O2_flue_pct",
      "name": "Oxygen Content in Flue Gas (O₂, dry)",
      "unit": "%",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "default": 8,
      "absolute_min": 2,
      "absolute_max": 18,
      "note": "Biomass requires higher excess air than gas (6–12% O₂); grate combustion: 7–10%; fluidised bed: 3–6%"
    },
    {
      "id": "bulk_density_kg_m3",
      "name": "Fuel Bulk Density (ρ_bulk)",
      "unit": "kg/m³",
      "type": "number",
      "required": true,
      "confidence_label": "GÜÇLÜ",
      "default": 250,
      "absolute_min": 100,
      "absolute_max": 750,
      "note": "Wood chips G30 ≈ 200–300 kg/m³; pellets 6 mm ≈ 600–700 kg/m³; straw bales ≈ 130–180 kg/m³"
    }
  ],

  "formulas": [
    {
      "id": "F1",
      "name": "Gross Calorific Value — Dry Basis (GCV_dry)",
      "expression": "const GCV_map = {wood_chips:19500, pellets:19800, straw:17500, miscanthus:18000, sawdust:19000}; GCV_dry_kj_kg = GCV_map[biomass_type]",
      "output": "GCV_dry_kj_kg",
      "unit": "kJ/kg",
      "reference": "EN ISO 18125:2017 (calorific values); GCV on dry ash-free basis by fuel type"
    },
    {
      "id": "F2",
      "name": "Net Calorific Value — As-Received Basis (NCV_ar)",
      "expression": "M_frac = moisture_content_pct / 100; NCV_ar_kj_kg = GCV_dry_kj_kg * (1 - M_frac) - 2440 * (M_frac + 0.09 * H_content_dry_pct/100 * (1 - M_frac))",
      "output": "NCV_ar_kj_kg",
      "unit": "kJ/kg",
      "reference": "NCV_ar = GCV_dry × (1−M) − 2440 × [M + 0.09·H_dry·(1−M)] — EN ISO 18125 / Milne equation; 2440 kJ/kg = latent heat of water vapour"
    },
    {
      "id": "F3",
      "name": "Fuel Consumption Rate (ṁ_fuel)",
      "expression": "m_fuel_kg_h = boiler_output_kw * 3600 / (NCV_ar_kj_kg * boiler_efficiency_pct / 100)",
      "output": "m_fuel_kg_h",
      "unit": "kg/h",
      "reference": "ṁ_fuel = Q_boiler / (NCV_ar × η_boiler) — mass flow for steady-state heat balance"
    },
    {
      "id": "F4",
      "name": "Volumetric Fuel Consumption (storage sizing)",
      "expression": "V_fuel_m3h = m_fuel_kg_h / bulk_density_kg_m3; V_fuel_daily_m3 = V_fuel_m3h * 24",
      "output": "V_fuel_m3h, V_fuel_daily_m3",
      "unit": "m³/h, m³/day",
      "reference": "V_fuel = ṁ_fuel / ρ_bulk — fuel store sizing: minimum 3 days' storage recommended per CIBSE Guide B1"
    },
    {
      "id": "F5",
      "name": "Excess Air & Stoichiometric Air Requirement",
      "expression": "XS_air_pct = O2_flue_pct * 100 / (21 - O2_flue_pct); m_air_stoich_kg_kg = 8.89 * (1 - moisture_content_pct/100); m_air_actual_kg_kg = m_air_stoich_kg_kg * (1 + XS_air_pct / 100)",
      "output": "XS_air_pct, m_air_actual_kg_kg",
      "unit": "%, kg air/kg fuel",
      "reference": "Stoichiometric air ≈ 8.89 kg/kg for wood C₁H₁.₄O₀.₆; XS_air = O₂/(21−O₂) × 100 — EN 303-5"
    },
    {
      "id": "F6",
      "name": "Combustion Air Fan Duty (Q_fan)",
      "expression": "Q_fan_m3h = m_fuel_kg_h * m_air_actual_kg_kg / 1.2",
      "output": "Q_fan_m3h",
      "unit": "m³/h",
      "reference": "Q_fan = ṁ_fuel × m_air / ρ_air; ρ_air = 1.2 kg/m³ at 20°C — combustion air fan sizing per EN 303-5 §5.4"
    }
  ],

  "engine_rules": {
    "standards": ["EN ISO 18134:2017 (moisture)", "EN ISO 18125:2017 (calorific value)", "EN ISO 17225:2021 (fuel specs)", "EN 303-5:2021 (boiler requirements)", "ASTM E871"],
    "validation": {
      "rules": [
        { "id": "V1", "condition": "NCV_ar_kj_kg < 5000", "action": "WARN", "message": "NCV_ar < 5000 kJ/kg: very wet fuel — combustion may not self-sustain below 35% moisture without auxiliary burner support; dry fuel below 25% moisture for reliable combustion" },
        { "id": "V2", "condition": "moisture_content_pct > 50 && biomass_type === 'pellets'", "action": "BLOCK", "message": "Pellet moisture cannot exceed 50% — EN ISO 17225-2 Class A1 pellets: M ≤ 10%; M > 50% physically impossible for pellets; check input" },
        { "id": "V3", "condition": "O2_flue_pct < 4 && biomass_type === 'straw'", "action": "WARN", "message": "O₂ < 4% for straw combustion: high CO and unburned carbon risk — straw requires O₂ ≥ 6% due to irregular particle shape; increase secondary air" }
      ]
    },
    "smart_warnings": [
      { "id": "W1", "trigger": "moisture_content_pct > 35", "severity": "CRITICAL", "message": "Moisture > 35%: NCV drops sharply and boiler efficiency falls significantly — each 10% moisture increase reduces NCV by ~15%; pre-dry fuel or select lower-moisture grade per EN ISO 17225" },
      { "id": "W2", "trigger": "NCV_ar_kj_kg < 10000", "severity": "WARNING", "message": "NCV_ar < 10 MJ/kg: low energy density — fuel consumption and storage volume approximately double vs dry fuel; evaluate chip drying or switch to pellets" },
      { "id": "W3", "trigger": "XS_air_pct > 80", "severity": "WARNING", "message": "Excess air > 80%: very high for biomass — stack losses will be excessive; target 40–60% excess air (O₂ 7–9%) for grate-fired systems per EN 303-5" },
      { "id": "W4", "trigger": "V_fuel_daily_m3 > 50", "severity": "INFO", "message": "Daily fuel volume > 50 m³: large biomass logistics requirement — size vehicle access, unloading equipment, and fire compartmentation per NFPA 664" },
      { "id": "W5", "trigger": "boiler_efficiency_pct < 80 && biomass_type === 'pellets'", "severity": "WARNING", "message": "Pellet boiler efficiency < 80%: below EN 303-5 Class 4 minimum for pellet appliances — verify combustion tuning, grate design, and heat exchanger fouling" }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// END — Sequence 84–88 (PRO_091 → PRO_095)
// Next: PRO_096 → PRO_100 (Sequence 89–93)
// ═══════════════════════════════════════════════════════════════════════════
