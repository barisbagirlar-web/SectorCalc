"use client";

import { useCallback, useEffect, useState } from "react";
import {
 buildLeadEmailMessage,
 buildLeadInternalNote,
 buildLeadWhatsappMessage,
} from "@/lib/features/leads/lead-copy-actions";
import type { LeadIntent } from "@/lib/features/leads/types";

type CopyTarget = "whatsapp" | "email" | "internal";

interface CopyButtonConfig {
 target: CopyTarget;
 label: string;
 build: (lead: LeadIntent) => string;
}

const COPY_BUTTONS: CopyButtonConfig[] = [
 {
 target: "whatsapp",
 label: "Copy WhatsApp Message",
 build: buildLeadWhatsappMessage,
 },
 {
 target: "email",
 label: "Copy Email Text",
 build: buildLeadEmailMessage,
 },
 {
 target: "internal",
 label: "Copy Internal Note",
 build: buildLeadInternalNote,
 },
];

interface LeadMessageTemplatesProps {
 lead: LeadIntent;
}

export function LeadMessageTemplates({ lead }: LeadMessageTemplatesProps) {
 const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
 const [fallbackText, setFallbackText] = useState<string | null>(null);

 useEffect(() => {
 setCopiedTarget(null);
 setFallbackText(null);
 }, [lead.id]);

 const handleCopy = useCallback(
 async (target: CopyTarget, build: (item: LeadIntent) => string) => {
 const text = build(lead);
 setCopiedTarget(null);
 setFallbackText(null);

 try {
 await navigator.clipboard.writeText(text);
 setCopiedTarget(target);
 window.setTimeout(() => {
 setCopiedTarget((current) => (current === target ? null : current));
 }, 2000);
 } catch {
 setFallbackText(text);
 }
 },
 [lead]
 );

 return (
 <section className="rounded-sm border border-slate/20 bg-white p-4 sm:p-5">
 <h3 className="text-sm font-bold text-deep-navy">Message Templates</h3>
 <p className="mt-1 text-xs leading-relaxed text-text-secondary">
 Copy ready-made text to clipboard. No automatic sending.
 </p>

 <div className="mt-4 flex flex-col gap-2">
 {COPY_BUTTONS.map((button) => {
 const copied = copiedTarget === button.target;
 return (
 <button
 key={button.target}
 type="button"
 onClick={() => void handleCopy(button.target, button.build)}
 className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-slate/25 bg-white px-3 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white"
 >
 {copied ? "Copied" : button.label}
 </button>
 );
 })}
 </div>

 {fallbackText ? (
 <div className="mt-4 space-y-2">
 <p className="text-xs font-medium text-amber" role="alert">
 Could not copy to clipboard. Copy the text manually below.
 </p>
 <textarea
 readOnly
 value={fallbackText}
 rows={8}
 className="w-full resize-y rounded-lg border border-slate/25 bg-off-white px-3 py-2 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20"
 aria-label="Text to copy"
 />
 </div>
 ) : null}
 </section>
 );
}
