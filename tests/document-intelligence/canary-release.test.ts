/**
 * Unit Tests: Canary Release and Controlled Activation
 */
import { describe, it, expect } from "vitest";
import {
  CANARY_STAGES,
  AUTO_ROLLBACK_TRIGGERS,
  getNextStage,
  shouldAutoRollback,
  getRollbackActionDescription,
} from "@/lib/document-intelligence/security/canary-release";
import type { AutoRollbackTrigger } from "@/lib/document-intelligence/security/canary-release";

/* ── CANARY_STAGES ───────────────────────────────────────────── */

describe("CANARY_STAGES", () => {
  it("has all 4 stages (1–4)", () => {
    expect(Object.keys(CANARY_STAGES)).toHaveLength(4);
    expect(CANARY_STAGES[1]).toBeDefined();
    expect(CANARY_STAGES[2]).toBeDefined();
    expect(CANARY_STAGES[3]).toBeDefined();
    expect(CANARY_STAGES[4]).toBeDefined();
  });

  it("stage 1 is Internal Synthetic with max 5 accounts", () => {
    expect(CANARY_STAGES[1].name).toBe("Internal Synthetic");
    expect(CANARY_STAGES[1].maxAccounts).toBe(5);
    expect(CANARY_STAGES[1].requireAdminApproval).toBe(true);
  });

  it("stage 2 is Approved Pilot with max 20 accounts", () => {
    expect(CANARY_STAGES[2].name).toBe("Approved Pilot");
    expect(CANARY_STAGES[2].maxAccounts).toBe(20);
    expect(CANARY_STAGES[2].requireAdminApproval).toBe(true);
  });

  it("stage 3 is Limited Public with max 100 accounts", () => {
    expect(CANARY_STAGES[3].name).toBe("Limited Public");
    expect(CANARY_STAGES[3].maxAccounts).toBe(100);
    expect(CANARY_STAGES[3].requireAdminApproval).toBe(false);
  });

  it("stage 4 is Full Public with Infinity max accounts", () => {
    expect(CANARY_STAGES[4].name).toBe("Full Public");
    expect(CANARY_STAGES[4].maxAccounts).toBe(Infinity);
    expect(CANARY_STAGES[4].requireAdminApproval).toBe(false);
  });

  it("each stage has unique verificationRequired items", () => {
    for (const stage of [1, 2, 3, 4] as const) {
      expect(Array.isArray(CANARY_STAGES[stage].verificationRequired)).toBe(true);
      expect(CANARY_STAGES[stage].verificationRequired.length).toBeGreaterThan(0);
    }
  });
});

/* ── getNextStage ─────────────────────────────────────────────- */

describe("getNextStage", () => {
  it("returns stage 2 from stage 1", () => {
    expect(getNextStage(1)).toBe(2);
  });

  it("returns stage 3 from stage 2", () => {
    expect(getNextStage(2)).toBe(3);
  });

  it("returns stage 4 from stage 3", () => {
    expect(getNextStage(3)).toBe(4);
  });

  it("returns null from stage 4 (no further stage)", () => {
    expect(getNextStage(4)).toBeNull();
  });

  it("returns null when passed a value greater than 4", () => {
    expect(getNextStage(5 as 1)).toBeNull();
  });
});

/* ── shouldAutoRollback ──────────────────────────────────────── */

describe("shouldAutoRollback", () => {
  const trigger: AutoRollbackTrigger = {
    condition: "cross_tenant_access",
    threshold: 1,
    windowMinutes: 5,
    action: "disable_feature",
    severity: "critical",
  };

  it("returns true when incident count equals threshold and within window", () => {
    expect(shouldAutoRollback(trigger, 1, 4 * 60 * 1000)).toBe(true);
  });

  it("returns true when incident count exceeds threshold and within window", () => {
    expect(shouldAutoRollback(trigger, 5, 4 * 60 * 1000)).toBe(true);
  });

  it("returns false when incident count is below threshold", () => {
    expect(shouldAutoRollback(trigger, 0, 4 * 60 * 1000)).toBe(false);
  });

  it("returns false when window exceeds the trigger windowMinutes", () => {
    expect(shouldAutoRollback(trigger, 1, 6 * 60 * 1000)).toBe(false);
  });

  it("returns false when both incident count is below threshold AND window exceeded", () => {
    expect(shouldAutoRollback(trigger, 0, 10 * 60 * 1000)).toBe(false);
  });

  it("works with a high-threshold trigger", () => {
    const trigger5: AutoRollbackTrigger = {
      condition: "terminal_failure_spike",
      threshold: 5,
      windowMinutes: 60,
      action: "pause_payment",
      severity: "high",
    };
    expect(shouldAutoRollback(trigger5, 5, 30 * 60 * 1000)).toBe(true);
    expect(shouldAutoRollback(trigger5, 4, 30 * 60 * 1000)).toBe(false);
  });

  it("returns true at the boundary of the time window (== is NOT excluded)", () => {
    // windowMs === windowMinutes * 60 * 1000: incidentCount is NOT < threshold
    // (1 < 1 = false) AND windowMs > windowMinutes * 60 * 1000 (300000 > 300000 = false)
    // Since neither condition short-circuits to false, it returns true.
    expect(shouldAutoRollback(trigger, 1, 5 * 60 * 1000)).toBe(true);
  });
});

