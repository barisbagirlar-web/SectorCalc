import {
  OFFLINE_ONLINE_REQUIRED_FEATURES,
  resolveOfflineCapability,
} from "@/lib/pwa/offline-capability-registry";

export type OfflineCalculatorPolicyResult = {
  readonly allowedOffline: boolean;
  readonly capability: ReturnType<typeof resolveOfflineCapability>;
  readonly blockedFeatures: readonly string[];
  readonly note: string;
};

export function evaluateOfflineCalculatorPolicy(input: {
  readonly slug: string;
  readonly tier: "free" | "premium";
}): OfflineCalculatorPolicyResult {
  const capability = resolveOfflineCapability(input.slug, input.tier);
  const allowedOffline = capability === "offline_safe";

  return {
    allowedOffline,
    capability,
    blockedFeatures: allowedOffline ? [] : [...OFFLINE_ONLINE_REQUIRED_FEATURES],
    note: allowedOffline
      ? "Static shell + cached assets may allow local form entry; results still require client-side calc path."
      : "This tool requires online validation, premium gate, or server-backed features.",
  };
}

export function assertPremiumNeverOffline(slug: string, tier: "free" | "premium"): void {
  if (tier === "premium") {
    const result = evaluateOfflineCalculatorPolicy({ slug, tier });
    if (result.allowedOffline) {
      throw new Error(`Premium tool "${slug}" must not be marked offline-safe.`);
    }
  }
}
