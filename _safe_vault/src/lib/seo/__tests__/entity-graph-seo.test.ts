import { describe, expect, test } from "vitest";
import { buildEntityGraph } from "@/lib/seo/entity-graph";
import { buildGeneratedToolProductJsonLd } from "@/lib/semantic/build-generated-tool-product-jsonld";
import { buildGeneratedToolFeaturedCopy } from "@/lib/semantic/build-generated-tool-featured-copy";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import {
  isFreeTrafficCategorySlug,
  listFreeTrafficCategorySlugs,
} from "@/lib/tools/free-traffic-categories";

const MINIMAL_SCHEMA: GeneratedToolSchema = {
  toolName: "OEE Calculator",
  inputs: [],
  validation: { rules: [], thresholds: {} },
  formulas: {},
  outputs: {
    primary: "OEE percentage",
    breakdown: {},
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "medium",
  },
  premiumFeatures: [],
  premiumRequired: false,
  lastUpdated: "2026-06-16",
};

describe("entity graph", () => {
  test("builds @graph with organization, founder and academic advisors", () => {
    const graph = buildEntityGraph("en");
    expect(graph["@context"]).toBe("https://schema.org");
    const nodes = graph["@graph"] as Array<Record<string, unknown>>;
    expect(nodes.length).toBeGreaterThanOrEqual(7);
    expect(nodes.some((node) => node["@type"] === "Organization")).toBe(true);
    expect(nodes.some((node) => node["@type"] === "Person" && node.name === "Barış Bağırlar")).toBe(
      true,
    );
    expect(
      nodes.some((node) => node.name === "Prof. Dr. Neela Nataraj"),
    ).toBe(true);
  });
});

describe("generated tool product schema mesh", () => {
  test("emits Product with Offer and academic Review", () => {
    const product = buildGeneratedToolProductJsonLd({
      toolName: "OEE Calculator",
      description: "Calculate overall equipment effectiveness.",
      slug: "oee-calculator",
      locale: "en",
      schema: MINIMAL_SCHEMA,
    });

    expect(product["@type"]).toBe("Product");
    const offers = product.offers as Record<string, unknown>;
    expect(offers.price).toBe("0.00");
    const review = product.review as Record<string, unknown>;
    const author = review.author as Record<string, unknown>;
    expect(author.name).toBe("Prof. Dr. Neela Nataraj");
    const manufacturer = product.manufacturer as Record<string, unknown>;
    expect(manufacturer.name).toBe("SectorCalc");
  });
});

describe("featured answer copy", () => {
  test("localizes what-is question", () => {
    const en = buildGeneratedToolFeaturedCopy("OEE Calculator", "Measures availability.", "en");
    expect(en.question).toBe("What is OEE Calculator?");
    const tr = buildGeneratedToolFeaturedCopy("OEE Hesaplayıcı", "Verimlilik ölçer.", "tr");
    expect(tr.question).toBe("OEE Hesaplayıcı nedir?");
  });
});

describe("free traffic category landing", () => {
  test("lists category slugs", () => {
    const slugs = listFreeTrafficCategorySlugs();
    expect(slugs.length).toBeGreaterThan(5);
    expect(isFreeTrafficCategorySlug("manufacturing-workshop")).toBe(true);
    expect(isFreeTrafficCategorySlug("not-a-category")).toBe(false);
  });
});
