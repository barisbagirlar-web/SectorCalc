import { CERTIFIED_FREE_TOOL_SLUGS } from "@/sectorcalc/formulas/free-v531/free-formula-verification-manifest";
import { listCertifiedFormulaKeys } from "@/sectorcalc/formulas/pro-v531/pro-formula-verification-manifest";

const FREE_FORMULA_CANDIDATE_COUNT = 50;
const PRO_INSTANT_FORMULA_CANDIDATE_COUNT = 20;

export interface CalculationProductionReadiness {
  readonly policyVersion: "SECTORCALC_CALCULATION_DNA_V1";
  readonly releasePolicy: "CERTIFICATION_REQUIRED_FAIL_CLOSED";
  readonly free: {
    readonly candidates: number;
    readonly certifiedLive: number;
    readonly quarantined: number;
  };
  readonly proInstant: {
    readonly candidates: number;
    readonly certifiedLive: number;
    readonly quarantined: number;
  };
  readonly arithmeticRequirement: "DECIMAL_OR_VERIFIED_INTERVAL";
  readonly evidenceRequirement: "PROPERTY_METAMORPHIC_GOLDEN_SCHEMA_BINDING";
}

export function getCalculationProductionReadiness(): CalculationProductionReadiness {
  const freeCertified = CERTIFIED_FREE_TOOL_SLUGS.length;
  const proCertified = listCertifiedFormulaKeys().length;
  return Object.freeze({
    policyVersion: "SECTORCALC_CALCULATION_DNA_V1",
    releasePolicy: "CERTIFICATION_REQUIRED_FAIL_CLOSED",
    free: Object.freeze({
      candidates: FREE_FORMULA_CANDIDATE_COUNT,
      certifiedLive: freeCertified,
      quarantined: FREE_FORMULA_CANDIDATE_COUNT - freeCertified,
    }),
    proInstant: Object.freeze({
      candidates: PRO_INSTANT_FORMULA_CANDIDATE_COUNT,
      certifiedLive: proCertified,
      quarantined: PRO_INSTANT_FORMULA_CANDIDATE_COUNT - proCertified,
    }),
    arithmeticRequirement: "DECIMAL_OR_VERIFIED_INTERVAL",
    evidenceRequirement: "PROPERTY_METAMORPHIC_GOLDEN_SCHEMA_BINDING",
  });
}

