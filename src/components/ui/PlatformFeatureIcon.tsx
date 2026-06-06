type IconVariant = "engine" | "report" | "architecture" | "locale" | "security" | "scenario";

interface PlatformFeatureIconProps {
  variant: IconVariant;
  dark?: boolean;
}

const frameClass = (dark: boolean) =>
  dark
    ? "border-border-subtle bg-white/[0.06]"
    : "border-border-subtle bg-bg-subtle";

export function PlatformFeatureIcon({ variant, dark = false }: PlatformFeatureIconProps) {
  const frame = `flex h-14 w-14 items-center justify-center rounded-xl border ${frameClass(dark)}`;

  switch (variant) {
    case "engine":
      return (
        <div className={frame} aria-hidden>
          <div className="grid grid-cols-2 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-sm ${dark ? "bg-accent-teal/70" : "bg-accent-teal/80"}`}
              />
            ))}
          </div>
        </div>
      );
    case "report":
      return (
        <div className={frame} aria-hidden>
          <div className={`h-9 w-7 rounded-sm border-2 ${dark ? "border-cyan/50" : "border-accent-teal/40"}`}>
            <span className={`mt-1.5 block h-1 w-4 ${dark ? "bg-white/40" : "bg-slate/30"}`} />
            <span className={`mt-1 block h-1 w-5 ${dark ? "bg-white/25" : "bg-slate/20"}`} />
          </div>
        </div>
      );
    case "architecture":
      return (
        <div className={frame} aria-hidden>
          <div className="flex gap-1">
            <span className={`h-8 w-2 rounded-full ${dark ? "bg-accent-teal/60" : "bg-accent-teal/70"}`} />
            <span className={`mt-2 h-5 w-2 rounded-full ${dark ? "bg-white/30" : "bg-slate/25"}`} />
            <span className={`h-6 w-2 rounded-full ${dark ? "bg-accent-teal/40" : "bg-accent-teal/70"}`} />
          </div>
        </div>
      );
    case "locale":
      return (
        <div className={frame} aria-hidden>
          <span className={`text-lg font-bold ${dark ? "text-accent-teal" : "text-accent-teal"}`}>
            EN
          </span>
        </div>
      );
    case "security":
      return (
        <div className={frame} aria-hidden>
          <div
            className={`h-7 w-7 rounded-full border-2 ${dark ? "border-emerald/50" : "border-emerald/60"}`}
          />
        </div>
      );
    case "scenario":
      return (
        <div className={frame} aria-hidden>
          <div className="flex items-end gap-0.5">
            {[40, 65, 50].map((h, i) => (
              <span
                key={i}
                className={`w-2 rounded-t-sm ${dark ? "bg-accent-teal/60" : "bg-accent-teal/70"}`}
                style={{ height: `${h}%`, maxHeight: "1.75rem" }}
              />
            ))}
          </div>
        </div>
      );
    default:
      return <div className={frame} aria-hidden />;
  }
}
