/**
 * Universal PRO Tool — Shared Styles
 * SectorCalc design tokens: cream bg, near-black text, terracotta accent,
 * zero border-radius, Georgia/Inter/JetBrains Mono
 */

export const styles: any = {
  root: {
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F0EEE6",
    color: "#1A1915",
    maxWidth: 900,
    margin: "0 auto",
    border: "1px solid rgba(26,25,21,0.13)",
  },
  header: {
    padding: "22px 28px 18px",
    borderBottom: "2px solid #BD5D3A",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },
  headerLeft: { flex: 1 },
  category: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#BD5D3A",
    marginBottom: 5,
  },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: 21,
    fontWeight: 700,
    color: "#1A1915",
    margin: "0 0 3px 0",
    lineHeight: 1.25,
  },
  toolId: {
    fontSize: 10,
    color: "rgba(26,25,21,0.38)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  statusBadge: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-start", paddingTop: 4 },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.05em",
    padding: "3px 9px",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  badgeCritical: { background: "#DC2626", color: "#fff" },
  badgeWarning:  { background: "#D97706", color: "#fff" },
  badgeFail:     { background: "#DC2626", color: "#fff" },
  badgeWarn:     { background: "#D97706", color: "#fff" },
  badgeInfo:     { background: "#2563EB", color: "#fff" },
  badgeOk:       { background: "#059669", color: "#fff" },
  ucDisplay: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    padding: "3px 9px",
    background: "rgba(26,25,21,0.06)",
    color: "#1A1915",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },

  tabs: {
    display: "flex",
    borderBottom: "1px solid rgba(26,25,21,0.11)",
    background: "rgba(26,25,21,0.025)",
  },
  tab: {
    padding: "11px 20px",
    fontSize: 12,
    fontWeight: 500,
    border: "none",
    background: "transparent",
    color: "rgba(26,25,21,0.45)",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    position: "relative",
    transition: "color 0.12s",
  },
  tabActive: {
    color: "#1A1915",
    borderBottom: "2px solid #BD5D3A",
    fontWeight: 600,
  },
  tabDot: {
    display: "inline-block",
    width: 5,
    height: 5,
    background: "#EF4444",
    borderRadius: "50%",
    marginLeft: 5,
    verticalAlign: "2px",
  },

  panel: { padding: "22px 28px" },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(26,25,21,0.38)",
    marginBottom: 11,
    paddingBottom: 6,
    borderBottom: "1px solid rgba(26,25,21,0.08)",
  },

  enumGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 10,
    marginBottom: 16,
  },
  enumItem: { display: "flex", flexDirection: "column", gap: 5 },

  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: 10,
    marginBottom: 14,
  },
  inputItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "11px 13px",
    background: "#FAF9F5",
    border: "1px solid rgba(26,25,21,0.10)",
  },
  inputItemError: {
    border: "1px solid #EF4444",
    background: "#FEF2F2",
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#1A1915",
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  required: { color: "#BD5D3A", fontWeight: 700, marginLeft: 2 },
  confidenceBadge: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "0.07em",
    border: "1px solid",
    padding: "1px 4px",
    whiteSpace: "nowrap",
  },
  inputRow: { display: "flex", alignItems: "center", gap: 6 },
  input: {
    flex: 1,
    padding: "7px 9px",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    border: "1px solid rgba(26,25,21,0.19)",
    background: "#fff",
    color: "#1A1915",
    outline: "none",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  inputError: { border: "1px solid #EF4444" },
  unit: {
    fontSize: 10,
    color: "rgba(26,25,21,0.45)",
    whiteSpace: "nowrap",
    minWidth: 24,
  },
  inputHint: { fontSize: 9, color: "rgba(26,25,21,0.35)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.4 },
  inputErrMsg: { fontSize: 10, color: "#DC2626", fontWeight: 500, marginTop: 1 },

  suggestion: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 10,
    color: "#BD5D3A",
    marginTop: 2,
  },
  applyBtn: {
    fontSize: 9,
    fontWeight: 700,
    padding: "1px 6px",
    background: "#BD5D3A",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  select: {
    width: "100%",
    padding: "7px 9px",
    fontSize: 12,
    border: "1px solid rgba(26,25,21,0.19)",
    background: "#fff",
    color: "#1A1915",
    outline: "none",
    cursor: "pointer",
    appearance: "auto",
  },

  matCard: {
    display: "flex",
    marginBottom: 16,
    border: "1px solid rgba(26,25,21,0.10)",
    background: "#FAF9F5",
    overflow: "hidden",
  },
  matAccent: { width: 4, flexShrink: 0 },
  matContent: { padding: "11px 15px", flex: 1 },
  matLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", color: "rgba(26,25,21,0.38)", marginBottom: 8, textTransform: "uppercase" },
  matGrid: { display: "flex", gap: 20, flexWrap: "wrap" },
  matStat: { display: "flex", flexDirection: "column", gap: 2 },
  matStatLabel: { fontSize: 9, color: "rgba(26,25,21,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  matStatValue: { fontSize: 18, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1A1915", lineHeight: 1 },
  matStatOpt: { fontSize: 9, color: "#BD5D3A" },
  matSuggestions: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  suggestBtn: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 10px",
    background: "#BD5D3A",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  errorPanel: {
    background: "#FEF2F2",
    border: "1px solid #EF4444",
    padding: "11px 15px",
    marginBottom: 14,
  },
  errorItem: { display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5, fontSize: 12 },
  errorIcon: { color: "#DC2626", fontWeight: 700, flexShrink: 0, marginTop: 1 },

  actionRow: { display: "flex", gap: 10, marginTop: 8, alignItems: "center" },
  calcBtn: {
    padding: "12px 34px",
    background: "#1A1915",
    color: "#F0EEE6",
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "background 0.12s",
  },
  resetBtn: {
    padding: "11px 18px",
    background: "transparent",
    color: "#1A1915",
    border: "1px solid rgba(26,25,21,0.28)",
    fontSize: 12,
    cursor: "pointer",
  },

  warnPanel: { marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 },
  warnCard: { padding: "12px 15px" },
  warnHeader: { display: "flex", alignItems: "center", gap: 7, marginBottom: 5 },
  warnIcon: { fontSize: 16 },
  warnLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.07em" },
  warnSource: {
    fontSize: 9, fontWeight: 700, marginLeft: "auto",
    color: "rgba(26,25,21,0.48)",
    fontFamily: "'JetBrains Mono', monospace",
    border: "1px solid rgba(26,25,21,0.14)",
    padding: "1px 5px",
  },
  warnMsg: { fontSize: 12, color: "#1A1915", margin: 0, lineHeight: 1.55 },

  resultsTable: { border: "1px solid rgba(26,25,21,0.11)", overflow: "hidden", marginBottom: 16 },
  resultsHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 130px 80px",
    padding: "9px 14px",
    background: "#1A1915",
    color: "#F0EEE6",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  resultRow: {
    display: "grid",
    gridTemplateColumns: "1fr 130px 80px",
    padding: "9px 14px",
    borderTop: "1px solid rgba(26,25,21,0.06)",
    alignItems: "center",
  },
  resultName: { fontSize: 12, display: "flex", flexDirection: "column", gap: 1 },
  resultVar: { fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "rgba(26,25,21,0.35)" },
  resultValue: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, textAlign: "right" },
  resultUnit: { fontSize: 10, color: "rgba(26,25,21,0.45)", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },

  refsPanel: { marginTop: 12, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  refsTitle: { fontSize: 9, fontWeight: 700, color: "rgba(26,25,21,0.38)", letterSpacing: "0.06em" },
  refTag: {
    fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
    padding: "2px 7px", border: "1px solid rgba(26,25,21,0.18)", color: "rgba(26,25,21,0.5)",
  },

  emptyResults: {
    textAlign: "center", padding: "44px 20px",
    color: "rgba(26,25,21,0.38)", fontSize: 13,
  },
  emptyIcon: { display: "block", fontSize: 24, marginBottom: 8 },

  formulaList: { display: "flex", flexDirection: "column", gap: 0, border: "1px solid rgba(26,25,21,0.10)", overflow: "hidden", marginBottom: 14 },
  formulaRow: {
    display: "grid",
    gridTemplateColumns: "160px 20px 1fr",
    padding: "9px 14px",
    alignItems: "baseline",
    gap: 8,
    borderTop: "1px solid rgba(26,25,21,0.06)",
  },
  formulaLhs: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#BD5D3A", fontWeight: 600 },
  formulaEq:  { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(26,25,21,0.3)", textAlign: "center" },
  formulaRhs: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1A1915", wordBreak: "break-all", lineHeight: 1.5 },
  formulaComment: { gridColumn: "3", fontSize: 9, color: "rgba(26,25,21,0.38)", fontStyle: "italic", marginTop: 2, display: "block" },

  validationList: { marginTop: 14, display: "flex", flexDirection: "column", gap: 7 },
  validationItem: {
    display: "flex", gap: 10, padding: "7px 11px",
    borderLeft: "2px solid #BD5D3A",
    background: "rgba(189,93,58,0.04)",
    alignItems: "flex-start",
  },
  validationKey: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#BD5D3A", flexShrink: 0, paddingTop: 2, minWidth: 120 },
  validationMsg: { fontSize: 11, color: "#1A1915", lineHeight: 1.4 },

  // FMEA
  fmeaTable: { border: "1px solid rgba(26,25,21,0.11)", overflow: "hidden", marginBottom: 16 },
  fmeaHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 80px 100px 90px",
    padding: "9px 14px",
    background: "#1A1915",
    color: "#F0EEE6",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  fmeaRow: {
    display: "grid",
    gridTemplateColumns: "1fr 80px 100px 90px",
    padding: "9px 14px",
    borderTop: "1px solid rgba(26,25,21,0.06)",
    alignItems: "center",
    gap: 8,
  },
  fmeaCol: (col: number) => ({
    fontSize: col === 1 ? 0 : 11,
    display: "flex",
    flexDirection: col === 1 ? "column" : "row",
    alignItems: col === 1 ? "flex-start" : "center",
    gap: 2,
  }),
  fmeaMode: { fontSize: 12, fontWeight: 600, color: "#1A1915" },
  fmeaDesc: { fontSize: 9, color: "rgba(26,25,21,0.48)", lineHeight: 1.4, marginTop: 2 },
  fmeaSeverity: { fontSize: 9, fontWeight: 700, padding: "2px 6px", letterSpacing: "0.06em" },
  fmeaCondition: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "rgba(26,25,21,0.45)" },
  fmeaRpn: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700 },

  // Audit
  auditTable: { border: "1px solid rgba(26,25,21,0.11)", overflow: "hidden", marginBottom: 16 },
  auditHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    padding: "9px 14px",
    background: "#1A1915",
    color: "#F0EEE6",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  auditRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    padding: "8px 14px",
    borderTop: "1px solid rgba(26,25,21,0.06)",
    alignItems: "center",
  },
  auditLabel: { fontSize: 11, fontWeight: 600, color: "rgba(26,25,21,0.65)" },
  auditValue: { fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#1A1915", textAlign: "right" },

  calcedBar: {
    padding: "10px 28px",
    background: "#1A1915",
    color: "#F0EEE6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 12,
  },
  viewResultsBtn: {
    background: "#BD5D3A", color: "#fff", border: "none",
    padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },

  empty: { padding: 40, textAlign: "center", color: "rgba(26,25,21,0.4)" },
};

