"use client";

import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import type { ResolvedReferenceGraphic } from "@/lib/guidance/reference-graphic-types";
import { AngleGraphic } from "@/components/guidance/templates/AngleGraphic";
import { AreaGraphic } from "@/components/guidance/templates/AreaGraphic";
import { BendRadiusGraphic } from "@/components/guidance/templates/BendRadiusGraphic";
import { BoxDimensionGraphic } from "@/components/guidance/templates/BoxDimensionGraphic";
import { CylinderPipeGraphic } from "@/components/guidance/templates/CylinderPipeGraphic";
import { EnergyFlowGraphic } from "@/components/guidance/templates/EnergyFlowGraphic";
import { FinancialFlowGraphic } from "@/components/guidance/templates/FinancialFlowGraphic";
import { GenericCalculatorGraphic } from "@/components/guidance/templates/GenericCalculatorGraphic";
import { MachineTimeGraphic } from "@/components/guidance/templates/MachineTimeGraphic";
import { RouteGraphic } from "@/components/guidance/templates/RouteGraphic";
import { StairGraphic } from "@/components/guidance/templates/StairGraphic";
import { VolumeGraphic } from "@/components/guidance/templates/VolumeGraphic";

export type GuidedReferenceGraphicProps = {
  readonly resolvedGraphic: ResolvedReferenceGraphic;
  readonly activeFieldKey: string | null;
  readonly locale: AppLocale;
};

const LABEL_KEY_MAP: Readonly<Record<string, string>> = {
  length: "length",
  width: "width",
  height: "height",
  depth: "depth",
  diameter: "diameter",
  radius: "radius",
  insideRadius: "radius",
  thickness: "thickness",
  materialThickness: "thickness",
  angle: "angle",
  bendAngle: "angle",
  area: "area",
  volume: "volume",
  cost: "cost",
  price: "price",
  margin: "margin",
  energy: "energy",
  power: "power",
  pressure: "pressure",
  flow: "flow",
  distance: "distance",
  fuel: "distance",
  time: "time",
  setup: "setup",
  setupTime: "setup",
  cycleTime: "time",
  runtime: "time",
  quantity: "quantity",
  result: "result",
  decision: "decision",
  input: "input",
  process: "process",
  revenue: "price",
  profit: "margin",
  tax: "cost",
  payment: "cost",
  routeCost: "cost",
  stops: "stops",
  downtime: "time",
  availability: "time",
  carbon: "energy",
  neutralAxis: "radius",
  steps: "quantity",
  rise: "height",
  run: "width",
};

export function GuidedReferenceGraphic({
  resolvedGraphic,
  activeFieldKey,
}: GuidedReferenceGraphicProps) {
  const t = useTranslations("guidance.labels");

  const labelFor = (canonicalId: string): string => {
    const key = LABEL_KEY_MAP[canonicalId] ?? canonicalId;
    const known = [
      "length", "width", "height", "depth", "diameter", "radius", "thickness",
      "angle", "area", "volume", "cost", "price", "margin", "energy", "power",
      "pressure", "flow", "distance", "time", "setup", "result", "decision",
      "input", "process", "quantity", "stops",
    ] as const;
    if ((known as readonly string[]).includes(key)) {
      return t(key as (typeof known)[number]);
    }
    return canonicalId;
  };

  const props = {
    fieldMap: resolvedGraphic.fieldMap,
    activeFieldKey,
    labelFor,
  };

  switch (resolvedGraphic.template) {
    case "box-dimension":
      return <BoxDimensionGraphic {...props} />;
    case "area":
      return <AreaGraphic {...props} />;
    case "volume":
      return <VolumeGraphic {...props} />;
    case "cylinder-pipe":
      return <CylinderPipeGraphic {...props} />;
    case "stair":
      return <StairGraphic {...props} />;
    case "bend-radius":
      return <BendRadiusGraphic {...props} />;
    case "angle":
      return <AngleGraphic {...props} />;
    case "route":
      return <RouteGraphic {...props} />;
    case "energy-flow":
      return <EnergyFlowGraphic {...props} />;
    case "machine-time":
      return <MachineTimeGraphic {...props} />;
    case "financial-flow":
      return <FinancialFlowGraphic {...props} />;
    case "generic":
    default:
      return <GenericCalculatorGraphic {...props} />;
  }
}
