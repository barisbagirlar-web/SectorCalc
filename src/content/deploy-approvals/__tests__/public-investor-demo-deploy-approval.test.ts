/**
 * Phase 6D deploy approval gate tests.
 */

import { describe, expect, test } from "vitest";
import { PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL } from "@/content/deploy-approvals/public-investor-demo-deploy-approval";

describe("public investor demo deploy approval — Phase 6D", () => {
  test("deploy approved but command disabled", () => {
    expect(PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL.deployApproved).toBe(true);
    expect(PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL.deployCommandAllowed).toBe(false);
    expect(PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL.phase).toBe("6D");
  });

  test("covers all public demo pages", () => {
    expect(PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL.pages).toEqual([
      "investor-demo",
      "pricing",
      "operating-system",
    ]);
  });

  test("qa gates passed", () => {
    const { qaStatus } = PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL;
    expect(qaStatus.buildPassed).toBe(true);
    expect(qaStatus.mobilePassed).toBe(true);
    expect(qaStatus.desktopPassed).toBe(true);
    expect(qaStatus.consoleFatalExpected).toBe(false);
  });
});
