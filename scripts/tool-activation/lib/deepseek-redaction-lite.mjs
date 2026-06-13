/** Minimal secret redaction for DeepSeek export payloads (mirrors deepseek-redaction-lite.ts). */

const SECRET_PATTERNS = [
  /xkeysib-[A-Za-z0-9_-]+/gi,
  /\bsk_live_[A-Za-z0-9]+\b/gi,
  /\bsk_test_[A-Za-z0-9]+\b/gi,
  /\bSTRIPE[_A-Z0-9]*\s*[:=]\s*[^\s"'`,]+/gi,
  /\bFIREBASE_PRIVATE_KEY\b[^\n]*/gi,
  /-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/gi,
  /\bBREVO_API_KEY\b\s*[:=]\s*[^\s"'`,]+/gi,
  /\bDEEPSEEK_API_KEY\b\s*[:=]\s*[^\s"'`,]+/gi,
  /\b[A-Z0-9_]*API_KEY\b\s*[:=]\s*[^\s"'`,]+/gi,
  /\b[A-Z0-9_]*SECRET\b\s*[:=]\s*[^\s"'`,]+/gi,
  /\b[A-Z0-9_]*TOKEN\b\s*[:=]\s*[^\s"'`,]+/gi,
  /\bwebhook[_\s-]?secret\b\s*[:=]\s*[^\s"'`,]+/gi,
  /\b(cs|pi|seti)_[A-Za-z0-9]{8,}\b/gi,
  /\bsess_[A-Za-z0-9]{8,}\b/gi,
];

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

export const REDACTION_MARKER = "[REDACTED_SECRET]";
export const REDACTED_EMAIL = "[REDACTED_EMAIL]";

export function redactSecretsLite(input, options = {}) {
  let output = input;
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, REDACTION_MARKER);
  }
  if (options.redactEmails !== false) {
    output = output.replace(EMAIL_PATTERN, REDACTED_EMAIL);
  }
  return output;
}

export function redactSecretsLiteDeep(value, options = {}) {
  if (typeof value === "string") {
    return redactSecretsLite(value, options);
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactSecretsLiteDeep(item, options));
  }
  if (value && typeof value === "object") {
    const next = {};
    for (const [key, nested] of Object.entries(value)) {
      next[key] = redactSecretsLiteDeep(nested, options);
    }
    return next;
  }
  return value;
}
