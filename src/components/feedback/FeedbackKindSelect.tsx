"use client";

import { useTranslations } from "@/lib/i18n-stub";
import { FEEDBACK_KINDS, type FeedbackKind } from "@/lib/features/feedback/types";

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

export interface FeedbackKindSelectProps {
  readonly id: string;
  readonly value: FeedbackKind | "";
  readonly onChange: (kind: FeedbackKind | "") => void;
  readonly error?: string;
}

export function FeedbackKindSelect({ id, value, onChange, error }: FeedbackKindSelectProps) {
  const t = useTranslations("feedback");

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-deep-navy">
        {t("kind.label")}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as FeedbackKind | "")}
        className={inputClass}
        aria-invalid={Boolean(error)}
      >
        <option value="">{t("kind.selectPlaceholder")}</option>
        {FEEDBACK_KINDS.map((kind) => (
          <option key={kind} value={kind}>
            {t(`kind.${kind}`)}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-soft-red">{error}</p> : null}
    </div>
  );
}
