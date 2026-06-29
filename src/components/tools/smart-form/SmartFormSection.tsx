"use client";

import { useState, type ReactNode } from "react";

type SmartFormSectionProps = {
  readonly title: string;
  readonly description?: string;
  readonly collapsible?: boolean;
  readonly defaultExpanded?: boolean;
  readonly children: ReactNode;
  readonly sectionType?: string;
};

export function SmartFormSection({
  title,
  description,
  collapsible = false,
  defaultExpanded = true,
  children,
  sectionType,
}: SmartFormSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section
      className="space-y-3"
      data-section-type={sectionType}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs text-text-secondary">{description}</p>
          ) : null}
        </div>
        {collapsible ? (
          <button
            type="button"
            className="sc-cta-secondary min-h-[44px] shrink-0 px-3 py-2 text-xs"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
          >
            {expanded ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
      {expanded ? children : null}
    </section>
  );
}
