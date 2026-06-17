import { describe, expect, it } from "vitest";
import { buildTaxonomySectorCards } from "@/lib/tools/build-taxonomy-sector-cards";

describe("buildTaxonomySectorCards", () => {
  it("counts tools per taxonomy sector id", () => {
    const cards = buildTaxonomySectorCards(
      [
        { sectorKey: "otomotiv" },
        { sectorKey: "otomotiv" },
        { sectorKey: "makine" },
        { sectorKey: "diger" },
      ],
      "tr",
    );

    const otomotiv = cards.find((card) => card.sector.id === "otomotiv");
    const makine = cards.find((card) => card.sector.id === "makine");
    const diger = cards.find((card) => card.sector.id === "diger");

    expect(otomotiv?.count).toBe(2);
    expect(makine?.count).toBe(1);
    expect(diger?.count).toBe(1);
    expect(otomotiv?.label).toBe("Otomotiv & Taşıt");
  });

  it("uses English labels for en locale", () => {
    const cards = buildTaxonomySectorCards([{ sectorKey: "makine" }], "en");
    const makine = cards.find((card) => card.sector.id === "makine");

    expect(makine?.label).toBe("Machinery & Manufacturing");
  });

  it("prepends an All tile when allLabel is provided", () => {
    const cards = buildTaxonomySectorCards(
      [{ sectorKey: "makine" }, { sectorKey: "otomotiv" }],
      "tr",
      { allLabel: "Tümü" },
    );

    expect(cards[0]?.sector.id).toBe("all");
    expect(cards[0]?.label).toBe("Tümü");
    expect(cards[0]?.count).toBe(2);
    expect(cards[0]?.sector.icon).toBe("🗂️");
  });
});
