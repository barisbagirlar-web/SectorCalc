import { getTranslations } from "next-intl/server";
import { FREE_TOOL_PRIVACY_NOTE } from "@/lib/tools/revenue-tools";

interface FreeToolPrivacyNoteProps {
  locale: string;
}

export async function FreeToolPrivacyNote({ locale }: FreeToolPrivacyNoteProps) {
  const t = await getTranslations({ locale, namespace: "freeToolPrivacyNote" });

  return (
    <p className="rounded-lg border border-border-subtle bg-bg-subtle px-4 py-3 text-xs leading-relaxed text-text-secondary">
      <strong className="font-semibold text-text-primary">{t("privacy")}</strong>{" "}
      {FREE_TOOL_PRIVACY_NOTE}
    </p>
  );
}
