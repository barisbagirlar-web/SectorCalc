import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  isFreeFullLoopRuntimeSlug,
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  localizeFreeTrafficToolInputs,
  localizeRevenueToolInputs,
} from "@/lib/i18n/free-tool-form-i18n";
import { getPremiumSchemaForPaidSlug } from "@/lib/premium-schema/schema-registry";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { hasDedicatedTrafficCalculator } from "@/lib/tools/free-traffic-calculators";
import {
  getRevenueToolByFreeSlug,
  getRevenueToolByPaidSlug,
  getRevenueToolByPremiumRouteSlug,
} from "@/lib/tools/revenue-tools";
import { isP24PassForSlug } from "@/lib/tools/runtime-readiness-p24-verdicts";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { normalizeLocale } from "@/lib/format/localization";

export type RuntimeReadinessStatus = "ready" | "review" | "blocked";

export type RuntimeReadinessFinding =
  | "missing_active_route"
  | "missing_form_schema"
  | "missing_required_inputs"
  | "generic_input_labels"
  | "mixed_locale_labels"
  | "missing_formula_contract"
  | "missing_validation"
  | "missing_submit_handler"
  | "missing_result_renderer"
  | "tier_copy_mismatch"
  | "audit_status_not_pass"
  | "placeholder_only_result";

export type RuntimeToolTier =
  | "free"
  | "premium"
  | "premium-schema"
  | "legacy"
  | "unknown";

export type RuntimeReadinessInput = {
  readonly slug: string;
  readonly locale?: string;
  /** Route surface the user sees (premium vs free). */
  readonly surface?: "free" | "premium";
  /** Premium route still mounts free-traffic copy (pre-fix detector). */
  readonly premiumSurfaceUsesFreeCopy?: boolean;
};

export type RuntimeReadinessResult = {
  readonly slug: string;
  readonly tier: RuntimeToolTier;
  readonly status: RuntimeReadinessStatus;
  readonly formulaGateEligible: boolean;
  readonly paymentEligible: boolean;
  readonly findings: readonly RuntimeReadinessFinding[];
};

const GENERIC_LABELS = new Set([
  "value",
  "amount",
  "input",
  "field",
  "key",
  "fee",
  "number",
]);

const GENERIC_UNITS = new Set(["value", "input", "field", "key", "amount"]);

const ENGLISH_TOKEN =
  /\b(fee|subscription|monthly|months|value|input|enter|year|calculation|free|premium)\b/i;

const TURKISH_MARKERS = /[çğıöşüÇĞİÖŞÜ]|(\b(Aylık|Ay|girin|ücret|tutar|hesap)\b)/i;

type ResolvedInput = {
  readonly key: string;
  readonly label: string;
  readonly unit?: string;
  readonly required?: boolean;
};

function resolveTier(slug: string): RuntimeToolTier {
  if (getPremiumSchemaForPaidSlug(slug)) {
    return "premium-schema";
  }
  if (getRevenueToolByPaidSlug(slug) || getRevenueToolByPremiumRouteSlug(slug)) {
    return "premium";
  }
  if (getFreeTrafficToolBySlug(slug) || getRevenueToolByFreeSlug(slug)) {
    return "free";
  }
  return "unknown";
}

function hasActiveRoute(slug: string, tier: RuntimeToolTier): boolean {
  if (tier === "premium" || tier === "premium-schema") {
    return Boolean(getRevenueToolByPremiumRouteSlug(slug) || getRevenueToolByPaidSlug(slug));
  }
  if (tier === "free") {
    return Boolean(getFreeTrafficToolBySlug(slug) || getRevenueToolByFreeSlug(slug));
  }
  return false;
}

function resolveInputs(slug: string, locale: SupportedLocale): readonly ResolvedInput[] {
  const revenuePaid = getRevenueToolByPaidSlug(slug) ?? getRevenueToolByPremiumRouteSlug(slug);
  if (revenuePaid?.paidInputs?.length) {
    return revenuePaid.paidInputs.map((input) => ({
      key: input.key,
      label: input.label,
      unit: input.unit,
      required: input.required !== false,
    }));
  }

  const revenueFree = getRevenueToolByFreeSlug(slug);
  if (revenueFree?.freeInputs?.length) {
    return localizeRevenueToolInputs(slug, locale, revenueFree.freeInputs).map((input) => ({
      key: input.key,
      label: input.label,
      unit: input.unit,
      required: input.required !== false,
    }));
  }

  const traffic = getFreeTrafficToolBySlug(slug);
  if (traffic?.inputs?.length) {
    return localizeFreeTrafficToolInputs(slug, locale, traffic.inputs).map((input) => ({
      key: input.key,
      label: input.label,
      unit: input.unit,
      required: true,
    }));
  }

  const schema = getPremiumSchemaForPaidSlug(slug);
  if (schema?.inputs?.length) {
    return schema.inputs.map((input) => ({
      key: input.id,
      label: input.label,
      unit: input.unit,
      required: input.required !== false,
    }));
  }

  return [];
}

function isGenericLabel(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  if (GENERIC_LABELS.has(normalized)) {
    return true;
  }
  if (/^(enter|input|value)\s/i.test(normalized)) {
    return true;
  }
  return false;
}

