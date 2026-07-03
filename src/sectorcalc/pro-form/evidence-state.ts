// SectorCalc SuperV4 V5.3 Evidence State Manager
// Manages evidence toggles, source verification flags, and evidence-based blockers.

import type { SourceStatus } from "./contract-types";

export interface EvidenceState {
  toggles: Record<string, boolean>;
  sourceVerified: Record<string, boolean>;
  userVerified: Record<string, boolean>;
  uploadedReferences: Record<string, string[]>;
}

export interface EvidenceValidationResult {
  blockers: string[];
  warnings: string[];
}

export function createEmptyEvidenceState(): EvidenceState {
  return {
    toggles: {},
    sourceVerified: {},
    userVerified: {},
    uploadedReferences: {},
  };
}

export function toggleEvidence(
  state: EvidenceState,
  inputId: string,
  enabled: boolean,
): EvidenceState {
  return {
    ...state,
    toggles: { ...state.toggles, [inputId]: enabled },
    userVerified: enabled
      ? state.userVerified
      : { ...state.userVerified, [inputId]: false },
  };
}

export function verifySource(
  state: EvidenceState,
  inputId: string,
  verified: boolean,
): EvidenceState {
  return {
    ...state,
    sourceVerified: { ...state.sourceVerified, [inputId]: verified },
    userVerified: verified
      ? { ...state.userVerified, [inputId]: true }
      : state.userVerified,
  };
}

export function validateEvidenceRequirements(
  inputs: Array<{
    id: string;
    evidence_requirement: string;
    source_status: SourceStatus;
    criticality: string;
  }>,
  state: EvidenceState,
): EvidenceValidationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  for (const inp of inputs) {
    const isCritical = inp.criticality === "CRITICAL";
    const hasEvidenceToggle = state.toggles[inp.id] === true;
    const hasSourceVerification = state.sourceVerified[inp.id] === true;
    const hasUserVerification = state.userVerified[inp.id] === true;

    if (!inp.evidence_requirement || inp.evidence_requirement === "Optional") {
      continue;
    }

    if (inp.evidence_requirement === "Required for calculation" && !hasUserVerification) {
      if (isCritical) {
        blockers.push(
          `CRITICAL input "${inp.id}" requires evidence verification before execution.`,
        );
      } else {
        warnings.push(
          `Input "${inp.id}" requires evidence verification for full confidence.`,
        );
      }
    }

    if (inp.evidence_requirement === "Required for clause evidence" && !hasEvidenceToggle) {
      warnings.push(
        `Input "${inp.id}" evidence must be toggled on for clause evidence compliance.`,
      );
    }

    if (
      inp.source_status === "NEEDS_SOURCE_VERIFICATION" &&
      !hasSourceVerification
    ) {
      blockers.push(
        `Input "${inp.id}" source requires verification before execution.`,
      );
    }
  }

  return { blockers, warnings };
}

export function serializeEvidenceState(state: EvidenceState): Record<string, unknown> {
  return {
    toggles: state.toggles,
    source_verified: state.sourceVerified,
    user_verified: state.userVerified,
    uploaded_references: state.uploadedReferences,
  };
}
