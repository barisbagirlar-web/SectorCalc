import type { JSX } from "react";

export type ShapeDimensionGuide = {
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  inputKeys: string[];
  Svg: (props: { locale: string }) => JSX.Element;
};

const LINE = "#1a1a1a";
const ACCENT = "#003366";
const BG = "#ffffff";

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
      </marker>
    </defs>
  );
}

function DimLabel({ x, y, text, anchor = "middle" }: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily="system-ui,sans-serif" fontSize="10" fill={ACCENT} fontWeight="600">
      {text}
    </text>
  );
}

function PaintCoverageGuideSvg() {
  return (
    <svg viewBox="0 0 420 240" width="100%" role="img" aria-labelledby="paint-guide-title">
      <title id="paint-guide-title">Paint coverage wall surface input guide</title>
      <desc>Wall rectangle with paintableArea width and height dimensions, coats layers, and coverage per unit label</desc>
      <rect width="420" height="240" fill={BG} />
      <ArrowDefs id="paint-arr" />
      <rect x="80" y="50" width="200" height="130" fill="#f5f8fb" stroke={LINE} strokeWidth="1.5" />
      <line x1="80" y1="195" x2="280" y2="195" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#paint-arr)" />
      <DimLabel x={180} y={212} text="paintableArea (m²)" />
      <line x1="290" y1="50" x2="290" y2="180" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#paint-arr)" />
      <DimLabel x={302} y={120} text="height" anchor="start" />
      <rect x="310" y="60" width="70" height="18" fill={ACCENT} opacity="0.15" stroke={ACCENT} strokeWidth="1" />
      <rect x="310" y="82" width="70" height="18" fill={ACCENT} opacity="0.25" stroke={ACCENT} strokeWidth="1" />
      <rect x="310" y="104" width="70" height="18" fill={ACCENT} opacity="0.35" stroke={ACCENT} strokeWidth="1" />
      <DimLabel x={345} y={74} text="coats" />
      <rect x="310" y="140" width="90" height="36" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="355" y="158" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LINE}>coveragePerUnit</text>
      <text x="355" y="170" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LINE}>unitPrice · wasteAllowancePct</text>
    </svg>
  );
}

function HomeRenovationM2GuideSvg() {
  return (
    <svg viewBox="0 0 420 240" width="100%" role="img" aria-labelledby="reno-guide-title">
      <title id="reno-guide-title">Home renovation room plan input guide</title>
      <desc>Room floor plan with length and width forming areaM2, plus unit cost and contingency labels</desc>
      <rect width="420" height="240" fill={BG} />
      <ArrowDefs id="reno-arr" />
      <rect x="70" y="55" width="220" height="140" fill="#f5f8fb" stroke={LINE} strokeWidth="1.5" />
      <line x1="70" y1="210" x2="290" y2="210" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#reno-arr)" />
      <DimLabel x={180} y={227} text="length → areaM2" />
      <line x1="300" y1="55" x2="300" y2="195" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#reno-arr)" />
      <DimLabel x={312} y={130} text="width" anchor="start" />
      <rect x="90" y="75" width="60" height="40" fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="4 3" />
      <text x="120" y="100" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9" fill={LINE}>demolitionCost</text>
      <rect x="310" y="55" width="95" height="72" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="357" y="78" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={ACCENT}>areaM2</text>
      <text x="357" y="94" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LINE}>unitCostPerM2</text>
      <text x="357" y="110" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LINE}>contingencyPct</text>
    </svg>
  );
}

