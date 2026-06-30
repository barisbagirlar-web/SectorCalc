/** Minimum secret redaction before DeepSeek payloads (DSK-0A). */

const SECRET_PATTERNS: readonly RegExp[] = [
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

export type RedactSecretsLiteOptions = {
  readonly redactEmails?: boolean;
};

export function redactSecretsLite(
  input: string,
  options: RedactSecretsLiteOptions = {},
): string {
  let output = input;

  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, REDACTION_MARKER);
  }

  if (options.redactEmails !== false) {
    output = output.replace(EMAIL_PATTERN, REDACTED_EMAIL);
  }

  return output;
}

export function redactSecretsLiteDeep<T>(value: T, options?: RedactSecretsLiteOptions): T {
  if (typeof value === "string") {
    return redactSecretsLite(value, options) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSecretsLiteDeep(item, options)) as T;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const next: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(record)) {
      next[key] = redactSecretsLiteDeep(nested, options);
    }

    return next as T;
  }

  return value;
}
