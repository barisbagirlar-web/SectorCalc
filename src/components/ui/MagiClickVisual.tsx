type VisualVariant =
  | "platform-dashboard"
  | "platform-stack"
  | "report-flow"
  | "scenario-chart"
  | "validation-flow"
  | "pillar-engine"
  | "pillar-report"
  | "pillar-security";

interface MagiClickVisualProps {
  variant: VisualVariant;
  className?: string;
}

export function MagiClickVisual({ variant, className = "" }: MagiClickVisualProps) {
  const base =
    `relative overflow-hidden rounded-lg border border-slate/15 bg-gradient-to-br from-slate-100 via-white to-blue-50 ${className}`;

  if (variant === "platform-stack") {
    return (
      <div
        className={`relative w-full overflow-hidden rounded border border-[#d0e8f2] bg-gradient-to-r from-[#e7f9ff] via-white to-[#e7f9ff] ${className}`}
        aria-hidden
      >
        <div className="flex flex-wrap items-center justify-center gap-4 p-8 md:gap-8 md:p-12">
          {["Sector Tools", "Reports", "Scenarios", "Risk", "Export"].map((label) => (
            <div
              key={label}
              className="rounded border border-[#07b6ef]/30 bg-white px-6 py-4 text-center shadow-sm"
            >
              <p className="text-sm font-bold text-[#303030]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "platform-dashboard") {
    return (
      <div className={`${base} min-h-[320px] w-full max-w-[900px] shadow-md ${className}`} aria-hidden>
        <div className="absolute inset-x-0 top-0 flex h-10 items-center gap-2 border-b border-slate/15 bg-white/90 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-soft-red/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald/80" />
          <span className="ml-2 h-2 w-32 rounded bg-slate/15" />
        </div>
        <div className="absolute inset-0 top-10 grid grid-cols-12 gap-3 p-4">
          <div className="col-span-3 space-y-2 rounded-md bg-deep-navy/90 p-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-2 rounded bg-white/20" />
            ))}
          </div>
          <div className="col-span-9 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {["Quote", "Margin", "Risk"].map((label) => (
                <div key={label} className="rounded-md border border-slate/10 bg-white p-3">
                  <p className="text-[9px] font-semibold uppercase text-slate">{label}</p>
                  <p className="mt-1 text-sm font-bold text-deep-navy">—</p>
                </div>
              ))}
            </div>
            <div className="h-24 rounded-md border border-slate/10 bg-white p-3">
              <div className="flex h-full items-end gap-1">
                {[35, 55, 40, 70, 50, 65].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-professional-blue/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant.startsWith("pillar-")) {
    const accent =
      variant === "pillar-engine"
        ? "from-blue-100 to-slate-50"
        : variant === "pillar-report"
          ? "from-cyan-50 to-slate-50"
          : "from-emerald-50 to-slate-50";
    return (
      <div
        className={`${base} h-[146px] w-full max-w-[220px] bg-gradient-to-br ${accent} ${className}`}
        aria-hidden
      >
        <div className="absolute inset-6 rounded-md border border-white/80 bg-white/70 p-4 shadow-sm">
          <div className="space-y-2">
            <span className="block h-2 w-1/2 rounded bg-deep-navy/20" />
            <span className="block h-2 w-full rounded bg-slate/15" />
            <span className="block h-2 w-[80%] rounded bg-slate/10" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <span className="h-16 rounded bg-professional-blue/15" />
            <span className="h-16 rounded bg-cyan/15" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "report-flow") {
    return (
      <div className={`${base} aspect-[5/4] w-full`} aria-hidden>
        <div className="absolute inset-8 rounded-lg border border-slate/10 bg-white p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-professional-blue">
            Decision report
          </p>
          <div className="mt-4 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-deep-navy text-[10px] font-bold text-white">
                  {i}
                </span>
                <span className="mt-1 h-2 flex-1 rounded bg-slate/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "scenario-chart") {
    return (
      <div className={`${base} aspect-[5/4] w-full`} aria-hidden>
        <div className="absolute inset-6 flex items-end justify-center gap-2">
          {[30, 50, 40, 75, 55, 85, 60].map((h, i) => (
            <span
              key={i}
              className="w-6 rounded-t-md bg-gradient-to-t from-professional-blue to-cyan"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${base} aspect-[5/4] w-full`} aria-hidden>
      <div className="absolute inset-10 rounded-full border-4 border-emerald/30" />
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-deep-navy" />
    </div>
  );
}
