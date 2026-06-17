"use client";

import { ImageIcon, X } from "lucide-react";
import { useId } from "react";

type ImageUploadProps = {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly helpText?: string;
  readonly placeholder?: string;
};

const fieldClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-sc-copper focus:outline-none focus:ring-2 focus:ring-sc-copper/20";

export function ImageUpload({
  label,
  value,
  onChange,
  helpText,
  placeholder = "/img/case-studies/ornek-kapak.jpg",
}: ImageUploadProps) {
  const inputId = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-deep-navy">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate/25 bg-off-white sm:h-24 sm:w-32">
          {value.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview for static asset URLs
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-slate/40" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={inputId}
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={fieldClass}
          />
          {value.trim() ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-amber transition hover:text-deep-navy"
            >
              <X className="h-3.5 w-3.5" />
              Görseli kaldır
            </button>
          ) : null}
          {helpText ? <p className="text-xs text-text-secondary">{helpText}</p> : null}
        </div>
      </div>
    </div>
  );
}