function KwhConsumptionGuideSvg() {
  return (
    <svg viewBox="0 0 420 240" width="100%" role="img" aria-labelledby="kwh-guide-title">
      <title id="kwh-guide-title">kWh consumption appliance timeline input guide</title>
      <desc>Electric appliance connected to outlet with powerKw, hoursPerDay timeline, days period and tariffPerKwh</desc>
      <rect width="420" height="240" fill={BG} />
      <ArrowDefs id="kwh-arr" />
      <rect x="40" y="70" width="90" height="70" rx="6" fill="#f5f8fb" stroke={LINE} strokeWidth="1.5" />
      <text x="85" y="110" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="10" fill={LINE}>Appliance</text>
      <DimLabel x={85} y={155} text="powerKw" />
      <rect x="150" y="95" width="36" height="50" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1.5" />
      <circle cx="168" cy="120" r="6" fill={ACCENT} />
      <line x1="130" y1="105" x2="150" y2="105" stroke={LINE} strokeWidth="2" />
      <line x1="186" y1="120" x2="220" y2="120" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#kwh-arr)" />
      <line x1="220" y1="100" x2="380" y2="100" stroke={LINE} strokeWidth="1" />
      <line x1="220" y1="100" x2="220" y2="130" stroke={ACCENT} strokeWidth="1.5" />
      <line x1="380" y1="100" x2="380" y2="130" stroke={ACCENT} strokeWidth="1.5" />
      <line x1="220" y1="130" x2="380" y2="130" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#kwh-arr)" />
      <DimLabel x={300} y={148} text="hoursPerDay" />
      <rect x="220" y="160" width="160" height="28" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="300" y="178" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LINE}>days · tariffPerKwh</text>
    </svg>
  );
}

function PlumbingFixtureGuideSvg() {
  return (
    <svg viewBox="0 0 420 240" width="100%" role="img" aria-labelledby="plumb-guide-title">
      <title id="plumb-guide-title">Plumbing fixture installation input guide</title>
      <desc>Sink and faucet fixture with fixtureCount, material cost, labor hours and labor rate labels</desc>
      <rect width="420" height="240" fill={BG} />
      <ArrowDefs id="plumb-arr" />
      <ellipse cx="120" cy="150" rx="55" ry="28" fill="#f5f8fb" stroke={LINE} strokeWidth="1.5" />
      <rect x="105" y="80" width="30" height="50" fill="none" stroke={LINE} strokeWidth="1.5" />
      <path d="M120 80 Q120 55 145 55" fill="none" stroke={ACCENT} strokeWidth="2" />
      <circle cx="145" cy="55" r="5" fill={ACCENT} />
      <DimLabel x={120} y={195} text="fixtureCount" />
      <rect x="210" y="60" width="180" height="130" rx="6" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="300" y="88" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={ACCENT}>unitMaterialCost</text>
      <text x="300" y="108" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={LINE}>laborHoursPerFixture</text>
      <text x="300" y="128" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={LINE}>laborRate</text>
      <text x="300" y="148" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={LINE}>overheadPct</text>
      <line x1="175" y1="120" x2="210" y2="120" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#plumb-arr)" />
    </svg>
  );
}

function PressureVesselGuideSvg() {
  return (
    <svg viewBox="0 0 420 260" width="100%" role="img" aria-labelledby="pv-guide-title">
      <title id="pv-guide-title">Pressure vessel cross-section wall thickness input guide</title>
      <desc>Cylindrical vessel cross-section showing designPressureBar, diameterMm, allowableStressMpa and weldEfficiency</desc>
      <rect width="420" height="260" fill={BG} />
      <ArrowDefs id="pv-arr" />
      <ellipse cx="200" cy="130" rx="120" ry="70" fill="#f5f8fb" stroke={LINE} strokeWidth="2" />
      <ellipse cx="200" cy="130" rx="100" ry="58" fill={BG} stroke={ACCENT} strokeWidth="1.5" />
      <line x1="200" y1="130" x2="320" y2="130" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#pv-arr)" />
      <DimLabel x={260} y={122} text="diameterMm" />
      <line x1="310" y1="72" x2="310" y2="188" stroke={ACCENT} strokeWidth="2" />
      <DimLabel x={322} y={134} text="wallThicknessMm" anchor="start" />
      <rect x="40" y="40" width="120" height="56" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="100" y="62" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={ACCENT}>designPressureBar</text>
      <text x="100" y="78" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LINE}>allowableStressMpa</text>
      <text x="100" y="94" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LINE}>weldEfficiency</text>
    </svg>
  );
}

