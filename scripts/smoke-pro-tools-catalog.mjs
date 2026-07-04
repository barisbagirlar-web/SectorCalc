#!/usr/bin/env node

/**
 * Smoke test: PRO Tools Catalog Page
 * Checks /pro-tools for correct rendering.
 * Usage: BASE_URL=http://localhost:3000 node scripts/smoke-pro-tools-catalog.mjs
 *        BASE_URL=https://www.sectorcalc.com node scripts/smoke-pro-tools-catalog.mjs
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  const url = `${BASE_URL}/pro-tools`;
  console.log(`SMOKE: Fetching ${url}...`);

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    console.error(`SMOKE_PRO_TOOLS_CATALOG=FAIL`);
    console.error(`- Network error: ${err.message}`);
    process.exit(1);
  }

  const failures = [];

  // 1. HTTP 200
  if (res.status !== 200) {
    failures.push(`Expected 200, got ${res.status}`);
  }

  const html = await res.text();

  // 2. Must NOT contain "0 deterministic, auditable calculators"
  if (html.includes("0 deterministic, auditable calculators")) {
    failures.push('Page shows "0 deterministic, auditable calculators" — empty catalog');
  }

  // 3. Must contain "PRO Industrial Calculators"
  if (!html.includes("PRO Industrial Calculators")) {
    failures.push('Missing "PRO Industrial Calculators" heading');
  }

  // 4. Must contain at least one PRO tool card marker
  const toolCardCount = (html.match(/pro-tool-card/g) || []).length;
  if (toolCardCount === 0) {
    failures.push("No PRO tool cards rendered (pro-tool-card class not found)");
  }

  // 5. Must contain at least one SC-### tool ID
  const toolIdCount = (html.match(/SC-\d{3}/g) || []).length;
  if (toolIdCount === 0) {
    failures.push("No PRO tool IDs (SC-###) found in rendered HTML");
  }

  // 6. Must NOT contain raw category keys
  if (html.includes("categories.")) {
    failures.push("Contains raw 'categories.' in output");
  }

  // 7. Must NOT contain "Daily Renovation"
  if (html.includes("Daily Renovation")) {
    failures.push("Contains forbidden 'Daily Renovation' text");
  }

  // 8. Must NOT contain "Not specified"
  if (html.includes("Not specified")) {
    failures.push("Contains forbidden 'Not specified' text");
  }

  // 9. Check data-pro-tools-count attribute
  const toolsMatch = html.match(/data-pro-tools-count="(\d+)"/);
  if (toolsMatch) {
    const count = parseInt(toolsMatch[1], 10);
    if (count === 0) {
      failures.push(`data-pro-tools-count=${count} — catalog is empty`);
    } else {
      console.log(`  data-pro-tools-count=${count} (PASS)`);
    }
  } else {
    failures.push("data-pro-tools-count attribute missing");
  }

  // 10. Check data-pro-category-count attribute
  const catMatch = html.match(/data-pro-category-count="(\d+)"/);
  if (catMatch) {
    const count = parseInt(catMatch[1], 10);
    if (count === 0) {
      failures.push(`data-pro-category-count=${count} — no categories`);
    } else {
      console.log(`  data-pro-category-count=${count} (PASS)`);
    }
  } else {
    failures.push("data-pro-category-count attribute missing");
  }

  if (failures.length > 0) {
    console.error("SMOKE_PRO_TOOLS_CATALOG=FAIL");
    for (const f of failures) console.error(`- ${f}`);
    process.exit(1);
  }

  console.log("SMOKE_PRO_TOOLS_CATALOG=PASS");
  console.log(`  status=${res.status}`);
  console.log(`  tool_cards=${toolCardCount}`);
  console.log(`  tool_ids=${toolIdCount}`);
}

main().catch((err) => {
  console.error("SMOKE_PRO_TOOLS_CATALOG=FAIL");
  console.error(`- Unexpected error: ${err.message}`);
  process.exit(1);
});
