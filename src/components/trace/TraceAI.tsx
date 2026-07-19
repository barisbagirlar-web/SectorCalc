"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  sanitizeHistory,
  stripAllToolBlocks,
  type SanitizableMessage,
} from "@/lib/infrastructure/trace/trace-sanitizer";

/**
 * Trace AI - audit-grounded analysis copilot for the SectorCalc credit engine.
 * ---------------------------------------------------------------------------
 * A premium floating assistant. Collapsed, it reads as a precision instrument
 * (oscilloscope trace + live status); expanded, it answers questions about the
 * current assessment, grounded in the engine's outputs and audit trail.
 *
 *  - Zero external dependencies (inline SVG, inline styles, React only).
 *  - Brand-exact: warm paper, ink, single terracotta accent, zero radius,
 *    Georgia / Inter / JetBrains Mono.
 *  - Accessible: dialog semantics, Esc to close, focus management, aria-live.
 *  - Backend-agnostic: pass `onAsk` (Promise OR AsyncIterable for streaming).
 *    Without it, `demoMode` returns canned grounded answers for preview.
 *
 * Usage (production):
 *   <TraceAI
 *     context={{ toolId: "PRO_CREDIT_ASSESSMENT_ENGINE", decision, score,
 *                recommendedMaxFacility, bindingConstraint, currency }}
 *     onAsk={(q, ctx, history) => streamFromYourLLM(q, ctx, history)}
 *   />
 *
 * History sanitizer:
 *   The conversation history passed to `onAsk` is auto-sanitized - orphaned
 *   `tool_use` messages and all `tool_use` blocks are stripped (trace never
 *   calls tools). If the upstream API returns `invalid_request_error`, a
 *   retry with fully cleaned history is attempted once.
 */

/* ----------------------------- Types ----------------------------- */

export interface TraceContext {
  toolId?: string;
  decision?: string;
  score?: number;
  recommendedMaxFacility?: number;
  bindingConstraint?: string;
  currency?: string;
}

export type AskResult = string | AsyncIterable<string>;

export interface TraceAIProps {
  /** Live assessment context shown in the panel and passed to `onAsk`. */
  context?: TraceContext;
  /**
   * Backend hook. Return a string, or an AsyncIterable<string> to stream.
   * `history` is the auto-sanitized conversation (tool_use blocks stripped).
   */
  onAsk?: (
    question: string,
    context: TraceContext,
    history: SanitizableMessage[],
  ) => Promise<AskResult> | AskResult;
  /** Suggested prompts (chips). Defaults are credit-engine specific. */
  suggestions?: string[];
  /** Canned answers when no `onAsk` is provided. */
  demoMode?: boolean;
  /** Start expanded. Default false. */
  defaultOpen?: boolean;
  /** Heading shown on the panel. */
  title?: string;
}

export type TraceMessage = SanitizableMessage;

interface Message {
  role: "user" | "assistant";
  content: string;
}

/* ----------------------------- Tokens ----------------------------- */

const C = {
  ink: "#1A1915",
  paper: "#F0EEE6",
  surface: "#FAF9F5",
  line: "#DAD6C9",
  sub: "#5A574E",
  muted: "#8A857A",
  accent: "#BD5D3A",
  accent2: "#D97757",
  onDark: "#A8A294",
  warn: "#B5561F",
  white: "#FFFFFF",
  serif: 'Georgia, "Times New Roman", serif',
  sans: "Inter, system-ui, -apple-system, sans-serif",
  mono: '"JetBrains Mono", "SF Mono", Menlo, monospace',
};

const DEFAULT_SUGGESTIONS = [
  "Explain this decision",
  "Why is this constraint binding?",
  "What's driving DSCR?",
  "How do I close the collateral gap?",
];

