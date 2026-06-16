import { BRAND_ASSETS } from "@/config/brand";
import {
  FOUNDER_PROFILE,
  buildFounderSameAs,
  buildOrganizationSameAs,
} from "@/config/knowledge-graph";
import { ORGANIZATION_TRUST, organizationDescriptionForLocale } from "@/config/organization-trust";
import type { AppLocale } from "@/i18n/routing";
import { academicReferences } from "@/lib/seo/academic-references";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { absoluteImageUrl, absoluteLocalizedUrl, SITE_URL } from "@/lib/semantic/site-url";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const FOUNDER_ID = `${SITE_URL}/#founder-baris-bagirlar`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function academicPersonNode(ref: (typeof academicReferences)[number]): JsonLdRecord {
  const sameAs = ref.profileUrl ? [ref.mathSciNetUrl, ref.profileUrl] : [ref.mathSciNetUrl];

  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#${ref.id}`,
    name: ref.name,
    affiliation: {
      "@type": "CollegeOrUniversity",
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

/** Central @graph entity mesh for Organization, founder, advisors and WebSite. */
export function buildEntityGraph(locale: AppLocale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: ORGANIZATION_TRUST.displayName,
        url: SITE_URL,
        logo: absoluteImageUrl(BRAND_ASSETS.logo.default),
        description: organizationDescriptionForLocale(locale),
        email: ORGANIZATION_TRUST.email,
        sameAs: buildOrganizationSameAs(),
        founder: { "@id": FOUNDER_ID },
        address: {
          "@type": "PostalAddress",
          streetAddress: ORGANIZATION_TRUST.address.streetAddress,
          addressLocality: ORGANIZATION_TRUST.address.addressLocality,
          addressCountry: "TR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: ORGANIZATION_TRUST.phone,
          email: ORGANIZATION_TRUST.email,
          contactType: ORGANIZATION_TRUST.contactType,
        },
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: FOUNDER_PROFILE.name,
        email: FOUNDER_PROFILE.email,
        jobTitle: FOUNDER_PROFILE.jobTitle[locale] ?? FOUNDER_PROFILE.jobTitle.en,
        url: absoluteLocalizedUrl(locale, "/about"),
        worksFor: { "@id": ORGANIZATION_ID },
        sameAs: buildFounderSameAs(),
      },
      ...academicReferences.map(academicPersonNode),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: ORGANIZATION_TRUST.displayName,
        url: absoluteLocalizedUrl(locale, "/"),
        inLanguage: locale,
        publisher: { "@id": ORGANIZATION_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absoluteLocalizedUrl(locale, "/free-tools?q={search_term_string}"),
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }) as JsonLdRecord;
}

export const entityGraph = buildEntityGraph("en");
