/* ===== SECTORCALC PRO · INDUSTRIAL DYNAMIC TOOL ENGINE (clipboard.txt exact) ===== */
export const HMI_CSS = `
:root{
  --bg:#f8f9fa;--bg-grid:rgba(37,99,235,0.03);
  --panel:#ffffff;--panel-2:#fafbfc;
  --bezel:#e5e7eb;--bezel-hi:#d1d5db;--bezel-lo:#f3f4f6;
  --ink:#1f2937;--ink-70:rgba(31,41,55,.75);--ink-50:rgba(31,41,55,.55);--ink-30:rgba(31,41,55,.35);
  --line:#e5e7eb;--line-hi:#d1d5db;
  --accent:#2563eb;--accent-dim:rgba(37,99,235,.15);--accent-24:rgba(37,99,235,.30);
  --signal:#059669;--signal-dim:rgba(5,150,105,.18);
  --ok:#10b981;--warn:#f59e0b;--danger:#ef4444;
  --lcd:#0369a1;
  --mono:'JetBrains Mono',ui-monospace,'SF Mono',Consolas,monospace;
  --sans:'Inter',-apple-system,system-ui,sans-serif;
}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{
  background:
    linear-gradient(var(--bg-grid) 1px,transparent 1px),
    linear-gradient(90deg,var(--bg-grid) 1px,transparent 1px),
    linear-gradient(180deg,#ffffff 0%,#f8f9fa 100%);
  background-size:44px 44px,44px 44px,100% 100%;
  background-attachment:fixed;color:var(--ink);
  font-family:var(--sans);font-size:14px;line-height:1.5;
  -webkit-font-smoothing:antialiased;min-height:100vh;padding-bottom:60px;
}
::selection{background:var(--accent);color:#FFF}
.wrap{max-width:1280px;margin:0 auto;padding:20px 28px}

.status-strip{
  display:flex;align-items:center;justify-content:space-between;
  background:#ffffff;
  border:2px solid var(--accent);border-radius:6px;
  padding:10px 18px;margin-bottom:22px;
  box-shadow:0 2px 8px rgba(0,0,0,.08);
  font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-70);
}
.status-strip .brand{display:flex;align-items:center;gap:14px}
.status-strip .brand-mark{font-weight:700;font-size:13px;color:var(--accent);letter-spacing:.18em}
.status-strip .brand-sub{color:var(--ink-50);font-size:10px}
.status-strip .indicators{display:flex;align-items:center;gap:18px}
.status-strip .ind{display:flex;align-items:center;gap:6px;color:var(--ink-50)}
.status-strip .ind b{color:var(--ink-70);font-weight:500}
.led{width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0%,var(--c) 40%,rgba(0,0,0,.2) 100%);box-shadow:0 0 5px var(--c),0 0 10px var(--c);flex:none}
.led.ok{--c:var(--ok)}.led.warn{--c:var(--warn)}.led.signal{--c:var(--signal)}.led.danger{--c:var(--danger)}.led.off{--c:#9ca3af;box-shadow:none;background:#d1d5db}
.led.pulse{animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{opacity:.55}}
.timestamp{color:var(--ink-30);font-size:10px;font-variant-numeric:tabular-nums}

.display-header{
  background:#ffffff;
  border:2px solid var(--accent);border-radius:6px;
  padding:22px 26px 18px;margin-bottom:22px;
  box-shadow:0 4px 12px rgba(0,0,0,.1);
  position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;
}
.display-header::before,.display-header::after{content:'';position:absolute;width:18px;height:18px;border:3px solid var(--accent)}
.display-header::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.display-header::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.module-id{font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--accent);text-transform:uppercase;padding:3px 8px;border:2px solid var(--accent-24);background:rgba(37,99,235,.05);display:inline-block;margin-bottom:10px;border-radius:3px}
.display-header h1{font-family:var(--sans);font-weight:600;font-size:30px;line-height:1.08;margin:0 0 6px;letter-spacing:-.01em;color:var(--ink);max-width:24ch}
.sub-cap{font-size:12px;color:var(--ink-50);max-width:62ch;line-height:1.5}
.meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;text-align:right}
.pill-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.pill{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;border:2px solid var(--line-hi);padding:5px 10px;color:var(--ink-70);white-space:nowrap;background:#f9fafb;transition:all .14s;border-radius:3px}
.pill.pro{border-color:var(--accent);color:var(--accent);background:rgba(37,99,235,.08)}
.pill.btn{cursor:pointer}.pill.btn:hover{border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 2px var(--accent-24)}
.stds{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:540px;margin-top:2px}
.std{font-family:var(--mono);font-size:9px;letter-spacing:.05em;color:var(--ink-30);border-bottom:1px solid var(--line);padding-bottom:1px}

.grid{display:grid;grid-template-columns:1fr 440px;gap:22px;align-items:start}
@media(max-width:1060px){.grid{grid-template-columns:1fr}}

.group{
  background:#ffffff;
  border:2px solid var(--bezel);border-left:6px solid var(--accent);border-radius:6px;
  margin-bottom:18px;padding:20px 22px 22px;position:relative;
  box-shadow:0 2px 8px rgba(0,0,0,.06);
}
.group-head{display:flex;align-items:center;gap:12px;padding-bottom:12px;margin-bottom:16px;border-bottom:2px solid var(--line)}
.group-led{width:8px;height:8px}
.group-letter{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--accent);text-transform:uppercase;padding:2px 7px;border:2px solid var(--accent-24);background:rgba(37,99,235,.05);border-radius:3px}
.group-title{font-family:var(--sans);font-size:14px;font-weight:600;color:var(--ink);letter-spacing:.02em;text-transform:uppercase}
.group-count{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--ink-50);letter-spacing:.08em}

.fields{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px}
@media(max-width:560px){.fields{grid-template-columns:1fr}}
.field.span{grid-column:1/-1}
.field label{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.f-name{font-weight:500;font-size:12px;color:var(--ink);letter-spacing:.01em;text-transform:uppercase}
.f-sym{font-family:var(--mono);font-size:10.5px;color:var(--ink-30);margin-left:auto;letter-spacing:.06em}
.chip{font-family:var(--mono);font-size:9px;letter-spacing:.12em;padding:2px 7px;border:2px solid var(--line-hi);color:var(--ink-50);background:#f9fafb;text-transform:uppercase;border-radius:3px}
.chip.certain{color:var(--ok);border-color:rgba(16,185,129,.35);background:rgba(16,185,129,.06)}
.chip.strong{color:var(--signal);border-color:rgba(5,150,105,.35);background:rgba(5,150,105,.06)}
.chip.moderate{color:var(--warn);border-color:rgba(245,158,11,.35);background:rgba(245,158,11,.06)}

.field.dirty .f-name::after{content:'●';color:var(--warn);margin-left:8px;font-size:10px;animation:pulse 1.2s ease-in-out infinite}

.ctrl{display:flex;align-items:stretch;border:2px solid var(--bezel);background:#f9fafb;box-shadow:inset 0 1px 3px rgba(0,0,0,.05);transition:border-color .14s,box-shadow .14s;border-radius:4px}
.ctrl:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-24)}
.field.dirty .ctrl{border-color:var(--warn);box-shadow:0 0 0 2px rgba(245,158,11,.3)}
.ctrl input{appearance:none;-webkit-appearance:none;border:0;background:transparent;font-family:var(--mono);font-size:18px;font-weight:500;color:var(--ink);padding:13px 14px;width:100%;text-align:right;min-height:50px;font-variant-numeric:tabular-nums;letter-spacing:.01em}
.ctrl input:focus{outline:none}
.ctrl input::placeholder{color:var(--ink-30)}

.ubtn{display:flex;align-items:center;gap:7px;padding:0 13px;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.1em;color:var(--ink-70);text-transform:uppercase;background:linear-gradient(180deg,#e5e7eb 0%,#d1d5db 100%);border:0;border-left:2px solid var(--line);cursor:pointer;white-space:nowrap;min-width:72px;justify-content:space-between;transition:all .14s;border-radius:0 4px 4px 0}
.ubtn .car{color:var(--ink-30);font-size:9px}
.ubtn:hover{color:var(--accent);background:linear-gradient(180deg,#dbeafe 0%,#bfdbfe 100%)}
.ubtn.static{cursor:default;color:var(--ink-50)}
.ubtn.static .car{display:none}

.choice{width:100%;min-height:50px;border:2px solid var(--bezel);background:linear-gradient(180deg,#e5e7eb 0%,#d1d5db 100%);color:var(--ink);font-family:var(--mono);font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;transition:all .14s;box-shadow:inset 0 1px 0 rgba(255,255,255,.3);border-radius:4px}
.choice .car{color:var(--ink-30);font-size:10px}
.choice:hover{border-color:var(--accent);color:var(--accent);background:linear-gradient(180deg,#dbeafe 0%,#bfdbfe 100%)}
.field.dirty .choice{border-color:var(--warn)}
.choice .cv{font-weight:600;letter-spacing:.06em}

.toggle{width:100%;min-height:50px;border:2px solid var(--bezel);background:linear-gradient(180deg,#e5e7eb 0%,#d1d5db 100%);color:var(--ink);font-family:var(--mono);font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;box-shadow:inset 0 1px 0 rgba(255,255,255,.3);border-radius:4px}
.toggle .state{color:var(--ink-30);font-weight:500;font-size:10.5px}
.toggle[aria-pressed=true] .state{color:var(--ok);text-shadow:0 0 6px rgba(16,185,129,.4)}
.field.dirty .toggle{border-color:var(--warn)}
.tog-track{width:44px;height:22px;border:2px solid var(--line);position:relative;background:#f3f4f6;flex:none;box-shadow:inset 0 1px 3px rgba(0,0,0,.1);border-radius:11px}
.tog-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;background:radial-gradient(circle at 30% 30%,#9ca3af,#6b7280);border:1px solid #4b5563;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:left .16s,background .16s;border-radius:50%}
.toggle[aria-pressed=true] .tog-knob{left:24px;background:radial-gradient(circle at 30% 30%,#34d399,var(--ok));box-shadow:0 0 6px var(--ok)}

.ref{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px;font-family:var(--mono);font-size:10px;color:var(--ink-30);letter-spacing:.04em}
.ref b{color:var(--ink-70);font-weight:600}
.ref .seg{display:flex;gap:4px;align-items:center}
.ref .dot{width:3px;height:3px;background:var(--ink-30);border-radius:50%;flex:none}
.ref .pct{color:var(--accent);font-weight:600}
.info{position:relative;cursor:help;border-bottom:1px dotted var(--ink-30);color:var(--ink-50);padding:0 2px}
.info:hover .tip,.info:focus .tip{opacity:1;transform:translateY(0);pointer-events:auto}
.tip{position:absolute;left:0;bottom:130%;width:280px;background:#ffffff;color:var(--ink);border:2px solid var(--accent);font-family:var(--sans);font-size:11.5px;line-height:1.45;padding:10px 12px;opacity:0;transform:translateY(4px);transition:opacity .14s,transform .14s;pointer-events:none;z-index:20;box-shadow:0 8px 24px rgba(0,0,0,.15);border-radius:4px}
.tip:after{content:'';position:absolute;left:14px;top:100%;border:5px solid transparent;border-top-color:var(--accent)}
.err{color:var(--danger);font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;margin-top:6px;font-weight:500;display:none;text-transform:uppercase}
.field.invalid .ctrl,.field.invalid .choice{border-color:var(--danger);box-shadow:0 0 0 2px var(--danger),inset 0 1px 3px rgba(0,0,0,.05)}
.field.invalid .err{display:block}

.pop{position:fixed;z-index:80;background:#ffffff;border:2px solid var(--accent);min-width:160px;box-shadow:0 14px 40px rgba(0,0,0,.2),0 0 0 1px var(--accent-24);padding:4px;max-height:60vh;overflow:auto;border-radius:6px}
.pop .opt{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:9px 12px;cursor:pointer;font-family:var(--mono);font-size:11.5px;color:var(--ink-70);text-transform:uppercase;letter-spacing:.06em;transition:all .1s;border-radius:3px}
.pop .opt small{font-family:var(--sans);font-size:10px;color:var(--ink-30);text-transform:none;letter-spacing:0}
.pop .opt:hover{background:var(--accent-dim);color:var(--accent)}
.pop .opt[aria-selected=true]{color:var(--ink);background:#f3f4f6}
.pop .opt[aria-selected=true]:before{content:'›';color:var(--accent);margin-right:-6px;font-weight:700}
.pop .pnote{padding:7px 12px;font-family:var(--sans);font-size:10.5px;color:var(--ink-50);border-top:1px solid var(--line);line-height:1.4}

.exec-panel{
  background:#ffffff;
  border:3px solid var(--warn);border-radius:6px;
  padding:18px 22px;margin:8px 0 22px;
  box-shadow:0 4px 12px rgba(245,158,11,.2),0 0 0 1px rgba(245,158,11,.3);
  display:flex;align-items:center;gap:16px;flex-wrap:wrap;position:relative;
}
.exec-panel::before,.exec-panel::after{content:'';position:absolute;width:14px;height:14px;border:3px solid var(--warn)}
.exec-panel::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.exec-panel::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.exec-panel .exec-status{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:var(--ink-70);text-transform:uppercase;flex:1;min-width:200px}
.exec-panel .exec-status b{color:var(--ink)}
.exec-panel .exec-status .tx{color:var(--ink-50);font-size:10px;font-variant-numeric:tabular-nums}

.btn-exec{
  border:3px solid var(--accent);
  background:linear-gradient(180deg,var(--accent) 0%,#1d4ed8 100%);
  color:#FFF;font-family:var(--mono);font-size:13px;letter-spacing:.22em;text-transform:uppercase;
  padding:14px 28px;cursor:pointer;font-weight:700;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 2px 8px rgba(0,0,0,.15),0 0 14px var(--accent-dim);
  transition:all .14s;display:flex;align-items:center;gap:10px;white-space:nowrap;min-width:220px;justify-content:center;border-radius:4px;
}
.btn-exec .kbd{font-size:9px;color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.3);padding:1px 5px;letter-spacing:.05em;background:rgba(255,255,255,.15);border-radius:2px}
.btn-exec:hover{background:linear-gradient(180deg,#60a5fa 0%,var(--accent) 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 4px 16px rgba(37,99,235,.3);transform:translateY(-1px)}
.btn-exec:active{transform:translateY(0);box-shadow:inset 0 2px 4px rgba(0,0,0,.2)}
.btn-exec:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-exec.dirty{animation:execPulse 1.6s ease-in-out infinite}
@keyframes execPulse{50%{box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 0 0 4px var(--accent-dim),0 0 22px var(--accent)}}
.btn-exec.executing{background:linear-gradient(180deg,var(--signal) 0%,#047857 100%);color:#FFF;border-color:var(--signal)}

.btn-reset{
  border:2px solid var(--line-hi);
  background:linear-gradient(180deg,#e5e7eb 0%,#d1d5db 100%);
  color:var(--ink-70);font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
  padding:12px 18px;cursor:pointer;font-weight:500;transition:all .14s;white-space:nowrap;border-radius:4px;
}
.btn-reset:hover{color:var(--danger);border-color:var(--danger);box-shadow:0 0 0 2px rgba(239,68,68,.2)}
.btn-reset:disabled{opacity:.3;cursor:not-allowed}

.rail{position:sticky;top:18px;display:flex;flex-direction:column;gap:16px}
@media(max-width:1060px){.rail{position:static}}

.decision{
  background:#ffffff;
  border:3px solid var(--bezel);border-radius:6px;padding:20px 22px;
  box-shadow:0 2px 8px rgba(0,0,0,.08);
  position:relative;overflow:hidden;
}
.decision.stale{border-color:var(--warn);box-shadow:0 2px 8px rgba(245,158,11,.2)}
.decision.stale::before{background:radial-gradient(circle at 30% 30%,#fff,var(--warn))!important;box-shadow:0 0 6px var(--warn)!important}
.decision::before{content:'';position:absolute;top:8px;right:10px;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,var(--lcd));box-shadow:0 0 6px var(--lcd),0 0 12px var(--lcd);animation:pulse 2s ease-in-out infinite}
.decision.review{border-color:var(--danger);box-shadow:0 2px 8px rgba(239,68,68,.2)}
.decision.review::before{background:radial-gradient(circle at 30% 30%,#fff,var(--danger));box-shadow:0 0 6px var(--danger),0 0 12px var(--danger)}
.decision.ok{border-color:var(--ok);box-shadow:0 2px 8px rgba(16,185,129,.2)}
.decision.ok::before{background:radial-gradient(circle at 30% 30%,#fff,var(--ok));box-shadow:0 0 6px var(--ok)}
.d-label{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-50);display:flex;align-items:center;gap:8px}
.d-label .stale-chip{font-size:9px;color:var(--warn);border:2px solid rgba(245,158,11,.4);padding:1px 6px;background:rgba(245,158,11,.08);letter-spacing:.14em;border-radius:3px}
.d-text{font-family:var(--sans);font-size:20px;font-weight:700;line-height:1.2;margin-top:8px;color:var(--lcd);letter-spacing:.01em}
.decision.review .d-text{color:var(--danger)}
.d-sub{font-family:var(--mono);font-size:11px;color:var(--ink-70);margin-top:10px;line-height:1.5;letter-spacing:.04em}

.card{background:#ffffff;border:2px solid var(--bezel);border-radius:6px;padding:16px 18px 18px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.card.interp-card{border-left:6px solid var(--accent)}
.card.interp-card.critical{border-left-color:var(--danger)}
.card.interp-card.warning{border-left-color:var(--warn)}
.card.interp-card.info{border-left-color:var(--signal)}
.card.tornado-card{border-top:4px solid var(--accent)}
.card h3{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin:0 0 14px;font-weight:600;padding-bottom:8px;border-bottom:2px solid var(--line);display:flex;align-items:center;gap:8px}
.card h3::before{content:'';width:6px;height:6px;background:var(--accent);box-shadow:0 0 6px var(--accent);border-radius:50%}
.card.critical h3{color:var(--danger)}
.card.critical h3::before{background:var(--danger);box-shadow:0 0 6px var(--danger)}

.kpis{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}
.kpi{background:#ffffff;padding:13px 14px}
.kpi .k-label{font-family:var(--mono);font-size:9.5px;color:var(--ink-50);text-transform:uppercase;letter-spacing:.1em}
.kpi .k-val{font-family:var(--mono);font-size:22px;font-weight:600;margin-top:5px;line-height:1.05;color:var(--ink);font-variant-numeric:tabular-nums}
.kpi .k-unit{font-size:10.5px;color:var(--ink-50);font-family:var(--mono);margin-left:4px;letter-spacing:.05em}
.kpi .k-band{font-family:var(--mono);font-size:10px;color:var(--signal);margin-top:4px;letter-spacing:.03em}
.kpi.lead{grid-column:1/-1;background:linear-gradient(180deg,#f0f9ff 0%,#e0f2fe 100%);border:2px solid var(--accent);box-shadow:inset 0 0 18px rgba(37,99,235,.08)}
.kpi.lead .k-val{font-size:28px;color:var(--accent);font-weight:700}
.kpi.lead .k-label{color:var(--accent)}

.resolver .bar-row{display:flex;align-items:center;gap:10px;margin:10px 0}
.resolver .bl{width:140px;font-family:var(--mono);font-size:10px;color:var(--ink-70);text-align:right;flex:none;text-transform:uppercase;letter-spacing:.04em;line-height:1.2}
.resolver .track{flex:1;height:20px;background:#f3f4f6;position:relative;border:2px solid var(--line);box-shadow:inset 0 1px 3px rgba(0,0,0,.05);border-radius:3px}
.resolver .fill{height:100%;transition:width .3s;background:linear-gradient(90deg,var(--ink-50) 0%,var(--ink-70) 100%);border-radius:2px}
.resolver .bar-row.bind .fill{background:linear-gradient(90deg,var(--accent) 0%,rgba(37,99,235,.7) 100%);box-shadow:0 0 8px var(--accent-dim)}
.resolver .bv{width:110px;font-family:var(--mono);font-size:11px;text-align:left;flex:none;color:var(--ink-70);font-variant-numeric:tabular-nums}
.resolver .bar-row.bind .bv{color:var(--accent);font-weight:600;text-shadow:0 0 4px rgba(37,99,235,.3)}
.resolver .note{font-family:var(--mono);font-size:10.5px;color:var(--ink-70);margin-top:12px;padding-top:12px;border-top:2px solid var(--line);line-height:1.5;letter-spacing:.03em}
.resolver .note b{color:var(--accent);font-weight:600}

.readout .blk{padding:12px 0;border-top:2px solid var(--line)}
.readout .blk:first-child{padding-top:2px;border-top:0}
.readout .bh{display:flex;align-items:baseline;gap:8px;margin-bottom:7px}
.readout .bt{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--ink);text-transform:uppercase;letter-spacing:.08em}
.readout .bc{font-family:var(--mono);font-size:9px;letter-spacing:.1em;padding:2px 6px;border:2px solid var(--line-hi);color:var(--ink-50);margin-left:auto;text-transform:uppercase;border-radius:3px}
.readout .bc.cert{color:var(--ok);border-color:rgba(16,185,129,.35)}
.readout .bc.strong{color:var(--signal);border-color:rgba(5,150,105,.35)}
.readout .bc.moderate{color:var(--warn);border-color:rgba(245,158,11,.35)}
.readout p{margin:0 0 6px;font-size:12px;line-height:1.55;color:var(--ink-70);font-family:var(--sans)}
.readout p:last-child{margin-bottom:0}
.readout b{color:var(--ink);font-weight:600}
.readout .em{color:var(--accent);font-weight:600}
.readout .num{font-family:var(--mono);color:var(--signal)}

.stack{display:flex;height:26px;border:2px solid var(--line);overflow:hidden;background:#f9fafb;border-radius:3px}
.seg-b{height:100%;transition:width .3s;box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}
.legend{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;margin-top:12px}
.lg{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--ink-70);font-family:var(--mono);letter-spacing:.03em}
.lg .sw{width:9px;height:9px;flex:none;border:1px solid rgba(0,0,0,.1);border-radius:2px}
.lg .lv{margin-left:auto;font-family:var(--mono);color:var(--ink);font-variant-numeric:tabular-nums}

.warn{display:flex;gap:10px;padding:10px 0;border-top:2px solid var(--line);font-size:11.5px;line-height:1.5;font-family:var(--sans)}
.warn:first-of-type{border-top:0}
.wsev{width:10px;height:10px;border-radius:50%;flex:none;margin-top:4px;border:2px solid var(--accent)}
.warn.CRITICAL .wsev{background:var(--danger);border-color:var(--danger);box-shadow:0 0 6px var(--danger);animation:pulse 1.4s ease-in-out infinite}
.warn.WARNING .wsev{background:transparent;border-color:var(--warn);box-shadow:0 0 4px var(--warn)}
.warn.INFO .wsev{border-color:var(--signal)}
.warn .wmsg b{color:var(--accent);font-weight:600;font-family:var(--mono);letter-spacing:.08em;font-size:10.5px;text-transform:uppercase}
.warn.CRITICAL .wmsg b{color:var(--danger)}
.warn.INFO .wmsg{color:var(--ink-70)}
.no-warn{font-family:var(--mono);font-size:11px;color:var(--ok);letter-spacing:.05em;text-transform:uppercase}

.interp-item{padding:14px;margin-bottom:12px;border:2px solid var(--line-hi);border-radius:4px;background:#fafbfc;position:relative}
.interp-item.CRITICAL{border-left:5px solid var(--danger);background:rgba(239,68,68,.04)}
.interp-item.WARNING{border-left:5px solid var(--warn);background:rgba(245,158,11,.04)}
.interp-item.INFO{border-left:5px solid var(--signal);background:rgba(5,150,105,.04)}
.interp-item:last-child{margin-bottom:0}
.interp-item .ih{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.interp-item .is{font-family:var(--mono);font-size:9px;letter-spacing:.15em;padding:2px 8px;border-radius:3px;font-weight:700;text-transform:uppercase}
.interp-item.CRITICAL .is{color:#fff;background:var(--danger)}
.interp-item.WARNING .is{color:#000;background:var(--warn)}
.interp-item.INFO .is{color:#fff;background:var(--signal)}
.interp-item .it{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--ink);letter-spacing:.01em}
.interp-item .im{font-family:var(--sans);font-size:12px;line-height:1.6;color:var(--ink-70);margin-bottom:10px}
.interp-item .ir{padding:10px 12px;background:var(--accent-dim);border-left:3px solid var(--accent);border-radius:2px;font-family:var(--sans);font-size:12px;line-height:1.55;color:var(--ink)}
.interp-item .ir b{color:var(--accent);font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:10px;font-family:var(--mono)}

details{border-top:2px solid var(--line);padding-top:4px}
details:first-child{border-top:0;padding-top:0}
details summary{cursor:pointer;list-style:none;padding:12px 0;font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-50);display:flex;align-items:center;justify-content:space-between;transition:color .14s}
details summary::-webkit-details-marker{display:none}
details summary:hover{color:var(--accent)}
details summary .arrow{transition:transform .18s;color:var(--accent);font-size:12px}
details[open] summary .arrow{transform:rotate(90deg)}
.frow{display:flex;justify-content:space-between;gap:14px;padding:6px 0;border-top:1px dashed var(--line);font-family:var(--mono);font-size:11px}
.frow:first-child{border-top:0}
.frow .fn{color:var(--ink-70);letter-spacing:.03em}
.frow .fid{color:var(--accent);margin-right:8px;font-weight:600}
.frow .fv{color:var(--signal);text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:500}
.audit-line{font-family:var(--mono);font-size:10.5px;color:var(--ink-50);padding:4px 0;display:flex;justify-content:space-between;gap:12px;letter-spacing:.03em}
.audit-line span:last-child{color:var(--ink)}

.btn-export{
  width:100%;border:2px solid var(--accent);
  background:linear-gradient(180deg,#e5e7eb 0%,#d1d5db 100%);
  color:var(--accent);font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;
  padding:16px;cursor:pointer;font-weight:600;
  box-shadow:0 2px 8px rgba(0,0,0,.08);transition:all .16s;border-radius:4px;
}
.btn-export:hover{background:linear-gradient(180deg,var(--accent) 0%,#1d4ed8 100%);color:#FFF;box-shadow:0 0 0 2px var(--accent),0 0 16px var(--accent-dim);text-shadow:0 1px 0 rgba(255,255,255,.3)}

.mbar{display:none}
@media(max-width:1060px){
  .mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:60;background:#ffffff;color:var(--ink);align-items:center;justify-content:space-between;padding:11px 18px;gap:14px;border-top:3px solid var(--accent);box-shadow:0 -4px 16px rgba(0,0,0,.1)}
  .mbar .ml{font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);opacity:.9}
  .mbar .mv{font-family:var(--mono);font-size:17px;color:var(--signal);font-weight:600;font-variant-numeric:tabular-nums}
  .mbar .md{font-family:var(--mono);font-size:10px;text-align:right;max-width:46%;color:var(--ink-70);text-transform:uppercase;letter-spacing:.08em}
}

*:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media print{
  .rail{position:static}
  .btn-exec,.btn-reset,.btn-export,.mbar,.info,.ubtn .car,.choice .car,.btn-pill,.status-strip,.exec-panel{display:none}
  body{background:#fff;padding:0;color:#000}
  .group,.card,.decision{background:#fff;border-color:#000;color:#000}
  .d-text,.kpi.lead .k-val,.kpi .k-val,.fv{color:#000}
}
`;
