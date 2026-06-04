import type { ResultTone } from "@/data/tool-schema";

const toneStyles: Record<
  ResultTone,
  { border: string; bg: string; title: string; text: string }
> = {
  success: {
    border: "border-emerald/40",
    bg: "bg-emerald/10",
    title: "text-emerald",
    text: "text-deep-navy",
  },
  warning: {
    border: "border-amber/40",
    bg: "bg-amber/10",
    title: "text-amber",
    text: "text-deep-navy",
  },
  danger: {
    border: "border-soft-red/40",
    bg: "bg-soft-red/10",
    title: "text-soft-red",
    text: "text-deep-navy",
  },
  neutral: {
    border: "border-slate/30",
    bg: "bg-off-white",
    title: "text-slate",
    text: "text-deep-navy",
  },
};

interface RiskVerdictCardProps {
  riskLevel: ResultTone;
  riskLevelLabel: string;
  verdictText: string;
}

export function RiskVerdictCard({
  riskLevel,
  riskLevelLabel,
  verdictText,
}: RiskVerdictCardProps) {
  const styles = toneStyles[riskLevel];

  return (
    <article
      className={`min-w-0 rounded-xl border p-5 ${styles.border} ${styles.bg}`}
      aria-labelledby="risk-verdict-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate">
        Risk verdict
      </p>
      <h3
        id="risk-verdict-heading"
        className={`mt-2 text-lg font-bold sm:text-xl ${styles.title}`}
      >
        {riskLevelLabel}
      </h3>
      <p className={`mt-2 text-sm leading-relaxed ${styles.text}`}>
        {verdictText}
      </p>
    </article>
  );
}
