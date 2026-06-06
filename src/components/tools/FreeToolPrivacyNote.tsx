import { FREE_TOOL_PRIVACY_NOTE } from "@/lib/tools/revenue-tools";

export function FreeToolPrivacyNote() {
  return (
    <p className="rounded-lg border border-slate/10 bg-off-white px-4 py-3 text-xs leading-relaxed text-slate">
      <strong className="font-semibold text-deep-navy">Privacy:</strong>{" "}
      {FREE_TOOL_PRIVACY_NOTE}
    </p>
  );
}
