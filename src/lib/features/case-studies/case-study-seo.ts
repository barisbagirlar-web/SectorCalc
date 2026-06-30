import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { siteUrl } from "@/config/site";
import {
  formatEuroAmount,
  getPrimaryResultRow,
  resolveCaseStudySavingsEur,
} from "@/lib/features/case-studies/academic-database";
import { slugifyCaseStudyTitle } from "@/lib/features/case-studies/slug";
import type { CaseStudyFormValues } from "@/lib/features/case-studies/case-study-drafts";
import type { CaseStudy } from "@/lib/features/case-studies/types";
import { isSupportedLocale } from "@/lib/infrastructure/i18n/locale-routing";
import { absoluteImageUrl } from "@/lib/features/semantic/site-url";
import { buildBreadcrumbJsonLd, sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedUrl } from "@/lib/infrastructure/seo/sitemap-manifest";
import { resolveGeneratedToolPath } from "@/lib/features/tools/paths";

export type CaseStudySnippetCopy = {
  readonly question: string;
  readonly answer: string;
  readonly bullets: readonly string[];
};

export type CaseStudySnippetLabels = {
  readonly snippetQuestionFallback: (values: { industry: string }) => string;
  readonly snippetAnswerMetric: (values: {
    metric: string;
    before: string;
    after: string;
  }) => string;
  readonly snippetAnswerSavings: (values: { amount: string }) => string;
};

export type CaseStudyIndexSummaryLabels = {
  readonly lineSavingsOnly: (values: { company: string; savings: string }) => string;
  readonly lineWithMetric: (values: {
    company: string;
    metric: string;
    before: string;
    after: string;
    savings: string;
  }) => string;
};

const SNIPPET_ANSWER_MAX_WORDS = 58;

function trimToWordLimit(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return text.trim();
  }
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function firstSolutionSentence(solution: string): string {
  const normalized = solution.trim();
  if (!normalized) {
    return "";
  }
  const match = normalized.match(/^[^.\n!?]+[.!?]?/u);
  return match?.[0]?.trim() ?? normalized.slice(0, 120);
}

function isQuestionSubtitle(subtitle: string): boolean {
  const trimmed = subtitle.trim();
  return trimmed.endsWith("?") || trimmed.endsWith("؟");
}

export function buildCaseStudySnippetCopy(
  study: CaseStudy,
  locale: string,
  labels: CaseStudySnippetLabels,
): CaseStudySnippetCopy {
  const question = isQuestionSubtitle(study.subtitle)
    ? study.subtitle.trim()
    : labels.snippetQuestionFallback({ industry: study.industry });

  const parts: string[] = [];
  const solutionLead = firstSolutionSentence(study.solution);
  if (solutionLead) {
    parts.push(solutionLead);
  }

  const primary = getPrimaryResultRow(study);
  if (primary?.metric) {
    parts.push(
      labels.snippetAnswerMetric({
        metric: primary.metric,
        before: primary.before,
        after: primary.after,
      }),
    );
  }

  const savings = resolveCaseStudySavingsEur(study);
  if (savings > 0) {
    parts.push(
      labels.snippetAnswerSavings({
        amount: formatEuroAmount(savings, locale),
      }),
    );
  }

  const answer = trimToWordLimit(parts.join(" "), SNIPPET_ANSWER_MAX_WORDS);
  const bullets = study.results
    .slice(0, 4)
    .map((row) => `${row.metric}: ${row.before} → ${row.after}`);

  return { question, answer, bullets };
}

export function buildCaseStudyIndexSummaryLine(
  study: CaseStudy,
  locale: string,
  labels: CaseStudyIndexSummaryLabels,
): string {
  const company = study.testimonial?.company ?? study.industry;
  const primary = getPrimaryResultRow(study);
  const savings = formatEuroAmount(resolveCaseStudySavingsEur(study), locale);
  if (!primary) {
    return labels.lineSavingsOnly({ company, savings });
  }
  return labels.lineWithMetric({
    company,
    metric: primary.metric,
    before: primary.before,
    after: primary.after,
    savings,
  });
}

