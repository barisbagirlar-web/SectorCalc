"use client";
import { useEffect, useRef } from "react";

const STATIC_HTML = ` + JSON.stringify(htmlPart) + `;
const STATIC_SCRIPT = ` + JSON.stringify(scriptPart) + `;

export default function UniversalDynamicForm({ schema }: { schema: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Assign schema to window so the script can pick it up
    (window as any).__CURRENT_SCHEMA__ = schema;

    // Inject HTML
    containerRef.current.innerHTML = STATIC_HTML;

    // Inject and execute Script
    const scriptEl = document.createElement("script");

    // We append the bootloader to the script
    const bootloader =
      STATIC_SCRIPT +
      `
      // Wait for any DOM updates
      setTimeout(() => {
        loadToolData("DUMMY").then(s => {
          if (!s) return;
          window.SCHEMA = s;
          const byId = Object.fromEntries(s.inputs.map((f) => [f.id,f]));
          window.byId = byId;
          const state = {};
          s.inputs.forEach((f) => {
            if (f.default !== undefined) state[f.id] = f.default;
          });
          window.state = state;
          
          // Define ccy and fmtN if they were removed
          window.ccy = () => state.currency || "USD";
          window.fmtN = (v, d=2)=>{ 
            if(v===null||v===undefined||!isFinite(v))return "—";
            return Number(v).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d}); 
          };
          
          if (typeof window.renderForm === 'function') window.renderForm();
          if (typeof window.recompute === 'function') window.recompute();
        });
      }, 0);
    `;
    scriptEl.textContent = bootloader;
    containerRef.current.appendChild(scriptEl);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
      delete (window as any).__CURRENT_SCHEMA__;
    };
  }, [schema]);

  return <div ref={containerRef} />;
}
