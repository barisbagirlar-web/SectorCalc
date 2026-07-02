import { BRAND_ASSETS } from "@/config/brand";
import {
  FOUNDER_PROFILE,
  buildFounderSameAs,
  buildOrganizationSameAs,
} from "@/config/knowledge-graph";
import { ORGANIZATION_TRUST, organizationDescriptionForLocale } from "@/config/organization-trust";
import {
  academicReferences,
  type AcademicReference,
} from "@/lib/infrastructure/seo/academic-references";
import { absoluteImageUrl, absoluteLocalizedUrl, SITE_URL } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

function academicPersonJsonLd(ref: AcademicReference): JsonLdRecord {
  const sameAs = [ref.mathSciNetUrl, ...(ref.profileUrl ? [ref.profileUrl] : [])];

  return {
    "@type": "Person",
    name: ref.name,
    affiliation: {
      "@type": "Organization",
      name: ref.affiliation,
    },
    sameAs,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "MathSciNetAuthorID",
      value: String(ref.mrId),
    },
  };
}

export function buildAcademicAdvisoryBoardAboutPageJsonLd(locale: AppLocale): JsonLdRecord {
  const advisors = academicReferences.filter((ref) => ref.role === "advisor");
  const authors = academicReferences.filter((ref) => ref.role === "author");
  const reviewers = academicReferences.filter((ref) => ref.role === "reviewer");
  const aboutUrl = absoluteLocalizedUrl(locale, "/about");

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${aboutUrl}#academic-advisory-board`,
    url: aboutUrl,
    inLanguage: locale,
    author: authors.map(academicPersonJsonLd),
    contributor: [...advisors, ...reviewers].map(academicPersonJsonLd),
  }) as JsonLdRecord;
}

export function buildEntityHomeOrganizationJsonLd(locale: AppLocale): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORGANIZATION_TRUST.displayName,
    url: absoluteLocalizedUrl(locale, "/"),
    logo: absoluteImageUrl(BRAND_ASSETS.logo.default),
    description: organizationDescriptionForLocale(locale),
    email: ORGANIZATION_TRUST.email,
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder-baris-bagirlar`,
      name: FOUNDER_PROFILE.name,
      email: FOUNDER_PROFILE.email,
      sameAs: buildFounderSameAs(),
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION_TRUST.address.streetAddress,
      addressLocality: ORGANIZATION_TRUST.address.addressLocality,
      addressCountry: ORGANIZATION_TRUST.address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORGANIZATION_TRUST.phone,
      email: ORGANIZATION_TRUST.email,
      contactType: ORGANIZATION_TRUST.contactType,
    },
    sameAs: buildOrganizationSameAs(),
  }) as JsonLdRecord;
}

export function buildFounderPersonJsonLd(locale: AppLocale): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#founder-baris-bagirlar`,
    name: FOUNDER_PROFILE.name,
    email: FOUNDER_PROFILE.email,
    jobTitle: FOUNDER_PROFILE.jobTitle[locale],
    url: absoluteLocalizedUrl(locale, "/about"),
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
    sameAs: buildFounderSameAs(),
  }) as JsonLdRecord;
}

export function buildAboutPageAuthorityJsonLd(locale: AppLocale): readonly JsonLdRecord[] {
  return [
    buildEntityHomeOrganizationJsonLd(locale),
    buildFounderPersonJsonLd(locale),
    buildAcademicAdvisoryBoardAboutPageJsonLd(locale),
  ];
}
