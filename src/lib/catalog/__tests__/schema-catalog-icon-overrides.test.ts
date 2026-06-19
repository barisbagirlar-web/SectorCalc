import { describe, expect, it } from "vitest";
import {
  BadgeDollarSign,
  BatteryCharging,
  Boxes,
  Building,
  Crosshair,
  DollarSign,
  Factory,
  Goal,
  LifeBuoy,
  Package,
  ScanLine,
  Settings,
  Shapes,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sprout,
  TreePine,
  Van,
} from "lucide-react";
import { resolveCatalogCategoryIcon } from "@/lib/catalog/resolve-catalog-category-icon";
import { listTaxonomyCategorySlugs } from "@/lib/tools/category-taxonomy";
import { SCHEMA_CATALOG_ICON_OVERRIDES } from "@/lib/catalog/schema-catalog-icon-overrides";

describe("schema catalog icon overrides", () => {
  it("maps legacy sidebar keys to the intended sector symbols", () => {
    expect(resolveCatalogCategoryIcon("insaat-saha")).toBe(Building);
    expect(resolveCatalogCategoryIcon("malzeme-fire-oee")).toBe(Crosshair);
    expect(resolveCatalogCategoryIcon("olcum-donusum")).toBe(ScanLine);
    expect(resolveCatalogCategoryIcon("rota-lojistik")).toBe(Van);
    expect(resolveCatalogCategoryIcon("teknik-muhendislik")).toBe(SlidersHorizontal);
    expect(resolveCatalogCategoryIcon("finans-ik")).toBe(BadgeDollarSign);
    expect(resolveCatalogCategoryIcon("perakende-gida")).toBe(ShoppingBag);
    expect(resolveCatalogCategoryIcon("enerji-karbon")).toBe(BatteryCharging);
    expect(resolveCatalogCategoryIcon("uretim-imalat")).toBe(Settings);
    expect(resolveCatalogCategoryIcon("isg-risk")).toBe(LifeBuoy);
    expect(resolveCatalogCategoryIcon("surdurulebilirlik")).toBe(Sprout);
    expect(resolveCatalogCategoryIcon("kalite-spc-alti-sigma")).toBe(Goal);
  });

  it("covers every explicit schema override entry", () => {
    for (const slug of Object.keys(SCHEMA_CATALOG_ICON_OVERRIDES)) {
      expect(resolveCatalogCategoryIcon(slug)).toBe(SCHEMA_CATALOG_ICON_OVERRIDES[slug]);
    }
  });

  it("resolves taxonomy category slugs through global category icons", () => {
    expect(resolveCatalogCategoryIcon("yalin-uretim")).toBe(Factory);
    expect(resolveCatalogCategoryIcon("kalite-surec-kontrol")).toBe(ShieldCheck);
    expect(resolveCatalogCategoryIcon("imalat-uretim")).toBe(Package);
    expect(resolveCatalogCategoryIcon("malzeme-metalurji")).toBe(Shapes);
    expect(resolveCatalogCategoryIcon("lojistik-tedarik-zinciri")).toBe(Boxes);
    expect(resolveCatalogCategoryIcon("maliyet-butceleme")).toBe(DollarSign);
    expect(resolveCatalogCategoryIcon("cevre-emisyon")).toBe(TreePine);

    for (const slug of listTaxonomyCategorySlugs()) {
      expect(resolveCatalogCategoryIcon(slug)).toBeDefined();
    }
  });
});
