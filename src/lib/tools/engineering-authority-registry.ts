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

export function getEngineeringAuthorityProfile(toolSlug: string): EngineeringAuthorityProfile {
  return registry.get(toolSlug) || {
    toolSlug,
    ...DEFAULT_ENGINEERING_AUTHORITY_PROFILE
  };
}