function isMixedLocaleLabel(label: string, locale: SupportedLocale): boolean {
  if (locale !== "tr") {
    return false;
  }
  const hasTurkish = TURKISH_MARKERS.test(label);
  const hasEnglish = ENGLISH_TOKEN.test(label);
  return hasTurkish && hasEnglish;
}

function hasFormulaContract(slug: string): boolean {
  if (getFormulaContractBySlug(slug)) {
    return true;
  }
  const aliasSlug = resolveFullLoopContractSlug(slug);
  return aliasSlug !== slug && Boolean(getFormulaContractBySlug(aliasSlug));
}

function hasValidationPath(slug: string, tier: RuntimeToolTier): boolean {
  if (!hasFormulaContract(slug)) {
    return false;
  }

  if (tier === "free") {
    if (hasDedicatedTrafficCalculator(slug)) {
      return true;
    }
    if (isFreeFullLoopRuntimeSlug(slug)) {
      return true;
    }
    if (getRevenueToolByFreeSlug(slug)) {
      return true;
    }
  }

  if (tier === "premium" || tier === "premium-schema") {
    if (getPremiumSchemaForPaidSlug(slug)) {
      return true;
    }
    if (getRevenueToolByPremiumRouteSlug(slug)) {
      return true;
    }
    if (getRevenueToolByPaidSlug(slug)) {
      return true;
    }
  }

  const contract = getFormulaContractBySlug(slug) ?? getFormulaContractBySlug(resolveFullLoopContractSlug(slug));
  return Boolean(contract?.requiredInputs?.length);
}

function hasResultRenderer(slug: string, tier: RuntimeToolTier): boolean {
  if (tier === "free") {
    return (
      hasDedicatedTrafficCalculator(slug) ||
      isFreeFullLoopRuntimeSlug(slug) ||
      Boolean(getRevenueToolByFreeSlug(slug))
    );
  }

  if (tier === "premium" || tier === "premium-schema") {
    return Boolean(
      getPremiumSchemaForPaidSlug(slug) ||
        getRevenueToolByPremiumRouteSlug(slug) ||
        getRevenueToolByPaidSlug(slug),
    );
  }

  return false;
}

function hasSubmitHandler(tier: RuntimeToolTier): boolean {
  return tier === "free" || tier === "premium" || tier === "premium-schema";
}

function deriveStatus(findings: readonly RuntimeReadinessFinding[]): RuntimeReadinessStatus {
  if (
    findings.includes("missing_active_route") ||
    findings.includes("missing_form_schema") ||
    findings.includes("missing_formula_contract") ||
    findings.includes("missing_result_renderer")
  ) {
    return "blocked";
  }
  if (findings.length > 0) {
    return "review";
  }
  return "ready";
}

export function evaluateRuntimeReadiness(input: RuntimeReadinessInput): RuntimeReadinessResult {
  const slug = input.slug.trim();
  const locale = normalizeLocale(input.locale ?? "en") as SupportedLocale;
  const tier = resolveTier(slug);
  const findings: RuntimeReadinessFinding[] = [];

  if (!hasActiveRoute(slug, tier)) {
    findings.push("missing_active_route");
  }

  const inputs = resolveInputs(slug, locale);
  if (inputs.length === 0) {
    findings.push("missing_form_schema");
  }

  const requiredCount = inputs.filter((field) => field.required !== false).length;
  if (requiredCount < 2) {
    findings.push("missing_required_inputs");
  }

  for (const field of inputs) {
    if (isGenericLabel(field.label)) {
      findings.push("generic_input_labels");
      break;
    }
    if (field.unit && GENERIC_UNITS.has(field.unit.trim().toLowerCase())) {
      findings.push("generic_input_labels");
      break;
    }
    if (isMixedLocaleLabel(field.label, locale)) {
      findings.push("mixed_locale_labels");
      break;
    }
  }

  if (!hasFormulaContract(slug)) {
    findings.push("missing_formula_contract");
  }

  if (!hasValidationPath(slug, tier)) {
    findings.push("missing_validation");
  }

  if (!hasSubmitHandler(tier)) {
    findings.push("missing_submit_handler");
  }

  if (!hasResultRenderer(slug, tier)) {
    findings.push("missing_result_renderer");
  }

  if (input.surface === "premium" && input.premiumSurfaceUsesFreeCopy === true) {
    findings.push("tier_copy_mismatch");
  }

  if (!isP24PassForSlug(slug)) {
    findings.push("audit_status_not_pass");
  }

  const status = deriveStatus(findings);
  const formulaGateEligible =
    status === "ready" &&
    !findings.includes("audit_status_not_pass") &&
    !findings.includes("generic_input_labels") &&
    !findings.includes("mixed_locale_labels") &&
    !findings.includes("tier_copy_mismatch") &&
    !findings.includes("missing_validation");

  const paymentEligible = formulaGateEligible && status === "ready";

  return {
    slug,
    tier,
    status,
    formulaGateEligible,
    paymentEligible,
    findings,
  };
}

export function isFormulaGateEligible(slug: string, locale?: string, surface?: "free" | "premium"): boolean {
  return evaluateRuntimeReadiness({ slug, locale, surface }).formulaGateEligible;
}
