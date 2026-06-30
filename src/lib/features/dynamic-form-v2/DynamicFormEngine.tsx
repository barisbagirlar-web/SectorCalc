"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import type { ToolData, ToolInputField, ToolOutput } from "./types";
import { compile, safeEval, type CompiledExpression } from "./ast-parser";
import { FAM, UNIT_MAP, convert as unitConvert } from "./unit-conversion";
import { fmt, pctf, hash, interp } from "./formatter";

/* ===== SECTORCALC PRO · PREMIUM INDUSTRIAL HMI CSS (v2) ===== */
const FORM_CSS = `
:root{--bg:#080B10;--bg-grid:rgba(255,184,0,0.028);--panel:#11151C;--panel-2:#161B24;--bezel:#1C212B;--bezel-hi:#2A303C;--bezel-lo:#0B0E14;--ink:#E6EAF1;--ink-70:rgba(230,234,241,.7);--ink-50:rgba(230,234,241,.5);--ink-30:rgba(230,234,241,.3);--line:#232833;--line-hi:#313846;--accent:#FFB800;--accent-dim:rgba(255,184,0,.14);--accent-24:rgba(255,184,0,.24);--signal:#00D4FF;--signal-dim:rgba(0,212,255,.16);--ok:#00FF88;--warn:#FFB800;--danger:#FF3B30;--lcd:#00FFCC;--mono:'JetBrains Mono',ui-monospace,'SF Mono',Consolas,monospace;--sans:'Inter',-apple-system,system-ui,sans-serif;}
body{background:linear-gradient(var(--bg-grid) 1px,transparent 1px),linear-gradient(90deg,var(--bg-grid) 1px,transparent 1px),radial-gradient(ellipse at top,#0E1219 0%,#080B10 60%);background-size:44px 44px,44px 44px,100% 100%;background-attachment:fixed;color:var(--ink);font-family:var(--sans);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;min-height:100vh;padding-bottom:60px}
::selection{background:var(--accent);color:#000}
.wrap{max-width:1280px;margin:0 auto;padding:20px 28px}

/* STATUS STRIP */
.status-strip{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg,#151922 0%,#0D1016 100%);border:1px solid var(--line-hi);border-radius:3px;padding:10px 18px;margin-bottom:22px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),inset 0 -1px 0 rgba(0,0,0,.6),0 2px 10px rgba(0,0,0,.5);font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-70)}
.status-strip .brand{display:flex;align-items:center;gap:14px}
.status-strip .brand-mark{font-weight:700;font-size:13px;color:var(--accent);letter-spacing:.18em;text-shadow:0 0 8px rgba(255,184,0,.35)}
.status-strip .brand-sub{color:var(--ink-50);font-size:10px}
.status-strip .indicators{display:flex;align-items:center;gap:18px}
.status-strip .ind{display:flex;align-items:center;gap:6px;color:var(--ink-50)}
.status-strip .ind b{color:var(--ink-70);font-weight:500}
.led{width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0%,var(--c) 40%,rgba(0,0,0,.3) 100%);box-shadow:0 0 5px var(--c),0 0 10px var(--c),inset 0 0 2px rgba(255,255,255,.4);flex:none}
.led.ok{--c:var(--ok)}.led.warn{--c:var(--warn)}.led.signal{--c:var(--signal)}.led.danger{--c:var(--danger)}.led.off{--c:#333;box-shadow:none;background:#222}
.led.pulse{animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{opacity:.55}}
.timestamp{color:var(--ink-30);font-size:10px;font-variant-numeric:tabular-nums}

/* DISPLAY HEADER */
.display-header{background:linear-gradient(180deg,var(--panel) 0%,var(--panel-2) 100%);border:1px solid var(--line-hi);border-radius:3px;padding:22px 26px 18px;margin-bottom:22px;box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 4px 18px rgba(0,0,0,.4);position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.display-header::before,.display-header::after{content:'';position:absolute;width:18px;height:18px;border:2px solid var(--accent)}
.display-header::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.display-header::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.module-id{font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--accent);text-transform:uppercase;padding:3px 8px;border:1px solid var(--accent-24);background:rgba(255,184,0,.05);display:inline-block;margin-bottom:10px}
.display-header h1{font-family:var(--sans);font-weight:600;font-size:30px;line-height:1.08;margin:0 0 6px;letter-spacing:-.01em;color:var(--ink);max-width:24ch}
.sub-cap{font-size:12px;color:var(--ink-50);max-width:62ch;line-height:1.5}
.meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;text-align:right}
.pill-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.pill{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--line-hi);padding:5px 10px;color:var(--ink-70);white-space:nowrap;background:rgba(255,255,255,.015);transition:all .14s}
.pill.pro{border-color:var(--accent);color:var(--accent);background:rgba(255,184,0,.08)}
.pill.btn{cursor:pointer}.pill.btn:hover{border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 1px var(--accent-24)}
.stds{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:540px;margin-top:2px}
.std{font-family:var(--mono);font-size:9px;letter-spacing:.05em;color:var(--ink-30);border-bottom:1px solid var(--line);padding-bottom:1px}

/* INPUT RACK */
.grid{display:grid;grid-template-columns:1fr 440px;gap:22px;align-items:start}
@media(max-width:1060px){.grid{grid-template-columns:1fr}}
.group{background:linear-gradient(180deg,var(--panel) 0%,var(--panel-2) 100%);border:1px solid var(--line-hi);border-radius:3px;margin-bottom:18px;padding:20px 22px 22px;position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 3px 12px rgba(0,0,0,.35)}
.group::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent) 0%,transparent 60%);opacity:.7}
.group-head{display:flex;align-items:center;gap:12px;padding-bottom:12px;margin-bottom:16px;border-bottom:1px solid var(--line)}
.group-led{width:8px;height:8px}
.group-letter{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--accent);text-transform:uppercase;padding:2px 7px;border:1px solid var(--accent-24);background:rgba(255,184,0,.05)}
.group-title{font-family:var(--sans);font-size:14px;font-weight:600;color:var(--ink);letter-spacing:.02em;text-transform:uppercase}
.group-count{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--ink-50);letter-spacing:.08em}
.fields{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px}
@media(max-width:560px){.fields{grid-template-columns:1fr}}
.field.span{grid-column:1/-1}
.field label{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.f-name{font-weight:500;font-size:12px;color:var(--ink);letter-spacing:.01em;text-transform:uppercase}
.f-sym{font-family:var(--mono);font-size:10.5px;color:var(--ink-30);margin-left:auto;letter-spacing:.06em}
.chip{font-family:var(--mono);font-size:9px;letter-spacing:.12em;padding:2px 7px;border:1px solid var(--line-hi);color:var(--ink-50);background:rgba(255,255,255,.02);text-transform:uppercase}
.chip.certain{color:var(--ok);border-color:rgba(0,255,136,.35);background:rgba(0,255,136,.06)}
.chip.strong{color:var(--signal);border-color:rgba(0,212,255,.35);background:rgba(0,212,255,.06)}
.chip.moderate{color:var(--warn);border-color:rgba(255,184,0,.35);background:rgba(255,184,0,.06)}

/* Dirty indicator */
.field.dirty .f-name::after{content:'\u25CF';color:var(--warn);margin-left:8px;font-size:10px;animation:pulse 1.2s ease-in-out infinite}
.ctrl{display:flex;align-items:stretch;border:1px solid var(--line-hi);background:var(--bezel-lo);box-shadow:inset 0 2px 4px rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,255,255,.02);transition:border-color .14s,box-shadow .14s;overflow:hidden}
.ctrl:focus-within{border-color:var(--accent);box-shadow:inset 0 2px 4px rgba(0,0,0,.4),0 0 0 2px var(--accent-24),0 0 12px var(--accent-dim)}
.field.dirty .ctrl{border-color:var(--warn);box-shadow:inset 0 2px 4px rgba(0,0,0,.4),0 0 0 1px rgba(255,184,0,.3)}
.ctrl input{appearance:none;-webkit-appearance:none;border:0;background:transparent;font-family:var(--mono);font-size:18px;font-weight:500;color:var(--ink);padding:13px 14px;text-align:right;min-height:50px;font-variant-numeric:tabular-nums;letter-spacing:.01em;flex:1 1 0;min-width:0}
.ctrl input:focus{outline:none}.ctrl input::placeholder{color:var(--ink-30)}
.ubtn{display:flex;align-items:center;gap:7px;padding:0 13px;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.1em;color:var(--ink-70);text-transform:uppercase;background:repeating-linear-gradient(90deg,rgba(255,255,255,.03) 0px,rgba(255,255,255,.03) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,var(--bezel-hi) 0%,var(--bezel) 100%);border:0;border-left:1px solid var(--line);cursor:pointer;white-space:nowrap;min-width:56px;justify-content:space-between;transition:all .14s;flex:0 0 auto}
.ubtn .car{color:var(--ink-30);font-size:9px}
.ubtn:hover{color:var(--accent);background:repeating-linear-gradient(90deg,rgba(255,184,0,.06) 0px,rgba(255,184,0,.06) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,var(--bezel-hi) 0%,var(--bezel) 100%)}
.ubtn.static{cursor:default;color:var(--ink-50)}.ubtn.static .car{display:none}
.choice{width:100%;min-height:50px;border:1px solid var(--line-hi);background:linear-gradient(180deg,var(--bezel-hi) 0%,var(--bezel) 100%);color:var(--ink);font-family:var(--mono);font-size:14px;letter-spacing:.08em;text-transform:uppercase;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;transition:all .14s;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}
.choice .car{color:var(--ink-30);font-size:10px}
.choice:hover{border-color:var(--accent);color:var(--accent)}
.field.dirty .choice{border-color:var(--warn)}
.choice .cv{font-weight:600;letter-spacing:.06em}
.toggle{width:100%;min-height:50px;border:1px solid var(--line-hi);background:linear-gradient(180deg,var(--bezel-hi) 0%,var(--bezel) 100%);color:var(--ink);font-family:var(--mono);font-size:14px;letter-spacing:.05em;text-transform:uppercase;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}
.toggle .state{color:var(--ink-30);font-weight:500;font-size:10.5px}
.toggle[aria-pressed=true] .state{color:var(--ok);text-shadow:0 0 6px rgba(0,255,136,.4)}
.field.dirty .toggle{border-color:var(--warn)}
.tog-track{width:44px;height:22px;border:1px solid var(--line);position:relative;background:var(--bezel-lo);flex:none;box-shadow:inset 0 1px 3px rgba(0,0,0,.5)}
.tog-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;background:radial-gradient(circle at 30% 30%,#555,#222);border:1px solid #000;box-shadow:0 1px 2px rgba(0,0,0,.5);transition:left .16s,background .16s}
.toggle[aria-pressed=true] .tog-knob{left:24px;background:radial-gradient(circle at 30% 30%,#aaffcc,var(--ok));box-shadow:0 0 6px var(--ok)}
.ref{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px;font-family:var(--mono);font-size:10px;color:var(--ink-30);letter-spacing:.04em}
.ref b{color:var(--ink-70);font-weight:600}.ref .seg{display:flex;gap:4px;align-items:center}
.ref .dot{width:3px;height:3px;background:var(--ink-30);border-radius:50%;flex:none}.ref .pct{color:var(--accent);font-weight:600}
.info{position:relative;cursor:help;border-bottom:1px dotted var(--ink-30);color:var(--ink-50);padding:0 2px}
.info:hover .tip,.info:focus .tip{opacity:1;transform:translateY(0);pointer-events:auto}
.tip{position:absolute;left:0;bottom:130%;width:280px;background:var(--bezel-lo);color:var(--ink);border:1px solid var(--accent);font-family:var(--sans);font-size:11.5px;line-height:1.45;padding:10px 12px;opacity:0;transform:translateY(4px);transition:opacity .14s,transform .14s;pointer-events:none;z-index:20;box-shadow:0 8px 24px rgba(0,0,0,.6)}
.tip:after{content:'';position:absolute;left:14px;top:100%;border:5px solid transparent;border-top-color:var(--accent)}
.err{color:var(--danger);font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;margin-top:6px;font-weight:500;display:none;text-transform:uppercase}
.field.invalid .ctrl,.field.invalid .choice{border-color:var(--danger);box-shadow:0 0 0 1px var(--danger),inset 0 2px 4px rgba(0,0,0,.4)}
.field.invalid .err{display:block}

/* POPOVER */
.pop{position:fixed;z-index:80;background:var(--panel-2);border:1px solid var(--accent);min-width:160px;box-shadow:0 14px 40px rgba(0,0,0,.6),0 0 0 1px var(--accent-24);padding:4px;max-height:60vh;overflow:auto}
.pop .opt{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:9px 12px;cursor:pointer;font-family:var(--mono);font-size:11.5px;color:var(--ink-70);text-transform:uppercase;letter-spacing:.06em;transition:all .1s}
.pop .opt small{font-family:var(--sans);font-size:10px;color:var(--ink-30);text-transform:none;letter-spacing:0}
.pop .opt:hover{background:var(--accent-dim);color:var(--accent)}
.pop .opt[aria-selected=true]{color:var(--ink);background:var(--bezel)}
.pop .opt[aria-selected=true]:before{content:'\u203A';color:var(--accent);margin-right:-6px;font-weight:700}
.pop .pnote{padding:7px 12px;font-family:var(--sans);font-size:10.5px;color:var(--ink-50);border-top:1px solid var(--line);line-height:1.4}

/* EXECUTE PANEL */
.exec-panel{background:linear-gradient(180deg,var(--panel) 0%,var(--panel-2) 100%);border:2px solid var(--accent);border-radius:3px;padding:18px 22px;margin:8px 0 22px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 4px 18px rgba(255,184,0,.15),0 0 0 1px rgba(255,184,0,.2);display:flex;align-items:center;gap:16px;flex-wrap:wrap;position:relative}
.exec-panel::before,.exec-panel::after{content:'';position:absolute;width:14px;height:14px;border:2px solid var(--accent)}
.exec-panel::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.exec-panel::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.exec-panel .exec-status{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:var(--ink-70);text-transform:uppercase;flex:1;min-width:200px}
.exec-panel .exec-status b{color:var(--ink)}
.exec-panel .exec-status .tx{color:var(--ink-50);font-size:10px;font-variant-numeric:tabular-nums}
.btn-exec{border:2px solid var(--accent);background:repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.04) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,var(--accent) 0%,#D69A00 100%);color:#000;font-family:var(--mono);font-size:13px;letter-spacing:.22em;text-transform:uppercase;padding:14px 28px;cursor:pointer;font-weight:700;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 2px 8px rgba(0,0,0,.4),0 0 14px var(--accent-dim);transition:all .14s;display:flex;align-items:center;gap:10px;white-space:nowrap;min-width:220px;justify-content:center}
.btn-exec .kbd{font-size:9px;color:rgba(0,0,0,.55);border:1px solid rgba(0,0,0,.3);padding:1px 5px;letter-spacing:.05em;background:rgba(255,255,255,.15)}
.btn-exec:hover{background:linear-gradient(180deg,#FFCF3A 0%,var(--accent) 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 4px 16px rgba(255,184,0,.4);transform:translateY(-1px)}
.btn-exec:active{transform:translateY(0);box-shadow:inset 0 2px 4px rgba(0,0,0,.3)}
.btn-exec:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-exec.dirty{animation:execPulse 1.6s ease-in-out infinite}
@keyframes execPulse{50%{box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 0 0 4px var(--accent-dim),0 0 22px var(--accent)}}
.btn-exec.executing{background:linear-gradient(180deg,var(--signal) 0%,#0099BB 100%);color:#000;border-color:var(--signal)}
.btn-reset{border:1px solid var(--line-hi);background:repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0px,rgba(255,255,255,.02) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,var(--bezel-hi) 0%,var(--bezel) 100%);color:var(--ink-70);font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;padding:12px 18px;cursor:pointer;font-weight:500;transition:all .14s;white-space:nowrap}
.btn-reset:hover{color:var(--danger);border-color:var(--danger);box-shadow:0 0 0 1px var(--danger)}

/* READOUT RAIL */
.rail{position:sticky;top:18px;display:flex;flex-direction:column;gap:16px}
@media(max-width:1060px){.rail{position:static}}

.decision{background:repeating-linear-gradient(0deg,rgba(0,255,204,.04) 0px,rgba(0,255,204,.04) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#05080D 0%,#020408 100%);border:2px solid var(--bezel-hi);border-radius:2px;padding:20px 22px;box-shadow:inset 0 0 30px rgba(0,255,204,.08),inset 0 2px 10px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.03),0 6px 20px rgba(0,0,0,.6);position:relative;overflow:hidden}
.decision.stale{border-color:var(--warn)}
.decision.stale::before{background:radial-gradient(circle at 30% 30%,#fff,var(--warn))!important;box-shadow:0 0 6px var(--warn)!important}
.decision::before{content:'';position:absolute;top:8px;right:10px;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,var(--lcd));box-shadow:0 0 6px var(--lcd),0 0 12px var(--lcd);animation:pulse 2s ease-in-out infinite}
.decision.review{border-color:var(--danger);box-shadow:inset 0 0 30px rgba(255,59,48,.12),inset 0 2px 10px rgba(0,0,0,.8),0 0 0 1px rgba(255,59,48,.3)}
.decision.review::before{background:radial-gradient(circle at 30% 30%,#fff,var(--danger));box-shadow:0 0 6px var(--danger),0 0 12px var(--danger)}
.decision.ok{border-color:var(--ok);box-shadow:inset 0 0 30px rgba(0,255,136,.1),inset 0 2px 10px rgba(0,0,0,.8),0 0 0 1px rgba(0,255,136,.3)}
.decision.ok::before{background:radial-gradient(circle at 30% 30%,#fff,var(--ok));box-shadow:0 0 6px var(--ok)}
.d-label{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-50);display:flex;align-items:center;gap:8px}
.d-label .stale-chip{font-size:9px;color:var(--warn);border:1px solid rgba(255,184,0,.4);padding:1px 6px;background:rgba(255,184,0,.08);letter-spacing:.14em}
.d-text{font-family:var(--sans);font-size:20px;font-weight:700;line-height:1.2;margin-top:8px;color:var(--lcd);text-shadow:0 0 10px rgba(0,255,204,.5);letter-spacing:.01em}
.decision.review .d-text{color:var(--danger);text-shadow:0 0 10px rgba(255,59,48,.5)}
.d-sub{font-family:var(--mono);font-size:11px;color:var(--ink-70);margin-top:10px;line-height:1.5;letter-spacing:.04em}

.card{background:linear-gradient(180deg,var(--panel) 0%,var(--panel-2) 100%);border:1px solid var(--line-hi);border-radius:3px;padding:16px 18px 18px;box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 3px 12px rgba(0,0,0,.3)}
.card h3{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin:0 0 14px;font-weight:600;padding-bottom:8px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:8px}
.card h3::before{content:'';width:6px;height:6px;background:var(--accent);box-shadow:0 0 6px var(--accent)}

.kpis{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}
.kpi{background:var(--panel-2);padding:13px 14px}
.kpi .k-label{font-family:var(--mono);font-size:9.5px;color:var(--ink-50);text-transform:uppercase;letter-spacing:.1em}
.kpi .k-val{font-family:var(--mono);font-size:22px;font-weight:600;margin-top:5px;line-height:1.05;color:var(--ink);font-variant-numeric:tabular-nums}
.kpi .k-unit{font-size:10.5px;color:var(--ink-50);font-family:var(--mono);margin-left:4px;letter-spacing:.05em}
.kpi .k-band{font-family:var(--mono);font-size:10px;color:var(--signal);margin-top:4px;letter-spacing:.03em}
.kpi.lead{grid-column:1/-1;background:repeating-linear-gradient(0deg,rgba(0,212,255,.04) 0px,rgba(0,212,255,.04) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#070C14 0%,#04070B 100%);border:1px solid var(--signal-dim);box-shadow:inset 0 0 18px rgba(0,212,255,.06)}
.kpi.lead .k-val{font-size:28px;color:var(--signal);text-shadow:0 0 8px rgba(0,212,255,.35);font-weight:700}
.kpi.lead .k-label{color:var(--signal)}

.resolver .bar-row{display:flex;align-items:center;gap:10px;margin:10px 0}
.resolver .bl{width:90px;font-family:var(--mono);font-size:10px;color:var(--ink-70);text-align:right;flex:none;text-transform:uppercase;letter-spacing:.08em}
.resolver .track{flex:1;height:20px;background:var(--bezel-lo);position:relative;border:1px solid var(--line);box-shadow:inset 0 1px 3px rgba(0,0,0,.5)}
.resolver .fill{height:100%;transition:width .3s;background:repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.04) 1px,transparent 1px,transparent 4px),linear-gradient(90deg,var(--ink-50) 0%,var(--ink-70) 100%)}
.resolver .bar-row.bind .fill{background:repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0px,rgba(255,255,255,.08) 1px,transparent 1px,transparent 4px),linear-gradient(90deg,var(--accent) 0%,rgba(255,184,0,.7) 100%);box-shadow:0 0 8px var(--accent-dim)}
.resolver .bv{width:82px;font-family:var(--mono);font-size:11px;text-align:left;flex:none;color:var(--ink-70);font-variant-numeric:tabular-nums}
.resolver .bar-row.bind .bv{color:var(--accent);font-weight:600;text-shadow:0 0 4px rgba(255,184,0,.3)}
.resolver .note{font-family:var(--mono);font-size:10.5px;color:var(--ink-70);margin-top:12px;padding-top:12px;border-top:1px solid var(--line);line-height:1.5;letter-spacing:.03em;color:var(--ink-70)!important}
.resolver .note b{color:var(--accent);font-weight:600}

.readout .blk{padding:12px 0;border-top:1px solid var(--line)}
.readout .blk:first-child{padding-top:2px;border-top:0}
.readout .bh{display:flex;align-items:baseline;gap:8px;margin-bottom:7px}
.readout .bt{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--ink);text-transform:uppercase;letter-spacing:.08em}
.readout .bc{font-family:var(--mono);font-size:9px;letter-spacing:.1em;padding:2px 6px;border:1px solid var(--line-hi);color:var(--ink-50);margin-left:auto;text-transform:uppercase}
.readout .bc.cert{color:var(--ok);border-color:rgba(0,255,136,.35)}
.readout .bc.strong{color:var(--signal);border-color:rgba(0,212,255,.35)}
.readout .bc.moderate{color:var(--warn);border-color:rgba(255,184,0,.35)}
.readout p{margin:0 0 6px;font-size:12px;line-height:1.55;color:var(--ink-70);font-family:var(--sans)}
.readout p:last-child{margin-bottom:0}
.readout b{color:var(--ink);font-weight:600}
.readout .em{color:var(--accent);font-weight:600}
.readout .num{font-family:var(--mono);color:var(--signal)}

.stack{display:flex;height:26px;border:1px solid var(--line);overflow:hidden;background:var(--bezel-lo)}
.seg-b{height:100%;transition:width .3s;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.legend{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;margin-top:12px}
.lg{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--ink-70);font-family:var(--mono);letter-spacing:.03em}
.lg .sw{width:9px;height:9px;flex:none;border:1px solid rgba(255,255,255,.06)}
.lg .lv{margin-left:auto;font-family:var(--mono);color:var(--ink);font-variant-numeric:tabular-nums}

.warn{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line);font-size:11.5px;line-height:1.5;font-family:var(--sans)}
.warn:first-of-type{border-top:0}
.wsev{width:10px;height:10px;border-radius:50%;flex:none;margin-top:4px;border:1.5px solid var(--accent)}
.warn.CRITICAL .wsev{background:var(--danger);border-color:var(--danger);box-shadow:0 0 6px var(--danger);animation:pulse 1.4s ease-in-out infinite}
.warn.WARNING .wsev{background:transparent;border-color:var(--warn);box-shadow:0 0 4px var(--warn)}
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

.btn-export{width:100%;border:1px solid var(--accent);background:repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.04) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,var(--bezel-hi) 0%,var(--bezel) 100%);color:var(--accent);font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;padding:16px;cursor:pointer;font-weight:600;box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 2px 8px rgba(0,0,0,.4);transition:all .16s}
.btn-export:hover{background:linear-gradient(180deg,var(--accent) 0%,#D69A00 100%);color:#000;box-shadow:0 0 0 1px var(--accent),0 0 16px var(--accent-dim);text-shadow:0 1px 0 rgba(255,255,255,.3)}

.mbar{display:none}
@media(max-width:1060px){.mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:60;background:linear-gradient(180deg,#151922 0%,#0B0E14 100%);color:var(--ink);align-items:center;justify-content:space-between;padding:11px 18px;gap:14px;border-top:2px solid var(--accent);box-shadow:0 -4px 16px rgba(0,0,0,.5)} .mbar .ml{font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);opacity:.9} .mbar .mv{font-family:var(--mono);font-size:17px;color:var(--signal);text-shadow:0 0 6px rgba(0,212,255,.35);font-weight:600;font-variant-numeric:tabular-nums} .mbar .md{font-family:var(--mono);font-size:10px;text-align:right;max-width:46%;color:var(--ink-70);text-transform:uppercase;letter-spacing:.08em}}

*:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media print{.rail{position:static}.btn-exec,.btn-reset,.btn-export,.mbar,.info,.ubtn .car,.choice .car,.status-strip,.exec-panel{display:none}body{background:#fff;padding:0;color:#000}.group,.card,.decision{background:#fff;border-color:#000;color:#000}.d-text,.kpi.lead .k-val,.kpi .k-val,.fv{color:#000;text-shadow:none}}
`;

