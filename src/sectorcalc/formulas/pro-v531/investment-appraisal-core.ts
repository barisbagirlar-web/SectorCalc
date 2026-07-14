/**
 * Canonical investment appraisal model for level annual cash flows.
 *
 * Timing contract:
 * - the initial investment occurs at t=0;
 * - annual cash flow occurs once at each period end;
 * - residual value occurs once, at the final period end.
 *
 * All domain arithmetic uses an isolated Big.js constructor. IEEE-754 numbers
 * are created only by the explicit presentation adapter.
 */

import {
  createDecimalContext,
  decimalToPresentationNumber,
  err,
  ok,
  type Decimal,
  type DecimalSource,
  type DomainError,
  type DomainResult,
} from "./pro-decimal-domain";

export const INVESTMENT_APPRAISAL_MODEL_ID =
  "SC_INVESTMENT_APPRAISAL_DISCRETE_END_PERIOD_V2_DECIMAL";
export const INVESTMENT_APPRAISAL_FORMULA_VERSION = "7.0.0-pro-finance.1";
export const INVESTMENT_APPRAISAL_SCHEMA_VERSION =
  "7.0.0-pro-finance-schema.1";
export const INVESTMENT_APPRAISAL_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN";

export interface InvestmentAppraisalInput {
  initialInvestment: DecimalSource;
  annualCashFlow: DecimalSource;
  discountRate: DecimalSource;
  periods: DecimalSource;
  residualValue: DecimalSource;
  downsideFactor: DecimalSource;
  sourceConfidenceRatio: DecimalSource;
  uncertaintyMultiplier: DecimalSource;
}

export interface InvestmentAppraisalDecimalResult {
  netPresentValue: Decimal;
  internalRateOfReturn: Decimal | null;
  simplePaybackYears: Decimal | null;
  profitabilityIndex: Decimal;
  stressedNetPresentValue: Decimal;
  uncertaintyAmount: Decimal;
  lowerBound: Decimal;
  upperBound: Decimal;
  breakEvenAnnualCashFlow: Decimal;
  hurdleRateMargin: Decimal | null;
  decisionState: 0 | 1 | 2;
}

export interface InvestmentAppraisalResult {
  netPresentValue: number;
  internalRateOfReturn: number | null;
  simplePaybackYears: number | null;
  profitabilityIndex: number;
  stressedNetPresentValue: number;
  uncertaintyAmount: number;
  lowerBound: number;
  upperBound: number;
  breakEvenAnnualCashFlow: number;
  hurdleRateMargin: number | null;
  decisionState: 0 | 1 | 2;
}

export interface InvestmentAppraisalEvaluationOptions {
  includeIrr?: boolean;
}

interface ParsedInvestmentInput {
  initialInvestment: Decimal;
  annualCashFlow: Decimal;
  discountRate: Decimal;
  periods: number;
  periodsDecimal: Decimal;
  residualValue: Decimal;
  downsideFactor: Decimal;
  sourceConfidenceRatio: Decimal;
  uncertaintyMultiplier: Decimal;
}

type DecimalContext = ReturnType<typeof createDecimalContext>;

const MAX_PERIODS = 50;
const ROOT_TOLERANCE = "1e-20";
const MAX_IRR = "1000000";
const MIN_IRR = "-0.999999";

function domainViolation(field: string, message: string): DomainResult<never> {
  return err({
    code: "DOMAIN_VIOLATION",
    field,
    message,
  });
}

