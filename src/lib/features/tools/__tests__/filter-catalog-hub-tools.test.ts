/**
 * Filter catalog hub tools test - adapted after free purge.
 */
import { describe, it, expect } from "vitest";
import { getAllTools } from "../all-tools-data";

describe("filter-catalog-hub-tools", () => {
  it("all returned tools are premium", () => {
    const tools = getAllTools();
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.every((t) => t.tier === "premium")).toBe(true);
  });
});
