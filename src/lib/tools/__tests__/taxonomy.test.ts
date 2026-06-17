import { describe, expect, it } from "vitest";
import { assertUniqueSectorIcons, SECTORS } from "@/lib/tools/taxonomy";

describe("taxonomy sectors", () => {
  it("defines at least 30 sectors with unique icons", () => {
    expect(SECTORS.length).toBeGreaterThanOrEqual(30);
    expect(() => assertUniqueSectorIcons()).not.toThrow();
  });

  it("fills icon, keywords, and professions for every sector", () => {
    for (const sector of SECTORS) {
      expect(sector.icon.length).toBeGreaterThan(0);
      expect(sector.keywords.length).toBeGreaterThan(5);
      expect(sector.professions.length).toBeGreaterThan(2);
    }
  });
});
