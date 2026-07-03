// SectorCalc V5.3.1 — Server-Only Impact Engine
// No default carbon price. No runtime LLM. No exact formula expression in public output.

import "server-only";

import type { ServerImpactInput, ServerImpactOutput } from "./monetization-types";
import { B2B_MONETIZATION_REGISTRY } from "./monetization-registry";

const SAFETY_NOTE =
  "Estimated decision-support metric. Not a certified, legal, tax, or regulatory result." as const;

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function insufficient(
  painMetricKey: string,
  unit: string,
  displayCurrency: string | null,
  publicLabel: string,
  publicExplanation: string,
): ServerImpactOutput {
  return {
    painMetricKey,
    value: null,
    unit,
    displayCurrency,
    confidence: "INSUFFICIENT_INPUT",
    status: "INSUFFICIENT_INPUT",
    publicLabel,
    publicExplanation,
    safetyNote: SAFETY_NOTE,
  };
}

type ImpactModel = (input: ServerImpactInput) => ServerImpactOutput;

const IMPACT_MODELS: Record<string, ImpactModel> = {
  OEE_GAP_TO_MONTHLY_LOSS_V1: (input) => {
    const oee = numberOrNull(input.freeOutputs.oee_percentage);
    const shiftHours = numberOrNull(input.normalizedInputs.shift_hours);
    const hourlyRate = numberOrNull(input.normalizedInputs.machine_hourly_rate);

    if (oee === null || shiftHours === null || hourlyRate === null) {
      return insufficient(
        "estimated_monthly_downtime_loss",
        input.displayCurrency ?? "USD",
        input.displayCurrency,
        "Estimated Monthly Loss",
        "Additional production-time and machine-rate inputs are required to estimate the monthly loss.",
      );
    }

    const gapToReference = Math.max(0, 85 - oee);
    const estimatedLoss = Math.round(
      (gapToReference / 100) * shiftHours * hourlyRate * 20,
    );

    return {
      painMetricKey: "estimated_monthly_downtime_loss",
      value: estimatedLoss,
      unit: input.displayCurrency ?? "USD",
      displayCurrency: input.displayCurrency,
      confidence: "MEDIUM",
      status: "AVAILABLE",
      publicLabel: "Estimated Monthly Loss",
      publicExplanation:
        "Estimates financial exposure from the OEE gap using user-entered operating time and machine-rate context.",
      safetyNote: SAFETY_NOTE,
    };
  },

  SETUP_TIME_TO_ANNUAL_COST_V1: (input) => {
    const setupTimeMinutes = numberOrNull(input.freeOutputs.setup_time_minutes);
    const dailyBatches = numberOrNull(input.normalizedInputs.daily_batches);
    const operatingDays = numberOrNull(
      input.normalizedInputs.operating_days_per_year,
    );
    const hourlyRate = numberOrNull(
      input.normalizedInputs.machine_hourly_rate,
    );

    if (
      setupTimeMinutes === null ||
      dailyBatches === null ||
      operatingDays === null ||
      hourlyRate === null
    ) {
      return insufficient(
        "estimated_annual_setup_cost",
        input.displayCurrency ?? "USD",
        input.displayCurrency,
        "Estimated Annual Setup Cost",
        "Setup time, batch frequency, operating days, and machine-hour rate are required to estimate annual setup cost.",
      );
    }

    const estimatedCost = Math.round(
      (setupTimeMinutes / 60) * dailyBatches * operatingDays * hourlyRate,
    );

    return {
      painMetricKey: "estimated_annual_setup_cost",
      value: estimatedCost,
      unit: input.displayCurrency ?? "USD",
      displayCurrency: input.displayCurrency,
      confidence: "MEDIUM",
      status: "AVAILABLE",
      publicLabel: "Estimated Annual Setup Cost",
      publicExplanation:
        "Estimates annual setup exposure from user-entered setup time, batch frequency, operating days, and machine-hour rate.",
      safetyNote: SAFETY_NOTE,
    };
  },

  CARBON_EXPOSURE_SCREENING_V1: (input) => {
    const emissions = numberOrNull(
      input.freeOutputs.embedded_emissions_tco2e,
    );
    const carbonPrice = numberOrNull(
      input.normalizedInputs.assumed_carbon_price_eur,
    );

    if (emissions === null || carbonPrice === null) {
      return insufficient(
        "estimated_carbon_cost_exposure",
        "EUR",
        "EUR",
        "Estimated Carbon Cost Exposure",
        "Embedded emissions and a user-verified carbon price assumption are required to estimate carbon cost exposure.",
      );
    }

    const estimatedExposure = Math.round(emissions * carbonPrice);

    return {
      painMetricKey: "estimated_carbon_cost_exposure",
      value: estimatedExposure,
      unit: "EUR",
      displayCurrency: "EUR",
      confidence: "LOW",
      status: "AVAILABLE",
      publicLabel: "Estimated Carbon Cost Exposure",
      publicExplanation:
        "Estimates carbon cost exposure using user-entered emissions and a user-verified carbon price assumption.",
      safetyNote: SAFETY_NOTE,
    };
  },
};

export function calculateServerImpact(
  input: ServerImpactInput,
): ServerImpactOutput | null {
  const config = B2B_MONETIZATION_REGISTRY[input.toolKey];
  if (!config) return null;

  const model = IMPACT_MODELS[config.impactModelId];
  if (!model) return null;

  return model(input);
}
