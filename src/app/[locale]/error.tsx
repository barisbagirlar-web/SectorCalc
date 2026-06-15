"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";

type LocaleErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

export default function LocaleError({ error, reset }: LocaleErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold text-premium-velvet">Something went wrong</h1>
      <p className="mt-3 text-sm leading-relaxed text-body-charcoal">
        This page hit an unexpected error. You can retry or return to the calculator library.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-h-[44px] rounded-sm bg-deep-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/calculator-library"
          className="inline-flex min-h-[44px] items-center rounded-sm border border-border-subtle px-4 py-2 text-sm font-semibold text-deep-navy"
        >
          Calculator library
        </Link>
      </div>
    </main>
  );
}
