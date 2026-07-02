"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { CalculationFeedbackModal } from "@/components/feedback/CalculationFeedbackModal";
import type { FeedbackSnapshotValue, FeedbackToolType } from "@/lib/features/feedback/types";

export type CalculationFeedbackButtonProps = {
  readonly toolSlug: string;
  readonly toolType: FeedbackToolType;
  readonly locale: string;
  readonly routePath: string;
  readonly region?: string;
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
};

export function CalculationFeedbackButton(props: CalculationFeedbackButtonProps) {
  const t = useTranslations("calculationFeedback");
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        className="mt-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4"
        data-calculation-feedback-button="true"
      >
        <p className="text-sm font-medium text-slate-900">Have feedback or spotted an issue?</p>
        <button
          type="button"
          className="mt-2 min-h-[44px] text-sm font-semibold text-blue-700 hover:underline"
          onClick={() => setOpen(true)}
        >
          Send Feedback
        </button>
      </aside>
      {open ? (
        <CalculationFeedbackModal
          {...props}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
