import { describe, expect, test } from "vitest";
import {
  academicReferences,
  DEFAULT_TOOL_CREATOR_MR_ID,
  getAcademicReferenceByMRId,
  getAcademicReferencesByRole,
} from "@/lib/seo/academic-references";
import { getAllAcademicReferences, getToolCreator } from "@/lib/seo/tool-reference-creator";
import { buildAcademicAdvisoryBoardAboutPageJsonLd } from "@/lib/semantic/build-entity-authority-jsonld";

describe("academicReferences", () => {
  test("lists five verified MathSciNet authorities", () => {
    expect(academicReferences).toHaveLength(5);
    for (const ref of academicReferences) {
      expect(ref.mathSciNetUrl).toContain("mathscinet.ams.org");
      expect(ref.mrId).toBeGreaterThan(0);
      expect(ref.affiliation.length).toBeGreaterThan(0);
    }
  });

  test("resolves default tool creator by MR ID", () => {
    const creator = getAcademicReferenceByMRId(DEFAULT_TOOL_CREATOR_MR_ID);
    expect(creator?.name).toBe("Prof. Dr. Neela Nataraj");
    expect(creator?.role).toBe("author");
  });

  test("groups advisors, authors and reviewers", () => {
    expect(getAcademicReferencesByRole("author")).toHaveLength(1);
    expect(getAcademicReferencesByRole("advisor")).toHaveLength(2);
    expect(getAcademicReferencesByRole("reviewer")).toHaveLength(2);
  });
});

describe("getToolCreator", () => {
  test("returns Neela Nataraj with MathSciNet URL", () => {
    const creator = getToolCreator("OEE Calculator");
    expect(creator.name).toBe("Prof. Dr. Neela Nataraj");
    expect(creator.mathSciNetUrl).toContain("613458");
    expect(creator.mrId).toBe(613458);
    expect(creator.orcidUrl).toBeNull();
  });

  test("getAllAcademicReferences mirrors canonical list", () => {
    expect(getAllAcademicReferences()).toEqual(academicReferences);
  });
});

describe("buildAcademicAdvisoryBoardAboutPageJsonLd", () => {
  test("emits AboutPage with author and contributor persons", () => {
    const jsonLd = buildAcademicAdvisoryBoardAboutPageJsonLd("en");
    expect(jsonLd["@type"]).toBe("AboutPage");
    expect(Array.isArray(jsonLd.author)).toBe(true);
    expect(Array.isArray(jsonLd.contributor)).toBe(true);
    expect((jsonLd.author as unknown[]).length).toBe(1);
    expect((jsonLd.contributor as unknown[]).length).toBe(4);
  });
});
