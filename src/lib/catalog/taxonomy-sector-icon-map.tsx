import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Antenna,
  Armchair,
  ArrowLeftRight,
  Atom,
  Building,
  Building2,
  Camera,
  CarFront,
  ChartColumn,
  ChefHat,
  Columns3,
  Cpu,
  Droplets,
  Dumbbell,
  Eye,
  Factory,
  FlaskConical,
  FolderOpen,
  Fuel,
  Gauge,
  Gem,
  GraduationCap,
  Hammer,
  HardHat,
  Home,
  Landmark,
  Layers,
  LayoutGrid,
  Leaf,
  Luggage,
  Monitor,
  Package,
  PawPrint,
  Pickaxe,
  Plane,
  Printer,
  Recycle,
  Shield,
  Shirt,
  ShoppingBag,
  Sigma,
  Sparkles,
  Stethoscope,
  SunMedium,
  Tractor,
  TrainFront,
  Truck,
  Zap,
} from "lucide-react";
import { ALL_TOOLS_SECTOR, OTHER_SECTOR, SECTORS } from "@/lib/tools/taxonomy";

/** One unique Lucide icon per taxonomy sector slug — matches free-tools CategoryCardGrid style. */
export const TAXONOMY_SECTOR_ICON_MAP = {
  all: LayoutGrid,
  otomotiv: CarFront,
  havacilik: Plane,
  makine: Factory,
  metal: Hammer,
  plastik: Layers,
  gida: ChefHat,
  kimya: FlaskConical,
  enerji: Zap,
  insaat: Building2,
  lojistik: Package,
  perakende: ShoppingBag,
  tekstil: Shirt,
  bilisim: Monitor,
  finans: Landmark,
  saglik: Stethoscope,
  tarim: Tractor,
  savunma: Shield,
  denizcilik: Anchor,
  madencilik: Pickaxe,
  telekom: Antenna,
  yenilenebilir: SunMedium,
  temizlik: Sparkles,
  kargo: Truck,
  matematik: Sigma,
  istatistik: ChartColumn,
  fizik: Atom,
  "birim-donusum": ArrowLeftRight,
  "fitness-spor": Dumbbell,
  "ev-yasam": Home,
  egitim: GraduationCap,
  emlak: Building,
  turizm: Luggage,
  cevre: Recycle,
  elektronik: Cpu,
  "ambalaj-baski": Printer,
  "mobilya-ahsap": Armchair,
  petrokimya: Fuel,
  veteriner: PawPrint,
  "hidrolik-pnomatik": Gauge,
  "yapisal-muhendislik": Columns3,
  "su-yonetimi": Droplets,
  "optik-akustik": Eye,
  "gorsel-medya": Camera,
  demiryolu: TrainFront,
  "cam-seramik": Gem,
  "isg-risk": HardHat,
  diger: FolderOpen,
} as const satisfies Record<string, LucideIcon>;

export type TaxonomySectorIconSlug = keyof typeof TAXONOMY_SECTOR_ICON_MAP;

export function isTaxonomySectorIconSlug(slug: string): slug is TaxonomySectorIconSlug {
  return slug in TAXONOMY_SECTOR_ICON_MAP;
}

export function getTaxonomySectorIcon(slug: string): LucideIcon {
  const icon = TAXONOMY_SECTOR_ICON_MAP[slug as TaxonomySectorIconSlug];
  if (!icon) {
    throw new Error(`Missing taxonomy sector icon for slug: ${slug}`);
  }
  return icon;
}

export function listTaxonomySectorIconSlugs(): readonly TaxonomySectorIconSlug[] {
  return Object.keys(TAXONOMY_SECTOR_ICON_MAP) as TaxonomySectorIconSlug[];
}

export function assertUniqueTaxonomySectorIcons(): void {
  const seen = new Map<LucideIcon, string>();
  for (const [slug, icon] of Object.entries(TAXONOMY_SECTOR_ICON_MAP)) {
    const previous = seen.get(icon);
    if (previous) {
      throw new Error(`Duplicate taxonomy sector icon component: ${previous} and ${slug}`);
    }
    seen.set(icon, slug);
  }

  const requiredSlugs = [
    ALL_TOOLS_SECTOR.id,
    OTHER_SECTOR.id,
    ...SECTORS.map((sector) => sector.id),
  ];
  for (const slug of requiredSlugs) {
    if (!isTaxonomySectorIconSlug(slug)) {
      throw new Error(`Taxonomy sector icon map missing slug: ${slug}`);
    }
  }
}

assertUniqueTaxonomySectorIcons();
