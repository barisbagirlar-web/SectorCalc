/**
 * Release Candidate Freeze — Change Control & Version Lock
 *
 * Section 86: A freeze records every versioned artifact that participates in a
 * release, then locks it so no unintended change can silently alter production
 * behaviour. Any diff between freeze SHA and deployed SHA causes
 * assertShaMatch to fail, preventing deployment of an un-frozen build.
 *
 * Lifecycle:
 *   frozen → testing → released → rolled_back
 *
 * A freeze is created BEFORE deployment and validated AT deployment time.
 * No artifact version may change between freeze creation and production
 * release without a new freeze record.
 */

/* ── Public Contract ────────────────────────────────────────────── */

export type FreezeStatus =
  | "frozen"
  | "testing"
  | "released"
  | "rolled_back";

/**
 * Every versioned artifact that must be locked for a release.
 *
 * The `version` field is the human-readable release tag (e.g. "v2.3.0"),
 * while `gitSha` is the exact commit from which the build was produced.
 * All other fields pin individual sub-component versions so that
 * rollback or forensics can reconstruct the exact artifact set.
 */
export interface ReleaseCandidateFreeze {
  version: string;
  gitSha: string;
  buildTimestamp: string;
  frozenAt: string;
  frozenBy: string;
  productVersion: string;
  engineVersion: string;
  validatorVersion: string;
  schemaVersion: string;
  importProfileVersion: string;
  disclaimerVersion: string;
  legalTextVersion: string;
  sampleOutputVersion: string;
  status: FreezeStatus;
}

/* ── Omit helper type ───────────────────────────────────────────── */

type CreateFreezeInput = Omit<
  ReleaseCandidateFreeze,
  "frozenAt" | "status"
>;

/* ── Freeze Factory ─────────────────────────────────────────────── */

/**
 * Create a new ReleaseCandidateFreeze record.
 *
 * The factory stamps `frozenAt` with the current wall-clock time and sets
 * status to "frozen". All other fields must be supplied by the caller.
 *
 * @param input - All fields except frozenAt and status.
 * @returns A fully populated ReleaseCandidateFreeze with status="frozen".
 *
 * Throws if any string field is empty or if version/gitSha are missing.
 */
export function createFreeze(input: CreateFreezeInput): ReleaseCandidateFreeze {
  const errors: string[] = [];

  /* ── Validate required fields ──────────────────────────────── */

  if (!input.version || typeof input.version !== "string") {
    errors.push("version is required");
  }
  if (!input.gitSha || typeof input.gitSha !== "string") {
    errors.push("gitSha is required");
  }
  if (!input.frozenBy || typeof input.frozenBy !== "string") {
    errors.push("frozenBy is required");
  }

  /* ── Validate all string fields are non-empty ──────────────── */

  const mandatoryStringFields: Array<keyof CreateFreezeInput> = [
    "buildTimestamp",
    "productVersion",
    "engineVersion",
    "validatorVersion",
    "schemaVersion",
    "importProfileVersion",
    "disclaimerVersion",
    "legalTextVersion",
    "sampleOutputVersion",
  ];

  for (const field of mandatoryStringFields) {
    const value = input[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `createFreeze: validation failed — ${errors.join("; ")}`,
    );
  }

  return {
    version: input.version,
    gitSha: input.gitSha,
    buildTimestamp: input.buildTimestamp,
    frozenAt: new Date().toISOString(),
    frozenBy: input.frozenBy,
    productVersion: input.productVersion,
    engineVersion: input.engineVersion,
    validatorVersion: input.validatorVersion,
    schemaVersion: input.schemaVersion,
    importProfileVersion: input.importProfileVersion,
    disclaimerVersion: input.disclaimerVersion,
    legalTextVersion: input.legalTextVersion,
    sampleOutputVersion: input.sampleOutputVersion,
    status: "frozen",
  };
}

/* ── Freeze Validator ───────────────────────────────────────────── */

