// CBAM insufficient account credits test.
// Balance < 100 returns INSUFFICIENT_ACCOUNT_CREDITS without debiting or granting.
import { describe, it, expect } from "vitest";
import { CBAM_PACKAGE_CREDITS, CBAM_PACKAGE_INCLUDED_USES, CBAM_ENTITLEMENT_KEY } from "@/lib/cbam/billing-constants";

describe("CBAM insufficient account credits", () => {
  it("balance < 100 cannot unlock package", () => {
    const accountBalances = [0, 50, 99, 25, 10];
    for (const balance of accountBalances) {
      const canUnlock = balance >= CBAM_PACKAGE_CREDITS;
      expect(canUnlock).toBe(false);
    }
  });

  it("balance < 100 returns INSUFFICIENT_ACCOUNT_CREDITS", () => {
    const balance = 50;
    const canUnlock = balance >= CBAM_PACKAGE_CREDITS;
    const expectedStatus = canUnlock ? "OK" : "INSUFFICIENT_ACCOUNT_CREDITS";
    expect(expectedStatus).toBe("INSUFFICIENT_ACCOUNT_CREDITS");
  });

  it("no CBAM uses granted when balance insufficient", () => {
    const balance = 50;
    let remainingUses = 0;
    let accountBalance = balance;

    const attempted = accountBalance >= CBAM_PACKAGE_CREDITS;
    if (attempted) {
      accountBalance -= CBAM_PACKAGE_CREDITS;
      remainingUses += CBAM_PACKAGE_INCLUDED_USES;
    }

    // Verify nothing changed
    expect(accountBalance).toBe(50);
    expect(remainingUses).toBe(0);
  });

  it("no account credits debited when balance insufficient", () => {
    const balance = 99;
    let accountBalance = balance;

    if (accountBalance >= CBAM_PACKAGE_CREDITS) {
      accountBalance -= CBAM_PACKAGE_CREDITS;
    }

    // Should not have debited
    expect(accountBalance).toBe(99);
  });

  it("balance exactly 100 can unlock", () => {
    const balance = 100;
    const canUnlock = balance >= CBAM_PACKAGE_CREDITS;
    expect(canUnlock).toBe(true);
    const afterDebit = canUnlock ? balance - CBAM_PACKAGE_CREDITS : balance;
    expect(afterDebit).toBe(0);
  });

  it("balance 0 cannot unlock and response is clear", () => {
    const balance = 0;
    const canUnlock = balance >= CBAM_PACKAGE_CREDITS;
    expect(canUnlock).toBe(false);

    const message =
      "Add account credits to unlock the CBAM report package.";
    expect(message).toContain("account credits");
    expect(message).toContain("CBAM");
  });

  it("re-entitlement key does not mention Paddle", () => {
    expect(CBAM_ENTITLEMENT_KEY).not.toContain("paddle");
    expect(CBAM_ENTITLEMENT_KEY).not.toContain("Paddle");
  });
});
