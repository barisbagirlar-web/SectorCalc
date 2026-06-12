"use client";
import { Ruler,TrendingUp,Wrench,Zap,Truck,Wheat,Home,BarChart2,RefreshCcw,Heart,Repeat2,Target,FlaskConical,Factory,Route,Gauge,Activity,DollarSign,Leaf,Scissors,HardHat,Layers,Printer,Package,Car,Cpu,ShieldCheck,Trophy,Scale,Thermometer,Wind,Droplets,Mountain,Hammer,LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CategoryCardItem = {
  readonly slug: string;
  readonly label: string;
  readonly count: number;
  readonly isActive?: boolean;
};

type Props = {
  readonly items: readonly CategoryCardItem[];
  readonly onSelect: (slug: string) => void;
  readonly countSuffix?: string;
};
const ICON_MAP: Record<string, LucideIcon> = {
  all: LayoutGrid,
  "construction-measurement": Ruler,
  "finance-business": TrendingUp,
  "manufacturing-workshop": Wrench,
  "energy-carbon": Zap,
  "logistics-travel": Truck,
  "agriculture-food": Wheat,
  "everyday-life": Home,
  "math-statistics": BarChart2,
  conversion: RefreshCcw,
  "health-body": Heart,
  "lean-production": Repeat2,
  "quality-six-sigma": Target,
  "process-chemical": FlaskConical,
  manufacturing: Factory,
  energy: Zap,
  logistics: Route,
  maintenance: Wrench,
  measurement: Gauge,
  oee: Activity,
  cost: DollarSign,
  carbon: Leaf,
  food: Wheat,
  textile: Scissors,
  construction: HardHat,
  metal: Layers,
  "sheet-metal": Layers,
  print: Printer,
  packaging: Package,
  automotive: Car,
  electronics: Cpu,
  safety: ShieldCheck,
  benchmark: Trophy,
};
function getIcon(slug: string): LucideIcon {
  if (ICON_MAP[slug]) return ICON_MAP[slug];
  const key = Object.keys(ICON_MAP).find(
    (k) => k !== "all" && (slug.includes(k) || k.includes(slug)),
  );
  return key ? ICON_MAP[key] : LayoutGrid;
}

export function CategoryCardGrid({ items, onSelect, countSuffix = "" }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => {
        const Icon = getIcon(item.slug);
        const active = item.isActive ?? false;
        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect(item.slug)}
            className={[
              "flex flex-col items-center justify-center gap-2 rounded-lg border px-2 py-5 text-center transition-all",
              active
                ? "border-orange-600 bg-orange-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-orange-300 hover:shadow-sm",
            ].join(" ")}
          >
            <span
              className={
                active
                  ? "flex h-10 w-10 items-center justify-center text-orange-700"
                  : "flex h-10 w-10 items-center justify-center text-orange-500"
              }
            >
              <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span
              className={
                active
                  ? "line-clamp-2 text-xs font-semibold leading-snug text-slate-900"
                  : "line-clamp-2 text-xs font-semibold leading-snug text-slate-700"
              }
            >
              {item.label}
            </span>
            <span className="text-xs text-slate-400">
              {item.count}{countSuffix}
            </span>
          </button>
        );
      })}
    </div>
  );
}
