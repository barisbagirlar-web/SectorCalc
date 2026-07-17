// SectorCalc PRO Report — Control Band (SPC, ISO 7870)
// Horizontal band chart: single metric value against UCL/LCL and spec limits.
// Pure presentational — no side effects.

interface ControlBandProps {
  label: string;
  value: number;
  unit: string | null;
  lcl: number;
  ucl: number;
  specLow?: number;
  specHigh?: number;
  emptyLabel?: string;
}

export function ControlBand({
  label,
  value,
  unit,
  lcl,
  ucl,
  specLow,
  specHigh,
  emptyLabel = "No control band data.",
}: ControlBandProps) {
  if (!Number.isFinite(value)) {
    return (
      <div className="pro-report-sec">
        <div className="pro-report-sec-h">
          <span className="pro-report-sec-n">C</span>
          <span className="pro-report-sec-t">Control Band: {label}</span>
        </div>
        <p className="pro-report-empty">{emptyLabel}</p>
      </div>
    );
  }

  const dataMin = Math.min(value, lcl, specLow ?? lcl);
  const dataMax = Math.max(value, ucl, specHigh ?? ucl);
  const range = dataMax - dataMin || 1;
  const pad = range * 0.1;
  const plotMin = dataMin - pad;
  const plotMax = dataMax + pad;
  const plotRange = plotMax - plotMin;

  const W = 500;
  const H = 80;
  const padL = 8;
  const padR = 8;
  const plotW = W - padL - padR;

  const xPos = (v: number): number => padL + ((v - plotMin) / plotRange) * plotW;

  const inViolation = specLow !== undefined && specHigh !== undefined && (value < specLow || value > specHigh);

  return (
    <div className="pro-report-sec">
      <div className="pro-report-sec-h">
        <span className="pro-report-sec-n">C</span>
        <span className="pro-report-sec-t">Control Band: {label}</span>
      </div>
      <div className="pro-report-control-band">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Control band for ${label}: value = ${value}`}>
          {/* Spec limit zone */}
          {specLow !== undefined && specHigh !== undefined && (
            <rect
              x={xPos(specLow)}
              y={4}
              width={xPos(specHigh) - xPos(specLow)}
              height={H - 8}
              fill="#E7F1EB"
              rx={0}
            />
          )}

          {/* UCL line */}
          <line x1={padL} y1={18} x2={W - padR} y2={18} stroke="#8A5A12" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={W - padR + 2} y={21} fontSize="8.5" fill="#8A5A12" fontFamily="JetBrains Mono, monospace">UCL</text>

          {/* LCL line */}
          <line x1={padL} y1={H - 18} x2={W - padR} y2={H - 18} stroke="#8A5A12" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={W - padR + 2} y={H - 15} fontSize="8.5" fill="#8A5A12" fontFamily="JetBrains Mono, monospace">LCL</text>

          {/* Center axis */}
          <line x1={padL} y1={H / 2} x2={W - padR} y2={H / 2} stroke="#E4E0D6" strokeWidth={0.5} />

          {/* Value point */}
          <circle
            cx={xPos(value)}
            cy={H / 2}
            r={6}
            fill={inViolation ? "#9C3520" : "#3A4D8F"}
            stroke="#fff"
            strokeWidth={2}
          />
          <text
            x={xPos(value)}
            y={H / 2 + 3.5}
            textAnchor="middle"
            fontSize="8"
            fill="#fff"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
          >
            •
          </text>

          {/* Value label */}
          <text
            x={xPos(value)}
            y={H / 2 - 12}
            textAnchor="middle"
            fontSize="10"
            fill={inViolation ? "#9C3520" : "#181713"}
            fontFamily="JetBrains Mono, monospace"
            fontWeight="500"
          >
            {Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—"}
            {unit ? ` ${unit}` : ""}
          </text>

          {/* UCL label value */}
          <text x={xPos(ucl)} y={14} fontSize="8" fill="#8A5A12" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
            {Number.isFinite(ucl) ? ucl.toLocaleString("en-US", { maximumFractionDigits: 1 }) : "—"}
          </text>

          {/* LCL label value */}
          <text x={xPos(lcl)} y={H - 4} fontSize="8" fill="#8A5A12" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
            {Number.isFinite(lcl) ? lcl.toLocaleString("en-US", { maximumFractionDigits: 1 }) : "—"}
          </text>
        </svg>
      </div>
      <p className="pro-report-note">
        Value relative to control limits (UCL/LCL). {specLow !== undefined && specHigh !== undefined
          ? `Specification band: [${Number.isFinite(specLow) ? specLow.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—"} — ${Number.isFinite(specHigh) ? specHigh.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—"}]${unit ? ` ${unit}` : ""}. `
          : ""
        }
        {inViolation ? "Value exceeds specification limits — corrective action indicated." : "Value within specification."}
      </p>
    </div>
  );
}
