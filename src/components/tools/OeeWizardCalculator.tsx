"use client";

import { useState, useMemo, useEffect } from "react";

import Link  from "next/link";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/analytics/revenue-events";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { getToolHref } from "@/lib/tools/paths";
import type { FreeTrafficTool } from "@/lib/tools/free-traffic-catalog";

interface OeeWizardCalculatorProps {
  tool: FreeTrafficTool;
}

export function OeeWizardCalculator({ tool }: OeeWizardCalculatorProps) {
  /*
   * STATIC ANALYSIS TRACE:
   * Inputs: plannedTime = 480, downtime = 52, idealCycleTime = 0.6, totalCount = 620, defectCount = 28
   * Calculations:
   *   runTime = 480 - 52 = 428 min
   *   availability = 428 / 480 = 0.8917 (89.2%)
   *   performance = (0.6 * 620) / 428 = 0.8692 (86.9%)
   *   quality = (620 - 28) / 620 = 0.9548 (95.5%)
   *   oee = 0.8917 * 0.8692 * 0.9548 * 100 = 74.0%
   * Output: OEE = 74.0%
   */
  
  
  const locale = "en";
  const attribution = useAttributionContext();

  const [step, setStep] = useState(1);
  const [plannedTime, setPlannedTime] = useState("480");
  const [downtime, setDowntime] = useState("52");
  const [idealCycleTime, setIdealCycleTime] = useState("0.6");
  const [totalCount, setTotalCount] = useState("620");
  const [defectCount, setDefectCount] = useState("28");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasCalculated, setHasCalculated] = useState(false);

  // Conversion rates and stats calculation
  const calculations = useMemo(() => {
    const P = parseFloat(plannedTime.replace(/,/g, ".")) || 0;
    const D = parseFloat(downtime.replace(/,/g, ".")) || 0;
    const C = parseFloat(idealCycleTime.replace(/,/g, ".")) || 0;
    const N = parseFloat(totalCount.replace(/,/g, ".")) || 0;
    const F = parseFloat(defectCount.replace(/,/g, ".")) || 0;

    let runTime = 0;
    let availability = 0;
    let performance = 0;
    let quality = 0;
    let oee = 0;

    if (P > 0) {
      runTime = Math.max(P - D, 0);
      availability = runTime / P;
    }
    if (runTime > 0) {
      // Capped at 1.2 (120%) as per requirement
      performance = Math.min((C * N) / runTime, 1.2);
    }
    if (N > 0) {
      quality = Math.max((N - F) / N, 0);
    }
    oee = availability * performance * quality * 100;

    return {
      runTime,
      availability,
      performance,
      quality,
      oee: Number.isFinite(oee) ? oee : 0,
    };
  }, [plannedTime, downtime, idealCycleTime, totalCount, defectCount]);

  // Track initial tool open
  useEffect(() => {
    trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
      toolSlug: tool.slug,
      source: "oee_wizard",
    });
  }, [tool.slug]);

  // Formats locale-aware decimals
  const formatPct = (val: number) => {
    const formatted = (val * 100).toFixed(1);
    return false ? formatted.replace(".", ",") : formatted;
  };

  // Validate step inputs
  const validateStep = (s: number): boolean => {
    const nextErrors: Record<string, string> = {};
    if (s === 1) {
      const P = parseFloat(plannedTime.replace(/,/g, "."));
      const D = parseFloat(downtime.replace(/,/g, "."));
      if (isNaN(P) || P <= 0) {
        nextErrors.plannedTime = `plannedtime.label` + " > 0";
      }
      if (isNaN(D) || D < 0) {
        nextErrors.downtime = `downtime.label` + " ≥ 0";
      }
      if (!isNaN(P) && !isNaN(D) && D > P) {
        nextErrors.downtime = "Downtime cannot exceed planned time.";
      }
    } else if (s === 2) {
      const C = parseFloat(idealCycleTime.replace(/,/g, "."));
      const N = parseFloat(totalCount.replace(/,/g, "."));
      if (isNaN(C) || C <= 0) {
        nextErrors.idealCycleTime = `idealcycletime.label` + " > 0";
      }
      if (isNaN(N) || N < 0) {
        nextErrors.totalCount = `totalcount.label` + " ≥ 0";
      }
    } else if (s === 3) {
      const N = parseFloat(totalCount.replace(/,/g, "."));
      const F = parseFloat(defectCount.replace(/,/g, "."));
      if (isNaN(F) || F < 0) {
        nextErrors.defectCount = `defectcount.label` + " ≥ 0";
      }
      if (!isNaN(N) && !isNaN(F) && F > N) {
        nextErrors.defectCount = "Defect count cannot exceed total parts.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Trigger calculation reveal
        setStep(4);
        setHasCalculated(true);
        trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
          toolSlug: tool.slug,
          source: "oee_wizard",
        });
        trackConversionEvent({
          stage: "calculation",
          eventName: "free_tool_calculate",
          locale,
          pagePath: `/tools/free/${tool.slug}`,
          toolSlug: tool.slug,
          campaignId: attribution.utmCampaign,
          source: attribution.utmSource,
          medium: attribution.utmMedium,
          valueType: "free",
          category: tool.category,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setStep(1);
    setHasCalculated(false);
    setPlannedTime("480");
    setDowntime("52");
    setIdealCycleTime("0.6");
    setTotalCount("620");
    setDefectCount("28");
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep < step || validateStep(step)) {
      setStep(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Verdict tone and range text
  const oeeVal = calculations.oee;
  let oeeBandClass = "border-technical-gray bg-white text-text-primary";
  let oeeBandText = `Typical production range · 60–85%`;
  let stickyBorder = "border-technical-gray";

  if (oeeVal >= 85) {
    oeeBandClass = "border-[#3F7A52] bg-[#3F7A52]/10 text-[#3F7A52]";
    oeeBandText = `World-class threshold · ≥85%`;
    stickyBorder = "border-[#3F7A52]";
  } else if (oeeVal < 60) {
    oeeBandClass = "border-[#BD5D3A] bg-[#BD5D3A]/10 text-[#BD5D3A]";
    oeeBandText = `Improvement critical · <60%`;
    stickyBorder = "border-[#BD5D3A]";
  }

  // Pre-calculated Pro Upsell Href
  const proUrl = getToolHref("premium", "cnc-oee-loss");

  return (
    <div className="sc-reveal min-w-0 max-w-full">
      {/* STEPPER PROGRESS INDICATOR */}
      {step <= 3 && (
        <nav aria-label={`Step`} className="mb-6 flex gap-4 md:gap-8 px-2 md:px-0">
          <button
            onClick={() => handleStepClick(1)}
            className={`flex-1 border-t-2 pt-2 text-left transition-all ${
              step === 1 ? "border-[#BD5D3A]" : step > 1 ? "border-[#BD5D3A]/60" : "border-technical-gray"
            }`}
          >
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary block">
              {`1 · Availability`}
            </span>
          </button>
          <button
            onClick={() => handleStepClick(2)}
            disabled={step < 2 && !validateStep(1)}
            className={`flex-1 border-t-2 pt-2 text-left transition-all ${
              step === 2 ? "border-[#BD5D3A]" : step > 2 ? "border-[#BD5D3A]/60" : "border-technical-gray"
            }`}
          >
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary block">
              {`2 · Performance`}
            </span>
          </button>
          <button
            onClick={() => handleStepClick(3)}
            disabled={step < 3 && (!validateStep(1) || !validateStep(2))}
            className={`flex-1 border-t-2 pt-2 text-left transition-all ${
              step === 3 ? "border-[#BD5D3A]" : "border-technical-gray"
            }`}
          >
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary block">
              {`3 · Quality`}
            </span>
          </button>
        </nav>
      )}

      {/* INPUT STEPS PANELS */}
      {step === 1 && (
        <section className="sc-industrial-panel sc-ledger-panel p-4 md:p-6 mb-8 border border-technical-gray bg-white">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
            {`Step 1 / 3 · Availability`}
          </h2>
          <p className="text-lg md:text-xl font-serif mb-6 text-text-primary">
            {`How long was the machine scheduled to run, and how much did it stop?`}
          </p>

          <div className="space-y-5">
            <div className="sc-industrial-field">
              <label htmlFor="plannedTime" className="sc-industrial-field__label block font-semibold text-xs text-text-secondary mb-2">
                {`plannedtime.label`}
                <span className="font-normal block mt-1 text-[11px] text-text-secondary/70">
                  {`plannedtime.helper`}
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="plannedTime"
                  type="text"
                  inputMode="decimal"
                  value={plannedTime}
                  onChange={(e) => {
                    setPlannedTime(e.target.value);
                    setErrors((prev) => ({ ...prev, plannedTime: "" }));
                  }}
                  className={`sc-ledger-input-underline w-full font-mono text-2xl p-4 pr-12 bg-bg-industrial-matte border-b ${
                    errors.plannedTime ? "border-red-500 bg-red-50" : "border-technical-gray"
                  }`}
                />
                <span className="absolute right-4 font-mono text-xs text-text-secondary/70">min</span>
              </div>
              {errors.plannedTime && (
                <p className="text-red-500 font-mono text-[11px] mt-1.5" role="alert">
                  {errors.plannedTime}
                </p>
              )}
            </div>

            <div className="sc-industrial-field">
              <label htmlFor="downtime" className="sc-industrial-field__label block font-semibold text-xs text-text-secondary mb-2">
                {`downtime.label`}
                <span className="font-normal block mt-1 text-[11px] text-text-secondary/70">
                  {`downtime.helper`}
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="downtime"
                  type="text"
                  inputMode="decimal"
                  value={downtime}
                  onChange={(e) => {
                    setDowntime(e.target.value);
                    setErrors((prev) => ({ ...prev, downtime: "" }));
                  }}
                  className={`sc-ledger-input-underline w-full font-mono text-2xl p-4 pr-12 bg-bg-industrial-matte border-b ${
                    errors.downtime ? "border-red-500 bg-red-50" : "border-technical-gray"
                  }`}
                />
                <span className="absolute right-4 font-mono text-xs text-text-secondary/70">min</span>
              </div>
              {errors.downtime && (
                <p className="text-red-500 font-mono text-[11px] mt-1.5" role="alert">
                  {errors.downtime}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="sc-industrial-panel sc-ledger-panel p-4 md:p-6 mb-8 border border-technical-gray bg-white">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
            {`Step 2 / 3 · Performance`}
          </h2>
          <p className="text-lg md:text-xl font-serif mb-6 text-text-primary">
            {`How much should it have produced at ideal speed, and how much did it actually produce?`}
          </p>

          <div className="space-y-5">
            <div className="sc-industrial-field">
              <label htmlFor="idealCycleTime" className="sc-industrial-field__label block font-semibold text-xs text-text-secondary mb-2">
                {`idealcycletime.label`}
                <span className="font-normal block mt-1 text-[11px] text-text-secondary/70">
                  {`idealcycletime.helper`}
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="idealCycleTime"
                  type="text"
                  inputMode="decimal"
                  value={idealCycleTime}
                  onChange={(e) => {
                    setIdealCycleTime(e.target.value);
                    setErrors((prev) => ({ ...prev, idealCycleTime: "" }));
                  }}
                  className={`sc-ledger-input-underline w-full font-mono text-2xl p-4 pr-24 bg-bg-industrial-matte border-b ${
                    errors.idealCycleTime ? "border-red-500 bg-red-50" : "border-technical-gray"
                  }`}
                />
                <span className="absolute right-4 font-mono text-xs text-text-secondary/70">min/pcs</span>
              </div>
              {errors.idealCycleTime && (
                <p className="text-red-500 font-mono text-[11px] mt-1.5" role="alert">
                  {errors.idealCycleTime}
                </p>
              )}
            </div>

            <div className="sc-industrial-field">
              <label htmlFor="totalCount" className="sc-industrial-field__label block font-semibold text-xs text-text-secondary mb-2">
                {`totalcount.label`}
                <span className="font-normal block mt-1 text-[11px] text-text-secondary/70">
                  {`totalcount.helper`}
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="totalCount"
                  type="text"
                  inputMode="decimal"
                  value={totalCount}
                  onChange={(e) => {
                    setTotalCount(e.target.value);
                    setErrors((prev) => ({ ...prev, totalCount: "" }));
                  }}
                  className={`sc-ledger-input-underline w-full font-mono text-2xl p-4 pr-16 bg-bg-industrial-matte border-b ${
                    errors.totalCount ? "border-red-500 bg-red-50" : "border-technical-gray"
                  }`}
                />
                <span className="absolute right-4 font-mono text-xs text-text-secondary/70">pcs</span>
              </div>
              {errors.totalCount && (
                <p className="text-red-500 font-mono text-[11px] mt-1.5" role="alert">
                  {errors.totalCount}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="sc-industrial-panel sc-ledger-panel p-4 md:p-6 mb-8 border border-technical-gray bg-white">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
            {`Step 3 / 3 · Quality`}
          </h2>
          <p className="text-lg md:text-xl font-serif mb-6 text-text-primary">
            {`How many produced units were not perfect first-time-through?`}
          </p>

          <div className="space-y-5">
            <div className="sc-industrial-field">
              <label htmlFor="defectCount" className="sc-industrial-field__label block font-semibold text-xs text-text-secondary mb-2">
                {`defectcount.label`}
                <span className="font-normal block mt-1 text-[11px] text-text-secondary/70">
                  {`defectcount.helper`}
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="defectCount"
                  type="text"
                  inputMode="decimal"
                  value={defectCount}
                  onChange={(e) => {
                    setDefectCount(e.target.value);
                    setErrors((prev) => ({ ...prev, defectCount: "" }));
                  }}
                  className={`sc-ledger-input-underline w-full font-mono text-2xl p-4 pr-16 bg-bg-industrial-matte border-b ${
                    errors.defectCount ? "border-red-500 bg-red-50" : "border-technical-gray"
                  }`}
                />
                <span className="absolute right-4 font-mono text-xs text-text-secondary/70">pcs</span>
              </div>
              {errors.defectCount && (
                <p className="text-red-500 font-mono text-[11px] mt-1.5" role="alert">
                  {errors.defectCount}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RESULT DASHBOARD */}
      {step === 4 && (
        <section className="sc-result-reveal min-w-0 max-w-full">
          {/* Main Verdict Display */}
          <div className="border border-technical-gray bg-white p-6 mb-6 text-center shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70 mb-2">
              {`Overall Equipment Effectiveness (OEE)`}
            </p>
            <div className="font-serif text-6xl md:text-7xl font-semibold text-[#111111] mb-4">
              {formatPct(calculations.oee)}%
            </div>
            <div className={`inline-block border px-4 py-2 font-mono text-[11px] uppercase tracking-wider ${oeeBandClass}`}>
              {oeeBandText}
            </div>
          </div>

          {/* Availability, Performance, Quality Split */}
          <div className="grid grid-cols-3 gap-px bg-technical-gray border border-technical-gray mb-6">
            <div className="bg-[#FAF9F5] p-4 text-center">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary/70 block mb-1">
                {`Availability`}
              </span>
              <span className="font-mono text-lg md:text-xl font-bold text-[#111111]">
                {formatPct(calculations.availability)}%
              </span>
            </div>
            <div className="bg-[#FAF9F5] p-4 text-center">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary/70 block mb-1">
                {`Performance`}
              </span>
              <span className="font-mono text-lg md:text-xl font-bold text-[#111111]">
                {formatPct(calculations.performance)}%
              </span>
            </div>
            <div className="bg-[#FAF9F5] p-4 text-center">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary/70 block mb-1">
                {`Quality`}
              </span>
              <span className="font-mono text-lg md:text-xl font-bold text-[#111111]">
                {formatPct(calculations.quality)}%
              </span>
            </div>
          </div>

          {/* AI insights & Upsell card */}
          <div className="border border-technical-gray bg-white p-5 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-4 border-b border-technical-gray/50 pb-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#BD5D3A] font-semibold flex items-center gap-1.5">
                ⬢ {`AI Insights`}
              </h3>
              <span className="font-mono text-[9px] border border-technical-gray px-2 py-0.5 text-text-secondary/70 bg-bg-industrial-matte uppercase">
                {`Pro`}
              </span>
            </div>

            <p className="text-sm text-text-primary leading-relaxed mb-4">
              <span className="font-mono text-[10px] bg-[#3F7A52] text-white px-2 py-0.5 font-bold mr-2 uppercase tracking-wide">
                {`DEFINITE`}
              </span>
              {formatPct(calculations.oee)}% OEE shows that the primary loss occurs in{" "}
                  <b>
                    {calculations.availability <= calculations.performance &&
                    calculations.availability <= calculations.quality
                      ? "Availability"
                      : calculations.performance <= calculations.availability &&
                        calculations.performance <= calculations.quality
                      ? "Performance"
                      : "Quality"}
                  </b>{" "}
                  (%
                  {formatPct(
                    calculations.availability <= calculations.performance &&
                    calculations.availability <= calculations.quality
                      ? calculations.availability
                      : calculations.performance <= calculations.availability &&
                        calculations.performance <= calculations.quality
                      ? calculations.performance
                      : calculations.quality
                  )}
                  ).
            </p>

            <p className="text-sm text-text-primary/30 select-none blur-sm pointer-events-none mb-3 leading-relaxed">
              <span className="font-mono text-[10px] bg-[#BD5D3A] text-white px-2 py-0.5 font-bold mr-2 uppercase tracking-wide">
                {`STRONG PROBABILITY`}
              </span>
              The largest loss category is Performance; compared to ideal cycle, the line runs ~12% slow on average. Micro-stops and speed losses are likely root causes.
            </p>

            <p className="text-sm text-text-primary/30 select-none blur-sm pointer-events-none mb-4 leading-relaxed">
              <span className="font-mono text-[10px] bg-[#B98900] text-white px-2 py-0.5 font-bold mr-2 uppercase tracking-wide">
                {`ASSUMPTION`}
              </span>
              Reducing quality loss by 1 percentage point saves ≈€14,500/year in recovery; the most critical intervention is incoming material acceptance threshold.
            </p>

            <div className="bg-[#111111] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <span className="text-white text-xs text-center sm:text-left">
                {`Full commentary, loss tree and financial €-impact are unlocked in Pro.`}
              </span>
              <Link
                href={proUrl}
                className="bg-[#BD5D3A] hover:bg-[#9E4A2D] text-white font-mono text-xs font-semibold px-4 py-2 uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                {`Unlock Pro →`}
              </Link>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-4 mb-24 px-1 md:px-0">
            <Link
              href={proUrl}
              className="flex-1 bg-white hover:bg-bg-industrial-matte border border-technical-gray text-center font-semibold text-sm p-4 text-text-primary block transition-colors"
            >
              {`Download PDF Report ↓`}
            </Link>
            <button
              onClick={handleRestart}
              className="border border-technical-gray bg-[#FAF9F5] hover:bg-[#E8E5DA] text-text-secondary p-4 flex items-center justify-center transition-colors"
              aria-label={`Restart`}
              style={{ width: "56px" }}
            >
              ↺
            </button>
          </div>
        </section>
      )}

      {/* NAVIGATION BUTTONS */}
      {step <= 3 && (
        <div className="flex gap-4 mt-6 mb-24 px-2 md:px-0">
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="border border-[#111111] text-[#111111] hover:bg-bg-industrial-matte font-semibold text-sm p-4 transition-all"
              style={{ width: "120px" }}
            >
              {`← Back`}
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 font-semibold text-sm p-4 text-white transition-all ${
              step < 3 ? "bg-[#111111] hover:bg-black" : "bg-[#BD5D3A] hover:bg-[#9E4A2D]"
            }`}
          >
            {step < 3 ? `Next →` : `See Results →`}
          </button>
        </div>
      )}

      {/* STICKY LIVE BOTTOM PANEL */}
      <div
        className={`fixed bottom-0 left-50 transform -translate-x-1/2 w-full max-w-[768px] z-50 bg-[#111111] border-t-2 px-5 py-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-lg flex items-center justify-between gap-4 transition-all ${stickyBorder}`}
        style={{ left: "50%" }}
      >
        <div className="min-w-0">
          <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary/70 flex items-center gap-1.5 mb-1">
            <span className="w-1.5 height-1.5 bg-[#3F7A52] rounded-full inline-block animate-pulse" style={{ width: "6px", height: "6px" }} />
            {`Live OEE`}
          </div>
          <div className="font-mono text-2xl font-semibold text-[#FAF9F5] leading-none">
            {formatPct(calculations.oee)}
            <span className="text-xs text-[#BD5D3A] ml-0.5">%</span>
          </div>
          <div className="font-mono text-[10px] text-text-secondary/50 mt-1 select-none truncate">
            {step <= 3
              ? `Step ... / 3 — complete inputs`
              : `Calculation completed`}
          </div>
        </div>

        {step <= 3 ? (
          <button
            onClick={handleNext}
            className="bg-[#BD5D3A] hover:bg-[#9E4A2D] text-white font-mono text-xs font-semibold px-5 py-3 uppercase tracking-wider transition-all"
          >
            {`Calculate`}
          </button>
        ) : (
          <Link
            href={proUrl}
            className="bg-[#BD5D3A] hover:bg-[#9E4A2D] text-white font-mono text-xs font-semibold px-5 py-3 uppercase tracking-wider transition-all"
          >
            PRO
          </Link>
        )}
      </div>
    </div>
  );
}
