import { ScIcon } from "@/components/icons/ScIcon";
import {
  BanknotesIcon,
  BoltIcon,
  ClockIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

const LOSS_DIMENSIONS = [
  {
    icon: BanknotesIcon,
    title: "Financial loss",
    titleTr: "Parasal kayıp",
    description: "Margin, cost and profit leaks before you commit to a quote or contract.",
  },
  {
    icon: CubeIcon,
    title: "Material loss",
    titleTr: "Malzeme kaybı",
    description: "Scrap, waste and yield gaps that standard calculators ignore.",
  },
  {
    icon: ClockIcon,
    title: "Time loss",
    titleTr: "Zaman kaybı",
    description: "Setup, delay, rest windows and OEE-style efficiency exposure.",
  },
  {
    icon: BoltIcon,
    title: "Energy loss",
    titleTr: "Enerji kaybı",
    description: "kWh, carbon and compliance buffers including CBAM-style cost risk.",
  },
] as const;

export function ValuePropsSection() {
  return (
    <section
      className="border-t border-slate/10 bg-white py-14 sm:py-16"
      aria-labelledby="value-props-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-professional-blue">
            Universal measurement
          </p>
          <h2
            id="value-props-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-deep-navy sm:text-3xl"
          >
            Four loss dimensions — one platform
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">
            SectorCalc surfaces money, material, time and energy leaks with free checks and
            premium expert verdicts.
          </p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LOSS_DIMENSIONS.map((item) => (
            <li key={item.title} className="sc-card h-full">
              <ScIcon icon={item.icon} size="feature" className="text-professional-blue" />
              <h3 className="mt-4 text-base font-bold text-deep-navy">{item.title}</h3>
              <p className="mt-1 text-xs font-medium text-slate">{item.titleTr}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
