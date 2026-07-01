import {
  buildTicketConfirmationHtml,
  buildAdminTicketAlertHtml,
  type TicketConfirmationVars,
  type AdminTicketAlertVars,
} from "@/lib/infrastructure/email/ticket-email-templates";

type SendEmailResult = { ok: true } | { ok: false; error: string };

function resolveBrevoConfig(): { apiKey: string; fromEmail: string } | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail) return null;
  return { apiKey, fromEmail };
}

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

async function sendViaBrevo(
  to: string,
  subject: string,
  htmlContent: string,
): Promise<SendEmailResult> {
  const brevo = resolveBrevoConfig();
  if (!brevo) return { ok: false, error: "email_not_configured" };

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
        to: [{ email: to }],
        subject,
        htmlContent,
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

export async function sendTicketConfirmationEmail(
  to: string,
  vars: TicketConfirmationVars,
): Promise<SendEmailResult> {
  const subject = `[SectorCalc] Ticket #${vars.ticketId.slice(0, 8)} Received`;
  const html = buildTicketConfirmationHtml(vars);
  return sendViaBrevo(to, subject, html);
}

export async function sendAdminTicketAlertEmail(
  to: string,
  vars: AdminTicketAlertVars,
): Promise<SendEmailResult> {
  const subject = `[ALERT] New Ticket #${vars.ticketId.slice(0, 8)} - ${vars.priority}`;
  const html = buildAdminTicketAlertHtml(vars);
  return sendViaBrevo(to, subject, html);
}

export function resolveAdminSupportEmail(): string | null {
  return process.env.ADMIN_SUPPORT_EMAIL?.trim() ?? null;
}