/* ===== Helpers ===== */

type InputCls =
  | { c: "enum" }
  | { c: "bool" }
  | { c: "ratio"; label?: string }
  | { c: "ccy"; suffix: string }
  | { c: "int"; label?: string }
  | { c: "num"; fam?: string; declared?: string; label?: string };

export function classify(inp: ToolInputField): InputCls {
  const u = inp.unit.toLowerCase();
  if (inp.unit === "enum" || (inp.allowed_values && inp.allowed_values.length > 0)) return { c: "enum" };
  if (inp.unit === "boolean") return { c: "bool" };
  if (u === "ratio") return { c: "ratio" };
  if (u.indexOf("currency") === 0) return { c: "ccy", suffix: inp.unit.slice(8) };
  if (u === "unit" || u === "package") return { c: "int", label: inp.unit };
  if (UNIT_MAP[u]) return { c: "num", fam: UNIT_MAP[u][0], declared: UNIT_MAP[u][1] };
  return { c: "num", label: inp.unit || undefined };
}

function metaOf(outputs: ToolOutput[], id: string): ToolOutput | undefined {
  return outputs.find((o) => o.id === id);
}

function valFmt(out: { name?: string; unit?: string; precision?: number | null; enum_labels?: Record<string, string> } | undefined, v: unknown, ccy: string): [string, string] {
  if (v === null || v === undefined) return ["—", ""];
  if (!out) return [String(v), ""];
  if (out.unit === "enum") {
    const labels = out.enum_labels || {};
    return [labels[v as string] || (v as string), ""];
  }
  const nv = v as number;
  if (out.unit === "ratio") return [(nv * 100).toFixed(out.precision != null ? out.precision : 1), "%"];
  if (out.unit && out.unit.indexOf("currency") === 0) return [fmt(nv, out.precision != null ? out.precision : 2), ccy];
  return [fmt(nv, out.precision != null ? out.precision : 2), out.unit || ""];
}

