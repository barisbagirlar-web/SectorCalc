#!/usr/bin/env node
/**
 * gen-quote-schema.mjs — Generate job-quote-builder-pro-pack v5.3.1 schema
 *
 * Reads the machine-hourly-rate schema as a structural template, replaces
 * all tool-specific sections, and writes the complete schema JSON.
 *
 * Usage:  node scripts/gen-quote-schema.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const REF_PATH  = resolve(ROOT, 'src/sectorcalc/schemas/pro-v531/machine-hourly-rate-proof-report.schema.json');
const OUT_PATH  = resolve(ROOT, 'src/sectorcalc/schemas/pro-v531/job-quote-builder-pro-pack.schema.json');
const TK        = 'job-quote-builder-pro-pack';

// ────────────────────────────────────────────────────────────
// 1. Load reference template
// ────────────────────────────────────────────────────────────
const ref = JSON.parse(readFileSync(REF_PATH, 'utf-8'));
const S = JSON.parse(JSON.stringify(ref));  // deep-clone all 40 keys

// ────────────────────────────────────────────────────────────
// 2. Helpers
// ────────────────────────────────────────────────────────────
const physBounds = (min, max, unit, basis='PROCESS_LIMIT') => ({ min, max, unit, basis, violation_behavior: 'BLOCK' });
const engRange   = (min, max, unit, src) => ({ min, max, unit, source: `SectorCalc industrial screening reference range based on ${src}; user must verify against project evidence.`, status: 'NEEDS_SOURCE_VERIFICATION' });
const PRECISION  = { input_decimals: 3, display_decimals: 3, calculation_precision: 'FULL_DOUBLE_PRECISION_NO_PRE_ROUNDING', rounding_rule: 'DISPLAY_ONLY' };
const refValues  = (src, note) => ({ reference_value_type: 'USER_VERIFIED', source: src, reference_status: 'NEEDS_SOURCE_VERIFICATION', user_must_verify: true, public_note: note });
const srcPri     = ['shop or process record', 'signed drawing', 'calibration record', 'ERP or production log', 'engineer-approved assumption register'];
const evidenceReq = src => ({ required: true, accepted_evidence: [src, 'signed engineering note', 'measurement record', 'supplier certificate', 'audit trail export'], missing_evidence_behavior: 'BLOCK', public_help_text: 'Attach or cite evidence for this input; critical values are not defaulted.' });

const displayUnits = (qk, base) => {
  if (qk === 'money') return ['currency_unit'];
  if (qk === 'time') return base === 's' ? ['s','min','h','day'] : base === 'min' ? ['min','h','day'] : ['h','day'];
  if (base === 'currency_unit_per_h') return ['currency_unit_per_h','currency_unit_per_unit','currency_unit_per_kg','currency_unit_per_m','currency_unit_per_kWh','currency_unit_per_tonne'];
  if (base === 'ratio' || base === 'percent') return ['ratio','percent'];
  return [base];
};

const INPUT_GROUPS = [
  { id:'job_scope',               title:'Job Scope',               desc:'Batch quantity, production volume, and job characteristics.',       order:1, modes:['quick','engineering','cost','audit'] },
  { id:'material_input',          title:'Material Input',           desc:'Material cost data per unit.',                                      order:2, modes:['quick','engineering','cost','audit'] },
  { id:'time_definition',         title:'Time Definition',          desc:'Cycle time, setup time, and staffing parameters.',                  order:3, modes:['quick','engineering','cost','audit'] },
  { id:'rate_costs',              title:'Rate Costs',               desc:'Machine hourly rate and labor hourly rate.',                         order:4, modes:['engineering','cost','audit'] },
  { id:'overhead_setup',          title:'Overhead Setup',           desc:'Annual overhead allocation and annual volume.',                      order:5, modes:['cost','audit'] },
  { id:'quality_and_margin',      title:'Quality and Margin',       desc:'Scrap / rework rate and target revenue margin.',                     order:6, modes:['quick','engineering','cost','audit'] },
  { id:'add_on_costs',            title:'Add-on Costs',             desc:'Tooling, subcontract, packaging, freight, and other per-batch costs.', order:7, modes:['cost','audit'] },
  { id:'contingency_and_comparison', title:'Contingency and Comparison', desc:'Contingency allowance and current quote for comparison.',      order:8, modes:['cost','audit'] },
];

const uiBinding = (groupId, order, opts={}) => {
  const { advanced=false, modes, requiredForCalc=true } = opts;
  return { group_id:groupId, field_order:order, component:'number_with_unit', unit_dropdown_required:requiredForCalc, advanced, visible_in_modes:modes||['quick','engineering','cost','audit'], required_for_calculation:requiredForCalc };
};

// ────────────────────────────────────────────────────────────
// 3. Input definitions
// ────────────────────────────────────────────────────────────

const INPUT_DEFS = [
  // required
  { id:'batch_quantity',                  name:'Batch Quantity',                  sym:'Q_batch', kind:'dimensionless', base:'ratio',  min:1, max:10000000,    req:true, crit:'CRITICAL', engMin:1,   engMax:100000,   engSrc:'batch size from production plan',                              src:'production plan or work order',              refNote:'Batch quantity for this production run.',                                        group:0 },
  { id:'material_cost_per_unit',          name:'Material Cost per Unit',          sym:'C_mat',   kind:'money',          base:'currency_unit', min:0,                req:true, crit:'CRITICAL', engMin:0.01,engMax:50000,    engSrc:'material cost from supplier quote or BOM',                       src:'supplier quote or BOM',                      refNote:'Raw material cost per unit. Exclude scrap allowance.',                       group:1 },
  { id:'cycle_time_seconds_per_unit',     name:'Cycle Time per Unit',             sym:'t_c',     kind:'time',           base:'s',     min:0,                   req:true, crit:'CRITICAL', engMin:1,   engMax:3600,    engSrc:'time study or CAM estimate',                                     src:'time study or CAM estimate',                 refNote:'Machine cycle time per unit, excluding setup.',                               group:2 },
  { id:'setup_time_minutes_per_batch',    name:'Setup Time per Batch',            sym:'t_su',    kind:'time',           base:'min',   min:0,                   req:true, crit:'CRITICAL', engMin:5,   engMax:480,    engSrc:'setup log or process sheet',                                      src:'setup log or process sheet',                 refNote:'Total setup time absorbed across the whole batch.',                           group:2 },
  { id:'machine_rate_per_hour',           name:'Machine Hourly Rate',             sym:'R_m',     kind:'money',          base:'currency_unit_per_h', min:0,          req:true, crit:'CRITICAL', engMin:10,  engMax:5000,   engSrc:'shop rate proof',                                                  src:'shop rate proof',                            refNote:'Fully loaded machine hourly rate including energy, maintenance, and depreciation.', group:3 },
  { id:'labor_rate_per_hour',             name:'Labor Rate per Hour',             sym:'R_l',     kind:'money',          base:'currency_unit_per_h', min:0,          req:true, crit:'CRITICAL', engMin:15,  engMax:300,    engSrc:'labor cost from payroll or collective agreement',                 src:'payroll or collective agreement',             refNote:'Average loaded labor rate per operator-hour.',                                 group:3 },
  { id:'operator_count',                  name:'Number of Operators',             sym:'N_op',    kind:'dimensionless',  base:'ratio',  min:0, max:20,           req:true, crit:'HIGH',     engMin:1,   engMax:10,     engSrc:'process staffing plan',                                            src:'process staffing plan',                      refNote:'Operators required per shift for this job.',                                  group:2 },
  { id:'annual_unallocated_overhead',    name:'Annual Unallocated Overhead',     sym:'C_oh',    kind:'money',          base:'currency_unit', min:0,                req:true, crit:'HIGH',     engMin:1000,engMax:5000000,engSrc:'annual budget or P&L statement',                                    src:'annual budget or P&L statement',              refNote:'Annual overhead costs not already included in machine or labor rates.',        group:4 },
  { id:'annual_volume_units',             name:'Annual Volume',                   sym:'V_ann',   kind:'dimensionless',  base:'ratio',  min:1, max:100000000,    req:true, crit:'HIGH',     engMin:100, engMax:10000000,engSrc:'annual forecast or sales history',                                 src:'annual forecast or sales history',             refNote:'Total annual unit volume across all batches of this product.',                group:4 },
  { id:'scrap_rework_percent',            name:'Scrap / Rework Rate',             sym:'p_scr',   kind:'dimensionless',  base:'percent',min:0, max:99,            req:true, crit:'HIGH',     engMin:0,   engMax:15,     engSrc:'quality records or process capability study',                        src:'quality records or process capability study',  refNote:'Percentage of units expected to be scrapped or reworked.',                    group:5 },
  { id:'target_revenue_margin_percent',   name:'Target Revenue Margin',           sym:'M_tgt',   kind:'dimensionless',  base:'percent',min:0, max:99,            req:true, crit:'HIGH',     engMin:5,   engMax:60,     engSrc:'company pricing policy or target margin',                           src:'company pricing policy or target margin',      refNote:'Target margin as a percentage of revenue (selling price).',                   group:5 },
  // optional
  { id:'tooling_consumables_cost_per_batch',   name:'Tooling and Consumables Cost per Batch', sym:'C_tool', kind:'money', base:'currency_unit', min:0,     req:false, crit:'LOW',  engMin:0, engMax:50000,   engSrc:'tooling cost estimate',                    src:'tooling cost estimate',               refNote:'Per-batch cost of cutting tools, inserts, coolant, etc.',           group:6 },
  { id:'external_processing_cost_per_batch',  name:'External Processing Cost per Batch',    sym:'C_ext',  kind:'money', base:'currency_unit', min:0,     req:false, crit:'LOW',  engMin:0, engMax:100000,  engSrc:'subcontractor or supplier quote',          src:'subcontractor or supplier quote',      refNote:'Heat treat, plating, coating, or other external operations.',        group:6 },
  { id:'packaging_cost_per_batch',            name:'Packaging Cost per Batch',                sym:'C_pkg',  kind:'money', base:'currency_unit', min:0,     req:false, crit:'LOW',  engMin:0, engMax:50000,   engSrc:'packaging supplier quote',                src:'packaging supplier quote',            refNote:'Cost of packaging materials and labor per batch.',                    group:6 },
  { id:'freight_cost_per_batch',              name:'Freight Cost per Batch',                  sym:'C_frt',  kind:'money', base:'currency_unit', min:0,     req:false, crit:'LOW',  engMin:0, engMax:50000,   engSrc:'freight carrier quote',                   src:'freight carrier quote',               refNote:'Shipping and freight cost per batch.',                              group:6 },
  { id:'other_job_cost_per_batch',            name:'Other Job Cost per Batch',                sym:'C_oth',  kind:'money', base:'currency_unit', min:0,     req:false, crit:'LOW',  engMin:0, engMax:50000,   engSrc:'miscellaneous cost estimate',              src:'miscellaneous cost estimate',          refNote:'Any other job-specific costs not captured above.',                     group:6 },
  { id:'contingency_percent',                 name:'Contingency Allowance',                   sym:'p_con',  kind:'dimensionless', base:'percent', min:0, max:50, req:false, crit:'LOW', engMin:0, engMax:15, engSrc:'project risk assessment',              src:'project risk assessment',              refNote:'Contingency as a percentage of direct cost before scrap.',             group:7 },
  { id:'current_quote_per_unit',              name:'Current Quote per Unit',                  sym:'Q_cur',  kind:'money', base:'currency_unit', min:0,     req:false, crit:'LOW',  engMin:0, engMax:50000,   engSrc:'existing customer quote',                 src:'existing customer quote',             refNote:'Current quoted price per unit for comparison.',                      group:7 },
];

// Build full input objects
const INPUTS = INPUT_DEFS.map((d,i) => {
  const grp = INPUT_GROUPS[d.group];
  const modes = d.req ? ['quick','engineering','cost','audit'] : ['cost','audit'];
  return {
    id:d.id, name:d.name, symbol:d.sym, quantity_kind:d.kind, unit_selectable:true,
    base_unit:d.base, allowed_display_units:displayUnits(d.kind,d.base), normalized_id:`n_${d.id}`,
    type:'number', required:d.req, criticality:d.crit, allowed_values:[],
    confidence_label:'NEEDS_SOURCE_VERIFICATION',
    physical_hard_bounds: physBounds(d.min, d.max != null ? d.max : (d.kind==='money'?100000000:d.kind==='time'?86400:100000), d.base),
    engineering_range: engRange(d.engMin, d.engMax, d.base, d.engSrc),
    resolution:null, precision_policy:{...PRECISION}, default_policy:'NO_DEFAULT', default_value:null, smart_defaults:[],
    reference_values: refValues(d.src, d.refNote), source_priority:[...srcPri], source:d.src,
    evidence_requirement: evidenceReq(d.src), standard_clause_bindings:[],
    formula_bindings:[], output_bindings:[], warning_bindings:[],
    ui_binding: uiBinding(grp.id, grp.order, { advanced:!d.req, modes, requiredForCalc:d.req }),
    user_help_text: `Use the project-specific value for ${d.name}. Reference ranges are advisory and must not be used as automatic defaults.`,
    warning_if_missing_or_estimated: `Estimated or missing ${d.name} can flip the decision state and will downgrade evidence confidence.`
  };
});

// ────────────────────────────────────────────────────────────
// 4. Formulas
// ────────────────────────────────────────────────────────────

const FORMULA_DEFS = [
  { id:'F001', name:'Run machine hours',                    uses:['n_batch_quantity','n_cycle_time_seconds_per_unit'],                                                    out:'out_run_machine_hours',                    role:'INTERMEDIATE' },
  { id:'F002', name:'Setup hours',                          uses:['n_setup_time_minutes_per_batch'],                                                                          out:'out_setup_hours',                          role:'INTERMEDIATE' },
  { id:'F003', name:'Total machine hours',                  uses:['n_batch_quantity','n_cycle_time_seconds_per_unit','n_setup_time_minutes_per_batch'],                    out:'out_total_machine_hours',                  role:'INTERMEDIATE' },
  { id:'F004', name:'Labor hours per batch',                uses:['n_operator_count','n_cycle_time_seconds_per_unit','n_batch_quantity','n_setup_time_minutes_per_batch'], out:'out_labor_hours_per_batch',                role:'INTERMEDIATE' },
  { id:'F005', name:'Material cost before scrap',           uses:['n_material_cost_per_unit','n_batch_quantity'],                                                           out:'out_material_cost_before_scrap',           role:'COST_COMPONENT' },
  { id:'F006', name:'Machine cost per batch',               uses:['n_machine_rate_per_hour','n_cycle_time_seconds_per_unit','n_batch_quantity','n_setup_time_minutes_per_batch'], out:'out_machine_cost_per_batch',           role:'COST_COMPONENT' },
  { id:'F007', name:'Labor cost per batch',                 uses:['n_labor_rate_per_hour','n_operator_count','n_cycle_time_seconds_per_unit','n_batch_quantity','n_setup_time_minutes_per_batch'], out:'out_labor_cost_per_batch', role:'COST_COMPONENT' },
  { id:'F008', name:'Overhead cost per batch',              uses:['n_annual_unallocated_overhead','n_annual_volume_units','n_batch_quantity'],                              out:'out_overhead_cost_per_batch',              role:'COST_COMPONENT' },
  { id:'F009', name:'Tooling and consumables per batch',    uses:['n_tooling_consumables_cost_per_batch'],                                                                   out:'out_tooling_consumables_cost_per_batch',   role:'COST_COMPONENT' },
  { id:'F010', name:'External processing per batch',        uses:['n_external_processing_cost_per_batch'],                                                                  out:'out_external_processing_cost_per_batch',   role:'COST_COMPONENT' },
  { id:'F011', name:'Packaging cost per batch',             uses:['n_packaging_cost_per_batch'],                                                                             out:'out_packaging_cost_per_batch',             role:'COST_COMPONENT' },
  { id:'F012', name:'Freight cost per batch',               uses:['n_freight_cost_per_batch'],                                                                               out:'out_freight_cost_per_batch',               role:'COST_COMPONENT' },
  { id:'F013', name:'Other job cost per batch',             uses:['n_other_job_cost_per_batch'],                                                                             out:'out_other_job_cost_per_batch',             role:'COST_COMPONENT' },
  { id:'F014', name:'Direct cost before scrap',             uses:['n_material_cost_per_unit','n_batch_quantity','n_machine_rate_per_hour','n_cycle_time_seconds_per_unit','n_setup_time_minutes_per_batch','n_labor_rate_per_hour','n_operator_count','n_annual_unallocated_overhead','n_annual_volume_units','n_tooling_consumables_cost_per_batch','n_external_processing_cost_per_batch','n_packaging_cost_per_batch','n_freight_cost_per_batch','n_other_job_cost_per_batch'], out:'out_direct_cost_before_scrap', role:'INTERMEDIATE' },
  { id:'F015', name:'Scrap and rework allowance',           uses:['n_scrap_rework_percent'],                                                                                 out:'out_scrap_rework_allowance',               role:'INTERMEDIATE' },
  { id:'F016', name:'Contingency allowance',                uses:['n_contingency_percent'],                                                                                  out:'out_contingency_allowance',                role:'INTERMEDIATE' },
  { id:'F017', name:'Total job cost per batch',             uses:['n_batch_quantity','n_scrap_rework_percent','n_contingency_percent'],                                     out:'out_total_job_cost_per_batch',             role:'PRIMARY' },
  { id:'F018', name:'Cost per good unit',                   uses:['n_batch_quantity'],                                                                                       out:'out_cost_per_good_unit',                   role:'PRIMARY' },
  { id:'F019', name:'Target sell price per batch',          uses:['n_target_revenue_margin_percent'],                                                                        out:'out_target_sell_price_per_batch',          role:'PRIMARY' },
  { id:'F020', name:'Target sell price per unit',           uses:['n_batch_quantity'],                                                                                       out:'out_target_sell_price_per_unit',           role:'PRIMARY' },
  { id:'F021', name:'Profit per batch',                     uses:[],                                                                                                          out:'out_profit_per_batch',                     role:'PRIMARY' },
  { id:'F022', name:'Profit per unit',                      uses:['n_batch_quantity'],                                                                                       out:'out_profit_per_unit',                      role:'PRIMARY' },
  { id:'F023', name:'Annual batches',                       uses:['n_annual_volume_units','n_batch_quantity'],                                                               out:'out_annual_batches',                       role:'INTERMEDIATE' },
  { id:'F024', name:'Annual revenue at target price',       uses:['n_annual_volume_units'],                                                                                  out:'out_annual_revenue_at_target',             role:'BUSINESS_IMPACT' },
  { id:'F025', name:'Annual profit at target price',        uses:['n_annual_volume_units'],                                                                                  out:'out_annual_profit_at_target',              role:'BUSINESS_IMPACT' },
  { id:'F026', name:'Primary cost driver identification',   uses:['n_material_cost_per_unit','n_batch_quantity','n_machine_rate_per_hour','n_cycle_time_seconds_per_unit','n_setup_time_minutes_per_batch','n_labor_rate_per_hour','n_operator_count','n_annual_unallocated_overhead','n_annual_volume_units','n_tooling_consumables_cost_per_batch','n_external_processing_cost_per_batch','n_packaging_cost_per_batch','n_freight_cost_per_batch','n_other_job_cost_per_batch'], out:'out_primary_cost_driver', role:'DIAGNOSTIC' },
  { id:'F027', name:'Final decision state',                 uses:['n_scrap_rework_percent','n_target_revenue_margin_percent'],                                              out:'out_final_decision_state',                 role:'DECISION' },
  // Optional comparison formulas
  { id:'F028', name:'Current quote per batch',              uses:['n_current_quote_per_unit','n_batch_quantity'],                                                           out:'out_current_quote_per_batch',              role:'INTERMEDIATE' },
  { id:'F029', name:'Current profit per batch',             uses:[],                                                                                                          out:'out_current_profit_per_batch',             role:'INTERMEDIATE' },
  { id:'F030', name:'Achieved revenue margin',              uses:[],                                                                                                          out:'out_achieved_margin_percent',              role:'DIAGNOSTIC' },
  { id:'F031', name:'Price gap per unit',                   uses:['n_current_quote_per_unit'],                                                                               out:'out_price_gap_per_unit',                   role:'DIAGNOSTIC' },
  { id:'F032', name:'Annual underpricing risk',             uses:['n_annual_volume_units'],                                                                                  out:'out_annual_underpricing_risk',             role:'BUSINESS_IMPACT' },
  { id:'F033', name:'Break-even batch quantity',            uses:['n_machine_rate_per_hour','n_labor_rate_per_hour','n_operator_count','n_material_cost_per_unit','n_setup_time_minutes_per_batch','n_cycle_time_seconds_per_unit','n_current_quote_per_unit'], out:'out_break_even_batch_quantity', role:'DIAGNOSTIC' },
  { id:'F034', name:'Break-even status',                    uses:['n_batch_quantity'],                                                                                       out:'out_break_even_status',                    role:'DECISION' },
];

// Build formula-binding map
const nidToFids = {};
for (const fd of FORMULA_DEFS) {
  for (const u of fd.uses) {
    if (!nidToFids[u]) nidToFids[u] = [];
    nidToFids[u].push(fd.id);
  }
}
// Assign formula_bindings to inputs
for (const inp of INPUTS) {
  inp.formula_bindings = nidToFids[inp.normalized_id] || [];
  inp.output_bindings = FORMULA_DEFS.filter(f => f.uses.includes(inp.normalized_id)).map(f => f.out);
  inp.warning_bindings = ['W001','W002','W003','W004'];
}

// ────────────────────────────────────────────────────────────
// 5. Normalized inputs
// ────────────────────────────────────────────────────────────
const NORMALIZED_INPUTS = INPUTS.map(inp => ({
  id: inp.normalized_id, from_input: inp.id, quantity_kind: inp.quantity_kind, base_unit: inp.base_unit,
  conversion_source: 'unit_conversion_contract.conversion_registry',
  validation_after_conversion: [
    `Apply physical hard bounds for ${inp.id} after unit conversion.`,
    `Evaluate engineering reference range for ${inp.id} after conversion.`,
    `Reject non-finite normalized value for ${inp.id}.`
  ],
  audit_required: true
}));

// ────────────────────────────────────────────────────────────
// 6. Output definitions
// ────────────────────────────────────────────────────────────
const CORE_OUTPUTS = [
  { id:'out_run_machine_hours',                name:'Run Machine Hours',                sym:'h_m_run',   qk:'time',         bu:'h',             dec:2, role:'INTERMEDIATE' },
  { id:'out_setup_hours',                      name:'Setup Hours',                      sym:'h_setup',   qk:'time',         bu:'h',             dec:2, role:'INTERMEDIATE' },
  { id:'out_total_machine_hours',              name:'Total Machine Hours',              sym:'h_total',   qk:'time',         bu:'h',             dec:2, role:'INTERMEDIATE' },
  { id:'out_labor_hours_per_batch',            name:'Labor Hours per Batch',            sym:'h_lab',     qk:'time',         bu:'h',             dec:2, role:'INTERMEDIATE' },
  { id:'out_material_cost_before_scrap',       name:'Material Cost (before scrap)',     sym:'C_mat_batch',   qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_machine_cost_per_batch',           name:'Machine Cost per Batch',           sym:'C_mach_batch',  qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_labor_cost_per_batch',             name:'Labor Cost per Batch',             sym:'C_lab_batch',   qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_overhead_cost_per_batch',          name:'Overhead Cost per Batch',          sym:'C_oh_batch',    qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_tooling_consumables_cost_per_batch',  name:'Tooling and Consumables per Batch', sym:'C_tool_batch', qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_external_processing_cost_per_batch',  name:'External Processing per Batch', sym:'C_ext_batch',   qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_packaging_cost_per_batch',            name:'Packaging Cost per Batch',      sym:'C_pkg_batch',   qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_freight_cost_per_batch',              name:'Freight Cost per Batch',        sym:'C_frt_batch',   qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_other_job_cost_per_batch',            name:'Other Job Cost per Batch',      sym:'C_oth_batch',   qk:'currency', bu:'currency_unit', dec:2, role:'COST_COMPONENT' },
  { id:'out_direct_cost_before_scrap',            name:'Direct and Allocated Cost before Scrap', sym:'C_direct', qk:'currency', bu:'currency_unit', dec:2, role:'INTERMEDIATE' },
  { id:'out_scrap_rework_allowance',              name:'Scrap and Rework Allowance',    sym:'C_scr',         qk:'currency', bu:'currency_unit', dec:2, role:'INTERMEDIATE' },
  { id:'out_contingency_allowance',               name:'Contingency Allowance',         sym:'C_con',         qk:'currency', bu:'currency_unit', dec:2, role:'INTERMEDIATE' },
  { id:'out_total_job_cost_per_batch',            name:'Total Job Cost per Batch',      sym:'C_total',       qk:'currency', bu:'currency_unit', dec:2, role:'PRIMARY' },
  { id:'out_cost_per_good_unit',                  name:'Cost per Good Unit',            sym:'C_unit',        qk:'currency', bu:'currency_unit', dec:4, role:'PRIMARY' },
  { id:'out_target_sell_price_per_batch',         name:'Target Sell Price per Batch',   sym:'P_sell_batch',  qk:'currency', bu:'currency_unit', dec:2, role:'PRIMARY' },
  { id:'out_target_sell_price_per_unit',          name:'Target Sell Price per Unit',    sym:'P_sell_unit',   qk:'currency', bu:'currency_unit', dec:4, role:'PRIMARY' },
  { id:'out_profit_per_batch',                    name:'Profit per Batch',              sym:'P_prof_batch',  qk:'currency', bu:'currency_unit', dec:2, role:'PRIMARY' },
  { id:'out_profit_per_unit',                     name:'Profit per Unit',               sym:'P_prof_unit',   qk:'currency', bu:'currency_unit', dec:4, role:'PRIMARY' },
  { id:'out_annual_batches',                      name:'Annual Batches',                sym:'N_batches',     qk:'dimensionless', bu:'ratio',   dec:0, role:'INTERMEDIATE', showUnit:false },
  { id:'out_annual_revenue_at_target',            name:'Annual Revenue at Target Price',sym:'R_ann',         qk:'currency', bu:'currency_unit', dec:2, role:'BUSINESS_IMPACT' },
  { id:'out_annual_profit_at_target',             name:'Annual Profit at Target Price', sym:'P_ann',         qk:'currency', bu:'currency_unit', dec:2, role:'BUSINESS_IMPACT' },
  { id:'out_primary_cost_driver',                 name:'Primary Cost Driver',           sym:'driver',        qk:'dimensionless', bu:'ratio', dec:0, role:'DIAGNOSTIC', showUnit:false },
  { id:'out_final_decision_state',                name:'Final Decision State',          sym:'state',         qk:'dimensionless', bu:'ratio', dec:0, role:'DECISION', showUnit:false },
];

const OPTIONAL_OUTPUTS = [
  { id:'out_current_quote_per_batch',      name:'Current Quote per Batch',       sym:'Q_cur_batch', qk:'currency', bu:'currency_unit', dec:2, role:'INTERMEDIATE' },
  { id:'out_current_profit_per_batch',     name:'Current Profit per Batch',      sym:'P_cur_batch', qk:'currency', bu:'currency_unit', dec:2, role:'INTERMEDIATE' },
  { id:'out_achieved_margin_percent',      name:'Achieved Revenue Margin',       sym:'m_cur',       qk:'dimensionless', bu:'percent', dec:2, role:'DIAGNOSTIC' },
  { id:'out_price_gap_per_unit',           name:'Price Gap per Unit',            sym:'gap_unit',    qk:'currency', bu:'currency_unit', dec:4, role:'DIAGNOSTIC' },
  { id:'out_annual_underpricing_risk',     name:'Annual Underpricing Risk',      sym:'risk_ann',    qk:'currency', bu:'currency_unit', dec:2, role:'BUSINESS_IMPACT' },
  { id:'out_break_even_batch_quantity',    name:'Break-Even Batch Quantity',     sym:'BE_qty',      qk:'dimensionless', bu:'ratio',   dec:0, role:'DIAGNOSTIC', showUnit:false },
  { id:'out_break_even_status',            name:'Break-Even Status',             sym:'BE_status',   qk:'dimensionless', bu:'ratio',   dec:0, role:'DECISION', showUnit:false },
];
const ALL_OUTPUTS = [...CORE_OUTPUTS, ...OPTIONAL_OUTPUTS];

// ────────────────────────────────────────────────────────────
// 7. Build full schema from clone
// ────────────────────────────────────────────────────────────

// Tool identity
S.tool_id = 'PRO_024';
S.tool_key = TK;
S.tool_name = 'Job Quote Builder Pro Pack';
S.category = 'Workshop Pricing';
S.scope = 'Build a defensible job quote from material, machine, labor, overhead, scrap, and margin inputs.';
S.primary_operation = 'job_quote_builder_pro';

// Decision context
S.decision_context.system_boundary = S.scope;
S.decision_context.single_operation_scope = S.primary_operation;
S.decision_context.primary_metric = 'total job cost per batch, cost per good unit, target sell price, profit per batch';
S.decision_context.secondary_metrics = ['evidence completeness','uncertainty band','dominant sensitivity driver','money at risk','FMEA trigger state'];

// Other top-level
S.irreversible_commitment_metric = 'total job cost per batch, cost per good unit, target sell price, profit per batch';
S.standards = ['job costing context','activity-based costing context'];
S.standards_clause_map = [];
S.reference_status = 'STANDARDS_CONTEXT_ONLY_EXACT_CLAUSES_USER_MUST_VERIFY';
S.risk_level = 'MEDIUM';
S.brand_safety_policy.allowed_description = 'Generic professional job costing evidence pattern';
S.calculation_basis.decision_depth = 'multi-stage demand, capacity, uncertainty, sensitivity, FMEA, and business-impact decision graph';

// Arrays
S.inputs = INPUTS;
S.normalized_inputs = NORMALIZED_INPUTS;
S.formulas = FORMULA_DEFS.map(fd => ({
  id: fd.id, name: fd.name,
  visibility: { public_ui:false, public_export:false, internal_admin_trace:true },
  expression: 'INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI',
  uses: fd.uses, output: fd.out, unit: 'mixed_public_safe_contract', proof_role: fd.role,
  standard_clause_bindings: [], input_bindings: [],
  normalized_input_bindings: fd.uses.filter(u => u.startsWith('n_')),
  output_bindings: [fd.out],
  assumptions: [`${fd.name} is evaluated through the protected server formula registry using source-backed normalized inputs.`],
  limitations: [
    'This schema is decision-support only and does not replace qualified engineering, metrology, safety, financial, legal, or regulatory review.',
    'Exact formula trace is restricted to server-side admin or test context and is excluded from public proof packs.',
    'Use outside the declared scope requires a new approved schema and formula registry entry.'
  ],
  edge_cases: [
    'Zero or near-zero denominator values block execution instead of returning non-finite results.',
    'Uncertainty bands crossing the acceptance threshold move the result to review or blocked state according to risk level.',
    'Missing evidence on critical values prevents false PASS results.'
  ],
  public_proof_summary: `${fd.name} is evaluated through the protected server formula registry using source-backed normalized inputs.`,
  protected_methodology_summary: 'The public report shows method intent, governing driver, uncertainty, sensitivity, and decision impact without exposing exact job-quote-builder-pro-pack expressions.',
  checker_note: 'Checker can reproduce the result only through approved schema version, formula version, normalized input hash, and restricted internal trace.',
  acceptance_logic: 'PASS is possible only when margin, uncertainty, evidence, and reference-range status remain inside configured server thresholds.',
  rejection_logic: 'REJECT or BLOCKED is returned when hard bounds, evidence blockers, non-finite values, or redaction failures occur.',
  review_required_logic: 'REVIEW is required when values are near thresholds, evidence is partial, uncertainty crosses a threshold, or FMEA is triggered.',
  uncertainty_expression: 'INTERNAL_SERVER_ONLY_UNCERTAINTY_EXPRESSION_NOT_FOR_PUBLIC_UI',
  formula_leak_risk: 'MEDIUM',
  public_formula_expression_policy: 'FORBIDDEN'
}));
S.outputs = ALL_OUTPUTS.map(o => ({
  id: o.id, name: o.name, symbol: o.sym, quantity_kind: o.qk, base_unit: o.bu,
  allowed_display_units: displayUnits(o.qk, o.bu), type: 'number',
  decision_use: o.role, proof_status_role: o.role,
  output_format: { decimals: o.dec, rounding: 'DISPLAY_ONLY', show_unit: o.showUnit !== false }
}));

// Derating
S.derating_contract = {
  enabled: true,
  rules: [
    { id:'D001', name:'Evidence confidence derating', driver_input:'source_confidence_ratio',
      affected_inputs:['machine_rate_per_hour','cycle_time_seconds_per_unit','setup_time_minutes_per_batch','batch_quantity','material_cost_per_unit','labor_rate_per_hour','annual_unallocated_overhead'],
      affected_formulas:['F001','F002','F003','F004','F005','F006','F007','F008'],
      affected_outputs:['out_total_job_cost_per_batch','out_target_sell_price_per_batch','out_final_decision_state'],
      derating_source:'INTERNAL_POLICY', source_status:'USER_MUST_VERIFY',
      public_note:'Low source confidence can derate the public decision status without changing measured values.',
      paid_standard_table_reproduction:'FORBIDDEN', missing_derating_data_behavior:'REVIEW' },
    { id:'D002', name:'Margin threshold derating', driver_input:'target_revenue_margin_percent',
      affected_inputs:['batch_quantity','material_cost_per_unit','cycle_time_seconds_per_unit','machine_rate_per_hour','labor_rate_per_hour','annual_unallocated_overhead','annual_volume_units','scrap_rework_percent'],
      affected_formulas:['F008','F009','F011','F017','F019'],
      affected_outputs:['out_final_decision_state','out_profit_per_batch','out_annual_profit_at_target'],
      derating_source:'INTERNAL_POLICY', source_status:'PARTIALLY_VERIFIED',
      public_note:'Margin below target triggers review or blocked state depending on risk level.',
      paid_standard_table_reproduction:'FORBIDDEN', missing_derating_data_behavior:'REVIEW' }
  ]
};

// Decision interpretation
S.decision_interpretation_contract.fields.money_impact_summary.primary_output = 'out_annual_profit_at_target';
S.decision_interpretation_contract.fields.premium_unlock_reason = 'This PRO tool converts job costing inputs into auditable pricing evidence and profit-at-risk output.';

// Business impact
S.business_impact_contract.impact_types = ['quote_margin','pricing'];
S.business_impact_contract.required_outputs = ['out_annual_profit_at_target','out_primary_cost_driver','out_final_decision_state'];
S.business_impact_contract.money_at_risk_output_id = 'out_annual_underpricing_risk';
S.business_impact_contract.main_cost_driver_output_id = 'out_primary_cost_driver';
S.business_impact_contract.quote_or_decision_impact_output_id = 'out_final_decision_state';
S.business_impact_contract.public_value_statement = 'Shows the pricing exposure and profit impact attached to a job quote without hidden FX or unsupported assumptions.';
S.business_impact_contract.premium_unlock_reason = 'Connects engineering evidence, quality risk, material cost, and overhead to a defendable pricing decision.';

// Safety factor gauges
S.safety_factor_gauges = [
  { id:'g_margin', name:'Margin Gauge', source_output:'out_profit_per_unit',
    states:[
      { state:'PASS', label:'PASS', technical_message:'Target margin is achieved and all thresholds are inside server limits.' },
      { state:'REVIEW', label:'REVIEW', technical_message:'Threshold proximity or evidence limitation requires review.' },
      { state:'WARNING', label:'WARNING', technical_message:'Decision can flip with realistic input correction.' },
      { state:'CRITICAL', label:'CRITICAL', technical_message:'Unsafe, uneconomic, or unacceptable margin is likely.' },
      { state:'BLOCKED', label:'BLOCKED', technical_message:'Execution is blocked by hard-bound, evidence, unit, or redaction failure.' }
    ]},
  { id:'g_confidence', name:'Evidence Confidence Gauge', source_output:'out_final_decision_state',
    states:[
      { state:'PASS', label:'PASS', technical_message:'Critical evidence is complete and source trace is coherent.' },
      { state:'REVIEW', label:'REVIEW', technical_message:'Some evidence is partial but not blocking.' },
      { state:'WARNING', label:'WARNING', technical_message:'Evidence weakness can change decision.' },
      { state:'CRITICAL', label:'CRITICAL', technical_message:'Critical evidence gap undermines result.' },
      { state:'BLOCKED', label:'BLOCKED', technical_message:'Missing evidence blocks calculation.' }
    ]}
];

// Proof pack
S.proof_pack.purpose = 'Generate review-ready pricing evidence for internal review, audit discussion, and commercial documentation.';

// UI contract
S.ui_contract.input_groups = INPUT_GROUPS.map(g => ({ id:g.id, title:g.title, description:g.desc, order:g.order, visible_in_modes:g.modes }));

// Reference code
S.reference_code.golden_fixture_path = `tests/golden/pro/${TK}.fixture.json`;
S.reference_code.golden_hash_path = `tests/golden/hashes/${TK}.hashes.json`;

// Metadata
S.metadata.change_log_summary = `Initial generated PRO schema package for ${TK} controlled engineering QA import.`;
S.metadata.tool_specific_quality_matrix = ref.metadata.tool_specific_quality_matrix.map(qg => ({
  ...qg, tool_key: TK,
  control_objective: qg.control_objective.replace(/Machine Hourly Rate Proof Report/g, 'Job Quote Builder Pro Pack')
}));

// ────────────────────────────────────────────────────────────
// 8. Write
// ────────────────────────────────────────────────────────────
writeFileSync(OUT_PATH, JSON.stringify(S, null, 2) + '\n', 'utf-8');
console.log(`Wrote schema: ${OUT_PATH}`);
console.log(`  Inputs: ${S.inputs.length} (${INPUT_DEFS.filter(d=>d.req).length} required, ${INPUT_DEFS.filter(d=>!d.req).length} optional)`);
console.log(`  Formulas: ${S.formulas.length}`);
console.log(`  Outputs: ${S.outputs.length} (${CORE_OUTPUTS.length} core, ${OPTIONAL_OUTPUTS.length} optional)`);
console.log(`  Top-level keys: ${Object.keys(S).length}`);
