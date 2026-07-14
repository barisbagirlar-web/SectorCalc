import fs from "node:fs";
import path from "node:path";

import {
  CERTIFIED_DECIMAL_FREE_TOOL_SLUGS,
  CERTIFIED_FREE_TOOL_SLUGS,
  CERTIFIED_INTERVAL_FREE_TOOL_SLUGS,
  FREE_FORMULA_CERTIFICATIONS,
} from "../src/sectorcalc/formulas/free-v531/free-formula-verification-manifest";
import { CERTIFIED_PRO_TOOL_SLUGS } from "../src/sectorcalc/formulas/pro-v531/pro-certified-tool-keys";
import {
  getFormulaVerificationRecord,
  listCertifiedFormulaKeys,
  verifyFormulaModuleCertification,
} from "../src/sectorcalc/formulas/pro-v531/pro-formula-verification-manifest";
import {
  getRegisteredToolKeys,
  resolveFormulaModule,
} from "../src/sectorcalc/formulas/pro-v531/resolve-formula-module";
import { getFreeToolManifest, verifyManifestConsistency } from "../src/sectorcalc/free-tools/free-tools-manifest";
import { getCalculationProductionReadiness } from "../src/sectorcalc/runtime/calculation-production-readiness";
import { resolveApprovedToolSchema } from "../src/sectorcalc/runtime/resolve-approved-tool-schema";

const failures: string[] = [];
const canonicalDecimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const sorted = (values: readonly string[]) => [...values].sort();
const sameStrings = (left: readonly string[], right: readonly string[]) =>
  JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));

function fail(message: string): void {
  failures.push(message);
}

const readiness = getCalculationProductionReadiness();
if (readiness.free.certifiedLive !== 50 || readiness.free.quarantined !== 0) {
  fail("Free readiness is not 50 certified and 0 quarantined.");
}
if (readiness.proInstant.certifiedLive !== 20 || readiness.proInstant.quarantined !== 0) {
  fail("Pro readiness is not 20 certified and 0 quarantined.");
}

const freeManifestCheck = verifyManifestConsistency();
if (!freeManifestCheck.pass) {
  fail("Free public manifest mismatch: " + freeManifestCheck.errors.join(" | "));
}
if (CERTIFIED_FREE_TOOL_SLUGS.length !== 50) fail("Free certification catalog count is not 50.");
if (CERTIFIED_DECIMAL_FREE_TOOL_SLUGS.length !== 45) fail("Free Decimal catalog count is not 45.");
if (CERTIFIED_INTERVAL_FREE_TOOL_SLUGS.length !== 5) fail("Free interval catalog count is not 5.");
if (new Set([...CERTIFIED_DECIMAL_FREE_TOOL_SLUGS, ...CERTIFIED_INTERVAL_FREE_TOOL_SLUGS]).size !== 50) {
  fail("Free Decimal and interval certification partitions overlap or are incomplete.");
}
if (getFreeToolManifest().some((entry) => entry.status !== "CERTIFIED_LIVE")) {
  fail("Free public manifest contains a non-certified entry.");
}
for (const toolKey of CERTIFIED_FREE_TOOL_SLUGS) {
  const record = FREE_FORMULA_CERTIFICATIONS[toolKey];
  if (!record || record.toolKey !== toolKey || !record.modelId || !record.formulaVersion) {
    fail("Incomplete Free certification record: " + toolKey);
    continue;
  }
  if (!fs.existsSync(path.join(process.cwd(), record.evidencePath))) {
    fail("Missing Free property evidence: " + toolKey + " -> " + record.evidencePath);
  }
}

const certifiedProKeys = listCertifiedFormulaKeys();
const registeredProKeys = getRegisteredToolKeys();
if (!sameStrings(certifiedProKeys, CERTIFIED_PRO_TOOL_SLUGS)) {
  fail("Server Pro certification manifest differs from the client-safe execution catalog.");
}
if (!sameStrings(registeredProKeys, CERTIFIED_PRO_TOOL_SLUGS)) {
  fail("Registered Pro formula modules differ from the certified execution catalog.");
}

let proExecuted = 0;
for (const toolKey of CERTIFIED_PRO_TOOL_SLUGS) {
  const record = getFormulaVerificationRecord(toolKey);
  const formulaModule = resolveFormulaModule(toolKey);
  const schemaResult = resolveApprovedToolSchema(toolKey);
  if (!record) {
    fail("Missing Pro verification record: " + toolKey);
    continue;
  }
  if (!formulaModule) {
    fail("Missing Pro formula module: " + toolKey);
    continue;
  }
  if (!schemaResult.ok) {
    fail("Approved schema resolution failed: " + toolKey + " -> " + schemaResult.reason + ":" + schemaResult.errors.join("|"));
    continue;
  }
  const certification = verifyFormulaModuleCertification(
    formulaModule,
    schemaResult.schema.metadata.formula_version,
    schemaResult.schema.metadata.schema_version,
  );
  if (!certification.ok) {
    fail("Pro certification binding failed: " + toolKey + " -> " + certification.errors.join("|"));
    continue;
  }
  if (!fs.existsSync(path.join(process.cwd(), record.propertyEvidenceId))) {
    fail("Missing Pro property evidence: " + toolKey + " -> " + record.propertyEvidenceId);
    continue;
  }

  const result = formulaModule.calculate(formulaModule.sampleInputs);
  if (result.status === "BLOCKED") {
    fail("Certified Pro sample execution blocked: " + toolKey + " -> " + result.warnings.join("|"));
    continue;
  }
  const outputIds = Object.keys(result.outputs);
  const schemaOutputIds = schemaResult.schema.outputs.map((output) => output.id);
  if (!sameStrings(outputIds, schemaOutputIds) || !sameStrings(result.outputKeys, outputIds)) {
    fail("Pro runtime output keys differ from schema: " + toolKey);
    continue;
  }
  const exactOutputs = result.decimalOutputs ?? {};
  for (const outputId of outputIds) {
    const numeric = result.outputs[outputId];
    const exact = exactOutputs[outputId];
    if (!Number.isFinite(numeric)) {
      fail("Non-finite Pro presentation output: " + toolKey + ":" + outputId);
    } else if (typeof exact !== "string" || !canonicalDecimal.test(exact)) {
      fail("Missing canonical Pro Decimal audit output: " + toolKey + ":" + outputId);
    } else if (Number(exact) !== numeric) {
      fail("Pro Decimal/presentation mismatch: " + toolKey + ":" + outputId);
    }
  }
  proExecuted += 1;
}

console.log("RUNTIME_TRUST_AUDIT_POLICY=CERTIFICATION_REQUIRED_FAIL_CLOSED");
console.log("FREE_CERTIFIED=" + CERTIFIED_FREE_TOOL_SLUGS.length);
console.log("FREE_DECIMAL=" + CERTIFIED_DECIMAL_FREE_TOOL_SLUGS.length);
console.log("FREE_VERIFIED_INTERVAL=" + CERTIFIED_INTERVAL_FREE_TOOL_SLUGS.length);
console.log("PRO_CERTIFIED=" + CERTIFIED_PRO_TOOL_SLUGS.length);
console.log("PRO_SAMPLE_EXECUTED=" + proExecuted);
console.log("FAILURES=" + failures.length);
if (failures.length > 0) {
  for (const failure of failures) console.error("FAIL " + failure);
  process.exit(1);
}
console.log("RUNTIME_TRUST_AUDIT=PASS");
