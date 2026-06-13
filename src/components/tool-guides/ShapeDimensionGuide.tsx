"use client";

import { getShapeDimensionGuide } from "@/lib/tool-guides/shape-dimension-guides";

export function ShapeDimensionGuide({
  slug,
  locale,
  className,
}: {
  slug: string;
  locale: string;
  className?: string;
}) {
  const guide = getShapeDimensionGuide(slug);
  if (!guide) return null;

  const isTr = locale === "tr";
  const title = isTr ? guide.title.tr : guide.title.en;
  const helperText = isTr
    ? "Bu şema, hesaplama alanlarına hangi ölçü veya değerin girileceğini göstermek için hazırlanmıştır."
    : "This diagram shows which measurement or value should be entered into the calculation fields.";

  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className ?? ""}`}
      aria-labelledby={`shape-guide-title-${slug}`}
      data-shape-dimension-guide={slug}
    >
      <div className="min-w-0 overflow-x-auto">
        <guide.Svg locale={locale} />
      </div>
      <h3
        id={`shape-guide-title-${slug}`}
        className="mt-4 text-sm font-semibold text-slate-900"
      >
        {isTr ? "Girdi Rehberi" : "Input Guide"}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{helperText}</p>
    </section>
  );
}
