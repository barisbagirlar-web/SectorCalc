"use client";
/**
 * UniversalProToolFMEA — Schema-driven FMEA panel
 * Renders FMEA items from tool schema
 * using exact CSS classes from UNIVERSAL PRO TOOL FORM.txt
 */

import type { ToolSchemaFMEAItem } from "@/lib/features/tool-schemas/types";

interface UniversalProToolFMEAProps {
  tool: any;
}

function rpnClass(rpn?: number): string {
  if (!rpn) return "rpn-low";
  if (rpn > 200) return "rpn-high";
  if (rpn > 100) return "rpn-med";
  return "rpn-low";
}

export default function UniversalProToolFMEA({ tool }: UniversalProToolFMEAProps) {
  const fmeaItems: ToolSchemaFMEAItem[] = tool.fmea || tool.engine_rules?.fmea || [];

  if (fmeaItems.length === 0) {
    return (
      <div className="panel">
        <div className="empty-state">
          <p>No FMEA data defined for this tool.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="sec-lbl">
        Failure Mode &amp; Effects Analysis (FMEA)
        <span className="sec-note">RPN = Severity × Occurrence × Detection (1–10 each)</span>
      </div>
      <div className="fmea-table">
        <div className="fmea-hdr">
          <span>Failure Mode</span>
          <span>Effect / Hazard</span>
          <span style={{ textAlign: "center" }}>S</span>
          <span style={{ textAlign: "center" }}>O</span>
          <span style={{ textAlign: "center" }}>D</span>
          <span style={{ textAlign: "center" }}>RPN</span>
          <span>Control Measure</span>
        </div>
        {fmeaItems.map((item, i) => {
          const sevScore = item.severity === "HIGH" ? 8 : item.severity === "MEDIUM" ? 5 : 3;
          const occ = item.occurrence || item.likelihood || 3;
          const det = item.detection || 3;
          const rpn = item.rpn || item.rpn_high || (sevScore * occ * det);

          return (
            <div key={i} className="fmea-row">
              <div className="fmea-mode">{item.failureMode}</div>
              <div className="fmea-effect">{item.effect || item.description || ""}</div>
              <div className="fmea-score">{sevScore}</div>
              <div className="fmea-score">{occ}</div>
              <div className="fmea-score">{det}</div>
              <div className={`fmea-rpn ${rpnClass(rpn)}`}>{rpn}</div>
              <div className="fmea-ctrl">{item.control_measure || ""}</div>
            </div>
          );
        })}
      </div>
      <div className="ok-banner" style={{ marginTop: 4 }}>
        ℹ FMEA review is advisory. For safety-critical design, independent verification is required.
      </div>
    </div>
  );
}
