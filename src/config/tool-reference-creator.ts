import {
  DEFAULT_TOOL_CREATOR_MR_ID,
  getAcademicReferenceByMRId,
} from "@/lib/infrastructure/seo/academic-references";
import { SITE_URL } from "@/lib/features/semantic/site-url";

const defaultRef = getAcademicReferenceByMRId(DEFAULT_TOOL_CREATOR_MR_ID);

/** Reference creator shown on all calculator tool pages (E-E-A-T / author signal). */
export const TOOL_REFERENCE_CREATOR = {
  id: "neela-nataraj",
  name: defaultRef?.name ?? "Prof. Dr. Neela Nataraj",
  honorificPrefix: "Prof. Dr.",
  givenName: "Neela",
  familyName: "Nataraj",
  jobTitle: "Professor",
  mrId: defaultRef?.mrId ?? DEFAULT_TOOL_CREATOR_MR_ID,
  mathSciNetUrl:
    defaultRef?.mathSciNetUrl ??
    "https://mathscinet.ams.org/mathscinet/MRAuthorID/613458",
  affiliation: {
    "@type": "CollegeOrUniversity" as const,
    name: defaultRef?.affiliation ?? "Indian Institute of Technology Bombay",
    url: "https://www.iitb.ac.in/",
  },
  imagePath: "/img/creators/neela-nataraj.png",
  profileUrl: defaultRef?.profileUrl ?? "https://www.math.iitb.ac.in/~neela/",
  /** Set when a verified ORCID is available; omit rel=me head link when null. */
  orcidUrl: null as string | null,
  // sameAs is restricted to independently verified authority URLs only.
  // Faculty page (math.iitb.ac.in/~neela/) and MathSciNet MRAuthorID were live-verified.
  // Unverified social profiles (LinkedIn personal, ResearchGate) and third-party
  // posts ABOUT the person are intentionally omitted — no fabricated sameAs.
  sameAs: [
    defaultRef?.profileUrl ?? "https://www.math.iitb.ac.in/~neela/",
    defaultRef?.mathSciNetUrl ??
      "https://mathscinet.ams.org/mathscinet/MRAuthorID/613458",
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
