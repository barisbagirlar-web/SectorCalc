"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { ExpertCalcResult, ExpertCalcTier, ExpertFieldSpec } from "@/lib/os/core/formulas/expert-calc";
import type { VerdictSeverity } from "@/lib/types/margincore-engine";

function CalcIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden focusable="false">
      <rect x="1" y="1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 7h6M7 4v6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden focusable="false">
      <path
        d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 3.5V7h3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export interface TerminalPanelProps {
  title: string;
  meta?: string;
  fields: readonly ExpertFieldSpec[];
  tier?: ExpertCalcTier;
  result: ExpertCalcResult | null;
  pending?: boolean;
  onCalculate: (values: Record<string, number>) => void;
  onReset?: () => void;
}

function verdictClass(severity: VerdictSeverity): string {
  return `terminal-panel__verdict terminal-panel__verdict--${severity}`;
}

export function TerminalPanel({
  title,
  meta,
  fields,
  tier = "premium",
  result,
  pending = false,
  onCalculate,
  onReset,
}: TerminalPanelProps) {
  const t = useTranslations("terminal");
  const initialDraft = useMemo(() => {
    const draft: Record<string, string> = {};
    for (const field of fields) {
      draft[field.key] = "";
    }
    return draft;
  }, [fields]);

  const [draft, setDraft] = useState<Record<string, string>>(initialDraft);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextErrors: Record<string, string> = {};
      const parsed: Record<string, number> = {};

      for (const field of fields) {
        const raw = draft[field.key]?.trim() ?? "";
        const value = Number(raw);
        if (!raw || !Number.isFinite(value)) {
          nextErrors[field.key] = t("numericRequired");
          continue;
        }
        if (field.kind === "rate" && value <= 0) {
          nextErrors[field.key] = t("mustBePositive");
          continue;
        }
        if (field.kind === "actual" && value < 0) {
          nextErrors[field.key] = t("cannotBeNegative");
          continue;
        }
        parsed[field.key] = value;
      }

      setFieldErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        return;
      }

      onCalculate(parsed);
    },
    [draft, fields, onCalculate, t],
  );

  const handleReset = useCallback(() => {
    setDraft(initialDraft);
    setFieldErrors({});
    onReset?.();
  }, [initialDraft, onReset]);

  return (
    <section className="terminal-panel" aria-labelledby="terminal-panel-title">
      <header className="terminal-panel__header">
        <h2 id="terminal-panel-title" className="terminal-panel__title">
          {title}
        </h2>
        {meta ? <span className="terminal-panel__meta">{meta}</span> : null}
      </header>

      <form className="terminal-panel__grid terminal-panel__grid--split" onSubmit={handleSubmit} noValidate>
        <div className="terminal-panel__grid">
          {fields.map((field) => {
            const error = fieldErrors[field.key];
            return (
              <div key={field.key} className="terminal-panel__field">
                <label htmlFor={`tp-${field.key}`} className="terminal-panel__label">
                  {field.label}
                </label>
                <input
                  id={`tp-${field.key}`}
                  name={field.key}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  value={draft[field.key] ?? ""}
                  onChange={(event) => {
                    const next = event.target.value;
                    setDraft((prev) => ({ ...prev, [field.key]: next }));
                    setFieldErrors((prev) => {
                      if (!prev[field.key]) {
                        return prev;
                      }
                      const copy = { ...prev };
                      delete copy[field.key];
                      return copy;
                    });
                  }}
                  className={`terminal-panel__input${error ? " terminal-panel__input--error" : ""}`}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `tp-${field.key}-err` : undefined}
                />
                {error ? (
                  <p id={`tp-${field.key}-err`} className="terminal-panel__error" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}

          <div className="terminal-panel__actions">
            <button
              type="submit"
              disabled={pending}
              className="terminal-panel__btn terminal-panel__btn--calc"
            >
              <CalcIcon />
              {pending ? "…" : "Calculate"}
            </button>
            {onReset ? (
              <button
                type="button"
                onClick={handleReset}
                className="terminal-panel__btn terminal-panel__btn--ghost"
              >
                <ResetIcon />
                Reset
              </button>
            ) : null}
          </div>
        </div>

        <div className="terminal-panel__result" aria-live="polite">
          {result ? (
            <>
              <div className="terminal-panel__metrics">
                <div>
                  <span className="terminal-panel__metric-label">Variance</span>
                  <span className="terminal-panel__metric-value">{result.variancePct}%</span>
                </div>
                <div>
                  <span className="terminal-panel__metric-label">Efficiency</span>
                  <span className="terminal-panel__metric-value">{result.efficiencyScore}</span>
                </div>
                <div>
                  <span className="terminal-panel__metric-label">Impact</span>
                  <span className="terminal-panel__metric-value">{result.totalImpactFormatted}</span>
                </div>
                <div>
                  <span className="terminal-panel__metric-label">Tier</span>
                  <span className="terminal-panel__metric-value">{tier.toUpperCase()}</span>
                </div>
              </div>

              <div className={verdictClass(result.verdict.severity)}>
                <span className="terminal-panel__verdict-label">{result.verdict.label}</span>
                <span className="terminal-panel__verdict-action">{result.verdict.action}</span>
              </div>

              {tier === "premium" && result.premium ? (
                <>
                  <div className="terminal-panel__logic" aria-label={t("logicBreakdown")}>
                    {result.premium.logicTerms.map((term) => (
                      <div key={term.id} className="terminal-panel__logic-row">
                        <span className="terminal-panel__logic-id">{term.id}</span>
                        <span>{term.label}</span>
                        <span className="terminal-panel__logic-amt">
                          {term.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {result.premium.hiddenVariables.length > 0 ? (
                    <div className="terminal-panel__hidden" aria-label={t("hiddenVariables")}>
                      {result.premium.hiddenVariables.map((item) => (
                        <div key={item.id} className="terminal-panel__hidden-row">
                          <span>{item.label}</span>
                          <span className="terminal-panel__hidden-amt">
                            {item.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <p className="terminal-panel__meta">Enter parameters and run calculation.</p>
          )}
        </div>
      </form>
    </section>
  );
}
