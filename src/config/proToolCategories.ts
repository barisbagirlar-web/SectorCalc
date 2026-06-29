/**
 * Pro Tool Categories Manifest — 27 DNA-based categories
 *
 * Each category reflects a distinct professional discipline, engineering domain,
 * or decision-making context. Categories are designed for:
 * - Premium decision tool routing
 * - Buyer persona targeting
 * - SEO/schema optimization
 * - Conversion-oriented browsing
 */

export type ProCategoryId =
  | "cnc-machining-tooling"
  | "lean-production-oee-industrial-engineering"
  | "welding-fabrication-bolted-assembly"
  | "sheet-metal-forming-metal-processing"
  | "plastics-polymer-molding"
  | "structural-steel-lifting-systems"
  | "reinforced-concrete-civil-geotechnical"
  | "construction-project-site-cost-schedule"
  | "pressure-vessel-piping-static-equipment"
  | "pumps-hydraulics-fluid-machinery"
  | "process-chemical-thermal-equipment"
  | "hvac-refrigeration-building-utilities"
  | "compressed-air-motors-industrial-energy-audit"
  | "electrical-power-panel-grid-safety"
  | "renewable-energy-carbon-esg-finance"
  | "quality-spc-metrology-calibration"
  | "maintenance-reliability-asset-life"
  | "hse-fire-explosion-occupational-safety"
  | "logistics-warehouse-material-handling"
  | "finance-sales-working-capital"
  | "capital-investment-roi-business-case"
  | "workforce-shift-hr-cost"
  | "digital-factory-automation-industry-4"
  | "technology-ai-cloud-cyber-risk"
  | "water-wastewater-environmental-process"
  | "food-packaging-cold-chain"
  | "agriculture-mining-marine-niche-heavy-industry";

export type DecisionFamily =
  | "design_check"
  | "capacity_check"
  | "cost_optimization"
  | "risk_assessment"
  | "compliance_check"
  | "energy_audit"
  | "reliability_analysis"
  | "financial_feasibility"
  | "safety_validation"
  | "process_sizing"
  | "quality_decision"
  | "scenario_comparison";

export type RiskClass = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ProCategory = {
  readonly id: ProCategoryId;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
  readonly premiumPromise: string;
  readonly buyerSegments: readonly string[];
  readonly decisionFamilies: readonly DecisionFamily[];
  readonly standardsFamilies: readonly string[];
  readonly riskProfile: RiskClass | "CRITICAL_MIXED";
  readonly keywords: readonly string[];
  readonly negativeKeywords: readonly string[];
  readonly iconKey: string;
  readonly priority: number;
  readonly seoTitle: string;
  readonly seoDescription: string;
};

