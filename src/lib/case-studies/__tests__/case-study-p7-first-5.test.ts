import { describe, expect, test } from "vitest";
import { listP7FeaturedCaseStudies } from "@/lib/case-studies/case-study-registry";
import { listP7First5CaseStudySlugs } from "@/lib/case-studies/case-study-p7-first-5";
import { getCaseStudyToolHref } from "@/lib/case-studies/case-study-types";

describe("P7 first 5 case studies", () => {
  test("exactly five slugs in priority list", () => {
    expect(listP7First5CaseStudySlugs()).toEqual([
      "representative-cnc-job-shop",
      "representative-construction-bid-margin",
      "representative-cleaning-contract",
      "representative-logistics-route",
      "representative-energy-compressor-peak",
    ]);
  });

  test("logistics CTA uses revenue premium route", () => {
    const logistics = listP7FeaturedCaseStudies().find(
      (e) => e.slug === "representative-logistics-route",
    );
    expect(logistics?.toolSlug).toBe("route-optimization-analyzer");
    expect(getCaseStudyToolHref(logistics!)).toBe(
      "/tools/premium/route-optimization-analyzer",
    );
  });

  test("energy CTA uses premium-schema route", () => {
    const energy = listP7FeaturedCaseStudies().find(
      (e) => e.slug === "representative-energy-compressor-peak",
    );
    expect(energy?.toolRoute).toBe("premium-schema");
    expect(getCaseStudyToolHref(energy!)).toBe(
      "/tools/premium-schema/energy-compressor-leak-cost",
    );
  });
});
