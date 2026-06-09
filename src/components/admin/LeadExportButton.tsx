"use client";

import {
 buildLeadsCsv,
 getLeadsCsvFilename,
} from "@/lib/leads/export-leads-csv";
import type { LeadIntent } from "@/lib/leads/types";

interface LeadExportButtonProps {
 leads: LeadIntent[];
 disabled?: boolean;
}

export function LeadExportButton({ leads, disabled }: LeadExportButtonProps) {
 const isDisabled = disabled || leads.length === 0;

 const handleExport = () => {
 if (isDisabled) {
 return;
 }

 const csv = buildLeadsCsv(leads);
 const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
 const url = URL.createObjectURL(blob);
 const anchor = document.createElement("a");
 anchor.href = url;
 anchor.download = getLeadsCsvFilename();
 anchor.rel = "noopener";
 document.body.appendChild(anchor);
 anchor.click();
 anchor.remove();
 URL.revokeObjectURL(url);
 };

 return (
 <button
 type="button"
 onClick={handleExport}
 disabled={isDisabled}
 className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center rounded-lg border border-slate/25 bg-white px-4 text-sm font-semibold text-ink-black transition-colors hover:border-ink-black/40 hover:bg-off-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
 >
 CSV İndir
 </button>
 );
}
