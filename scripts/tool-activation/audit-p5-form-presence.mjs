#!/usr/bin/env node
/**
 * P5B — Tool form presence audit (fetch-based).
 * Does not deploy. Optional live fetch when SECTORCALC_QA_BASE_URL is set.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_JSON_PATH = path.join(ROOT, "scripts/.cache/p5-form-presence-audit-report.json");
const REPORT_MD_PATH = path.join(ROOT, "docs/p5-form-presence-audit.md");

const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";

const ROUTES = [
  "/tr/tools/free/machine-time-calculator",
  "/tr/tools/free/project-cost-calculator",
  "/tr/tools/free/cleaning-cost-calculator",
  "/tr/tools/premium-schema/cnc-oee-loss",
  `/tr/tools/premium/${PROBLEM_SLUG}`,
];

const FORM_MARKERS = [
  { id: "form_tag", pattern: /<form[\s>]/i },
  { id: "input_tag", pattern: /<input[\s>]/i },
  { id: "button_tag", pattern: /<button[\s>]/i },
  { id: "hesapla", pattern: /\bHesapla\b/i },
  { id: "calculate", pattern: /\bCalculate\b/i },
  { id: "analysis", pattern: /\b(Analiz|analysis)\b/i },
  { id: "result", pattern: /\b(result|sonuç|Sonuç)\b/i },
  { id: "data_testid_tool_form", pattern: /data-testid="tool-form"/ },
  { id: "data_testid_calculator_form", pattern: /data-testid="calculator-form"/ },
  { id: "data_testid_smart_form", pattern: /data-testid="smart-form"/ },
  { id: "data_calculation_form", pattern: /data-calculation-form="true"/ },
  { id: "data_smart_form_shell", pattern: /data-smart-form-shell="true"/ },
];

const CALCULATOR_FORM_MARKERS = [
  /data-calculation-form="true"/,
  /data-testid="tool-form"/,
  /data-testid="calculator-form"/,
  /data-testid="smart-form"/,
  /data-smart-form-shell="true"/,
  /data-calculation-form-shell="true"/,
];

const SAFE_STATE_MARKERS = [
  /data-runtime-trust-safe-state="true"/,
  /Hesaplama kalite kontrolünde/i,
];

const blockers = [];

function addBlocker(message) {
  if (!blockers.includes(message)) {
    blockers.push(message);
  }
}

function stripScripts(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function scanMarkers(html) {
  const visible = stripScripts(html);
  const found = [];
  for (const marker of FORM_MARKERS) {
    if (marker.pattern.test(visible) || marker.pattern.test(html)) {
      found.push(marker.id);
    }
  }
  return { visible, found };
}

function hasCalculatorFormMarker(html) {
  return CALCULATOR_FORM_MARKERS.some((pattern) => pattern.test(html));
}

function hasSafeState(html) {
  const visible = stripScripts(html);
  return SAFE_STATE_MARKERS.some((pattern) => pattern.test(visible) || pattern.test(html));
}

function hasInputAndButton(visible) {
  return /<input[\s>]/i.test(visible) && /<button[\s>]/i.test(visible);
}

function isProblemSlugRoute(route) {
  return route.includes(PROBLEM_SLUG);
}

async function auditRoute(baseUrl, route) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const result = {
    route,
    url,
    status: null,
    ok: false,
    emptyBody: false,
    formMarkers: [],
    hasCalculatorFormMarker: false,
    hasInputButton: false,
    hasSafeState: false,
    manualBrowserRequired: false,
    notes: [],
    error: null,
  };

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "SectorCalc-P5-Form-Presence/1.0" },
      redirect: "follow",
    });
    result.status = response.status;
    const html = await response.text();
    result.emptyBody = html.trim().length === 0;

    if (response.status !== 200) {
      addBlocker(`route_http_${response.status}:${route}`);
      result.notes.push(`HTTP ${response.status}`);
      return result;
    }

    if (result.emptyBody) {
      addBlocker(`route_empty_body:${route}`);
      result.notes.push("empty body");
      return result;
    }

    const scan = scanMarkers(html);
    result.formMarkers = scan.found;
    result.hasCalculatorFormMarker = hasCalculatorFormMarker(html);
    result.hasInputButton = hasInputAndButton(scan.visible);
    result.hasSafeState = hasSafeState(html);

    if (isProblemSlugRoute(route)) {
      if (!result.hasSafeState) {
        addBlocker(`problem_slug_missing_safe_state:${route}`);
        result.notes.push("expected locked safe state");
      }
      if (result.hasCalculatorFormMarker) {
        addBlocker(`problem_slug_calculator_form_visible:${route}`);
        result.notes.push("calculator form marker must not appear");
      }
      result.ok = result.hasSafeState && !result.hasCalculatorFormMarker;
      return result;
    }

    if (!result.hasCalculatorFormMarker && !result.hasInputButton) {
      const hasShellOnly =
        /data-calculation-form-shell="true"/.test(html) &&
        !/data-calculation-form="true"/.test(html);
      if (hasShellOnly) {
        result.manualBrowserRequired = true;
        result.notes.push("SSR shell marker only — confirm hydrated form in browser");
        result.ok = true;
        return result;
      }
      addBlocker(`missing_form_marker:${route}`);
      result.notes.push("no calculator form marker or input/button in SSR HTML");
      return result;
    }

    if (!result.hasCalculatorFormMarker && result.hasInputButton) {
      result.manualBrowserRequired = true;
      result.notes.push("input/button present but calculator marker missing — verify client hydration");
    }

    result.ok = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.error = message;
    addBlocker(`route_fetch_error:${route}:${message}`);
  }

  return result;
}

function renderMarkdown(report) {
  const rows = report.routeResults
    .map((row) => {
      const marker =
        row.formMarkers.length > 0 ? row.formMarkers.slice(0, 4).join(", ") : "none";
      const inputButton = row.hasInputButton ? "yes" : "no";
      const notes = row.notes.length > 0 ? row.notes.join("; ") : "—";
      return `| \`${row.route}\` | ${row.status ?? "n/a"} | ${marker} | ${inputButton} | ${notes} |`;
    })
    .join("\n");

  const missingRoutes = report.routeResults
    .filter((row) => !row.ok && !isProblemSlugRoute(row.route))
    .map((row) => row.route);

  const manualRoutes = report.routeResults
    .filter((row) => row.manualBrowserRequired)
    .map((row) => row.route);

  return [
    "# P5 Form Presence Audit",
    "",
    "## Summary",
    "",
    `* Status: \`${report.status}\``,
    "* Deploy executed: no",
    `* Routes checked: ${report.routeResults.length}`,
    `* Form markers found: ${report.formMarkerRouteCount}`,
    `* Missing form routes: ${missingRoutes.length === 0 ? "none" : missingRoutes.join(", ")}`,
    `* Blockers: ${report.blockers.length === 0 ? "none" : report.blockers.join("; ")}`,
    "",
    "## Route Results",
    "",
    "| Route | Status | Form Marker | Input/Button | Notes |",
    "| --- | --- | --- | --- | --- |",
    rows,
    "",
    "## Manual Browser QA Required",
    "",
    "* Desktop:",
    manualRoutes.length > 0
      ? manualRoutes.map((route) => `  * \`${route}\``).join("\n")
      : "  * All audited routes returned SSR form markers",
    "* Mobile:",
    "  * Same route set — verify form fields + calculate CTA visible",
    "* Console:",
    "  * No red runtime errors on form routes",
    "* Network:",
    "  * No 404/500 on tool pages",
    "",
    `_Generated at ${report.generatedAt}_`,
    "",
  ].join("\n");
}

async function main() {
  console.log("=== audit:p5-form-presence ===\n");

  const baseUrl = process.env.SECTORCALC_QA_BASE_URL?.trim() || "";
  const routeResults = [];

  if (!baseUrl) {
    addBlocker("SECTORCALC_QA_BASE_URL_not_set");
    for (const route of ROUTES) {
      routeResults.push({
        route,
        url: null,
        status: null,
        ok: null,
        skipped: true,
        notes: ["skipped — set SECTORCALC_QA_BASE_URL"],
      });
    }
  } else {
    console.log(`fetch audit: ${baseUrl}`);
    for (const route of ROUTES) {
      const row = await auditRoute(baseUrl, route);
      routeResults.push(row);
      console.log(
        `${row.ok ? "✓" : "✗"} ${route} markers=${row.formMarkers?.length ?? 0} manual=${row.manualBrowserRequired ? "yes" : "no"}`,
      );
    }
  }

  const formMarkerRouteCount = routeResults.filter(
    (row) => row.hasCalculatorFormMarker || row.hasInputButton,
  ).length;

  const status =
    blockers.length > 0
      ? "NO_GO"
      : baseUrl
        ? routeResults.every((row) => row.ok || row.manualBrowserRequired)
          ? routeResults.some((row) => row.manualBrowserRequired)
            ? "MANUAL_BROWSER_REQUIRED"
            : "PASS"
          : "NO_GO"
        : "MANUAL_QA_REQUIRED";

  const report = {
    generatedAt: new Date().toISOString(),
    phase: "P5B_form_presence",
    deployExecuted: false,
    status,
    baseUrl: baseUrl || null,
    routeResults,
    formMarkerRouteCount,
    blockers,
  };

  fs.mkdirSync(path.dirname(REPORT_JSON_PATH), { recursive: true });
  fs.writeFileSync(REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(REPORT_MD_PATH, `${renderMarkdown(report)}\n`, "utf8");

  console.log(`\nstatus: ${status}`);
  console.log(`blockers: ${blockers.length}`);
  console.log(`output: ${path.relative(ROOT, REPORT_JSON_PATH)}`);
  console.log(`markdown: ${path.relative(ROOT, REPORT_MD_PATH)}`);

  if (blockers.length > 0) {
    console.error("\nBlockers:");
    for (const blocker of blockers) {
      console.error(` - ${blocker}`);
    }
    process.exit(1);
  }

  console.log(`\naudit:p5-form-presence ${status}`);
}

main();
