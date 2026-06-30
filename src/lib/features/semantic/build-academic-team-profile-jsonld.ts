import type { AcademicReference } from "@/lib/infrastructure/seo/academic-references";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/features/semantic/site-url";
import type { AppLocale } from "@/i18n/routing";

export function buildAcademicTeamProfileJsonLd(input: {
  readonly locale: AppLocale;
  readonly profile: AcademicReference;
  readonly profilePath: string;
  readonly roleLabel: string;
  readonly bio: string;
}): JsonLdRecord {
  const pageUrl = absoluteLocalizedUrl(input.locale, input.profilePath);
  const sameAs = [
    input.profile.mathSciNetUrl,
    ...(input.profile.profileUrl ? [input.profile.profileUrl] : []),
  ];

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profile`,
    name: input.profile.name,
    url: pageUrl,
    inLanguage: input.locale,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#${input.profile.id}`,
      name: input.profile.name,
      jobTitle: input.roleLabel,
      description: input.bio,
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: input.profile.affiliation,
      },
      sameAs,
      identifier: {
        "@type": "PropertyValue",
        propertyID: "MathSciNetAuthorID",
        value: String(input.profile.mrId),
      },
    },
  }) as JsonLdRecord;
}
