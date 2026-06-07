import { FREE_TOOL_PRIVACY_NOTE } from "@/lib/tools/revenue-tools";

export function FreeToolPrivacyNote() {
 return (
 <p className="rounded-lg border border-border-subtle bg-bg-subtle px-4 py-3 text-xs leading-relaxed text-text-secondary">
 <strong className="font-semibold text-text-primary">Privacy:</strong>{" "}
 {FREE_TOOL_PRIVACY_NOTE}
 </p>
 );
}
