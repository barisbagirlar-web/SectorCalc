import { publishedCaseStudyBase } from "@/lib/features/case-studies/data";
import {
  getPublishedCaseStudyBySlug,
  listPublishedCaseStudies,
} from "@/lib/features/case-studies/published-case-study-locale";
import type { CaseStudy } from "@/lib/features/case-studies/types";

export type AdminCaseStudyListItem = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly industry: string;
  readonly publishedAt: string;
  readonly source: "published" | "draft" | "firestore";
};

export function listPublishedAdminCaseStudies(): AdminCaseStudyListItem[] {
  return listPublishedCaseStudies("en").map((study) => ({
    id: study.id ?? study.slug,
    slug: study.slug,
    title: study.title,
    industry: study.industry,
    publishedAt: study.publishedAt,
    source: "published",
  }));
}

export function getPublishedCaseStudyByAdminId(id: string): CaseStudy | undefined {
  const base = publishedCaseStudyBase.find(
    (entry) => entry.id === id || entry.slug === id,
  );
  if (!base) {
    return undefined;
  }
  return getPublishedCaseStudyBySlug(base.slug, "en");
}

export function nextPublishedCaseStudyId(): string {
  const year = new Date().getFullYear();
  const prefix = `CS-${year}-`;
  const maxSeq = publishedCaseStudyBase.reduce((max, entry) => {
    const match = entry.id?.match(/^CS-\d{4}-(\d{3})$/);
    if (!match) {
      return max;
    }
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 0);
  return `${prefix}${String(maxSeq + 1).padStart(3, "0")}`;
}
