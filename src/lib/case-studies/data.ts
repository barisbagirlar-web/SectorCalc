import type { PublishedCaseStudyBase } from "@/lib/case-studies/types";

/** Non-localized metadata for published success-story case studies. */
export const publishedCaseStudyBase: readonly PublishedCaseStudyBase[] = [
  {
    slug: "cnc-oee-improvement",
    tools: ["oee-downtime-calculator", "smed-changeover-optimizer", "scrap-rate-optimizer"],
    publishedAt: "2026-06-01",
    readTime: 4,
  },
  {
    slug: "carbon-reporting-automation",
    tools: ["carbon-footprint-calculator", "kwh-cost-calculator", "product-carbon-footprint"],
    publishedAt: "2026-06-10",
    readTime: 3,
  },
  {
    slug: "welding-cost-reduction",
    tools: ["welding-cost-calculator", "weld-volume-cost-calculator", "weld-strength-calculator"],
    publishedAt: "2026-05-20",
    readTime: 3,
  },
] as const;

export const PUBLISHED_CASE_STUDY_SLUGS = publishedCaseStudyBase.map((entry) => entry.slug);

/** @deprecated Prefer publishedCaseStudyBase — alias for import compatibility. */
export const caseStudies = publishedCaseStudyBase;
