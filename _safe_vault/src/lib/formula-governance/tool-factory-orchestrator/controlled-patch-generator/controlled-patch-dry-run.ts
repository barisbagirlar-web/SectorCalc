/**
 * Controlled patch dry-run marker — Phase 5I-E no file writes.
 */

export const CONTROLLED_PATCH_DEFAULT_MODE = "dry_run" as const;

export function assertDryRunOnly(mode: string): boolean {
  return mode === CONTROLLED_PATCH_DEFAULT_MODE;
}
