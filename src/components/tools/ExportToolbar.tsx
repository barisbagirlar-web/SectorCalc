"use client";

import { useState } from "react";
import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";
import { EXPORT_MOCK_MESSAGE } from "@/config/export-messages";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";

const EXPORT_ACTIONS = ["PDF", "Excel", "Word", "Save"] as const;

interface ExportToolbarProps {
  toolSlug?: string;
  toolTitle?: string;
  industryLeadValue?: string;
}

export function ExportToolbar({
  toolSlug,
  toolTitle,
  industryLeadValue,
}: ExportToolbarProps) {
  const [message, setMessage] = useState<string | null>(null);

  const handleExportClick = (format: string) => {
    trackEvent(ANALYTICS_EVENTS.export_clicked, { toolSlug, format });
    setMessage(EXPORT_MOCK_MESSAGE);
  };

  return (
    <div className="min-w-0 rounded-xl border border-slate/20 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate">
        Export
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate">
        Export is included in the packaged premium decision report — not the free
        calculator card alone. Preview buttons show the future flow; billing is not
        live yet.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {EXPORT_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => handleExportClick(action)}
            className="min-h-[44px] w-full rounded-lg border border-slate/25 bg-off-white px-4 text-sm font-medium text-slate transition-colors hover:border-professional-blue/40 hover:bg-white hover:text-deep-navy sm:w-auto sm:min-w-[100px]"
            aria-describedby={message ? "export-message" : undefined}
          >
            {action}
            <span className="ml-1.5 text-xs text-slate">(preview)</span>
          </button>
        ))}
      </div>
      {message && (
        <p
          id="export-message"
          className="mt-4 rounded-lg border border-professional-blue/20 bg-professional-blue/5 px-4 py-3 text-sm leading-relaxed text-deep-navy"
          role="status"
        >
          {message}
        </p>
      )}
      <LeadIntentTrigger
        source="export"
        toolRequested={toolTitle}
        industry={industryLeadValue}
        className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-amber bg-amber/10 px-4 text-sm font-semibold text-deep-navy transition-colors hover:bg-amber/20"
      >
        Request premium report access
      </LeadIntentTrigger>
    </div>
  );
}
