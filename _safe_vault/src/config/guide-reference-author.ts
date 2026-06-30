import { SITE_URL } from "@/lib/semantic/site-url";

/** Primary E-E-A-T author for authority guides and editorial content. */
export const GUIDE_REFERENCE_AUTHOR = {
  id: "wil-schilders",
  slug: "wil-schilders",
  name: "Prof. Dr. Wil Schilders",
  honorificPrefix: "Prof. Dr.",
  givenName: "Wil",
  familyName: "Schilders",
  role: {
    en: "ECMI President",
    tr: "ECMI Başkanı",
    de: "ECMI-Präsident",
    fr: "Président de l'ECMI",
    es: "Presidente de ECMI",
    ar: "رئيس ECMI",
  },
  profilePath: "/team/wil-schilders",
  externalProfileUrl: "https://www.ecmi-indmath.org/",
  sameAs: ["https://www.ecmi-indmath.org/"],
  knowsAbout: [
    "Industrial mathematics",
    "Numerical analysis",
    "Manufacturing cost modeling",
    "European Consortium for Mathematics in Industry",
  ],
} as const;

export function guideReferenceAuthorJsonLdId(): string {
  return `${SITE_URL}/#author-${GUIDE_REFERENCE_AUTHOR.id}`;
}

export function guideReferenceAuthorProfileUrl(locale: string): string {
  return `${SITE_URL}/${locale}${GUIDE_REFERENCE_AUTHOR.profilePath}`;
}
