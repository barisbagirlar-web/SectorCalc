import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getPremiumTools } from "@/lib/tools/all-tools-data";
import { buildTaxonomySectorCards } from "@/lib/tools/build-taxonomy-sector-cards";

describe("premium-tools sector taxonomy", () => {
  it("maps premium tools across taxonomy sectors with a bounded Diğer bucket", () => {
    const tools = getPremiumTools("tr");
    const cards = buildTaxonomySectorCards(tools, "tr").filter((card) => card.count > 0);
    const otherCount = cards.find((card) => card.sector.id === "diger")?.count ?? 0;

    // Regression guard: taxonomy sector coverage for premium catalog hub.
    expect(cards.length).toBeGreaterThanOrEqual(25);
    expect(otherCount).toBeLessThanOrEqual(50);
    expect(tools.length).toBeGreaterThan(100);
  });
});
