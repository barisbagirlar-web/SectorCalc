import { D, Decimal } from './core/engine.js';
import {
  UNIT_FAMILIES, fnv1a, hasBlocking, resultNumeric, stableStringify, unitOption, warning
} from './industrial-suite/engine.js';
import type {
  CanonicalInput, CalcResult, FieldSpec, NumberField, WarningItem
} from './industrial-suite/engine.js';
import { getIndustrialTool } from './industrial-suite/registry.js';
import './industrial-tool.css';

const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
};

const body = document.body;
const code = body.dataset.toolCode ?? '';
const tool = getIndustrialTool(code);
let currentResult: CalcResult | null = null;
let currentInput: CanonicalInput | null = null;
let lastAudit: AuditSnapshot | null = null;
let renderLock = false;

interface AuditSnapshot {
  timestamp: string;
  inputHash: string;
  outputHash: string;
  reportHash: string;
  calculationId: string;
}

const fixedUnitLabel: Readonly<Record<string,string>> = {
  voltage:'V', current:'A', conductivity:'W/m·K', flutes:'count', teeth:'count', z:'count', points:'count',
  toolChanges:'count', batch:'pcs', totalCount:'pcs', goodCount:'pcs', simultaneous:'count', quantity:'pcs',
  laborHours:'h', machineHours:'h', hours:'h/week', overtimeHours:'h/month', tenure:'years', paymentDays:'days',
  lifeYears:'years', nuOp:'cSt', rpm:'rpm'
};

