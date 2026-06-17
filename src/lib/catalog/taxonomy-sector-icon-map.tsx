import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Anvil,
  Antenna,
  Armchair,
  ArrowLeftRight,
  AudioLines,
  Camera,
  CarFront,
  ChartColumn,
  CircuitBoard,
  Circle,
  Cog,
  Columns3,
  Droplets,
  Dumbbell,
  FlaskConical,
  FolderOpen,
  Fuel,
  Gauge,
  GraduationCap,
  HardHat,
  Home,
  KeyRound,
  Landmark,
  LayoutGrid,
  Leaf,
  Magnet,
  Monitor,
  Package,
  PawPrint,
  Pickaxe,
  Plane,
  Printer,
  Salad,
  Shield,
  ShieldAlert,
  Shirt,
  Ship,
  Sigma,
  Sparkles,
  Stethoscope,
  Store,
  SunMedium,
  TrainFront,
  Truck,
  Warehouse,
  Wheat,
  Zap,
  Cylinder,
} from "lucide-react";
import { ALL_TOOLS_SECTOR, OTHER_SECTOR, SECTORS } from "@/lib/tools/taxonomy";

/**
 * One unique Lucide line icon per taxonomy sector — purposeful, non-repeating.
 * UI: IndustriesTaxonomyGrid, CategoryCardGrid (via resolveCatalogCategoryIcon).
 */
export const TAXONOMY_SECTOR_ICON_MAP = {
  all: LayoutGrid,
  otomotiv: CarFront,
  havacilik: Plane,
  makine: Cog,
  metal: Anvil,
  plastik: Cylinder,
  gida: Salad,
  kimya: FlaskConical,
  enerji: Zap,
  insaat: HardHat,
  lojistik: Warehouse,
  perakende: Store,
  tekstil: Shirt,
  bilisim: Monitor,
  finans: Landmark,
  saglik: Stethoscope,
  tarim: Wheat,
  savunma: Shield,
  denizcilik: Ship,
  madencilik: Pickaxe,
  telekom: Antenna,
  yenilenebilir: SunMedium,
  temizlik: Sparkles,
  kargo: Truck,
  matematik: Sigma,
  istatistik: ChartColumn,
  fizik: Magnet,
  "birim-donusum": ArrowLeftRight,
  "fitness-spor": Dumbbell,
  "ev-yasam": Home,
  egitim: GraduationCap,
  emlak: KeyRound,
  turizm: Package,
  cevre: Leaf,
  elektronik: CircuitBoard,
  "ambalaj-baski": Printer,
  "mobilya-ahsap": Armchair,
  petrokimya: Fuel,
  veteriner: PawPrint,
  "hidrolik-pnomatik": Gauge,
  "yapisal-muhendislik": Columns3,
  "su-yonetimi": Droplets,
  "optik-akustik": AudioLines,
  "gorsel-medya": Camera,
  demiryolu: TrainFront,
  "cam-seramik": Circle,
  "isg-risk": ShieldAlert,
  diger: FolderOpen,
} as const satisfies Record<string, LucideIcon>;

export type TaxonomySectorIconSlug = keyof typeof TAXONOMY_SECTOR_ICON_MAP;

/** PascalCase Lucide export name per sector — kept in sync with taxonomy.ts `icon` field. */
export const TAXONOMY_SECTOR_ICON_NAMES: Readonly<Record<TaxonomySectorIconSlug, string>> = {
  all: "LayoutGrid",
  otomotiv: "CarFront",
  havacilik: "Plane",
  makine: "Cog",
  metal: "Anvil",
  plastik: "Cylinder",
  gida: "Salad",
  kimya: "FlaskConical",
  enerji: "Zap",
  insaat: "HardHat",
  lojistik: "Warehouse",
  perakende: "Store",
  tekstil: "Shirt",
  bilisim: "Monitor",
  finans: "Landmark",
  saglik: "Stethoscope",
  tarim: "Wheat",
  savunma: "Shield",
  denizcilik: "Ship",
  madencilik: "Pickaxe",
  telekom: "Antenna",
  yenilenebilir: "SunMedium",
  temizlik: "Sparkles",
  kargo: "Truck",
  matematik: "Sigma",
  istatistik: "ChartColumn",
  fizik: "Magnet",
  "birim-donusum": "ArrowLeftRight",
  "fitness-spor": "Dumbbell",
  "ev-yasam": "Home",
  egitim: "GraduationCap",
  emlak: "KeyRound",
  turizm: "Package",
  cevre: "Leaf",
  elektronik: "CircuitBoard",
  "ambalaj-baski": "Printer",
  "mobilya-ahsap": "Armchair",
  petrokimya: "Fuel",
  veteriner: "PawPrint",
  "hidrolik-pnomatik": "Gauge",
  "yapisal-muhendislik": "Columns3",
  "su-yonetimi": "Droplets",
  "optik-akustik": "AudioLines",
  "gorsel-medya": "Camera",
  demiryolu: "TrainFront",
  "cam-seramik": "Circle",
  "isg-risk": "ShieldAlert",
  diger: "FolderOpen",
};

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
