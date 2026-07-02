"use client";

import Link from "@/lib/ui-shared/navigation/next-link";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { ProBadge } from "@/components/os/ProBadge";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { CncStochasticPhaseSlot } from "@/components/tools/pilot/CncStochasticPhaseSlot";
import { calculatePremiumVerdict } from "@/lib/infrastructure/actions/calculate-premium";
import { getCurrentUserIdToken } from "@/lib/infrastructure/firebase/auth";
import { handleNumericInputChange, SC_NUMERIC_INPUT_CLASS } from "@/lib/features/input/numeric-input";
import {
  parsePremiumVerdictTxt,
  verdictSeverity,
  type ParsedPremiumVerdict,
} from "@/lib/features/premium/parse-premium-verdict-txt";
import {
  buildCncMarginCoreInputs,
  calculateCncNaiveCost,
  type CncMachineTimeInputs,
} from "@/lib/features/tools/cnc-logic";
import type { RevenueTool } from "@/lib/features/tools/revenue-tools";
import { getPremiumToolHref } from "@/lib/features/tools/tool-links";

const VERDICT_TONE = {
  safe: "text-safe-green",
  watch: "text-warn-amber",
  danger: "text-crit-red",
} as const;

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface CncMachineTimeCalculatorProps {
  tool: RevenueTool;
}

