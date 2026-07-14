/**
 * Unit Tests: Upload Consent / Privacy Attestation
 */
import { describe, it, expect } from "vitest";
import {
  generateConsentFormHtml,
  validateConsent,
} from "@/lib/document-intelligence/security/upload-consent";

const VALID_CONSENT = {
  consentVersion: "1.0.0",
  consentTimestamp: "2026-07-14T12:00:00.000Z",
  userId: "user_abc123",
  jobId: "job_def456",
  authorizedToUpload: true,
  prohibitedDataAccepted: true,
  processingAccepted: true,
  retentionPolicyUnderstood: true,
  outputRequiresReview: true,
  productVersion: "1.2.3",
};

describe("generateConsentFormHtml", () => {
  it("returns valid HTML with DOCTYPE declaration", () => {
    const html = generateConsentFormHtml("1.2.3");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html lang=\"en\">");
    expect(html).toContain("</html>");
  });

  it("contains the product version badge", () => {
    const html = generateConsentFormHtml("2.0.0-beta");
    expect(html).toContain("v2.0.0-beta");
  });

  it("contains all five consent checkbox labels", () => {
    const html = generateConsentFormHtml("1.0.0");
    expect(html).toContain("I am authorised to upload this document");
    expect(html).toContain("No prohibited data included");
    expect(html).toContain("Accept cloud processing");
    expect(html).toContain("Retention policy understood");
    expect(html).toContain("Output requires manual review");
  });

  it("contains all five data-consent-field attributes", () => {
    const html = generateConsentFormHtml("1.0.0");
    expect(html).toContain('data-consent-field="authorizedToUpload"');
    expect(html).toContain('data-consent-field="prohibitedDataAccepted"');
    expect(html).toContain('data-consent-field="processingAccepted"');
    expect(html).toContain('data-consent-field="retentionPolicyUnderstood"');
    expect(html).toContain('data-consent-field="outputRequiresReview"');
  });

  it("contains Accept and Cancel buttons", () => {
    const html = generateConsentFormHtml("1.0.0");
    expect(html).toContain("Accept &amp; Upload");
    expect(html).toContain("Cancel");
  });

  it("contains the embedded consent-collection script", () => {
    const html = generateConsentFormHtml("1.0.0");
    expect(html).toContain("sectorcalc-consent-accepted");
    expect(html).toContain("sectorcalc-consent-cancelled");
  });

  it("escapes HTML in the product version to prevent injection", () => {
    const html = generateConsentFormHtml("<script>alert('xss')</script>");
    // The document itself contains <script> tags for its embedded JS, so we check
    // that the injected value is escaped within the product badge and consent JS.
    expect(html).toContain("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert('xss')</script>");
  });

  it("includes a generated timestamp in ISO-8601 format", () => {
    const html = generateConsentFormHtml("1.0.0");
    // The timestamp is embedded in the subtitle paragraph
    expect(html).toMatch(/Generated: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("includes the responsive viewport meta tag", () => {
    const html = generateConsentFormHtml("1.0.0");
    expect(html).toContain("name=\"viewport\"");
  });

  it("renders the privacy notice block", () => {
    const html = generateConsentFormHtml("1.0.0");
    expect(html).toContain("This consent is required before any document can be uploaded");
  });
});

describe("validateConsent", () => {
  it("accepts valid complete consent data", () => {
    const result = validateConsent(VALID_CONSENT);
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects empty data", () => {
    const result = validateConsent({});
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects data with missing consentVersion", () => {
    const { consentVersion, ...partial } = VALID_CONSENT;
    const result = validateConsent(partial);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("consentVersion"))).toBe(true);
  });

  it("rejects data with missing userId", () => {
    const { userId, ...partial } = VALID_CONSENT;
    const result = validateConsent(partial);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("userId"))).toBe(true);
  });

  it("rejects data with missing jobId", () => {
    const { jobId, ...partial } = VALID_CONSENT;
    const result = validateConsent(partial);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("jobId"))).toBe(true);
  });

  it("rejects false boolean fields (consent not explicitly accepted)", () => {
    const data = { ...VALID_CONSENT, authorizedToUpload: false };
    const result = validateConsent(data);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some((e) => e.includes("authorizedToUpload") && e.includes("explicitly accepted")),
    ).toBe(true);
  });

  it("rejects when prohibitedDataAccepted is false", () => {
    const data = { ...VALID_CONSENT, prohibitedDataAccepted: false };
    const result = validateConsent(data);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some((e) => e.includes("prohibitedDataAccepted") && e.includes("explicitly accepted")),
    ).toBe(true);
  });

  it("rejects when processingAccepted is false", () => {
    const data = { ...VALID_CONSENT, processingAccepted: false };
    const result = validateConsent(data);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some((e) => e.includes("processingAccepted") && e.includes("explicitly accepted")),
    ).toBe(true);
  });

  it("rejects non-boolean value for a boolean field", () => {
    const data = { ...VALID_CONSENT, authorizedToUpload: "yes" };
    const result = validateConsent(data);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("must be boolean"))).toBe(true);
  });

  it("rejects non-string value for a string field", () => {
    const data = { ...VALID_CONSENT, userId: 12345 };
    const result = validateConsent(data);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("must be string"))).toBe(true);
  });

  it("rejects empty string for required string field", () => {
    const data = { ...VALID_CONSENT, userId: "   " };
    const result = validateConsent(data);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("userId") && e.includes("not be empty"))).toBe(true);
  });

  it("rejects invalid ISO-8601 consentTimestamp", () => {
    const data = { ...VALID_CONSENT, consentTimestamp: "not-a-date" };
    const result = validateConsent(data);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("consentTimestamp") && e.includes("ISO-8601"))).toBe(true);
  });

  it("reports multiple validation errors at once", () => {
    const result = validateConsent({
      consentVersion: "1.0.0",
      consentTimestamp: "invalid-date",
      authorizedToUpload: "not-boolean",
    });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
