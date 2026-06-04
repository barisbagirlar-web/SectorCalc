"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ToolDefinition } from "@/data/tool-schema";
import { ToolForm } from "@/components/tools/ToolForm";
import { ToolResultPanel } from "@/components/tools/ToolResultPanel";
import { ExportToolbar } from "@/components/tools/ExportToolbar";
import { RiskVerdictCard } from "@/components/tools/RiskVerdictCard";
import { ScenarioAnalysisPanel } from "@/components/tools/ScenarioAnalysisPanel";
import { PremiumDecisionReportPanel } from "@/components/tools/PremiumDecisionReportPanel";
import {
  getDefaultInputValues,
  runCalculator,
  validateCalculatorInput,
} from "@/lib/calculators/registry";
import { formatCurrency } from "@/lib/format/currency";
import { industrySlugToLeadValue } from "@/data/lead-options";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";

interface ToolCalculatorEngineProps {
  definition: ToolDefinition;
}

export function ToolCalculatorEngine({ definition }: ToolCalculatorEngineProps) {
  const hasDecisionReport = Boolean(definition.features?.decisionReport);
  const toolSlug = definition.slug;
  const industryLeadValue = industrySlugToLeadValue(definition.industryId);

  const [values, setValues] = useState<Record<string, number | string>>(() =>
    getDefaultInputValues(definition.inputs)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const formStartedRef = useRef(false);
  const calculatedRef = useRef(false);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.tool_view, {
      toolSlug,
      tier: definition.tier,
    });
  }, [toolSlug, definition.tier]);

  const validate = useCallback(
    (nextValues: Record<string, number | string>) => {
      return validateCalculatorInput(definition.calculatorId, nextValues);
    },
    [definition.calculatorId]
  );

  const computed = useMemo(() => {
    const validationErrors = validate(values);
    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      return { results: [], premium: undefined, hasErrors: true };
    }
    const output = runCalculator(definition.calculatorId, values);
    return {
      results: output?.results ?? [],
      premium: output?.premium,
      hasErrors: false,
    };
  }, [definition.calculatorId, values, validate]);

  useEffect(() => {
    if (
      !calculatedRef.current &&
      computed.results.length > 0 &&
      !computed.hasErrors
    ) {
      calculatedRef.current = true;
      trackEvent(ANALYTICS_EVENTS.calculation_completed, {
        toolSlug,
        tier: definition.tier,
        calculatorId: definition.calculatorId,
      });
    }
  }, [
    computed.results.length,
    computed.hasErrors,
    toolSlug,
    definition.tier,
    definition.calculatorId,
  ]);

  const displayErrors = useMemo(() => {
    const validationErrors = validate(values);
    const filtered: Record<string, string> = {};
    for (const [key, message] of Object.entries(validationErrors)) {
      if (touched[key] || errors[key]) {
        filtered[key] = message;
      }
    }
    return { ...filtered, ...errors };
  }, [values, validate, touched, errors]);

  const scenariosSummary = useMemo(() => {
    if (!computed.premium?.scenarios.length) return "";
    const { scenarioLabels } = computed.premium;
    return computed.premium.scenarios
      .map((s) => {
        const secondary =
          s.secondaryFormat === "percent"
            ? `${s.secondaryValue.toFixed(1)}%`
            : formatCurrency(s.secondaryValue);
        return `${s.label}: ${formatCurrency(s.primaryValue)} at ${s.metricDisplay} (${scenarioLabels.secondary}: ${secondary}).`;
      })
      .join(" ");
  }, [computed.premium]);

  const handleChange = (id: string, value: number | string) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent(ANALYTICS_EVENTS.form_started, { toolSlug });
    }
    const nextValues = { ...values, [id]: value };
    setValues(nextValues);
    calculatedRef.current = false;
    if (touched[id]) {
      const validationErrors = validate(nextValues);
      setErrors(validationErrors);
    }
  };

  const handleBlur = (id: string) => {
    setTouched((prev) => ({ ...prev, [id]: true }));
    const validationErrors = validate(values);
    setErrors(validationErrors);
  };

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start">
        <div className="order-1 min-w-0 rounded-xl border border-slate/15 bg-white p-6 shadow-card sm:p-7">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate">
            Inputs
          </p>
          <h2 className="mb-6 text-lg font-bold text-deep-navy">Calculation parameters</h2>
          <ToolForm
            inputs={definition.inputs}
            values={values}
            errors={displayErrors}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <div className="order-2 min-w-0 space-y-4">
          <ToolResultPanel
            results={computed.results}
            interpretationNote={definition.interpretationNote}
            hasErrors={computed.hasErrors}
            dense={hasDecisionReport}
          />
          {computed.premium && !computed.hasErrors && (
            <RiskVerdictCard
              riskLevel={computed.premium.riskLevel}
              riskLevelLabel={computed.premium.report.riskLevelLabel}
              verdictText={computed.premium.verdictText}
            />
          )}
        </div>
      </div>

      {computed.premium && !computed.hasErrors && (
        <div className="order-3 min-w-0 space-y-8">
          <ScenarioAnalysisPanel
            scenarios={computed.premium.scenarios}
            labels={computed.premium.scenarioLabels}
          />
          <PremiumDecisionReportPanel
            report={computed.premium.report}
            riskLevel={computed.premium.riskLevel}
            scenariosSummary={scenariosSummary}
            toolSlug={toolSlug}
            toolTitle={definition.title}
            industryLeadValue={industryLeadValue}
          />
        </div>
      )}

      <div className={`min-w-0 ${computed.premium ? "order-4" : "order-3"}`}>
        <ExportToolbar
          toolSlug={toolSlug}
          toolTitle={definition.title}
          industryLeadValue={industryLeadValue}
        />
      </div>
    </div>
  );
}
