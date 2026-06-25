import { buildPremiumCatalogTools } from "../src/lib/catalog/premium-catalog-source";

const tools = buildPremiumCatalogTools("tr");
console.log("Premium Tools Count:", tools.length);
