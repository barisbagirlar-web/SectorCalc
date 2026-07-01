export type TicketConfirmationVars = {
  ticketId: string;
  subject: string;
  priority: string;
};

export type AdminTicketAlertVars = {
  ticketId: string;
  userEmail: string;
  subject: string;
  priority: string;
  message: string;
};

export function buildTicketConfirmationHtml(vars: TicketConfirmationVars): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#F4F4F0;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <tr><td style="padding:32px 32px 0 32px;">
        <p style="font-size:13px;font-weight:600;color:#BD5D3A;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px 0;">SectorCalc Support</p>
        <h1 style="font-size:20px;font-weight:700;color:#1A1915;margin:0 0 16px 0;">Ticket Confirmed</h1>
        <p style="font-size:15px;color:#4A4843;line-height:1.5;margin:0 0 20px 0;">Your support ticket has been received. Our team will review it and respond as soon as possible.</p>
      </td></tr>
      <tr><td style="padding:0 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F4;border-radius:6px;padding:16px;">
          <tr><td style="padding:4px 0;"><span style="font-size:13px;font-weight:600;color:#1A1915;">Ticket ID:</span><span style="font-size:13px;color:#4A4843;margin-left:8px;">${vars.ticketId.slice(0, 8)}</span></td></tr>
          <tr><td style="padding:4px 0;"><span style="font-size:13px;font-weight:600;color:#1A1915;">Subject:</span><span style="font-size:13px;color:#4A4843;margin-left:8px;">${escapeHtml(vars.subject)}</span></td></tr>
          <tr><td style="padding:4px 0;"><span style="font-size:13px;font-weight:600;color:#1A1915;">Priority:</span><span style="font-size:13px;color:#4A4843;margin-left:8px;text-transform:capitalize;">${escapeHtml(vars.priority)}</span></td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 32px 32px 32px;">
        <p style="font-size:13px;color:#7A7872;line-height:1.5;margin:0;">You will receive a reply at this email address when an admin responds. If you did not submit this ticket, you can disregard this message.</p>
      </td></tr>
      <tr><td style="padding:16px 32px;border-top:1px solid #E8E6DE;">
        <p style="font-size:12px;color:#9A9892;margin:0;">SectorCalc.com &middot; Decision support tools</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

export function buildAdminTicketAlertHtml(vars: AdminTicketAlertVars): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#F4F4F0;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <tr><td style="padding:32px 32px 0 32px;">
        <p style="font-size:13px;font-weight:600;color:#BD5D3A;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px 0;">Admin Alert</p>
        <h1 style="font-size:20px;font-weight:700;color:#1A1915;margin:0 0 16px 0;">New Support Ticket</h1>
      </td></tr>
      <tr><td style="padding:0 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F4;border-radius:6px;padding:16px;">
          <tr><td style="padding:4px 0;"><span style="font-size:13px;font-weight:600;color:#1A1915;">Ticket ID:</span><span style="font-size:13px;color:#4A4843;margin-left:8px;">${vars.ticketId.slice(0, 8)}</span></td></tr>
          <tr><td style="padding:4px 0;"><span style="font-size:13px;font-weight:600;color:#1A1915;">From:</span><span style="font-size:13px;color:#4A4843;margin-left:8px;">${escapeHtml(vars.userEmail)}</span></td></tr>
          <tr><td style="padding:4px 0;"><span style="font-size:13px;font-weight:600;color:#1A1915;">Subject:</span><span style="font-size:13px;color:#4A4843;margin-left:8px;">${escapeHtml(vars.subject)}</span></td></tr>
          <tr><td style="padding:4px 0;"><span style="font-size:13px;font-weight:600;color:#1A1915;">Priority:</span><span style="font-size:13px;color:#4A4843;margin-left:8px;text-transform:capitalize;font-weight:700;">${escapeHtml(vars.priority)}</span></td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 32px 0 32px;">
        <p style="font-size:14px;color:#4A4843;line-height:1.6;margin:0;white-space:pre-wrap;">${escapeHtml(vars.message)}</p>
      </td></tr>
      <tr><td style="padding:24px 32px 32px 32px;">
        <a href="https://sectorcalc.com/admin/tickets/${vars.ticketId}" style="display:inline-block;padding:12px 24px;background-color:#1A1915;color:#FFFFFF;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">View ticket in admin panel</a>
      </td></tr>
      <tr><td style="padding:16px 32px;border-top:1px solid #E8E6DE;">
        <p style="font-size:12px;color:#9A9892;margin:0;">SectorCalc.com &middot; Admin notification &mdash; do not reply directly.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
