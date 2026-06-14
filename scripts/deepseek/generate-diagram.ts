import * as fs from "node:fs";
import * as path from "node:path";

interface InputField {
  id: string;
  label: string;
  type: string;
  unit?: string;
  default?: number | string | boolean;
}

interface ToolSchema {
  toolName: string;
  inputs: InputField[];
}

function detectGeometryInputs(inputs: InputField[]) {
  const length = inputs.find((i) => /length|uzunluk/i.test(i.id));
  const width = inputs.find((i) => /width|genişlik/i.test(i.id));
  const height = inputs.find((i) => /height|yükseklik|depth/i.test(i.id));
  return { length, width, height };
}

function hasGeometryInputs(inputs: InputField[]): boolean {
  const { length, width, height } = detectGeometryInputs(inputs);
  return Boolean(length || width || height);
}

function detectMeasurementInputs(inputs: InputField[]) {
  const target = inputs.find((i) => /target|hedef/i.test(i.id));
  const actual = inputs.find((i) => /actual|gerçek|real/i.test(i.id));
  const tolerance = inputs.find((i) => /tolerance|tolerans/i.test(i.id));
  return { target, actual, tolerance };
}

function detectProcessLossInputs(inputs: InputField[]) {
  const defect = inputs.find((i) => /defect|scrap|fire|ret|kusur|hata/i.test(i.id));
  const good = inputs.find((i) => /good|sağlam|uygun/i.test(i.id));
  const total = inputs.find((i) => /total|toplam|üretim/i.test(i.id));
  return { defect, good, total };
}

function asNumber(value: number | string | boolean | undefined, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return fallback;
}

function asDisplayValue(value: number | string | boolean | undefined): string {
  if (value === undefined || value === null) {
    return "?";
  }
  return String(value);
}

function generateGeometrySVG(toolName: string, inputs: InputField[]): string {
  const { length, width, height } = detectGeometryInputs(inputs);
  const lenVal = asDisplayValue(length?.default);
  const widVal = asDisplayValue(width?.default);
  const lenUnit = length?.unit ?? "m";
  const widUnit = width?.unit ?? "m";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
    </marker>
  </defs>
  <rect x="100" y="100" width="200" height="150" fill="#f0f9ff" stroke="#1e40af" stroke-width="2"/>
  <line x1="100" y1="80" x2="300" y2="80" stroke="#dc2626" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="200" y="75" text-anchor="middle" font-size="14" fill="#dc2626">${lenVal} ${lenUnit}</text>
  <line x1="320" y1="100" x2="320" y2="250" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="330" y="175" text-anchor="middle" font-size="14" fill="#2563eb" transform="rotate(90,330,175)">${widVal} ${widUnit}</text>
  ${height ? `<line x1="100" y1="100" x2="80" y2="70" stroke="#16a34a" stroke-width="1.5" marker-end="url(#arrow)"/><text x="75" y="85" text-anchor="end" font-size="12" fill="#16a34a">${asDisplayValue(height.default)} ${height.unit ?? "m"}</text>` : ""}
  <text x="250" y="40" text-anchor="middle" font-size="16" font-weight="bold">${toolName}</text>
  <text x="250" y="60" text-anchor="middle" font-size="12" fill="#666">Girdi değerleri şematik gösterim</text>
</svg>`;
}

function generateMeasurementSVG(toolName: string, inputs: InputField[]): string {
  const { target, actual, tolerance } = detectMeasurementInputs(inputs);
  const targetVal = asNumber(target?.default);
  const actualVal = asNumber(actual?.default);
  const tolVal = asNumber(tolerance?.default);
  const unit = target?.unit ?? actual?.unit ?? "birim";

  const diff = actualVal - targetVal;
  const absDiff = Math.abs(diff);
  const withinTol = tolVal > 0 ? absDiff <= tolVal : false;
  const scale = 300 / (targetVal + actualVal + 1);
  const targetX = 100 + targetVal * scale;
  const actualX = 100 + actualVal * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" width="100%" height="100%">
  <defs>
    <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
    </marker>
  </defs>
  <line x1="100" y1="150" x2="400" y2="150" stroke="#888" stroke-width="1"/>
  ${tolVal > 0 ? `<rect x="${100 + (targetVal - tolVal) * (300 / (2 * tolVal + 1))}" y="130" width="${2 * tolVal * (300 / (2 * tolVal + 1))}" height="40" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" stroke-dasharray="4"/>` : ""}
  <circle cx="${targetX}" cy="150" r="6" fill="#16a34a"/>
  <text x="${targetX}" y="130" text-anchor="middle" font-size="12" fill="#16a34a">Hedef</text>
  <circle cx="${actualX}" cy="150" r="6" fill="#dc2626"/>
  <text x="${actualX}" y="180" text-anchor="middle" font-size="12" fill="#dc2626">Gerçek</text>
  <line x1="${targetX}" y1="150" x2="${actualX}" y2="150" stroke="#333" stroke-width="1.5" marker-end="url(#arrowHead)" marker-start="url(#arrowHead)"/>
  <text x="250" y="120" text-anchor="middle" font-size="13" fill="#333">Sapma: ${diff.toFixed(2)} ${unit} ${withinTol ? "(Tolerans içinde)" : "(Tolerans dışında!)"}</text>
  <text x="250" y="40" text-anchor="middle" font-size="16" font-weight="bold">${toolName}</text>
</svg>`;
}

function generateProcessLossSVG(toolName: string, inputs: InputField[]): string {
  const { defect, good, total } = detectProcessLossInputs(inputs);
  const defectVal = asNumber(defect?.default);
  const goodVal = asNumber(good?.default);
  const totalVal = asNumber(total?.default, defectVal + goodVal);
  const defectRate = totalVal > 0 ? ((defectVal / totalVal) * 100).toFixed(1) : "0";
  const defectWidth = totalVal > 0 ? (defectVal / totalVal) * 260 : 0;
  const goodWidth = totalVal > 0 ? (goodVal / totalVal) * 260 : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" width="100%" height="100%">
  <rect x="100" y="100" width="300" height="100" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
  <text x="250" y="130" text-anchor="middle" font-size="14">Toplam üretim: ${totalVal}</text>
  <rect x="120" y="150" width="${defectWidth}" height="30" fill="#ef4444"/>
  <text x="${120 + defectWidth / 2}" y="170" text-anchor="middle" font-size="12" fill="white">Fire/Ret: ${defectVal} (${defectRate}%)</text>
  <rect x="${120 + defectWidth}" y="150" width="${goodWidth}" height="30" fill="#22c55e"/>
  <text x="${120 + defectWidth + goodWidth / 2}" y="170" text-anchor="middle" font-size="12" fill="white">Uygun: ${goodVal}</text>
  <text x="250" y="40" text-anchor="middle" font-size="16" font-weight="bold">${toolName}</text>
  <text x="250" y="250" text-anchor="middle" font-size="12" fill="#666">Girdi değerleri: Fire/Ret, Uygun, Toplam üretim</text>
</svg>`;
}

