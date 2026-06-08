"use client";

type SmartFormValidationSummaryProps = {
  readonly title?: string;
  readonly errors?: Readonly<Record<string, string>>;
  readonly blockers?: readonly string[];
};

export function SmartFormValidationSummary({
  title = "Validation blocked",
  errors,
  blockers,
}: SmartFormValidationSummaryProps) {
  const errorEntries = errors ? Object.entries(errors).filter(([, message]) => message.length > 0) : [];
  const hasBlockers = blockers !== undefined && blockers.length > 0;
  const hasErrors = errorEntries.length > 0;

  if (!hasBlockers && !hasErrors) {
    return null;
  }

  return (
    <div
      className="sc-industrial-panel border border-crit-red/30 bg-crit-red/5 p-4"
      role="alert"
      data-component-kind="smart_form_validation_summary"
    >
      <p className="text-sm font-semibold text-crit-red">{title}</p>
      {hasBlockers ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
          {blockers.map((blocker) => (
            <li key={blocker}>{blocker}</li>
          ))}
        </ul>
      ) : null}
      {hasErrors ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
          {errorEntries.map(([key, message]) => (
            <li key={key}>{message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
