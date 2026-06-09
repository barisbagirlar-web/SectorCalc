"use client";

import { useState } from "react";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
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
 locked?: boolean;
}

export function ExportToolbar({
 toolSlug,
 toolTitle,
 locked = false,
}: ExportToolbarProps) {
 const [message, setMessage] = useState<string | null>(null);

 const handleExportClick = (format: string) => {
 trackEvent(ANALYTICS_EVENTS.export_clicked, { toolSlug, format });
 setMessage(EXPORT_MOCK_MESSAGE);
 };

 if (locked) {
 return (
 <div className="min-w-0 rounded-sm border border-border-subtle bg-white p-5 shadow-card sm:p-6">
 <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
 Export
 </h2>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 Export is part of the paid decision summary. Subscribe to SectorCalc Pro to
 unlock premium tools; PDF export ships in a later release.
 </p>
 <ProCheckoutButton source="export_toolbar" className="mt-4 max-w-md" />
 </div>
 );
 }

 return (
 <div className="min-w-0 rounded-sm border border-border-subtle bg-white p-5 shadow-card sm:p-6">
 <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
 Export
 </h2>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 {toolTitle
 ? `Decision summary for ${toolTitle} — export preview only. PDF download ships in a later release.`
 : "Export preview only. PDF download ships in a later release."}
 </p>
 <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
 {EXPORT_ACTIONS.map((action) => (
 <button
 key={action}
 type="button"
 onClick={() => handleExportClick(action)}
 className="min-h-[44px] w-full rounded-lg border border-slate/25 bg-bg-subtle px-4 text-sm font-medium text-text-secondary transition-colors hover:border-deep-navy/40 hover:bg-white hover:text-text-primary sm:w-auto sm:min-w-[100px]"
 aria-describedby={message ? "export-message" : undefined}
 >
 {action}
 <span className="ml-1.5 text-xs text-text-secondary">(preview)</span>
 </button>
 ))}
 </div>
 {message ? (
 <p
 id="export-message"
 className="mt-4 rounded-lg border border-deep-navy/15 bg-bg-subtle px-4 py-3 text-sm leading-relaxed text-text-primary"
 role="status"
 >
 {message}
 </p>
 ) : null}
 </div>
 );
}