function parseInvestmentInput(
  input: InvestmentAppraisalInput,
  context: DecimalContext,
): DomainResult<ParsedInvestmentInput> {
  const fields = [
    ["initialInvestment", input.initialInvestment],
    ["annualCashFlow", input.annualCashFlow],
    ["discountRate", input.discountRate],
    ["periods", input.periods],
    ["residualValue", input.residualValue],
    ["downsideFactor", input.downsideFactor],
    ["sourceConfidenceRatio", input.sourceConfidenceRatio],
    ["uncertaintyMultiplier", input.uncertaintyMultiplier],
  ] as const;

  const values = new Map<string, Decimal>();
  for (const [field, source] of fields) {
    const parsed = context.decimal(source, field);
    if (!parsed.ok) return parsed;
    values.set(field, parsed.value);
  }

  const initialInvestment = values.get("initialInvestment")!;
  const annualCashFlow = values.get("annualCashFlow")!;
  const discountRate = values.get("discountRate")!;
  const periodsDecimal = values.get("periods")!;
  const residualValue = values.get("residualValue")!;
  const downsideFactor = values.get("downsideFactor")!;
  const sourceConfidenceRatio = values.get("sourceConfidenceRatio")!;
  const uncertaintyMultiplier = values.get("uncertaintyMultiplier")!;

  if (!initialInvestment.gt("0")) {
    return domainViolation("initialInvestment", "Initial investment must be greater than zero.");
  }
  if (discountRate.lt("0") || discountRate.gt("1")) {
    return domainViolation("discountRate", "Discount rate must be in the closed interval [0, 1].");
  }
  if (
    !periodsDecimal.mod("1").eq("0") ||
    periodsDecimal.lt("1") ||
    periodsDecimal.gt(String(MAX_PERIODS))
  ) {
    return domainViolation(
      "periods",
      "Periods must be a whole number between 1 and " + String(MAX_PERIODS) + ".",
    );
  }
  if (residualValue.lt("0")) {
    return domainViolation("residualValue", "Residual value cannot be negative.");
  }
  if (downsideFactor.lt("0") || downsideFactor.gt("1")) {
    return domainViolation("downsideFactor", "Downside factor must be in the closed interval [0, 1].");
  }
  if (sourceConfidenceRatio.lt("0") || sourceConfidenceRatio.gt("1")) {
    return domainViolation(
      "sourceConfidenceRatio",
      "Source confidence ratio must be in the closed interval [0, 1].",
    );
  }
  if (uncertaintyMultiplier.lt("0") || uncertaintyMultiplier.gt("10")) {
    return domainViolation(
      "uncertaintyMultiplier",
      "Uncertainty multiplier must be in the closed interval [0, 10].",
    );
  }

  return ok({
    initialInvestment,
    annualCashFlow,
    discountRate,
    periods: Number(periodsDecimal.toString()),
    periodsDecimal,
    residualValue,
    downsideFactor,
    sourceConfidenceRatio,
    uncertaintyMultiplier,
  });
}

function discreteNpv(
  context: DecimalContext,
  initialInvestment: Decimal,
  annualCashFlow: Decimal,
  discountRate: Decimal,
  periods: number,
  residualValue: Decimal,
): Decimal {
  const discountBase = context.DecimalConstructor("1").plus(discountRate);
  let presentValue = initialInvestment.neg();

  for (let period = 1; period <= periods; period += 1) {
    presentValue = presentValue.plus(
      annualCashFlow.div(discountBase.pow(period)),
    );
  }

  return presentValue.plus(residualValue.div(discountBase.pow(periods)));
}

function conventionalIrr(
  context: DecimalContext,
  input: ParsedInvestmentInput,
): Decimal | null {
  if (
    input.annualCashFlow.lt("0") ||
    (input.annualCashFlow.eq("0") && input.residualValue.eq("0"))
  ) {
    return null;
  }

  const npvAt = (rate: Decimal) =>
    discreteNpv(
      context,
      input.initialInvestment,
      input.annualCashFlow,
      rate,
      input.periods,
      input.residualValue,
    );

  let lower = context.DecimalConstructor(MIN_IRR);
  let upper = context.DecimalConstructor("1");
  let lowerValue = npvAt(lower);
  let upperValue = npvAt(upper);

  if (lowerValue.lt("0")) return null;
  if (lowerValue.abs().lte(ROOT_TOLERANCE)) return lower;

  while (upperValue.gt("0") && upper.lt(MAX_IRR)) {
    const expandedUpper = upper.times("2").plus("1");
    upper = expandedUpper.gt(MAX_IRR)
      ? context.DecimalConstructor(MAX_IRR)
      : expandedUpper;
    upperValue = npvAt(upper);
  }

  if (upperValue.gt("0")) return null;
  if (upperValue.abs().lte(ROOT_TOLERANCE)) return upper;

  const scale = input.initialInvestment.abs().gt("1")
    ? input.initialInvestment.abs()
    : context.DecimalConstructor("1");
  const valueTolerance = scale.times(ROOT_TOLERANCE);

  for (let iteration = 0; iteration < 160; iteration += 1) {
    const midpoint = lower.plus(upper).div("2");
    const midpointValue = npvAt(midpoint);

    if (
      midpointValue.abs().lte(valueTolerance) ||
      upper.minus(lower).abs().lte(ROOT_TOLERANCE)
    ) {
      return midpoint;
    }

    if (midpointValue.gt("0")) {
      lower = midpoint;
      lowerValue = midpointValue;
    } else {
      upper = midpoint;
      upperValue = midpointValue;
    }
  }

  if (lowerValue.lt("0") || upperValue.gt("0")) return null;
  return lower.plus(upper).div("2");
}

function simplePayback(
  context: DecimalContext,
  input: ParsedInvestmentInput,
): Decimal | null {
  if (!input.annualCashFlow.gt("0")) {
    return input.residualValue.gte(input.initialInvestment)
      ? input.periodsDecimal
      : null;
  }

  const annualRecovery = input.initialInvestment.div(input.annualCashFlow);
  if (annualRecovery.lte(input.periodsDecimal)) return annualRecovery;

  const terminalRecovery = input.annualCashFlow
    .times(input.periodsDecimal)
    .plus(input.residualValue);
  return terminalRecovery.gte(input.initialInvestment)
    ? context.DecimalConstructor(input.periodsDecimal)
    : null;
}

