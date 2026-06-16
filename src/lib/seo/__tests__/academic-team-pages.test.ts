import { describe, expect, test } from "vitest";
import {
  DYNAMIC_ACADEMIC_TEAM_SLUGS,
  getAcademicAdvisoryBoardMembers,
  getAcademicReferenceForTeamSlug,
  isDynamicAcademicTeamSlug,
  resolveAcademicTeamProfilePath,
} from "@/lib/seo/academic-team-pages";
import { buildAcademicTeamProfileJsonLd } from "@/lib/semantic/build-academic-team-profile-jsonld";

describe("academic team pages", () => {
  test("dynamic team slugs resolve to academic references", () => {
    for (const slug of DYNAMIC_ACADEMIC_TEAM_SLUGS) {
      expect(isDynamicAcademicTeamSlug(slug)).toBe(true);
      expect(getAcademicReferenceForTeamSlug(slug)?.id).toBe(slug);
    }
  });

  test("advisory board includes all five academics", () => {
    expect(getAcademicAdvisoryBoardMembers()).toHaveLength(5);
  });

  test("team profile paths exist for on-site profiles", () => {
    expect(resolveAcademicTeamProfilePath(getAcademicReferenceForTeamSlug("carsten-carstensen")!)).toBe(
      "/team/carsten-carstensen",
    );
    expect(resolveAcademicTeamProfilePath(getAcademicReferenceForTeamSlug("roger-fletcher")!)).toBe(
      "/team/roger-fletcher",
    );
    expect(resolveAcademicTeamProfilePath(getAcademicReferenceForTeamSlug("carol-woodward")!)).toBe(
      "/team/carol-woodward",
    );
  });

  test("buildAcademicTeamProfileJsonLd emits ProfilePage with MathSciNet identifier", () => {
    const profile = getAcademicReferenceForTeamSlug("carol-woodward");
    expect(profile).toBeDefined();
    const jsonLd = buildAcademicTeamProfileJsonLd({
      locale: "en",
      profile: profile!,
      profilePath: "/team/carol-woodward",
      roleLabel: "Academic advisor",
      bio: "Bio",
    });

    expect(jsonLd["@type"]).toBe("ProfilePage");
    const mainEntity = jsonLd.mainEntity as Record<string, unknown>;
    expect(mainEntity.name).toBe("Dr. Carol S. Woodward");
    const identifier = mainEntity.identifier as Record<string, unknown>;
    expect(identifier.propertyID).toBe("MathSciNetAuthorID");
    expect(identifier.value).toBe("632964");
  });
});
