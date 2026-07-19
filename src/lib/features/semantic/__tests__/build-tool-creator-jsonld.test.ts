import { describe, expect, test } from "vitest";
import {
  buildToolPageCreatorJsonLd,
  buildToolReferenceCreatorPersonJsonLd,
} from "@/lib/features/semantic/build-tool-creator-jsonld";
import { toolReferenceCreatorJsonLdId } from "@/config/tool-reference-creator";

describe("buildToolReferenceCreatorPersonJsonLd", () => {
  test("emits stable Person schema with verified authority sameAs only", () => {
    const schema = buildToolReferenceCreatorPersonJsonLd();

    expect(schema["@type"]).toBe("Person");
    expect(schema["@id"]).toBe(toolReferenceCreatorJsonLdId());
    expect(schema.name).toBe("Prof. Dr. Neela Nataraj");
    expect(schema.url).toContain("iitb.ac.in");
    expect(schema.sameAs).toEqual(
      expect.arrayContaining([
        expect.stringContaining("math.iitb.ac.in/~neela"),
        expect.stringContaining("mathscinet.ams.org"),
      ]),
    );
    // Unverified social profiles must not appear in sameAs.
    expect(JSON.stringify(schema.sameAs)).not.toContain("linkedin.com");
    expect(JSON.stringify(schema.sameAs)).not.toContain("researchgate.net");
    expect(schema.worksFor).toEqual(
      expect.objectContaining({
        name: "Indian Institute of Technology Bombay",
      }),
    );
  });
});

describe("buildToolPageCreatorJsonLd", () => {
  test("links calculator WebApplication to reference creator", () => {
    const graphs = buildToolPageCreatorJsonLd({
      toolName: "Absenteeism Cost Calculator",
      description: "Estimate absenteeism cost.",
      urlPath: "/tools/generated/absenteeism-cost-calculator",
      locale: "en",
    });

    expect(graphs).toHaveLength(2);
    const app = graphs[1];
    expect(app.author).toEqual({
      "@type": "Person",
      "@id": toolReferenceCreatorJsonLdId(),
    });
    expect(app.creator).toEqual({
      "@type": "Person",
      "@id": toolReferenceCreatorJsonLdId(),
    });
    expect(app.url).toContain("/tools/generated/absenteeism-cost-calculator");
  });
});
