import { evaluateRuntimeTrust } from "../src/lib/tools/runtime-trust-engine";

const res = evaluateRuntimeTrust({
  slug: "annual-percentage-rate-apr",
  locale: "tr",
  surface: "free",
});

console.log("Check for annual-percentage-rate-apr:");
console.log(JSON.stringify(res, null, 2));