function ElectricalPanelGuideSvg() {
  return (
    <svg viewBox="0 0 420 260" width="100%" role="img" aria-labelledby="panel-guide-title">
      <title id="panel-guide-title">Electrical panel rework cost input guide</title>
      <desc>Electrical distribution panel with wiring hours, labor rate, inspection and test equipment cost labels</desc>
      <rect width="420" height="260" fill={BG} />
      <ArrowDefs id="panel-arr" />
      <rect x="120" y="40" width="180" height="170" rx="4" fill="#f5f8fb" stroke={LINE} strokeWidth="2" />
      <line x1="140" y1="70" x2="280" y2="70" stroke={LINE} strokeWidth="1" />
      <line x1="140" y1="100" x2="280" y2="100" stroke={LINE} strokeWidth="1" />
      <line x1="140" y1="130" x2="280" y2="130" stroke={LINE} strokeWidth="1" />
      <line x1="140" y1="160" x2="280" y2="160" stroke={LINE} strokeWidth="1" />
      <rect x="155" y="58" width="18" height="10" fill={ACCENT} opacity="0.6" />
      <rect x="190" y="88" width="18" height="10" fill={ACCENT} opacity="0.6" />
      <rect x="225" y="118" width="18" height="10" fill={ACCENT} opacity="0.6" />
      <DimLabel x={210} y={225} text="panelRevenue" />
      <rect x="30" y="55" width="78" height="100" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="69" y="78" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={ACCENT}>wiringHours</text>
      <text x="69" y="94" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LINE}>estimatedHours</text>
      <text x="69" y="110" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LINE}>laborRate</text>
      <rect x="320" y="55" width="78" height="100" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="359" y="86" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LINE}>inspectionFailCost</text>
      <text x="359" y="108" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LINE}>testEquipmentCost</text>
      <line x1="108" y1="105" x2="120" y2="105" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#panel-arr)" />
      <line x1="300" y1="105" x2="320" y2="105" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#panel-arr)" />
    </svg>
  );
}

function AreaConverterGuideSvg() {
  return (
    <svg viewBox="0 0 420 240" width="100%" role="img" aria-labelledby="area-guide-title">
      <title id="area-guide-title">Area measurement surface converter input guide</title>
      <desc>Measured floor surface with value, fromUnit and toUnit conversion arrows</desc>
      <rect width="420" height="240" fill={BG} />
      <ArrowDefs id="area-arr" />
      <rect x="60" y="70" width="180" height="100" fill="#f5f8fb" stroke={LINE} strokeWidth="1.5" />
      <line x1="60" y1="185" x2="240" y2="185" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#area-arr)" />
      <line x1="250" y1="70" x2="250" y2="170" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#area-arr)" />
      <DimLabel x={150} y={202} text="value" />
      <rect x="280" y="80" width="110" height="80" rx="6" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="335" y="108" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={ACCENT}>fromUnit</text>
      <line x1="310" y1="120" x2="360" y2="120" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#area-arr)" />
      <text x="335" y="142" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={LINE}>toUnit</text>
    </svg>
  );
}

