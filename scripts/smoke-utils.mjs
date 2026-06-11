#!/usr/bin/env node
/**
 * Shared smoke-test utilities for SectorCalc production route audits.
 * No npm dependencies — Node 18+ fetch.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const DEFAULT_BASE_URL = "https://sectorcalc.com";

export const RETRY_BACKOFF_MS = [500, 1000, 1500, 2500, 4000, 6000];

export const REQUEST_TIMEOUT_MS = 20_000;

export const SLOW_WARNING_MS = 5_000;

export const CRITICAL_SLOW_MS = 10_000;

/** Human-readable fatal categories reported in smoke output. */
export const FATAL_MARKER_LABELS = [
  "HTTP_404",
  "404-title",
  "Application error",
  "__next_error__",
  "NEXT_NOT_FOUND",
  "visible-not-found",
];

export const SUPPORTED_LOCALES = ["en", "tr", "ar", "de", "fr", "es"];

const ROOT = process.cwd();

export function getBaseUrl() {
  return (
    process.env.SMOKE_BASE_URL ??
    process.env.SECTORCALC_AUDIT_BASE_URL ??
    process.env.CATALOG_QA_BASE_URL ??
    DEFAULT_BASE_URL
  ).replace(/\/$/, "");
}

/**
 * Build a locale-aware path. EN/default has no prefix (localePrefix: as-needed).
 */
export function localePath(locale, path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/admin")) {
    return normalized;
  }
  const loc = (locale ?? "en").toLowerCase();
  if (loc === "en" || loc === "default" || loc === "") {
    return normalized;
  }
  if (normalized === "/") {
    return `/${loc}`;
  }
  return `/${loc}${normalized}`;
}

export function assertNoEnPrefix(path) {
  if (path === "/en" || path.startsWith("/en/")) {
    throw new Error(`Audit bug: EN/default route must not use /en prefix: ${path}`);
  }
}

function isRetryableStatus(status) {
  return status === 500 || status === 502 || status === 503;
}

function isRetryableError(error) {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("fetch failed") ||
    msg.includes("network") ||
    msg.includes("timeout") ||
    msg.includes("aborted") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ENOTFOUND")
  );
}

