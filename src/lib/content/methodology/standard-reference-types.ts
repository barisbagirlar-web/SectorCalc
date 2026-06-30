/**
 * Methodology standard reference types — metadata only, not compliance claims.
 */

export type StandardSourceType =
  | "industry_guideline"
  | "textbook_method"
  | "vendor_methodology"
  | "internal_governance"
  | "user_documented";

export type ReferenceConfidenceLevel = "high" | "medium" | "low" | "informational";

export type StandardReferenceEntry = {
  readonly id: string;
  readonly standardName: string;
  readonly jurisdiction?: string;
  readonly sourceType: StandardSourceType;
  readonly referenceNote: string;
  readonly confidenceLevel: ReferenceConfidenceLevel;
  readonly lastReviewedAt: string;
  readonly disclaimer: string;
  readonly toolSlugs?: readonly string[];
  readonly categoryKeys?: readonly string[];
};

export const STANDARD_REFERENCE_DISCLAIMER =
  "This reference field helps users see methodology context. It does not certify regulatory compliance. Final suitability requires professional verification.";

export const KVKK_READINESS_NOTE =
  "Privacy infrastructure supports data minimization and consent-oriented flows; this is technical readiness language, not a claim of full KVKK certification.";