function esc(text: string): string {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function fmt(value: Decimal, precision = 3): string {
  return value.toDecimalPlaces(precision, Decimal.ROUND_HALF_UP).toFixed(precision);
}

function fmtOutput(value: Decimal | string, precision = 3): string {
  return value instanceof Decimal ? fmt(value, precision) : value;
}

function numberFieldHtml(field: NumberField): string {
  const family = UNIT_FAMILIES[field.family];
  const options = family.units.map((u) => `<option value="${esc(u.key)}" ${u.key===field.defaultUnit?'selected':''}>${esc(u.label)}</option>`).join('');
  const unitControl = family.units.length > 1
    ? `<select class="units" id="u_${field.id}" data-field="${field.id}" data-family="${String(field.family)}">${options}</select>`
    : `<span class="fixed-unit">${esc(fixedUnitLabel[field.id] ?? family.baseLabel)}</span>`;
  return `<div class="field" id="field_${field.id}">
    <label for="${field.id}">${esc(field.label)}</label>
    <div class="input-row"><input type="number" id="${field.id}" value="${field.defaultValue}" step="${field.step ?? 'any'}" inputmode="decimal">${unitControl}</div>
    <div class="ref"><b>REF</b> ${esc(field.reference)}</div>${field.hint?`<div class="hint">${esc(field.hint)}</div>`:''}
    <div class="field-error" id="err_${field.id}"></div>
  </div>`;
}

function fieldHtml(field: FieldSpec): string {
  if (field.kind === 'number') return numberFieldHtml(field);
  return `<div class="field" id="field_${field.id}"><label for="${field.id}">${esc(field.label)}</label><select id="${field.id}">${field.options.map((x)=>`<option value="${esc(x.value)}" ${x.value===field.defaultValue?'selected':''}>${esc(x.label)}</option>`).join('')}</select><div class="ref"><b>REF</b> ${esc(field.reference)}</div>${field.hint?`<div class="hint">${esc(field.hint)}</div>`:''}</div>`;
}

function mount(): void {
  document.title = `${tool.name} — SectorCalc Pro`;
  $('toolCode').textContent = tool.code;
  $('toolTitle').textContent = tool.name;
  $('toolSummary').textContent = tool.summary;
  $('engineBadge').textContent = `${tool.engineVersion} · ${tool.standard}`;
  $('decisionText').textContent = tool.decision;
  $('fields').innerHTML = tool.fields.map(fieldHtml).join('');
  bindUnits();
  bindEvents();
  restoreTheme();
  calculateAndRender();
}

function bindUnits(): void {
  document.querySelectorAll<HTMLSelectElement>('select.units').forEach((select) => {
    select.dataset.previous = select.value;
    select.addEventListener('change', () => {
      const id = select.dataset.field ?? '';
      const family = select.dataset.family as keyof typeof UNIT_FAMILIES;
      const input = document.getElementById(id) as HTMLInputElement | null;
      if (!input) return;
      const raw = D(input.value || '0');
      const previous = select.dataset.previous ?? select.value;
      const base = unitOption(family, previous).toBase(raw);
      const next = unitOption(family, select.value).fromBase(base);
      input.value = next.toSignificantDigits(10).toString();
      select.dataset.previous = select.value;
      calculateAndRender();
    });
  });
}

function bindEvents(): void {
  $('calcBtn').addEventListener('click', calculateAndRender);
  $('metricBtn').addEventListener('click', () => setUnitSystem('metric'));
  $('imperialBtn').addEventListener('click', () => setUnitSystem('imperial'));
  $('save1').addEventListener('click', () => savePreset(1));
  $('load1').addEventListener('click', () => loadPreset(1));
  $('save2').addEventListener('click', () => savePreset(2));
  $('load2').addEventListener('click', () => loadPreset(2));
  $('copyBtn').addEventListener('click', copyAudit);
  $('jsonBtn').addEventListener('click', exportJson);
  $('printBtn').addEventListener('click', () => window.print());
  $('themeToggle').addEventListener('click', toggleTheme);
  document.querySelectorAll<HTMLInputElement|HTMLSelectElement>('#fields input,#fields select:not(.units)').forEach((el) => {
    el.addEventListener(el.tagName==='INPUT'?'input':'change', calculateAndRender);
  });
}

function setUnitSystem(system: 'metric'|'imperial'): void {
  const preferred: Readonly<Record<string,string>> = system==='imperial'
    ? {length:'in',area:'in2',force:'lbf',pressure:'psi',power:'hp',torque:'lbfft',mass:'lb',linearSpeed:'inmin',surfaceSpeed:'sfm',velocity:'fts',flow:'gpm',stiffness:'lbfIn',temperature:'F'}
    : {length:'mm',area:'mm2',force:'N',pressure:'MPa',power:'kW',torque:'Nm',mass:'kg',linearSpeed:'mmmin',surfaceSpeed:'mmin',velocity:'ms',flow:'Lmin',stiffness:'Nmm',temperature:'C'};
  document.querySelectorAll<HTMLSelectElement>('select.units').forEach((select) => {
    const family = select.dataset.family ?? '';
    const target = preferred[family];
    if (!target || select.value===target || !Array.from(select.options).some((o)=>o.value===target)) return;
    select.value=target;
    select.dispatchEvent(new Event('change'));
  });
  $('metricBtn').classList.toggle('active',system==='metric');
  $('imperialBtn').classList.toggle('active',system==='imperial');
}

function clearFieldErrors(): void {
  document.querySelectorAll<HTMLElement>('.field-error').forEach((el)=>el.textContent='');
  document.querySelectorAll<HTMLElement>('.field').forEach((el)=>el.classList.remove('bad'));
}

function readCanonical(): { input: CanonicalInput; preWarnings: WarningItem[] } {
  clearFieldErrors();
  const values: Record<string, Decimal|string> = {};
  const display: Record<string,string> = {};
  const units: Record<string,string> = {};
  const preWarnings: WarningItem[]=[];
  for (const field of tool.fields) {
    if (field.kind === 'select') {
      const el=$(field.id) as HTMLSelectElement;
      values[field.id]=el.value;
      display[field.id]=el.options[el.selectedIndex]?.text ?? el.value;
      units[field.id]='—';
      continue;
    }
    const el=$(field.id) as HTMLInputElement;
    let raw:Decimal;
    try {
      raw=D(el.value,field.label);
    } catch (error: unknown) {
      const msg=error instanceof Error?error.message:'Invalid number';
      preWarnings.push(warning('error',`Invalid ${field.label}`,msg));
      $('field_'+field.id).classList.add('bad');
      $('err_'+field.id).textContent=msg;
      continue;
    }
    const select=document.getElementById('u_'+field.id) as HTMLSelectElement | null;
    const unitKey=select?.value ?? field.defaultUnit;
    const unit=unitOption(field.family,unitKey);
    const base=unit.toBase(raw);
    values[field.id]=base;
    units[field.id]=unitKey;
    display[field.id]=`${raw.toString()} ${select?select.options[select.selectedIndex]?.text ?? unitKey:fixedUnitLabel[field.id] ?? UNIT_FAMILIES[field.family].baseLabel}`;
    const min=field.min===undefined?null:D(field.min);
    const max=field.max===undefined?null:D(field.max);
    if (min && base.lt(min)) {
      const msg=`Below validated minimum ${min.toString()} ${UNIT_FAMILIES[field.family].baseLabel}`;
      preWarnings.push(warning('error',field.label,msg));
      $('field_'+field.id).classList.add('bad');
      $('err_'+field.id).textContent=msg;
    }
    if (max && base.gt(max)) {
      const msg=`Above validated maximum ${max.toString()} ${UNIT_FAMILIES[field.family].baseLabel}`;
      preWarnings.push(warning('error',field.label,msg));
      $('field_'+field.id).classList.add('bad');
      $('err_'+field.id).textContent=msg;
    }
  }
  return {input:{values,display,units},preWarnings};
}

function calculateWith(input: CanonicalInput, preWarnings: readonly WarningItem[] = []): CalcResult {
  if (preWarnings.some((x)=>x.severity==='error')) return { outputs:[], warnings:preWarnings, formulas:tool.formulas, assumptions:tool.assumptions };
  try {
    const result=tool.calculate(input);
    return {...result,warnings:[...preWarnings,...result.warnings]};
  } catch (error: unknown) {
    const message=error instanceof Error?error.message:String(error);
    return {outputs:[],warnings:[...preWarnings,warning('error','Calculation blocked',message)],formulas:tool.formulas,assumptions:tool.assumptions};
  }
}

function calculateAndRender(): void {
  if(renderLock) return;
  renderLock=true;
  try {
    const {input,preWarnings}=readCanonical();
    const result=calculateWith(input,preWarnings);
    currentInput=input;
    currentResult=result;
    renderResult(result,input);
    renderCharts(result,input);
    buildAudit(result,input);
  } finally {
    renderLock=false;
  }
}

function renderResult(result: CalcResult, input: CanonicalInput): void {
  const errors=result.warnings.filter((x)=>x.severity==='error').length;
  const warnings=result.warnings.filter((x)=>x.severity==='warning').length;
  const verdict=$('verdict');
  verdict.className=`verdict ${errors?'fail':warnings?'warn':'pass'}`;
  verdict.innerHTML=errors?`<b>BLOCKED — ${errors} engineering error${errors===1?'':'s'}</b><span>Resolve red items before using this result.</span>`:warnings?`<b>CONDITIONAL — ${warnings} review item${warnings===1?'':'s'}</b><span>Mathematically resolved; review validated-envelope warnings.</span>`:`<b>ACCEPTED WITHIN MODEL</b><span>No blocking or envelope warnings in this engine version.</span>`;
  $('warnings').innerHTML=result.warnings.length?result.warnings.map((x)=>`<div class="notice ${x.severity}"><b>${x.severity==='error'?'BLOCKING':x.severity==='warning'?'WARNING':'NOTE'} · ${esc(x.title)}</b><span>${esc(x.detail)}</span></div>`).join(''):'<div class="notice info"><b>ALL CLEAR</b><span>No warnings generated.</span></div>';
  const primary=result.outputs.filter((x)=>x.primary).slice(0,6);
  $('kpis').innerHTML=primary.map((x)=>`<div class="kpi"><div class="kpi-label">${esc(x.label)}</div><div class="kpi-value">${esc(fmtOutput(x.value,x.precision))}</div><div class="kpi-unit">${esc(x.unit)}</div></div>`).join('');
  $('resultTable').innerHTML=result.outputs.length?`<thead><tr><th>Result</th><th>Value</th><th>Unit</th><th>Engineering note</th></tr></thead><tbody>${result.outputs.map((x)=>`<tr><td>${esc(x.label)}</td><td class="num">${esc(fmtOutput(x.value,x.precision))}</td><td>${esc(x.unit)}</td><td>${esc(x.note ?? '')}</td></tr>`).join('')}</tbody>`:'<tbody><tr><td>Calculation blocked. Resolve input/domain errors.</td></tr></tbody>';
  const inputRows=Object.entries(input.display).map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td><td>${esc(input.values[k] instanceof Decimal?(input.values[k] as Decimal).toString():String(input.values[k]))}</td></tr>`).join('');
  $('inputPreview').innerHTML=`<table><thead><tr><th>Input</th><th>As entered</th><th>Canonical engine value</th></tr></thead><tbody>${inputRows}</tbody></table>`;
}

function cloneInput(input: CanonicalInput, id: string, value: Decimal): CanonicalInput {
  return {values:{...input.values,[id]:value},display:input.display,units:input.units};
}

function renderCharts(result: CalcResult, input: CanonicalInput): void {
  drawSensitivity(result,input);
  drawRisk(result);
}

function drawSensitivity(result: CalcResult, input: CanonicalInput): void {
  const canvas=$('sensitivity') as HTMLCanvasElement;
  const ctx=canvas.getContext('2d');
  if(!ctx) return;
  const spec=tool.sensitivity;
  const base=input.values[spec.inputId];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(!(base instanceof Decimal)||hasBlocking(result)){
    drawNoData(ctx,canvas,'Resolve errors to calculate sensitivity.');
    return;
  }
  const span=D(spec.spanPct ?? 20).div(100);
  const points: Array<{x:number;y:number}> = [];
  for(let i=0;i<9;i++){
    const factor=D(1).minus(span).plus(span.times(2).times(i).div(8));
    const x=base.times(factor);
    const rr=calculateWith(cloneInput(input,spec.inputId,x));
    if(hasBlocking(rr)) continue;
    try { points.push({x:x.toNumber(),y:resultNumeric(rr,spec.outputId).toNumber()}); } catch { continue; }
  }
  if(points.length<2){drawNoData(ctx,canvas,'Sensitivity unavailable in this input region.');return;}
  drawLine(ctx,canvas,points,`${spec.outputId} vs ${spec.inputId}`);
}

function drawRisk(result: CalcResult): void {
  const canvas=$('riskChart') as HTMLCanvasElement;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const rows=result.outputs.filter((x)=>x.risk instanceof Decimal).slice(0,6);
  if(!rows.length){drawNoData(ctx,canvas,'No normalized risk ratios for this tool.');return;}
  const css=getComputedStyle(document.documentElement);
  const ink=css.getPropertyValue('--ink').trim()||'#1c2733';
  const grid=css.getPropertyValue('--line').trim()||'#d9e0e8';
  const blue=css.getPropertyValue('--blue').trim()||'#0055a4';
  const red=css.getPropertyValue('--err').trim()||'#b3261e';
  const max=Math.max(1.2,...rows.map((r)=>(r.risk as Decimal).toNumber()*1.1));
  ctx.font='12px Inter, sans-serif';
  rows.forEach((row,i)=>{
    const y=28+i*38;
    const risk=(row.risk as Decimal).toNumber();
    ctx.fillStyle=ink;ctx.fillText(row.label,8,y);
    ctx.fillStyle=grid;ctx.fillRect(210,y-14,canvas.width-230,14);
    ctx.fillStyle=risk>1?red:blue;ctx.fillRect(210,y-14,(canvas.width-230)*Math.min(risk/max,1),14);
    ctx.fillStyle=ink;ctx.fillText(`${(risk*100).toFixed(0)}%`,canvas.width-58,y-2);
  });
}

function drawNoData(ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement,text:string):void{
  const css=getComputedStyle(document.documentElement);
  ctx.fillStyle=css.getPropertyValue('--mut').trim()||'#5d6b7a';
  ctx.font='13px Inter,sans-serif';
  ctx.fillText(text,18,32);
}

function drawLine(ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement,points:Array<{x:number;y:number}>,title:string):void{
  const css=getComputedStyle(document.documentElement);
  const grid=css.getPropertyValue('--line').trim()||'#d9e0e8';
  const ink=css.getPropertyValue('--ink').trim()||'#1c2733';
  const blue=css.getPropertyValue('--blue').trim()||'#0055a4';
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
  const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const pad={l:56,r:18,t:34,b:34};
  const X=(x:number)=>pad.l+(x-xmin)/Math.max(xmax-xmin,1e-12)*(canvas.width-pad.l-pad.r);
  const Y=(y:number)=>canvas.height-pad.b-(y-ymin)/Math.max(ymax-ymin,1e-12)*(canvas.height-pad.t-pad.b);
  ctx.strokeStyle=grid;ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=pad.t+i*(canvas.height-pad.t-pad.b)/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(canvas.width-pad.r,y);ctx.stroke();}
  ctx.strokeStyle=blue;ctx.lineWidth=2.5;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(X(p.x),Y(p.y)):ctx.moveTo(X(p.x),Y(p.y)));ctx.stroke();
  ctx.fillStyle=ink;ctx.font='12px Inter,sans-serif';ctx.fillText(title,12,18);ctx.fillText(xmin.toPrecision(4),pad.l,canvas.height-10);ctx.fillText(xmax.toPrecision(4),canvas.width-80,canvas.height-10);ctx.fillText(ymax.toPrecision(4),6,pad.t+5);ctx.fillText(ymin.toPrecision(4),6,canvas.height-pad.b);
}

function serializeOutputs(result: CalcResult): Readonly<Record<string,string>> {
  const out:Record<string,string>={};
  result.outputs.forEach((x)=>{out[x.id]=x.value instanceof Decimal?x.value.toString():x.value;});
  return out;
}

function buildAudit(result: CalcResult, input: CanonicalInput): void {
  const timestamp=new Date().toISOString();
  const canonicalInputs:Record<string,string>={};
  Object.entries(input.values).forEach(([k,v])=>canonicalInputs[k]=v instanceof Decimal?v.toString():v);
  const inputHash=fnv1a(stableStringify({canonicalInputs,units:input.units,engine:tool.engineVersion}));
  const outputHash=fnv1a(stableStringify(serializeOutputs(result)));
  const reportHash=fnv1a(`${inputHash}|${outputHash}|${tool.engineVersion}|${timestamp}`);
  const calculationId=`${tool.code}-${inputHash}`;
  lastAudit={timestamp,inputHash,outputHash,reportHash,calculationId};
  $('auditEngine').innerHTML=`<table><tbody><tr><th>Calculation ID</th><td>${calculationId}</td></tr><tr><th>Engine version</th><td>${esc(tool.engineVersion)}</td></tr><tr><th>Standard basis</th><td>${esc(tool.standard)}</td></tr><tr><th>UTC report time</th><td>${timestamp}</td></tr><tr><th>Input hash</th><td class="mono">${inputHash}</td></tr><tr><th>Output hash</th><td class="mono">${outputHash}</td></tr><tr><th>Report-instance hash</th><td class="mono">${reportHash}</td></tr><tr><th>Determinism</th><td>Canonical inputs + same engine version ⇒ identical output hash.</td></tr></tbody></table>`;
  $('auditInputs').innerHTML=$('inputPreview').innerHTML;
  $('auditFormulas').innerHTML=result.formulas.map((x)=>`<div class="formula">${esc(x)}</div>`).join('');
  $('auditAssumptions').innerHTML=`<ul>${result.assumptions.map((x)=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  $('auditWarnings').innerHTML=result.warnings.length?result.warnings.map((x)=>`<div class="notice ${x.severity}"><b>${esc(x.title)}</b><span>${esc(x.detail)}</span></div>`).join(''):'<div class="notice info"><b>ALL CLEAR</b><span>No warnings.</span></div>';
}

function presetState(): Record<string,string> {
  const state:Record<string,string>={};
  tool.fields.forEach((f)=>{
    const el=$(f.id) as HTMLInputElement|HTMLSelectElement;
    state[f.id]=el.value;
    if(f.kind==='number'){
      const u=document.getElementById('u_'+f.id) as HTMLSelectElement|null;
      if(u)state['u_'+f.id]=u.value;
    }
  });
  return state;
}

function savePreset(slot:number):void{
  localStorage.setItem(`${tool.code}:preset:${slot}`,JSON.stringify(presetState()));
}

function loadPreset(slot:number):void{
  const raw=localStorage.getItem(`${tool.code}:preset:${slot}`);
  if(!raw)return;
  try{
    const state=JSON.parse(raw) as Record<string,string>;
    tool.fields.forEach((f)=>{
      const el=$(f.id) as HTMLInputElement|HTMLSelectElement;
      if(state[f.id]!==undefined)el.value=state[f.id];
      if(f.kind==='number'){
        const u=document.getElementById('u_'+f.id) as HTMLSelectElement|null;
        if(u&&state['u_'+f.id]){u.value=state['u_'+f.id];u.dataset.previous=u.value;}
      }
    });
    calculateAndRender();
  }catch{
    localStorage.removeItem(`${tool.code}:preset:${slot}`);
  }
}

function auditPayload(): Record<string,unknown> | null {
  if(!currentInput||!currentResult||!lastAudit)return null;
  const inputs:Record<string,string>={};
  Object.entries(currentInput.values).forEach(([k,v])=>inputs[k]=v instanceof Decimal?v.toString():v);
  return {tool:{code:tool.code,name:tool.name,standard:tool.standard,engineVersion:tool.engineVersion},audit:lastAudit,inputs,displayInputs:currentInput.display,selectedUnits:currentInput.units,outputs:serializeOutputs(currentResult),warnings:currentResult.warnings,formulas:currentResult.formulas,assumptions:currentResult.assumptions};
}

async function copyAudit():Promise<void>{
  const p=auditPayload();
  if(!p)return;
  await navigator.clipboard.writeText(JSON.stringify(p,null,2));
}

function exportJson():void{
  const p=auditPayload();
  if(!p)return;
  const blob=new Blob([JSON.stringify(p,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`${tool.code}_${lastAudit?.inputHash ?? 'audit'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function restoreTheme():void{
  const saved=localStorage.getItem('sectorcalc-theme');
  const theme=saved==='dark'?'dark':'light';
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
}

function toggleTheme():void{
  const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=next;
  document.documentElement.style.colorScheme=next;
  localStorage.setItem('sectorcalc-theme',next);
  if(currentResult&&currentInput)renderCharts(currentResult,currentInput);
}

mount();