const DEMO_ANSWERS: Record<string, string> = {
  decision:
    "The decision reflects three gates: adverse events, the hard DSCR floor, and capacity. " +
    "If the post-facility DSCR clears 1.0 the file isn't unbankable, but if the request exceeds the safe " +
    "capacity or a collateral gap remains, it reads PREPARE_BEFORE_APPLICATION. Resize the ask or strengthen " +
    "collateral to move it toward CONDITIONAL.",
  binding:
    "Capacity is the minimum of three ceilings - cash flow (DSCR), leverage (net debt / EBITDA), and collateral. " +
    "The binding one is simply the lowest; it's the firm's weakest link. Lift that ceiling first.",
  dscr:
    "Post-facility DSCR = CFADS ÷ (existing + new debt service). It falls with higher existing service or a higher " +
    "assumed rate. Interest-only repayment, a longer tenor, or a smaller amount each raise it.",
  gap:
    "Close a collateral gap with higher-advance-rate assets (cash 100%, residential RE 70%), receivables assignment, " +
    "or a guarantee scheme - a 50% guarantee halves the own-collateral requirement.",
  _: "Grounded in this assessment's outputs. I can explain any ratio, the binding constraint, or what would change " +
    "the decision. For exact figures, see the Audit Log and Formulas & Standards tabs.",
};

function demoAnswer(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("decision") || s.includes("bankab")) return DEMO_ANSWERS.decision;
  if (s.includes("binding") || s.includes("constraint") || (s.includes("collateral gap") === false && s.includes("collateral")))
    return DEMO_ANSWERS.binding;
  if (s.includes("dscr") || s.includes("cash flow") || s.includes("coverage")) return DEMO_ANSWERS.dscr;
  if (s.includes("gap") || s.includes("close")) return DEMO_ANSWERS.gap;
  return DEMO_ANSWERS._;
}

/* ----------------------------- Helpers ----------------------------- */

function isAsyncIterable(x: unknown): x is AsyncIterable<string> {
  return !!x && typeof (x as AsyncIterable<string>)[Symbol.asyncIterator] === "function";
}

const STYLE_ID = "trace-ai-styles";

function useInjectedStyles(): void {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = `
@keyframes traceai-move{0%{transform:translateX(0)}100%{transform:translateX(48px)}}
@keyframes traceai-pulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.6);opacity:0}}
.traceai-dot{animation:traceai-move 2.2s linear infinite}
.traceai-ring{animation:traceai-pulse 1.8s ease-out infinite}
.traceai-trigger:hover{transform:translateY(-2px)}
.traceai-chip:hover{border-color:${C.accent};color:${C.accent};background:#F7EFE9}
.traceai-send:hover{background:#A94E2F}
.traceai-close:hover{background:#F0EEE6}
.traceai-scroll::-webkit-scrollbar{width:8px}
.traceai-scroll::-webkit-scrollbar-thumb{background:${C.line}}
@media(max-width:760px){.traceai-trigger{left:14px!important;right:14px!important;bottom:calc(env(safe-area-inset-bottom,0px)+78px)!important;width:auto!important;max-width:none!important;justify-content:center!important;gap:8px!important;padding:8px 14px!important}}
`;
    document.head.appendChild(el);
  }, []);
}

/* ----------------------------- Sub-components ----------------------------- */

function TraceMark({ size = 30, dotColor = C.accent }: { size?: number; dotColor?: string }) {
  return (
    <svg
      width={size}
      height={(size * 22) / 30}
      viewBox="0 0 48 28"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <polyline
        points="0,14 17,14 21,5 26,23 31,14 48,14"
        fill="none"
        stroke={C.accent2}
        strokeWidth={2}
      />
      <circle className="traceai-dot" cx={0} cy={14} r={2.6} fill={dotColor} />
    </svg>
  );
}

/* ----------------------------- Component ----------------------------- */

