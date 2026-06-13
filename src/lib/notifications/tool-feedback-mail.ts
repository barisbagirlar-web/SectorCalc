/**
 * P4C — Tool feedback transactional email via Brevo (server-side only).
 */

export type ToolFeedbackTier = "free" | "premium" | "premium-schema" | "unknown";

export type ToolFeedbackMailInput = {
  readonly toolSlug: string;
  readonly toolTier: ToolFeedbackTier;
  readonly locale: string;
  readonly pageUrl: string;
  readonly message: string;
  readonly email?: string;
  readonly issueType?: string;
  readonly userAgent?: string;
  readonly resultSnapshot?: unknown;
  readonly timestamp: string;
};

export type ToolFeedbackMailEnv = {
  readonly apiKey: string;
  readonly fromEmail: string;
  readonly toEmail: string;
  readonly replyToEmail?: string;
};

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const RESULT_SNAPSHOT_MAX_CHARS = 4_000;

export function getToolFeedbackMailEnv(): ToolFeedbackMailEnv | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  const toEmail = process.env.FEEDBACK_TO_EMAIL?.trim();
  if (!apiKey || !fromEmail || !toEmail) {
    return null;
  }
  const replyToEmail = process.env.FEEDBACK_REPLY_TO_EMAIL?.trim();
  return {
    apiKey,
    fromEmail,
    toEmail,
    replyToEmail: replyToEmail || undefined,
  };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/\0/g, "").trim();
}

export function truncateResultSnapshot(snapshot: unknown): string | undefined {
  if (snapshot === undefined || snapshot === null) {
    return undefined;
  }
  let serialized: string;
  try {
    serialized =
      typeof snapshot === "string" ? snapshot : JSON.stringify(snapshot, null, 2);
  } catch {
    return undefined;
  }
  const cleaned = stripHtmlTags(serialized);
  if (!cleaned) {
    return undefined;
  }
  if (cleaned.length <= RESULT_SNAPSHOT_MAX_CHARS) {
    return cleaned;
  }
  return `${cleaned.slice(0, RESULT_SNAPSHOT_MAX_CHARS)}… [truncated]`;
}

function buildMailBodies(input: ToolFeedbackMailInput): { textContent: string; htmlContent: string } {
  const lines: string[] = [
    "SectorCalc tool feedback",
    "",
    `Tool slug: ${input.toolSlug}`,
    `Tier: ${input.toolTier}`,
    `Locale: ${input.locale}`,
    `Page URL: ${input.pageUrl}`,
    `Timestamp: ${input.timestamp}`,
  ];

  if (input.issueType) {
    lines.push(`Feedback type: ${input.issueType}`);
  }
  if (input.email) {
    lines.push(`Reporter email: ${input.email}`);
  }
  if (input.userAgent) {
    lines.push(`User agent: ${input.userAgent}`);
  }

  lines.push("", "Message:", stripHtmlTags(input.message));

  const snapshot = truncateResultSnapshot(input.resultSnapshot);
  if (snapshot) {
    lines.push("", "Result snapshot:", snapshot);
  }

  const textContent = lines.join("\n");
  const htmlContent = `<pre>${escapeHtml(textContent)}</pre>`;
  return { textContent, htmlContent };
}

export async function sendToolFeedbackMail(
  input: ToolFeedbackMailInput,
  env: ToolFeedbackMailEnv,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const subject = `[SectorCalc Feedback] ${input.toolSlug}`;
  const { textContent, htmlContent } = buildMailBodies(input);

  const payload: Record<string, unknown> = {
    sender: { email: env.fromEmail, name: "SectorCalc Feedback" },
    to: [{ email: env.toEmail }],
    subject,
    textContent,
    htmlContent,
  };

  if (input.email) {
    payload.replyTo = { email: input.email };
  } else if (env.replyToEmail) {
    payload.replyTo = { email: env.replyToEmail };
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": env.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { ok: false, reason: `brevo_http_${response.status}` };
  }

  return { ok: true };
}
