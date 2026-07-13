import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("break-even audit version source", () => {
  it("uses schema metadata formula version in the execute route audit seal", () => {
    const routePath = path.join(
      process.cwd(),
      "src/app/api/pro-calculator/execute/route.ts",
    );
    const route = readFileSync(routePath, "utf8");

    expect(route).toContain(
      "formulaVersion: validatedSchema.metadata.formula_version",
    );
  });
});