export function evaluateInvestmentAppraisalResult(
  input: InvestmentAppraisalInput,
  options: InvestmentAppraisalEvaluationOptions = {},
): DomainResult<InvestmentAppraisalDecimalResult> {
  const context = createDecimalContext();
  const parsed = parseInvestmentInput(input, context);
  if (!parsed.ok) return parsed;
  const value = parsed.value;

  const netPresentValue = discreteNpv(
    context,
    value.initialInvestment,
    value.annualCashFlow,
    value.discountRate,
    value.periods,
    value.residualValue,
  );
  const internalRateOfReturn = options.includeIrr === false
    ? null
    : conventionalIrr(context, value);
  const stressedAnnualCashFlow = value.annualCashFlow.times(
    context.DecimalConstructor("1").minus(value.downsideFactor),
  );
  const stressedNetPresentValue = discreteNpv(
    context,
    value.initialInvestment,
    stressedAnnualCashFlow,
    value.discountRate,
    value.periods,
    value.residualValue,
  );

  const discountBase = context.DecimalConstructor("1").plus(value.discountRate);
  const discountedResidual = value.residualValue.div(
    discountBase.pow(value.periods),
  );
  const discountedInflows = netPresentValue.plus(value.initialInvestment);
  let annuityFactor = context.DecimalConstructor("0");
  for (let period = 1; period <= value.periods; period += 1) {
    annuityFactor = annuityFactor.plus(
      context.DecimalConstructor("1").div(discountBase.pow(period)),
    );
  }
  if (annuityFactor.eq("0")) {
    return err({
      code: "DIVISION_BY_ZERO",
      field: "breakEvenAnnualCashFlow",
      message: "Annuity factor cannot be zero.",
    });
  }

  const uncertaintyAmount = netPresentValue
    .abs()
    .times(context.DecimalConstructor("1").minus(value.sourceConfidenceRatio))
    .times(value.uncertaintyMultiplier);
  const hurdleRateMargin = internalRateOfReturn === null
    ? null
    : internalRateOfReturn.minus(value.discountRate);

  let decisionState: 0 | 1 | 2 = 2;
  if (
    netPresentValue.gt("0") &&
    stressedNetPresentValue.gte("0") &&
    internalRateOfReturn !== null &&
    internalRateOfReturn.gte(value.discountRate)
  ) {
    decisionState = 0;
  } else if (netPresentValue.gt("0")) {
    decisionState = 1;
  }

  return ok({
    netPresentValue,
    internalRateOfReturn,
    simplePaybackYears: simplePayback(context, value),
    profitabilityIndex: discountedInflows.div(value.initialInvestment),
    stressedNetPresentValue,
    uncertaintyAmount,
    lowerBound: netPresentValue.minus(uncertaintyAmount),
    upperBound: netPresentValue.plus(uncertaintyAmount),
    breakEvenAnnualCashFlow: value.initialInvestment
      .minus(discountedResidual)
      .div(annuityFactor),
    hurdleRateMargin,
    decisionState,
  });
}

function present(
  value: Decimal,
  field: string,
): DomainResult<number> {
  return decimalToPresentationNumber(value, field);
}

export function presentInvestmentAppraisalResult(
  value: InvestmentAppraisalDecimalResult,
): DomainResult<InvestmentAppraisalResult> {
  const required = [
    ["netPresentValue", value.netPresentValue],
    ["profitabilityIndex", value.profitabilityIndex],
    ["stressedNetPresentValue", value.stressedNetPresentValue],
    ["uncertaintyAmount", value.uncertaintyAmount],
    ["lowerBound", value.lowerBound],
    ["upperBound", value.upperBound],
    ["breakEvenAnnualCashFlow", value.breakEvenAnnualCashFlow],
  ] as const;
  const numbers = new Map<string, number>();
  for (const [field, decimal] of required) {
    const converted = present(decimal, field);
    if (!converted.ok) return converted;
    numbers.set(field, converted.value);
  }

  const optional = (
    decimal: Decimal | null,
    field: string,
  ): DomainResult<number | null> => {
    if (decimal === null) return ok(null);
    return present(decimal, field);
  };
  const irr = optional(value.internalRateOfReturn, "internalRateOfReturn");
  if (!irr.ok) return irr;
  const payback = optional(value.simplePaybackYears, "simplePaybackYears");
  if (!payback.ok) return payback;
  const hurdle = optional(value.hurdleRateMargin, "hurdleRateMargin");
  if (!hurdle.ok) return hurdle;

  return ok({
    netPresentValue: numbers.get("netPresentValue")!,
    internalRateOfReturn: irr.value,
    simplePaybackYears: payback.value,
    profitabilityIndex: numbers.get("profitabilityIndex")!,
    stressedNetPresentValue: numbers.get("stressedNetPresentValue")!,
    uncertaintyAmount: numbers.get("uncertaintyAmount")!,
    lowerBound: numbers.get("lowerBound")!,
    upperBound: numbers.get("upperBound")!,
    breakEvenAnnualCashFlow: numbers.get("breakEvenAnnualCashFlow")!,
    hurdleRateMargin: hurdle.value,
    decisionState: value.decisionState,
  });
}

