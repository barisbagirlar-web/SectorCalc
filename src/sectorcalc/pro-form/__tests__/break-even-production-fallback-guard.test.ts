import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("paid PRO schema fallback guard", () => {
  it("requires an explicit development-only environment switch", () => {
    const routePath = path.join(
      process.cwd(),
      "src/app/api/pro-calculator/execute/route.ts",
    );
    const route = readFileSync(routePath, "utf8");

    expect(route).toContain('process.env.NODE_ENV === "development"');
    expect(route).toContain('process.env.ALLOW_PRO_SCHEMA_FALLBACK === "true"');
    expect(route).not.toContain('body.user_profile_mode === "diagnostic"');
  });
});
