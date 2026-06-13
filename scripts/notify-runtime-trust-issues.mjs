#!/usr/bin/env node
/**
 * ERT-0 — Runtime trust alert notification skeleton.
 *
 * Reads scripts/.cache/runtime-trust-engine-report.json
 * Sends Brevo email and/or Slack webhook when env is configured.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const REPORT_PATH = join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");

function loadReport() {
  if (!existsSync(REPORT_PATH)) {
    return null;
  }
  return JSON.parse(readFileSync(REPORT_PATH, "utf8"));
}

function topIssues(items, limit = 10) {
  return items
    .filter((item) => !item.formulaGateEligible || !item.paymentEligible)
    .slice(0, limit);
}

async function sendBrevoEmail(subject, htmlContent) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const to = process.env.RUNTIME_ALERT_EMAIL_TO?.trim();
  const from = process.env.RUNTIME_ALERT_EMAIL_FROM?.trim();
  if (!apiKey || !to || !from) {
    return { ok: false, reason: "brevo_env_missing" };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: from, name: "SectorCalc Runtime Trust" },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    return { ok: false, reason: `brevo_http_${res.status}` };
  }
  return { ok: true };
}

async function sendSlack(message) {
  const webhook = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhook) {
    return { ok: false, reason: "slack_env_missing" };
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });

  if (!res.ok) {
    return { ok: false, reason: `slack_http_${res.status}` };
  }
  return { ok: true };
}

function buildSummary(report) {
  const risky = topIssues(report.items ?? []);
  const lines = risky.map(
    (item) =>
      `- ${item.slug} (${item.route}) → ${item.findings?.join(", ") || "no findings"} [${item.recommendedAction}]`,
  );
  const runUrl = process.env.GITHUB_RUN_URL?.trim();
  return {
    subject: "SectorCalc Runtime Trust Alert",
    body: [
      `Critical / ineligible tools: ${report.totalChecked - (report.formulaGateEligible ?? 0)}`,
      `formulaGateEligible: ${report.formulaGateEligible ?? 0}`,
      `paymentEligible: ${report.paymentEligible ?? 0}`,
      "",
      "Top issues:",
      ...lines,
      "",
      runUrl ? `Run: ${runUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

async function main() {
  const report = loadReport();
  if (!report) {
    console.log("notify:runtime-trust-issues — no report found, exit 0");
    process.exit(0);
  }

  const { subject, body } = buildSummary(report);
  console.log("=== Runtime Trust Notification ===");
  console.log(body);

  const brevo = await sendBrevoEmail(subject, `<pre>${body.replace(/</g, "&lt;")}</pre>`);
  const slack = await sendSlack(`${subject}\n${body}`);

  if (brevo.ok) {
    console.log("PASS: Brevo notification sent");
  } else {
    console.log(`SKIP: Brevo (${brevo.reason})`);
  }

  if (slack.ok) {
    console.log("PASS: Slack notification sent");
  } else {
    console.log(`SKIP: Slack (${slack.reason})`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(0);
});
