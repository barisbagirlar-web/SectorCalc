"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const demos = [
  {
    id: "machining", title: "Machining & CNC",
    href: "/tools/free/cnc-shop-hourly-rate",
    icon: "M8 12C8 9.8 9.8 8 12 8s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM12.5 12H21M16 8.5V15.5M4 5h8M4 19h8",
    headline: "Is the hourly rate covering true machine cost?",
    inputs: ["Machine purchase: $185,000", "Expected life: 10 years", "Utilization: 72%", "Maintenance: $4.20/hr"],
    result: "$97.40 / hr", verdict: "REPRICE IF BELOW $92",
  },
  {
    id: "welding", title: "Welding & Fabrication",
    href: "/tools/free/welding-cost-per-meter",
    icon: "M3 8h7l2 4 2-4h7M3 16h7l2-4 2 4h7M10 4l2 3 2-3M10 20l2-3 2 3",
    headline: "What is the real cost of that weld seam?",
    inputs: ["Joint length: 1.2 m", "Process: GMAW", "Wire: $6.80/kg", "Labor rate: $52/hr"],
    result: "$134.60 / m", verdict: "CHECK PARAMETERS",
  },
  {
    id: "energy", title: "Energy & Facilities",
    href: "/tools/free/compressed-air-leak-cost",
    icon: "M13.5 2.5 5.5 13h6l-1 8.5 8-11h-6z",
    headline: "How much is the compressed air leak costing?",
    inputs: ["Leak diameter: 3 mm", "Pressure: 7 bar", "Energy cost: $0.12/kWh", "Operating hours: 6,000/yr"],
    result: "$8,240 / yr", verdict: "REPAIR WITHIN 30 DAYS",
  },
];

const checkIcon = "M12 2.5 19 6v5.5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6zM8.5 12l2.2 2.2 4.8-5";

type InputState = { done: boolean; active: boolean | null };

export function ProductDemoFilm() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [inputStates, setInputStates] = useState<InputState[]>([]);
  const [phase, setPhase] = useState<"inputs" | "result" | "verdict">("inputs");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = demoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const demo = demos[activeDemo];

    setPhase("inputs");
    setInputStates(demo.inputs.map((_, i) => ({ done: false, active: i === 0 })));

    const advance = () => {
      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        setInputStates((prev) => {
          const next = [...prev];
          const cur = next.findIndex((s) => s.active === true);
          if (cur >= 0) next[cur] = { done: true, active: false };
          const nxt = cur + 1;
          if (nxt < next.length) {
            next[nxt] = { done: false, active: true };
            advance();
          } else {
            setPhase("result");
            timerRef.current = setTimeout(() => {
              if (cancelled) return;
              setPhase("verdict");
              timerRef.current = setTimeout(() => {
                if (cancelled) return;
                setActiveDemo((p) => (p + 1) % demos.length);
              }, 1800);
            }, 1200);
          }
          return next;
        });
      }, 600);
    };

    advance();
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, activeDemo]);

  const demo = demos[activeDemo];

  return (
    <div ref={demoRef} className="sc-demo-film" data-visible={visible} aria-label="Product demonstration">
      <div className="sc-shell">
        <div className="sc-demo-film-inner">
          <div className="sc-demo-content">
            <p className="sc-section-kicker">SEE IT IN ACTION</p>
            <h2>{demo.headline}</h2>
            <div className="sc-demo-inputs">
              <p className="sc-demo-inputs-label">OPERATING INPUTS</p>
              {demo.inputs.map((input, i) => {
                const s = inputStates[i];
                return (
                  <div key={input} className={`sc-demo-input-line${s?.done ? " sc-demo-input-done" : ""}${s?.active ? " sc-demo-input-active" : ""}`}>
                    <span className="sc-demo-input-bullet" />
                    <span className="sc-demo-input-text">{input}</span>
                  </div>
                );
              })}
            </div>
            <div className="sc-demo-result-block" data-phase={phase}>
              <div className="sc-demo-result-card">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={checkIcon} />
                </svg>
                <div>
                  <span className="sc-demo-result-label">CALCULATED RESULT</span>
                  <strong className="sc-demo-result-value">{demo.result}</strong>
                </div>
              </div>
              <div className="sc-demo-verdict-badge" data-show={phase === "verdict"}>
                <span className="sc-demo-verdict-arrow">&rarr;</span>
                {demo.verdict}
              </div>
            </div>
            <Link href={demo.href} prefetch className="sc-text-link sc-demo-cta">
              Open this tool<span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="sc-demo-nav" role="tablist" aria-label="Tool demos">
            {demos.map((d, i) => (
              <button key={d.id} role="tab" aria-selected={i === activeDemo}
                className={`sc-demo-nav-btn${i === activeDemo ? " sc-demo-nav-active" : ""}`}
                onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setActiveDemo(i); }}>
                <span className="sc-demo-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={d.icon} />
                  </svg>
                </span>
                <span className="sc-demo-nav-label">{d.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