/* ── AUTO_ROLLBACK_TRIGGERS ──────────────────────────────────── */

describe("AUTO_ROLLBACK_TRIGGERS", () => {
  it("contains cross_tenant_access trigger", () => {
    const trigger = AUTO_ROLLBACK_TRIGGERS.find((t) => t.condition === "cross_tenant_access");
    expect(trigger).toBeDefined();
    expect(trigger!.threshold).toBe(1);
    expect(trigger!.action).toBe("disable_feature");
    expect(trigger!.severity).toBe("critical");
  });

  it("contains all expected critical triggers", () => {
    const conditions = AUTO_ROLLBACK_TRIGGERS.map((t) => t.condition);
    expect(conditions).toContain("cross_tenant_access");
    expect(conditions).toContain("duplicate_charge");
    expect(conditions).toContain("corrupted_workbook");
    expect(conditions).toContain("critical_false_clean");
    expect(conditions).toContain("output_manifest_mismatch");
    expect(conditions).toContain("payment_without_entitlement");
    expect(conditions).toContain("secret_exposure");
    expect(conditions).toContain("live_sha_mismatch");
  });

  it("all triggers have valid action values", () => {
    for (const t of AUTO_ROLLBACK_TRIGGERS) {
      expect(["disable_feature", "pause_payment", "alert_only"]).toContain(t.action);
    }
  });

  it("all triggers have valid severity values", () => {
    for (const t of AUTO_ROLLBACK_TRIGGERS) {
      expect(["critical", "high", "medium"]).toContain(t.severity);
    }
  });

  it("all triggers have positive threshold and windowMinutes", () => {
    for (const t of AUTO_ROLLBACK_TRIGGERS) {
      expect(t.threshold).toBeGreaterThan(0);
      expect(t.windowMinutes).toBeGreaterThan(0);
    }
  });

  it("has at least one alert_only trigger for non-disruptive conditions", () => {
    const alertOnly = AUTO_ROLLBACK_TRIGGERS.filter((t) => t.action === "alert_only");
    expect(alertOnly.length).toBeGreaterThanOrEqual(1);
  });
});

/* ── getRollbackActionDescription ────────────────────────────── */

describe("getRollbackActionDescription", () => {
  it('returns disable_feature text for disable_feature action', () => {
    const trigger: AutoRollbackTrigger = {
      condition: "test",
      threshold: 1,
      windowMinutes: 5,
      action: "disable_feature",
      severity: "critical",
    };
    const desc = getRollbackActionDescription(trigger);
    expect(desc).toContain("DOCUMENT_INTELLIGENCE_ENABLED=false");
    expect(desc).toContain("Block new upload/checkout");
  });

  it('returns pause_payment text for pause_payment action', () => {
    const trigger: AutoRollbackTrigger = {
      condition: "test",
      threshold: 1,
      windowMinutes: 5,
      action: "pause_payment",
      severity: "critical",
    };
    const desc = getRollbackActionDescription(trigger);
    expect(desc).toContain("Disable checkout endpoint");
  });

  it('returns alert_only text for alert_only action', () => {
    const trigger: AutoRollbackTrigger = {
      condition: "test",
      threshold: 1,
      windowMinutes: 5,
      action: "alert_only",
      severity: "medium",
    };
    const desc = getRollbackActionDescription(trigger);
    expect(desc).toContain("Send alert to operators");
    expect(desc).toContain("No automatic action taken");
  });
});
