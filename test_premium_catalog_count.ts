import { buildCategorizedToolIndex } from "./src/lib/catalog/build-categorized-tool-index";
const items = buildCategorizedToolIndex();
const premium = items.filter(
  (item) => (item.tier === "premium" || item.tier === "premium-schema") && item.publicStatus === "active" && item.routePath !== null
);
console.log("Total premium items: " + premium.length);
