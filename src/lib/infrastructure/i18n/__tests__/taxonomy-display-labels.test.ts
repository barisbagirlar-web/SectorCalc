import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import {
  resolveTaxonomyCategoryDisplayLabel,
  resolveTaxonomyProfessionDisplayLabel,
  resolveTaxonomySectorDisplayLabel,
  TAXONOMY_CATEGORY_DISPLAY_LABELS,
  TAXONOMY_SECTOR_DISPLAY_LABELS,
} from "@/lib/infrastructure/i18n/taxonomy-display-labels";
import { buildTaxonomySectorCards, resolveTaxonomySectorLabel } from "@/lib/features/tools/build-taxonomy-sector-cards";
import { CATEGORIES, SECTORS } from "@/lib/features/tools/taxonomy";

describe("taxonomy-display-labels", () => {
  it("covers every taxonomy sector id in 6 locales", () => {
    for (const sector of SECTORS) {
      expect(TAXONOMY_SECTOR_DISPLAY_LABELS[sector.id]).toBeDefined();
      for (const locale of SUPPORTED_LOCALES) {
        const label = resolveTaxonomySectorDisplayLabel(sector.id, locale);
        expect(label?.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("covers every taxonomy category id in 6 locales", () => {
    for (const category of CATEGORIES) {
      expect(TAXONOMY_CATEGORY_DISPLAY_LABELS[category.id]).toBeDefined();
      for (const locale of SUPPORTED_LOCALES) {
        const label = resolveTaxonomyCategoryDisplayLabel(category.id, locale);
        expect(label?.trim().length).toBeGreaterThan(0);
      }
    }
    expect(TAXONOMY_CATEGORY_DISPLAY_LABELS.diger).toBeDefined();
  });

  it("does not return Turkish labels for German locale", () => {
    const makineDe = resolveTaxonomySectorDisplayLabel("makine", "de");
    const makineTr = resolveTaxonomySectorDisplayLabel("makine", "tr");
    expect(makineDe).not.toBe(makineTr);
    expect(makineDe).toContain("Maschinenbau");
  });

  it("localizes known professions", () => {
    expect(resolveTaxonomyProfessionDisplayLabel("Uretim Muhendisi", "de")).toBe(
      "Produktionsingenieur",
    );
    expect(resolveTaxonomyProfessionDisplayLabel("Uretim Muhendisi", "ar")).toContain("مهندس");
  });
});

describe("buildTaxonomySectorCards locale labels", () => {
  it("uses German sector labels for de locale", () => {
    const cards = buildTaxonomySectorCards([{ sectorKey: "makine" }], "de");
    const makine = cards.find((card) => card.sector.id === "makine");
    expect(makine?.label).toBe(resolveTaxonomySectorLabel("de", "makine", "", ""));
    expect(makine?.label).not.toBe("Makine & Uretim");
  });

  it("includes localized profession labels", () => {
    const cards = buildTaxonomySectorCards([{ sectorKey: "makine" }], "en");
    const makine = cards.find((card) => card.sector.id === "makine");
    expect(makine?.professionLabels.some((label) => label.includes("Engineer"))).toBe(true);
  });
});
