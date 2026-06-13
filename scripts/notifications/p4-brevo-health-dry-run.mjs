#!/usr/bin/env node
/**
 * P4 — Brevo alert dry-run (server-side only).
 * Never writes secrets to frontend. No email send unless P4_BREVO_SEND=true.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "../ai/load-env-local.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_PATH = path.join(ROOT, "scripts/.cache/p4-brevo-health-dry-run.json");
const TRUST_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");

loadEnvLocal();

function readTrustSummary() {
  if (!fs.existsSync(TRUST_REPORT_PATH)) {
    return {
      available: false,
      paymentEligible: null,
      formulaGateEligible: null,
      totalChecked: null,
    };
  }
  const report = JSON.parse(fs.readFileSync(TRUST_REPORT_PATH, "utf8"));
  return {
    available: true,
    paymentEligible: report.paymentEligible ?? null,
    formulaGateEligible: report.formulaGateEligible ?? null,
    totalChecked: report.totalChecked ?? null,
  };
}

function buildPayloadPreview() {
  const trust = readTrustSummary();
  const subject = "SectorCalc P4 Production Readiness Alert (dry-run)";
  const htmlContent = [
    "<p>SectorCalc P4 deploy guard dry-run notification.</p>",
    "<ul>",
    `<li>paymentEligible: ${trust.paymentEligible ?? "n/a"}</li>`,
    `<li>formulaGateEligible: ${trust.formulaGateEligible ?? "n/a"}</li>`,
    `<li>totalChecked: ${trust.totalChecked ?? "n/a"}</li>`,
    "</ul>",
    "<p>No action required — dry-run only.</p>",
  ].join("");

  return {
    endpoint: "https://api.brevo.com/v3/smtp/email",
    sender: {
      email: process.env.RUNTIME_ALERT_EMAIL_FROM?.trim() || "(not configured)",
      name: "SectorCalc P4 Guard",
    },
    to: [{ email: process.env.RUNTIME_ALERT_EMAIL_TO?.trim() || "(not configured)" }],
    subject,
    htmlContentPreview: htmlContent.slice(0, 500),
  };
}

async function main() {
  console.log("=== notify:p4-brevo-dry-run ===\n");

  const apiKey = process.env.BREVO_API_KEY?.trim();
  const mustNotSend = process.env.P4_BREVO_SEND !== "true";
  const payloadPreview = buildPayloadPreview();

  let report;

  if (!apiKey) {
    report = {
      generatedAt: new Date().toISOString(),
      status: "unavailable",
      apiKeyPresent: false,
      mustNotSend: true,
      blocker: null,
      sendAttempted: false,
      sendResult: null,
      payloadPreview,
      warnings: ["BREVO_API_KEY missing — dry-run only, not a deploy blocker"],
    };
  } else {
    let sendResult = null;
    let sendAttempted = false;

    if (!mustNotSend) {
      const from = process.env.RUNTIME_ALERT_EMAIL_FROM?.trim();
      const recipient = process.env.RUNTIME_ALERT_EMAIL_TO?.trim();
      if (!from || !recipient) {
        sendResult = { ok: false, reason: "alert_email_env_missing" };
      } else {
        sendAttempted = true;
        try {
          const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "api-key": apiKey,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              sender: { email: from, name: "SectorCalc P4 Guard" },
              to: [{ email: recipient }],
              subject: payloadPreview.subject,
              htmlContent: payloadPreview.htmlContentPreview,
            }),
          });
          sendResult = res.ok
            ? { ok: true, status: res.status }
            : { ok: false, reason: `brevo_http_${res.status}` };
        } catch (error) {
          sendResult = {
            ok: false,
            reason: error instanceof Error ? error.message : String(error),
          };
        }
      }
    }

    report = {
      generatedAt: new Date().toISOString(),
      status: "configured",
      apiKeyPresent: true,
      mustNotSend,
      blocker: null,
      sendAttempted,
      sendResult,
      payloadPreview,
      warnings: mustNotSend
        ? ["P4_BREVO_SEND not true — payload preview only"]
        : [],
    };
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`status: ${report.status}`);
  console.log(`apiKeyPresent: ${report.apiKeyPresent}`);
  console.log(`mustNotSend: ${report.mustNotSend}`);
  console.log(`blocker: ${report.blocker ?? "none"}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);

  if (report.warnings.length > 0) {
    for (const warning of report.warnings) {
      console.log(`WARN: ${warning}`);
    }
  }

  console.log("\nnotify:p4-brevo-dry-run PASS");
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(0);
});