export type CaseStudySeoPreview = {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly slug: string;
  readonly canonicalPath: string;
};

export type CaseStudyBreadcrumbLabels = {
  readonly home: string;
  readonly index: string;
  readonly current: string;
};

const DEFAULT_AUTHOR = {
  name: "Barış Bağırlar",
  linkedin: "https://www.linkedin.com/in/barisbagirlar/",
} as const;

const DEFAULT_TECHNICAL_REVIEW = {
  reviewer: "Prof. Dr. Neela Nataraj",
  mathSciNetId: "613458",
} as const;

function parseSavingsEur(value: string): number | undefined {
  const parsed = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function computeCaseStudySeoPreview(values: Pick<
  CaseStudyFormValues,
  "title" | "subtitle" | "industry" | "savingsEur"
>): CaseStudySeoPreview {
  const slug = values.title.trim() ? slugifyCaseStudyTitle(values.title) : "";
  const savings = parseSavingsEur(values.savingsEur);
  const savingsLabel =
    savings !== undefined
      ? new Intl.NumberFormat("tr-TR").format(savings)
      : "önemli";
  const industry = values.industry.trim() || "endüstriyel";
  const metaTitle = values.title.trim()
    ? `${values.title.trim()} | SectorCalc Başarı Hikayesi`
    : "";
  const metaDescription = values.title.trim()
    ? `SectorCalc ile ${industry} sektöründe ${savingsLabel} € tasarruf. ${values.subtitle.trim()}`.slice(
        0,
        160,
      )
    : "";

  return {
    metaTitle,
    metaDescription,
    slug,
    canonicalPath: slug ? `/case-studies/${slug}` : "",
  };
}

export function resolveCaseStudyPageDescription(study: CaseStudy): string {
  if (study.seo?.metaDescription?.trim()) {
    return study.seo.metaDescription.trim();
  }
  const preview = computeCaseStudySeoPreview({
    title: study.title,
    subtitle: study.subtitle,
    industry: study.industry,
    savingsEur: study.savingsEur != null ? String(study.savingsEur) : "",
  });
  return preview.metaDescription || study.subtitle;
}

function resolveAuthor(study: CaseStudy): { name: string; linkedin?: string; email?: string } {
  if (study.author) {
    return study.author;
  }
  return {
    name: ORGANIZATION_TRUST.founder.name,
    email: ORGANIZATION_TRUST.founder.email,
  };
}

function resolveTechnicalReview(study: CaseStudy): { reviewer: string; mathSciNetId: string } {
  return study.technicalReview ?? DEFAULT_TECHNICAL_REVIEW;
}

function stripJsonLdContext(node: JsonLdRecord): JsonLdRecord {
  const rest = { ...node };
  delete rest["@context"];
  return rest;
}

export function buildCaseStudyJsonLd(
  study: CaseStudy,
  locale = "en",
  breadcrumbLabels?: CaseStudyBreadcrumbLabels,
): JsonLdRecord {
  const normalizedLocale = isSupportedLocale(locale) ? locale : "en";
  const pageUrl = buildLocalizedUrl(`/case-studies/${study.slug}`, normalizedLocale, siteUrl);
  const savings = study.savingsEur;
  const company = study.testimonial?.company?.trim();
  const description = resolveCaseStudyPageDescription(study);
  const author = resolveAuthor(study);
  const technicalReview = resolveTechnicalReview(study);
  const authorNode =
    "linkedin" in author && author.linkedin
      ? {
          "@type": "Person",
          name: author.name,
          sameAs: author.linkedin,
        }
      : {
          "@type": "Person",
          name: author.name,
          email: author.email,
        };

  const caseStudyNode = sanitizeJsonLd({
    "@type": "CaseStudy",
    "@id": `${pageUrl}#case-study`,
    headline: study.title,
    name: study.title,
    description,
    url: pageUrl,
    datePublished: study.publishedAt,
    dateModified: study.updatedAt ?? study.publishedAt,
    inLanguage: normalizedLocale,
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    author: authorNode,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    reviewedBy: {
      "@type": "Person",
      name: technicalReview.reviewer,
      identifier: technicalReview.mathSciNetId,
    },
    ...(study.coverImage
      ? {
          image: absoluteImageUrl(study.coverImage),
        }
      : {}),
    ...(company
      ? {
          about: {
            "@type": "Organization",
            name: company,
            ...(study.city || study.country
              ? {
                  address: {
                    "@type": "PostalAddress",
                    ...(study.city ? { addressLocality: study.city } : {}),
                    ...(study.country ? { addressCountry: study.country } : {}),
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(study.testimonial?.quote
      ? {
          citation: {
            "@type": "Quotation",
            text: study.testimonial.quote,
            spokenByCharacter: {
              "@type": "Person",
              name: study.testimonial.author,
              jobTitle: study.testimonial.title,
              worksFor: {
                "@type": "Organization",
                name: study.testimonial.company,
              },
            },
          },
        }
      : {}),
    ...(savings !== undefined
      ? {
          mentions: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: savings,
          },
        }
      : {}),
  }) as JsonLdRecord;

  const articleNode = sanitizeJsonLd({
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: study.title,
    description,
    url: pageUrl,
    datePublished: study.publishedAt,
    dateModified: study.updatedAt ?? study.publishedAt,
    inLanguage: normalizedLocale,
    author: authorNode,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".sc-featured-answer__answer"],
    },
    ...(study.coverImage
      ? {
          image: absoluteImageUrl(study.coverImage),
        }
      : {}),
  }) as JsonLdRecord;

  const webPageNode = sanitizeJsonLd({
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: study.title,
    description,
    url: pageUrl,
    inLanguage: normalizedLocale,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
  }) as JsonLdRecord;

  const toolNodes = study.tools.map((tool) =>
    sanitizeJsonLd({
      "@type": "SoftwareApplication",
      name: tool.replace(/-/g, " "),
      url: buildLocalizedUrl(resolveGeneratedToolPath(tool), normalizedLocale, siteUrl),
      applicationCategory: "BusinessApplication",
    }),
  );

  const breadcrumbNode = stripJsonLdContext(
    buildBreadcrumbJsonLd(
      [
        { name: breadcrumbLabels?.home ?? "Home", path: "/" },
        { name: breadcrumbLabels?.index ?? "Success Stories", path: "/case-studies" },
        {
          name: breadcrumbLabels?.current ?? study.title,
          path: `/case-studies/${study.slug}`,
        },
      ],
      normalizedLocale,
    ) as JsonLdRecord,
  );

  const graph = [
    caseStudyNode,
    articleNode,
    webPageNode,
    breadcrumbNode,
    ...toolNodes,
  ].filter((node): node is JsonLdRecord => node !== undefined && node !== null);

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@graph": graph,
  }) as JsonLdRecord;
}

export function buildCaseStudyIndexJsonLd(
  studies: readonly CaseStudy[],
  locale: string,
  listName: string,
): JsonLdRecord {
  const normalizedLocale = isSupportedLocale(locale) ? locale : "en";
  const indexUrl = buildLocalizedUrl("/case-studies", normalizedLocale, siteUrl);

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: indexUrl,
    numberOfItems: studies.length,
    itemListElement: studies.map((study, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: study.title,
      url: buildLocalizedUrl(`/case-studies/${study.slug}`, normalizedLocale, siteUrl),
    })),
  }) as JsonLdRecord;
}

export { DEFAULT_AUTHOR, DEFAULT_TECHNICAL_REVIEW };