export function CncMachineTimeCalculator({ tool }: CncMachineTimeCalculatorProps) {
  const t = useTranslations("pilotCnc");

  const [setupTime, setSetupTime] = useState(45);
  const [cycleTime, setCycleTime] = useState(8);
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumParsed, setPremiumParsed] = useState<ParsedPremiumVerdict | null>(null);

  const machineInputs: CncMachineTimeInputs = useMemo(
    () => ({ setupTime, cycleTime, quantity }),
    [setupTime, cycleTime, quantity],
  );

  const naiveResult = useMemo(() => {
    if (!submitted) {
      return null;
    }
    const result = calculateCncNaiveCost(machineInputs);
    return "error" in result ? null : result;
  }, [submitted, machineInputs]);

  const handleCalculate = (event: React.FormEvent) => {
    event.preventDefault();
    const result = calculateCncNaiveCost(machineInputs);
    if ("error" in result) {
      setFormError(result.error);
      setSubmitted(false);
      return;
    }
    setFormError(null);
    setSubmitted(true);
    setPremiumParsed(null);
  };

  const handleUnlockPremium = useCallback(async () => {
    const validation = calculateCncNaiveCost(machineInputs);
    if ("error" in validation) {
      setFormError(validation.error);
      return;
    }

    setPremiumLoading(true);
    setPremiumParsed(null);

    try {
      const idToken = await getCurrentUserIdToken();
      if (!idToken) {
        setPremiumParsed({
          isError: true,
          errorMessage: t("premium.signInRequired"),
          naivePrice: 0,
          riskBuffer: 0,
          p90SafePrice: 0,
          verdict: "",
          matrixRows: [],
          rawTxt: "",
        });
        return;
      }

      const txt = await calculatePremiumVerdict({
        sector: tool.sector,
        inputs: buildCncMarginCoreInputs(machineInputs),
        idToken,
      });

      setPremiumParsed(parsePremiumVerdictTxt(txt));
    } catch {
      setPremiumParsed({
        isError: true,
        errorMessage: t("premium.failed"),
        naivePrice: 0,
        riskBuffer: 0,
        p90SafePrice: 0,
        verdict: "",
        matrixRows: [],
        rawTxt: "",
      });
    } finally {
      setPremiumLoading(false);
    }
  }, [machineInputs, t, tool.sector]);

  const premiumSeverity =
    premiumParsed && !premiumParsed.isError ? verdictSeverity(premiumParsed.verdict) : null;
  const premiumTone = premiumSeverity ? VERDICT_TONE[premiumSeverity] : null;

  return (
    <PageLayout>
      <section className="bg-industrial-matte py-3">
        <Container size="wide" className="min-w-0 font-mono">
          <SectorToolSelect tier="free" currentSlug={tool.freeSlug} />

          <div className="sc-form-result-layout min-w-0 gap-6 lg:items-start">
            <div className="sc-form-shell min-w-0">
              <OsModuleHeader title={tool.freeTitle} tier="utility" />
              <form
                onSubmit={handleCalculate}
                className="sc-form-shell sc-ledger-cetele-form space-y-4"
                noValidate
                data-calculation-form="true"
              >
                <div className="sc-form-field sc-industrial-field">
                  <label htmlFor="cnc-setup-time" className="sc-form-label sc-industrial-field__label">
                    {t("form.setupTime")}
                  </label>
                  <input
                    id="cnc-setup-time"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    className={`sc-form-control sc-ledger-input-boxed sc-industrial-input ${SC_NUMERIC_INPUT_CLASS}`}
                    value={String(setupTime)}
                    onChange={(event) => {
                      const { numeric } = handleNumericInputChange(event.target.value, {
                        allowDecimal: false,
                      });
                      setSetupTime(numeric);
                    }}
                  />
                </div>
                <div className="sc-form-field sc-industrial-field">
                  <label htmlFor="cnc-cycle-time" className="sc-form-label sc-industrial-field__label">
                    {t("form.cycleTime")}
                  </label>
                  <input
                    id="cnc-cycle-time"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    required
                    className={`sc-form-control sc-ledger-input-boxed sc-industrial-input ${SC_NUMERIC_INPUT_CLASS}`}
                    value={String(cycleTime)}
                    onChange={(event) => {
                      const { numeric } = handleNumericInputChange(event.target.value);
                      setCycleTime(numeric);
                    }}
                  />
                </div>
                <div className="sc-form-field sc-industrial-field">
                  <label htmlFor="cnc-quantity" className="sc-form-label sc-industrial-field__label">
                    {t("form.quantity")}
                  </label>
                  <input
                    id="cnc-quantity"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    className={`sc-form-control sc-ledger-input-boxed sc-industrial-input ${SC_NUMERIC_INPUT_CLASS}`}
                    value={String(quantity)}
                    onChange={(event) => {
                      const { numeric } = handleNumericInputChange(event.target.value, {
                        allowDecimal: false,
                      });
                      setQuantity(Math.max(1, numeric));
                    }}
                  />
                </div>

                {formError ? (
                  <p className="sc-form-error sc-industrial-field__error" role="alert">
                    {formError}
                  </p>
                ) : null}

                <div className="sc-form-actions sc-industrial-form-actions">
                  <button type="submit" className="sc-cta-primary">
                    Run
                  </button>
                </div>
              </form>
            </div>

            <div className="sc-form-result-panel min-w-0 space-y-4">
              {submitted && naiveResult ? (
                <div className="space-y-2 text-sm">
                  <p className="sc-result-nowrap font-semibold text-premium-velvet">{formatUsd(naiveResult.naiveCost)}</p>
                  <p className="text-body-charcoal">
                    {naiveResult.totalMinutes.toFixed(1)} min · {naiveResult.machineHours.toFixed(2)} hr
                  </p>
                </div>
              ) : null}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-body-charcoal">{t("premium.title")}</h2>
                  <ProBadge />
                </div>
                <button
                  type="button"
                  disabled={!submitted || premiumLoading}
                  onClick={() => void handleUnlockPremium()}
                  className="sc-cta-primary disabled:opacity-50"
                >
                  {premiumLoading ? "…" : "Run"}
                </button>
              </div>

              {premiumParsed?.isError ? (
                <p className="text-xs text-crit-red status-crit" role="alert">
                  {premiumParsed.errorMessage}{" "}
                  <Link href="/login" className="text-deep-navy underline">
                    {t("premium.signInLink")}
                  </Link>
                </p>
              ) : null}

              <CncStochasticPhaseSlot enabled={submitted} premiumVerdict={premiumParsed}>
                {premiumParsed && !premiumParsed.isError && premiumTone ? (
                  <div className="space-y-2 text-sm">
                    <p className={premiumTone}>{premiumParsed.verdict}</p>
                    <p className="sc-result-nowrap font-semibold text-premium-velvet">{formatUsd(premiumParsed.p90SafePrice)}</p>
                    <Link href={getPremiumToolHref(tool)} className="text-xs text-body-charcoal underline">
                      {t("premium.fullAnalyzerLink")}
                    </Link>
                  </div>
                ) : null}
              </CncStochasticPhaseSlot>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
