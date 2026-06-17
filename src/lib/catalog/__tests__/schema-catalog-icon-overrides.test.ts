import { describe, expect, it } from "vitest";
import {
  Building2,
  DollarSign,
  Factory,
  Gauge,
  Hammer,
  HardHat,
  Leaf,
  Package,
  Printer,
  Ruler,
  Store,
  Target,
  Truck,
  Zap,
} from "lucide-react";
import { resolveCatalogCategoryIcon } from "@/lib/catalog/resolve-catalog-category-icon";
import { listTaxonomyCategorySlugs } from "@/lib/tools/category-taxonomy";
import { SCHEMA_CATALOG_ICON_OVERRIDES } from "@/lib/catalog/schema-catalog-icon-overrides";

describe("schema catalog icon overrides", () => {
  it("maps legacy sidebar keys to the intended sector symbols", () => {
    expect(resolveCatalogCategoryIcon("insaat-saha")).toBe(Building2);
    expect(resolveCatalogCategoryIcon("malzeme-fire-oee")).toBe(Target);
    expect(resolveCatalogCategoryIcon("olcum-donusum")).toBe(Ruler);
    expect(resolveCatalogCategoryIcon("rota-lojistik")).toBe(Truck);
    expect(resolveCatalogCategoryIcon("teknik-muhendislik")).toBe(Gauge);
    expect(resolveCatalogCategoryIcon("finans-ik")).toBe(DollarSign);
    expect(resolveCatalogCategoryIcon("perakende-gida")).toBe(Store);
    expect(resolveCatalogCategoryIcon("enerji-karbon")).toBe(Zap);
    expect(resolveCatalogCategoryIcon("uretim-imalat")).toBe(Factory);
    expect(resolveCatalogCategoryIcon("isg-risk")).toBe(HardHat);
    expect(resolveCatalogCategoryIcon("surdurulebilirlik")).toBe(Leaf);
    expect(resolveCatalogCategoryIcon("kalite-spc-alti-sigma")).toBe(Target);
  });

  it("covers every explicit schema override entry", () => {
    for (const slug of Object.keys(SCHEMA_CATALOG_ICON_OVERRIDES)) {
      expect(resolveCatalogCategoryIcon(slug)).toBe(SCHEMA_CATALOG_ICON_OVERRIDES[slug]);
    }
  });

  it("resolves taxonomy category slugs through global category icons", () => {
    expect(resolveCatalogCategoryIcon("yalin-uretim")).toBe(Factory);
    expect(resolveCatalogCategoryIcon("kalite-surec-kontrol")).toBe(Target);
    expect(resolveCatalogCategoryIcon("imalat-uretim")).toBe(Printer);
    expect(resolveCatalogCategoryIcon("malzeme-metalurji")).toBe(Hammer);
    expect(resolveCatalogCategoryIcon("lojistik-tedarik-zinciri")).toBe(Package);
    expect(resolveCatalogCategoryIcon("maliyet-butceleme")).toBe(DollarSign);
    expect(resolveCatalogCategoryIcon("cevre-emisyon")).toBe(Leaf);

    for (const slug of listTaxonomyCategorySlugs()) {
      expect(resolveCatalogCategoryIcon(slug)).toBeDefined();
    }
  });
});
