import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const data = JSON.parse(readFileSync(join(ROOT, "scripts/audit_results_complete.json"), "utf8"));
const artifactDir = "/Users/macair1/.gemini/antigravity/brain/f41e4158-e04d-4060-acdd-eeca848508d7";

const engineFailures = data.engineFailures || [];
const trustAudits = data.trustAudits || [];

const totalChecked = trustAudits.length;
let readyFree = 0;
let reviewFree = 0;
let blockedFree = 0;

let readyPremium = 0;
let reviewPremium = 0;
let blockedPremium = 0;

const listBlocked: any[] = [];
const listReview: any[] = [];
const listReadyBoth: any[] = [];

for (const t of trustAudits) {
  if (t.free.status === "ready") readyFree++;
  else if (t.free.status === "review") reviewFree++;
  else if (t.free.status === "blocked") blockedFree++;

  if (t.premium.status === "ready") readyPremium++;
  else if (t.premium.status === "review") reviewPremium++;
  else if (t.premium.status === "blocked") blockedPremium++;

  if (t.free.status === "ready" && t.premium.status === "ready") {
    listReadyBoth.push(t);
  } else if (t.free.status === "blocked" || t.premium.status === "blocked") {
    listBlocked.push(t);
  } else {
    listReview.push(t);
  }
}

let md = `# Runtime Trust Audit & Calculation Security Analysis

This report presents a thorough and honest audit of all SectorCalc tools based on dynamic execution reliability and the static criteria defined by the **System Security Mesh (Runtime Trust Engine)**.

## Summary Metrics

| Dimension | Checked Tools | Ready | Review | Blocked |
| :--- | :---: | :---: | :---: | :---: |
| **Free Surface** | ${totalChecked} | ${readyFree} | ${reviewFree} | ${blockedFree} |
| **Premium Surface** | ${totalChecked} | ${readyPremium} | ${reviewPremium} | ${blockedPremium} |

---

## 🛑 Dynamic Calculation failures (Formula Execution Errors)

These calculators failed during raw dynamic formula execution (e.g. throwing Javascript errors, returning NaN or Infinity, or failing differential checks where inputs do not affect the output).

**Total Failures:** ${engineFailures.length}

${engineFailures.length === 0 ? "✅ **All registered schemas evaluated successfully and passed differential tests!**" : ""}
${engineFailures.map((f: any) => `- **${f.id}**: ${f.reason}`).join("\n")}

---

## 🚫 Blocked Tools (Status: Blocked)

Tools categorized as \`blocked\` fail one or more fundamental system requirements (such as missing active routing paths, missing form schemas, or critical failures).

**Total Blocked Tools:** ${listBlocked.length}

Here is a sample of blocked tools and their findings:

| Tool Slug | Free Surface | Premium Surface | Key Findings / Block Reason |
| :--- | :---: | :---: | :--- |
${listBlocked.slice(0, 50).map((t: any) => {
  const findings = Array.from(new Set([...t.free.findings, ...t.premium.findings])).join(", ");
  return `| \`${t.slug}\` | \`${t.free.status}\` | \`${t.premium.status}\` | ${findings} |`;
}).join("\n")}

${listBlocked.length > 50 ? `*...and ${listBlocked.length - 50} more blocked tools. Check the full JSON details.*` : ""}

---

## ⚠️ Tools Requiring Review (Status: Review)

These tools are functional but have findings like generic input guides, missing input validation ranges, or manual review overrides that prevent them from displaying the Approved badge or taking live payment.

**Total Review Tools:** ${listReview.length}

| Tool Slug | Free Surface Findings | Premium Surface Findings |
| :--- | :--- | :--- |
${listReview.map((t: any) => {
  return `| \`${t.slug}\` | ${t.free.findings.join(", ") || "None"} | ${t.premium.findings.join(", ") || "None"} |`;
}).join("\n")}

---

## ✅ Fully Eligible Tools (Status: Ready on Both Surfaces)

These tools are verified as safe for calculation, formula gate badges, and payment/pro activation.

**Total Ready Tools:** ${listReadyBoth.length}

| Tool Slug | Status |
| :--- | :---: |
${listReadyBoth.map((t: any) => `| \`${t.slug}\` | \`ready\` |`).join("\n")}

`;

writeFileSync(join(artifactDir, "trust_audit_report.md"), md, "utf8");
console.log("Analysis complete. Written to trust_audit_report.md.");
console.log(`Summary: Blocked=${listBlocked.length}, Review=${listReview.length}, Ready=${listReadyBoth.length}`);
