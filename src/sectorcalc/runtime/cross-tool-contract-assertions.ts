// SectorCalc PRO V2 — Cross-Tool Contract Assertions
// Identity checks at every stage of the pipeline to prevent cross-tool contamination.

export const PRO_V2_CROSS_TOOL_CONTRACT_MISMATCH = "PRO_V2_CROSS_TOOL_CONTRACT_MISMATCH";
export const PRO_V2_REPORT_CONTRACT_MISSING = "PRO_V2_REPORT_CONTRACT_MISSING";

export interface CrossToolAssertionInput {
  /** The slug from the route URL */
  requestedSlug: string;
  /** The slug from the tool definition / schema */
  definitionSlug: string;
  /** The tool key from the server's execute response */
  executeResponseToolKey?: string | null;
  /** The server contract tool key from the definition */
  serverContractToolKey?: string | null;
  /** The report's tool slug (if report already built) */
  reportToolSlug?: string | null;
}

export interface CrossToolAssertionResult {
  ok: boolean;
  error?: string;
  details: string[];
}

/**
 * Assert that requested slug === definition slug === server tool key === report slug.
 * Throws PRO_V2_CROSS_TOOL_CONTRACT_MISMATCH if any mismatch is detected.
 */
export function assertCrossToolIdentity(input: CrossToolAssertionInput): CrossToolAssertionResult {
  const details: string[] = [];
  const errors: string[] = [];

  // 1. Requested slug must match definition slug
  const defMatch = input.requestedSlug === input.definitionSlug;
  if (!defMatch) {
    errors.push(
      `SLUG_MISMATCH: requestedSlug="${input.requestedSlug}" !== definitionSlug="${input.definitionSlug}"`,
    );
  } else {
    details.push(`requestedSlug="${input.requestedSlug}" === definitionSlug="${input.definitionSlug}"`);
  }

  // 2. Server contract tool key must match definition slug (if both provided)
  if (input.serverContractToolKey && input.definitionSlug) {
    const contractMatch = input.serverContractToolKey === input.definitionSlug;
    if (!contractMatch) {
      errors.push(
        `CONTRACT_MISMATCH: definition.serverContract.toolKey="${input.serverContractToolKey}" !== definitionSlug="${input.definitionSlug}"`,
      );
    } else {
      details.push(`serverContractToolKey="${input.serverContractToolKey}" === definitionSlug="${input.definitionSlug}"`);
    }
  }

  // 3. Execute response tool key must match definition slug (if provided)
  if (input.executeResponseToolKey && input.definitionSlug) {
    const execMatch = input.executeResponseToolKey === input.definitionSlug;
    if (!execMatch) {
      errors.push(
        `EXECUTE_MISMATCH: executeResponseToolKey="${input.executeResponseToolKey}" !== definitionSlug="${input.definitionSlug}"`,
      );
    } else {
      details.push(`executeResponseToolKey="${input.executeResponseToolKey}" === definitionSlug="${input.definitionSlug}"`);
    }
  }

  // 4. Report tool slug must match requested slug (if report exists)
  if (input.reportToolSlug && input.requestedSlug) {
    const reportMatch = input.reportToolSlug === input.requestedSlug;
    if (!reportMatch) {
      errors.push(
        `REPORT_MISMATCH: reportToolSlug="${input.reportToolSlug}" !== requestedSlug="${input.requestedSlug}"`,
      );
    } else {
      details.push(`reportToolSlug="${input.reportToolSlug}" === requestedSlug="${input.requestedSlug}"`);
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      error: `${PRO_V2_CROSS_TOOL_CONTRACT_MISMATCH}: ${errors.join("; ")}`,
      details: [...details, ...errors],
    };
  }

  return { ok: true, details };
}
