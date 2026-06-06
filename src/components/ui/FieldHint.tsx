"use client";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";

type FieldHintProps = {
  text: string;
};

export function FieldHint({ text }: FieldHintProps) {
  const [open, setOpen] = useState(false);
  const hintId = useId();

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-slate hover:text-professional-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue/40"
        aria-describedby={open ? hintId : undefined}
        aria-expanded={open}
        aria-label="Field help"
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
      >
        <QuestionMarkCircleIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </button>
      {open ? (
        <span
          id={hintId}
          role="tooltip"
          className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-slate/15 bg-white p-3 text-xs leading-relaxed text-slate shadow-card dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
