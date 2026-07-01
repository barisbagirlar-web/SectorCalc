import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getPremiumTools } from "@/lib/features/tools/all-tools-data";
import { buildTaxonomySectorCards } from "@/lib/features/tools/build-taxonomy-sector-cards";

describe("premium-tools sector taxonomy", () => {
  it("loads premium catalog tools with a bounded Diger bucket", () => {
    const tools = getPremiumTools("tr");
    const cards = buildTaxonomySectorCards(tools, "tr").filter((card) => card.count > 0);
    const otherCount = cards.find((card) => card.sector.id === "diger")?.count ?? 0;

    // The "all" card is always present when tools exist.
    expect(cards.length).toBeGreaterThanOrEqual(1);
    expect(otherCount).toBeLessThanOrEqual(50);
    expect(tools.length).toBeGreaterThan(100);
  });
});
