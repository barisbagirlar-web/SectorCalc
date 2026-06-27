/**
 * UniversalProToolAudit — Schema-driven audit log panel
 * Renders calculation audit trail
 * using exact CSS classes from UNIVERSAL PRO TOOL FORM.txt
 */
"use client";

interface UniversalProToolAuditProps {
  tool: any;
  calculated: boolean;
  audit: Record<string, any> | null;
}

export default function UniversalProToolAudit({
  tool,
  calculated,
  audit,
}: UniversalProToolAuditProps) {
  if (!calculated || !audit) {
    return (
      <div className="panel">
        <div className="audit-log">
          <div className="audit-hdr">
            <span className="audit-hdr-title">ISO 9001 §8.5.1 Calculation Audit Trail</span>
            <span className="audit-hdr-badge">{tool.tool_id || "PRO"} · SectorCalc</span>
          </div>
          <div className="audit-empty">No calculation performed. Run calculator to generate audit record.</div>
        </div>
      </div>
    );
  }

  const auditEntries = Object.entries(audit).filter(([k]) => !k.startsWith("_"));

  return (
    <div className="panel">
      <div className="audit-log">
        <div className="audit-hdr">
          <span className="audit-hdr-title">ISO 9001 §8.5.1 Calculation Audit Trail</span>
          <span className="audit-hdr-badge">{tool.tool_id || "PRO"} · SectorCalc</span>
        </div>
        <div className="audit-body">
          {auditEntries.map(([key, value]) => {
            const displayKey = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase());
            let valClass = "";
            const v = String(value);
            if (v === "PASS") valClass = "ok";
            else if (v === "FAIL") valClass = "fail";
            else if (v === "WARN") valClass = "warn";

            return (
              <div key={key} className="audit-row">
                <span className="audit-key">{displayKey}</span>
                <span className={`audit-val ${valClass}`}>
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
