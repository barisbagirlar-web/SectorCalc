import nodemailer from "nodemailer";
import {
  buildCalculationReportEmailHtml,
  getCalculationReportEmailCopy,
} from "@/lib/email/calculation-report-email-copy";

export type SendCalculationReportEmailInput = {
  readonly to: string;
  readonly toolName: string;
  readonly locale: string;
  readonly pdfBuffer: Buffer;
  readonly fileName: string;
};

export type SendCalculationReportEmailResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: string };

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function resolveBrevoConfig(): { apiKey: string; fromEmail: string } | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail) {
    return null;
  }
  return { apiKey, fromEmail };
}

function resolveSmtpConfig(): {
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
} | null {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASSWORD?.trim();
  if (!user || !pass) {
    return null;
  }

  const host = process.env.EMAIL_SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_SMTP_PORT ?? "465");
  const secure = process.env.EMAIL_SMTP_SECURE !== "false";

  return { user, pass, host, port, secure };
}

async function sendViaBrevo(
  input: SendCalculationReportEmailInput,
): Promise<SendCalculationReportEmailResult> {
  const brevo = resolveBrevoConfig();
  if (!brevo) {
    return { ok: false, error: "email_not_configured" };
  }

  const copy = getCalculationReportEmailCopy(input.locale, input.toolName);

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": brevo.apiKey,
      },
      body: JSON.stringify({
        sender: { email: brevo.fromEmail, name: "SectorCalc" },
        to: [{ email: input.to }],
        subject: copy.subject,
        htmlContent: buildCalculationReportEmailHtml(input.locale, input.toolName),
        attachment: [
          {
            name: input.fileName,
            content: input.pdfBuffer.toString("base64"),
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: body.slice(0, 240) || "brevo_send_failed" };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "brevo_send_failed";
    return { ok: false, error: message };
  }
}

async function sendViaSmtp(
  input: SendCalculationReportEmailInput,
): Promise<SendCalculationReportEmailResult> {
  const smtp = resolveSmtpConfig();
  if (!smtp) {
    return { ok: false, error: "email_not_configured" };
  }

  const copy = getCalculationReportEmailCopy(input.locale, input.toolName);
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"SectorCalc" <${smtp.user}>`,
      to: input.to,
      subject: copy.subject,
      html: buildCalculationReportEmailHtml(input.locale, input.toolName),
      attachments: [
        {
          filename: input.fileName,
          content: input.pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "email_send_failed";
    return { ok: false, error: message };
  }
}

export async function sendCalculationReportEmail(
  input: SendCalculationReportEmailInput,
): Promise<SendCalculationReportEmailResult> {
  if (resolveBrevoConfig()) {
    return sendViaBrevo(input);
  }
  return sendViaSmtp(input);
}

export function isCalculationReportEmailConfigured(): boolean {
  return resolveBrevoConfig() !== null || resolveSmtpConfig() !== null;
}
