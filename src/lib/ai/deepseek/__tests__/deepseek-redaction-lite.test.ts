import { describe, expect, test, vi, afterEach } from "vitest";
import {
  REDACTION_MARKER,
  REDACTED_EMAIL,
  redactSecretsLite,
  redactSecretsLiteDeep,
} from "@/lib/ai/deepseek/deepseek-redaction-lite";
import { sanitizeDeepSeekErrorMessage } from "@/lib/ai/deepseek/deepseek-client";

describe("deepseek-redaction-lite", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("redacts secret patterns", () => {
    const payload = [
      "DEEPSEEK_API_KEY=super-secret-value",
      "sk_live_abc123",
      "sk_test_xyz789",
      "STRIPE_SECRET=stripe-value",
      "BREVO_API_KEY=mail-key",
      "webhook secret=whsec_test",
      "cs_test_1234567890abcdef",
    ].join("\n");

    const redacted = redactSecretsLite(payload);
    expect(redacted).not.toContain("super-secret-value");
    expect(redacted).not.toContain("sk_live_abc123");
    expect(redacted).not.toContain("stripe-value");
    expect(redacted).toContain(REDACTION_MARKER);
  });

  test("redacts emails by default", () => {
    const redacted = redactSecretsLite("Contact ops@sectorcalc.com for details.");
    expect(redacted).toContain(REDACTED_EMAIL);
    expect(redacted).not.toContain("ops@sectorcalc.com");
  });

  test("can skip email redaction", () => {
    const redacted = redactSecretsLite("ops@sectorcalc.com", { redactEmails: false });
    expect(redacted).toContain("ops@sectorcalc.com");
  });

  test("deep redaction traverses nested payloads", () => {
    const redacted = redactSecretsLiteDeep({
      note: "TOKEN=abc123",
      nested: [{ secret: "API_KEY=xyz" }],
    });

    expect(JSON.stringify(redacted)).not.toContain("abc123");
    expect(JSON.stringify(redacted)).not.toContain("xyz");
  });

  test("API key never appears in sanitized error messages", () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "ds-test-key-never-logged");

    const sanitized = sanitizeDeepSeekErrorMessage(
      "Authorization failed for ds-test-key-never-logged with TOKEN=abc",
    );

    expect(sanitized).not.toContain("ds-test-key-never-logged");
    expect(sanitized).toContain(REDACTION_MARKER);
  });
});
