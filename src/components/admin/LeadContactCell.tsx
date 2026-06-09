import type { LeadIntent } from "@/lib/leads/types";

interface LeadContactCellProps {
 lead: LeadIntent;
}

export function LeadContactCell({ lead }: LeadContactCellProps) {
 const phone = lead.phone?.trim();

 return (
 <div className="space-y-1 break-words text-sm">
 <a
 href={`mailto:${lead.email}`}
 className="break-all text-ink-black hover:underline"
 >
 {lead.email}
 </a>
 {phone ? (
 <p className="break-all text-text-secondary" title={phone}>
 {phone}
 </p>
 ) : null}
 </div>
 );
}
