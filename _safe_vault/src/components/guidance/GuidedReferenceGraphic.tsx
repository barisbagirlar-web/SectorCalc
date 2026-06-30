"use client";

import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import type { ResolvedReferenceGraphic } from "@/lib/guidance/reference-graphic-types";
import { AngleGraphic } from "@/components/guidance/templates/AngleGraphic";
import { AreaGraphic } from "@/components/guidance/templates/AreaGraphic";
import { BendRadiusGraphic } from "@/components/guidance/templates/BendRadiusGraphic";
import { BoxDimensionGraphic } from "@/components/guidance/templates/BoxDimensionGraphic";
import { CompressorLeakGraphic } from "@/components/guidance/templates/CompressorLeakGraphic";
import { CylinderPipeGraphic } from "@/components/guidance/templates/CylinderPipeGraphic";
import { EnergyFlowGraphic } from "@/components/guidance/templates/EnergyFlowGraphic";
import { FinancialFlowGraphic } from "@/components/guidance/templates/FinancialFlowGraphic";
import { GenericCalculatorGraphic } from "@/components/guidance/templates/GenericCalculatorGraphic";
import { MachineTimeGraphic } from "@/components/guidance/templates/MachineTimeGraphic";
import { OeeFlowGraphic } from "@/components/guidance/templates/OeeFlowGraphic";
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
  insideRadius: "insideRadius",
  thickness: "thickness",
  materialThickness: "materialThickness",
  angle: "angle",
  bendAngle: "bendAngle",
  neutralAxis: "neutralAxis",
  area: "area",
  volume: "volume",
  cost: "cost",
  price: "price",
  margin: "margin",
  tax: "tax",
  labor: "labor",
  energy: "energy",
  power: "power",
  pressure: "pressure",
  flow: "flow",
  leakDiameter: "leakDiameter",
  distance: "distance",
  fuel: "fuel",
  runtime: "runtime",
  setupTime: "setupTime",
  cycleTime: "cycleTime",
  plannedHours: "plannedHours",
  downtimeHours: "downtimeHours",
  scrapRate: "scrapRate",
  machineRate: "cost",
  quantity: "quantity",
  downtime: "downtime",
  steps: "steps",
  riserRise: "riserRise",
  treadRun: "treadRun",
  stairThickness: "stairThickness",
  result: "result",
  decision: "decision",
  input: "input",
  process: "process",
  revenue: "price",
  profit: "margin",
  payment: "cost",
  routeCost: "cost",
  stops: "stops",
  availability: "availability",
  performance: "performance",
  quality: "quality",
  goodParts: "goodParts",
  carbon: "energy",
};

const KNOWN_LABEL_KEYS = [
  "length", "width", "height", "depth", "diameter", "radius", "insideRadius", "thickness",
  "materialThickness", "angle", "bendAngle", "neutralAxis", "area", "volume", "cost", "price",
  "margin", "tax", "labor", "energy", "power", "pressure", "flow", "leakDiameter", "distance",
  "fuel", "runtime", "setupTime", "cycleTime", "plannedHours", "downtimeHours", "availability",
  "performance", "quality", "goodParts", "scrapRate", "quantity", "downtime", "steps", "riserRise",
  "treadRun", "stairThickness", "result", "decision", "input", "process", "stops",
] as const;

export function GuidedReferenceGraphic({
  resolvedGraphic,
  activeFieldKey,
}: GuidedReferenceGraphicProps) {
  const t = useTranslations("guidance.labels");

  const labelFor = (canonicalId: string): string => {
    const key = LABEL_KEY_MAP[canonicalId] ?? canonicalId;
    if ((KNOWN_LABEL_KEYS as readonly string[]).includes(key)) {
      return t(key as (typeof KNOWN_LABEL_KEYS)[number]);
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
    case "wall-area":
      return <AreaGraphic {...props} />;
    case "volume":
      return <VolumeGraphic {...props} />;
    case "cylinder-pipe":
      return <CylinderPipeGraphic {...props} />;
    case "stair":
      return <StairGraphic {...props} />;
    case "bend-radius":
      return <BendRadiusGraphic {...props} />;
    case "compressor-leak":
      return <CompressorLeakGraphic {...props} />;
    case "angle":
      return <AngleGraphic {...props} />;
    case "route":
      return <RouteGraphic {...props} />;
    case "energy-flow":
      return <EnergyFlowGraphic {...props} />;
    case "machine-time":
      return <MachineTimeGraphic {...props} />;
    case "oee-flow":
      return <OeeFlowGraphic {...props} />;
    case "financial-flow":
      return <FinancialFlowGraphic {...props} />;
    case "generic":
    default:
      return <GenericCalculatorGraphic {...props} />;
  }
}