export const PRO_CATEGORIES: readonly ProCategory[] = [
  {
    id: "cnc-machining-tooling",
    label: "CNC, Machining & Tooling",
    shortLabel: "CNC & Machining",
    description: "Cutting force, spindle power, turning, milling, MRR, chatter, surface roughness, tool deflection, tool life, machining TCO, cycle time.",
    premiumPromise: "Validate cutting parameters, reduce tool wear cost, and optimize cycle time with industry-standard machining science.",
    buyerSegments: ["CNC Machinist", "Production Engineer", "Workshop Manager", "Manufacturing Engineer", "Tooling Engineer"],
    decisionFamilies: ["design_check", "capacity_check", "cost_optimization", "scenario_comparison"],
    standardsFamilies: ["ISO 230", "ISO 2768", "VDI 3321", "Sandvik C-2920"],
    riskProfile: "MEDIUM",
    keywords: ["cnc", "machining", "cutting force", "spindle power", "turning", "milling", "mrr", "chatter", "surface roughness", "tool deflection", "tool life", "cycle time", "machining tco", "chip load", "feed rate", "cutting speed"],
    negativeKeywords: ["oee", "lean", "smed", "welding", "pressure vessel", "quality"],
    iconKey: "cnc",
    priority: 1,
    seoTitle: "CNC, Machining & Tooling Calculators | Pro Decision Tools",
    seoDescription: "Professional CNC machining calculators for cutting force, spindle power, MRR, chatter stability, surface roughness, tool deflection, tool life estimation, and machining TCO.",
  },
  {
    id: "lean-production-oee-industrial-engineering",
    label: "Lean Production, OEE & Industrial Engineering",
    shortLabel: "Lean & OEE",
    description: "OEE, TPM, six big losses, TOC bottleneck, SMED, assembly line balancing, takt, SMV, capacity recovery.",
    premiumPromise: "Quantify production losses, identify bottleneck improvement ROI, and make data-driven lean transformation decisions.",
    buyerSegments: ["Production Manager", "Industrial Engineer", "Lean Specialist", "Plant Manager", "Operations Manager"],
    decisionFamilies: ["capacity_check", "cost_optimization", "scenario_comparison", "financial_feasibility"],
    standardsFamilies: ["ISO 22400", "JIPM TPM", "Toyota Production System"],
    riskProfile: "LOW",
    keywords: ["oee", "tpm", "six big losses", "toc", "bottleneck", "smed", "setup time", "line balancing", "takt", "smv", "capacity", "lean", "kanban", "heijunka", "poka", "muda"],
    negativeKeywords: ["cnc", "welding", "pressure vessel", "structural", "electrical", "hse"],
    iconKey: "flow",
    priority: 2,
    seoTitle: "Lean Production, OEE & Industrial Engineering Calculators",
    seoDescription: "Professional OEE, TPM, SMED, TOC bottleneck, line balancing, and capacity planning calculators for lean manufacturing decisions.",
  },
  {
    id: "welding-fabrication-bolted-assembly",
    label: "Welding, Fabrication & Bolted Assembly",
    shortLabel: "Welding & Bolted Joints",
    description: "WPS preheat, PWHT, carbon equivalent, hydrogen risk, arc welding heat input, weld HAZ, bolted joint, VDI 2230.",
    premiumPromise: "Reduce weld failure risk, validate preheat and PWHT requirements, and design bolted connections to VDI 2230 standards.",
    buyerSegments: ["Welding Engineer", "Fabrication Manager", "Mechanical Engineer", "Quality Engineer", "Structural Engineer"],
    decisionFamilies: ["design_check", "compliance_check", "safety_validation"],
    standardsFamilies: ["ASME IX", "AWS D1.1", "ISO 15614", "VDI 2230", "ISO 898"],
    riskProfile: "HIGH",
    keywords: ["weld", "welding", "preheat", "pwht", "carbon equivalent", "hydrogen", "heat input", "haz", "bolted joint", "vdi 2230", "preload", "torque", "flange", "fabrication"],
    negativeKeywords: ["cnc", "machining", "oee", "lean", "pressure vessel", "sheet metal"],
    iconKey: "weld",
    priority: 3,
    seoTitle: "Welding, Fabrication & Bolted Assembly Calculators",
    seoDescription: "Professional welding calculators for WPS preheat, PWHT, carbon equivalent, arc welding heat input, HAZ width, bolted joint design to VDI 2230.",
  },
  {
    id: "sheet-metal-forming-metal-processing",
    label: "Sheet Metal, Forming & Metal Processing",
    shortLabel: "Sheet Metal & Forming",
    description: "Sheet metal, forming, bending, press brake, laser cutting, casting if metal process.",
    premiumPromise: "Optimize sheet metal operations, reduce scrap, and validate forming parameters for press brake, laser cutting, and casting processes.",
    buyerSegments: ["Sheet Metal Engineer", "Press Brake Operator", "Manufacturing Engineer", "Production Planner"],
    decisionFamilies: ["process_sizing", "cost_optimization", "scenario_comparison"],
    standardsFamilies: ["ISO 9013", "VDI 2906"],
    riskProfile: "MEDIUM",
    keywords: ["sheet metal", "forming", "bending", "press brake", "laser cutting", "stamping", "nesting", "blank", "die", "springback", "casting", "metal process"],
    negativeKeywords: ["weld", "cnc", "plastics", "injection", "polymer"],
    iconKey: "metal",
    priority: 4,
    seoTitle: "Sheet Metal, Forming & Metal Processing Calculators",
    seoDescription: "Professional sheet metal calculators for press brake bending, laser cutting, stamping, nesting rate, casting yield, and forming process optimization.",
  },
  {
    id: "plastics-polymer-molding",
    label: "Plastics, Polymer & Molding",
    shortLabel: "Plastics & Molding",
    description: "Injection molding, extrusion, cooling time, clamping tonnage, plastic drying, polymer processing.",
    premiumPromise: "Optimize injection molding cycle time, calculate clamping tonnage, and reduce polymer processing defects.",
    buyerSegments: ["Plastics Engineer", "Injection Molding Manager", "Process Engineer", "Tooling Engineer"],
    decisionFamilies: ["process_sizing", "cost_optimization", "capacity_check"],
    standardsFamilies: ["ISO 294", "VDI 2002"],
    riskProfile: "MEDIUM",
    keywords: ["injection", "molding", "extrusion", "cooling time", "clamping tonnage", "plastic", "polymer", "drying"],
    negativeKeywords: ["sheet metal", "metal", "welding", "cnc"],
    iconKey: "packaging",
    priority: 5,
    seoTitle: "Plastics, Polymer & Molding Calculators",
    seoDescription: "Professional plastics calculators for injection molding cycle time, clamping tonnage, cooling time, extrusion, and polymer processing optimization.",
  },
  {
    id: "structural-steel-lifting-systems",
    label: "Structural Steel & Lifting Systems",
    shortLabel: "Structural Steel",
    description: "Steel column, steel beam, hollow section, crane runway beam, anchor bolt group, wire rope sling, structural buckling, fatigue of lifting/steel elements.",
    premiumPromise: "Validate steel structural designs to Eurocode/AISC, calculate lifting capacity, and ensure safe structural integrity.",
    buyerSegments: ["Structural Engineer", "Steel Detailer", "Construction Engineer", "Lifting Engineer"],
    decisionFamilies: ["design_check", "safety_validation", "compliance_check"],
    standardsFamilies: ["Eurocode 3", "AISC 360", "EN 1993", "ISO 898", "ASME B30"],
    riskProfile: "CRITICAL",
    keywords: ["steel column", "steel beam", "hollow section", "rhs", "shs", "chs", "crane runway", "anchor bolt", "wire rope", "sling", "structural buckling", "base plate", "steel connection", "column buckling"],
    negativeKeywords: ["concrete", "rc", "foundation", "civil", "welding"],
    iconKey: "build",
    priority: 6,
    seoTitle: "Structural Steel & Lifting Systems Calculators",
    seoDescription: "Professional structural steel calculators for column/beam design, hollow sections, crane runway beams, anchor bolts, and wire rope sling capacity.",
  },
  {
    id: "reinforced-concrete-civil-geotechnical",
    label: "Reinforced Concrete, Civil & Geotechnical",
    shortLabel: "Concrete & Geotech",
    description: "RC beam, RC column, shallow foundation, mass concrete, storm water, roof/truss if construction/civil context, soil/foundation.",
    premiumPromise: "Design reinforced concrete elements to Eurocode 2/ACI, calculate foundation bearing capacity, and optimize site concrete quantities.",
    buyerSegments: ["Civil Engineer", "Structural Engineer", "Site Engineer", "Geotechnical Engineer"],
    decisionFamilies: ["design_check", "process_sizing", "compliance_check", "safety_validation"],
    standardsFamilies: ["Eurocode 2", "ACI 318", "EN 1992", "BS 8110", "ISO 19338"],
    riskProfile: "CRITICAL",
    keywords: ["rc beam", "rc column", "reinforced concrete", "foundation", "shallow foundation", "mass concrete", "storm water", "runoff", "concrete volume", "rebar", "slab", "concrete crack"],
    negativeKeywords: ["steel column", "steel beam", "crane", "structural steel", "welding"],
    iconKey: "concrete",
    priority: 7,
    seoTitle: "Reinforced Concrete, Civil & Geotechnical Calculators",
    seoDescription: "Professional concrete and civil engineering calculators for RC beam/column design, foundation bearing capacity, mass concrete thermal crack risk, and storm water runoff.",
  },
  {
    id: "construction-project-site-cost-schedule",
    label: "Construction Project, Site Cost & Schedule",
    shortLabel: "Construction Management",
    description: "CPM delay, liquidated damages, project escalation, acceleration/crashing, site planning, construction cost control.",
    premiumPromise: "Quantify schedule delay impact, calculate liquidated damages exposure, and make data-driven project acceleration decisions.",
    buyerSegments: ["Construction Manager", "Project Manager", "Quantity Surveyor", "Site Manager", "Contract Administrator"],
    decisionFamilies: ["cost_optimization", "risk_assessment", "financial_feasibility", "scenario_comparison"],
    standardsFamilies: ["PMI PMBOK", "ICE Conditions", "FIDIC"],
    riskProfile: "MEDIUM",
    keywords: ["cpm", "delay", "liquidated damages", "ld", "acceleration", "crashing", "project escalation", "site planning", "construction cost", "evm", "progress payment", "contract"],
    negativeKeywords: ["beam", "column", "concrete", "steel design", "foundation"],
    iconKey: "helmet",
    priority: 8,
    seoTitle: "Construction Project, Site Cost & Schedule Calculators",
    seoDescription: "Professional construction management calculators for CPM schedule delay, liquidated damages, project cost escalation, and acceleration/crashing analysis.",
  },
  {
    id: "pressure-vessel-piping-static-equipment",
    label: "Pressure Vessel, Piping & Static Equipment",
    shortLabel: "Pressure Vessel & Piping",
    description: "Pressure vessel, MAWP, ASME VIII, PED, pipeline wall thickness, MAOP, burst pressure, storage tank venting, expansion joint, flare stack if equipment safety.",
    premiumPromise: "Ensure pressure equipment integrity to ASME VIII/PED, calculate MAWP, and validate piping wall thickness against burst and MAOP requirements.",
    buyerSegments: ["Pressure Vessel Engineer", "Piping Engineer", "Mechanical Integrity Engineer", "Process Safety Engineer"],
    decisionFamilies: ["design_check", "safety_validation", "compliance_check"],
    standardsFamilies: ["ASME VIII", "PED 2014/68/EU", "ASME B31.3", "API 510", "API 620", "API 650", "EN 13445"],
    riskProfile: "CRITICAL",
    keywords: ["pressure vessel", "mawp", "asme viii", "ped", "pipeline", "wall thickness", "maop", "burst pressure", "storage tank", "venting", "expansion joint", "flare stack", "piping", "static equipment"],
    negativeKeywords: ["pump", "npsh", "hydraulic", "cnc", "welding"],
    iconKey: "pressure",
    priority: 9,
    seoTitle: "Pressure Vessel, Piping & Static Equipment Calculators",
    seoDescription: "Professional pressure vessel and piping calculators for MAWP, ASME VIII sizing, pipeline wall thickness, MAOP, burst pressure, storage tank venting, and expansion joints.",
  },
  {
    id: "pumps-hydraulics-fluid-machinery",
    label: "Pumps, Hydraulics & Fluid Machinery",
    shortLabel: "Pumps & Hydraulics",
    description: "Pump NPSH, cavitation, system curve, hydraulic cylinder, fan if fluid machinery, compressor sizing if mechanical fluid machine.",
    premiumPromise: "Prevent pump cavitation, optimize system operation, and correctly size hydraulic cylinders and fluid machinery.",
    buyerSegments: ["Mechanical Engineer", "Pump Engineer", "Hydraulic Engineer", "Maintenance Engineer", "MEP Engineer"],
    decisionFamilies: ["process_sizing", "capacity_check", "energy_audit"],
    standardsFamilies: ["ISO 9906", "ANSI/HI 1.3", "Eurocoded", "API 610"],
    riskProfile: "HIGH",
    keywords: ["pump", "npsh", "cavitation", "system curve", "bep", "hydraulic cylinder", "fan", "compressor", "rotating equipment", "centrifugal"],
    negativeKeywords: ["pressure vessel", "pipeline wall", "reactor", "heat exchanger"],
    iconKey: "water",
    priority: 10,
    seoTitle: "Pumps, Hydraulics & Fluid Machinery Calculators",
    seoDescription: "Professional pump and hydraulic calculators for NPSH available, cavitation analysis, system curve, BEP deviation, hydraulic cylinder sizing, and fan selection.",
  },
  {
    id: "process-chemical-thermal-equipment",
    label: "Process, Chemical & Thermal Equipment",
    shortLabel: "Chemical & Thermal",
    description: "Chemical reactor, heat of reaction, thermal runaway, shell & tube heat exchanger, fired heater, evaporator, static mixer, scrubber, packed column, orifice flow meter, electroplating bath.",
    premiumPromise: "Design and validate chemical process equipment, optimize heat transfer, and ensure process safety with industry-standard methods.",
    buyerSegments: ["Process Engineer", "Chemical Engineer", "Thermal Engineer", "Plant Engineer"],
    decisionFamilies: ["process_sizing", "design_check", "safety_validation", "energy_audit"],
    standardsFamilies: ["TEMA", "ASME VIII", "API 660", "ISO 16852", "HEI"],
    riskProfile: "HIGH",
    keywords: ["reactor", "heat of reaction", "thermal runaway", "heat exchanger", "shell & tube", "fired heater", "evaporator", "static mixer", "scrubber", "packed column", "orifice", "flow meter", "electroplating", "process"],
    negativeKeywords: ["pump", "npsh", "hydraulic", "steel", "structural"],
    iconKey: "flask",
    priority: 11,
    seoTitle: "Process, Chemical & Thermal Equipment Calculators",
    seoDescription: "Professional process engineering calculators for chemical reactor design, heat of reaction, shell & tube heat exchangers, fired heater efficiency, scrubber sizing, and more.",
  },
  {
    id: "hvac-refrigeration-building-utilities",
    label: "HVAC, Refrigeration & Building Utilities",
    shortLabel: "HVAC & Refrigeration",
    description: "Refrigeration COP, chilled water plant, cooling tower, ventilation duct sizing, thermal insulation, heat pump, facility thermal utilities.",
    premiumPromise: "Optimize HVAC system performance, reduce energy consumption, and correctly size refrigeration and building utility equipment.",
    buyerSegments: ["HVAC Engineer", "MEP Engineer", "Facility Manager", "Energy Manager", "Refrigeration Engineer"],
    decisionFamilies: ["process_sizing", "energy_audit", "capacity_check", "cost_optimization"],
    standardsFamilies: ["ASHRAE", "ISO 16813", "EN 16798", "Eurovent"],
    riskProfile: "MEDIUM",
    keywords: ["hvac", "refrigeration", "cop", "chilled water", "cooling tower", "ventilation", "duct sizing", "thermal insulation", "heat pump", "building utilities"],
    negativeKeywords: ["compressed air", "motor", "power factor", "cable", "transformer"],
    iconKey: "energy",
    priority: 12,
    seoTitle: "HVAC, Refrigeration & Building Utilities Calculators",
    seoDescription: "Professional HVAC calculators for refrigeration COP, chilled water plant performance, cooling tower sizing, ventilation duct design, thermal insulation, and heat pump analysis.",
  },
  {
    id: "compressed-air-motors-industrial-energy-audit",
    label: "Compressed Air, Motors & Industrial Energy Audit",
    shortLabel: "Energy Audit",
    description: "Compressed air leakage, receiver sizing, motor energy audit, VFD retrofit ROI, power factor penalty, industrial electricity bill, energy loss audit.",
    premiumPromise: "Quantify compressed air leakage cost, calculate VFD retrofit ROI, and identify industrial energy savings opportunities.",
    buyerSegments: ["Energy Manager", "Maintenance Engineer", "Plant Engineer", "Facility Manager", "Sustainability Specialist"],
    decisionFamilies: ["energy_audit", "cost_optimization", "financial_feasibility", "scenario_comparison"],
    standardsFamilies: ["ISO 50001", "ISO 11011", "IEC 60034", "EnMS"],
    riskProfile: "LOW",
    keywords: ["compressed air", "leakage", "receiver", "motor energy", "vfd", "power factor", "electricity bill", "energy loss", "energy audit"],
    negativeKeywords: ["hvac", "refrigeration", "chilled water", "cooling tower", "ventilation"],
    iconKey: "lightning",
    priority: 13,
    seoTitle: "Compressed Air, Motors & Industrial Energy Audit Calculators",
    seoDescription: "Professional industrial energy audit calculators for compressed air leakage, receiver sizing, motor energy audit, VFD retrofit ROI, power factor penalty, and energy loss quantification.",
  },
  {
    id: "electrical-power-panel-grid-safety",
    label: "Electrical Power, Panel & Grid Safety",
    shortLabel: "Electrical Power",
    description: "Cable ampacity, voltage drop, transformer loading, substation earthing, lightning protection, IEC 60364, LV/MV distribution, SPD coordination.",
    premiumPromise: "Ensure electrical system safety and compliance to IEC 60364, calculate cable sizing, and validate transformer loading and earthing design.",
    buyerSegments: ["Electrical Engineer", "Power Systems Engineer", "Panel Designer", "Maintenance Electrician"],
    decisionFamilies: ["design_check", "safety_validation", "compliance_check"],
    standardsFamilies: ["IEC 60364", "IEC 62305", "IEEE 80", "IEC 60909", "NEC"],
    riskProfile: "CRITICAL",
    keywords: ["cable", "ampacity", "voltage drop", "transformer", "substation", "earthing", "grounding", "lightning", "protection", "iec 60364", "lv", "mv", "spd", "switchgear", "panel"],
    negativeKeywords: ["hvac", "compressed air", "motor", "pump", "solar", "pv"],
    iconKey: "electric",
    priority: 14,
    seoTitle: "Electrical Power, Panel & Grid Safety Calculators",
    seoDescription: "Professional electrical power calculators for cable ampacity, voltage drop, transformer loading, substation earthing, lightning protection, and LV/MV distribution to IEC 60364.",
  },
  {
    id: "renewable-energy-carbon-esg-finance",
    label: "Renewable Energy, Carbon & ESG Finance",
    shortLabel: "Renewables & ESG",
    description: "PV sizing, CBAM, carbon exposure, ESG compliance, waste circularity, carbon payback, EU taxonomy.",
    premiumPromise: "Quantify carbon exposure under CBAM, optimize renewable energy investment, and demonstrate ESG compliance to EU taxonomy.",
    buyerSegments: ["Energy Manager", "Sustainability Manager", "ESG Analyst", "Carbon Advisor", "Compliance Officer"],
    decisionFamilies: ["financial_feasibility", "compliance_check", "energy_audit", "scenario_comparison"],
    standardsFamilies: ["EU ETS", "CBAM", "EU Taxonomy", "ISO 14064", "GHG Protocol", "TCFD"],
    riskProfile: "MEDIUM",
    keywords: ["solar", "pv", "renewable", "carbon", "cbam", "esg", "carbon exposure", "carbon payback", "waste circularity", "eu taxonomy", "scope", "emission"],
    negativeKeywords: ["cable", "transformer", "earthing", "electrical power", "substation"],
    iconKey: "leaf",
    priority: 15,
    seoTitle: "Renewable Energy, Carbon & ESG Finance Calculators",
    seoDescription: "Professional renewable energy and ESG calculators for PV system sizing, CBAM financial exposure, carbon footprint, ESG compliance, and EU taxonomy alignment.",
  },
  {
    id: "quality-spc-metrology-calibration",
    label: "Quality, SPC, Metrology & Calibration",
    shortLabel: "Quality & Metrology",
    description: "Cp/Cpk/Ppk, PPM, DPMO, sigma level, ISO 17025, calibration drift, conformity decision risk, guard band, measurement uncertainty.",
    premiumPromise: "Reduce quality risk, validate measurement systems to ISO 17025, and make data-driven conformity decisions with guard band methodology.",
    buyerSegments: ["Quality Engineer", "Metrology Engineer", "Calibration Technician", "Six Sigma Black Belt", "Lab Manager"],
    decisionFamilies: ["quality_decision", "compliance_check", "risk_assessment"],
    standardsFamilies: ["ISO 17025", "ISO 9001", "IATF 16949", "ISO 10012", "JCGM 100", "AIAG MSA"],
    riskProfile: "HIGH",
    keywords: ["cp", "cpk", "ppk", "ppm", "dpmo", "sigma level", "six sigma", "spc", "calibration", "drift", "iso 17025", "conformity", "guard band", "measurement uncertainty", "msa", "aql", "quality"],
    negativeKeywords: ["cnc", "machining", "welding", "structural", "pressure"],
    iconKey: "quality",
    priority: 16,
    seoTitle: "Quality, SPC, Metrology & Calibration Calculators",
    seoDescription: "Professional quality and metrology calculators for Cp/Cpk/Ppk, DPMO, sigma level, ISO 17025 calibration drift analysis, guard band decision risk, and measurement uncertainty.",
  },
  {
    id: "maintenance-reliability-asset-life",
    label: "Maintenance, Reliability & Asset Life",
    shortLabel: "Maintenance & Reliability",
    description: "Bearing L10h, ISO 281 modified life, fatigue life, Miner's rule, maintenance ROI, failure risk, lubrication factor, reliability-centered analysis.",
    premiumPromise: "Predict asset life, optimize maintenance intervals, and calculate ROI of reliability improvement programs.",
    buyerSegments: ["Maintenance Engineer", "Reliability Engineer", "Asset Manager", "Plant Engineer"],
    decisionFamilies: ["reliability_analysis", "risk_assessment", "cost_optimization", "financial_feasibility"],
    standardsFamilies: ["ISO 281", "ISO 6336", "AGMA", "Miner's Rule", "IEC 60300", "ISO 14224"],
    riskProfile: "HIGH",
    keywords: ["bearing", "l10h", "iso 281", "fatigue", "miner", "maintenance", "reliability", "asset life", "rca", "mtbf", "mttr", "lubrication", "gear", "spring"],
    negativeKeywords: ["cnc", "machining", "welding", "structural"],
    iconKey: "maintenance",
    priority: 17,
    seoTitle: "Maintenance, Reliability & Asset Life Calculators",
    seoDescription: "Professional maintenance and reliability calculators for bearing L10h life, ISO 281 modified life, fatigue analysis, Miner's rule, maintenance ROI, and asset life prediction.",
  },
  {
    id: "hse-fire-explosion-occupational-safety",
    label: "HSE, Fire, Explosion & Occupational Safety",
    shortLabel: "HSE & Fire Safety",
    description: "Dust explosion, toxic gas dispersion, flare thermal radiation exclusion zone, industrial noise, forklift stability, fire/exclusion zone, hazardous atmosphere, OSHA dose.",
    premiumPromise: "Quantify safety risks, establish safe exclusion zones, and demonstrate regulatory compliance for fire, explosion, and occupational hazards.",
    buyerSegments: ["HSE Specialist", "Process Safety Engineer", "Fire Engineer", "Safety Manager", "Industrial Hygienist"],
    decisionFamilies: ["safety_validation", "compliance_check", "risk_assessment"],
    standardsFamilies: ["OSHA", "NFPA", "IEC 60079", "ATEX", "DSEAR", "API 521", "ISO 3744"],
    riskProfile: "CRITICAL",
    keywords: ["dust explosion", "toxic gas", "dispersion", "flare", "thermal radiation", "exclusion zone", "industrial noise", "forklift stability", "fire", "hazardous atmosphere", "osha", "hse", "safety"],
    negativeKeywords: ["cnc", "machining", "lean", "quality", "finance"],
    iconKey: "shield",
    priority: 18,
    seoTitle: "HSE, Fire, Explosion & Occupational Safety Calculators",
    seoDescription: "Professional HSE and safety calculators for dust explosion severity, toxic gas dispersion, flare thermal radiation, industrial noise attenuation, forklift stability, and hazardous atmosphere.",
  },
  {
    id: "logistics-warehouse-material-handling",
    label: "Logistics, Warehouse & Material Handling",
    shortLabel: "Logistics & Warehousing",
    description: "EOQ, reorder point, safety stock, warehouse cube utilization, pallet positions, conveyor capacity, screw conveyor, forklift if logistics-dominant.",
    premiumPromise: "Optimize inventory levels, maximize warehouse space utilization, and reduce logistics costs with data-driven decisions.",
    buyerSegments: ["Logistics Manager", "Warehouse Manager", "Supply Chain Analyst", "Operations Manager"],
    decisionFamilies: ["cost_optimization", "capacity_check", "scenario_comparison"],
    standardsFamilies: ["APICS", "SCOR", "ISO 28000"],
    riskProfile: "LOW",
    keywords: ["eoq", "reorder point", "safety stock", "warehouse", "cube utilization", "pallet", "conveyor", "screw conveyor", "material handling", "inventory", "logistics", "freight"],
    negativeKeywords: ["pressure vessel", "structural", "electrical", "hse"],
    iconKey: "truck",
    priority: 19,
    seoTitle: "Logistics, Warehouse & Material Handling Calculators",
    seoDescription: "Professional logistics calculators for EOQ, reorder point, safety stock, warehouse cube utilization, conveyor capacity, screw conveyor sizing, and material handling optimization.",
  },
  {
    id: "finance-sales-working-capital",
    label: "Finance, Sales & Working Capital",
    shortLabel: "Finance & Working Capital",
    description: "Commercial credit assessment, working capital, DSO/DPO/DIO, break-even, sales margin, NPV/IRR/payback where corporate finance.",
    premiumPromise: "Assess credit risk, optimize working capital, and make data-driven sales and pricing decisions with comprehensive financial analysis.",
    buyerSegments: ["CFO", "Finance Analyst", "Credit Manager", "Sales Manager", "Accountant"],
    decisionFamilies: ["financial_feasibility", "risk_assessment", "cost_optimization", "scenario_comparison"],
    standardsFamilies: ["IFRS", "GAAP", "Basel III", "ISO 31000"],
    riskProfile: "MEDIUM",
    keywords: ["commercial credit", "working capital", "dso", "dpo", "dio", "break-even", "margin", "sales margin", "npv", "irr", "payback", "finance", "credit assessment", "price", "quote"],
    negativeKeywords: ["capital investment", "roi", "digital twin", "investment appraisal", "depreciation"],
    iconKey: "finance",
    priority: 20,
    seoTitle: "Finance, Sales & Working Capital Calculators",
    seoDescription: "Professional finance calculators for commercial credit assessment, working capital analysis, DSO/DPO/DIO, break-even analysis, and sales margin optimization.",
  },
  {
    id: "capital-investment-roi-business-case",
    label: "Capital Investment, ROI & Business Case",
    shortLabel: "Investment & ROI",
    description: "Capital investment appraisal, digital twin ROI, VFD ROI, retrofit ROI, cost avoidance, NPV, payback, scenario financial comparison.",
    premiumPromise: "Build compelling investment business cases, compare scenarios, and justify capital expenditure with quantifiable ROI analysis.",
    buyerSegments: ["CFO", "Investment Analyst", "Project Manager", "Business Development Manager", "Plant Manager"],
    decisionFamilies: ["financial_feasibility", "scenario_comparison", "cost_optimization", "risk_assessment"],
    standardsFamilies: ["IFRS", "GAAP", "ISO 15686"],
    riskProfile: "MEDIUM",
    keywords: ["capital investment", "investment appraisal", "digital twin roi", "vfd roi", "retrofit roi", "cost avoidance", "npv", "payback", "business case", "depreciation", "scenario comparison"],
    negativeKeywords: ["working capital", "credit assessment", "dso", "break-even", "margin"],
    iconKey: "trending-up",
    priority: 21,
    seoTitle: "Capital Investment, ROI & Business Case Calculators",
    seoDescription: "Professional capital investment calculators for investment appraisal, digital twin ROI, VFD retrofit ROI, cost avoidance analysis, NPV/IRR/payback, and scenario comparison.",
  },
  {
    id: "workforce-shift-hr-cost",
    label: "Workforce, Shift & HR Cost",
    shortLabel: "Workforce & HR",
    description: "Labor hour, shift cost, overtime, productivity, workforce cost, ergonomics if labor-risk dominant.",
    premiumPromise: "Optimize workforce costs, evaluate shift patterns, and make data-driven staffing decisions.",
    buyerSegments: ["HR Manager", "Plant Manager", "Operations Manager", "Finance Manager"],
    decisionFamilies: ["cost_optimization", "capacity_check", "scenario_comparison"],
    standardsFamilies: ["ILO", "ISO 30400"],
    riskProfile: "LOW",
    keywords: ["labor", "shift", "overtime", "productivity", "workforce", "hr", "employee", "ergonomics"],
    negativeKeywords: ["cnc", "machining", "welding", "structural", "electrical"],
    iconKey: "people",
    priority: 22,
    seoTitle: "Workforce, Shift & HR Cost Calculators",
    seoDescription: "Professional workforce calculators for labor hour cost, shift pattern optimization, overtime analysis, productivity measurement, and HR cost management.",
  },
  {
    id: "digital-factory-automation-industry-4",
    label: "Digital Factory, Automation & Industry 4.0",
    shortLabel: "Digital Factory",
    description: "Digital twin, ISO 23247, automation ROI, factory data, industrial automation if not pure finance.",
    premiumPromise: "Evaluate Industry 4.0 investments, calculate automation ROI, and build the business case for digital transformation.",
    buyerSegments: ["Automation Engineer", "Digital Transformation Manager", "Industry 4.0 Specialist", "IT/OT Manager"],
    decisionFamilies: ["financial_feasibility", "scenario_comparison", "cost_optimization"],
    standardsFamilies: ["ISO 23247", "IEC 62264", "RAMI 4.0"],
    riskProfile: "MEDIUM",
    keywords: ["digital twin", "automation", "industry 4", "industry 4.0", "iot", "cobot", "agv", "factory data", "digital transformation"],
    negativeKeywords: ["cnc", "machining", "welding", "structural", "hvac"],
    iconKey: "automation",
    priority: 23,
    seoTitle: "Digital Factory, Automation & Industry 4.0 Calculators",
    seoDescription: "Professional Industry 4.0 calculators for digital twin ROI, automation investment analysis, cobot/AGV feasibility, and digital transformation business case.",
  },
  {
    id: "technology-ai-cloud-cyber-risk",
    label: "Technology, AI, Cloud & Cyber Risk",
    shortLabel: "Tech & Cyber Risk",
    description: "AI cost, cloud risk, cyber risk, API/SLA cost, digital infrastructure risk.",
    premiumPromise: "Quantify technology investment risks, evaluate cloud migration costs, and assess cyber security exposure.",
    buyerSegments: ["CTO", "IT Manager", "Cyber Security Analyst", "Cloud Architect", "Technology Investor"],
    decisionFamilies: ["risk_assessment", "cost_optimization", "financial_feasibility", "scenario_comparison"],
    standardsFamilies: ["ISO 27001", "NIST CSF", "GDPR", "EU AI Act", "CSA STAR"],
    riskProfile: "MEDIUM",
    keywords: ["ai cost", "cloud risk", "cyber risk", "api", "sla", "digital infrastructure", "technology", "saas", "software"],
    negativeKeywords: ["cnc", "manufacturing", "welding", "structural", "process"],
    iconKey: "chip",
    priority: 24,
    seoTitle: "Technology, AI, Cloud & Cyber Risk Calculators",
    seoDescription: "Professional technology risk calculators for AI cost analysis, cloud migration risk, cyber security exposure, API/SLA cost evaluation, and digital infrastructure investment.",
  },
  {
    id: "water-wastewater-environmental-process",
    label: "Water, Wastewater & Environmental Process",
    shortLabel: "Water & Wastewater",
    description: "Activated sludge, aeration, wastewater treatment, environmental process systems, emissions control if process-environmental.",
    premiumPromise: "Optimize wastewater treatment processes, design aeration systems, and ensure environmental compliance.",
    buyerSegments: ["Environmental Engineer", "Water Treatment Engineer", "Process Engineer", "Plant Engineer"],
    decisionFamilies: ["process_sizing", "compliance_check", "energy_audit"],
    standardsFamilies: ["ISO 14001", "ATV-DVWK", "EPA", "EU Water Framework Directive"],
    riskProfile: "MEDIUM",
    keywords: ["activated sludge", "aeration", "wastewater", "water treatment", "environmental", "emissions control", "clarifier"],
    negativeKeywords: ["hvac", "refrigeration", "compressed air", "structural"],
    iconKey: "droplets",
    priority: 25,
    seoTitle: "Water, Wastewater & Environmental Process Calculators",
    seoDescription: "Professional water and wastewater calculators for activated sludge aeration design, wastewater treatment optimization, and environmental process systems.",
  },
  {
    id: "food-packaging-cold-chain",
    label: "Food, Packaging & Cold Chain",
    shortLabel: "Food & Cold Chain",
    description: "Food process, packaging, cold chain, pasteurization, refrigeration if food-specific.",
    premiumPromise: "Optimize food processing operations, maintain cold chain integrity, and reduce packaging costs.",
    buyerSegments: ["Food Engineer", "Production Manager", "Cold Chain Manager", "Quality Manager"],
    decisionFamilies: ["process_sizing", "cost_optimization", "capacity_check"],
    standardsFamilies: ["HACCP", "ISO 22000", "BRCGS", "FSSC 22000"],
    riskProfile: "MEDIUM",
    keywords: ["food", "packaging", "cold chain", "pasteurization", "hygiene", "shelf life", "food processing"],
    negativeKeywords: ["wastewater", "activated sludge", "chemical reactor", "heat exchanger"],
    iconKey: "food",
    priority: 26,
    seoTitle: "Food, Packaging & Cold Chain Calculators",
    seoDescription: "Professional food industry calculators for food process optimization, cold chain integrity, packaging cost reduction, and HACCP compliance.",
  },
  {
    id: "agriculture-mining-marine-niche-heavy-industry",
    label: "Agriculture, Mining, Marine & Niche Heavy Industry",
    shortLabel: "Heavy Industry & Niche",
    description: "Mining, drilling, marine, agriculture, offshore, ship, heavy field operations, and niche industrial processes.",
    premiumPromise: "Solve niche industrial challenges with specialized calculators for mining, marine, agriculture, and heavy field operations.",
    buyerSegments: ["Mining Engineer", "Marine Engineer", "Agricultural Engineer", "Offshore Engineer"],
    decisionFamilies: ["process_sizing", "capacity_check", "cost_optimization"],
    standardsFamilies: ["ISO", "API", "IMO", "DNV"],
    riskProfile: "HIGH",
    keywords: ["mining", "drilling", "marine", "offshore", "ship", "agriculture", "heavy industry", "niche", "bulk material"],
    negativeKeywords: ["cnc", "welding", "hvac", "electrical"],
    iconKey: "industry",
    priority: 27,
    seoTitle: "Agriculture, Mining, Marine & Niche Heavy Industry Calculators",
    seoDescription: "Specialized calculators for mining, drilling, marine engineering, offshore operations, agriculture, and other niche heavy industrial applications.",
  },
];

export const PRO_CATEGORY_MAP: Readonly<Record<ProCategoryId, ProCategory>> = Object.fromEntries(
  PRO_CATEGORIES.map((cat) => [cat.id, cat])
) as Record<ProCategoryId, ProCategory>;

export function getProCategoryById(id: string): ProCategory | undefined {
  return PRO_CATEGORY_MAP[id as ProCategoryId];
}

export function listProCategoryIds(): readonly ProCategoryId[] {
  return PRO_CATEGORIES.map((cat) => cat.id);
}

const FORBIDDEN_SLUGS = new Set(["uncategorized", "misc", "other", "general", "genel"]);

export function assertValidProCategorySlug(slug: string): ProCategoryId {
  if (FORBIDDEN_SLUGS.has(slug)) {
    throw new Error(`Forbidden category slug: ${slug}`);
  }
  const cat = getProCategoryById(slug);
  if (!cat) {
    throw new Error(`Unknown pro category slug: ${slug}`);
  }
  return cat.id;
}
