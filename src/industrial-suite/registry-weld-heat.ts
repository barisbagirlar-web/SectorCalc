import { D, Decimal, CalcError } from '../core/engine.js';
import { numberValue as n, output as o, warning as w, decimalPi as PI } from './engine.js';
import type { CanonicalInput, ToolDefinition, WarningItem } from './engine.js';

const positive=(x:Decimal,name:string):Decimal=>{if(x.lte(0))throw new CalcError('E_NON_POSITIVE',`${name} must be > 0`);return x;};
const nonNegative=(x:Decimal,name:string):Decimal=>{if(x.lt(0))throw new CalcError('E_NEGATIVE',`${name} must be >= 0`);return x;};
const CE_REVIEW_LIMIT=D('0.0045'); // 0.45 mass-% expressed as canonical ratio.

export const SC029_WELD_HEAT:ToolDefinition={
  code:'SC-029',slug:'weld-heat-input-pro',name:'Weld Heat Input & t8/5 Cooling Estimate',category:'Welding & Fabrication',
  standard:'ISO/TR 17671 heat-input practice · IIW carbon-equivalent convention · Rosenthal thick-plate cooling approximation',engineVersion:'SC029-DECIMAL-1.1.0',
  summary:'Calculates arc heat input, net heat input, deposition energy density, IIW carbon equivalent and a transparent Rosenthal thick-plate t8/5 cooling-time estimate.',
  decision:'Set travel speed, preheat and heat-input windows without hiding the assumptions that control HAZ hardness and hydrogen-cracking risk.',
  fields:[
    {kind:'number',id:'voltage',label:'Arc voltage',defaultValue:26,step:.5,family:'count',defaultUnit:'count',min:1,max:100,reference:'Use average arc voltage during welding, not open-circuit voltage.'},
    {kind:'number',id:'current',label:'Welding current',defaultValue:220,step:5,family:'count',defaultUnit:'count',min:1,max:2000,reference:'Use average current for the pass.'},
    {kind:'number',id:'travel',label:'Travel speed',defaultValue:300,step:10,family:'linearSpeed',defaultUnit:'mmmin',min:1,max:10000,reference:'Measured arc travel along the weld centerline.'},
    {kind:'number',id:'efficiency',label:'Thermal efficiency η',defaultValue:80,step:1,family:'percent',defaultUnit:'pct',min:.2,max:1,reference:'Typical planning values: GTAW ~0.6, GMAW/FCAW ~0.8, SAW ~0.9; qualify to procedure.'},
    {kind:'number',id:'thickness',label:'Plate thickness',defaultValue:16,step:.5,family:'length',defaultUnit:'mm',min:.5,max:500,reference:'Rosenthal 3D cooling estimate is most defensible for sufficiently thick sections.'},
    {kind:'number',id:'preheat',label:'Initial / preheat temperature',defaultValue:80,step:5,family:'temperature',defaultUnit:'C',min:-50,max:400,reference:'Use measured interpass/preheat temperature immediately ahead of the arc.'},
    {kind:'number',id:'conductivity',label:'Thermal conductivity',defaultValue:45,step:1,family:'count',defaultUnit:'count',min:5,max:500,reference:'W/m·K. Carbon steel near welding temperatures is often modeled ~35–50 W/m·K.'},
    {kind:'number',id:'C',label:'Carbon C',defaultValue:.18,step:.01,family:'percent',defaultUnit:'pct',min:0,max:.03,reference:'Mass fraction; 0.18% is normalized to 0.0018.'},
    {kind:'number',id:'Mn',label:'Manganese Mn',defaultValue:1.2,step:.05,family:'percent',defaultUnit:'pct',min:0,max:.05,reference:'Mass fraction from mill certificate / chemistry.'},
    {kind:'number',id:'CrMoV',label:'Cr + Mo + V',defaultValue:.3,step:.05,family:'percent',defaultUnit:'pct',min:0,max:.1,reference:'Combined mass fraction for IIW CE term.'},
    {kind:'number',id:'NiCu',label:'Ni + Cu',defaultValue:.2,step:.05,family:'percent',defaultUnit:'pct',min:0,max:.1,reference:'Combined mass fraction for IIW CE term.'}
  ],
  formulas:['Gross heat input H = V·I·60/(1000·travel) [kJ/mm]','Net heat input Q = η·H','IIW CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15','Rosenthal thick-plate t8/5 ≈ Q_J/mm/(2πλ_W/mmK)·[1/(500−T0) − 1/(800−T0)]'],
  assumptions:['t8/5 is a 3D thick-plate Rosenthal estimate, not a code-certified substitute for procedure qualification or finite-element thermal analysis.','Material properties are treated constant over the 800→500 °C interval; phase transformations, latent heat, convection and multi-pass reheating are omitted.','Chemistry inputs are canonical mass fractions after unit normalization; use the mill certificate for production decisions.','The 0.45% CE review threshold is a planning warning, not a universal code acceptance limit.'],
  sensitivity:{inputId:'travel',outputId:'t85',spanPct:25},
  calculate(input:CanonicalInput){
    const V=positive(n(input,'voltage'),'voltage'),I=positive(n(input,'current'),'current'),travel=positive(n(input,'travel'),'travel'),eta=positive(n(input,'efficiency'),'efficiency'),t=positive(n(input,'thickness'),'thickness'),T0=n(input,'preheat'),lambda=positive(n(input,'conductivity'),'conductivity');
    const C=nonNegative(n(input,'C'),'C'),Mn=nonNegative(n(input,'Mn'),'Mn'),CrMoV=nonNegative(n(input,'CrMoV'),'CrMoV'),NiCu=nonNegative(n(input,'NiCu'),'NiCu');
    if(T0.gte(500))throw new CalcError('E_OUT_OF_RANGE','preheat must be below 500 °C for t8/5 calculation');
    const gross=V.times(I).times(60).div(travel).div(1000),net=gross.times(eta),ce=C.plus(Mn.div(6)).plus(CrMoV.div(5)).plus(NiCu.div(15));
    const qJmm=net.times(1000),lambdaWmm=lambda.div(1000),thermalTerm=D(1).div(D(500).minus(T0)).minus(D(1).div(D(800).minus(T0))),t85=qJmm.div(PI().times(2).times(lambdaWmm)).times(thermalTerm);const warnings:WarningItem[]=[];
    if(t.lt(12))warnings.push(w('warning','Thin-plate boundary effects','Thickness below ~12 mm may invalidate the 3D Rosenthal approximation; use a 2D/finite-plate model or validated WPS data.'));
    if(ce.gt(CE_REVIEW_LIMIT))warnings.push(w('warning','High carbon equivalent',`IIW CE ${ce.times(100).toFixed(2)}% exceeds the 0.45% planning review threshold; preheat and hydrogen control require code/WPS review.`));
    if(net.lt(.3))warnings.push(w('warning','Low net heat input',`${net.toFixed(3)} kJ/mm may increase HAZ cooling rate/hardness depending on chemistry and thickness.`));
    if(net.gt(2.5))warnings.push(w('warning','High net heat input',`${net.toFixed(3)} kJ/mm may widen HAZ, reduce toughness and increase distortion.`));
    if(t85.lt(3)||t85.gt(40))warnings.push(w('warning','t8/5 outside common steel procedure window',`Estimated t8/5 = ${t85.toFixed(1)} s. Confirm against consumable/steel procedure limits.`));
    return{outputs:[o('grossHeat','Gross arc heat input',gross,'kJ/mm',3),o('netHeat','Net heat input',net,'kJ/mm',3,'Includes thermal efficiency',true),o('t85','Estimated t8/5 cooling time',t85,'s',2,'Rosenthal 3D approximation',true),o('ce','IIW carbon equivalent',ce.times(100),'%',3,true,ce.div(CE_REVIEW_LIMIT)),o('energyPerPass','Net energy over 1 m weld',net.times(1000),'kJ/m',1),o('heatPerThickness','Heat input / thickness',net.div(t),'kJ/mm²',4)],warnings,formulas:this.formulas,assumptions:this.assumptions};
  }
};