/* ===== Popover Portal ===== */

type PopoverOption = { val: string; label: string; sub?: string };

function PopoverMenu({
  options, current, onPick, note, anchorRect, onClose,
}: {
  options: PopoverOption[];
  current: string;
  onPick: (v: string) => void;
  note?: string;
  anchorRect: DOMRect;
  onClose: () => void;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    const handleClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => { document.removeEventListener("keydown", handleKey); document.removeEventListener("click", handleClick); };
  }, [onClose]);

  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 200 - 8));
  let top = anchorRect.bottom + 4;
  if (top + 300 > window.innerHeight - 8) top = Math.max(8, anchorRect.top - 300 - 4);

  return createPortal(
    <div ref={popRef} className="pop" role="listbox" style={{ left, top }}>
      {options.map((o) => (
        <div
          key={o.val}
          className="opt"
          role="option"
          aria-selected={o.val === current}
          tabIndex={0}
          onClick={() => { onPick(o.val); onClose(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(o.val); onClose(); } }}
        >
          <span>{o.label}</span>
          {o.sub ? <small>{o.sub}</small> : null}
        </div>
      ))}
      {note ? <div className="pnote">{note}</div> : null}
    </div>,
    document.body,
  );
}

/* ===== Main Component ===== */

export type DynamicFormEngineProps = {
  tool: ToolData;
  showMasthead?: boolean;
  toolRegistry?: Array<{ id: string; name: string }>;
  onToolSwitch?: (toolId: string) => void;
  onCompute?: (scope: Record<string, unknown>, uncertainties: Record<string, number>) => void;
};

