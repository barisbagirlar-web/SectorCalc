/**
 * Unit Tests: Import Readiness Checklist HTML Generator
 */
import { describe, it, expect } from "vitest";
import {
  generateImportChecklistHtml,
  SECTION_79_ITEMS,
} from "@/lib/document-intelligence/workbook/import-checklist-generator";
import type { ChecklistItem } from "@/lib/document-intelligence/workbook/import-checklist-generator";

const SAMPLE_VERSION = "1.0.0";

/* ── generateImportChecklistHtml ─────────────────────────────── */

describe("generateImportChecklistHtml", () => {
  it("returns a complete HTML document with DOCTYPE", () => {
    const html = generateImportChecklistHtml([], SAMPLE_VERSION);
    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain("<html lang=\"en\">");
    expect(html).toContain("</html>");
  });

  it("contains version string", () => {
    const html = generateImportChecklistHtml([], "2.3.0");
    expect(html).toContain("v2.3.0");
  });

  it("contains all checklist items from SECTION_79_ITEMS when called with empty array", () => {
    const html = generateImportChecklistHtml([], SAMPLE_VERSION);
    const expectedIds = [
      "DV-01", "DV-02", "DV-03", "DV-04", "DV-05", "DV-06",
      "DR-01", "DR-02", "DR-03", "DR-04", "DR-05", "DR-06",
      "MF-01", "MF-02", "MF-03", "MF-04", "MF-05", "MF-06", "MF-07", "MF-08",
      "RN-01", "RN-02", "RN-03", "RN-04", "RN-05", "RN-06",
      "EI-01", "EI-02", "EI-03", "EI-04", "EI-05",
      "SO-01", "SO-02", "SO-03", "SO-04", "SO-05",
    ];

    for (const id of expectedIds) {
      expect(html).toContain(id);
    }
  });

  it("contains all category headers", () => {
    const html = generateImportChecklistHtml([], SAMPLE_VERSION);
    const expectedCategories = [
      "Data Verification",
      "Duplicate Resolution",
      "Missing Field Completion",
      "Revision Normalisation",
      "Export & Pilot Import",
      "Sign-Off & Audit",
    ];

    for (const category of expectedCategories) {
      // & is HTML-escaped in the output
      const escapedCategory = category.replace(/&/g, "&amp;");
      expect(html).toContain(escapedCategory);
    }
  });

  it("renders items passed explicitly instead of defaults", () => {
    const customItems: ChecklistItem[] = [
      {
        id: "CUSTOM-01",
        category: "Custom Checks",
        description: "A custom checklist item",
        completed: false,
        required: true,
      },
    ];

    const html = generateImportChecklistHtml(customItems, "3.0.0");
    expect(html).toContain("CUSTOM-01");
    expect(html).toContain("A custom checklist item");
    expect(html).toContain("3.0.0");
    expect(html).not.toContain("DV-01");
  });

  it("handles empty items array gracefully (falls back to SECTION_79_ITEMS)", () => {
    const html = generateImportChecklistHtml([], SAMPLE_VERSION);
    // Should render the default SECTION_79_ITEMS
    expect(html).toContain("DV-01");
    expect(html).toContain("SO-05");
  });

  it("includes a generated timestamp", () => {
    const html = generateImportChecklistHtml([], SAMPLE_VERSION);
    expect(html).toMatch(/Generated: \d{4}-\d{2}-\d{2}T/);
  });

  it("shows Done status for completed items and Open for pending", () => {
    const mixedItems: ChecklistItem[] = [
      {
        id: "TEST-01",
        category: "Test",
        description: "Completed item",
        completed: true,
        required: true,
      },
      {
        id: "TEST-02",
        category: "Test",
        description: "Pending item",
        completed: false,
        required: true,
      },
    ];

    const html = generateImportChecklistHtml(mixedItems, SAMPLE_VERSION);
    expect(html).toContain("Done");
    expect(html).toContain("Open");
  });

  it("displays summary statistics in the summary bar", () => {
    const items: ChecklistItem[] = [
      { id: "A-01", category: "A", description: "Item 1", completed: true, required: true },
      { id: "A-02", category: "A", description: "Item 2", completed: false, required: true },
      { id: "A-03", category: "A", description: "Item 3", completed: true, required: false },
    ];

    const html = generateImportChecklistHtml(items, SAMPLE_VERSION);
    // 2/3 items completed, 1/2 required completed, 66% completion
    expect(html).toContain("1/2"); // required completed / total required (in stats)
    expect(html).toContain("2/3"); // total completed / total items (in stats)
  });

  it("escapes HTML in item descriptions to prevent XSS", () => {
    const maliciousItems: ChecklistItem[] = [
      {
        id: "XSS-01",
        category: "<script>alert('cat')</script>",
        description: "<img src=x onerror=alert('xss')>",
        completed: false,
        required: true,
      },
    ];

    const html = generateImportChecklistHtml(maliciousItems, SAMPLE_VERSION);
    // HTML-escaped — no raw tags, but the literal text remains (not sanitized)
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(&#39;cat&#39;)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(&#39;xss&#39;)&gt;");
  });

  it("categorises items with Required / Recommended labels", () => {
    const html = generateImportChecklistHtml([], SAMPLE_VERSION);
    expect(html).toContain("Required");
    expect(html).toContain("Recommended");
  });

  it("uses SECTION_79_ITEMS constant which has the correct number of items", () => {
    expect(SECTION_79_ITEMS.length).toBeGreaterThanOrEqual(35);
  });

  it("all SECTION_79_ITEMS have required properties", () => {
    for (const item of SECTION_79_ITEMS) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("category");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("completed");
      expect(item).toHaveProperty("required");
    }
  });
});
