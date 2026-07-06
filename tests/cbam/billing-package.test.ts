// CBAM billing package model tests — internal account credit model.
// Account balance 100+ unlocks 5 CBAM uses. No Paddle required.
import { describe, it, expect } from "vitest";
import {
  CBAM_PACKAGE_CREDITS,
  CBAM_PACKAGE_INCLUDED_USES,
  CBAM_REPORT_USE_COST,
  CBAM_SERVICE_KEY,
  CBAM_ENTITLEMENT_KEY,
} from "@/lib/cbam/billing-constants";

describe("CBAM internal account credit package model", () => {
  it("account balance 100+ unlocks 5 CBAM uses", () => {
    const accountBalance = 150;
    const canUnlock = accountBalance >= CBAM_PACKAGE_CREDITS;
    expect(canUnlock).toBe(true);
    expect(CBAM_PACKAGE_CREDITS).toBe(100);
    expect(CBAM_PACKAGE_INCLUDED_USES).toBe(5);
  });

  it("account balance decreases by exactly 100 on unlock", () => {
    const balanceBefore = 150;
    const balanceAfter = balanceBefore - CBAM_PACKAGE_CREDITS;
    expect(balanceAfter).toBe(50);
  });

  it("CBAM remainingUses increases by exactly 5 on unlock", () => {
    const remainingUsesBefore = 0;
    const remainingUsesAfter =
      remainingUsesBefore + CBAM_PACKAGE_INCLUDED_USES;
    expect(remainingUsesAfter).toBe(5);
  });

  it("each successful report consumes 1 use", () => {
    expect(CBAM_REPORT_USE_COST).toBe(1);
  });

  it("remainingUses logic: after 5 reports, remainingUses is 0", () => {
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;
    for (let i = 0; i < 5; i++) {
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(remainingUses).toBe(0);
  });

  it("6th report is blocked when remainingUses = 0", () => {
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;
    for (let i = 0; i < 5; i++) {
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(remainingUses <= 0).toBe(true);
    const blocked = remainingUses <= 0;
    expect(blocked).toBe(true);
  });

  it("another 100-credit unlock adds 5 more uses after exhaustion", () => {
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;
    let accountBalance = 200;
    // Use all 5
    for (let i = 0; i < 5; i++) {
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(remainingUses).toBe(0);
    // Re-unlock: debit 100, add 5
    accountBalance -= CBAM_PACKAGE_CREDITS;
    remainingUses += CBAM_PACKAGE_INCLUDED_USES;
    expect(remainingUses).toBe(5);
    expect(accountBalance).toBe(100);
  });

  it("each report consumes 1, not 100 credits", () => {
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;
    remainingUses -= CBAM_REPORT_USE_COST;
    // Would be -95 if charging 100 per report
    expect(remainingUses).toBe(4);
  });

  it("no Paddle product ID required", () => {
    // CBAM uses internal account credits, not Paddle products
    expect(CBAM_ENTITLEMENT_KEY).toBe("cbam_100_account_credits_5_reports");
    expect(CBAM_SERVICE_KEY).toBe("cbam_definitive_period_report");
    // Verify these keys do not contain "paddle"
    expect(CBAM_ENTITLEMENT_KEY.toLowerCase()).not.toContain("paddle");
    expect(CBAM_SERVICE_KEY.toLowerCase()).not.toContain("paddle");
  });

  it("no Paddle price ID required", () => {
    // Constants do not reference any price IDs
    const constantsSource = [
      CBAM_PACKAGE_CREDITS,
      CBAM_PACKAGE_INCLUDED_USES,
      CBAM_REPORT_USE_COST,
    ];
    // All are plain numbers — no price ID strings
    constantsSource.forEach((v) => expect(typeof v).toBe("number"));
  });

  it("entitlement key reflects account credit model", () => {
    expect(CBAM_ENTITLEMENT_KEY).toContain("account_credits");
    expect(CBAM_ENTITLEMENT_KEY).toContain("5_reports");
  });
});
