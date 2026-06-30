import { describe, expect, test } from "vitest";
import { getLiveKpiDecision } from "@/lib/infrastructure/analytics/live-kpi-decision";
import type { LiveKpiEvent } from "@/lib/infrastructure/analytics/load-live-kpi-events";
import {
  buildLiveKpiSnapshot,
  createEmptyLiveKpiSnapshot,
  getKpiStatus,
  getWeeklyDecision,
  isSnapshotEmpty,
  snapshotContainsPii,
} from "@/lib/infrastructure/analytics/live-kpi-model";
import { REVENUE_EVENTS } from "@/lib/infrastructure/analytics/revenue-events";
import { SECTORCALC_EVENTS } from "@/lib/infrastructure/analytics/event-taxonomy";

function event(eventName: string, extras: Partial<LiveKpiEvent> = {}): LiveKpiEvent {
  return { eventName, ...extras };
}

function buildSnapshotFromCounts(counts: {
  freeToolOpens?: number;
  freeCalculations?: number;
  freeToPremiumClicks?: number;
  premiumUnlockClicks?: number;
  pricingCtaClicks?: number;
  checkoutStarted?: number;
  paymentCompleted?: number;
  betaPartnerSubmits?: number;
}): ReturnType<typeof buildLiveKpiSnapshot> {
  const events: LiveKpiEvent[] = [];

  for (let index = 0; index < (counts.freeToolOpens ?? 0); index += 1) {
    events.push(event(SECTORCALC_EVENTS.free_tool_open, { toolSlug: "machine-time-calculator" }));
  }
  for (let index = 0; index < (counts.freeCalculations ?? 0); index += 1) {
    events.push(event(SECTORCALC_EVENTS.free_tool_calculate, { toolSlug: "machine-time-calculator" }));
  }
  for (let index = 0; index < (counts.freeToPremiumClicks ?? 0); index += 1) {
    events.push(event(SECTORCALC_EVENTS.free_to_premium_click));
  }
  for (let index = 0; index < (counts.premiumUnlockClicks ?? 0); index += 1) {
    events.push(event(SECTORCALC_EVENTS.premium_unlock_click));
  }
  for (let index = 0; index < (counts.pricingCtaClicks ?? 0); index += 1) {
    events.push(event(SECTORCALC_EVENTS.pricing_cta_click));
  }
  for (let index = 0; index < (counts.checkoutStarted ?? 0); index += 1) {
    events.push(event(REVENUE_EVENTS.checkout_started));
  }
  for (let index = 0; index < (counts.paymentCompleted ?? 0); index += 1) {
    events.push(event(REVENUE_EVENTS.checkout_returned_success));
  }
  for (let index = 0; index < (counts.betaPartnerSubmits ?? 0); index += 1) {
    events.push(event(SECTORCALC_EVENTS.beta_partner_submit));
  }

  return buildLiveKpiSnapshot(events);
}

describe("live-kpi-model", () => {
  test("empty snapshot does not crash", () => {
    const snapshot = createEmptyLiveKpiSnapshot();
    expect(snapshot.traffic.freeToolOpens).toBe(0);
    expect(isSnapshotEmpty(snapshot)).toBe(true);
    expect(() => getWeeklyDecision(snapshot)).not.toThrow();
  });

  test("empty snapshot verdict needs_traffic", () => {
    const decision = getLiveKpiDecision(createEmptyLiveKpiSnapshot());
    expect(decision.verdict).toBe("needs_traffic");
  });

  test("free opens without calculations => needs_free_tool_ux", () => {
    const snapshot = buildSnapshotFromCounts({ freeToolOpens: 12 });
    expect(getLiveKpiDecision(snapshot).verdict).toBe("needs_free_tool_ux");
  });

  test("calculations without premium clicks => needs_premium_value", () => {
    const snapshot = buildSnapshotFromCounts({
      freeToolOpens: 12,
      freeCalculations: 8,
    });
    expect(getLiveKpiDecision(snapshot).verdict).toBe("needs_premium_value");
  });

  test("unlock without pricing cta => needs_pricing_fix", () => {
    const snapshot = buildSnapshotFromCounts({
      freeToolOpens: 12,
      freeCalculations: 8,
      freeToPremiumClicks: 3,
      premiumUnlockClicks: 4,
    });
    expect(getLiveKpiDecision(snapshot).verdict).toBe("needs_pricing_fix");
  });

  test("checkout started without payment => needs_checkout_fix", () => {
    const snapshot = buildSnapshotFromCounts({
      freeToolOpens: 12,
      freeCalculations: 8,
      freeToPremiumClicks: 3,
      premiumUnlockClicks: 4,
      pricingCtaClicks: 2,
      checkoutStarted: 2,
    });
    expect(getLiveKpiDecision(snapshot).verdict).toBe("needs_checkout_fix");
  });

  test("payment completed => ready_to_scale", () => {
    const snapshot = buildSnapshotFromCounts({ paymentCompleted: 1 });
    expect(getLiveKpiDecision(snapshot).verdict).toBe("ready_to_scale");
  });

  test("snapshot does not contain PII fields", () => {
    const snapshot = buildSnapshotFromCounts({
      freeToolOpens: 3,
      freeCalculations: 2,
      paymentCompleted: 1,
    });
    expect(snapshotContainsPii(snapshot)).toBe(false);
  });

  test("topItems can be empty", () => {
    const snapshot = createEmptyLiveKpiSnapshot();
    expect(snapshot.topItems.freeTools).toEqual([]);
    expect(snapshot.topItems.premiumAnalyzers).toEqual([]);
    expect(snapshot.topItems.campaigns).toEqual([]);
  });

  test("getKpiStatus handles empty values", () => {
    expect(getKpiStatus({ value: 0 })).toBe("empty");
    expect(getKpiStatus({ value: 0, previousValue: 5 })).toBe("critical");
    expect(getKpiStatus({ value: 8, previousValue: 10 })).toBe("watch");
    expect(getKpiStatus({ value: 12, previousValue: 10 })).toBe("healthy");
  });
});
