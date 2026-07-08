// SectorCalc — PRO Tool Schema Fix Script
// Fixes input key mapping for 10 broken schemas (tools 11-20)
// Ensures schema input IDs match formula expected input keys

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, '..', 'src', 'sectorcalc', 'schemas', 'pro-v531');

// ============================================================
// CORRECT INPUT DEFINITIONS FOR EACH BROKEN TOOL
// format: { display_id, normalized_id, name, symbol, quantity_kind, base_unit, type }
// ============================================================

const INPUT_TEMPLATES = {
  // === Tool 11: customer-sku-profitability-forensics ===
  'customer-sku-profitability-forensics': [
    { display_id: 'unit_price',          normalized_id: 'n_unit_price',            name: 'Unit Price',              symbol: 'UP',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'unit_variable_cost',  normalized_id: 'n_unit_variable_cost',    name: 'Unit Variable Cost',      symbol: 'UVC',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'annual_volume',       normalized_id: 'n_annual_volume',         name: 'Annual Volume',           symbol: 'AV',   quantity_kind: 'rate',          base_unit: 'unit_per_s',            type: 'number' },
    { display_id: 'logistics_cost_pct',  normalized_id: 'n_logistics_cost_pct',    name: 'Logistics Cost %',        symbol: 'LC',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'service_cost_pct',    normalized_id: 'n_service_cost_pct',      name: 'Service Cost %',          symbol: 'SC',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'return_rate_pct',     normalized_id: 'n_return_rate_pct',       name: 'Return Rate %',           symbol: 'RR',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'target_margin',       normalized_id: 'n_target_margin',         name: 'Target Margin',           symbol: 'TM',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'labor_rate',          normalized_id: 'n_labor_rate',            name: 'Labor Rate',              symbol: 'LR',   quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'overhead_rate',       normalized_id: 'n_overhead_rate',         name: 'Overhead Rate',           symbol: 'OH',   quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'source_confidence',   normalized_id: 'n_source_confidence_ratio', name: 'Source Confidence Ratio', symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 12: downtime-scrap-loss-statement ===
  'downtime-scrap-loss-statement': [
    { display_id: 'productive_hours',    normalized_id: 'n_productive_hours',      name: 'Productive Hours',        symbol: 'PH',   quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'actual_hours',        normalized_id: 'n_actual_hours',          name: 'Actual Hours',            symbol: 'AH',   quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'hourly_rate',         normalized_id: 'n_hourly_rate',           name: 'Hourly Rate',             symbol: 'HR',   quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'scrap_quantity',      normalized_id: 'n_scrap_quantity',        name: 'Scrap Quantity',          symbol: 'SQ',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'unit_cost',           normalized_id: 'n_unit_cost',             name: 'Unit Cost',               symbol: 'UC',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'rework_hours',        normalized_id: 'n_rework_hours',          name: 'Rework Hours',            symbol: 'RH',   quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'rework_rate',         normalized_id: 'n_rework_rate',           name: 'Rework Rate',             symbol: 'RR',   quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'material_cost',       normalized_id: 'n_material_cost',         name: 'Material Cost',           symbol: 'MC',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'defect_rate_pct',     normalized_id: 'n_defect_rate_pct',       name: 'Defect Rate %',           symbol: 'DR',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'source_confidence',   normalized_id: 'n_source_confidence_ratio', name: 'Source Confidence Ratio', symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 13: oee-loss-monetization-improvement-business-case ===
  'oee-loss-monetization-improvement-business-case': [
    { display_id: 'planned_production_time', normalized_id: 'n_planned_production_time', name: 'Planned Production Time', symbol: 'PPT', quantity_kind: 'time',       base_unit: 's',     type: 'number' },
    { display_id: 'operating_time',          normalized_id: 'n_operating_time',          name: 'Operating Time',          symbol: 'OT',  quantity_kind: 'time',       base_unit: 's',     type: 'number' },
    { display_id: 'net_operating_time',      normalized_id: 'n_net_operating_time',      name: 'Net Operating Time',      symbol: 'NOT', quantity_kind: 'time',       base_unit: 's',     type: 'number' },
    { display_id: 'valuable_operating_time', normalized_id: 'n_valuable_operating_time', name: 'Valuable Operating Time',  symbol: 'VOT', quantity_kind: 'time',       base_unit: 's',     type: 'number' },
    { display_id: 'ideal_cycle_time',        normalized_id: 'n_ideal_cycle_time',        name: 'Ideal Cycle Time',        symbol: 'ICT', quantity_kind: 'time',       base_unit: 's',     type: 'number' },
    { display_id: 'total_parts',             normalized_id: 'n_total_parts',             name: 'Total Parts',             symbol: 'TP',  quantity_kind: 'dimensionless', base_unit: 'ratio', type: 'number' },
    { display_id: 'good_parts',              normalized_id: 'n_good_parts',              name: 'Good Parts',              symbol: 'GP',  quantity_kind: 'dimensionless', base_unit: 'ratio', type: 'number' },
    { display_id: 'hourly_contribution',     normalized_id: 'n_hourly_contribution',     name: 'Hourly Contribution',     symbol: 'HC',  quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h', type: 'number' },
    { display_id: 'improvement_cost',        normalized_id: 'n_improvement_cost',        name: 'Improvement Cost',        symbol: 'IC',  quantity_kind: 'currency',     base_unit: 'currency_unit',       type: 'number' },
    { display_id: 'source_confidence',       normalized_id: 'n_source_confidence_ratio', name: 'Source Confidence Ratio',  symbol: 'SCR', quantity_kind: 'dimensionless', base_unit: 'ratio', type: 'number' },
  ],

  // === Tool 14: scrap-rework-cost-tracker ===
  'scrap-rework-cost-tracker': [
    { display_id: 'total_produced',       normalized_id: 'n_total_produced',         name: 'Total Produced',          symbol: 'TP',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'scrap_quantity',       normalized_id: 'n_scrap_quantity',         name: 'Scrap Quantity',          symbol: 'SQ',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'rework_quantity',      normalized_id: 'n_rework_quantity',        name: 'Rework Quantity',         symbol: 'RQ',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'unit_material_cost',   normalized_id: 'n_unit_material_cost',     name: 'Unit Material Cost',      symbol: 'UMC',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'unit_labor_cost',      normalized_id: 'n_unit_labor_cost',        name: 'Unit Labor Cost',         symbol: 'ULC',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'rework_labor_rate',    normalized_id: 'n_rework_labor_rate',      name: 'Rework Labor Rate',       symbol: 'RLR',  quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'rework_time_per_unit', normalized_id: 'n_rework_time_per_unit',   name: 'Rework Time Per Unit',    symbol: 'RTPU', quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'defect_rate_target',   normalized_id: 'n_defect_rate_target_pct', name: 'Defect Rate Target %',    symbol: 'DRT',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'monthly_volume',       normalized_id: 'n_monthly_volume',         name: 'Monthly Volume',          symbol: 'MV',   quantity_kind: 'rate',          base_unit: 'unit_per_s',            type: 'number' },
    { display_id: 'source_confidence',    normalized_id: 'n_source_confidence_ratio',  name: 'Source Confidence Ratio', symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 15: outsource-vs-in-house-analyzer ===
  'outsource-vs-in-house-analyzer': [
    { display_id: 'in_house_material_cost', normalized_id: 'n_in_house_material_cost', name: 'In-House Material Cost',    symbol: 'IHMC', quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'in_house_labor_cost',    normalized_id: 'n_in_house_labor_cost',    name: 'In-House Labor Cost',       symbol: 'IHLC', quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'in_house_overhead',      normalized_id: 'n_in_house_overhead',      name: 'In-House Overhead',         symbol: 'IHO',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'in_house_setup_cost',    normalized_id: 'n_in_house_setup_cost',    name: 'In-House Setup Cost',       symbol: 'IHSC', quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'outsource_unit_price',   normalized_id: 'n_outsource_unit_price',   name: 'Outsource Unit Price',      symbol: 'OUP',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'outsource_logistics',    normalized_id: 'n_outsource_logistics_cost', name: 'Outsource Logistics Cost', symbol: 'OLC', quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'annual_volume',          normalized_id: 'n_annual_volume',           name: 'Annual Volume',             symbol: 'AV',   quantity_kind: 'rate',          base_unit: 'unit_per_s',            type: 'number' },
    { display_id: 'quality_risk_premium',   normalized_id: 'n_quality_risk_premium_pct', name: 'Quality Risk Premium %',  symbol: 'QRP',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'capacity_utilization',   normalized_id: 'n_capacity_utilization_pct', name: 'Capacity Utilization %',  symbol: 'CU',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'source_confidence',      normalized_id: 'n_source_confidence_ratio',   name: 'Source Confidence Ratio',  symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 16: plant-wide-shop-rate-cost-structure-audit ===
  'plant-wide-shop-rate-cost-structure-audit': [
    { display_id: 'total_annual_cost',      normalized_id: 'n_total_annual_cost',       name: 'Total Annual Cost',          symbol: 'TAC',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'total_productive_hours', normalized_id: 'n_total_productive_hours',  name: 'Total Productive Hours',     symbol: 'TPH',  quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'machine_group_cost',     normalized_id: 'n_machine_group_cost',      name: 'Machine Group Cost',         symbol: 'MGC',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'machine_group_hours',    normalized_id: 'n_machine_group_hours',     name: 'Machine Group Hours',        symbol: 'MGH',  quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'overhead_pool',          normalized_id: 'n_overhead_pool',           name: 'Overhead Pool',              symbol: 'OP',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'overhead_allocation_base', normalized_id: 'n_overhead_allocation_base', name: 'Overhead Allocation Base', symbol: 'OAB', quantity_kind: 'rate',          base_unit: 'unit_per_s',            type: 'number' },
    { display_id: 'current_shop_rate',      normalized_id: 'n_current_shop_rate',       name: 'Current Shop Rate',          symbol: 'CSR',  quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'target_margin_pct',      normalized_id: 'n_target_margin_pct',       name: 'Target Margin %',            symbol: 'TM',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'utilization_pct',        normalized_id: 'n_utilization_pct',         name: 'Utilization %',              symbol: 'U',    quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'source_confidence',      normalized_id: 'n_source_confidence_ratio',   name: 'Source Confidence Ratio',   symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 17: fx-commodity-pass-through-pricer ===
  'fx-commodity-pass-through-pricer': [
    { display_id: 'base_price',            normalized_id: 'n_base_price',                name: 'Base Price',                symbol: 'BP',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'fx_rate_spot',          normalized_id: 'n_fx_rate_spot',              name: 'FX Rate (Spot)',            symbol: 'FXS', quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'fx_rate_budget',        normalized_id: 'n_fx_rate_budget',            name: 'FX Rate (Budget)',          symbol: 'FXB', quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'commodity_index_current', normalized_id: 'n_commodity_index_current',  name: 'Commodity Index (Current)', symbol: 'CIC', quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'commodity_index_budget', normalized_id: 'n_commodity_index_budget',    name: 'Commodity Index (Budget)',  symbol: 'CIB', quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'material_cost_pct',     normalized_id: 'n_material_cost_pct',         name: 'Material Cost %',           symbol: 'MCP', quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'fx_hedge_pct',          normalized_id: 'n_fx_hedge_pct',              name: 'FX Hedge %',                symbol: 'FXH', quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'commodity_hedge_pct',   normalized_id: 'n_commodity_hedge_pct',       name: 'Commodity Hedge %',         symbol: 'CH',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'annual_volume',         normalized_id: 'n_annual_volume',             name: 'Annual Volume',             symbol: 'AV',  quantity_kind: 'rate',          base_unit: 'unit_per_s',            type: 'number' },
    { display_id: 'source_confidence',     normalized_id: 'n_source_confidence_ratio',     name: 'Source Confidence Ratio',  symbol: 'SCR', quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 18: energy-efficiency-grant-incentive-feasibility-pack ===
  'energy-efficiency-grant-incentive-feasibility-pack': [
    { display_id: 'current_kwh_per_year',   normalized_id: 'n_current_kwh_per_year',     name: 'Current kWh/Year',          symbol: 'CKWH', quantity_kind: 'energy',       base_unit: 'J',                     type: 'number' },
    { display_id: 'target_kwh_per_year',    normalized_id: 'n_target_kwh_per_year',      name: 'Target kWh/Year',           symbol: 'TKWH', quantity_kind: 'energy',       base_unit: 'J',                     type: 'number' },
    { display_id: 'avg_kwh_rate',           normalized_id: 'n_avg_kwh_rate',             name: 'Avg kWh Rate',              symbol: 'AKR',  quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'implementation_cost',    normalized_id: 'n_implementation_cost',      name: 'Implementation Cost',       symbol: 'IC',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'grant_coverage_pct',     normalized_id: 'n_grant_coverage_pct',       name: 'Grant Coverage %',          symbol: 'GC',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'maintenance_saving',     normalized_id: 'n_maintenance_cost_saving',  name: 'Maintenance Cost Saving',   symbol: 'MCS',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'emission_factor',        normalized_id: 'n_emission_factor_kgco2_per_kwh', name: 'Emission Factor (kgCO₂/kWh)', symbol: 'EF', quantity_kind: 'dimensionless', base_unit: 'ratio',               type: 'number' },
    { display_id: 'equipment_life_years',   normalized_id: 'n_equipment_life_years',     name: 'Equipment Life (Years)',    symbol: 'ELY',  quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'discount_rate',          normalized_id: 'n_discount_rate',            name: 'Discount Rate %',           symbol: 'DR',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'source_confidence',      normalized_id: 'n_source_confidence_ratio',    name: 'Source Confidence Ratio',   symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 19: motor-compressor-replacement-roi ===
  'motor-compressor-replacement-roi': [
    { display_id: 'motor_power_kw',          normalized_id: 'n_motor_power_kw',            name: 'Motor Power (kW)',          symbol: 'MP',   quantity_kind: 'power',        base_unit: 'W',                     type: 'number' },
    { display_id: 'annual_operating_hours',  normalized_id: 'n_annual_operating_hours',    name: 'Annual Operating Hours',    symbol: 'AOH',  quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'current_efficiency_pct',  normalized_id: 'n_current_efficiency_pct',    name: 'Current Efficiency %',      symbol: 'CE',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'new_efficiency_pct',      normalized_id: 'n_new_efficiency_pct',        name: 'New Efficiency %',          symbol: 'NE',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'avg_kwh_rate',            normalized_id: 'n_avg_kwh_rate',              name: 'Avg kWh Rate',              symbol: 'AKR',  quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'replacement_cost',        normalized_id: 'n_replacement_cost',          name: 'Replacement Cost',          symbol: 'RC',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'installation_cost',       normalized_id: 'n_installation_cost',         name: 'Installation Cost',         symbol: 'IC',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'maintenance_saving_yr',   normalized_id: 'n_maintenance_saving_per_year', name: 'Maintenance Saving/Year', symbol: 'MS',  quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'equipment_life_years',    normalized_id: 'n_equipment_life_years',      name: 'Equipment Life (Years)',    symbol: 'ELY',  quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'discount_rate',           normalized_id: 'n_discount_rate',             name: 'Discount Rate %',           symbol: 'DR',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'source_confidence',       normalized_id: 'n_source_confidence_ratio',     name: 'Source Confidence Ratio',  symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],

  // === Tool 20: weld-procedure-cost-consumable-estimation-suite ===
  'weld-procedure-cost-consumable-estimation-suite': [
    { display_id: 'weld_length_m',           normalized_id: 'n_weld_length_m',             name: 'Weld Length (m)',           symbol: 'WL',   quantity_kind: 'length',       base_unit: 'm',                     type: 'number' },
    { display_id: 'weld_throat_mm',          normalized_id: 'n_weld_throat_mm',            name: 'Weld Throat (mm)',          symbol: 'WT',   quantity_kind: 'length',       base_unit: 'm',                     type: 'number' },
    { display_id: 'weld_density',            normalized_id: 'n_weld_density_g_per_cm3',    name: 'Weld Density (g/cm³)',      symbol: 'WD',   quantity_kind: 'density',      base_unit: 'kg_per_m3',             type: 'number' },
    { display_id: 'wire_cost_per_kg',        normalized_id: 'n_wire_cost_per_kg',          name: 'Wire Cost per kg',          symbol: 'WC',   quantity_kind: 'currency',      base_unit: 'currency_unit',         type: 'number' },
    { display_id: 'gas_cost_per_min',        normalized_id: 'n_gas_cost_per_min',          name: 'Gas Cost per Minute',       symbol: 'GC',   quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'arc_time_min',            normalized_id: 'n_arc_time_min',              name: 'Arc Time (min)',            symbol: 'AT',   quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'weld_time_min',           normalized_id: 'n_weld_time_min',             name: 'Weld Time (min)',           symbol: 'WT',   quantity_kind: 'time',          base_unit: 's',                     type: 'number' },
    { display_id: 'labor_rate',              normalized_id: 'n_labor_rate',                name: 'Labor Rate',                symbol: 'LR',   quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'overhead_rate',           normalized_id: 'n_overhead_rate',             name: 'Overhead Rate',             symbol: 'OH',   quantity_kind: 'currency_rate', base_unit: 'currency_unit_per_h',   type: 'number' },
    { display_id: 'deposition_efficiency',   normalized_id: 'n_deposition_efficiency_pct', name: 'Deposition Efficiency %',   symbol: 'DE',   quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
    { display_id: 'source_confidence',       normalized_id: 'n_source_confidence_ratio',     name: 'Source Confidence Ratio',  symbol: 'SCR',  quantity_kind: 'dimensionless', base_unit: 'ratio',                 type: 'number' },
  ],
};

// ============================================================
// GENERATE FIELD OBJECTS FROM TEMPLATES
// ============================================================

function makeInputField(t) {
  return {
    id: t.display_id,
    name: t.name,
    symbol: t.symbol,
    quantity_kind: t.quantity_kind,
    unit_selectable: false,
    base_unit: t.base_unit,
    allowed_display_units: [t.base_unit],
    normalized_id: t.normalized_id,
    type: t.type,
    required: true,
    criticality: "CRITICAL",
    allowed_values: [],
    confidence_label: "NEEDS_SOURCE_VERIFICATION",
    physical_hard_bounds: {
      min: 0,
      max: 1_000_000_000,
      unit: t.base_unit,
      basis: "PROCESS_LIMIT",
      violation_behavior: "BLOCK",
      semantic_error_message_min: `${t.name} is below the physical or process hard bound.`,
      semantic_error_message_max: `${t.name} is above the physical or process hard bound.`
    },
    engineering_range: null,
    resolution: null,
    precision_policy: {
      input_decimals: 3,
      display_decimals: 3,
      calculation_precision: "FULL_DOUBLE_PRECISION_NO_PRE_ROUNDING",
      rounding_rule: "DISPLAY_ONLY"
    },
    default_policy: "NO_DEFAULT",
    default_value: null,
    smart_defaults: [],
    reference_values: {
      reference_value_type: "USER_VERIFIED",
      source: "user-provided value",
      reference_status: "NEEDS_SOURCE_VERIFICATION",
      user_must_verify: true,
      public_note: "User-provided input value."
    },
    source_priority: ["user-provided value", "engineering estimate"],
    source: "user-provided value",
    evidence_requirement: {
      required: true,
      accepted_evidence: ["user-provided value", "engineering estimate"],
      missing_evidence_behavior: "BLOCK",
      public_help_text: `Provide the ${t.name.toLowerCase()}.`
    },
    standard_clause_bindings: [],
    formula_bindings: [],
    output_bindings: [],
    warning_bindings: [],
    ui_binding: {
      group_id: "operation_context",
      field_order: 0,
      component: "number_with_unit",
      unit_dropdown_required: false,
      reference_values_visible: false,
      advanced: false,
      visible_in_modes: ["quick", "engineering", "cost", "audit"],
      required_for_calculation: true,
      required_for_clause_evidence: false
    },
    user_help_text: `Enter the ${t.name.toLowerCase()}. Reference ranges are advisory.`,
    warning_if_missing_or_estimated: `Missing or estimated ${t.name} will downgrade evidence confidence.`
  };
}

function makeNormalizedInput(t) {
  return {
    id: t.normalized_id,
    from_input: t.display_id,
    quantity_kind: t.quantity_kind,
    base_unit: t.base_unit,
    conversion_source: "unit_conversion_contract.conversion_registry",
    validation_after_conversion: [
      `Apply physical hard bounds for ${t.display_id} after unit conversion.`,
      `Evaluate engineering reference range for ${t.display_id} after conversion.`,
      `Reject non-finite normalized value for ${t.display_id}.`
    ],
    audit_required: true
  };
}

// ============================================================
// PATCH SCHEMA FILE
// ============================================================

function patchSchema(toolKey) {
  const schemaPath = join(SCHEMA_DIR, `${toolKey}.schema.json`);
  console.log(`\n=== Patching: ${toolKey} ===`);

  let schema;
  try {
    const raw = readFileSync(schemaPath, 'utf8');
    schema = JSON.parse(raw);
  } catch (e) {
    console.error(`  ERROR reading schema: ${e.message}`);
    return false;
  }

  const templates = INPUT_TEMPLATES[toolKey];
  if (!templates) {
    console.error(`  ERROR: No templates defined for ${toolKey}`);
    return false;
  }

  // Count old fields
  const oldInputCount = (schema.inputs || []).length;
  const oldNormalizedCount = (schema.normalized_inputs || []).length;

  // Build new arrays
  schema.inputs = templates.map(makeInputField);
  schema.normalized_inputs = templates.map(makeNormalizedInput);

  // Update field_order in ui_binding to match array index
  schema.inputs.forEach((inp, idx) => {
    inp.ui_binding.field_order = idx + 1;
  });

  // Write back
  try {
    writeFileSync(schemaPath, JSON.stringify(schema, null, 2), 'utf8');
    console.log(`  Inputs: ${oldInputCount} → ${schema.inputs.length}`);
    console.log(`  Normalized: ${oldNormalizedCount} → ${schema.normalized_inputs.length}`);
    console.log(`  FIXED: ${toolKey}`);
    return true;
  } catch (e) {
    console.error(`  ERROR writing schema: ${e.message}`);
    return false;
  }
}

// ============================================================
// MAIN
// ============================================================

const BROKEN_TOOLS = [
  'customer-sku-profitability-forensics',
  'downtime-scrap-loss-statement',
  'oee-loss-monetization-improvement-business-case',
  'scrap-rework-cost-tracker',
  'outsource-vs-in-house-analyzer',
  'plant-wide-shop-rate-cost-structure-audit',
  'fx-commodity-pass-through-pricer',
  'energy-efficiency-grant-incentive-feasibility-pack',
  'motor-compressor-replacement-roi',
  'weld-procedure-cost-consumable-estimation-suite',
];

console.log('SectorCalc — PRO Tool Schema Fix');
console.log('================================');
console.log(`Broken schemas to fix: ${BROKEN_TOOLS.length}`);

let fixed = 0;
let failed = 0;
for (const toolKey of BROKEN_TOOLS) {
  if (patchSchema(toolKey)) {
    fixed++;
  } else {
    failed++;
  }
}

console.log('\n================================');
console.log(`Fixed: ${fixed}/${BROKEN_TOOLS.length}`);
console.log(`Failed: ${failed}`);
console.log('================================');
process.exit(failed > 0 ? 1 : 0);
