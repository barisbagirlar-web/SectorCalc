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

export async function sendCalculationReportEmail(
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

export function isCalculationReportEmailConfigured(): boolean {
  return resolveSmtpConfig() !== null;
}
