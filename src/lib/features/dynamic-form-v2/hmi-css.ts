/* ===== SECTORCALC PRO · INDUSTRIAL DYNAMIC TOOL ENGINE (Light Theme v2) ===== */
export const HMI_CSS = `
:root{--bg:#E8E6DE;--surface:#FAF9F5;--surface-2:#F4F2EA;--ink:#1A1915;--ink-70:rgba(26,25,21,.70);--ink-50:rgba(26,25,21,.50);--ink-38:rgba(26,25,21,.38);--ink-30:rgba(26,25,21,.30);--accent:#BD5D3A;--accent-12:rgba(189,93,58,.12);--accent-24:rgba(189,93,58,.24);--line:rgba(26,25,21,.10);--line-18:rgba(26,25,21,.18);--ok:#4F6F52;--warn:#BD5D3A;--danger:#C53030;--signal:#2B6CB0;--serif:Georgia,'Times New Roman',Times,serif;--sans:ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;--mono:ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace}
html{background:var(--bg)}.sc-app-main,.sc-pro-page,.sc-ledger-page,.ind-os-page{background:transparent!important}.sc-craft-container{background:transparent!important}section.sc-craft-section{background:transparent!important;padding:0}
*{box-sizing:border-box}body{margin:0;padding:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased;padding:0 0 96px}
::selection{background:var(--accent-24)}
.wrap{max-width:1200px;margin:0 auto;padding:20px 28px}

/* STATUS STRIP */
.status-strip{display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:1px solid var(--line);border-radius:3px;padding:12px 18px;margin-bottom:22px;box-shadow:0 1px 3px rgba(26,25,21,.04);font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-70)}
.status-strip .brand{display:flex;align-items:center;gap:14px}
.status-strip .brand-mark{font-family:var(--serif);font-weight:600;font-size:14px;color:var(--accent);letter-spacing:.02em}
.status-strip .brand-sub{color:var(--ink-50);font-size:10px;font-family:var(--sans)}
.status-strip .indicators{display:flex;align-items:center;gap:18px}
.status-strip .ind{display:flex;align-items:center;gap:6px;color:var(--ink-50);font-size:10px}
.status-strip .ind b{color:var(--ink);font-weight:600}
.led{width:9px;height:9px;border-radius:50%;background:var(--c);box-shadow:0 0 4px var(--c);flex:none}
.led.ok{--c:var(--ok)}.led.warn{--c:var(--warn)}.led.signal{--c:var(--signal)}.led.danger{--c:var(--danger)}.led.off{--c:#ccc;box-shadow:none}
.led.pulse{animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{opacity:.55}}
.timestamp{color:var(--ink-38);font-size:10px;font-variant-numeric:tabular-nums}

/* DISPLAY HEADER */
.display-header{background:var(--surface);border:1px solid var(--line);border-radius:3px;padding:24px 28px 20px;margin-bottom:22px;box-shadow:0 1px 3px rgba(26,25,21,.04);position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.display-header::before,.display-header::after{content:'';position:absolute;width:18px;height:18px;border:2px solid var(--accent)}
.display-header::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.display-header::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.module-id{font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--accent);text-transform:uppercase;padding:3px 8px;border:1px solid var(--accent-24);background:var(--accent-12);display:inline-block;margin-bottom:10px}
.display-header h1{font-family:var(--serif);font-weight:600;font-size:32px;line-height:1.08;margin:0 0 6px;letter-spacing:-.01em;color:var(--ink);max-width:24ch}
.sub-cap{font-family:var(--sans);font-size:12px;color:var(--ink-50);max-width:62ch;line-height:1.5}
.meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;text-align:right}
.pill-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.pill{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--line-18);padding:5px 10px;color:var(--ink-70);white-space:nowrap;background:var(--surface-2);transition:all .14s}
.pill.pro{border-color:var(--accent);color:var(--accent);background:var(--accent-12)}
.pill.btn{cursor:pointer}.pill.btn:hover{border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 1px var(--accent-24)}
.stds{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:540px;margin-top:2px}
.std{font-family:var(--mono);font-size:9px;letter-spacing:.05em;color:var(--ink-38);border-bottom:1px solid var(--line);padding-bottom:1px}

/* INPUT RACK */
.grid{display:grid;grid-template-columns:1fr 440px;gap:22px;align-items:start}
@media(max-width:1060px){.grid{grid-template-columns:1fr}}
.group{background:var(--surface);border:1px solid var(--line);border-radius:3px;margin-bottom:18px;padding:22px 24px 24px;position:relative;box-shadow:0 1px 3px rgba(26,25,21,.04)}
.group::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent) 0%,transparent 60%);opacity:.6}
.group-head{display:flex;align-items:center;gap:12px;padding-bottom:12px;margin-bottom:16px;border-bottom:1px solid var(--ink)}
.group-led{width:8px;height:8px}
.group-letter{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--accent);text-transform:uppercase;padding:2px 7px;border:1px solid var(--accent-24);background:var(--accent-12)}
.group-title{font-family:var(--serif);font-size:16px;font-weight:600;color:var(--ink);letter-spacing:.01em}
.group-count{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--ink-50);letter-spacing:.08em}
.fields{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px}
@media(max-width:560px){.fields{grid-template-columns:1fr}}
.field.span{grid-column:1/-1}
.field label{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.f-name{font-family:var(--sans);font-weight:600;font-size:12px;color:var(--ink);letter-spacing:.01em;text-transform:uppercase}
.f-sym{font-family:var(--mono);font-size:10.5px;color:var(--ink-38);margin-left:auto;letter-spacing:.06em}
.chip{font-family:var(--mono);font-size:9px;letter-spacing:.12em;padding:2px 7px;border:1px solid var(--line-18);color:var(--ink-50);background:var(--surface-2);text-transform:uppercase}
.chip.certain{color:var(--ok);border-color:rgba(79,111,82,.4);background:rgba(79,111,82,.08)}
.chip.strong{color:var(--signal);border-color:rgba(43,108,176,.3);background:rgba(43,108,176,.06)}
.chip.moderate{color:var(--warn);border-color:var(--accent-24);background:var(--accent-12)}
.field.dirty .f-name::after{content:'\\u25CF';color:var(--warn);margin-left:8px;font-size:10px;animation:pulse 1.2s ease-in-out infinite}
.ctrl{display:flex;align-items:stretch;border:1px solid var(--line-18);background:var(--surface-2);box-shadow:inset 0 1px 2px rgba(26,25,21,.04);transition:border-color .14s,box-shadow .14s}
.ctrl:focus-within{border-color:var(--accent);box-shadow:inset 0 1px 2px rgba(26,25,21,.04),0 0 0 2px var(--accent-12)}
.field.dirty .ctrl{border-color:var(--warn);box-shadow:inset 0 1px 2px rgba(26,25,21,.04),0 0 0 1px var(--accent-24)}
.ctrl input{appearance:none;-webkit-appearance:none;border:0;background:transparent;font-family:var(--mono);font-size:18px;font-weight:500;color:var(--ink);padding:13px 14px;flex:1 1 0;min-width:0;text-align:right;min-height:50px;font-variant-numeric:tabular-nums;letter-spacing:.01em}
.ctrl input:focus{outline:none}.ctrl input::placeholder{color:var(--ink-38)}
.ubtn{display:flex;align-items:center;gap:7px;padding:0 13px;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.1em;color:var(--ink-70);text-transform:uppercase;background:var(--surface);border:0;border-left:1px solid var(--line);cursor:pointer;white-space:nowrap;min-width:56px;justify-content:space-between;transition:all .14s;flex:0 0 auto}
.ubtn .car{color:var(--ink-38);font-size:9px}
.ubtn:hover{color:var(--accent);background:var(--accent-12)}
.ubtn.static{cursor:default;color:var(--ink-50)}.ubtn.static .car{display:none}
.choice{width:100%;min-height:50px;border:1px solid var(--line-18);background:var(--surface-2);color:var(--ink);font-family:var(--mono);font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;transition:all .14s;box-shadow:inset 0 1px 2px rgba(26,25,21,.04)}
.choice .car{color:var(--ink-38);font-size:10px}
.choice:hover{border-color:var(--accent);color:var(--accent)}
.field.dirty .choice{border-color:var(--warn)}
.choice .cv{font-weight:600;letter-spacing:.06em}
.toggle{width:100%;min-height:50px;border:1px solid var(--line-18);background:var(--surface-2);color:var(--ink);font-family:var(--mono);font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;box-shadow:inset 0 1px 2px rgba(26,25,21,.04)}
.toggle .state{color:var(--ink-38);font-weight:500;font-size:10.5px}
.toggle[aria-pressed=true] .state{color:var(--ok);font-weight:600}
.field.dirty .toggle{border-color:var(--warn)}
.tog-track{width:44px;height:22px;border:1px solid var(--line);position:relative;background:var(--surface);flex:none;box-shadow:inset 0 1px 2px rgba(26,25,21,.06)}
.tog-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;background:var(--ink-38);border:1px solid var(--line);box-shadow:0 1px 2px rgba(26,25,21,.1);transition:left .16s,background .16s}
.toggle[aria-pressed=true] .tog-knob{left:24px;background:var(--ok)}
.ref{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px;font-family:var(--mono);font-size:10px;color:var(--ink-38);letter-spacing:.04em}
.ref b{color:var(--ink-70);font-weight:600}.ref .seg{display:flex;gap:4px;align-items:center}
.ref .dot{width:3px;height:3px;background:var(--ink-38);border-radius:50%;flex:none}.ref .pct{color:var(--accent);font-weight:600}
.info{position:relative;cursor:help;border-bottom:1px dotted var(--ink-38);color:var(--ink-50);padding:0 2px}
.info:hover .tip,.info:focus .tip{opacity:1;transform:translateY(0);pointer-events:auto}
.tip{position:absolute;left:0;bottom:130%;width:280px;background:var(--ink);color:var(--surface);border:1px solid var(--accent);font-family:var(--sans);font-size:11.5px;line-height:1.45;padding:10px 12px;opacity:0;transform:translateY(4px);transition:opacity .14s,transform .14s;pointer-events:none;z-index:20;box-shadow:0 8px 24px rgba(26,25,21,.15)}
.tip:after{content:'';position:absolute;left:14px;top:100%;border:5px solid transparent;border-top-color:var(--ink)}
.err{color:var(--danger);font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;margin-top:6px;font-weight:500;display:none;text-transform:uppercase}
.field.invalid .ctrl,.field.invalid .choice{border-color:var(--danger);box-shadow:inset 0 1px 2px rgba(26,25,21,.04),0 0 0 1px var(--danger)}
.field.invalid .err{display:block}

/* POPOVER */
.pop{position:fixed;z-index:80;background:var(--surface);border:1px solid var(--accent);min-width:160px;box-shadow:0 14px 40px rgba(26,25,21,.15),0 0 0 1px var(--accent-24);padding:4px;max-height:60vh;overflow:auto}
.pop .opt{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:9px 12px;cursor:pointer;font-family:var(--mono);font-size:11.5px;color:var(--ink-70);text-transform:uppercase;letter-spacing:.06em;transition:all .1s}
.pop .opt small{font-family:var(--sans);font-size:10px;color:var(--ink-38);text-transform:none;letter-spacing:0}
.pop .opt:hover{background:var(--accent-12);color:var(--accent)}
.pop .opt[aria-selected=true]{color:var(--ink);background:var(--surface-2)}
.pop .opt[aria-selected=true]:before{content:'\\u203A';color:var(--accent);margin-right:-6px;font-weight:700}
.pop .pnote{padding:7px 12px;font-family:var(--sans);font-size:10.5px;color:var(--ink-50);border-top:1px solid var(--line);line-height:1.4}

/* EXECUTE PANEL */
.exec-panel{background:var(--surface);border:2px solid var(--accent);border-radius:3px;padding:18px 22px;margin:8px 0 22px;box-shadow:0 2px 8px rgba(189,93,58,.1),0 0 0 1px var(--accent-24);display:flex;align-items:center;gap:16px;flex-wrap:wrap;position:relative}
.exec-panel::before,.exec-panel::after{content:'';position:absolute;width:14px;height:14px;border:2px solid var(--accent)}
.exec-panel::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.exec-panel::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.exec-panel .exec-status{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:var(--ink-70);text-transform:uppercase;flex:1;min-width:200px}
.exec-panel .exec-status b{color:var(--ink)}
.exec-panel .exec-status .tx{color:var(--ink-50);font-size:10px;font-variant-numeric:tabular-nums}
.btn-exec{border:2px solid var(--accent);background:var(--accent);color:var(--surface);font-family:var(--mono);font-size:13px;letter-spacing:.22em;text-transform:uppercase;padding:14px 28px;cursor:pointer;font-weight:700;box-shadow:0 2px 8px rgba(189,93,58,.2);transition:all .14s;display:flex;align-items:center;gap:10px;white-space:nowrap;min-width:220px;justify-content:center}
.btn-exec .kbd{font-size:9px;color:rgba(250,249,245,.6);border:1px solid rgba(250,249,245,.3);padding:1px 5px;letter-spacing:.05em;background:rgba(250,249,245,.1)}
.btn-exec:hover{background:#A04E30;box-shadow:0 4px 16px rgba(189,93,58,.3);transform:translateY(-1px)}
.btn-exec:active{transform:translateY(0);box-shadow:inset 0 2px 4px rgba(26,25,21,.2)}
.btn-exec:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-exec.dirty{animation:execPulse 1.6s ease-in-out infinite}
@keyframes execPulse{50%{box-shadow:0 2px 8px rgba(189,93,58,.2),0 0 0 4px var(--accent-12)}}
.btn-exec.executing{background:var(--signal);color:var(--surface);border-color:var(--signal)}
.btn-reset{border:1px solid var(--line-18);background:var(--surface-2);color:var(--ink-70);font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;padding:12px 18px;cursor:pointer;font-weight:500;transition:all .14s;white-space:nowrap}
.btn-reset:hover{color:var(--danger);border-color:var(--danger);box-shadow:0 0 0 1px var(--danger)}.btn-reset:disabled{opacity:.3;cursor:not-allowed}

/* READOUT RAIL */
.rail{position:sticky;top:18px;display:flex;flex-direction:column;gap:16px}
@media(max-width:1060px){.rail{position:static}}
.decision{background:var(--surface);border:2px solid var(--ink);border-radius:2px;padding:20px 22px;box-shadow:0 2px 8px rgba(26,25,21,.08);position:relative;overflow:hidden}
.decision.stale{border-color:var(--warn)}
.decision.stale::before{background:var(--warn)!important;box-shadow:0 0 6px var(--warn)!important}
.decision::before{content:'';position:absolute;top:8px;right:10px;width:8px;height:8px;border-radius:50%;background:var(--signal);box-shadow:0 0 6px var(--signal);animation:pulse 2s ease-in-out infinite}
.decision.review{border-color:var(--danger);background:rgba(197,48,48,.04)}
.decision.review::before{background:var(--danger);box-shadow:0 0 6px var(--danger)}
.decision.ok{border-color:var(--ok);background:rgba(79,111,82,.04)}
.decision.ok::before{background:var(--ok);box-shadow:0 0 6px var(--ok)}
.d-label{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-50);display:flex;align-items:center;gap:8px}
.d-label .stale-chip{font-size:9px;color:var(--warn);border:1px solid var(--accent-24);padding:1px 6px;background:var(--accent-12);letter-spacing:.14em}
.d-text{font-family:var(--serif);font-size:22px;font-weight:700;line-height:1.2;margin-top:8px;color:var(--ink);letter-spacing:-.01em}
.decision.review .d-text{color:var(--danger)}
.decision.ok .d-text{color:var(--ok)}
.d-sub{font-family:var(--mono);font-size:11px;color:var(--ink-70);margin-top:10px;line-height:1.5;letter-spacing:.04em}
.card{background:var(--surface);border:1px solid var(--line);border-radius:3px;padding:16px 18px 18px;box-shadow:0 1px 3px rgba(26,25,21,.04)}
.card h3{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin:0 0 14px;font-weight:600;padding-bottom:8px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:8px}
.card h3::before{content:'';width:6px;height:6px;background:var(--accent);box-shadow:0 0 4px var(--accent)}
.kpis{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}
.kpi{background:var(--surface-2);padding:13px 14px}
.kpi .k-label{font-family:var(--mono);font-size:9.5px;color:var(--ink-50);text-transform:uppercase;letter-spacing:.1em}
.kpi .k-val{font-family:var(--mono);font-size:22px;font-weight:600;margin-top:5px;line-height:1.05;color:var(--ink);font-variant-numeric:tabular-nums}
.kpi .k-unit{font-size:10.5px;color:var(--ink-50);font-family:var(--mono);margin-left:4px;letter-spacing:.05em}
.kpi .k-band{font-family:var(--mono);font-size:10px;color:var(--signal);margin-top:4px;letter-spacing:.03em}
.kpi.lead{grid-column:1/-1;background:var(--surface);border:2px solid var(--accent);box-shadow:0 2px 8px rgba(189,93,58,.1)}
.kpi.lead .k-val{font-size:30px;color:var(--accent);font-weight:700}
.kpi.lead .k-label{color:var(--accent)}
.resolver .bar-row{display:flex;align-items:center;gap:10px;margin:10px 0}
.resolver .bl{width:90px;font-family:var(--mono);font-size:10px;color:var(--ink-70);text-align:right;flex:none;text-transform:uppercase;letter-spacing:.08em}
.resolver .track{flex:1;height:20px;background:var(--surface-2);position:relative;border:1px solid var(--line);box-shadow:inset 0 1px 2px rgba(26,25,21,.06)}
.resolver .fill{height:100%;transition:width .3s;background:var(--ink-38)}
.resolver .bar-row.bind .fill{background:var(--accent);box-shadow:0 0 6px var(--accent-24)}
.resolver .bv{width:82px;font-family:var(--mono);font-size:11px;text-align:left;flex:none;color:var(--ink-70);font-variant-numeric:tabular-nums}
.resolver .bar-row.bind .bv{color:var(--accent);font-weight:600}
.resolver .note{font-family:var(--mono);font-size:10.5px;color:var(--ink-70);margin-top:12px;padding-top:12px;border-top:1px solid var(--line);line-height:1.5;letter-spacing:.03em}
.resolver .note b{color:var(--accent);font-weight:600}
.readout .blk{padding:12px 0;border-top:1px solid var(--line)}
.readout .blk:first-child{padding-top:2px;border-top:0}
.readout .bh{display:flex;align-items:baseline;gap:8px;margin-bottom:7px}
.readout .bt{font-family:var(--serif);font-size:14px;font-weight:600;color:var(--ink);letter-spacing:.01em}
.readout .bc{font-family:var(--mono);font-size:9px;letter-spacing:.1em;padding:2px 6px;border:1px solid var(--line-18);color:var(--ink-50);margin-left:auto;text-transform:uppercase}
.readout .bc.cert{color:var(--ok);border-color:rgba(79,111,82,.4)}
.readout .bc.strong{color:var(--signal);border-color:rgba(43,108,176,.3)}
.readout .bc.moderate{color:var(--warn);border-color:var(--accent-24)}
.readout p{margin:0 0 6px;font-size:12.5px;line-height:1.55;color:var(--ink-70);font-family:var(--sans)}
.readout p:last-child{margin-bottom:0}
.readout b{color:var(--ink);font-weight:600}
.readout .em{color:var(--accent);font-weight:600}
.readout .num{font-family:var(--mono);color:var(--signal)}
.stack{display:flex;height:26px;border:1px solid var(--line);overflow:hidden;background:var(--surface-2)}
.seg-b{height:100%;transition:width .3s}
.legend{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;margin-top:12px}
.lg{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--ink-70);font-family:var(--mono);letter-spacing:.03em}
.lg .sw{width:9px;height:9px;flex:none;border:1px solid var(--line)}
.lg .lv{margin-left:auto;font-family:var(--mono);color:var(--ink);font-variant-numeric:tabular-nums}
.warn{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line);font-size:11.5px;line-height:1.5;font-family:var(--sans)}
.warn:first-of-type{border-top:0}
.wsev{width:10px;height:10px;border-radius:50%;flex:none;margin-top:4px;border:1.5px solid var(--accent)}
.warn.CRITICAL .wsev{background:var(--danger);border-color:var(--danger);box-shadow:0 0 4px var(--danger);animation:pulse 1.4s ease-in-out infinite}
.warn.WARNING .wsev{background:transparent;border-color:var(--warn)}
.warn.INFO .wsev{border-color:var(--signal)}
.warn .wmsg b{color:var(--accent);font-weight:600;font-family:var(--mono);letter-spacing:.08em;font-size:10.5px;text-transform:uppercase}
.warn.CRITICAL .wmsg b{color:var(--danger)}
.warn.INFO .wmsg{color:var(--ink-70)}
.no-warn{font-family:var(--mono);font-size:11px;color:var(--ok);letter-spacing:.05em;text-transform:uppercase}
details{border-top:1px solid var(--line);padding-top:4px}
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
.btn-export{width:100%;border:1px solid var(--accent);background:var(--surface-2);color:var(--accent);font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;padding:16px;cursor:pointer;font-weight:600;box-shadow:0 1px 3px rgba(26,25,21,.04);transition:all .16s}
.btn-export:hover{background:var(--accent);color:var(--surface);box-shadow:0 2px 8px rgba(189,93,58,.2)}
.mbar{display:none}
@media(max-width:1060px){.mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:60;background:var(--surface);color:var(--ink);align-items:center;justify-content:space-between;padding:11px 18px;gap:14px;border-top:2px solid var(--accent);box-shadow:0 -2px 8px rgba(26,25,21,.08)} .mbar .ml{font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)} .mbar .mv{font-family:var(--mono);font-size:17px;color:var(--signal);font-weight:600;font-variant-numeric:tabular-nums} .mbar .md{font-family:var(--mono);font-size:10px;text-align:right;max-width:46%;color:var(--ink-70);text-transform:uppercase;letter-spacing:.08em}}
*:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media print{.rail{position:static}.btn-exec,.btn-reset,.btn-export,.mbar,.info,.ubtn .car,.choice .car,.status-strip,.exec-panel{display:none}body{background:#fff;padding:0;color:#000}.group,.card,.decision{background:#fff;border-color:#000;color:#000}.d-text,.kpi.lead .k-val,.kpi .k-val,.fv{color:#000;text-shadow:none}}
`;
