import { evaluateRuntimeTrust } from "../src/lib/tools/runtime-trust-engine";
console.log("=== PRO TOOLS DEBUG ===");
const res = evaluateRuntimeTrust({ slug: "3d-baski-filament-geri-donusum-roi-ve-mukavemet-kaybi-calculator-38", locale: "en", surface: "premium" });
console.log(`Status: ${res.status}, CalcEligible: ${res.calculationEligible}`);
console.log(`Findings:`, res.findings);