function throwDomainError(error: DomainError): never {
  throw new RangeError(error.code + ":" + error.field + ":" + error.message);
}

export function evaluateInvestmentAppraisal(
  input: InvestmentAppraisalInput,
): InvestmentAppraisalResult {
  const exact = evaluateInvestmentAppraisalResult(input);
  if (!exact.ok) throwDomainError(exact.error);
  const presented = presentInvestmentAppraisalResult(exact.value);
  if (!presented.ok) throwDomainError(presented.error);
  return presented.value;
}

export function validateInvestmentAppraisalInput(
  input: InvestmentAppraisalInput,
): string[] {
  const context = createDecimalContext();
  const parsed = parseInvestmentInput(input, context);
  return parsed.ok
    ? []
    : [parsed.error.code + ":" + parsed.error.field + ":" + parsed.error.message];
}

export function calculateDiscreteNpv(
  initialInvestment: DecimalSource,
  annualCashFlow: DecimalSource,
  discountRate: DecimalSource,
  periods: DecimalSource,
  residualValue: DecimalSource,
): number {
  const result = evaluateInvestmentAppraisalResult({
    initialInvestment,
    annualCashFlow,
    discountRate,
    periods,
    residualValue,
    downsideFactor: "0",
    sourceConfidenceRatio: "1",
    uncertaintyMultiplier: "0",
  });
  if (!result.ok) throwDomainError(result.error);
  const presented = present(result.value.netPresentValue, "netPresentValue");
  if (!presented.ok) throwDomainError(presented.error);
  return presented.value;
}

export function calculateDiscreteNpvResult(
  initialInvestment: DecimalSource,
  annualCashFlow: DecimalSource,
  discountRate: DecimalSource,
  periods: DecimalSource,
  residualValue: DecimalSource,
): DomainResult<Decimal> {
  const context = createDecimalContext();
  const initial = context.decimal(initialInvestment, "initialInvestment");
  if (!initial.ok) return initial;
  const flow = context.decimal(annualCashFlow, "annualCashFlow");
  if (!flow.ok) return flow;
  const rate = context.decimal(discountRate, "discountRate");
  if (!rate.ok) return rate;
  const count = context.decimal(periods, "periods");
  if (!count.ok) return count;
  const terminal = context.decimal(residualValue, "residualValue");
  if (!terminal.ok) return terminal;

  if (!initial.value.gt("0")) {
    return domainViolation(
      "initialInvestment",
      "Initial investment must be greater than zero.",
    );
  }
  if (rate.value.lte("-1") || rate.value.gt(MAX_IRR)) {
    return domainViolation(
      "discountRate",
      "NPV evaluation rate must be greater than -1 and within the IRR search bound.",
    );
  }
  if (
    !count.value.mod("1").eq("0") ||
    count.value.lt("1") ||
    count.value.gt(String(MAX_PERIODS))
  ) {
    return domainViolation(
      "periods",
      "Periods must be a whole number between 1 and " + String(MAX_PERIODS) + ".",
    );
  }
  if (terminal.value.lt("0")) {
    return domainViolation("residualValue", "Residual value cannot be negative.");
  }

  return ok(
    discreteNpv(
      context,
      initial.value,
      flow.value,
      rate.value,
      Number(count.value.toString()),
      terminal.value,
    ),
  );
}

export function calculateConventionalIrr(
  initialInvestment: DecimalSource,
  annualCashFlow: DecimalSource,
  periods: DecimalSource,
  residualValue: DecimalSource,
): number | null {
  const result = evaluateInvestmentAppraisalResult({
    initialInvestment,
    annualCashFlow,
    discountRate: "0",
    periods,
    residualValue,
    downsideFactor: "0",
    sourceConfidenceRatio: "1",
    uncertaintyMultiplier: "0",
  });
  if (!result.ok) throwDomainError(result.error);
  if (result.value.internalRateOfReturn === null) return null;
  const presented = present(
    result.value.internalRateOfReturn,
    "internalRateOfReturn",
  );
  if (!presented.ok) throwDomainError(presented.error);
  return presented.value;
}
