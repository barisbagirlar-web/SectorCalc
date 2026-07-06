"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { getCurrentUserIdToken } from "@/lib/infrastructure/firebase/auth";

interface ReportPageParams {
  id: string;
}

function Badge({ style: s, children }: { style: { background: string; color: string }; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600, ...s }}>
      {children}
    </span>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "1.25rem", background: "#F0EEE6", border: "1px solid #D6D4CC", borderRadius: "8px", marginBottom: "1rem" }}>
      <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#BD5D3A", marginBottom: "0.75rem", marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "0.25rem" }}>
      <span style={{ color: "#6B6B68", minWidth: "140px", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#1A1915" }}>{value}</span>
    </div>
  );
}

function RiskBar({ label, score, maxVal }: { label: string; score: number; maxVal: number }) {
  const pct = Math.min((score / maxVal) * 100, 100);
  const fillColor = pct >= 80 ? "#A12323" : pct >= 50 ? "#A16A23" : "#238A23";
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
        <span style={{ color: "#6B6B68" }}>{label}</span>
        <span style={{ color: "#1A1915", fontWeight: 600 }}>{score}/{maxVal}</span>
      </div>
      <div style={{ height: "8px", background: "#D6D4CC", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: fillColor, borderRadius: "4px", transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function decisionBadge(state: string): { background: string; color: string } {
  switch (state) {
    case "LOW_RISK": return { background: "#D6F5D6", color: "#238A23" };
    case "PROCEED_WITH_CAUTION": return { background: "#FFF8D6", color: "#8A7A23" };
    case "STOP_AND_INSPECT": return { background: "#FFF0D6", color: "#A16A23" };
    case "QC_REQUIRED": return { background: "#F5D6D6", color: "#A12323" };
    default: return { background: "#F5D0D0", color: "#8A1010" };
  }
}

function toleranceBadge(status: string): { bg: string; fg: string; label: string } {
  switch (status) {
    case "BREACH": return { bg: "#F5D6D6", fg: "#A12323", label: "Breach" };
    case "UNCERTAIN": return { bg: "#FFF0D6", fg: "#A16A23", label: "Uncertain" };
    case "NEAR_LIMIT": return { bg: "#FFF8D6", fg: "#8A7A23", label: "Near Limit" };
    default: return { bg: "#D6F5D6", fg: "#238A23", label: "Inside" };
  }
}

function confidenceBadge(cls: string): { background: string; color: string } {
  switch (cls) {
    case "HIGH": return { background: "#D6F5D6", color: "#238A23" };
    case "MEDIUM": return { background: "#FFF8D6", color: "#8A7A23" };
    default: return { background: "#F5D6D6", color: "#A12323" };
  }
}

export default function EngineeringDiagnosticsReportPreviewPage({
  params,
}: {
  params: Promise<ReportPageParams>;
}) {
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    params.then(async (p) => {
      setId(p.id);
      // Try sessionStorage first (recently generated preview)
      try {
        const stored = sessionStorage.getItem("ediag_report_" + p.id);
        if (stored) {
          setReport(JSON.parse(stored));
          setLoading(false);
          return;
        }
      } catch {
        // ignore parse errors
      }

      // Fallback to Firestore via API
      const token = await getCurrentUserIdToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        const res = await fetch(`/api/engineering-diagnostics/reports/${p.id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data?.ok && data?.report) {
            setReport(data.report);
          }
        }
      } catch {
        // silent fallback
      }
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <PageLayout>
        <section className="sc-pro-section sc-pro-section--border" style={{ padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", color: "#6B6B68" }}>Loading report...</div>
        </section>
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout>
        <section className="sc-pro-section sc-pro-section--border" style={{ padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem", color: "#1A1915" }}>Report Not Available</h1>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#4A4A48", marginBottom: "1.5rem" }}>
              This diagnostic report could not be found. Preview reports are stored temporarily in your browser session and are not persisted to the server.
            </p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#4A4A48", marginBottom: "2rem" }}>Report ID: {id}</p>
            <Link href="/engineering-diagnostics/start" style={{ display: "inline-block", padding: "0.8rem 2rem", background: "#BD5D3A", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem" }}>
              Start New Diagnostic
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  /* ── Helpers for typed access ── */
  const get = <T,>(obj: unknown, key: string, fallback: T): T => {
    const o = obj as Record<string, unknown> | null;
    return o?.[key] as T ?? fallback;
  };
  const reportId = get(report, "report_id", "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ds: any = get(report, "decision_section", {});
  const decState: string = get(ds, "decision", "");
  const dBadge = decisionBadge(decState);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ap: any = get(report, "action_plan_section", {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ms: any = get(report, "measurement_section", { entries: [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedTools: any[] = get<any[]>(get(report, "related_tools_section", {}), "tools", []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methodologyEntries: any[] = get<any[]>(get(report, "methodology_section", {}), "entries", []);
  const methodologyNote: string = get(get(report, "methodology_section", {}), "note", "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditLog: any[] = get<any[]>(report, "audit_log", []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiSec: any = get(report, "ai_section", null);

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--border" style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <Link href="/engineering-diagnostics/start" style={{ fontSize: "0.85rem", color: "#BD5D3A", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
            &larr; Back to Start
          </Link>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "#1A1915" }}>Diagnostic Report Preview</h1>
          <p style={{ fontSize: "0.85rem", color: "#6B6B68", fontFamily: "monospace", marginBottom: "2rem" }}>Report ID: {reportId}</p>

          {/* Decision Banner */}
          <div style={{ padding: "1.25rem 1.5rem", borderRadius: "8px", background: dBadge.background, border: `1px solid ${dBadge.color}`, marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginBottom: "0.25rem" }}>Decision State</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: dBadge.color }}>{decState.replace(/_/g, " ")}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginBottom: "0.25rem" }}>Risk Score</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: dBadge.color }}>{get(ds, "total_risk_score", 0)}/100</div>
              </div>
            </div>
            {get(ds, "mandatory_floor_applied", false) && (
              <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "#FFF0D6", borderRadius: "6px", fontSize: "0.85rem", color: "#A16A23" }}>
                Measurement uncertainty triggered mandatory minimum decision floor: STOP_AND_INSPECT
              </div>
            )}
          </div>

          {/* Problem Summary */}
          <Card title="Problem Summary">
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", margin: 0 }}>
              {get(get(report, "problem_section", {}), "problem_context", "")}
            </p>
          </Card>

          {/* Domain */}
          <Card title="Domain">
            <InfoRow label="Domain ID" value={get(get(report, "domain_section", {}), "domain_id", "")} />
            <InfoRow label="Label" value={get(get(report, "domain_section", {}), "label", "")} />
            <InfoRow label="Category" value={get(get(report, "domain_section", {}), "category", "")} />
          </Card>

          {/* AI-Assisted Interpretation (full diagnostic only) */}
          {aiSec && (
            <Card title="AI-Assisted Engineering Interpretation">
              {/* Executive Summary */}
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem", marginTop: 0 }}>Executive Summary</h4>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", margin: 0, whiteSpace: "pre-wrap" }}>
                  {get(aiSec, "executive_summary", "")}
                </p>
              </div>

              {/* Engineering Interpretation */}
              {get(aiSec, "engineering_interpretation", "") && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem", marginTop: 0 }}>Engineering Interpretation</h4>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", margin: 0, whiteSpace: "pre-wrap" }}>
                    {get(aiSec, "engineering_interpretation", "")}
                  </p>
                </div>
              )}

              {/* Root Cause Hypotheses */}
              {Array.isArray(get(aiSec, "root_cause_hypotheses", [])) && get(aiSec, "root_cause_hypotheses", []).length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem", marginTop: 0 }}>Root Cause Hypotheses</h4>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48" }}>
                    {(get(aiSec, "root_cause_hypotheses", []) as string[]).map((h: string, i: number) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* NCR */}
              {get(aiSec, "ncr_statement", "") && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem", marginTop: 0 }}>Non-Conformance Report</h4>
                  <div style={{ padding: "0.75rem", background: "#FFF9F0", border: "1px solid #E8D5B5", borderRadius: "6px", fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", whiteSpace: "pre-wrap" }}>
                    {get(aiSec, "ncr_statement", "")}
                  </div>
                </div>
              )}

              {/* CAPA */}
              {get(aiSec, "capa_statement", "") && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem", marginTop: 0 }}>Corrective and Preventive Action</h4>
                  <div style={{ padding: "0.75rem", background: "#F0F5F0", border: "1px solid #B5D5B5", borderRadius: "6px", fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", whiteSpace: "pre-wrap" }}>
                    {get(aiSec, "capa_statement", "")}
                  </div>
                </div>
              )}

              {/* Action Narrative */}
              {get(aiSec, "action_narrative", "") && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem", marginTop: 0 }}>Action Narrative</h4>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", margin: 0, whiteSpace: "pre-wrap" }}>
                    {get(aiSec, "action_narrative", "")}
                  </p>
                </div>
              )}

              <div style={{ fontSize: "0.75rem", color: "#6B6B68", borderTop: "1px solid #D6D4CC", paddingTop: "0.5rem" }}>
                Generated by AI ({get(aiSec, "model", "openai")}) at {get(aiSec, "generated_at", "")}
              </div>
            </Card>
          )}

          {/* Measurement */}
          <Card title="Measurement">
            {(ms.entries as Array<Record<string, unknown>>).map((entry, i) => {
              const tb = toleranceBadge(entry.tolerance_status as string);
              const cb = confidenceBadge(entry.confidence_class as string);
              return (
                <div key={i} style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Badge style={{ background: tb.bg, color: tb.fg }}>Status: {tb.label}</Badge>
                    <Badge style={cb}>Confidence: {entry.confidence_class as string}</Badge>
                  </div>
                  <InfoRow label="Tool" value={entry.measurement_tool as string} />
                  <InfoRow label="Measured / Nominal" value={`${entry.measured_value} / ${entry.nominal_value} ${entry.unit as string}`} />
                  <InfoRow label="Expanded Uncertainty (k=2)" value={`${Number(entry.expanded_uncertainty_k2).toFixed(4)} ${entry.unit as string}`} />
                </div>
              );
            })}
            <InfoRow label="Worst Case" value={get(ms, "worst_case_tolerance_status", "")} />
          </Card>

          {/* Cost at Risk */}
          <Card title="Cost-at-Risk">
            <InfoRow label="Estimated Cost at Risk" value={`$${Number(get(get(report, "cost_section", {}), "estimated_cost_at_risk", 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          </Card>

          {/* Decision */}
          <Card title="Decision">
            <InfoRow label="Decision" value={decState.replace(/_/g, " ")} />
            <InfoRow label="Total Risk Score" value={`${get(ds, "total_risk_score", 0)}/100`} />
            <InfoRow label="Mandatory Floor Applied" value={get(ds, "mandatory_floor_applied", false) ? "Yes" : "No"} />
            <div style={{ marginTop: "0.75rem" }}>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.5rem", marginTop: 0 }}>Risk Breakdown</h4>
              {([
                ["Measurement Risk", get(ds, "measurement_risk", 0), 25],
                ["Confidence Risk", get(ds, "confidence_risk", 0), 15],
                ["Visual Advisory Risk", get(ds, "visual_advisory_risk", 0), 30],
                ["Exposure Risk", get(ds, "exposure_risk", 0), 15],
                ["Cost Risk", get(ds, "cost_risk", 0), 10],
                ["Manual Check Risk", get(ds, "manual_check_risk", 0), 5],
              ] as const).map(([label, score, maxVal]) => (
                <RiskBar key={label} label={label} score={score} maxVal={maxVal} />
              ))}
            </div>
          </Card>

          {/* Action Plan */}
          <Card title="Action Plan">
            {(["containment", "temporary_fix", "permanent_corrective_action", "required_manual_checks"] as const).map((group) => {
              const items = ap[group] as Array<Record<string, string>> | undefined;
              if (!items || items.length === 0) return null;
              const groupLabel = group === "temporary_fix" ? "Temporary Fix" : group === "permanent_corrective_action" ? "Permanent Corrective Action" : group === "required_manual_checks" ? "Required Manual Checks" : "Containment";
              return (
                <div key={group} style={{ marginBottom: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem", marginTop: 0 }}>{groupLabel}</h4>
                  {items.map((item, i) => {
                    const pColor = item.priority === "IMMEDIATE" ? "#A12323" : item.priority === "HIGH" ? "#A16A23" : "#6B6B68";
                    return (
                      <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.3rem" }}>
                        <span style={{ color: pColor, fontWeight: 600, minWidth: "70px", flexShrink: 0 }}>{item.priority}</span>
                        <span style={{ color: "#4A4A48" }}>{item.action}</span>
                        <span style={{ color: "#6B6B68", marginLeft: "auto", whiteSpace: "nowrap" }}>{item.responsible_role} &middot; {item.estimated_duration}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Card>

          {/* Related Tools */}
          <Card title="Related Tools">
            {relatedTools.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "#6B6B68", margin: 0 }}>No related tools for this domain.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {relatedTools.map((tool, i) => {
                  const statusColor = tool.status === "ACTIVE" ? "#238A23" : tool.status === "PLANNED" ? "#A16A23" : "#A12323";
                  return (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.85rem" }}>
                      <span style={{ background: statusColor, color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600, whiteSpace: "nowrap", marginTop: "0.15rem" }}>{tool.status}</span>
                      <div>
                        <div style={{ color: "#1A1915", fontWeight: 500 }}>{tool.label}</div>
                        <div style={{ color: "#6B6B68", fontSize: "0.8rem" }}>{tool.reason}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Methodology */}
          <Card title="Methodology">
            {methodologyEntries.map((entry, i) => (
              <div key={i} style={{ marginBottom: "0.75rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1915", margin: "0 0 0.25rem" }}>{entry.name}</h4>
                <p style={{ fontSize: "0.8rem", lineHeight: 1.5, color: "#4A4A48", margin: "0 0 0.15rem" }}>{entry.description}</p>
                <code style={{ fontSize: "0.78rem", color: "#6B6B68", background: "#E8E6DE", padding: "0.1rem 0.3rem", borderRadius: "3px" }}>{entry.formula}</code>
              </div>
            ))}
            {methodologyNote && (
              <p style={{ fontSize: "0.78rem", color: "#6B6B68", margin: "0.5rem 0 0", fontStyle: "italic" }}>{methodologyNote}</p>
            )}
          </Card>

          {/* Limitation */}
          <Card title="Limitation">
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", margin: 0 }}>
              <strong>Disclaimer:</strong> {get(get(report, "limitation_section", {}), "disclaimer", "")}
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#4A4A48", margin: "0.5rem 0 0" }}>
              <strong>LLM Limitation:</strong> {get(get(report, "limitation_section", {}), "llm_limitation", "")}
            </p>
          </Card>

          {/* Audit Log */}
          <Card title="Audit Log">
            <div style={{ background: "#1A1915", color: "#D6D4CC", padding: "0.75rem 1rem", borderRadius: "6px", fontSize: "0.75rem", fontFamily: "monospace", lineHeight: 1.6, maxHeight: "200px", overflowY: "auto" }}>
              {(auditLog as Array<Record<string, string>>).map((entry, i) => (
                <div key={i}>
                  {entry.event} &mdash; <span style={{ color: "#8A8A88" }}>{entry.at}</span>
                  <span style={{ color: "#6B6B68" }}> [source: {entry.source}, v{entry.engine_version}]</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Fingerprint */}
          <Card title="Report Fingerprint">
            <div style={{ fontSize: "0.8rem", color: "#6B6B68", fontFamily: "monospace", wordBreak: "break-all" }}>
              schema_version: {get(report, "schema_version", "")}<br />
              engine_version: {get(report, "engine_version", "")}<br />
              methodology_version: {get(report, "methodology_version", "")}<br />
              created_at: {get(report, "created_at", "")}
            </div>
          </Card>

          {/* PDF Generation */}
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              onClick={async () => {
                setPdfError(null);
                setPdfLoading(true);
                try {
                  const pdfToken = await getCurrentUserIdToken();
                  const pdfHeaders: Record<string, string> = { "Content-Type": "application/json" };
                  if (pdfToken) {
                    pdfHeaders["Authorization"] = `Bearer ${pdfToken}`;
                  }
                  const res = await fetch("/api/engineering-diagnostics/pdf", {
                    method: "POST",
                    headers: pdfHeaders,
                    body: JSON.stringify({ report }),
                  });
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    setPdfError(data.error || "Failed to generate PDF.");
                    setPdfLoading(false);
                    return;
                  }
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `sectorcalc-diagnostic-${reportId}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch {
                  setPdfError("Unable to generate PDF. Please try again.");
                }
                setPdfLoading(false);
              }}
              disabled={pdfLoading}
              style={{
                padding: "0.8rem 2rem",
                background: pdfLoading ? "#D6D4CC" : "#BD5D3A",
                color: pdfLoading ? "#6B6B68" : "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: pdfLoading ? "not-allowed" : "pointer",
                minHeight: "48px",
                transition: "background 0.13s",
              }}
            >
              {pdfLoading ? "Generating PDF..." : "Generate PDF Preview"}
            </button>
            {pdfError && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  background: "#F5D6D6",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#A12323",
                }}
              >
                {pdfError}
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link href="/engineering-diagnostics/start" style={{ display: "inline-block", padding: "0.8rem 2rem", background: "#BD5D3A", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem" }}>
              Start New Diagnostic
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
