"use client";

import { useEffect, useRef, useState } from "react";

type PipelineStep = { label: string; icon: string; value: string };

const pipeline: PipelineStep[] = [
  { label: "OPERATING INPUTS", icon: "M4 5.5h16M4 12h16M4 18.5h16", value: "Cycle time \u00b7 Scrap rate \u00b7 Material cost" },
  { label: "FORMULA ENGINE", icon: "M6 5h5l-4 14h5M14.5 9.5l5 5M19.5 9.5l-5 5", value: "True hourly cost = $117.40" },
  { label: "SENSITIVITY", icon: "M3 18 8 8l4 6 3-4 6 8", value: "Cycle time: High \u00b7 Scrap: Med \u00b7 Material: Med" },
  { label: "DECISION", icon: "M4 12h12M12 5l7 7-7 7M4 5v14", value: "REPRICE BEFORE COMMITMENT" },
];

export function LiveCalcFlow() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pulseFrame, setPulseFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % pipeline.length);
    }, 2200);
    tickRef.current = setInterval(() => {
      setPulseFrame((prev) => (prev + 1) % 36);
    }, 60);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const prevX = 40 + ((activeIdx - 1 + pipeline.length) % pipeline.length) * 280;
  const targetX = 40 + activeIdx * 280;
  const particleProgress = pulseFrame / 36;
  const particleX = prevX + (targetX - prevX) * particleProgress;
  const sinPhase = Math.sin(particleProgress * Math.PI);
  const particleAlpha = sinPhase * 0.8;
  const pulseR = 8 + sinPhase * 8;
  const pulseOpacity = 0.3 - sinPhase * 0.15;

  return (
    <div className="sc-calc-flow" role="presentation" aria-label="Live calculation pipeline demonstration">
      <svg className="sc-calc-flow-pipe" viewBox="0 0 1120 40" fill="none" aria-hidden="true">
        <path d="M20 20 H1100" stroke="rgba(23,23,19,0.10)" strokeWidth="1" strokeDasharray="4 4" />
        {pipeline.map((_, i) => {
          const x = 40 + i * 280;
          return (
            <circle key={i} cx={x} cy={20} r={5} fill={i === activeIdx ? "#b95734" : "rgba(23,23,19,0.08)"} />
          );
        })}
        {(() => {
          const x = 40 + activeIdx * 280;
          return (
            <circle key="pulse-ring" cx={x} cy={20} r={pulseR} stroke="#b95734" strokeWidth="1.5" fill="none" opacity={pulseOpacity} />
          );
        })()}
        <circle cx={particleX} cy={20} r={2} fill="#b95734" opacity={particleAlpha} />
      </svg>
      <div className="sc-calc-flow-steps">
        {pipeline.map((step, i) => (
          <div key={step.label} className={`sc-calc-flow-step${i === activeIdx ? " sc-calc-flow-step-active" : ""}`}>
            <div className="sc-calc-flow-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={step.icon} />
              </svg>
            </div>
            <p className="sc-calc-flow-label">{step.label}</p>
            <p className="sc-calc-flow-value">{step.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
