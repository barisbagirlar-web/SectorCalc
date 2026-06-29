/**
 * generate-pro-tool-category-map.mjs
 *
 * Reads all PRO_*.json tools from data/pro-tools/ directory,
 * applies the instruction's known routing fixtures + keyword scoring,
 * and outputs src/data/proToolCategoryMap.ts
 *
 * Deterministic — no AI, no random, no network calls.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data/pro-tools");
const OUTPUT = path.resolve(__dirname, "../src/data/proToolCategoryMap.ts");

// ── Manually-specified routing fixtures from the prompt ────────────────
// Each entry maps tool_id → { primaryCategoryId, secondaryCategoryIds, decisionFamily, professionalSegments, riskClass }
const FIXTURES = {
  // CNC, Machining & Tooling
  PRO_001: { category: "cnc-machining-tooling", secondary: [], decision: "process_sizing", segments: ["CNC Machinist", "Production Engineer"], risk: "MEDIUM" },
  PRO_002: { category: "cnc-machining-tooling", secondary: [], decision: "process_sizing", segments: ["CNC Machinist", "Production Engineer"], risk: "MEDIUM" },
  PRO_003: { category: "cnc-machining-tooling", secondary: [], decision: "design_check", segments: ["CNC Machinist", "Manufacturing Engineer"], risk: "HIGH" },
  PRO_004: { category: "cnc-machining-tooling", secondary: ["lean-production-oee-industrial-engineering"], decision: "capacity_check", segments: ["Production Manager", "CNC Machinist"], risk: "MEDIUM" },
  PRO_005: { category: "cnc-machining-tooling", secondary: ["capital-investment-roi-business-case"], decision: "cost_optimization", segments: ["Manufacturing Engineer", "Finance Analyst"], risk: "MEDIUM" },

  // Lean Production, OEE
  PRO_006: { category: "lean-production-oee-industrial-engineering", secondary: [], decision: "capacity_check", segments: ["Production Manager", "Industrial Engineer"], risk: "LOW" },
  PRO_007: { category: "lean-production-oee-industrial-engineering", secondary: [], decision: "capacity_check", segments: ["Production Manager", "Industrial Engineer"], risk: "LOW" },
  PRO_008: { category: "lean-production-oee-industrial-engineering", secondary: [], decision: "cost_optimization", segments: ["Lean Specialist", "Production Manager"], risk: "LOW" },
  PRO_009: { category: "lean-production-oee-industrial-engineering", secondary: [], decision: "design_check", segments: ["Industrial Engineer"], risk: "LOW" },

  // Welding, Fabrication & Bolted Assembly
  PRO_010: { category: "welding-fabrication-bolted-assembly", secondary: [], decision: "compliance_check", segments: ["Welding Engineer", "Fabrication Manager"], risk: "HIGH" },
  PRO_011: { category: "welding-fabrication-bolted-assembly", secondary: [], decision: "design_check", segments: ["Welding Engineer"], risk: "HIGH" },
  PRO_012: { category: "welding-fabrication-bolted-assembly", secondary: [], decision: "design_check", segments: ["Mechanical Engineer"], risk: "HIGH" },
  PRO_013: { category: "welding-fabrication-bolted-assembly", secondary: [], decision: "design_check", segments: ["Mechanical Engineer"], risk: "HIGH" },
  PRO_014: { category: "welding-fabrication-bolted-assembly", secondary: ["pressure-vessel-piping-static-equipment"], decision: "safety_validation", segments: ["Mechanical Engineer", "Piping Engineer"], risk: "HIGH" },

  // Sheet Metal, Forming & Metal Processing
  PRO_015: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "cost_optimization", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "MEDIUM" },
  PRO_016: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "cost_optimization", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "MEDIUM" },

  // Structural Steel & Lifting Systems
  PRO_021: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_022: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_023: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_024: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_025: { category: "structural-steel-lifting-systems", secondary: ["hse-fire-explosion-occupational-safety"], decision: "safety_validation", segments: ["Lifting Engineer", "HSE Specialist"], risk: "CRITICAL" },

  // Reinforced Concrete, Civil & Geotechnical
  PRO_026: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "design_check", segments: ["Civil Engineer", "Structural Engineer"], risk: "CRITICAL" },
  PRO_027: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "design_check", segments: ["Civil Engineer", "Structural Engineer"], risk: "CRITICAL" },
  PRO_028: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "design_check", segments: ["Geotechnical Engineer", "Civil Engineer"], risk: "CRITICAL" },
  PRO_030: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "process_sizing", segments: ["Civil Engineer", "Site Engineer"], risk: "MEDIUM" },
  PRO_031: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "process_sizing", segments: ["Civil Engineer"], risk: "MEDIUM" },

  // Construction Project, Site Cost & Schedule
  PRO_033: { category: "construction-project-site-cost-schedule", secondary: [], decision: "risk_assessment", segments: ["Construction Manager", "Project Manager"], risk: "MEDIUM" },
  PRO_034: { category: "construction-project-site-cost-schedule", secondary: [], decision: "financial_feasibility", segments: ["Project Manager", "Quantity Surveyor"], risk: "MEDIUM" },

  // Pressure Vessel, Piping & Static Equipment
  PRO_035: { category: "pressure-vessel-piping-static-equipment", secondary: [], decision: "design_check", segments: ["Pressure Vessel Engineer"], risk: "CRITICAL" },
  PRO_036: { category: "pressure-vessel-piping-static-equipment", secondary: [], decision: "design_check", segments: ["Pressure Vessel Engineer"], risk: "CRITICAL" },
  PRO_037: { category: "pressure-vessel-piping-static-equipment", secondary: [], decision: "design_check", segments: ["Piping Engineer"], risk: "CRITICAL" },
  PRO_038: { category: "pressure-vessel-piping-static-equipment", secondary: [], decision: "safety_validation", segments: ["Pressure Vessel Engineer", "Process Safety Engineer"], risk: "CRITICAL" },
  PRO_039: { category: "pressure-vessel-piping-static-equipment", secondary: [], decision: "design_check", segments: ["Mechanical Engineer"], risk: "HIGH" },

  // Pumps, Hydraulics & Fluid Machinery
  PRO_040: { category: "pumps-hydraulics-fluid-machinery", secondary: [], decision: "process_sizing", segments: ["Mechanical Engineer", "Pump Engineer"], risk: "HIGH" },
  PRO_041: { category: "pumps-hydraulics-fluid-machinery", secondary: [], decision: "capacity_check", segments: ["Mechanical Engineer", "Pump Engineer"], risk: "HIGH" },
  PRO_042: { category: "pumps-hydraulics-fluid-machinery", secondary: [], decision: "process_sizing", segments: ["Mechanical Engineer", "Pump Engineer"], risk: "HIGH" },
  PRO_043: { category: "pumps-hydraulics-fluid-machinery", secondary: [], decision: "process_sizing", segments: ["Hydraulic Engineer", "Mechanical Engineer"], risk: "HIGH" },
  PRO_044: { category: "pumps-hydraulics-fluid-machinery", secondary: [], decision: "process_sizing", segments: ["Mechanical Engineer", "HVAC Engineer"], risk: "MEDIUM" },

  // Process, Chemical & Thermal Equipment
  PRO_045: { category: "process-chemical-thermal-equipment", secondary: [], decision: "process_sizing", segments: ["Process Engineer"], risk: "HIGH" },
  PRO_046: { category: "process-chemical-thermal-equipment", secondary: [], decision: "safety_validation", segments: ["Process Engineer", "Chemical Engineer"], risk: "HIGH" },
  PRO_047: { category: "process-chemical-thermal-equipment", secondary: [], decision: "energy_audit", segments: ["Thermal Engineer", "Process Engineer"], risk: "MEDIUM" },
  PRO_048: { category: "process-chemical-thermal-equipment", secondary: [], decision: "process_sizing", segments: ["Process Engineer", "Environmental Engineer"], risk: "HIGH" },
  PRO_049: { category: "process-chemical-thermal-equipment", secondary: [], decision: "process_sizing", segments: ["Process Engineer"], risk: "HIGH" },
  PRO_050: { category: "process-chemical-thermal-equipment", secondary: [], decision: "process_sizing", segments: ["Process Engineer", "Mechanical Engineer"], risk: "MEDIUM" },
  PRO_051: { category: "process-chemical-thermal-equipment", secondary: [], decision: "process_sizing", segments: ["Instrumentation Engineer", "Process Engineer"], risk: "MEDIUM" },
  PRO_052: { category: "process-chemical-thermal-equipment", secondary: [], decision: "process_sizing", segments: ["Process Engineer", "Manufacturing Engineer"], risk: "MEDIUM" },

  // HVAC, Refrigeration & Building Utilities
  PRO_053: { category: "hvac-refrigeration-building-utilities", secondary: [], decision: "energy_audit", segments: ["HVAC Engineer", "Refrigeration Engineer"], risk: "MEDIUM" },
  PRO_054: { category: "hvac-refrigeration-building-utilities", secondary: [], decision: "energy_audit", segments: ["HVAC Engineer", "Facility Manager"], risk: "MEDIUM" },
  PRO_055: { category: "hvac-refrigeration-building-utilities", secondary: [], decision: "capacity_check", segments: ["HVAC Engineer", "Cooling Tower Specialist"], risk: "MEDIUM" },
  PRO_056: { category: "hvac-refrigeration-building-utilities", secondary: [], decision: "process_sizing", segments: ["HVAC Engineer", "MEP Engineer"], risk: "MEDIUM" },
  PRO_057: { category: "hvac-refrigeration-building-utilities", secondary: ["pressure-vessel-piping-static-equipment"], decision: "energy_audit", segments: ["HVAC Engineer", "Mechanical Engineer"], risk: "MEDIUM" },
  PRO_058: { category: "hvac-refrigeration-building-utilities", secondary: [], decision: "energy_audit", segments: ["HVAC Engineer", "Energy Manager"], risk: "LOW" },

  // Compressed Air, Motors & Industrial Energy Audit
  PRO_059: { category: "compressed-air-motors-industrial-energy-audit", secondary: [], decision: "energy_audit", segments: ["Energy Manager", "Maintenance Engineer"], risk: "LOW" },
  PRO_060: { category: "compressed-air-motors-industrial-energy-audit", secondary: [], decision: "energy_audit", segments: ["Energy Manager", "Plant Engineer"], risk: "LOW" },
  PRO_061: { category: "compressed-air-motors-industrial-energy-audit", secondary: [], decision: "process_sizing", segments: ["Maintenance Engineer", "Plant Engineer"], risk: "LOW" },
  PRO_062: { category: "compressed-air-motors-industrial-energy-audit", secondary: [], decision: "energy_audit", segments: ["Energy Manager", "Maintenance Engineer"], risk: "LOW" },
  PRO_063: { category: "compressed-air-motors-industrial-energy-audit", secondary: [], decision: "cost_optimization", segments: ["Energy Manager", "Finance Analyst"], risk: "LOW" },

  // Electrical Power, Panel & Grid Safety
  PRO_064: { category: "electrical-power-panel-grid-safety", secondary: [], decision: "design_check", segments: ["Electrical Engineer"], risk: "CRITICAL" },
  PRO_065: { category: "electrical-power-panel-grid-safety", secondary: [], decision: "design_check", segments: ["Electrical Engineer", "Power Systems Engineer"], risk: "CRITICAL" },
  PRO_066: { category: "electrical-power-panel-grid-safety", secondary: [], decision: "design_check", segments: ["Electrical Engineer"], risk: "CRITICAL" },
  PRO_067: { category: "electrical-power-panel-grid-safety", secondary: [], decision: "design_check", segments: ["Electrical Engineer"], risk: "HIGH" },
  PRO_068: { category: "electrical-power-panel-grid-safety", secondary: [], decision: "design_check", segments: ["Electrical Engineer"], risk: "HIGH" },
  PRO_069: { category: "electrical-power-panel-grid-safety", secondary: [], decision: "compliance_check", segments: ["Electrical Engineer"], risk: "HIGH" },

  // Renewable Energy, Carbon & ESG Finance
  PRO_070: { category: "renewable-energy-carbon-esg-finance", secondary: [], decision: "financial_feasibility", segments: ["Energy Manager", "Sustainability Manager"], risk: "MEDIUM" },
  PRO_071: { category: "renewable-energy-carbon-esg-finance", secondary: [], decision: "compliance_check", segments: ["ESG Analyst", "Carbon Advisor"], risk: "MEDIUM" },
  PRO_072: { category: "renewable-energy-carbon-esg-finance", secondary: [], decision: "compliance_check", segments: ["Sustainability Manager", "Compliance Officer"], risk: "MEDIUM" },

  // Quality, SPC, Metrology & Calibration
  PRO_073: { category: "quality-spc-metrology-calibration", secondary: [], decision: "quality_decision", segments: ["Metrology Engineer", "Quality Engineer"], risk: "HIGH" },
  PRO_074: { category: "quality-spc-metrology-calibration", secondary: [], decision: "quality_decision", segments: ["Quality Engineer", "Six Sigma Black Belt"], risk: "HIGH" },
  PRO_075: { category: "quality-spc-metrology-calibration", secondary: [], decision: "quality_decision", segments: ["Quality Engineer", "Six Sigma Black Belt"], risk: "HIGH" },

  // Maintenance, Reliability & Asset Life
  PRO_076: { category: "maintenance-reliability-asset-life", secondary: [], decision: "reliability_analysis", segments: ["Maintenance Engineer", "Reliability Engineer"], risk: "HIGH" },
  PRO_077: { category: "maintenance-reliability-asset-life", secondary: [], decision: "reliability_analysis", segments: ["Reliability Engineer", "Maintenance Engineer"], risk: "HIGH" },
  PRO_078: { category: "maintenance-reliability-asset-life", secondary: [], decision: "reliability_analysis", segments: ["Mechanical Engineer", "Maintenance Engineer"], risk: "HIGH" },
  PRO_079: { category: "maintenance-reliability-asset-life", secondary: ["mechanical-design-power-transmission"], decision: "design_check", segments: ["Mechanical Engineer", "Maintenance Engineer"], risk: "HIGH" },

  // HSE, Fire, Explosion & Occupational Safety
  PRO_080: { category: "hse-fire-explosion-occupational-safety", secondary: [], decision: "safety_validation", segments: ["HSE Specialist", "Industrial Hygienist"], risk: "LOW" },
  PRO_081: { category: "hse-fire-explosion-occupational-safety", secondary: [], decision: "safety_validation", segments: ["HSE Specialist", "Safety Manager"], risk: "HIGH" },
  PRO_082: { category: "hse-fire-explosion-occupational-safety", secondary: [], decision: "safety_validation", segments: ["Process Safety Engineer", "HSE Specialist"], risk: "CRITICAL" },
  PRO_083: { category: "hse-fire-explosion-occupational-safety", secondary: [], decision: "safety_validation", segments: ["Process Safety Engineer", "HSE Specialist"], risk: "CRITICAL" },
  PRO_084: { category: "hse-fire-explosion-occupational-safety", secondary: [], decision: "safety_validation", segments: ["Process Safety Engineer", "HSE Specialist"], risk: "CRITICAL" },

  // Logistics, Warehouse & Material Handling
  PRO_085: { category: "logistics-warehouse-material-handling", secondary: [], decision: "capacity_check", segments: ["Warehouse Manager", "Logistics Engineer"], risk: "LOW" },
  PRO_086: { category: "logistics-warehouse-material-handling", secondary: [], decision: "cost_optimization", segments: ["Logistics Manager", "Supply Chain Analyst"], risk: "LOW" },
  PRO_087: { category: "logistics-warehouse-material-handling", secondary: [], decision: "process_sizing", segments: ["Mechanical Engineer", "Logistics Engineer"], risk: "LOW" },
  PRO_088: { category: "logistics-warehouse-material-handling", secondary: [], decision: "process_sizing", segments: ["Mechanical Engineer", "Logistics Engineer"], risk: "LOW" },
  PRO_089: { category: "logistics-warehouse-material-handling", secondary: [], decision: "process_sizing", segments: ["Logistics Engineer"], risk: "LOW" },

  // Finance, Sales & Working Capital or Capital Investment
  PRO_090: { category: "capital-investment-roi-business-case", secondary: [], decision: "financial_feasibility", segments: ["CFO", "Investment Analyst"], risk: "MEDIUM" },
  PRO_111: { category: "finance-sales-working-capital", secondary: [], decision: "risk_assessment", segments: ["CFO", "Credit Manager", "Finance Analyst"], risk: "MEDIUM" },
  PRO_116: { category: "water-wastewater-environmental-process", secondary: [], decision: "process_sizing", segments: ["Environmental Engineer", "Water Treatment Engineer"], risk: "MEDIUM" },
  PRO_117: { category: "hvac-refrigeration-building-utilities", secondary: ["renewable-energy-carbon-esg-finance"], decision: "compliance_check", segments: ["Environmental Engineer", "Facility Manager"], risk: "MEDIUM" },
  PRO_119: { category: "process-chemical-thermal-equipment", secondary: [], decision: "energy_audit", segments: ["Process Engineer", "Energy Manager"], risk: "MEDIUM" },
  PRO_146: { category: "technology-ai-cloud-cyber-risk", secondary: ["digital-factory-automation-industry-4"], decision: "financial_feasibility", segments: ["CTO", "IT Manager"], risk: "MEDIUM" },

  // PRO_091+: Additional engineering tools
  PRO_091: { category: "hvac-refrigeration-building-utilities", secondary: [], decision: "energy_audit", segments: ["HVAC Engineer", "Facility Manager"], risk: "MEDIUM" },
  PRO_092: { category: "hse-fire-explosion-occupational-safety", secondary: ["pressure-vessel-piping-static-equipment"], decision: "safety_validation", segments: ["Corrosion Engineer", "Mechanical Integrity Engineer"], risk: "HIGH" },
  PRO_093: { category: "process-chemical-thermal-equipment", secondary: ["compressed-air-motors-industrial-energy-audit"], decision: "energy_audit", segments: ["Process Engineer", "Energy Manager"], risk: "MEDIUM" },
  PRO_094: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "safety_validation", segments: ["Civil Engineer", "Geotechnical Engineer"], risk: "CRITICAL" },
  PRO_095: { category: "renewable-energy-carbon-esg-finance", secondary: ["process-chemical-thermal-equipment"], decision: "energy_audit", segments: ["Energy Manager", "Process Engineer"], risk: "MEDIUM" },
  PRO_096: { category: "welding-fabrication-bolted-assembly", secondary: [], decision: "design_check", segments: ["Welding Engineer", "Structural Engineer"], risk: "HIGH" },
  PRO_097: { category: "cnc-machining-tooling", secondary: [], decision: "process_sizing", segments: ["CNC Machinist", "Manufacturing Engineer"], risk: "MEDIUM" },
  PRO_098: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "HIGH" },
  PRO_099: { category: "quality-spc-metrology-calibration", secondary: ["cnc-machining-tooling"], decision: "quality_decision", segments: ["Quality Engineer", "Metrology Engineer"], risk: "MEDIUM" },
  PRO_100: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "design_check", segments: ["Civil Engineer", "Structural Engineer"], risk: "CRITICAL" },
  PRO_101: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_102: { category: "cnc-machining-tooling", secondary: ["quality-spc-metrology-calibration"], decision: "quality_decision", segments: ["CNC Machinist", "Quality Engineer"], risk: "MEDIUM" },
  PRO_103: { category: "welding-fabrication-bolted-assembly", secondary: ["structural-steel-lifting-systems"], decision: "design_check", segments: ["Welding Engineer", "Structural Engineer"], risk: "HIGH" },
  PRO_104: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "design_check", segments: ["Civil Engineer", "Structural Engineer"], risk: "CRITICAL" },
  PRO_105: { category: "cnc-machining-tooling", secondary: [], decision: "process_sizing", segments: ["CNC Machinist", "Manufacturing Engineer"], risk: "MEDIUM" },
  PRO_106: { category: "structural-steel-lifting-systems", secondary: ["welding-fabrication-bolted-assembly"], decision: "design_check", segments: ["Structural Engineer"], risk: "HIGH" },
  PRO_107: { category: "cnc-machining-tooling", secondary: [], decision: "process_sizing", segments: ["CNC Machinist", "Manufacturing Engineer"], risk: "MEDIUM" },
  PRO_108: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "design_check", segments: ["Geotechnical Engineer", "Civil Engineer"], risk: "CRITICAL" },
  PRO_109: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "process_sizing", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "MEDIUM" },
  PRO_110: { category: "reinforced-concrete-civil-geotechnical", secondary: [], decision: "design_check", segments: ["Civil Engineer", "Structural Engineer"], risk: "CRITICAL" },

  // Additional structural/sheet metal tools (PRO_129-135 and PRO_148-162)
  PRO_129: { category: "structural-steel-lifting-systems", secondary: ["hse-fire-explosion-occupational-safety"], decision: "safety_validation", segments: ["Lifting Engineer", "HSE Specialist"], risk: "CRITICAL" },
  PRO_130: { category: "structural-steel-lifting-systems", secondary: ["hse-fire-explosion-occupational-safety"], decision: "safety_validation", segments: ["Lifting Engineer", "HSE Specialist"], risk: "CRITICAL" },
  PRO_131: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "process_sizing", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "MEDIUM" },
  PRO_132: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "design_check", segments: ["Sheet Metal Engineer", "Press Brake Operator"], risk: "MEDIUM" },
  PRO_133: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "design_check", segments: ["Sheet Metal Engineer", "Press Brake Operator"], risk: "MEDIUM" },
  PRO_134: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "cost_optimization", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "LOW" },
  PRO_135: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "cost_optimization", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "LOW" },
  PRO_148: { category: "welding-fabrication-bolted-assembly", secondary: ["structural-steel-lifting-systems"], decision: "design_check", segments: ["Welding Engineer", "Structural Engineer"], risk: "HIGH" },
  PRO_149: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_150: { category: "reinforced-concrete-civil-geotechnical", secondary: ["structural-steel-lifting-systems"], decision: "design_check", segments: ["Structural Engineer", "Civil Engineer"], risk: "CRITICAL" },
  PRO_151: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_152: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_153: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_154: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer"], risk: "CRITICAL" },
  PRO_155: { category: "structural-steel-lifting-systems", secondary: [], decision: "design_check", segments: ["Structural Engineer", "Lifting Engineer"], risk: "CRITICAL" },
  PRO_156: { category: "structural-steel-lifting-systems", secondary: ["hse-fire-explosion-occupational-safety"], decision: "safety_validation", segments: ["Lifting Engineer", "HSE Specialist"], risk: "CRITICAL" },
  PRO_157: { category: "structural-steel-lifting-systems", secondary: ["hse-fire-explosion-occupational-safety"], decision: "safety_validation", segments: ["Lifting Engineer", "HSE Specialist"], risk: "CRITICAL" },
  PRO_158: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "process_sizing", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "MEDIUM" },
  PRO_159: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "design_check", segments: ["Sheet Metal Engineer", "Press Brake Operator"], risk: "MEDIUM" },
  PRO_160: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "design_check", segments: ["Sheet Metal Engineer", "Press Brake Operator"], risk: "MEDIUM" },
  PRO_161: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "cost_optimization", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "LOW" },
  PRO_162: { category: "sheet-metal-forming-metal-processing", secondary: [], decision: "cost_optimization", segments: ["Sheet Metal Engineer", "Manufacturing Engineer"], risk: "LOW" },
};

// ── Keyword-based classification for tools not in fixtures ────────────

const CATEGORY_KEYWORDS = {
  "cnc-machining-tooling": ["cnc", "machining", "cutting", "milling", "turning", "spindle", "tool life", "chatter", "mrr"],
  "lean-production-oee-industrial-engineering": ["oee", "lean", "smed", "tpm", "toc", "bottleneck", "line balance", "kanban"],
  "welding-fabrication-bolted-assembly": ["weld", "welding", "preheat", "pwht", "bolted", "vdi 2230", "fabrication"],
  "sheet-metal-forming-metal-processing": ["sheet metal", "forming", "press brake", "stamping", "laser cutting", "nesting"],
  "plastics-polymer-molding": ["injection", "molding", "plastic", "polymer", "extrusion"],
  "structural-steel-lifting-systems": ["steel column", "steel beam", "hollow section", "crane", "anchor bolt", "sling", "base plate"],
  "reinforced-concrete-civil-geotechnical": ["concrete", "rc beam", "rc column", "foundation", "rebar", "slab", "geotechnical", "storm water"],
  "construction-project-site-cost-schedule": ["cpm", "delay", "liquidated", "escalation", "project", "site", "construction cost"],
  "pressure-vessel-piping-static-equipment": ["pressure vessel", "mawp", "pipeline", "maop", "burst", "storage tank", "venting", "expansion joint"],
  "pumps-hydraulics-fluid-machinery": ["pump", "npsh", "cavitation", "hydraulic", "fan", "centrifugal"],
  "process-chemical-thermal-equipment": ["reactor", "heat exchanger", "heat of reaction", "fired heater", "evaporator", "scrubber", "packed column", "orifice", "electroplating"],
  "hvac-refrigeration-building-utilities": ["hvac", "refrigeration", "cop", "chilled water", "cooling tower", "ventilation", "duct", "heat pump"],
  "compressed-air-motors-industrial-energy-audit": ["compressed air", "leakage", "receiver", "motor energy", "vfd", "power factor"],
  "electrical-power-panel-grid-safety": ["cable", "ampacity", "voltage drop", "transformer", "substation", "earthing", "lightning", "switchgear"],
  "renewable-energy-carbon-esg-finance": ["solar", "pv", "renewable", "carbon", "cbam", "esg", "emission"],
  "quality-spc-metrology-calibration": ["cpk", "ppk", "spc", "calibration", "six sigma", "aql", "measurement uncertainty", "dpm o", "conformity", "iso 17025"],
  "maintenance-reliability-asset-life": ["bearing", "l10", "fatigue", "miner", "maintenance", "reliability", "mtbf", "mttr", "gear", "spring"],
  "hse-fire-explosion-occupational-safety": ["explosion", "toxic", "gas dispersion", "flare", "noise", "forklift", "hse", "osha", "exclusion zone"],
  "logistics-warehouse-material-handling": ["eoq", "warehouse", "conveyor", "screw conveyor", "inventory", "pallet", "freight"],
  "finance-sales-working-capital": ["credit", "working capital", "dso", "break-even", "margin", "pricing", "commercial"],
  "capital-investment-roi-business-case": ["investment", "roi", "appraisal", "depreciation", "capital", "npv", "payback", "business case"],
  "workforce-shift-hr-cost": ["workforce", "shift", "labor", "overtime", "hr", "employee"],
  "digital-factory-automation-industry-4": ["digital twin", "automation", "industry 4", "iot", "cobot", "agv"],
  "technology-ai-cloud-cyber-risk": ["cloud", "cyber", "ai", "api", "technology", "software", "saas"],
  "water-wastewater-environmental-process": ["wastewater", "activated sludge", "aeration", "water treatment", "clarifier"],
  "food-packaging-cold-chain": ["food", "packaging", "cold chain", "pasteurization", "hygiene"],
  "agriculture-mining-marine-niche-heavy-industry": ["mining", "drilling", "marine", "offshore", "bulk material"],
};

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function classifyByKeywords(tool) {
  const text = normalize(`${tool.tool_id} ${tool.tool_name} ${tool.category} ${tool.scope || ""} ${tool.primary_operation || ""}`);
  
  let bestCategory = "process-chemical-thermal-equipment"; // fallback
  let bestScore = 0;
  
  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) {
        // Weight: exact phrase match scores more
        score += kw.includes(" ") ? 6 : 3;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = catId;
    }
  }
  
  return bestCategory;
}

// ── Main ──────────────────────────────────────────────────────────────

const DEFAULT_SEGMENTS = ["Engineer", "Technical Specialist"];
const DEFAULT_DECISION = "design_check";
const DEFAULT_RISK = "MEDIUM";

const CATEGORY_DECISIONS = {
  "cnc-machining-tooling": "process_sizing",
  "lean-production-oee-industrial-engineering": "capacity_check",
  "welding-fabrication-bolted-assembly": "design_check",
  "sheet-metal-forming-metal-processing": "process_sizing",
  "plastics-polymer-molding": "process_sizing",
  "structural-steel-lifting-systems": "design_check",
  "reinforced-concrete-civil-geotechnical": "design_check",
  "construction-project-site-cost-schedule": "financial_feasibility",
  "pressure-vessel-piping-static-equipment": "safety_validation",
  "pumps-hydraulics-fluid-machinery": "process_sizing",
  "process-chemical-thermal-equipment": "process_sizing",
  "hvac-refrigeration-building-utilities": "energy_audit",
  "compressed-air-motors-industrial-energy-audit": "energy_audit",
  "electrical-power-panel-grid-safety": "design_check",
  "renewable-energy-carbon-esg-finance": "compliance_check",
  "quality-spc-metrology-calibration": "quality_decision",
  "maintenance-reliability-asset-life": "reliability_analysis",
  "hse-fire-explosion-occupational-safety": "safety_validation",
  "logistics-warehouse-material-handling": "capacity_check",
  "finance-sales-working-capital": "financial_feasibility",
  "capital-investment-roi-business-case": "financial_feasibility",
  "workforce-shift-hr-cost": "cost_optimization",
  "digital-factory-automation-industry-4": "financial_feasibility",
  "technology-ai-cloud-cyber-risk": "risk_assessment",
  "water-wastewater-environmental-process": "process_sizing",
  "food-packaging-cold-chain": "process_sizing",
  "agriculture-mining-marine-niche-heavy-industry": "capacity_check",
};

const CATEGORY_RISKS = {
  "cnc-machining-tooling": "MEDIUM",
  "lean-production-oee-industrial-engineering": "LOW",
  "welding-fabrication-bolted-assembly": "HIGH",
  "sheet-metal-forming-metal-processing": "MEDIUM",
  "plastics-polymer-molding": "MEDIUM",
  "structural-steel-lifting-systems": "CRITICAL",
  "reinforced-concrete-civil-geotechnical": "CRITICAL",
  "construction-project-site-cost-schedule": "MEDIUM",
  "pressure-vessel-piping-static-equipment": "CRITICAL",
  "pumps-hydraulics-fluid-machinery": "HIGH",
  "process-chemical-thermal-equipment": "HIGH",
  "hvac-refrigeration-building-utilities": "MEDIUM",
  "compressed-air-motors-industrial-energy-audit": "LOW",
  "electrical-power-panel-grid-safety": "CRITICAL",
  "renewable-energy-carbon-esg-finance": "MEDIUM",
  "quality-spc-metrology-calibration": "HIGH",
  "maintenance-reliability-asset-life": "HIGH",
  "hse-fire-explosion-occupational-safety": "CRITICAL",
  "logistics-warehouse-material-handling": "LOW",
  "finance-sales-working-capital": "MEDIUM",
  "capital-investment-roi-business-case": "MEDIUM",
  "workforce-shift-hr-cost": "LOW",
  "digital-factory-automation-industry-4": "MEDIUM",
  "technology-ai-cloud-cyber-risk": "MEDIUM",
  "water-wastewater-environmental-process": "MEDIUM",
  "food-packaging-cold-chain": "MEDIUM",
  "agriculture-mining-marine-niche-heavy-industry": "HIGH",
};

const CATEGORY_SEGMENTS = {
  "cnc-machining-tooling": ["CNC Machinist", "Manufacturing Engineer"],
  "lean-production-oee-industrial-engineering": ["Production Manager", "Industrial Engineer"],
  "welding-fabrication-bolted-assembly": ["Welding Engineer", "Fabrication Manager"],
  "sheet-metal-forming-metal-processing": ["Sheet Metal Engineer", "Manufacturing Engineer"],
  "plastics-polymer-molding": ["Plastics Engineer", "Process Engineer"],
  "structural-steel-lifting-systems": ["Structural Engineer"],
  "reinforced-concrete-civil-geotechnical": ["Civil Engineer", "Structural Engineer"],
  "construction-project-site-cost-schedule": ["Construction Manager", "Project Manager"],
  "pressure-vessel-piping-static-equipment": ["Pressure Vessel Engineer", "Piping Engineer"],
  "pumps-hydraulics-fluid-machinery": ["Mechanical Engineer", "Pump Engineer"],
  "process-chemical-thermal-equipment": ["Process Engineer", "Chemical Engineer"],
  "hvac-refrigeration-building-utilities": ["HVAC Engineer", "MEP Engineer"],
  "compressed-air-motors-industrial-energy-audit": ["Energy Manager", "Plant Engineer"],
  "electrical-power-panel-grid-safety": ["Electrical Engineer", "Power Systems Engineer"],
  "renewable-energy-carbon-esg-finance": ["Sustainability Manager", "Energy Manager"],
  "quality-spc-metrology-calibration": ["Quality Engineer", "Metrology Engineer"],
  "maintenance-reliability-asset-life": ["Maintenance Engineer", "Reliability Engineer"],
  "hse-fire-explosion-occupational-safety": ["HSE Specialist", "Process Safety Engineer"],
  "logistics-warehouse-material-handling": ["Logistics Manager", "Warehouse Manager"],
  "finance-sales-working-capital": ["CFO", "Finance Analyst"],
  "capital-investment-roi-business-case": ["CFO", "Investment Analyst"],
  "workforce-shift-hr-cost": ["HR Manager", "Operations Manager"],
  "digital-factory-automation-industry-4": ["Automation Engineer", "Digital Transformation Manager"],
  "technology-ai-cloud-cyber-risk": ["CTO", "IT Manager"],
  "water-wastewater-environmental-process": ["Environmental Engineer", "Water Treatment Engineer"],
  "food-packaging-cold-chain": ["Food Engineer", "Production Manager"],
  "agriculture-mining-marine-niche-heavy-industry": ["Mining Engineer", "Marine Engineer"],
};

console.log("Reading PRO tools from registry...");

// Read all PRO_*.json files
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== '_merged.json' && f !== '_report.json');
const tools = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
  const toolId = file.replace('.json', '');
  tools.push({
    tool_id: toolId,
    tool_name: content.tool_name || content.name || "",
    category: content.category || "",
    scope: content.scope || "",
    primary_operation: content.primary_operation || "",
    engine_rules: content.engine_rules || {},
  });
}

console.log(`Found ${tools.length} PRO tools`);

// Generate the map
const entries = [];
const categoryCounts = {};
const lowConfidence = [];

for (const tool of tools) {
  const id = tool.tool_id;
  const fixture = FIXTURES[id];
  
  let catId, secondary, decision, segments, risk, confidence, signals, note;
  
  if (fixture) {
    catId = fixture.category;
    secondary = fixture.secondary || [];
    decision = fixture.decision;
    segments = fixture.segments;
    risk = fixture.risk;
    confidence = "AUTO_HIGH";
    signals = [`Routed by fixture: ${CATEGORY_KEYWORDS[catId]?.slice(0, 3).join(", ") || "manual override"}`];
    note = "Routed per instruction routing fixture";
  } else {
    catId = classifyByKeywords(tool);
    secondary = [];
    decision = CATEGORY_DECISIONS[catId] || DEFAULT_DECISION;
    segments = CATEGORY_SEGMENTS[catId] || DEFAULT_SEGMENTS;
    risk = CATEGORY_RISKS[catId] || DEFAULT_RISK;
    
    // Score confidence
    const text = normalize(`${tool.tool_id} ${tool.tool_name} ${tool.category}`);
    const catKeywords = CATEGORY_KEYWORDS[catId] || [];
    let matchCount = 0;
    for (const kw of catKeywords) {
      if (text.includes(kw)) matchCount++;
    }
    
    if (matchCount >= 3) {
      confidence = "AUTO_HIGH";
    } else if (matchCount >= 1) {
      confidence = "AUTO_MEDIUM";
    } else {
      confidence = "REVIEW_REQUIRED";
      lowConfidence.push({ id, name: tool.tool_name, category: catId });
    }
    
    signals = [`Keyword match: ${catKeywords.slice(0, 3).join(", ")}`];
    note = `Auto-classified via keyword scoring (match count: ${matchCount})`;
  }
  
  categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
  
  // Map risks properly
  const riskClass = risk.toUpperCase();
  const validRisk = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(riskClass) ? riskClass : "MEDIUM";
  
  entries.push({
    id,
    name: tool.tool_name,
    primary: catId,
    secondary,
    decision,
    segments,
    risk: validRisk,
    confidence,
    signals,
    note,
  });
}

// Sort by id
entries.sort((a, b) => a.id.localeCompare(b.id));

// Generate TypeScript output
const lines = [
  "// Auto-generated by scripts/generate-pro-tool-category-map.mjs",
  "// Do not edit manually.",
  "",
  "export type ProToolCategoryAssignment = {",
  "  readonly primaryCategoryId: string;",
  "  readonly secondaryCategoryIds: readonly string[];",
  "  readonly decisionFamily: string;",
  "  readonly professionalSegments: readonly string[];",
  "  readonly riskClass: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';",
  "  readonly confidence: 'AUTO_HIGH' | 'AUTO_MEDIUM' | 'REVIEW_REQUIRED';",
  "  readonly matchedSignals: readonly string[];",
  "  readonly migrationNote: string;",
  "};",
  "",
  "export const PRO_TOOL_CATEGORY_MAP: Readonly<Record<string, ProToolCategoryAssignment>> = {",
];

for (const e of entries) {
  lines.push(`  "${e.id}": {`);
  lines.push(`    primaryCategoryId: "${e.primary}",`);
  lines.push(`    secondaryCategoryIds: [${e.secondary.map(s => `"${s}"`).join(", ")}],`);
  lines.push(`    decisionFamily: "${e.decision}",`);
  lines.push(`    professionalSegments: [${e.segments.map(s => `"${s}"`).join(", ")}],`);
  lines.push(`    riskClass: "${e.risk}",`);
  lines.push(`    confidence: "${e.confidence}",`);
  lines.push(`    matchedSignals: [${e.signals.map(s => `"${s}"`).join(", ")}],`);
  lines.push(`    migrationNote: "${e.note}",`);
  lines.push(`  },`);
}

lines.push("};");
lines.push("");

// Summary
const total = entries.length;
const catCount = Object.keys(categoryCounts).length;
const usedCategories = new Set(entries.map(e => e.primary));
const emptyCategories = [];

const catManifest = [
  "cnc-machining-tooling", "lean-production-oee-industrial-engineering", "welding-fabrication-bolted-assembly",
  "sheet-metal-forming-metal-processing", "plastics-polymer-molding", "structural-steel-lifting-systems",
  "reinforced-concrete-civil-geotechnical", "construction-project-site-cost-schedule",
  "pressure-vessel-piping-static-equipment", "pumps-hydraulics-fluid-machinery",
  "process-chemical-thermal-equipment", "hvac-refrigeration-building-utilities",
  "compressed-air-motors-industrial-energy-audit", "electrical-power-panel-grid-safety",
  "renewable-energy-carbon-esg-finance", "quality-spc-metrology-calibration",
  "maintenance-reliability-asset-life", "hse-fire-explosion-occupational-safety",
  "logistics-warehouse-material-handling", "finance-sales-working-capital",
  "capital-investment-roi-business-case", "workforce-shift-hr-cost",
  "digital-factory-automation-industry-4", "technology-ai-cloud-cyber-risk",
  "water-wastewater-environmental-process", "food-packaging-cold-chain",
  "agriculture-mining-marine-niche-heavy-industry",
];

for (const cat of catManifest) {
  if (!usedCategories.has(cat)) {
    emptyCategories.push(cat);
  }
}

fs.writeFileSync(OUTPUT, lines.join("\n"), "utf8");

console.log(`\n✓ Generated ${OUTPUT}`);
console.log(`  Total PRO tools: ${total}`);
console.log(`  Categories used: ${catCount}`);
console.log(`  Empty categories: ${emptyCategories.length > 0 ? emptyCategories.join(", ") : "none"}`);
console.log(`  Low confidence: ${lowConfidence.length}`);

if (lowConfidence.length > 0) {
  console.log("\nLow confidence tools:");
  for (const lc of lowConfidence) {
    console.log(`  ${lc.id}: ${lc.name} → ${lc.category}`);
  }
}

console.log("\nCategory distribution:");
const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
for (const [cat, count] of sorted) {
  console.log(`  ${cat.padEnd(55)} ${String(count).padStart(3)}`);
}
