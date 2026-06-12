import type { ComponentType, SVGProps } from "react";
import {
  BeakerIcon,
  BoltIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  Cog6ToothIcon,
  CubeIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const CATEGORY_ICON_BY_KEY: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  flow: ChartBarIcon,
  quality: ShieldCheckIcon,
  flask: BeakerIcon,
  cnc: Cog6ToothIcon,
  metal: CubeIcon,
  build: BuildingOffice2Icon,
  automation: BoltIcon,
  maintenance: WrenchScrewdriverIcon,
  shield: ShieldCheckIcon,
  truck: TruckIcon,
  people: UserGroupIcon,
  finance: CurrencyDollarIcon,
  leaf: GlobeAltIcon,
  food: BeakerIcon,
  lab: BeakerIcon,
  electric: BoltIcon,
  energy: BoltIcon,
  box: ShoppingCartIcon,
  globe: GlobeAltIcon,
  chip: Cog6ToothIcon,
};

export function resolvePremiumCategoryIcon(
  iconKey: string,
): ComponentType<SVGProps<SVGSVGElement>> {
  return CATEGORY_ICON_BY_KEY[iconKey] ?? ChartBarIcon;
}
