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
 className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-text-secondary hover:text-ink-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black/40"
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
 className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-border-subtle bg-white p-3 text-xs leading-relaxed text-text-secondary shadow-card"
 >
 {text}
 </span>
 ) : null}
 </span>
 );
}
