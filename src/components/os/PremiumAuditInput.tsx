"use client";

import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ExpertVerdictPanel } from "@/components/reports/ExpertVerdictPanel";
import { useOperationalAudit } from "@/lib/os/hooks/use-operational-audit";
import {
  hasSectorSmartModule,
  SmartModuleIds,
  resolveSectorParamLabel,
  resolveSectorTitle,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import { sanitizeNumericInput } from "@/lib/input/numeric-input";

export interface PremiumAuditInputProps {
  sectorId: SectorRegistryKey;
}

export function PremiumAuditInput({ sectorId }: PremiumAuditInputProps) {
  const { sector, t, report, benchmark, intelligence, inputError, runAudit, resetAudit } =
    useOperationalAudit(sectorId);

  const params = sector.params;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState("");
  const [stepError, setStepError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentParam = params[step];
  const isLastStep = step === params.length - 1;
  const sectorTitle = resolveSectorTitle(sector, t);

  const commitCurrentValue = (): boolean => {
    const parsed = parseFloat(draft);
    if (!Number.isFinite(parsed)) {
      setStepError(true);
      return false;
    }

    setStepError(false);
    const nextValues = { ...values, [currentParam]: parsed };
    setValues(nextValues);
    setDraft("");

    if (isLastStep) {
      runAudit(nextValues);
      return true;
    }

    setStep((current) => current + 1);
    return true;
  };

  const handleNext = () => {
    commitCurrentValue();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitCurrentValue();
    }
  };

  const handleRestart = () => {
    setStep(0);
    setValues({});
    setDraft("");
    resetAudit();
    inputRef.current?.focus();
  };

  if (report) {
    return (
      <ExpertVerdictPanel
        sectorTitle={sectorTitle}
        status={report.status}
        variancePct={report.variancePct}
        financialLoss={report.financialLoss}
        intelligence={intelligence}
        features={sector.features}
        benchmark={benchmark}
        showBenchmark={hasSectorSmartModule(sector, SmartModuleIds.benchmarking)}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="ind-os-panel mx-auto max-w-2xl p-5 font-sans">
      <p className="label-badge text-body-charcoal">{sectorTitle}</p>

      <div className="mb-10 mt-4">
        <span className="label-badge text-body-charcoal">
          {t("premiumAudit.stepLabel", { current: step + 1, total: params.length })}
        </span>
        <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-premium-velvet sm:text-3xl">
          {resolveSectorParamLabel(sector, currentParam, t)}
        </h2>
      </div>

      <input
        ref={inputRef}
        key={step}
        autoFocus
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={draft}
        className="data-value w-full border-b border-technical-gray bg-transparent pb-4 text-4xl text-premium-velvet outline-none transition-all placeholder:text-body-charcoal/40 focus:border-premium-velvet focus:outline-none sm:text-5xl"
        placeholder="0.00"
        aria-label={resolveSectorParamLabel(sector, currentParam, t)}
        onChange={(event) => {
          setDraft(sanitizeNumericInput(event.target.value));
          setStepError(false);
        }}
        onKeyDown={handleKeyDown}
      />

      {stepError || inputError ? (
        <p className="mt-4 text-xs text-crit-red status-crit" role="alert">
          {t("premiumAudit.invalidValue")}
        </p>
      ) : null}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center text-xs font-semibold uppercase tracking-wider text-body-charcoal transition-all hover:text-premium-velvet"
        >
          {isLastStep ? t("auditPanel.runAudit") : t("premiumAudit.nextParameter")}
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
