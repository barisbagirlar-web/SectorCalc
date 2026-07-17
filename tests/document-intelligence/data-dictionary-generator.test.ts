/**
 * Data Dictionary Generator — Unit Tests
 */
import { describe, it, expect } from "vitest";
import { generateDataDictionaryHtml } from "@/lib/document-intelligence/workbook/data-dictionary-generator";
import type { DataDictionaryField } from "@/lib/document-intelligence/workbook/data-dictionary-generator";

const SAMPLE_FIELDS: DataDictionaryField[] = [
  {
    fieldName: "partNumberNormalized",
    businessMeaning: "Normalized part number after deterministic rules",
    sourceField: "partNumberRaw",
    normalizedField: "partNumberNormalized",
    dataType: "string",
    required: true,
    allowedValues: "Any alphanumeric string with safe symbols",
    validationRule: "Must be non-empty after normalization",
    blockingBehavior: "Blocks clean export when missing",
    sourceTraceabilityRule: "Maps to sourcePage/sourceTable/sourceRow",
    knownLimitations: "OEM number is not verified externally",
  },
];

describe("Data Dictionary Generator", () => {
  it("returns valid HTML string", () => {
    const html = generateDataDictionaryHtml(SAMPLE_FIELDS, "1.0.0");
    expect(html).toBeTruthy();
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(100);
  });

  it("HTML contains all required field names", () => {
    const html = generateDataDictionaryHtml(SAMPLE_FIELDS, "1.0.0");
    expect(html).toContain("partNumberNormalized");
  });

  it("HTML contains version string", () => {
    const html = generateDataDictionaryHtml(SAMPLE_FIELDS, "2.0.0");
    expect(html).toContain("2.0.0");
  });

  it("HTML is a complete document with DOCTYPE", () => {
    const html = generateDataDictionaryHtml(SAMPLE_FIELDS, "1.0.0");
    expect(html.trim().startsWith("<!DOCTYPE")).toBe(true);
    expect(html).toContain("</html>");
  });

  it("handles empty fields array gracefully", () => {
    const html = generateDataDictionaryHtml([], "1.0.0");
    expect(html).toBeTruthy();
    expect(html).toContain("DOCTYPE");
  });

  it("renders all field data values correctly", () => {
    const html = generateDataDictionaryHtml(SAMPLE_FIELDS, "1.0.0");
    // Field name rendered in <code> tag
    expect(html).toContain(">partNumberNormalized<");
    // Business meaning rendered in <td>
    expect(html).toContain("Normalized part number after deterministic rules");
    // Source field
    expect(html).toContain(">partNumberRaw<");
    // Normalized field
    expect(html).toContain(">partNumberNormalized<");
    // Data type value
    expect(html).toContain(">string<");
    // Required indicator
    expect(html).toContain(">Yes<");
    // Allowed values
    expect(html).toContain("Any alphanumeric string with safe symbols");
    // Validation rule
    expect(html).toContain("Must be non-empty after normalization");
    // Blocking behaviour
    expect(html).toContain("Blocks clean export when missing");
    // Source traceability
    expect(html).toContain("Maps to sourcePage/sourceTable/sourceRow");
    // Known limitations
    expect(html).toContain("OEM number is not verified externally");
  });

  it("escapes HTML in field values", () => {
    const fieldsWithHtml: DataDictionaryField[] = [{
      fieldName: "test<script>alert('xss')</script>",
      businessMeaning: "Test",
      sourceField: "raw",
      normalizedField: "norm",
      dataType: "string",
      required: false,
      allowedValues: "any",
      validationRule: "none",
      blockingBehavior: "none",
      sourceTraceabilityRule: "page/source",
      knownLimitations: "none",
    }];
    const html = generateDataDictionaryHtml(fieldsWithHtml, "1.0.0");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
