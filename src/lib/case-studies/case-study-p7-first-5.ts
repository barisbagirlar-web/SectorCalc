/**
 * P7 — first five representative case studies (priority rollout).
 */

export const P7_FIRST_5_CASE_STUDY_SLUGS = [
  "representative-cnc-job-shop",
  "representative-construction-bid-margin",
  "representative-cleaning-contract",
  "representative-logistics-route",
  "representative-energy-compressor-peak",
] as const;

export type P7CaseStudySlug = (typeof P7_FIRST_5_CASE_STUDY_SLUGS)[number];

const P7_SET = new Set<string>(P7_FIRST_5_CASE_STUDY_SLUGS);

export function isP7First5CaseStudySlug(slug: string): slug is P7CaseStudySlug {
  return P7_SET.has(slug);
}

export function listP7First5CaseStudySlugs(): readonly P7CaseStudySlug[] {
  return P7_FIRST_5_CASE_STUDY_SLUGS;
}
