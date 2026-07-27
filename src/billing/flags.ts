/**
 * Monetization feature flags.
 * Rollback = flip flags; never delete ledger history.
 */
export interface MonetizationFlags {
  /** Master switch — when false, no user-visible charging. */
  CREDIT_MONETIZATION_ENABLED: boolean;
  /** Tool-level pilots (Phase 3). */
  monetizedToolIds: readonly string[];
}

const DEFAULT_FLAGS: MonetizationFlags = {
  // Phase 1/2: architecture + checkout UI live; charging gated until ops flips this.
  CREDIT_MONETIZATION_ENABLED: false,
  monetizedToolIds: ['SC-008', 'SC-020']
};

function vite(name: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return typeof env?.[name] === 'string' ? env[name]! : '';
}

export function getMonetizationFlags(): MonetizationFlags {
  const master = vite('VITE_CREDIT_MONETIZATION_ENABLED');
  const toolsRaw = vite('VITE_CREDIT_MONETIZED_TOOLS');
  const enabled =
    master === '1' || master.toLowerCase() === 'true'
      ? true
      : master === '0' || master.toLowerCase() === 'false'
        ? false
        : DEFAULT_FLAGS.CREDIT_MONETIZATION_ENABLED;
  const monetizedToolIds = toolsRaw
    ? toolsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_FLAGS.monetizedToolIds;
  return { CREDIT_MONETIZATION_ENABLED: enabled, monetizedToolIds };
}

/** True only when master flag is on AND tool is in the pilot allow-list. */
export function isToolMonetizationActive(toolId: string, flags = getMonetizationFlags()): boolean {
  if (!flags.CREDIT_MONETIZATION_ENABLED) return false;
  return flags.monetizedToolIds.includes(toolId);
}
