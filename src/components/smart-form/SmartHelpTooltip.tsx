"use client";

import { useId, useState } from "react";

export type SmartHelpTooltipProps = {
  readonly why?: string;
  readonly typical?: string;
  readonly reference?: string;
  readonly example?: string;
  readonly label: string;
};

export function SmartHelpTooltip({
  why,
  typical,
  reference,
  example,
  label,
}: SmartHelpTooltipProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (!why && !typical && !reference && !example) {
    return null;
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm text-xs font-semibold text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        aria-label={`Help for ${label}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        ?
      </button>
      {open ? (
        <div
          id={panelId}
          role="tooltip"
          className="absolute right-0 top-full z-20 mt-1 w-64 rounded-sm border border-border-subtle bg-white p-3 text-xs leading-relaxed text-body-charcoal shadow-card"
        >
          {why ? <p className="mb-2"><strong>Why:</strong> {why}</p> : null}
          {typical ? <p className="mb-2"><strong>Typical:</strong> {typical}</p> : null}
          {reference ? <p className="mb-2"><strong>Reference:</strong> {reference}</p> : null}
          {example ? <p><strong>Example:</strong> {example}</p> : null}
        </div>
      ) : null}
    </span>
  );
}
