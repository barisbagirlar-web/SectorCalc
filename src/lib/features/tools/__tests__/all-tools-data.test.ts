/**
 * All tools data test - Free tools permanently purged.
 */
import { describe, it, expect } from "vitest";
import { getAllTools } from "../all-tools-data";

describe("all-tools-data", () => {
  it("returns only premium tools after free purge", () => {
    const tools = getAllTools();
    expect(tools.every((t) => t.tier === "premium")).toBe(true);
  });
});
