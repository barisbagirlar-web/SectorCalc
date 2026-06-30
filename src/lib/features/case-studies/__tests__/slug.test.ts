import { describe, expect, it } from "vitest";
import { slugifyCaseStudyTitle } from "@/lib/features/case-studies/slug";

describe("slugifyCaseStudyTitle", () => {
  it("lowercases and hyphenates latin titles", () => {
    expect(slugifyCaseStudyTitle("CNC OEE Improvement")).toBe("cnc-oee-improvement");
  });

  it("preserves Turkish characters", () => {
    expect(slugifyCaseStudyTitle("Kaynak Teknik Başarı Hikayesi")).toBe(
      "kaynak-teknik-basarı-hikayesi",
    );
  });
});
