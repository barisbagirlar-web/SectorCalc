import type { PublishedCaseStudyBase } from "@/lib/features/case-studies/types";

/** Non-localized metadata for published success-story case studies. */
export const publishedCaseStudyBase: readonly PublishedCaseStudyBase[] = [
  {
    id: "CS-2026-001",
    slug: "muller-prazision-5s-optimization",
    tools: ["oee-downtime-calculator", "scrap-rate-optimizer", "downtime-cost-calculator"],
    publishedAt: "2026-05-30",
    readTime: 4,
    country: "Germany",
    city: "Stuttgart",
    projectDuration: "5 months",
    savingsEur: 1_232_000,
  },
  {
    id: "CS-2026-002",
    slug: "cnc-oee-improvement",
    tools: ["oee-downtime-calculator", "smed-changeover-optimizer", "scrap-rate-optimizer"],
    publishedAt: "2026-06-01",
    readTime: 4,
    country: "Turkey",
    city: "Izmir",
    projectDuration: "6 months",
    savingsEur: 85_000,
  },
  {
    id: "CS-2026-003",
    slug: "carbon-reporting-automation",
    tools: ["carbon-footprint-calculator", "kwh-cost-calculator", "product-carbon-footprint"],
    publishedAt: "2026-06-10",
    readTime: 3,
    country: "Turkey",
    city: "Istanbul",
    projectDuration: "3 months",
    savingsEur: 32_000,
  },
  {
    id: "CS-2026-004",
    slug: "welding-cost-reduction",
    tools: ["welding-cost-calculator", "weld-volume-cost-calculator", "weld-strength-calculator"],
    publishedAt: "2026-05-20",
    readTime: 3,
    country: "Turkey",
    city: "Istanbul",
    projectDuration: "4 months",
    savingsEur: 45_000,
  },
] as const;

export const PUBLISHED_CASE_STUDY_SLUGS = publishedCaseStudyBase.map((entry) => entry.slug);

/** @deprecated Prefer publishedCaseStudyBase - alias for import compatibility. */
export const caseStudies = publishedCaseStudyBase;
