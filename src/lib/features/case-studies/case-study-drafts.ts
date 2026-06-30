import {
  buildCaseStudyJsonLd,
  computeCaseStudySeoPreview,
} from "@/lib/features/case-studies/case-study-seo";
import { slugifyCaseStudyTitle } from "@/lib/features/case-studies/slug";
import type { CaseStudy, CaseStudyResult } from "@/lib/features/case-studies/types";

const STORAGE_KEY = "sectorcalc-case-study-drafts";

export type CaseStudyDraftRecord = CaseStudy & {
  readonly source: "draft";
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readDrafts(): CaseStudyDraftRecord[] {
  if (!isBrowser()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry): entry is CaseStudyDraftRecord => {
      return (
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as CaseStudyDraftRecord).id === "string" &&
        typeof (entry as CaseStudyDraftRecord).slug === "string"
      );
    });
  } catch {
    return [];
  }
}

function writeDrafts(drafts: CaseStudyDraftRecord[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function listCaseStudyDrafts(): CaseStudyDraftRecord[] {
  return readDrafts();
}

export function getCaseStudyDraftById(id: string): CaseStudyDraftRecord | undefined {
  return readDrafts().find((draft) => draft.id === id || draft.slug === id);
}

export function saveCaseStudyDraft(draft: CaseStudyDraftRecord): void {
  const drafts = readDrafts();
  const index = drafts.findIndex((entry) => entry.id === draft.id);
  if (index >= 0) {
    drafts[index] = draft;
  } else {
    drafts.push(draft);
  }
  writeDrafts(drafts);
}

export function deleteCaseStudyDraft(id: string): void {
  writeDrafts(readDrafts().filter((draft) => draft.id !== id && draft.slug !== id));
}

export type CaseStudyFormValues = {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  country: string;
  city: string;
  projectDuration: string;
  savingsEur: string;
  tools: string;
  challenge: string;
  solution: string;
  publishedAt: string;
  readTime: string;
  sourceLocale: string;
  results: CaseStudyResult[];
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialTitle: string;
  testimonialCompany: string;
  coverImage: string;
};

export function emptyCaseStudyFormValues(id: string): CaseStudyFormValues {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id,
    title: "",
    subtitle: "",
    industry: "",
    country: "",
    city: "",
    projectDuration: "",
    savingsEur: "",
    tools: "",
    challenge: "",
    solution: "",
    publishedAt: today,
    readTime: "4",
    sourceLocale: "en",
    results: [
      { metric: "", before: "", after: "" },
      { metric: "", before: "", after: "" },
      { metric: "", before: "", after: "" },
    ],
    testimonialQuote: "",
    testimonialAuthor: "",
    testimonialTitle: "",
    testimonialCompany: "",
    coverImage: "",
  };
}

export function caseStudyToFormValues(study: CaseStudy): CaseStudyFormValues {
  return {
    id: study.id ?? study.slug,
    title: study.title,
    subtitle: study.subtitle,
    industry: study.industry,
    country: study.country ?? "",
    city: study.city ?? "",
    projectDuration: study.projectDuration ?? "",
    savingsEur: study.savingsEur !== undefined ? String(study.savingsEur) : "",
    tools: study.tools.join(", "),
    challenge: study.challenge,
    solution: study.solution,
    publishedAt: study.publishedAt,
    readTime: String(study.readTime),
    sourceLocale: "en",
    results:
      study.results.length > 0
        ? study.results.map((row) => ({ ...row }))
        : [{ metric: "", before: "", after: "" }],
    testimonialQuote: study.testimonial?.quote ?? "",
    testimonialAuthor: study.testimonial?.author ?? "",
    testimonialTitle: study.testimonial?.title ?? "",
    testimonialCompany: study.testimonial?.company ?? "",
    coverImage: study.coverImage ?? "",
  };
}

export function formValuesToDraft(values: CaseStudyFormValues): CaseStudyDraftRecord {
  const slug = slugifyCaseStudyTitle(values.title);
  const savings = values.savingsEur.trim()
    ? Number.parseInt(values.savingsEur.replace(/[^\d]/g, ""), 10)
    : undefined;
  const tools = values.tools
    .split(",")
    .map((tool) => tool.trim())
    .filter((tool) => tool.length > 0);
  const results = values.results.filter(
    (row) => row.metric.trim() || row.before.trim() || row.after.trim(),
  );
  const hasTestimonial =
    values.testimonialQuote.trim() ||
    values.testimonialAuthor.trim() ||
    values.testimonialTitle.trim() ||
    values.testimonialCompany.trim();
  const seoPreview = computeCaseStudySeoPreview(values);

  return {
    source: "draft",
    id: values.id,
    slug,
    title: values.title.trim(),
    subtitle: values.subtitle.trim(),
    industry: values.industry.trim(),
    country: values.country.trim() || undefined,
    city: values.city.trim() || undefined,
    projectDuration: values.projectDuration.trim() || undefined,
    savingsEur: Number.isFinite(savings) ? savings : undefined,
    tools,
    challenge: values.challenge.trim(),
    solution: values.solution.trim(),
    results,
    coverImage: values.coverImage.trim() || undefined,
    testimonial: hasTestimonial
      ? {
          quote: values.testimonialQuote.trim(),
          author: values.testimonialAuthor.trim(),
          title: values.testimonialTitle.trim(),
          company: values.testimonialCompany.trim(),
        }
      : undefined,
    publishedAt: values.publishedAt,
    readTime: Number.parseInt(values.readTime, 10) || 4,
    updatedAt: new Date().toISOString(),
    author: {
      name: "Barış Bağırlar",
      linkedin: "https://www.linkedin.com/in/barisbagirlar/",
    },
    technicalReview: {
      reviewer: "Prof. Dr. Neela Nataraj",
      mathSciNetId: "613458",
    },
    seo: {
      metaTitle: seoPreview.metaTitle,
      metaDescription: seoPreview.metaDescription,
    },
  };
}

export function buildCaseStudyExportBundle(draft: CaseStudyDraftRecord): string {
  const base = {
    id: draft.id,
    slug: draft.slug,
    tools: draft.tools,
    publishedAt: draft.publishedAt,
    readTime: draft.readTime,
    country: draft.country,
    city: draft.city,
    projectDuration: draft.projectDuration,
    savingsEur: draft.savingsEur,
  };
  const localeContent = {
    title: draft.title,
    subtitle: draft.subtitle,
    industry: draft.industry,
    challenge: draft.challenge,
    solution: draft.solution,
    results: draft.results,
    testimonial: draft.testimonial,
  };
  return JSON.stringify(
    {
      base,
      en: localeContent,
      seo: draft.seo,
      schemaOrg: buildCaseStudyJsonLd(draft, "en"),
      publishInstructions: [
        "Add base entry to src/lib/case-studies/data.ts",
        "Add en locale block to src/lib/case-studies/published-case-study-locale.ts",
        "Run npm run audit:case-studies then deploy hosting",
      ],
    },
    null,
    2,
  );
}

export function downloadCaseStudyDraftExport(draft: CaseStudyDraftRecord): void {
  if (!isBrowser()) {
    return;
  }
  const blob = new Blob([buildCaseStudyExportBundle(draft)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${draft.slug || draft.id}-case-study-draft.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
