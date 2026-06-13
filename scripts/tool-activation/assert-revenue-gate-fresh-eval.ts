import { evaluateRuntimeTrust } from "../../src/lib/tools/runtime-trust-engine";
import { getP24VerdictForSlug, isP24TrustPassForSlug } from "../../src/lib/tools/runtime-readiness-p24-verdicts";

const slugs = process.argv.slice(2);

type FreshEvalRow = {
  slug: string;
  status: string;
  formulaGateEligible: boolean;
  paymentEligible: boolean;
  calculationEligible: boolean;
  findings: string[];
  p24Verdict: string;
  p24TrustPass: boolean;
};

const rows: FreshEvalRow[] = slugs.map((slug) => {
  const decision = evaluateRuntimeTrust({
    slug,
    locale: "tr",
    surface: "premium",
    premiumSurfaceUsesFreeCopy: false,
  });
  return {
    slug,
    status: decision.status,
    formulaGateEligible: decision.formulaGateEligible,
    paymentEligible: decision.paymentEligible,
    calculationEligible: decision.calculationEligible,
    findings: [...decision.findings],
    p24Verdict: getP24VerdictForSlug(slug),
    p24TrustPass: isP24TrustPassForSlug(slug),
  };
});

process.stdout.write(`${JSON.stringify(rows)}\n`);
