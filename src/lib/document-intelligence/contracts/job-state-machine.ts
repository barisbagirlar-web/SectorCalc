/**
 * Job State Machine — Server-side transition guard.
 * Illegal state transitions are rejected with INTERNAL_CONTRACT_VIOLATION.
 */
import type { JobStatus, ErrorCode } from "@/types/document-intelligence";
import { VALID_TRANSITIONS } from "@/types/document-intelligence";

export class IllegalTransitionError extends Error {
  readonly code: ErrorCode = "INTERNAL_CONTRACT_VIOLATION";
  constructor(from: JobStatus, to: JobStatus) {
    super(`Illegal state transition: ${from} → ${to}`);
    this.name = "IllegalTransitionError";
  }
}

export function assertValidTransition(from: JobStatus, to: JobStatus): void {
  const allowed = VALID_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    throw new IllegalTransitionError(from, to);
  }
}

/**
 * Deterministic job lifecycle: returns all allowed next states.
 */
export function allowedNextStates(current: JobStatus): readonly JobStatus[] {
  return VALID_TRANSITIONS[current] ?? [];
}
