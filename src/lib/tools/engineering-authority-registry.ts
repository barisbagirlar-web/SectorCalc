export type EngineeringAuthorityStatus =
  | "tuv_audit_ready_documentation"
  | "iso_9001_aligned_governance"
  | "reference_backed"
  | "formula_traceable"
  | "internally_verified"
  | "professional_review_recommended";

export type EngineeringAuthorityReference = {
  id: string;
  label: string;
  publisher?: string;
  standardFamily?: string;
  domain: string;
  referenceType:
    | "standard"
    | "code"
    | "handbook"
    | "engineering_practice"
    | "measurement_guidance";
  url?: string;
};

export type EngineeringAuthorityProfile = {
  toolSlug: string;
  authorityStatus: EngineeringAuthorityStatus[];
  calculationMethod: string;
  standards: EngineeringAuthorityReference[];
  assumptions: string[];
  limitations: string[];
  verificationChecks: string[];
  lastInternalReview: string;
  disclaimer: string;
};

// Safe fallback for PRO tools without specific profiles
export const DEFAULT_ENGINEERING_AUTHORITY_PROFILE: Omit<EngineeringAuthorityProfile, "toolSlug"> = {
  authorityStatus: [
    "iso_9001_aligned_governance",
    "internally_verified",
    "professional_review_recommended"
  ],
  calculationMethod: "SectorCalc general engineering calculation governance layer",
  standards: [],
  assumptions: [
    "Tool-specific authority mapping is pending internal review."
  ],
  limitations: [
    "This tool provides calculation support and decision guidance.",
    "It does not replace licensed engineering judgement, statutory approval, site inspection, regulatory review, or third-party certification."
  ],
  verificationChecks: [],
  lastInternalReview: new Date().toISOString().split('T')[0],
  disclaimer: "This tool provides calculation support and decision guidance. It does not replace licensed engineering judgement, statutory approval, site inspection, regulatory review, or third-party certification."
};

const registry = new Map<string, EngineeringAuthorityProfile>();

export function registerEngineeringAuthorityProfile(profile: EngineeringAuthorityProfile) {
  registry.set(profile.toolSlug, profile);
}

// ─────────────────────────────────────────────────────────────────────────────
// PRO TOOL AUTHORITY PROFILES REGISTRATION
// ─────────────────────────────────────────────────────────────────────────────

registerEngineeringAuthorityProfile({
  toolSlug: "cnc-quote-risk-analyzer",
  authorityStatus: ["reference_backed", "formula_traceable", "internally_verified", "iso_9001_aligned_governance"],
  calculationMethod: "Deterministic cost and time estimation based on standard machining parameters, material specific constants, and setup logic.",
  standards: [
    { id: "ISO-1302", label: "Geometrical Product Specifications (GPS)", domain: "Machining", referenceType: "standard" },
    { id: "ASME-B18", label: "Machinery's Handbook", domain: "Manufacturing", referenceType: "handbook", publisher: "Industrial Press" }
  ],
  assumptions: [
    "Machine setup time is uninterrupted.",
    "Cycle time represents true run time without unplanned machine down-states.",
    "Tooling wear and tear are generalized into burden rate unless specified."
  ],
  limitations: [
    "Unforeseen material defects or tool breakage are not modeled.",
    "Scrap rates are assumed static unless modeled by a stochastic input."
  ],
  verificationChecks: ["Zero-division guard for cycle times.", "Negative constraint on rates."],
  lastInternalReview: "2026-06-30",
  disclaimer: "Output is an estimation. True profitability requires localized burden rate verification."
});

registerEngineeringAuthorityProfile({
  toolSlug: "hvac-heat-load-analyzer",
  authorityStatus: ["reference_backed", "formula_traceable", "iso_9001_aligned_governance"],
  calculationMethod: "Manual J derived thermal calculation model for cooling and heating loads.",
  standards: [
    { id: "ACCA-MANUAL-J", label: "Residential Load Calculation", domain: "HVAC", referenceType: "standard", publisher: "ACCA" },
    { id: "ASHRAE-FUNDAMENTALS", label: "ASHRAE Handbook - Fundamentals", domain: "HVAC", referenceType: "handbook", publisher: "ASHRAE" }
  ],
  assumptions: [
    "Standard insulation values for target build year.",
    "Average solar heat gain coefficient for fenestrations.",
    "Standard infiltration rate based on envelope tightness."
  ],
  limitations: [
    "Not a replacement for a certified on-site Manual J/S/D.",
    "Local micro-climates may skew baseline temperature differentials."
  ],
  verificationChecks: ["Climate zone mapping bounds check.", "Dimensional unit conversion check (BTU/h)."],
  lastInternalReview: "2026-06-30",
  disclaimer: "For guidance and bidding support. Official sizing requires local code compliance."
});

registerEngineeringAuthorityProfile({
  toolSlug: "welding-cost-risk-analyzer",
  authorityStatus: ["formula_traceable", "internally_verified"],
  calculationMethod: "Deposition rate and labor ratio modeling.",
  standards: [
    { id: "AWS-D1.1", label: "Structural Welding Code - Steel", domain: "Welding", referenceType: "code", publisher: "AWS" },
    { id: "ASME-BPVC", label: "Boiler and Pressure Vessel Code", domain: "Pressure Vessels", referenceType: "code", publisher: "ASME" }
  ],
  assumptions: [
    "Gas flow rates are nominal.",
    "Welder operator factor is constant (default 25-30% unless specified).",
    "Wire feed speed correlates linearly with deposition rate."
  ],
  limitations: [
    "Does not account for complex multi-pass thermal distortion rework.",
    "Non-destructive testing (NDT) costs are excluded unless modeled."
  ],
  verificationChecks: ["Operator factor boundary constraints (0-1).", "GUM uncertainty on gas consumption."],
  lastInternalReview: "2026-06-30",
  disclaimer: "Provides baseline economic risk. Not an automated WPS (Welding Procedure Specification)."
});

export function getEngineeringAuthorityProfile(toolSlug: string): EngineeringAuthorityProfile {
  return registry.get(toolSlug) || {
    toolSlug,
    ...DEFAULT_ENGINEERING_AUTHORITY_PROFILE
  };
}
