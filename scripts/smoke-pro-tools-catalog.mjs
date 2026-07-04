#!/usr/bin/env node

/**
 * Smoke test: PRO Tools Catalog Page
 * Checks /pro-tools for correct rendering with CatalogPageShell design.
 * Usage: BASE_URL=http://localhost:3000 node scripts/smoke-pro-tools-catalog.mjs
 *        BASE_URL=https://sectorcalc.com node scripts/smoke-pro-tools-catalog.mjs
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

  // 4. Must contain CatalogPageShell search element
  if (!html.includes("cc-search") && !html.includes('type="search"')) {
    failures.push("Missing search input (cc-search or search input)");
  }

  // 5. Must contain sector filter grid (cc-grid)
  const gridCount = (html.match(/cc-grid/g) || []).length;
  if (gridCount === 0) {
    failures.push("No sector filter grid (cc-grid) found");
  }

  // 6. Must contain sector boxes (cc-box)
  const boxCount = (html.match(/cc-box/g) || []).length;
  if (boxCount === 0) {
    failures.push("No sector box cards (cc-box) found");
  }

  // 7. Must contain tool links pointing to /tools/pro/
  const proLinkCount = (html.match(/\/tools\/pro\//g) || []).length;
  if (proLinkCount === 0) {
    failures.push("No PRO tool links (/tools/pro/) found in rendered HTML");
  } else {
    console.log(`  pro_tool_links=${proLinkCount} (PASS)`);
  }

  // 8. Must contain results section (cc-results)
  if (!html.includes("cc-results")) {
    failures.push("Missing results section (cc-results)");
  }

  // 9. Must contain at least one tool link text (cc-link)
  const linkCount = (html.match(/cc-link/g) || []).length;
  if (linkCount === 0) {
    failures.push("No tool links (cc-link) found");
  }

  // 10. Must contain JSON-LD with PRO tool entries
  const jsonLdMatch = html.match(/ItemList.*PRO Industrial Calculators/);
  if (!jsonLdMatch) {
    failures.push("Missing JSON-LD ItemList for PRO Industrial Calculators");
  }

  // 11. Must contain tool count in results heading
  const toolsCountMatch = html.match(/(\d+)\s+tools?/);
  if (toolsCountMatch) {
    const count = parseInt(toolsCountMatch[1], 10);
    if (count === 0) {
      failures.push(`Tool count shows ${count} — catalog appears empty`);
    } else {
      console.log(`  tool_count=${count} (PASS)`);
    }
  }

  // 12. Must NOT contain raw category keys
  if (html.includes("categories.")) {
    failures.push("Contains raw 'categories.' in output");
  }

  // 13. Must NOT contain "Daily Renovation"
  if (html.includes("Daily Renovation")) {
    failures.push("Contains forbidden 'Daily Renovation' text");
  }

  // 14. Must NOT contain "Not specified"
  if (html.includes("Not specified")) {
    failures.push("Contains forbidden 'Not specified' text");
  }

  if (failures.length > 0) {
    console.error("SMOKE_PRO_TOOLS_CATALOG=FAIL");
    for (const f of failures) console.error(`- ${f}`);
    process.exit(1);
  }

  console.log("SMOKE_PRO_TOOLS_CATALOG=PASS");
  console.log(`  status=${res.status}`);
  console.log(`  sector_boxes=${boxCount}`);
  console.log(`  tool_links=${proLinkCount}`);
}

main().catch((err) => {
  console.error("SMOKE_PRO_TOOLS_CATALOG=FAIL");
  console.error(`- Unexpected error: ${err.message}`);
  process.exit(1);
});
