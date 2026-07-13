#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const routesPath = resolve(process.argv[2] ?? "public/routes.json");
const expectedOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sectorcalc.com").replace(/\/+$/, "");
const expectedHost = new URL(expectedOrigin).host;

const failures = [];
function fail(message) {
  failures.push(message);
}

if (!existsSync(routesPath)) {
  fail(`Route manifest not found: ${routesPath}`);
} else {
  let routes;
  try {
    routes = JSON.parse(readFileSync(routesPath, "utf8"));
  } catch (error) {
    fail(`Route manifest is invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    routes = [];
  }

  if (!Array.isArray(routes)) {
    fail("Route manifest must be a JSON array.");
    routes = [];
  }

  if (routes.length < 10) {
    fail(`Route manifest contains only ${routes.length} routes.`);
  }

  const duplicates = routes.filter((route, index) => routes.indexOf(route) !== index);
  if (duplicates.length > 0) {
    fail(`Duplicate routes: ${[...new Set(duplicates)].slice(0, 10).join(", ")}`);
  }

  const normalized = [...routes].sort();
  if (JSON.stringify(routes) !== JSON.stringify(normalized)) {
    fail("Route manifest must be deterministically sorted.");
  }

  for (const route of routes) {
    if (typeof route !== "string" || route.trim() !== route) {
      fail(`Invalid route value: ${String(route)}`);
      continue;
    }

    let parsed;
    try {
      parsed = new URL(route);
    } catch {
      fail(`Route is not an absolute URL: ${route}`);
      continue;
    }

    if (parsed.protocol !== "https:") fail(`Non-HTTPS route: ${route}`);
    if (parsed.host !== expectedHost) fail(`Foreign route host: ${route}`);
    if (parsed.search || parsed.hash) fail(`Route contains query or fragment: ${route}`);
    if (/^\/(?:api|admin|checkout)(?:\/|$)/.test(parsed.pathname)) {
      fail(`Non-indexable route leaked into manifest: ${route}`);
    }
    if (/\.(?:json|jsonl|csv|xml)$/i.test(parsed.pathname)) {
      fail(`Data route leaked into manifest: ${route}`);
    }
    if (/^\/(?:en|tr|de|fr|es|ar)(?:\/|$)/.test(parsed.pathname)) {
      fail(`Locale-prefixed route violates root-only policy: ${route}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`ROUTE_MANIFEST_FAIL: ${failure}`);
  process.exit(1);
}

console.log("ROUTE_MANIFEST_GUARD=PASS");
