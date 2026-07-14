import { describe, it, expect } from "vitest";
import {
  isProviderApproved,
  evaluateProviderHealth,
  selectActiveProvider,
} from "@/lib/document-intelligence/security/provider-failover";
import type { ProviderConfig, ProviderHealth } from "@/lib/document-intelligence/security/provider-failover";

function makeConfig(overrides: Partial<ProviderConfig> = {}): ProviderConfig {
  return {
    name: "test-provider",
    endpoint: "https://test.example.com/extract",
    priority: 1,
    timeoutMs: 30000,
    maxRetries: 3,
    retryDelayMs: 1000,
    contractTested: true,
    securityReviewed: true,
    qualityMetricsAvailable: true,
    costGuardConfigured: true,
    enabled: true,
    ...overrides,
  };
}

function makeHealth(overrides: Partial<ProviderHealth> = {}): ProviderHealth {
  return {
    provider: "test-provider",
    status: "healthy",
    lastCheckedAt: new Date().toISOString(),
    latencyMs: 500,
    errorRate: 0.01,
    ...overrides,
  };
}

describe("isProviderApproved", () => {
  it("returns true when all requirements met", () => {
    expect(isProviderApproved(makeConfig())).toBe(true);
  });

  it("returns false when contract not tested", () => {
    expect(isProviderApproved(makeConfig({ contractTested: false }))).toBe(false);
  });

  it("returns false when security not reviewed", () => {
    expect(isProviderApproved(makeConfig({ securityReviewed: false }))).toBe(false);
  });

  it("returns false when not enabled", () => {
    expect(isProviderApproved(makeConfig({ enabled: false }))).toBe(false);
  });

  it("returns false when cost guard not configured", () => {
    expect(isProviderApproved(makeConfig({ costGuardConfigured: false }))).toBe(false);
  });
});

describe("evaluateProviderHealth", () => {
  it("returns use_primary when healthy", () => {
    expect(evaluateProviderHealth(makeConfig(), makeHealth())).toBe("use_primary");
  });

  it("returns failover_to_secondary when unavailable (primary)", () => {
    expect(evaluateProviderHealth(makeConfig({ priority: 1 }), makeHealth({ status: "unavailable" }))).toBe("failover_to_secondary");
  });

  it("returns alert_operator when unknown", () => {
    expect(evaluateProviderHealth(makeConfig({ priority: 1 }), makeHealth({ status: "unknown" }))).toBe("alert_operator");
  });
});

describe("selectActiveProvider", () => {
  it("selects highest priority enabled provider", () => {
    const primary = makeConfig({ name: "primary", priority: 1 });
    const secondary = makeConfig({ name: "secondary", priority: 2 });
    const healthMap = new Map<string, ProviderHealth>();
    healthMap.set("primary", makeHealth({ status: "healthy" }));
    healthMap.set("secondary", makeHealth({ status: "healthy" }));
    const result = selectActiveProvider([primary, secondary], healthMap);
    expect(result).not.toBeNull();
    expect(result!.provider.name).toBe("primary");
    expect(result!.action).toBe("use_primary");
  });

  it("fails over to secondary when primary unavailable", () => {
    const primary = makeConfig({ name: "primary", priority: 1 });
    const secondary = makeConfig({ name: "secondary", priority: 2 });
    const healthMap = new Map<string, ProviderHealth>();
    healthMap.set("primary", makeHealth({ status: "unavailable" }));
    healthMap.set("secondary", makeHealth({ status: "healthy" }));
    const result = selectActiveProvider([primary, secondary], healthMap);
    expect(result).not.toBeNull();
  });
});