export const MATERIAL_DB: Record<string, { label: string; kc1: number; mc: number; vc: number[]; color: string }> = {
  "P_soft":   { label: "P — Steel (≤250 HB)",          kc1: 1900, mc: 0.26, vc: [180,280,400], color: "#3B82F6" },
  "P_hard":   { label: "P — Steel (250-350 HB)",        kc1: 2200, mc: 0.28, vc: [100,180,280], color: "#2563EB" },
  "M_aust":   { label: "M — Austenitic Stainless Steel",       kc1: 2400, mc: 0.22, vc: [80,160,240],  color: "#8B5CF6" },
  "M_duplex": { label: "M — Duplex Stainless Steel",           kc1: 2700, mc: 0.24, vc: [60,120,180],  color: "#7C3AED" },
  "K_gg":     { label: "K — Cast Iron (GG)",          kc1: 1350, mc: 0.20, vc: [100,200,350], color: "#6B7280" },
  "K_ggg":    { label: "K — Nodular Iron (GGG)",       kc1: 1600, mc: 0.22, vc: [80,160,280],  color: "#4B5563" },
  "N_al":     { label: "N — Aluminum Alloy",         kc1: 750,  mc: 0.14, vc: [400,800,1500],color: "#10B981" },
  "N_cu":     { label: "N — Copper/Brass",              kc1: 900,  mc: 0.16, vc: [200,400,800], color: "#059669" },
  "S_ti":     { label: "S — Titanium (Ti6Al4V)",        kc1: 2800, mc: 0.30, vc: [30,60,100],   color: "#F59E0B" },
  "S_ni":     { label: "S — Inconel 718 / Ni Alloy", kc1: 3000, mc: 0.32, vc: [20,45,80],    color: "#D97706" },
  "H_hrc55":  { label: "H — Hardened Steel (>55 HRC)", kc1: 3200, mc: 0.35, vc: [50,120,200],  color: "#EF4444" },
};

export function fmt(value: any, decimals = 3): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e6)  return Number(value).toExponential(2);
  if (abs >= 1000) return Number(value).toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (abs >= 1)    return Number(value).toLocaleString("en-US", { maximumFractionDigits: decimals });
  if (abs >= 0.01) return Number(value).toLocaleString("en-US", { maximumFractionDigits: decimals + 1 });
  return Number(value).toExponential(2);
}

export function translateConfidence(lbl?: string): string {
  if (!lbl) return "";
  const upper = lbl.toUpperCase();
  if (upper === "CERTAIN" || upper === "HIGH" || upper === "EXACT") return "High Confidence";
  if (upper === "STRONG" || upper === "MEDIUM") return "Medium Confidence";
  if (upper === "ASSUMPTION" || upper === "LOW" || upper === "DEFAULT") return "Assumption";
  return lbl;
}

export const CONFIDENCE_COLORS: Record<string, string> = {
  "CERTAIN": "#10B981", "HIGH": "#10B981", "EXACT": "#10B981",
  "STRONG": "#F59E0B", "MEDIUM": "#F59E0B",
  "ASSUMPTION": "#6B7280", "LOW": "#6B7280", "DEFAULT": "#6B7280",
};
