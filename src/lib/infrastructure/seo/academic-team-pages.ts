import {
  academicReferences,
  getAcademicReferenceById,
  type AcademicReference,
  type AcademicReferenceRole,
} from "@/lib/infrastructure/seo/academic-references";

/** Slugs served by `src/app/[l_ocale]/team/[slug]/page.tsx`. */
export const DYNAMIC_ACADEMIC_TEAM_SLUGS = [
  "carsten-carstensen",
  "roger-fletcher",
  "carol-woodward",
] as const;

export type DynamicAcademicTeamSlug = (typeof DYNAMIC_ACADEMIC_TEAM_SLUGS)[number];

const DYNAMIC_SLUG_SET = new Set<string>(DYNAMIC_ACADEMIC_TEAM_SLUGS);

export function isDynamicAcademicTeamSlug(slug: string): slug is DynamicAcademicTeamSlug {
  return DYNAMIC_SLUG_SET.has(slug);
}

export function resolveAcademicTeamProfilePath(reference: AcademicReference): string | null {
  if (reference.id === "neela-nataraj") {
    return null;
  }
  return `/team/${reference.id}`;
}

export function getAcademicAdvisoryBoardMembers(): AcademicReference[] {
  return [...academicReferences];
}

export function getAcademicReferenceForTeamSlug(slug: string): AcademicReference | undefined {
  if (!isDynamicAcademicTeamSlug(slug)) {
    return undefined;
  }
  return getAcademicReferenceById(slug);
}

export type AcademicTeamTranslationKeys = {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly role: string;
  readonly bio: string;
  readonly externalProfile: string;
};

export function academicTeamTranslationKeys(id: DynamicAcademicTeamSlug): AcademicTeamTranslationKeys {
  switch (id) {
    case "carsten-carstensen":
      return {
        metaTitle: "teamCarstenMetaTitle",
        metaDescription: "teamCarstenMetaDescription",
        role: "teamCarstenRole",
        bio: "teamCarstenBio",
        externalProfile: "teamCarstenExternalProfile",
      };
    case "roger-fletcher":
      return {
        metaTitle: "teamRogerMetaTitle",
        metaDescription: "teamRogerMetaDescription",
        role: "teamRogerRole",
        bio: "teamRogerBio",
        externalProfile: "teamRogerExternalProfile",
      };
    case "carol-woodward":
      return {
        metaTitle: "teamCarolMetaTitle",
        metaDescription: "teamCarolMetaDescription",
        role: "teamCarolRole",
        bio: "teamCarolBio",
        externalProfile: "teamCarolExternalProfile",
      };
    default: {
      const exhaustive: never = id;
      throw new Error(`Missing translation keys for team slug: ${exhaustive}`);
    }
  }
}

export function academicRoleTranslationKey(role: AcademicReferenceRole | undefined): string {
  switch (role) {
    case "author":
      return "academicRoleAuthor";
    case "advisor":
      return "academicRoleAdvisor";
    case "reviewer":
      return "academicRoleReviewer";
    default:
      return "academicRoleAdvisor";
  }
}
