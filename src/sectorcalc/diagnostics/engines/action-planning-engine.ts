import type {
  DomainId,
  DecisionState,
  ActionPlanOutput,
  ActionPlanItem,
} from "../diagnostic-types";

/* ── Domain-Specific Action Templates ── */

interface DomainActionTemplates {
  containment: ActionPlanItem[];
  temporary_fix: ActionPlanItem[];
  permanent_corrective_action: ActionPlanItem[];
}

type RiskLevel = "LOW_RISK" | "PROCEED_WITH_CAUTION" | "STOP_AND_INSPECT" | "QC_REQUIRED" | "HIGH_SCRAP_RISK";

const DOMAIN_TEMPLATES: Record<DomainId, Record<RiskLevel, DomainActionTemplates>> = {
  CNC_MACHINING: {
    LOW_RISK: {
      containment: [
        { action: "Continue production under standard monitoring", responsible_role: "Machine Operator", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase inspection frequency to every 10th part", responsible_role: "QC Technician", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust tool offset by measured deviation", responsible_role: "Machine Setter", priority: "HIGH", estimated_duration: "15 min" },
      ],
      permanent_corrective_action: [
        { action: "Review tool wear schedule and cutting parameters", responsible_role: "Process Engineer", priority: "MEDIUM", estimated_duration: "1 day" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Stop production on affected machine immediately", responsible_role: "Production Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Segregate last 50 parts for 100% inspection", responsible_role: "QC Technician", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Verify machine zero return and probe calibration", responsible_role: "Machine Setter", priority: "HIGH", estimated_duration: "30 min" },
      ],
      permanent_corrective_action: [
        { action: "Run capability study (Cp/Cpk) before resuming production", responsible_role: "Quality Engineer", priority: "HIGH", estimated_duration: "1 shift" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop production and quarantine all output since last known good part", responsible_role: "Production Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Perform 100% dimensional inspection of quarantined batch", responsible_role: "QC Inspector", priority: "IMMEDIATE", estimated_duration: "4 hours" },
      ],
      temporary_fix: [
        { action: "Temporarily reduce feed rate and depth of cut", responsible_role: "CNC Programmer", priority: "HIGH", estimated_duration: "20 min" },
      ],
      permanent_corrective_action: [
        { action: "Root cause investigation: tool, coolant, vibration, or material", responsible_role: "Manufacturing Engineer", priority: "HIGH", estimated_duration: "2 days" },
        { action: "Update process FMEA with findings", responsible_role: "Quality Engineer", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Immediate production stop on all related machines", responsible_role: "Plant Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full batch quarantine and sortation", responsible_role: "Logistics Supervisor", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Engage tooling supplier for emergency process review", responsible_role: "Buyer", priority: "HIGH", estimated_duration: "4 hours" },
      ],
      permanent_corrective_action: [
        { action: "Comprehensive process audit: machine, tooling, material, environment", responsible_role: "Senior Manufacturing Engineer", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Implement SPC with real-time alarms", responsible_role: "Automation Engineer", priority: "MEDIUM", estimated_duration: "2 weeks" },
      ],
    },
  },
  WELDING: {
    LOW_RISK: {
      containment: [
        { action: "Continue welding per approved WPS", responsible_role: "Welder", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase visual and NDT sampling frequency", responsible_role: "Welding Inspector", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust welding parameters (current, voltage, travel speed)", responsible_role: "Welding Engineer", priority: "HIGH", estimated_duration: "30 min" },
      ],
      permanent_corrective_action: [
        { action: "Review preheat and interpass temperature compliance", responsible_role: "Welding Engineer", priority: "MEDIUM", estimated_duration: "1 day" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Stop welding and isolate suspect welds", responsible_role: "Welding Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Perform NDT on last 5 welds", responsible_role: "NDT Technician", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Verify filler metal storage and condition", responsible_role: "Storekeeper", priority: "HIGH", estimated_duration: "30 min" },
      ],
      permanent_corrective_action: [
        { action: "Re-qualify welder if discontinuity pattern suggests skill issue", responsible_role: "QA Manager", priority: "HIGH", estimated_duration: "1 day" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop all welding and flag all welded joints for review", responsible_role: "Welding Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "100% NDT of affected weld batch", responsible_role: "NDT Technician", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Implement 100% interpass inspection", responsible_role: "Welding Inspector", priority: "HIGH", estimated_duration: "Remaining welds" },
      ],
      permanent_corrective_action: [
        { action: "WPS review and revision if necessary", responsible_role: "Welding Engineer", priority: "HIGH", estimated_duration: "2 days" },
        { action: "FMEA review for welding process", responsible_role: "Quality Engineer", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Immediate stop of all welding operations", responsible_role: "Plant Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full batch quarantine", responsible_role: "Production Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
      ],
      temporary_fix: [
        { action: "Emergency calibration of welding equipment", responsible_role: "Maintenance Technician", priority: "HIGH", estimated_duration: "4 hours" },
      ],
      permanent_corrective_action: [
        { action: "Full process capability study and equipment audit", responsible_role: "Senior Welding Engineer", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Implement real-time weld monitoring system", responsible_role: "Automation Engineer", priority: "MEDIUM", estimated_duration: "1 month" },
      ],
    },
  },
  STEEL_CONSTRUCTION: {
    LOW_RISK: {
      containment: [
        { action: "Continue erection per approved sequence", responsible_role: "Erection Supervisor", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase bolting and welding inspection frequency", responsible_role: "Site Inspector", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Tighten loose connections to specified torque", responsible_role: "Steel Erector", priority: "HIGH", estimated_duration: "1 hour" },
      ],
      permanent_corrective_action: [
        { action: "Review erection sequence and temporary bracing plan", responsible_role: "Structural Engineer", priority: "MEDIUM", estimated_duration: "1 day" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Stop erection in affected bay", responsible_role: "Site Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Survey as-built geometry and compare to design", responsible_role: "Surveyor", priority: "IMMEDIATE", estimated_duration: "4 hours" },
      ],
      temporary_fix: [
        { action: "Install additional temporary bracing", responsible_role: "Steel Erector", priority: "HIGH", estimated_duration: "2 hours" },
      ],
      permanent_corrective_action: [
        { action: "Structural assessment of affected connections", responsible_role: "Structural Engineer", priority: "HIGH", estimated_duration: "2 days" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop all steel erection in work area", responsible_role: "Project Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "100% inspection of all connections to date", responsible_role: "QC Inspector", priority: "IMMEDIATE", estimated_duration: "2 shifts" },
      ],
      temporary_fix: [
        { action: "Apply temporary supports pending structural review", responsible_role: "Steel Erector", priority: "HIGH", estimated_duration: "1 shift" },
      ],
      permanent_corrective_action: [
        { action: "Full connection design verification", responsible_role: "Structural Engineer", priority: "HIGH", estimated_duration: "3 days" },
        { action: "Material certificate review if material defect suspected", responsible_role: "QA Engineer", priority: "HIGH", estimated_duration: "1 day" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Immediate work stoppage and area evacuation if safety risk", responsible_role: "Safety Officer", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full structural integrity assessment ordered", responsible_role: "Project Manager", priority: "IMMEDIATE", estimated_duration: "1 week" },
      ],
      temporary_fix: [
        { action: "Emergency shoring and bracing", responsible_role: "Structural Engineer", priority: "HIGH", estimated_duration: "1 shift" },
      ],
      permanent_corrective_action: [
        { action: "Independent structural peer review", responsible_role: "External Structural Engineer", priority: "HIGH", estimated_duration: "2 weeks" },
        { action: "Root cause investigation and corrective action plan", responsible_role: "Project Quality Manager", priority: "HIGH", estimated_duration: "1 month" },
      ],
    },
  },
  CONCRETE: {
    LOW_RISK: {
      containment: [
        { action: "Continue placement per approved mix design", responsible_role: "Concrete Foreman", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase slump and temperature testing frequency", responsible_role: "QC Technician", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust water content within W/C ratio limit", responsible_role: "Batch Plant Operator", priority: "HIGH", estimated_duration: "30 min" },
      ],
      permanent_corrective_action: [
        { action: "Review aggregate moisture compensation procedure", responsible_role: "Materials Engineer", priority: "MEDIUM", estimated_duration: "1 day" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Stop concrete placement", responsible_role: "Site Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Take additional cylinder samples from current batch", responsible_role: "QC Technician", priority: "IMMEDIATE", estimated_duration: "30 min" },
      ],
      temporary_fix: [
        { action: "Verify mix design and batch ticket against specification", responsible_role: "Materials Engineer", priority: "HIGH", estimated_duration: "1 hour" },
      ],
      permanent_corrective_action: [
        { action: "Perform hardened concrete testing on suspect areas", responsible_role: "Testing Laboratory", priority: "HIGH", estimated_duration: "7 days" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop all concrete operations", responsible_role: "Construction Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Cordon off and assess placed concrete", responsible_role: "QC Manager", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Engage ready-mix supplier for batch records review", responsible_role: "Procurement", priority: "HIGH", estimated_duration: "4 hours" },
      ],
      permanent_corrective_action: [
        { action: "Full investigation: materials, batching, placement, curing", responsible_role: "Materials Engineer", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Core sampling and compressive strength testing", responsible_role: "Testing Laboratory", priority: "HIGH", estimated_duration: "14 days" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Immediate stop of all concrete operations site-wide", responsible_role: "Project Director", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Structural assessment of affected elements", responsible_role: "Structural Engineer", priority: "IMMEDIATE", estimated_duration: "1 week" },
      ],
      temporary_fix: [
        { action: "Engage specialist concrete repair contractor", responsible_role: "Procurement Manager", priority: "HIGH", estimated_duration: "2 days" },
      ],
      permanent_corrective_action: [
        { action: "Complete root cause analysis", responsible_role: "Quality Manager", priority: "HIGH", estimated_duration: "2 weeks" },
        { action: "Revise quality control plan for concrete operations", responsible_role: "QA/QC Manager", priority: "MEDIUM", estimated_duration: "1 month" },
      ],
    },
  },
  ELECTRICAL: {
    LOW_RISK: {
      containment: [
        { action: "Continue operation under standard monitoring", responsible_role: "Electrician", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Log readings every 30 minutes", responsible_role: "Maintenance Technician", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Tighten loose terminations", responsible_role: "Electrician", priority: "HIGH", estimated_duration: "1 hour" },
      ],
      permanent_corrective_action: [
        { action: "Schedule thermographic inspection of switchgear", responsible_role: "Electrical Engineer", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Isolate affected circuit", responsible_role: "Electrical Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Lock-out/tag-out and visual inspection", responsible_role: "Electrician", priority: "IMMEDIATE", estimated_duration: "1 hour" },
      ],
      temporary_fix: [
        { action: "Verify protective device coordination", responsible_role: "Electrical Engineer", priority: "HIGH", estimated_duration: "2 hours" },
      ],
      permanent_corrective_action: [
        { action: "Insulation resistance test and megger report", responsible_role: "Electrical Technician", priority: "HIGH", estimated_duration: "1 shift" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "De-energize affected system segment", responsible_role: "Electrical Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full inspection of all related circuits", responsible_role: "Electrical Inspector", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Install temporary bypass if production-critical", responsible_role: "Electrical Engineer", priority: "HIGH", estimated_duration: "4 hours" },
      ],
      permanent_corrective_action: [
        { action: "Detailed fault analysis and corrective maintenance", responsible_role: "Electrical Engineer", priority: "HIGH", estimated_duration: "3 days" },
        { action: "Update single-line diagrams and maintenance records", responsible_role: "Draftsman", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Complete shutdown of affected system", responsible_role: "Plant Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Safety hazard assessment required", responsible_role: "Safety Engineer", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Emergency replacement of damaged components", responsible_role: "Maintenance Team", priority: "HIGH", estimated_duration: "1 shift" },
      ],
      permanent_corrective_action: [
        { action: "Full system audit: design, installation, maintenance history", responsible_role: "Senior Electrical Engineer", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Implement predictive maintenance program", responsible_role: "Reliability Engineer", priority: "MEDIUM", estimated_duration: "1 month" },
      ],
    },
  },
  MECHANICAL: {
    LOW_RISK: {
      containment: [
        { action: "Continue operation under standard monitoring", responsible_role: "Operator", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Monitor vibration and temperature hourly", responsible_role: "Maintenance Technician", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust alignment or balance within acceptable range", responsible_role: "Millwright", priority: "HIGH", estimated_duration: "2 hours" },
      ],
      permanent_corrective_action: [
        { action: "Review lubrication schedule and oil analysis results", responsible_role: "Reliability Engineer", priority: "MEDIUM", estimated_duration: "1 day" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Stop rotating equipment", responsible_role: "Operations Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Perform visual and dimensional inspection", responsible_role: "Mechanical Inspector", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Replace worn seals or gaskets", responsible_role: "Mechanical Fitter", priority: "HIGH", estimated_duration: "3 hours" },
      ],
      permanent_corrective_action: [
        { action: "Detailed inspection report and condition assessment", responsible_role: "Mechanical Engineer", priority: "HIGH", estimated_duration: "1 shift" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop equipment and lock-out", responsible_role: "Maintenance Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Complete disassembly inspection of affected assembly", responsible_role: "Mechanical Fitter", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Install refurbished standby unit if available", responsible_role: "Maintenance Manager", priority: "HIGH", estimated_duration: "4 hours" },
      ],
      permanent_corrective_action: [
        { action: "Root cause failure analysis (RCFA)", responsible_role: "Reliability Engineer", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Update preventive maintenance plan", responsible_role: "Maintenance Planner", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Immediate equipment shutdown", responsible_role: "Plant Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Assess secondary damage to connected systems", responsible_role: "Mechanical Engineer", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Emergency parts procurement", responsible_role: "Procurement Specialist", priority: "HIGH", estimated_duration: "1 day" },
      ],
      permanent_corrective_action: [
        { action: "Full equipment overhaul or replacement recommendation", responsible_role: "Senior Mechanical Engineer", priority: "HIGH", estimated_duration: "2 weeks" },
        { action: "Update maintenance strategy and spare parts criticality", responsible_role: "Reliability Engineer", priority: "MEDIUM", estimated_duration: "1 month" },
      ],
    },
  },
  LOGISTICS: {
    LOW_RISK: {
      containment: [
        { action: "Continue operations under standard monitoring", responsible_role: "Logistics Supervisor", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase shipment inspection rate", responsible_role: "Warehouse Lead", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Reroute affected shipments to alternate carrier", responsible_role: "Logistics Coordinator", priority: "HIGH", estimated_duration: "2 hours" },
      ],
      permanent_corrective_action: [
        { action: "Review carrier performance and contract terms", responsible_role: "Logistics Manager", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Hold affected shipments pending inspection", responsible_role: "Warehouse Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Physical count and condition check of held inventory", responsible_role: "Inventory Clerk", priority: "IMMEDIATE", estimated_duration: "4 hours" },
      ],
      temporary_fix: [
        { action: "Arrange interim storage for blocked goods", responsible_role: "Warehouse Supervisor", priority: "HIGH", estimated_duration: "2 hours" },
      ],
      permanent_corrective_action: [
        { action: "Root cause: process, system, or vendor error investigation", responsible_role: "Logistics Manager", priority: "HIGH", estimated_duration: "3 days" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop all outbound shipments for full audit", responsible_role: "Distribution Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "100% inventory reconciliation", responsible_role: "Inventory Team", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Implement manual check-in/check-out for critical items", responsible_role: "Warehouse Lead", priority: "HIGH", estimated_duration: "Until system fix" },
      ],
      permanent_corrective_action: [
        { action: "WMS configuration audit and correction", responsible_role: "IT Systems Analyst", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Cycle counting process improvement", responsible_role: "Inventory Manager", priority: "MEDIUM", estimated_duration: "2 weeks" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Complete logistics operations halt", responsible_role: "Supply Chain Director", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "External audit engagement if fraud suspected", responsible_role: "Compliance Officer", priority: "IMMEDIATE", estimated_duration: "1 week" },
      ],
      temporary_fix: [
        { action: "Manual override processes for critical customer orders", responsible_role: "Customer Service Manager", priority: "HIGH", estimated_duration: "Until system restored" },
      ],
      permanent_corrective_action: [
        { action: "Full supply chain process re-engineering", responsible_role: "Supply Chain Director", priority: "HIGH", estimated_duration: "1 month" },
        { action: "Implement track-and-trace with exception alerts", responsible_role: "IT Project Manager", priority: "MEDIUM", estimated_duration: "2 months" },
      ],
    },
  },
  FACILITY: {
    LOW_RISK: {
      containment: [
        { action: "Continue operations under standard monitoring", responsible_role: "Facility Manager", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Log environmental conditions hourly", responsible_role: "Building Technician", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust HVAC setpoints and dampers", responsible_role: "HVAC Technician", priority: "HIGH", estimated_duration: "1 hour" },
      ],
      permanent_corrective_action: [
        { action: "Schedule preventive maintenance on affected equipment", responsible_role: "Facility Manager", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Isolate affected zone", responsible_role: "Facility Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Inspect equipment and review maintenance history", responsible_role: "Maintenance Technician", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Temporary repair or bypass of failed component", responsible_role: "Maintenance Technician", priority: "HIGH", estimated_duration: "3 hours" },
      ],
      permanent_corrective_action: [
        { action: "Detailed failure assessment and repair scope", responsible_role: "Facility Engineer", priority: "HIGH", estimated_duration: "2 days" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Shutdown affected systems", responsible_role: "Facility Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Comprehensive inspection of all related systems", responsible_role: "Facility Engineer", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Engage external service provider for emergency support", responsible_role: "Procurement", priority: "HIGH", estimated_duration: "4 hours" },
      ],
      permanent_corrective_action: [
        { action: "Root cause analysis and system redesign if necessary", responsible_role: "Facility Engineer", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Update facility management plan", responsible_role: "Facility Manager", priority: "MEDIUM", estimated_duration: "2 weeks" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Evacuate affected area if safety risk present", responsible_role: "Safety Officer", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full facility systems audit", responsible_role: "Facility Director", priority: "IMMEDIATE", estimated_duration: "1 week" },
      ],
      temporary_fix: [
        { action: "Emergency system bypass or rental equipment", responsible_role: "Facility Manager", priority: "HIGH", estimated_duration: "1 day" },
      ],
      permanent_corrective_action: [
        { action: "Capital improvement plan for system replacement", responsible_role: "Facility Director", priority: "HIGH", estimated_duration: "1 month" },
        { action: "Update business continuity plan", responsible_role: "Risk Manager", priority: "MEDIUM", estimated_duration: "1 month" },
      ],
    },
  },
  AGRICULTURE: {
    LOW_RISK: {
      containment: [
        { action: "Continue operations under standard monitoring", responsible_role: "Farm Manager", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increased monitoring of affected equipment or crop area", responsible_role: "Field Supervisor", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust equipment calibration settings", responsible_role: "Equipment Operator", priority: "HIGH", estimated_duration: "30 min" },
      ],
      permanent_corrective_action: [
        { action: "Review maintenance schedule for equipment", responsible_role: "Farm Manager", priority: "MEDIUM", estimated_duration: "3 days" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Stop operations in affected area", responsible_role: "Farm Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Inspect equipment and crop condition", responsible_role: "Agronomist", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Field repair of minor equipment issues", responsible_role: "Maintenance Technician", priority: "HIGH", estimated_duration: "3 hours" },
      ],
      permanent_corrective_action: [
        { action: "Detailed assessment and repair plan", responsible_role: "Agronomist", priority: "HIGH", estimated_duration: "2 days" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop all operations and isolate affected area", responsible_role: "Farm Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Comprehensive equipment inspection", responsible_role: "Maintenance Team", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Rental equipment for critical operations", responsible_role: "Procurement", priority: "HIGH", estimated_duration: "1 day" },
      ],
      permanent_corrective_action: [
        { action: "Root cause investigation and corrective plan", responsible_role: "Farm Manager", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Update standard operating procedures", responsible_role: "Quality Manager", priority: "MEDIUM", estimated_duration: "2 weeks" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Immediate stop of all operations", responsible_role: "Operations Director", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full asset condition audit", responsible_role: "Maintenance Manager", priority: "IMMEDIATE", estimated_duration: "1 week" },
      ],
      temporary_fix: [
        { action: "Engage external equipment service provider", responsible_role: "Procurement Manager", priority: "HIGH", estimated_duration: "2 days" },
      ],
      permanent_corrective_action: [
        { action: "Complete fleet/equipment renewal plan", responsible_role: "Operations Director", priority: "HIGH", estimated_duration: "1 month" },
        { action: "Implement predictive maintenance program", responsible_role: "Reliability Engineer", priority: "MEDIUM", estimated_duration: "2 months" },
      ],
    },
  },
  TEXTILE: {
    LOW_RISK: {
      containment: [
        { action: "Continue production under standard monitoring", responsible_role: "Production Supervisor", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase quality check frequency", responsible_role: "QC Inspector", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust machine tension and speed settings", responsible_role: "Machine Operator", priority: "HIGH", estimated_duration: "20 min" },
      ],
      permanent_corrective_action: [
        { action: "Review raw material quality with supplier", responsible_role: "Procurement Manager", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Stop affected production line", responsible_role: "Production Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Inspect machine rollers, guides, and sensors", responsible_role: "Maintenance Technician", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Clean and recalibrate sensors", responsible_role: "Automation Technician", priority: "HIGH", estimated_duration: "1 hour" },
      ],
      permanent_corrective_action: [
        { action: "Detailed machine condition assessment", responsible_role: "Mechanical Engineer", priority: "HIGH", estimated_duration: "2 days" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Stop all production on affected line", responsible_role: "Production Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "100% inspection of recent output batch", responsible_role: "QC Team", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Reroute production to alternate line if available", responsible_role: "Production Planner", priority: "HIGH", estimated_duration: "2 hours" },
      ],
      permanent_corrective_action: [
        { action: "Full root cause investigation", responsible_role: "Quality Manager", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Update process control parameters", responsible_role: "Process Engineer", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Stop all production", responsible_role: "Plant Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full quality audit of all active orders", responsible_role: "QC Manager", priority: "IMMEDIATE", estimated_duration: "2 shifts" },
      ],
      temporary_fix: [
        { action: "Expedite spare parts for machine repair", responsible_role: "Procurement", priority: "HIGH", estimated_duration: "1 day" },
      ],
      permanent_corrective_action: [
        { action: "Complete process capability study", responsible_role: "Process Engineer", priority: "HIGH", estimated_duration: "2 weeks" },
        { action: "Implement SPC on critical quality parameters", responsible_role: "Automation Engineer", priority: "MEDIUM", estimated_duration: "1 month" },
      ],
    },
  },
  WAREHOUSE: {
    LOW_RISK: {
      containment: [
        { action: "Continue operations under standard monitoring", responsible_role: "Warehouse Supervisor", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase cycle count frequency", responsible_role: "Inventory Clerk", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Rearrange storage location for better access", responsible_role: "Forklift Operator", priority: "HIGH", estimated_duration: "2 hours" },
      ],
      permanent_corrective_action: [
        { action: "Review slotting strategy and pick paths", responsible_role: "Warehouse Manager", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Block affected storage area", responsible_role: "Warehouse Supervisor", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Inspect racking and structural integrity", responsible_role: "Safety Inspector", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Relocate inventory from affected racks", responsible_role: "Warehouse Team", priority: "HIGH", estimated_duration: "4 hours" },
      ],
      permanent_corrective_action: [
        { action: "Racking repair or replacement plan", responsible_role: "Facility Engineer", priority: "HIGH", estimated_duration: "1 week" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Close affected zone for operations", responsible_role: "Warehouse Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full inventory reconciliation", responsible_role: "Inventory Team", priority: "IMMEDIATE", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Set up temporary storage in alternate area", responsible_role: "Operations Lead", priority: "HIGH", estimated_duration: "3 hours" },
      ],
      permanent_corrective_action: [
        { action: "Root cause investigation", responsible_role: "Warehouse Manager", priority: "HIGH", estimated_duration: "3 days" },
        { action: "WMS process correction", responsible_role: "IT Support", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Complete warehouse operations halt in affected zone", responsible_role: "Logistics Director", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Structural engineering assessment", responsible_role: "Structural Engineer", priority: "IMMEDIATE", estimated_duration: "1 week" },
      ],
      temporary_fix: [
        { action: "Mobile storage containers for critical inventory", responsible_role: "Operations Manager", priority: "HIGH", estimated_duration: "1 day" },
      ],
      permanent_corrective_action: [
        { action: "Full facility condition audit and remediation plan", responsible_role: "Facility Director", priority: "HIGH", estimated_duration: "1 month" },
        { action: "Update safety and inspection protocols", responsible_role: "Safety Manager", priority: "MEDIUM", estimated_duration: "2 weeks" },
      ],
    },
  },
  RESTAURANT: {
    LOW_RISK: {
      containment: [
        { action: "Continue service under standard monitoring", responsible_role: "Kitchen Manager", priority: "LOW", estimated_duration: "Ongoing" },
      ],
      temporary_fix: [],
      permanent_corrective_action: [],
    },
    PROCEED_WITH_CAUTION: {
      containment: [
        { action: "Increase temperature logging frequency", responsible_role: "Line Cook", priority: "MEDIUM", estimated_duration: "1 shift" },
      ],
      temporary_fix: [
        { action: "Adjust equipment temperature settings", responsible_role: "Kitchen Technician", priority: "HIGH", estimated_duration: "15 min" },
      ],
      permanent_corrective_action: [
        { action: "Schedule equipment preventive maintenance", responsible_role: "Facility Manager", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    STOP_AND_INSPECT: {
      containment: [
        { action: "Take affected equipment out of service", responsible_role: "Kitchen Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Inspect equipment and check calibration", responsible_role: "Maintenance Technician", priority: "IMMEDIATE", estimated_duration: "1 hour" },
      ],
      temporary_fix: [
        { action: "Use backup equipment if available", responsible_role: "Kitchen Manager", priority: "HIGH", estimated_duration: "30 min" },
      ],
      permanent_corrective_action: [
        { action: "Equipment repair or replacement assessment", responsible_role: "Facility Manager", priority: "HIGH", estimated_duration: "2 days" },
      ],
    },
    QC_REQUIRED: {
      containment: [
        { action: "Close affected kitchen station", responsible_role: "Executive Chef", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Full equipment and food safety inspection", responsible_role: "Health Inspector", priority: "IMMEDIATE", estimated_duration: "2 hours" },
      ],
      temporary_fix: [
        { action: "Temporary menu modification to reduce equipment load", responsible_role: "Executive Chef", priority: "HIGH", estimated_duration: "1 hour" },
      ],
      permanent_corrective_action: [
        { action: "Root cause investigation and corrective plan", responsible_role: "Operations Manager", priority: "HIGH", estimated_duration: "1 week" },
        { action: "Update kitchen equipment maintenance schedule", responsible_role: "Facility Manager", priority: "MEDIUM", estimated_duration: "1 week" },
      ],
    },
    HIGH_SCRAP_RISK: {
      containment: [
        { action: "Close kitchen until safety verified", responsible_role: "General Manager", priority: "IMMEDIATE", estimated_duration: "Immediate" },
        { action: "Engage external equipment service provider", responsible_role: "Procurement", priority: "IMMEDIATE", estimated_duration: "1 day" },
      ],
      temporary_fix: [
        { action: "Rental or temporary cooking equipment", responsible_role: "Procurement Manager", priority: "HIGH", estimated_duration: "2 days" },
      ],
      permanent_corrective_action: [
        { action: "Complete kitchen equipment audit and replacement plan", responsible_role: "Operations Director", priority: "HIGH", estimated_duration: "1 month" },
        { action: "Update health and safety plan", responsible_role: "Safety Manager", priority: "MEDIUM", estimated_duration: "2 weeks" },
      ],
    },
  },
};

const REQUIRED_MANUAL_CHECKS_BY_RISK: Record<RiskLevel, ActionPlanItem[]> = {
  LOW_RISK: [
    { action: "Standard visual check", responsible_role: "Operator", priority: "LOW", estimated_duration: "5 min" },
  ],
  PROCEED_WITH_CAUTION: [
    { action: "Operator self-inspection at defined interval", responsible_role: "Operator", priority: "MEDIUM", estimated_duration: "10 min hourly" },
    { action: "QC patrol inspection", responsible_role: "QC Inspector", priority: "MEDIUM", estimated_duration: "30 min per round" },
  ],
  STOP_AND_INSPECT: [
    { action: "Detailed dimensional/visual inspection by QC", responsible_role: "QC Inspector", priority: "HIGH", estimated_duration: "1 hour" },
    { action: "Supervisor sign-off before restart", responsible_role: "Production Supervisor", priority: "HIGH", estimated_duration: "15 min" },
  ],
  QC_REQUIRED: [
    { action: "100% inspection of affected batch", responsible_role: "QC Team", priority: "IMMEDIATE", estimated_duration: "1 shift" },
    { action: "Quality engineer review and disposition", responsible_role: "Quality Engineer", priority: "IMMEDIATE", estimated_duration: "2 hours" },
    { action: "Process capability verification before full restart", responsible_role: "Process Engineer", priority: "HIGH", estimated_duration: "1 shift" },
  ],
  HIGH_SCRAP_RISK: [
    { action: "Independent third-party inspection", responsible_role: "External Auditor", priority: "IMMEDIATE", estimated_duration: "1 day" },
    { action: "Complete process audit", responsible_role: "Quality Manager", priority: "IMMEDIATE", estimated_duration: "2 days" },
    { action: "Management review and restart authorization", responsible_role: "Plant Manager", priority: "IMMEDIATE", estimated_duration: "Half day" },
  ],
};

/**
 * Build an action plan from domain templates.
 *
 * This is a deterministic lookup — no AI generation.
 * Every domain has templates for all 5 decision states.
 * Advisory domains (D7-D12) use their own templates.
 */
export function buildActionPlan(
  domainId: DomainId,
  decision: DecisionState
): ActionPlanOutput {
  const domainTemplates = DOMAIN_TEMPLATES[domainId];
  if (!domainTemplates) {
    throw new Error(`No action plan templates found for domain: ${domainId}`);
  }

  const riskLevel = decision as RiskLevel;
  const plan = domainTemplates[riskLevel];

  if (!plan) {
    throw new Error(
      `No action plan templates for domain "${domainId}" at decision "${decision}"`
    );
  }

  return {
    domain_id: domainId,
    decision,
    containment: plan.containment,
    temporary_fix: plan.temporary_fix,
    permanent_corrective_action: plan.permanent_corrective_action,
    required_manual_checks: REQUIRED_MANUAL_CHECKS_BY_RISK[riskLevel],
  };
}
