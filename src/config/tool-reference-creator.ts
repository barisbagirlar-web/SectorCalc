import { SITE_URL } from "@/lib/semantic/site-url";

/** Reference creator shown on all calculator tool pages (E-E-A-T / author signal). */
export const TOOL_REFERENCE_CREATOR = {
  id: "neela-nataraj",
  name: "Prof. Dr. Neela Nataraj",
  honorificPrefix: "Prof. Dr.",
  givenName: "Neela",
  familyName: "Nataraj",
  jobTitle: "Professor",
  affiliation: {
    "@type": "CollegeOrUniversity" as const,
    name: "Indian Institute of Technology Bombay",
    url: "https://www.iitb.ac.in/",
  },
  imagePath: "/img/creators/neela-nataraj.png",
  profileUrl:
    "https://www.linkedin.com/posts/indian-institute-of-technology-bombay_prof-neela-nataraj-is-elected-to-be-part-activity-7275006741744939008-w0un/",
  sameAs: [
    "https://www.linkedin.com/posts/indian-institute-of-technology-bombay_prof-neela-nataraj-is-elected-to-be-part-activity-7275006741744939008-w0un/",
  ],
  knowsAbout: [
    "Industrial engineering",
    "Operations research",
    "Manufacturing analytics",
    "Decision analysis",
  ],
} as const;

export function toolReferenceCreatorJsonLdId(): string {
  return `${SITE_URL}/#creator-${TOOL_REFERENCE_CREATOR.id}`;
}
