/**
 * Premium-style category icon resolver.
 * Maps iconKey strings to actual Lucide components for optimal tree-shaking.
 */

import {
  Landmark,
  Sigma,
  Monitor,
  Zap,
  Leaf,
  Cog,
  Anvil,
  FlaskConical,
  ShieldAlert,
  Wrench,
  HardHat,
  Users,
  Warehouse,
  Salad,
  ArrowLeftRight,
  Shirt,
  Thermometer,
  Package,
  Globe,
  Cpu,
  Calculator,
  Heart,
  Ruler,
  CarFront,
  Ship,
  Pickaxe,
  Armchair,
  Sparkles,
  Droplets,
  Luggage,
  GraduationCap,
  KeyRound,
  Plane,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Readonly<Record<string, LucideIcon>> = {
  Landmark,
  Sigma,
  Monitor,
  Zap,
  Leaf,
  Cog,
  Anvil,
  FlaskConical,
  ShieldAlert,
  Wrench,
  HardHat,
  Users,
  Warehouse,
  Salad,
  ArrowLeftRight,
  Shirt,
  Thermometer,
  Package,
  Globe,
  Cpu,
  Calculator,
  Heart,
  Ruler,
  CarFront,
  Ship,
  Pickaxe,
  Armchair,
  Sparkles,
  Droplets,
  Luggage,
  GraduationCap,
  KeyRound,
  Plane,
  FolderOpen,
};

type FreeToolCategoryIconProps = {
  readonly iconKey: string;
  readonly className?: string;
};

export function FreeToolCategoryIcon({
  iconKey,
  className = "h-5 w-5 text-copper",
}: FreeToolCategoryIconProps) {
  const Icon = ICON_MAP[iconKey] ?? FolderOpen;
  return <Icon className={className} aria-hidden="true" />;
}