function generateGenericSVG(toolName: string, inputs: InputField[]): string {
  const inputList = inputs
    .slice(0, 5)
    .map((i) => `• ${i.label}: ${asDisplayValue(i.default)} ${i.unit ?? ""}`)
    .join('<tspan x="130" dy="20">');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" width="100%" height="100%">
  <text x="250" y="40" text-anchor="middle" font-size="16" font-weight="bold">${toolName}</text>
  <text x="50" y="80" font-size="14" font-weight="bold">Başlıca girdiler:</text>
  <text x="70" y="110" font-size="12" fill="#333">
    <tspan x="70" dy="0">${inputList}</tspan>
  </text>
  <text x="250" y="270" text-anchor="middle" font-size="12" fill="#666">Bu araç için şematik diyagram oluşturulamamıştır.</text>
</svg>`;
}

export function generateDiagramForSchema(schemaPath: string): string | undefined {
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema not found: ${schemaPath}`);
    return undefined;
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as ToolSchema;
  const inputs = schema.inputs ?? [];
  const toolName = schema.toolName ?? "Tool";

  let svg = "";
  const measurement = detectMeasurementInputs(inputs);
  const processLoss = detectProcessLossInputs(inputs);

  if (hasGeometryInputs(inputs)) {
    svg = generateGeometrySVG(toolName, inputs);
  } else if (measurement.target && measurement.actual) {
    svg = generateMeasurementSVG(toolName, inputs);
  } else if (processLoss.defect) {
    svg = generateProcessLossSVG(toolName, inputs);
  } else {
    svg = generateGenericSVG(toolName, inputs);
  }

  const outPath = schemaPath.replace(/-schema\.json$/i, "-diagram.svg");
  fs.writeFileSync(outPath, svg);
  console.log(`📐 Diagram saved: ${path.basename(outPath)}`);
  return outPath;
}
