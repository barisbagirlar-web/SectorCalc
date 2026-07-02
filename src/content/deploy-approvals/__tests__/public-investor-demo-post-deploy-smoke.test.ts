/**
 * Phase 6E post-deploy smoke gate tests.
 */

import { describe, expect, test } from "vitest";
import { PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE } from "@/content/deploy-approvals/public-investor-demo-post-deploy-smoke";

describe("public investor demo post-deploy smoke - Phase 6E", () => {
  test("records production deploy", () => {
    expect(PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE.phase).toBe("6E");
    expect(PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE.deployTarget).toBe("production");
    expect(PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE.deployStatus).toBe("deployed_live");
  });

  test("covers all public demo pages", () => {
    expect(PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE.pages).toEqual([
      "investor-demo",
      "pricing",
      "operating-system",
    ]);
  });

  test("smart form pilots remain live", () => {
    expect(PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE.smartFormPilotsStillLive).toBe(true);
    expect(PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE.liveChecks.smartFormPilots).toHaveLength(3);
  });
});