function LengthConverterGuideSvg() {
  return (
    <svg viewBox="0 0 420 200" width="100%" role="img" aria-labelledby="len-guide-title">
      <title id="len-guide-title">Technical length dimension line converter input guide</title>
      <desc>Engineering length dimension line with value, fromUnit and toUnit labels</desc>
      <rect width="420" height="200" fill={BG} />
      <ArrowDefs id="len-arr" />
      <line x1="40" y1="100" x2="300" y2="100" stroke={LINE} strokeWidth="3" />
      <line x1="40" y1="85" x2="40" y2="115" stroke={ACCENT} strokeWidth="2" />
      <line x1="300" y1="85" x2="300" y2="115" stroke={ACCENT} strokeWidth="2" />
      <line x1="40" y1="120" x2="300" y2="120" stroke={ACCENT} strokeWidth="1.5" markerStart="url(#len-arr)" markerEnd="url(#len-arr)" />
      <DimLabel x={170} y={138} text="value" />
      <rect x="320" y="55" width="80" height="90" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="360" y="82" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={ACCENT}>fromUnit</text>
      <line x1="340" y1="95" x2="380" y2="95" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#len-arr)" />
      <text x="360" y="122" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={LINE}>toUnit</text>
    </svg>
  );
}

function VolumeConverterGuideSvg() {
  return (
    <svg viewBox="0 0 420 240" width="100%" role="img" aria-labelledby="vol-guide-title">
      <title id="vol-guide-title">Volume container prism converter input guide</title>
      <desc>Rectangular tank prism with value, fromUnit and toUnit volume conversion labels</desc>
      <rect width="420" height="240" fill={BG} />
      <ArrowDefs id="vol-arr" />
      <path d="M90 160 L90 90 L200 70 L200 140 Z" fill="#f5f8fb" stroke={LINE} strokeWidth="1.5" />
      <path d="M200 70 L290 85 L290 155 L200 140 Z" fill="#eef3f8" stroke={LINE} strokeWidth="1.5" />
      <path d="M90 160 L200 140 L290 155 L180 175 Z" fill="#dde8f2" stroke={LINE} strokeWidth="1.5" />
      <line x1="90" y1="175" x2="200" y2="155" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#vol-arr)" />
      <DimLabel x={140} y={192} text="value" />
      <rect x="310" y="70" width="90" height="90" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="355" y="98" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={ACCENT}>fromUnit</text>
      <line x1="330" y1="112" x2="380" y2="112" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#vol-arr)" />
      <text x="355" y="138" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={LINE}>toUnit</text>
    </svg>
  );
}

function WeightConverterGuideSvg() {
  return (
    <svg viewBox="0 0 420 240" width="100%" role="img" aria-labelledby="wt-guide-title">
      <title id="wt-guide-title">Scale load weight converter input guide</title>
      <desc>Industrial scale with load block showing value, fromUnit and toUnit weight conversion</desc>
      <rect width="420" height="240" fill={BG} />
      <ArrowDefs id="wt-arr" />
      <rect x="130" y="150" width="160" height="18" rx="3" fill={LINE} />
      <rect x="150" y="168" width="12" height="30" fill={LINE} />
      <rect x="258" y="168" width="12" height="30" fill={LINE} />
      <rect x="175" y="95" width="70" height="55" fill="#f5f8fb" stroke={ACCENT} strokeWidth="2" />
      <text x="210" y="128" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="11" fill={ACCENT} fontWeight="600">value</text>
      <rect x="60" y="55" width="90" height="50" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="105" y="78" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={ACCENT}>fromUnit</text>
      <line x1="150" y1="80" x2="175" y2="110" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#wt-arr)" />
      <rect x="270" y="55" width="90" height="50" rx="4" fill="#eef3f8" stroke={ACCENT} strokeWidth="1" />
      <text x="315" y="78" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={LINE}>toUnit</text>
      <line x1="245" y1="110" x2="270" y2="80" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#wt-arr)" />
    </svg>
  );
}