export function TraceAI({
  context = {},
  onAsk,
  suggestions = DEFAULT_SUGGESTIONS,
  demoMode = !onAsk,
  defaultOpen = false,
  title = "Trace AI",
}: TraceAIProps) {
  useInjectedStyles();
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ctxLine = useMemo(() => {
    const parts: string[] = [];
    if (context.decision) parts.push(`decision ${context.decision}`);
    if (typeof context.score === "number") parts.push(`score ${context.score}/100`);
    if (context.bindingConstraint) parts.push(`binding ${context.bindingConstraint}`);
    return parts.join(" · ");
  }, [context]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const updatedMessages: Message[] = [...messages, { role: "user", content: q }];
    setMessages(updatedMessages);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setBusy(true);
    try {
      if (demoMode || !onAsk) {
        await new Promise((r) => setTimeout(r, 500));
        setMessages((m) => [...m, { role: "assistant", content: demoAnswer(q) }]);
      } else {
        const safeHistory = stripAllToolBlocks(updatedMessages);
        const result = await onAsk(q, context, safeHistory);
        if (isAsyncIterable(result)) {
          setMessages((m) => [...m, { role: "assistant", content: "" }]);
          for await (const token of result) {
            setMessages((m) => {
              const copy = m.slice();
              copy[copy.length - 1] = {
                role: "assistant",
                content: copy[copy.length - 1].content + token,
              };
              return copy;
            });
          }
        } else {
          setMessages((m) => [...m, { role: "assistant", content: String(result) }]);
        }
      }
    } catch (e: unknown) {
      const err = e as { error?: { type?: string }; message?: string };
      if (err?.error?.type === "invalid_request_error" && onAsk && !demoMode) {
        // Retry once with fully sanitized history
        try {
          const safer = sanitizeHistory(stripAllToolBlocks(updatedMessages));
          const retry = await onAsk(q, context, safer);
          if (isAsyncIterable(retry)) {
            setMessages((m) => [...m, { role: "assistant", content: "" }]);
            for await (const token of retry) {
              setMessages((m) => {
                const copy = m.slice();
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: copy[copy.length - 1].content + token,
                };
                return copy;
              });
            }
          } else {
            setMessages((m) => [...m, { role: "assistant", content: String(retry) }]);
          }
          return;
        } catch {
          // retry failed - fall through to generic error
        }
      }
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Couldn't reach the analysis service. Try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------ render ------------------------------ */
  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={`${title} assistant`}
          style={{
            position: "fixed",
            right: 22,
            bottom: 92,
            zIndex: 9999,
            width: 372,
            maxWidth: "calc(100vw - 32px)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "min(460px, 70vh)",
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderTop: `3px solid ${C.accent}`,
            boxShadow: "0 22px 50px rgba(26,25,21,.20)",
            fontFamily: C.sans,
            color: C.ink,
          }}
        >
          {/* header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 14px",
              borderBottom: `1px solid ${C.line}`,
            }}
          >
            <TraceMark />
            <div style={{ flex: 1, lineHeight: 1.1 }}>
              <div style={{ fontFamily: C.serif, fontSize: 16 }}>{title}</div>
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: ".5px",
                }}
              >
                audit-grounded copilot
              </div>
            </div>
            <button
              className="traceai-close"
              aria-label="Collapse assistant"
              onClick={() => setOpen(false)}
              style={{
                border: `1px solid ${C.line}`,
                background: C.white,
                color: C.sub,
                width: 26,
                height: 26,
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* context strip */}
          {ctxLine && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 14px",
                background: C.paper,
                borderBottom: `1px solid ${C.line}`,
                fontFamily: C.mono,
                fontSize: 11,
                color: C.sub,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  background: C.warn,
                  borderRadius: "50%",
                  flex: "none",
                }}
              />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {ctxLine}
              </span>
            </div>
          )}

          {/* suggestions */}
          {messages.length === 0 && (
            <div
              style={{
                padding: "10px 14px 4px",
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="traceai-chip"
                  onClick={() => ask(s)}
                  style={{
                    border: `1px solid ${C.line}`,
                    background: C.white,
                    color: C.sub,
                    fontFamily: C.sans,
                    fontSize: 12,
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* messages */}
          <div
            ref={scrollRef}
            className="traceai-scroll"
            aria-live="polite"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 120,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  color: C.muted,
                  fontSize: 13,
                  lineHeight: 1.5,
                  padding: "6px 2px",
                }}
              >
                Ask anything about this assessment. Answers reference the
                engine&apos;s formulas and audit trail - not guesses.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={
                  m.role === "user"
                    ? {
                        alignSelf: "flex-end",
                        maxWidth: "84%",
                        background: C.ink,
                        color: C.white,
                        fontSize: 13,
                        lineHeight: 1.5,
                        padding: "8px 11px",
                      }
                    : {
                        alignSelf: "flex-start",
                        maxWidth: "90%",
                        background: C.paper,
                        borderLeft: `2px solid ${C.accent}`,
                        color: C.ink,
                        fontSize: 13,
                        lineHeight: 1.55,
                        padding: "9px 11px",
                      }
                }
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div
                style={{
                  alignSelf: "flex-start",
                  color: C.muted,
                  fontSize: 13,
                  fontStyle: "italic",
                  padding: "4px 2px",
                }}
              >
                tracing…
              </div>
            )}
          </div>

          {/* input */}
          <div
            style={{
              borderTop: `1px solid ${C.line}`,
              padding: "10px 12px",
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              placeholder="Ask about this assessment…"
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 72) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(input);
                }
              }}
              style={{
                flex: 1,
                resize: "none",
                border: `1px solid ${C.line}`,
                background: C.white,
                fontFamily: C.sans,
                fontSize: 13,
                color: C.ink,
                padding: "8px 9px",
                outline: "none",
                maxHeight: 72,
              }}
            />
            <button
              className="traceai-send"
              aria-label="Send"
              onClick={() => ask(input)}
              disabled={busy}
              style={{
                border: "none",
                background: C.accent,
                color: C.white,
                width: 34,
                height: 34,
                cursor: busy ? "default" : "pointer",
                flex: "none",
                opacity: busy ? 0.6 : 1,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.white}
                strokeWidth={2}
                style={{ display: "block", margin: "auto" }}
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* footer */}
          <div
            style={{
              padding: "7px 14px",
              borderTop: `1px solid ${C.line}`,
              fontFamily: C.mono,
              fontSize: 11,
              color: "#9A958A",
            }}
          >
            Deterministic engine · AI explanation. Cross-check Formulas &amp;
            Standards.
          </div>
        </div>
      )}

      {/* trigger */}
      {!open && (
        <button
          className="traceai-trigger"
          aria-label="Open Trace AI assistant"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            right: 22,
            bottom: 22,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 11,
            background: C.ink,
            border: "none",
            borderTop: `2px solid ${C.accent}`,
            color: C.white,
            padding: "10px 15px",
            cursor: "pointer",
            boxShadow: "0 10px 26px rgba(26,25,21,.28)",
            transition: "transform .16s ease",
          }}
        >
          <TraceMark dotColor={C.accent2} />
          <span style={{ textAlign: "left", lineHeight: 1.15 }}>
            <span
              style={{ fontFamily: C.serif, fontSize: 15, display: "block" }}
            >
              Trace AI
            </span>
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 11,
                color: C.onDark,
                letterSpacing: ".5px",
              }}
            >
              audit-grounded copilot
            </span>
          </span>
          <span style={{ position: "relative", width: 9, height: 9, flex: "none" }}>
            <span
              style={{
                position: "absolute",
                inset: 0,
                background: C.accent2,
                borderRadius: "50%",
              }}
            />
            <span
              className="traceai-ring"
              style={{
                position: "absolute",
                inset: 0,
                background: C.accent2,
                borderRadius: "50%",
                opacity: 0.6,
              }}
            />
          </span>
        </button>
      )}
    </>
  );
}
