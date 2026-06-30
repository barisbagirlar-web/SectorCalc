import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getAllTools } from "@/lib/tools/all-tools-data";
import { SECTORS } from "@/lib/tools/taxonomy";

describe("taxonomy sector tool counts", () => {
  it("loads catalog tools and defines a sufficient taxonomy", () => {
    const tools = getAllTools("en");

    expect(tools.length).toBeGreaterThan(0);
    expect(SECTORS.length).toBeGreaterThanOrEqual(30);
  });
});
