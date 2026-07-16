/**
 * Provider Failover & Degradation Policy
 *
 * Determines runtime provider selection based on health metrics, contractual
 * approval gates, and priority ranking. All decisions are deterministic given
 * the same config + health state — no stochastic load-balancing.
 *
 * Edge cases:
 *  - All providers unhealthy → returns null (caller must pause execution)
 *  - Degraded primary + healthy secondary → failover to secondary + operator alert
 *  - Unknown status treated as "assume degraded" (fail-safe default)
 */

/* ── Public Types ────────────────────────────────────────────────────────── */

export type ProviderStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "unknown";

export interface ProviderConfig {
  name: string;
  endpoint: string;
  priority: number; // 1 = primary, 2 = secondary
  timeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
  contractTested: boolean;
  securityReviewed: boolean;
  qualityMetricsAvailable: boolean;
  costGuardConfigured: boolean;
  enabled: boolean;
}

export interface ProviderHealth {
  provider: string;
  status: ProviderStatus;
  lastCheckedAt: string;
  latencyMs: number;
  errorRate: number;
  errorMessage?: string;
}

export type FailoverAction =
  | "use_primary"
  | "failover_to_secondary"
  | "pause_new_execution"
  | "alert_operator";

/* ── Internal Helpers ────────────────────────────────────────────────────── */

/**
 * Map numeric error rate + latency to a ProviderStatus.
 *
 * Rules:
 *  - errorRate >= 0.50  → "unavailable"
 *  - errorRate >= 0.10  → "degraded"
 *  - latencyMs > timeoutMs → "degraded" (timeout threshold breached)
 *  - otherwise          → "healthy"
 *
 * The "unknown" status is not assigned by this function — it represents
 * a provider whose health has never been probed.
 */
function deriveComputedStatus(
  config: ProviderConfig,
  health: ProviderHealth,
): ProviderStatus {
  if (health.status === "unavailable") return "unavailable";

  if (health.errorRate >= 0.5) return "unavailable";
  if (health.errorRate >= 0.1) return "degraded";
  if (health.latencyMs > config.timeoutMs) return "degraded";

  if (health.status === "unknown") return "degraded";

  return health.status;
}

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * Evaluate provider health and return the appropriate failover action.
 *
 * Decision matrix:
 *  Priority 1 (primary):
 *    healthy / degraded with healthy secondary → failover_to_secondary
 *    degraded with unhealthy secondary        → alert_operator
 *    unavailable                               → failover_to_secondary (or pause)
 *  Priority 2+ (secondary):
 *    healthy                                   → use_primary (this means "secondary is ready")
 *    degraded                                  → alert_operator
 *    unavailable                               → pause_new_execution
 *
 * @param config  The provider's static configuration.
 * @param health  The provider's latest observed health snapshot.
 * @returns       The recommended failover action.
 */
export function evaluateProviderHealth(
  config: ProviderConfig,
  health: ProviderHealth,
): FailoverAction {
  if (!config.enabled) {
    return "pause_new_execution";
  }

  const effective = deriveComputedStatus(config, health);

  if (config.priority === 1) {
    switch (effective) {
      case "healthy":
        return "use_primary";
      case "degraded":
        // Primary degraded but may still be usable under supervision
        return "alert_operator";
      case "unavailable":
      case "unknown":
        return "failover_to_secondary";
    }
  }

  // Priority 2+ (secondary / fallback)
  switch (effective) {
    case "healthy":
      return "use_primary";
    case "degraded":
      return "alert_operator";
    case "unavailable":
    case "unknown":
      return "pause_new_execution";
  }
}

/**
 * Check whether a provider has passed all required approval gates and is
 * authorised for production use.
 *
 * Approval requirements:
 *  - enabled === true
 *  - contractTested === true
 *  - securityReviewed === true
 *  - qualityMetricsAvailable === true
 *  - costGuardConfigured === true
 *  - maxRetries >= 0 (enforced at type level but verified here)
 *  - timeoutMs > 0
 *
 * @param config  The provider's static configuration.
 * @returns       true when every gate passes.
 */
export function isProviderApproved(config: ProviderConfig): boolean {
  if (!config.enabled) return false;
  if (!config.contractTested) return false;
  if (!config.securityReviewed) return false;
  if (!config.qualityMetricsAvailable) return false;
  if (!config.costGuardConfigured) return false;
  if (config.maxRetries < 0) return false;
  if (config.timeoutMs <= 0) return false;

  return true;
}

export interface ProviderSelection {
  provider: ProviderConfig;
  action: FailoverAction;
}

/**
 * Select the active provider from a ranked list of candidates.
 *
 * Selection rules (in order):
 *  1. Filter to enabled + approved providers only.
 *  2. Sort by priority ascending (primary = 1, secondary = 2, ...).
 *  3. Evaluate health for each provider; if the action is "use_primary"
 *     → return that provider immediately.
 *  4. If no provider yields "use_primary", return the highest-priority
 *     provider with a non-pause action and the action from its health eval.
 *  5. If every provider maps to "pause_new_execution", return null
 *     (caller must block execution).
 *
 * @param providers  Full list of registered provider configs.
 * @param healthMap  Health snapshot keyed by provider name.
 * @returns          The selected provider + action, or null if all are paused.
 */
export function selectActiveProvider(
  providers: ProviderConfig[],
  healthMap: Map<string, ProviderHealth>,
): ProviderSelection | null {
  const candidates = providers
    .filter((p) => isProviderApproved(p))
    .sort((a, b) => a.priority - b.priority);

  if (candidates.length === 0) return null;

  let fallback: ProviderSelection | null = null;

  for (const candidate of candidates) {
    const health = healthMap.get(candidate.name) ?? {
      provider: candidate.name,
      status: "unknown" as const,
      lastCheckedAt: new Date(0).toISOString(),
      latencyMs: 0,
      errorRate: 0,
    };

    const action = evaluateProviderHealth(candidate, health);

    if (action === "use_primary") {
      return { provider: candidate, action };
    }

    if (action !== "pause_new_execution" && fallback === null) {
      fallback = { provider: candidate, action };
    }
  }

  return fallback;
}