/**
 * Validate that a freeze record is structurally complete and internally
 * consistent.
 *
 * Checks:
 *  - Every string field is present and non-empty.
 *  - status is one of the four allowed values.
 *  - frozenAt / buildTimestamp are parseable ISO-8601 dates.
 *  - version is non-empty.
 *  - gitSha looks like a 40-character hex commit SHA (basic format check).
 *
 * @param freeze - The freeze record to validate.
 * @returns An object with valid:true and empty errors array, or
 *          valid:false with a list of human-readable error strings.
 */
export function validateFreeze(
  freeze: ReleaseCandidateFreeze,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!freeze) {
    return { valid: false, errors: ["freeze record is null or undefined"] };
  }

  /* ── String field presence ─────────────────────────────────── */

  const allStringFields: Array<keyof ReleaseCandidateFreeze> = [
    "version",
    "gitSha",
    "buildTimestamp",
    "frozenAt",
    "frozenBy",
    "productVersion",
    "engineVersion",
    "validatorVersion",
    "schemaVersion",
    "importProfileVersion",
    "disclaimerVersion",
    "legalTextVersion",
    "sampleOutputVersion",
  ];

  for (const field of allStringFields) {
    const value = freeze[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`${field} is missing or empty`);
    }
  }

  /* ── Status ────────────────────────────────────────────────── */

  const validStatuses: FreezeStatus[] = [
    "frozen",
    "testing",
    "released",
    "rolled_back",
  ];

  if (!validStatuses.includes(freeze.status as FreezeStatus)) {
    errors.push(
      `status must be one of ${validStatuses.join(", ")}; got "${freeze.status}"`,
    );
  }

  /* ── ISO-8601 timestamps ───────────────────────────────────── */

  if (typeof freeze.frozenAt === "string" && freeze.frozenAt.length > 0) {
    const parsed = Date.parse(freeze.frozenAt);
    if (isNaN(parsed)) {
      errors.push(`frozenAt ("${freeze.frozenAt}") is not a valid ISO-8601 date`);
    }
  }

  if (
    typeof freeze.buildTimestamp === "string" &&
    freeze.buildTimestamp.length > 0
  ) {
    const parsed = Date.parse(freeze.buildTimestamp);
    if (isNaN(parsed)) {
      errors.push(
        `buildTimestamp ("${freeze.buildTimestamp}") is not a valid ISO-8601 date`,
      );
    }
  }

  /* ── gitSha format hint ────────────────────────────────────── */

  if (
    typeof freeze.gitSha === "string" &&
    freeze.gitSha.length > 0 &&
    !/^[0-9a-f]{40}$/i.test(freeze.gitSha)
  ) {
    errors.push(
      `gitSha ("${freeze.gitSha}") does not look like a 40-character hex commit SHA`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* ── Freeze State Queries ───────────────────────────────────────── */

/**
 * Check whether a freeze record is in a frozen state.
 *
 * A null freeze or a freeze with any status other than "frozen" or "testing"
 * returns false. Only "frozen" and "testing" are considered active freeze
 * states — "released" and "rolled_back" are terminal.
 *
 * @param freeze - The freeze record (may be null).
 * @returns true if the freeze is active (status frozen or testing).
 */
export function isFrozen(freeze: ReleaseCandidateFreeze | null): boolean {
  if (!freeze) {
    return false;
  }
  return freeze.status === "frozen" || freeze.status === "testing";
}

/* ── SHA Assertion ──────────────────────────────────────────────── */

/**
 * Assert that the freeze's git SHA matches the deployed git SHA.
 *
 * This is the deployment gate: if the SHA stored in the freeze does not
 * match the SHA of the code currently being deployed, the deployment MUST
 * be rejected. A mismatch means the freeze is stale and a new freeze must
 * be created from the current HEAD.
 *
 * @param freezeSha   - The git SHA recorded in the freeze record.
 * @param deployedSha - The git SHA of the currently deployed build.
 * @returns true if both SHAs are non-empty and equal.
 */
export function assertShaMatch(
  freezeSha: string,
  deployedSha: string,
): boolean {
  if (typeof freezeSha !== "string" || freezeSha.trim().length === 0) {
    return false;
  }
  if (typeof deployedSha !== "string" || deployedSha.trim().length === 0) {
    return false;
  }
  return freezeSha.trim() === deployedSha.trim();
}
