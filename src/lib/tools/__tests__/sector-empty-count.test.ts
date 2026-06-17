import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getAllTools } from "@/lib/tools/all-tools-data";
import { SECTORS } from "@/lib/tools/taxonomy";
import { buildTaxonomySectorCards } from "@/lib/tools/build-taxonomy-sector-cards";

describe("taxonomy sector tool counts", () => {
  it("keeps every SECTORS entry mapped to at least one catalog tool", () => {
    const tools = getAllTools("en");
    const empty = buildTaxonomySectorCards(tools, "en").filter(
      (card) => card.sector.id !== "all" && card.count === 0,
    );

    expect(empty).toEqual([]);
    expect(SECTORS.length).toBeGreaterThanOrEqual(30);
  });
});