const SHAPE_DIMENSION_GUIDES: readonly ShapeDimensionGuide[] = [
  {
    slug: "paint-coverage-cost-check",
    title: {
      en: "Enter paintable wall area, coat count and coverage per unit.",
    },
    description: {
      en: "Wall surface, coats and coverage map to paintableArea, coats and coveragePerUnit.",
    },
    inputKeys: ["paintableArea", "coveragePerUnit", "coats", "unitPrice", "wasteAllowancePct"],
    Svg: PaintCoverageGuideSvg,
  },
  {
    slug: "home-renovation-m2",
    title: {
      en: "Enter room floor area and unit cost per m².",
    },
    description: {
      en: "Floor area is areaM2 alongside unit cost, demolition and contingency fields.",
    },
    inputKeys: ["areaM2", "unitCostPerM2", "demolitionCost", "contingencyPct"],
    Svg: HomeRenovationM2GuideSvg,
  },
  {
    slug: "kwh-consumption-check",
    title: {
      en: "Enter appliance power, daily run hours and tariff.",
    },
    description: {
      en: "Power, duration and tariff map to powerKw, hoursPerDay, days and tariffPerKwh.",
    },
    inputKeys: ["powerKw", "hoursPerDay", "days", "tariffPerKwh"],
    Svg: KwhConsumptionGuideSvg,
  },
  {
    slug: "plumbing-fixture-cost-check",
    title: {
      en: "Enter fixture count, material and labor costs.",
    },
    description: {
      en: "Fixture count maps to fixtureCount; material and hourly costs go to their fields.",
    },
    inputKeys: ["fixtureCount", "unitMaterialCost", "laborHoursPerFixture", "laborRate", "overheadPct"],
    Svg: PlumbingFixtureGuideSvg,
  },
  {
    slug: "pressure-vessel-wall-thickness-calculator",
    title: {
      en: "Enter design pressure and inside diameter on the vessel cross-section.",
    },
    description: {
      en: "designPressureBar, diameterMm, allowableStressMpa and weldEfficiency match the material screen.",
    },
    inputKeys: ["designPressureBar", "diameterMm", "allowableStressMpa", "weldEfficiency"],
    Svg: PressureVesselGuideSvg,
  },
  {
    slug: "electrical-panel-rework-cost",
    title: {
      en: "Enter panel wiring hours, labor rate and test costs.",
    },
    description: {
      en: "wiringHours, estimatedHours, laborRate, inspectionFailCost and testEquipmentCost are panel rework fields.",
    },
    inputKeys: [
      "panelRevenue",
      "wiringHours",
      "estimatedHours",
      "laborRate",
      "inspectionFailCost",
      "testEquipmentCost",
    ],
    Svg: ElectricalPanelGuideSvg,
  },
  {
    slug: "area-converter",
    title: {
      en: "Enter measured surface area and unit conversion.",
    },
    description: {
      en: "value, fromUnit and toUnit are the area converter inputs.",
    },
    inputKeys: ["value", "fromUnit"],
    Svg: AreaConverterGuideSvg,
  },
  {
    slug: "length-converter",
    title: {
      en: "Enter technical length measurement and unit conversion.",
    },
    description: {
      en: "Use value, fromUnit and toUnit on the dimension line.",
    },
    inputKeys: ["value", "fromUnit"],
    Svg: LengthConverterGuideSvg,
  },
  {
    slug: "volume-converter",
    title: {
      en: "Enter container volume and unit conversion.",
    },
    description: {
      en: "Prism tank volume converts via value with fromUnit and toUnit.",
    },
    inputKeys: ["value", "fromUnit"],
    Svg: VolumeConverterGuideSvg,
  },
  {
    slug: "weight-converter",
    title: {
      en: "Enter scale load and unit conversion.",
    },
    description: {
      en: "Load value is value; source and target units are fromUnit and toUnit.",
    },
    inputKeys: ["value", "fromUnit"],
    Svg: WeightConverterGuideSvg,
  },
];

const GUIDE_BY_SLUG = new Map<string, ShapeDimensionGuide>(
  SHAPE_DIMENSION_GUIDES.map((guide) => [guide.slug, guide]),
);

export function getShapeDimensionGuide(slug: string): ShapeDimensionGuide | null {
  return GUIDE_BY_SLUG.get(slug) ?? null;
}

export function listShapeDimensionGuideSlugs(): readonly string[] {
  return SHAPE_DIMENSION_GUIDES.map((guide) => guide.slug);
}
