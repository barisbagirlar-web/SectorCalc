import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { siteUrl } from "@/config/site";
import { isSupportedLocale } from "@/lib/i18n/locale-routing";
import { buildLocalizedUrl } from "@/lib/seo/sitemap-manifest";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { slugifyCaseStudyTitle } from "@/lib/case-studies/slug";
import type { CaseStudy } from "@/lib/case-studies/types";
import type { CaseStudyFormValues } from "@/lib/case-studies/case-study-drafts";

export type CaseStudySeoPreview = {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly slug: string;
  readonly canonicalPath: string;
};

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

export function buildCaseStudyJsonLd(study: CaseStudy, locale = "en"): JsonLdRecord {
  const normalizedLocale = isSupportedLocale(locale) ? locale : "en";
  const pageUrl = buildLocalizedUrl(`/case-studies/${study.slug}`, normalizedLocale, siteUrl);
  const savings = study.savingsEur;
  const company = study.testimonial?.company?.trim();

  const graphs: JsonLdRecord[] = [
    sanitizeJsonLd({
      "@context": "https://schema.org",
      "@type": "CaseStudy",
      "@id": `${pageUrl}#case-study`,
      headline: study.title,
      name: study.title,
      description: study.seo?.metaDescription ?? study.subtitle,
      url: pageUrl,
      datePublished: study.publishedAt,
      dateModified: study.updatedAt ?? study.publishedAt,
      inLanguage: normalizedLocale,
      mainEntityOfPage: pageUrl,
      author: study.author
        ? {
            "@type": "Person",
            name: study.author.name,
            sameAs: study.author.linkedin,
          }
        : {
            "@type": "Person",
            name: ORGANIZATION_TRUST.founder.name,
            email: ORGANIZATION_TRUST.founder.email,
          },
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      ...(study.technicalReview
        ? {
            reviewedBy: {
              "@type": "Person",
              name: study.technicalReview.reviewer,
              identifier: study.technicalReview.mathSciNetId,
            },
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
    }) as JsonLdRecord,
  ];

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@graph": graphs,
  }) as JsonLdRecord;
}
