"use client";

import { useState, type ReactNode } from "react";
import type { SmartFormValidationTone } from "@/lib/smart-form/types";

export type SmartFormSectionProps = {
  readonly title: string;
  readonly description?: string;
  readonly status?: SmartFormValidationTone;
  readonly collapsible?: boolean;
  readonly defaultExpanded?: boolean;
  readonly children: ReactNode;
};

const STATUS_DOT: Record<SmartFormValidationTone, string> = {
  neutral: "bg-technical-gray",
  valid: "bg-safe-green",
  warning: "bg-watch-amber",
  error: "bg-crit-red",
};

export function SmartFormSection({
  title,
  description,
  status = "neutral",
  collapsible = false,
  defaultExpanded = true,
  children,
}: SmartFormSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!collapsible) {
    return (
      <section className="rounded-sm border border-border-subtle bg-white p-4">
        <header className="mb-3 flex items-start gap-2">
          <span className={`mt-1.5 inline-block h-2 w-2 rounded-full ${STATUS_DOT[status]}`} aria-hidden />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
            {description ? (
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{description}</p>
            ) : null}
          </div>
        </header>
        {children}
      </section>
    );
  }

  return (
    <details
      className="rounded-sm border border-border-subtle bg-white p-4"
      open={expanded}
      onToggle={(event) => setExpanded((event.target as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer list-none items-start gap-2">
        <span className={`mt-1.5 inline-block h-2 w-2 rounded-full ${STATUS_DOT[status]}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{description}</p>
          ) : null}
        </div>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