export function DynamicFormEngine({ tool, showMasthead = true, toolRegistry, onToolSwitch, onCompute }: DynamicFormEngineProps) {
  // Batch-commit: state = committed, draft = editing
  const [state, setState] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    (tool.inputs || []).forEach((inp) => { init[inp.id] = inp.default != null ? inp.default : null; });
    return init;
  });
  const [draft, setDraft] = useState<Record<string, unknown>>(() => ({ ...state }));
  const [dispUnit, setDispUnit] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (tool.inputs || []).forEach((inp) => {
      const cl = classify(inp);
      if (cl.c === "num" && cl.declared) init[inp.id] = cl.declared;
    });
    return init;
  });
  const [ccy, setCcy] = useState<string>(() => {
    const ccyInput = tool.ui_contract.currency_input;
    return ccyInput && state[ccyInput] != null ? String(state[ccyInput]) : "USD";
  });
  const [popover, setPopover] = useState<{ id: string; rect: DOMRect; options: PopoverOption[]; current: string; note?: string } | null>(null);
  const [computed, setComputed] = useState<Record<string, unknown>>({});
  const [uncertainties, setUncertainties] = useState<Record<string, number>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [utcTime, setUtcTime] = useState("");
  const [lastExecTime, setLastExecTime] = useState<number | null>(null);
  const [executionCounter, setExecutionCounter] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const dirtyFieldsRef = useRef<Set<string>>(new Set());

  // UTC clock
  useEffect(() => {
    function tick() { setUtcTime("UTC · " + new Date().toISOString().replace("T", " ").slice(0, 19)); }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyFieldsRef.current.size > 0) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // F9 / Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F9") { e.preventDefault(); handleExecute(); }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleExecute(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [draft, state, validationErrors]);

  // Compiled expressions
  const compiled = useMemo(() => {
    const f: Record<string, CompiledExpression> = {};
    const u: Record<string, CompiledExpression> = {};
    const v: Record<string, CompiledExpression> = {};
    const w: Record<string, CompiledExpression> = {};
    (tool.formulas || []).forEach((fm) => {
      f[fm.id] = compile(fm.expression);
      if (fm.uncertainty_expression) { try { u[fm.id] = compile(fm.uncertainty_expression); } catch { /* ignore */ } }
    });
    (tool.engine_rules?.validation?.rules || []).forEach((r) => { v[r.id] = compile(r.condition); });
    (tool.engine_rules?.smart_warnings || []).forEach((sw) => { w[sw.id] = compile(sw.trigger); });
    return { f, u, v, w };
  }, [tool]);

  // Dirty detection
  const isDirty = useCallback(() => {
    for (const k in draft) { if (draft[k] !== state[k]) return true; }
    return false;
  }, [draft, state]);

  const dirtyFieldIds = useCallback(() => {
    const ids: string[] = [];
    for (const k in draft) { if (draft[k] !== state[k]) ids.push(k); }
    return ids;
  }, [draft, state]);

  // Sync dirty ref
  useEffect(() => {
    dirtyFieldsRef.current = new Set(dirtyFieldIds());
  }, [dirtyFieldIds]);

  const dirtyCount = dirtyFieldIds().length;
  const hasDirty = dirtyCount > 0;

  // Commit draft → state
  const handleExecute = useCallback(() => {
    // Run live validation on draft
    const scope: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scope[inp.id] = draft[inp.id]; });
    const vFails: string[] = [];
    (tool.engine_rules?.validation?.rules || []).forEach((r) => {
      const ok = safeEval(compiled.v[r.id], scope);
      if (ok !== true) vFails.push(r.message);
    });
    if (vFails.length > 0) {
      // Find first failing field and flash it
      for (const rule of tool.engine_rules?.validation?.rules || []) {
        const ok = safeEval(compiled.v[rule.id], scope);
        if (ok !== true) {
          for (const inp of tool.inputs || []) {
            if (rule.condition.includes(inp.id)) {
              const el = document.getElementById("field_" + inp.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.style.outline = "2px solid var(--danger)";
                setTimeout(() => el.style.outline = "", 1200);
              }
              break;
            }
          }
          break;
        }
      }
      return;
    }
    // Commit
    setIsExecuting(true);
    setTimeout(() => {
      setState({ ...draft });
      setExecutionCounter((c) => c + 1);
      setLastExecTime(Date.now());
      setIsExecuting(false);
    }, 120);
  }, [draft, tool, compiled.v]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    if (hasDirty && !window.confirm("Reset all inputs to schema defaults? Uncommitted changes will be lost.")) return;
    const newDraft: Record<string, unknown> = {};
    (tool.inputs || []).forEach((inp) => { newDraft[inp.id] = inp.default != null ? inp.default : null; });
    setDraft({ ...newDraft });
    setState({ ...newDraft });
    setExecutionCounter(0);
    setLastExecTime(null);
  }, [tool, hasDirty]);

  // Compute on committed state
  const recompute = useCallback(() => {
    const scope: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scope[inp.id] = state[inp.id]; });
    const results: Record<string, unknown> = { ...scope };
    const unc: Record<string, number> = {};
    const valErrors: Record<string, string> = {};

    // Validation
    let hasBlocking = false;
    (tool.engine_rules?.validation?.rules || []).forEach((rule) => {
      const ok = safeEval(compiled.v[rule.id], scope);
      if (ok !== true) {
        hasBlocking = true;
        (tool.inputs || []).forEach((inp) => {
          if (!valErrors[inp.id] && rule.condition.includes(inp.id)) valErrors[inp.id] = rule.message;
        });
      }
    });
    setValidationErrors(valErrors);

    if (hasBlocking) {
      setComputed({});
      setUncertainties({});
      return;
    }

    // Formulas
    (tool.formulas || []).forEach((fm) => {
      const val = safeEval(compiled.f[fm.id], results);
      if (val !== undefined) results[fm.output] = val;
      if (compiled.u[fm.id]) {
        const uv = safeEval(compiled.u[fm.id], results);
        if (typeof uv === "number" && Number.isFinite(uv)) unc[fm.output] = uv;
      }
    });
    setComputed(results);
    setUncertainties(unc);
    onCompute?.(results, unc);
  }, [tool, state, compiled, onCompute]);

  // Recompute on state change
  useEffect(() => { recompute(); }, [recompute]);

  const updateField = (id: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumericInput = (inp: ToolInputField, raw: string) => {
    const cl = classify(inp);
    const v = raw === "" ? null : Number(raw);
    if (v === null || isNaN(v)) { updateField(inp.id, null); return; }
    if (cl.c === "num" && cl.fam && cl.declared) {
      updateField(inp.id, unitConvert(cl.fam, dispUnit[inp.id], cl.declared, v));
    } else {
      updateField(inp.id, v);
    }
  };

  const handleUnitChange = (inpId: string, newUnit: string) => {
    setDispUnit((prev) => ({ ...prev, [inpId]: newUnit }));
  };

  const handleEnumPick = (inpId: string, val: string) => {
    updateField(inpId, val);
    if (inpId === tool.ui_contract.currency_input) {
      setCcy(val);
      // Currency is display-level, auto-commit
      setState((prev) => ({ ...prev, [inpId]: val }));
    }
  };

  const handleBoolToggle = (inpId: string) => {
    setDraft((prev) => ({ ...prev, [inpId]: !prev[inpId] }));
  };

  const openPopover = (anchorEl: HTMLElement, inpId: string) => {
    const inp = (tool.inputs || []).find((i) => i.id === inpId);
    if (!inp) return;
    const rect = anchorEl.getBoundingClientRect();
    if (inp.allowed_values && inp.allowed_values.length > 0) {
      const note = inpId === tool.ui_contract.currency_input ? "Label only — no FX conversion inside this tool." : undefined;
      setPopover({
        id: inpId,
        rect,
        options: inp.allowed_values.map((v) => ({ val: v, label: v })),
        current: String(draft[inpId] ?? inp.default ?? ""),
        note,
      });
    }
  };

  const openUnitPopover = (anchorEl: HTMLElement, inpId: string) => {
    const inp = (tool.inputs || []).find((i) => i.id === inpId);
    if (!inp) return;
    const cl = classify(inp);
    if (cl.c !== "num" || !cl.fam) return;
    const fam = FAM[cl.fam];
    if (!fam || fam.order.length <= 1) return;
    const rect = anchorEl.getBoundingClientRect();
    setPopover({
      id: inpId,
      rect,
      options: fam.order.map((u) => ({ val: u, label: u, sub: fam.u[u].n })),
      current: dispUnit[inpId] || cl.declared || "",
    });
  };

  const closePopover = () => setPopover(null);

  const handlePopoverPick = (val: string) => {
    if (!popover) return;
    const inp = (tool.inputs || []).find((i) => i.id === popover.id);
    if (inp) {
      const cl = classify(inp);
      if (cl.c === "num" && cl.fam) {
        handleUnitChange(popover.id, val);
      } else {
        handleEnumPick(popover.id, val);
      }
    }
    closePopover();
  };

  // Warnings (on committed state)
  const warnings = useMemo(() => {
    const result: Array<[string, string]> = [];
    (tool.engine_rules?.smart_warnings || []).forEach((sw) => {
      const triggered = safeEval(compiled.w[sw.id], computed);
      if (triggered === true) result.push([sw.severity, sw.message]);
    });
    return result;
  }, [tool, compiled, computed]);

  const outMeta = useCallback(
    (id: string): { name?: string; unit?: string; precision?: number | null; enum_labels?: Record<string, string> } =>
      metaOf(tool.outputs, id) ?? {},
    [tool],
  );

  const decisionOutput = tool.ui_contract.decision_output;
  const decisionVal = decisionOutput ? (computed[decisionOutput] as string) : null;
  const decisionMeta = decisionOutput ? outMeta(decisionOutput) : undefined;
  const decisionLabel = decisionVal && decisionMeta?.enum_labels
    ? decisionMeta.enum_labels[decisionVal] || decisionVal
    : decisionVal || "AWAITING INPUTS";
  const isCritical = decisionVal ? /REVIEW|REQUIRED|FAIL|RISK|REJECT/.test(decisionVal) : false;
  const isOK = decisionVal ? /ACCEPTABLE|OK|PASS/.test(decisionVal) : false;

  // Live validation on draft
  const liveErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    const scope: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scope[inp.id] = draft[inp.id]; });
    (tool.engine_rules?.validation?.rules || []).forEach((rule) => {
      const ok = safeEval(compiled.v[rule.id], scope);
      if (ok !== true) {
        (tool.inputs || []).forEach((inp) => {
          if (!errs[inp.id] && rule.condition.includes(inp.id)) errs[inp.id] = rule.message;
        });
      }
    });
    return errs;
  }, [draft, tool, compiled.v]);

  return (
    <div className="" ref={formRef}>
      <style>{FORM_CSS}</style>

      <div className="wrap">
        {/* STATUS STRIP */}
        <div className="status-strip">
          <div className="brand">
            <span className={`led ${Object.keys(liveErrors).length > 0 ? "warn" : "ok"} pulse`} />
            <div>
              <div className="brand-mark">SECTORCALC PRO</div>
              <div className="brand-sub">Industrial Dynamic Tool Engine · SC-9000</div>
            </div>
          </div>
          <div className="indicators">
            <div className="ind">
              <span className={`led ${Object.keys(liveErrors).length > 0 ? "warn" : "ok"}`} />
              <b>RUN</b>
            </div>
            <div className="ind">
              <span className={`led ${Object.keys(liveErrors).length > 0 ? "danger pulse" : "off"}`} />
              <b>ALM</b>
            </div>
            <div className="ind">
              <span className={`led ${hasDirty ? "warn pulse" : "off"}`} />
              <b>PENDING</b>
            </div>
            <div className="ind">
              <span className="led signal pulse" />
              <b>COM</b>
            </div>
            <div className="timestamp">{utcTime || "—"}</div>
          </div>
        </div>

        {/* DISPLAY HEADER */}
        <div className="display-header">
          <div>
            <div className="module-id">MODULE · {tool.tool_id} · {(tool.category || "").toUpperCase()}</div>
            <h1>{tool.tool_name}</h1>
            <div className="sub-cap">
              Dynamic engine — inputs, formulas, validation, warnings and units are read from {tool.tool_id}.json.
              Batch-commit execution model: edit inputs freely, press EXECUTE (or F9) to commit and compute.
            </div>
          </div>
          <div className="meta">
            <div className="pill-row">
              {toolRegistry && toolRegistry.length > 0 ? (
                <span
                  className="pill btn"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPopover({
                      id: "__tool_switcher__",
                      rect,
                      options: toolRegistry.map((t) => ({ val: t.id, label: t.id, sub: t.name })),
                      current: tool.tool_id,
                    });
                  }}
                >
                  {tool.tool_id} ▾
                </span>
              ) : null}
              <span className="pill pro">PRO</span>
              <span className="pill">RISK · {tool.risk_level}</span>
              <span className="pill">{ccy}</span>
            </div>
            <div className="stds">
              {(tool.standards || []).map((s, i) => (
                <span key={i} className="std">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid">
          {/* LEFT: FORM */}
          <main>
            {(tool.ui_contract.input_groups || []).map((group, gi) => {
              const letter = String.fromCharCode(65 + gi);
              const hasInvalid = (group.fields || []).some((fid) => liveErrors[fid]);
              return (
                <section key={group.id} className="group">
                  <div className="group-head">
                    <span className={`led ${hasInvalid ? "danger pulse" : "ok"} group-led`} />
                    <span className="group-letter">MOD · {letter}.0{gi + 1}</span>
                    <span className="group-title">{group.title}</span>
                    <span className="group-count">{(group.fields || []).length} CH</span>
                  </div>
                  <div className="fields">
                    {(group.fields || []).map((fid) => {
                      const inp = (tool.inputs || []).find((i) => i.id === fid);
                      if (!inp) return null;
                      const cl = classify(inp);
                      const chipLabel = inp.confidence_label;
                      const chipClass =
                        chipLabel === "CERTAIN" || chipLabel === "EXACT" ? "certain" :
                        chipLabel === "STRONG" || chipLabel === "HIGH" ? "strong" :
                        chipLabel === "MODERATE" || chipLabel === "MEDIUM" ? "moderate" : "strong";

                      // Reference strip
                      const refParts: React.ReactNode[] = [];
                      if (cl.c !== "enum" && cl.c !== "bool") {
                        const unitStr = (() => {
                          if (cl.c === "num" && cl.fam) return " " + (dispUnit[inp.id] || cl.declared || "");
                          if (inp.unit && inp.unit !== "ratio" && inp.unit !== "enum") return " " + inp.unit;
                          return "";
                        })();
                        if (cl.c === "ratio") {
                          refParts.push(<span className="seg" key="r">RANGE <b>{(inp.absolute_min ?? 0) * 100}–{(inp.absolute_max ?? 1) * 100}%</b></span>);
                          if (inp.default != null) refParts.push(<span className="seg" key="rf">REF <b>{(inp.default as number * 100).toFixed(inp.resolution && inp.resolution < 0.01 ? 1 : 0)}%</b></span>);
                        } else if (inp.absolute_min != null || inp.absolute_max != null) {
                          let mn = inp.absolute_min, mx = inp.absolute_max, refVal = inp.default as number;
                          if (cl.c === "num" && cl.fam) {
                            const dec = cl.declared!;
                            if (mn != null) mn = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, mn);
                            if (mx != null) mx = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, mx);
                            if (refVal != null && isFinite(refVal)) refVal = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, refVal);
                          }
                          if (mn != null && mx != null) refParts.push(<span className="seg" key="r">RANGE <b>{fmt(Math.abs(mn) < 1 && mn !== 0 ? mn : mn, 0)}–{mx >= 1e7 ? "\u221E" : fmt(mx, 0)}{unitStr}</b></span>);
                          if (inp.reference) refParts.push(<span className="seg" key="rf">REF <b>{inp.reference}</b></span>);
                          else if (inp.default != null && typeof inp.default === "number" && isFinite(inp.default)) refParts.push(<span className="seg" key="rf">REF <b>{fmt(Math.abs(refVal) < 1 ? refVal : Number(refVal.toFixed(0)), 0)}{unitStr}</b></span>);
                        } else if (inp.default != null && typeof inp.default === "number" && isFinite(inp.default)) {
                          refParts.push(<span className="seg" key="rf">REF <b>{fmt(inp.default as number, 2)}{unitStr}</b></span>);
                        }
                      }

                      const displayVal = (() => {
                        const v = draft[inp.id];
                        if (cl.c === "num" && cl.fam) {
                          const dec = cl.declared!;
                          if (v != null && isFinite(v as number)) return unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, v as number);
                        }
                        return v;
                      })();

                      let ctrl: React.ReactNode = null;
                      const isFieldDirty = draft[inp.id] !== state[inp.id];
                      if (cl.c === "enum") {
                        ctrl = (
                          <button type="button" className="choice" onClick={(e) => openPopover(e.currentTarget, inp.id)}>
                            <span className="cv">{String(draft[inp.id] ?? inp.default ?? "")}</span>
                            <span className="car">▾</span>
                          </button>
                        );
                      } else if (cl.c === "bool") {
                        const isOn = !!draft[inp.id];
                        ctrl = (
                          <button type="button" className="toggle" aria-pressed={isOn} onClick={() => handleBoolToggle(inp.id)}>
                            <span className="tog-track"><span className="tog-knob" /></span>
                            <span className="state">{isOn ? "ON · EXCLUDED" : "OFF · INCLUDED"}</span>
                          </button>
                        );
                      } else {
                        const pickable = cl.c === "num" && cl.fam && FAM[cl.fam]?.order.length > 1;
                        ctrl = (
                          <div className="ctrl">
                            <input inputMode="decimal" value={displayVal != null ? String(displayVal) : ""} onChange={(e) => handleNumericInput(inp, e.target.value)} aria-label={inp.name} />
                            <button type="button" className={`ubtn ${pickable ? "" : "static"}`} onClick={(e) => pickable ? openUnitPopover(e.currentTarget, inp.id) : undefined}>
                              {(() => { const _c = cl; if (_c.c === "ccy") return ccy + (_c.suffix || ""); if (_c.c === "int") return _c.label || ""; if (_c.c === "num") { const n = _c as { c: "num"; fam?: string; declared?: string; label?: string }; if (n.fam) return dispUnit[inp.id] || n.declared || ""; return n.label || ""; } return ""; })()}
                              {pickable ? <span className="car">▾</span> : null}
                            </button>
                          </div>
                        );
                      }

                      const spanClass = cl.c === "bool" ? "span" : "";
                      const isInvalid = !!liveErrors[inp.id];

                      return (
                        <div key={inp.id} className={`field ${spanClass} ${isInvalid ? "invalid" : ""} ${isFieldDirty ? "dirty" : ""}`}>
                          <label>
                            <span className="f-name">{inp.name}</span>
                            <span className={`chip ${chipClass}`}>{chipLabel}</span>
                            <span className="f-sym">{inp.symbol || ""}</span>
                          </label>
                          {ctrl}
                          <div className="ref">
                            {refParts}
                            {refParts.length > 0 ? <span className="dot" /> : null}
                            <span className="info" tabIndex={0}>i<span className="tip">{inp.note || inp.name}</span></span>
                            {cl.c === "ratio" && draft[inp.id] != null ? <span className="pct">= {(draft[inp.id] as number * 100).toFixed(2)}%</span> : null}
                          </div>
                          <div className="err" style={{ display: isInvalid ? "block" : "none" }}>{liveErrors[inp.id] || ""}</div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* EXECUTE PANEL */}
            <div className="exec-panel">
              <div className="exec-status">
                <span className={`led ${Object.keys(liveErrors).length > 0 ? "danger" : hasDirty ? "warn pulse" : executionCounter > 0 ? "ok" : "off"}`} />
                <div>
                  <div><b>{Object.keys(liveErrors).length > 0 ? "VALIDATION ERRORS" : hasDirty ? `PENDING · ${dirtyCount} FIELD${dirtyCount > 1 ? "S" : ""}` : executionCounter > 0 ? "COMMITTED" : "READY"}</b></div>
                  <div className="tx">{lastExecTime ? `Last execution · ${new Date(lastExecTime).toISOString().replace("T", " ").slice(0, 19)} UTC · #${executionCounter}` : "Last execution · —"}</div>
                </div>
              </div>
              <button className="btn-reset" onClick={handleReset} disabled={Object.keys(liveErrors).length > 0 && !hasDirty} title="Revert all inputs to schema defaults">
                ↺ RESET
              </button>
              <button className={`btn-exec ${hasDirty ? "dirty" : ""} ${isExecuting ? "executing" : ""}`} onClick={handleExecute} disabled={Object.keys(liveErrors).length > 0}>
                {isExecuting ? (
                  <><span>◼ EXECUTING…</span><span className="kbd">F9</span></>
                ) : (
                  <><span>▶ EXECUTE</span><span className="kbd">F9</span></>
                )}
              </button>
            </div>
          </main>

          {/* RIGHT: RAIL */}
          <aside className="rail">
            {/* Decision */}
            <div className={`decision ${isCritical ? "review" : isOK ? "ok" : ""} ${hasDirty ? "stale" : ""}`}>
              <div className="d-label">
                PRIMARY READOUT · STATUS
                {hasDirty ? <span className="stale-chip">STALE</span> : null}
              </div>
              <div className="d-text">{decisionLabel}</div>
              {tool.ui_contract.decision_note ? (
                <div className="d-sub">{interp(tool.ui_contract.decision_note, computed, ccy, outMeta)}</div>
              ) : null}
            </div>

            {/* KPIs */}
            <div className="card">
              <h3>PRIMARY READOUTS</h3>
              <div className="kpis">
                {(tool.ui_contract.result_cards || []).map((id) => {
                  const m = outMeta(id);
                  const [val, unit] = valFmt(m, computed[id], ccy);
                  const isPrimary = id === tool.ui_contract.primary;
                  const uncVal = uncertainties[id];
                  const primUnc = tool.ui_contract.primary_uncertainty;
                  const band = uncVal != null ? `± ${fmt(uncVal, m?.unit && m.unit.indexOf("currency") === 0 && Math.abs(computed[id] as number) > 1000 ? 0 : 2)} ${unit}` : "";
                  return (
                    <div key={id} className={`kpi ${isPrimary ? "lead" : ""}`}>
                      <div className="k-label">{m?.name || id}</div>
                      <div className="k-val">{val} <span className="k-unit">{unit}</span></div>
                      {band ? <div className="k-band">{band}{id === primUnc && computed[id] != null ? ` · ${pctf(uncVal / (computed[id] as number))} GUM` : ""}</div> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resolver */}
            {tool.ui_contract.resolver ? (
              <div className="card resolver">
                <h3>{tool.ui_contract.resolver.title}</h3>
                <div className="resolver">
                  {(tool.ui_contract.resolver.bars || []).map((bar, i) => {
                    const barVal = (computed[bar.ref] as number) || 0;
                    const allVals = (tool.ui_contract.resolver?.bars || []).map((b) => (computed[b.ref] as number) || 0);
                    const maxVal = Math.max(...allVals.concat([0.0001]));
                    const bindVal = computed[tool.ui_contract.resolver!.binding] as string;
                    const bindIdx = tool.ui_contract.resolver!.map ? tool.ui_contract.resolver!.map[bindVal] : -1;
                    const isBound = i === bindIdx;
                    return (
                      <div key={bar.ref} className={`bar-row ${isBound ? "bind" : ""}`}>
                        <span className="bl">{bar.label}</span>
                        <span className="track"><span className="fill" style={{ width: `${Math.max(2, (barVal / maxVal) * 100)}%` }} /></span>
                        <span className="bv">{fmt(barVal, 1)} {tool.ui_contract.resolver!.unit}</span>
                      </div>
                    );
                  })}
                  {tool.ui_contract.resolver.note ? <div className="note">{interp(tool.ui_contract.resolver.note, computed, ccy, outMeta)}</div> : null}
                </div>
              </div>
            ) : null}

            {/* Engineering Diagnostics */}
            <div className="card readout">
              <h3>ENGINEERING DIAGNOSTICS</h3>
              <div className="readout">
                {(tool.ui_contract.insights || []).filter((b) => !b.when || safeEval(compile(b.when), computed) === true).map((block, i) => {
                  const confClass = block.conf === "CERTAIN" ? "cert" : block.conf === "STRONG" ? "strong" : block.conf === "MODERATE" ? "moderate" : "";
                  return (
                    <div key={i} className="blk">
                      <div className="bh">
                        <span className="bt">{block.title}</span>
                        {block.conf ? <span className={`bc ${confClass}`}>{block.conf}</span> : null}
                      </div>
                      {(block.lines || []).map((l, li) => <p key={li}>{interp(l, computed, ccy, outMeta)}</p>)}
                    </div>
                  );
                })}
                {tool.ui_contract.primary_uncertainty && uncertainties[tool.ui_contract.primary_uncertainty] != null ? (() => {
                  const pKey = tool.ui_contract.primary_uncertainty!;
                  const pMeta = outMeta(pKey);
                  const [pv, pu] = valFmt(pMeta, computed[pKey], ccy);
                  return (
                    <div className="blk">
                      <div className="bh"><span className="bt">CONFIDENCE &amp; UNCERTAINTY</span><span className="bc strong">STRONG</span></div>
                      <p>GUM (ISO/IEC 98-3) combined Type-B, root-sum-square: <b>{pv} {pu} ± {fmt(uncertainties[pKey], 0)}</b> (±{pctf(uncertainties[pKey] / (computed[pKey] as number))}). Tighten the highest-variance inputs before committing.</p>
                    </div>
                  );
                })() : null}
                {(!tool.ui_contract.insights || tool.ui_contract.insights.length === 0) ? <p className="blk" style={{ color: "var(--ink-50)", fontSize: "11px", margin: 0, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em" }}>No interpretation configured.</p> : null}
              </div>
            </div>

            {/* Breakdown */}
            {tool.ui_contract.breakdown ? (
              <div className="card">
                <h3>{tool.ui_contract.breakdown.title}</h3>
                {(() => {
                  const total = (computed[tool.ui_contract.breakdown!.total] as number) || 1;
                  const colors = ["var(--accent)", "var(--signal)", "var(--ok)", "rgba(230,234,241,.6)", "rgba(230,234,241,.4)", "rgba(230,234,241,.25)"];
                  const parts = tool.ui_contract.breakdown!.parts || [];
                  return (
                    <>
                      <div className="stack">
                        {parts.map((p, i) => (
                          <span key={p.ref} className="seg-b" title={p.label} style={{ width: `${Math.max(0, ((computed[p.ref] as number) || 0) / total * 100)}%`, background: colors[i % colors.length] }} />
                        ))}
                      </div>
                      <div className="legend">
                        {parts.map((p, i) => (
                          <div key={p.ref} className="lg">
                            <span className="sw" style={{ background: colors[i % colors.length] }} />
                            {p.label}
                            <span className="lv">{fmt((computed[p.ref] as number) || 0, Math.abs(computed[p.ref] as number) < 100 ? 2 : 0)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : null}

            {/* Warnings */}
            <div className="card">
              <h3>ALARM LOG</h3>
              <div style={{ minHeight: 20 }}>
                {warnings.length > 0 ? warnings.map(([severity, msg], i) => (
                  <div key={i} className={`warn ${severity}`}>
                    <span className="wsev" />
                    <span className="wmsg"><b>{severity}.</b> {msg}</span>
                  </div>
                )) : <div className="no-warn">● NO THRESHOLD ALERTS · ALL INPUTS WITHIN OPERATING RANGE</div>}
              </div>
            </div>

            {/* Formula Trace & Audit */}
            <div className="card" style={{ paddingTop: 4 }}>
              <details>
                <summary>FORMULA TRACE <span className="arrow">›</span></summary>
                <div style={{ paddingBottom: 10 }}>
                  {(tool.formulas || []).filter((f) => !f.id.startsWith("X")).map((f) => {
                    const v = computed[f.output];
                    const str = typeof v === "string" ? v : (typeof v === "number" ? fmt(v, Math.abs(v) < 10 ? 3 : 2) : String(v ?? "—"));
                    return (
                      <div key={f.id} className="frow">
                        <span className="fn"><span className="fid">{f.id}</span>{f.output}</span>
                        <span className="fv">{str}</span>
                      </div>
                    );
                  })}
                </div>
              </details>
              <details>
                <summary>AUDIT LOG · ISO 9001 §8.5.1 <span className="arrow">›</span></summary>
                <div style={{ paddingBottom: 12 }}>
                  {[
                    ["Tool ID", tool.tool_id],
                    ["Formula version", tool.formula_version],
                    ["Traceability ID", tool.traceability_id],
                    ["Execution #", String(executionCounter)],
                    ["Timestamp (UTC)", new Date().toISOString().replace("T", " ").slice(0, 19)],
                    ["Input hash", "#" + hash(JSON.stringify(state) + ccy)],
                    ["Display currency", ccy + " (label only)"],
                    ["Uncertainty", "GUM 98-3 · RSS Type B"],
                  ].map(([label, val]) => (
                    <div key={label} className="audit-line">
                      <span>{label}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Export */}
            <button className="btn-export" onClick={() => window.print()}>&#x2398; EXPORT REPORT</button>
          </aside>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="mbar" style={{ display: "flex" }}>
        <div>
          <div className="ml">RESULT</div>
          <div className="mv">
            {(() => { const pk = tool.ui_contract.primary; const [pv, pu] = valFmt(outMeta(pk), computed[pk], ccy); return pv + " " + pu; })()}
          </div>
        </div>
        <div className="md">{decisionLabel}</div>
      </div>

      {/* Popover Portal */}
      {popover ? (
        popover.id === "__tool_switcher__" ? (
          <PopoverMenu
            options={popover.options} current={popover.current}
            onPick={(val) => { closePopover(); if (hasDirty && !window.confirm("You have uncommitted changes. Load a different tool? Changes will be discarded.")) return; onToolSwitch?.(val); }}
            note={popover.note} anchorRect={popover.rect} onClose={closePopover}
          />
        ) : (
          <PopoverMenu
            options={popover.options} current={popover.current}
            onPick={handlePopoverPick} note={popover.note}
            anchorRect={popover.rect} onClose={closePopover}
          />
        )
      ) : null}
    </div>
  );
}