export async function fetchRoute(path, options = {}) {
  const baseUrl = options.baseUrl ?? getBaseUrl();
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const followRedirects = options.followRedirects !== false;

  if (!options.skipEnPrefixCheck) {
    assertNoEnPrefix(path);
  }

  const url = `${baseUrl}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: followRedirects ? "follow" : "manual",
      signal: controller.signal,
      headers: {
        "User-Agent": options.userAgent ?? "SectorCalc-Smoke/1.0",
        Accept: "text/html,application/xhtml+xml",
        ...(options.headers ?? {}),
      },
    });

    let body = "";
    try {
      body = await response.text();
    } catch {
      body = "";
    }

    return {
      path,
      url,
      status: response.status,
      ok: response.ok,
      body,
      durationMs: options.durationMs ?? 0,
      redirected: response.redirected,
      finalUrl: response.url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      path,
      url,
      status: 0,
      ok: false,
      body: "",
      durationMs: options.durationMs ?? 0,
      error: message,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRouteWithRetry(path, options = {}) {
  const maxAttempts = options.maxAttempts ?? RETRY_BACKOFF_MS.length + 1;
  let lastResult = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const start = Date.now();
    const result = await fetchRoute(path, options);
    result.durationMs = Date.now() - start;
    lastResult = result;

    const retryable =
      isRetryableStatus(result.status) ||
      result.status === 0 ||
      (result.error && isRetryableError(new Error(result.error)));

    if (!retryable) {
      return { ...result, attempts: attempt + 1 };
    }

    const backoff = RETRY_BACKOFF_MS[attempt];
    if (backoff === undefined) {
      break;
    }
    await new Promise((r) => setTimeout(r, backoff));
  }

  return { ...lastResult, attempts: maxAttempts };
}

/**
 * Detect white-page / error-shell markers without RSC flight false positives.
 * Next.js embeds notFound templates in RSC payload even on healthy pages —
 * only inspect visible HTML (pre-<script>) and document title.
 */
export function checkFatalMarkers(body, status = 0) {
  const hits = [];

  if (status === 404) {
    hits.push("HTTP_404");
    return hits;
  }

  const title = body.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
  if (/^404\s*:/i.test(title)) {
    hits.push("404-title");
    return hits;
  }

  const visibleHtml = body.split("<script")[0] ?? body;

  if (visibleHtml.includes("Application error")) {
    hits.push("Application error");
  }

  if (visibleHtml.includes('id="__next_error__"')) {
    hits.push("__next_error__");
  }

  if (visibleHtml.includes("NEXT_NOT_FOUND")) {
    hits.push("NEXT_NOT_FOUND");
  }

  if (
    /could not be found/i.test(visibleHtml) &&
    (/>404</i.test(visibleHtml) || /not-found/i.test(visibleHtml))
  ) {
    hits.push("visible-not-found");
  }

  return hits;
}

export function parseLocaleArg(argv) {
  const localeIdx = argv.indexOf("--locale");
  if (localeIdx !== -1 && argv[localeIdx + 1]) {
    return argv[localeIdx + 1].toLowerCase();
  }
  return "en";
}

function read(relPath) {
  return readFileSync(resolve(ROOT, relPath), "utf8");
}

function extractArraySection(source, marker) {
  const start = source.indexOf(marker);
  if (start === -1) return "";
  const slice = source.slice(start);
  const end = slice.indexOf("];");
  return end === -1 ? slice : slice.slice(0, end);
}

function splitToolBlocks(section) {
  if (section.includes("buildTool(")) {
    return section.split(/(?=buildTool\(\{)/).filter((b) => b.includes('freeSlug: "'));
  }
  if (section.includes("build({")) {
    return section.split(/(?=build\(\{)/).filter((b) => b.includes('freeSlug: "'));
  }
  const blocks = [];
  const toolStart = /(?:^|\n)\s*(?:\/\*\*[\s\S]*?\*\/\s*)?\{/g;
  let match = toolStart.exec(section);
  while (match) {
    const start = match.index + match[0].lastIndexOf("{");
    let depth = 0;
    let end = start;
    for (let i = start; i < section.length; i += 1) {
      if (section[i] === "{") depth += 1;
      if (section[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    const block = section.slice(start, end);
    if (block.includes('sector: "') && block.includes('freeSlug: "')) {
      blocks.push(block);
    }
    match = toolStart.exec(section);
  }
  return blocks;
}

/**
 * Parse premium paidSlug list from revenue registry source files.
 */
export function loadPremiumSlugsFromRegistry() {
  const revenueCore = read("src/lib/tools/revenue-tools.ts");
  const revenueAdditional = read("src/lib/tools/revenue-tools-additional.ts");
  const revenuePhase2 = read("src/lib/tools/revenue-tools-phase2.ts");

  const coreSection = extractArraySection(revenueCore, "const revenueToolsCore");
  const additionalSection = extractArraySection(
    revenueAdditional,
    "export const additionalRevenueTools"
  );
  const phase2Section = extractArraySection(revenuePhase2, "export const phase2RevenueTools");

  const slugs = [];
  for (const section of [coreSection, additionalSection, phase2Section]) {
    for (const block of splitToolBlocks(section)) {
      const paidSlug = block.match(/paidSlug:\s*"([^"]+)"/)?.[1];
      if (paidSlug) slugs.push(paidSlug);
    }
  }

  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length > 0) {
    throw new Error(`Duplicate paidSlug in registry: ${[...new Set(dupes)].join(", ")}`);
  }
  if (slugs.length !== 27) {
    throw new Error(`Expected 27 premium slugs from registry, found ${slugs.length}`);
  }
  return slugs;
}

export function formatSlowLabel(durationMs) {
  if (durationMs > CRITICAL_SLOW_MS) return "CRITICAL_SLOW";
  if (durationMs > SLOW_WARNING_MS) return "SLOW";
  return "OK";
}

/**
 * Parse revenue freeSlug list from revenue registry source files.
 */
export function loadRevenueFreeSlugsFromRegistry() {
  const revenueCore = read("src/lib/tools/revenue-tools.ts");
  const revenueAdditional = read("src/lib/tools/revenue-tools-additional.ts");
  const revenuePhase2 = read("src/lib/tools/revenue-tools-phase2.ts");

  const slugs = [];
  for (const section of [
    extractArraySection(revenueCore, "const revenueToolsCore"),
    extractArraySection(revenueAdditional, "export const additionalRevenueTools"),
    extractArraySection(revenuePhase2, "export const phase2RevenueTools"),
  ]) {
    for (const block of splitToolBlocks(section)) {
      const freeSlug = block.match(/freeSlug:\s*"([^"]+)"/)?.[1];
      if (freeSlug) slugs.push(freeSlug);
    }
  }
  return [...new Set(slugs)];
}

/**
 * Parse traffic-only free tool slugs from generated catalog JSON.
 */
export function loadTrafficFreeSlugsFromCatalog() {
  const catalog = read("src/lib/tools/free-traffic-catalog.generated.json");
  const parsed = JSON.parse(catalog);
  if (!Array.isArray(parsed)) {
    throw new Error("Expected free-traffic-catalog.generated.json to be an array");
  }
  return parsed
    .map((entry) => (typeof entry?.slug === "string" ? entry.slug : null))
    .filter((slug) => slug !== null);
}

export function loadAllFreeToolSlugsFromRegistry() {
  const revenue = new Set(loadRevenueFreeSlugsFromRegistry());
  const traffic = loadTrafficFreeSlugsFromCatalog().filter((slug) => !revenue.has(slug));
  return [...revenue, ...traffic];
}

/** Legacy `/tools/[tier]/[slug]` calculator routes (not revenue premium paths). */
export function loadLegacyCalculatorRoutes() {
  return [
    { tier: "free", slug: "machine-hour-estimator" },
    { tier: "free", slug: "project-cost-estimator" },
    { tier: "free", slug: "cleaning-cost-estimator" },
    { tier: "free", slug: "food-cost-calculator" },
    { tier: "free", slug: "product-margin-calculator" },
    { tier: "premium", slug: "cnc-minimum-safe-quote-analyzer" },
    { tier: "premium", slug: "return-rate-profit-erosion-tool" },
  ].map(({ tier, slug }) => `/tools/${tier}/${slug}`);
}
