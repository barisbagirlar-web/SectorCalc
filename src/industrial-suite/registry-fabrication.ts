import { D, Decimal, CalcError } from '../core/engine.js';
import { ToolDefinition, CanonicalInput, numberValue as n, selectValue as s, output as o, warning as w, decimalPi as PI, sinDeg, tanDeg } from './engine.js';

const positive = (x: Decimal, name: string): Decimal => { if (x.lte(0)) throw new CalcError('E_NON_POSITIVE', `${name} must be > 0`); return x; };
const nonNegative = (x: Decimal, name: string): Decimal => { if (x.lt(0)) throw new CalcError('E_NEGATIVE', `${name} must be >= 0`); return x; };

const SC029: ToolDefinition = {
  code:'SC-029', slug:'weld-heat-input-pro', name:'Weld Heat Input & t8/5 Cooling Estimate', category:'Welding & Fabrication',
  standard:'ISO/TR 17671 heat-input practice · IIW carbon-equivalent convention · Rosenthal thick-plate cooling approximation', engineVersion:'SC029-UEK-1.0.0',
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
    {kind:'number',id:'C',label:'Carbon C',defaultValue:.18,step:.01,family:'percent',defaultUnit:'pct',min:0,max:.03,reference:'Mass fraction; 0.18% = 0.0018 ratio when using % selector.'},
    {kind:'number',id:'Mn',label:'Manganese Mn',defaultValue:1.2,step:.05,family:'percent',defaultUnit:'pct',min:0,max:.05,reference:'Mass fraction from mill certificate / chemistry.'},
    {kind:'number',id:'CrMoV',label:'Cr + Mo + V',defaultValue:.3,step:.05,family:'percent',defaultUnit:'pct',min:0,max:.1,reference:'Combined mass fraction for IIW CE term.'},
    {kind:'number',id:'NiCu',label:'Ni + Cu',defaultValue:.2,step:.05,family:'percent',defaultUnit:'pct',min:0,max:.1,reference:'Combined mass fraction for IIW CE term.'}
  ],
  formulas:['Gross heat input H = V·I·60/(1000·travel) [kJ/mm]','Net heat input Q = η·H','IIW CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15','Rosenthal thick-plate t8/5 ≈ Q_J/mm/(2πλ_W/mmK)·[1/(500−T0) − 1/(800−T0)]'],
  assumptions:['t8/5 is a 3D thick-plate Rosenthal estimate, not a code-certified substitute for procedure qualification or finite-element thermal analysis.','Material properties are treated constant over the 800→500 °C interval; phase transformations, latent heat, convection and multi-pass reheating are omitted.','Chemistry inputs are mass fractions after unit normalization; use the mill certificate for production decisions.'],
  sensitivity:{inputId:'travel',outputId:'t85',spanPct:25},
  calculate(input:CanonicalInput){
    const V=positive(n(input,'voltage'),'voltage'), I=positive(n(input,'current'),'current'), travel=positive(n(input,'travel'),'travel'), eta=positive(n(input,'efficiency'),'efficiency'), t=positive(n(input,'thickness'),'thickness'), T0=n(input,'preheat'), lambda=positive(n(input,'conductivity'),'conductivity');
    const C=nonNegative(n(input,'C'),'C'), Mn=nonNegative(n(input,'Mn'),'Mn'), CrMoV=nonNegative(n(input,'CrMoV'),'CrMoV'), NiCu=nonNegative(n(input,'NiCu'),'NiCu');
    if(T0.gte(500)) throw new CalcError('E_OUT_OF_RANGE','preheat must be below 500 °C for t8/5 calculation');
    const gross=V.times(I).times(60).div(travel).div(1000); const net=gross.times(eta); const ce=C.plus(Mn.div(6)).plus(CrMoV.div(5)).plus(NiCu.div(15));
    const qJmm=net.times(1000), lambdaWmm=lambda.div(1000); const thermalTerm=D(1).div(D(500).minus(T0)).minus(D(1).div(D(800).minus(T0))); const t85=qJmm.div(PI().times(2).times(lambdaWmm)).times(thermalTerm);
    const warns=[]; if(t.lt(12)) warns.push(w('warning','Thin-plate boundary effects','Thickness below ~12 mm may invalidate the 3D Rosenthal approximation; use a 2D/finite-plate model or validated WPS data.')); if(ce.gt(.45)) warns.push(w('warning','High carbon equivalent',`IIW CE ${(ce.times(100)).toFixed(2)}% indicates elevated hardenability/hydrogen-cracking sensitivity; preheat and hydrogen control require code/WPS review.`)); if(net.lt(.3)) warns.push(w('warning','Low net heat input',`${net.toFixed(3)} kJ/mm may increase HAZ cooling rate/hardness depending on chemistry and thickness.`)); if(net.gt(2.5)) warns.push(w('warning','High net heat input',`${net.toFixed(3)} kJ/mm may widen HAZ, reduce toughness and increase distortion.`)); if(t85.lt(3)||t85.gt(40)) warns.push(w('warning','t8/5 outside common steel procedure window',`Estimated t8/5 = ${t85.toFixed(1)} s. Confirm against consumable/steel procedure limits.`));
    return {outputs:[o('grossHeat','Gross arc heat input',gross,'kJ/mm',3),o('netHeat','Net heat input',net,'kJ/mm',3,'Includes thermal efficiency',true),o('t85','Estimated t8/5 cooling time',t85,'s',2,'Rosenthal 3D approximation',true),o('ce','IIW carbon equivalent',ce.times(100),'%',3,true,ce.div(.45)),o('energyPerPass','Net energy over 1 m weld',net.times(1000),'kJ/m',1),o('heatPerThickness','Heat input / thickness',net.div(t),'kJ/mm²',4)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

const SC030: ToolDefinition = {
  code:'SC-030', slug:'sheet-bend-pro', name:'Sheet Metal Bend Allowance / Deduction / Flat Pattern', category:'Welding & Fabrication', standard:'Neutral-axis K-factor geometry · press-brake flat-pattern practice', engineVersion:'SC030-UEK-1.0.0',
  summary:'Calculates bend allowance, outside setback, bend deduction and flat length with K-factor, inside radius and angle sensitivity.', decision:'Release flat-pattern dimensions with a visible neutral-axis assumption and detect impossible radius/thickness combinations before cutting blanks.',
  fields:[
    {kind:'number',id:'thickness',label:'Material thickness',defaultValue:2,step:.1,family:'length',defaultUnit:'mm',min:.05,max:100,reference:'Use actual measured sheet thickness where flat-pattern accuracy matters.'},
    {kind:'number',id:'radius',label:'Inside bend radius',defaultValue:2,step:.1,family:'length',defaultUnit:'mm',min:.01,max:500,reference:'Use achieved inside radius from tooling/material, not punch nose alone.'},
    {kind:'number',id:'angle',label:'Included bend angle',defaultValue:90,step:1,family:'angle',defaultUnit:'deg',min:1,max:179,reference:'Angle through which the material bends; 90° for a right-angle bend.'},
    {kind:'number',id:'kfactor',label:'K-factor',defaultValue:.33,step:.01,family:'percent',defaultUnit:'ratio',min:.1,max:.6,reference:'Typical air-bending planning range ~0.30–0.45; calibrate from coupons.'},
    {kind:'number',id:'legA',label:'Outside leg A',defaultValue:50,step:.5,family:'length',defaultUnit:'mm',min:.1,max:10000,reference:'Outside tangent-to-edge dimension.'},
    {kind:'number',id:'legB',label:'Outside leg B',defaultValue:40,step:.5,family:'length',defaultUnit:'mm',min:.1,max:10000,reference:'Outside tangent-to-edge dimension.'},
    {kind:'number',id:'minRadiusRatio',label:'Minimum R/t guideline',defaultValue:.5,step:.1,family:'percent',defaultUnit:'ratio',min:.05,max:10,reference:'Material/process-specific minimum radius ratio; verify supplier forming limits.'}
  ],
  formulas:['BA = θrad·(R + K·t)','OSSB = tan(θ/2)·(R+t)','BD = 2·OSSB − BA','Flat = A + B − BD'],
  assumptions:['Single bend, constant thickness and constant K-factor through the bend.','Springback changes final angle/radius but not automatically the calibrated flat-pattern K-factor.','Hem, jog, coined bend and multi-bend interaction require separate tooling allowances.'], sensitivity:{inputId:'kfactor',outputId:'flat',spanPct:25},
  calculate(input){
    const t=positive(n(input,'thickness'),'thickness'), R=positive(n(input,'radius'),'radius'), angle=positive(n(input,'angle'),'angle'), K=positive(n(input,'kfactor'),'kfactor'), A=positive(n(input,'legA'),'legA'), B=positive(n(input,'legB'),'legB'), minRt=positive(n(input,'minRadiusRatio'),'minRadiusRatio');
    const rad=angle.times(PI()).div(180), BA=rad.times(R.plus(K.times(t))), ossb=tanDeg(angle.div(2)).times(R.plus(t)), BD=ossb.times(2).minus(BA), flat=A.plus(B).minus(BD), rt=R.div(t); const warns=[];
    if(K.lt(.2)||K.gt(.5)) warns.push(w('warning','K-factor outside common air-bend range',`K = ${K.toFixed(3)} needs coupon-derived evidence for production flat patterns.`)); if(rt.lt(minRt)) warns.push(w('warning','Inside radius below entered forming guideline',`R/t = ${rt.toFixed(2)} < ${minRt.toFixed(2)}; cracking or excessive thinning risk.`)); if(flat.lte(0)) warns.push(w('error','Flat length invalid','Bend deduction exceeds entered outside legs; verify geometry/angle convention.'));
    return {outputs:[o('flat','Flat blank length',flat,'mm',3,'Single-bend flat length',true),o('ba','Bend allowance',BA,'mm',3),o('ossb','Outside setback',ossb,'mm',3),o('bd','Bend deduction',BD,'mm',3),o('rt','Inside radius / thickness',rt,'R/t',3,true,minRt.div(rt)),o('neutralRadius','Neutral-axis radius',R.plus(K.times(t)),'mm',3)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

const SC031: ToolDefinition = {
  code:'SC-031', slug:'sling-capacity-pro', name:'Sling Capacity, Angle & Leg-Tension Verification', category:'Lifting & Rigging', standard:'Multi-leg statics with conservative 3-leg load sharing for 3/4-leg assemblies', engineVersion:'SC031-UEK-1.0.0',
  summary:'Computes factored lifted load, effective load-bearing legs, per-leg tension, vertical component and WLL utilization with sling-angle and center-of-gravity factors.', decision:'Reject rigging arrangements that hide dangerous angle amplification or assume all four legs share load equally.',
  fields:[
    {kind:'number',id:'load',label:'Lifted load',defaultValue:20,step:.5,family:'force',defaultUnit:'kN',min:.01,max:10000000,reference:'Include lifted object, below-hook devices and attached fixtures.'},
    {kind:'select',id:'legs',label:'Sling legs',defaultValue:'2',options:[{value:'1',label:'1 leg'},{value:'2',label:'2 legs'},{value:'3',label:'3 legs'},{value:'4',label:'4 legs — conservatively 3 effective'}],reference:'Unless engineered equalization exists, a 4-leg assembly is commonly rated assuming only 3 legs carry.'},
    {kind:'number',id:'angle',label:'Sling angle from horizontal',defaultValue:60,step:1,family:'angle',defaultUnit:'deg',min:5,max:90,reference:'Lower angle = sharply higher leg tension. Avoid <30° unless specifically engineered.'},
    {kind:'number',id:'daf',label:'Dynamic / impact factor',defaultValue:1.15,step:.05,family:'percent',defaultUnit:'ratio',min:1,max:4,reference:'Account for hoist acceleration, snatch, vessel motion or uncertain handling.'},
    {kind:'number',id:'cog',label:'COG / unequal-share factor',defaultValue:1.10,step:.05,family:'percent',defaultUnit:'ratio',min:1,max:3,reference:'>1.0 penalizes unequal load distribution from center-of-gravity offset or leg-length mismatch.'},
    {kind:'number',id:'legWll',label:'WLL per sling leg',defaultValue:15,step:.5,family:'force',defaultUnit:'kN',min:.01,max:10000000,reference:'Use tagged WLL for the exact sling type, hitch, D/d and temperature condition.'}
  ],
  formulas:['Wdesign = W·DAF·COGfactor','Effective legs = 1,2,3,3 for 1,2,3,4-leg assemblies','Tleg = Wdesign/(Neff·sin θ)','Utilization = Tleg/WLL'],
  assumptions:['Symmetric geometry at the stated common sling angle.','Four-leg assemblies are conservatively evaluated with three effective load-bearing legs unless engineered equalization proves otherwise.','Hitch derating, D/d bending reduction, temperature/chemical degradation and hardware WLL must already be reflected in the entered leg WLL.'], sensitivity:{inputId:'angle',outputId:'util',spanPct:25},
  calculate(input){
    const load=positive(n(input,'load'),'load'), legs=Number(s(input,'legs')), angle=n(input,'angle'), daf=positive(n(input,'daf'),'daf'), cog=positive(n(input,'cog'),'cog'), wll=positive(n(input,'legWll'),'legWll'); if(!Number.isInteger(legs)||legs<1||legs>4) throw new CalcError('E_INVALID_INPUT','legs invalid');
    const effective=legs===4?3:legs, sin=sinDeg(angle); if(sin.lte(0)) throw new CalcError('E_DOMAIN','sling angle produces zero vertical component'); const design=load.times(daf).times(cog), tension=design.div(D(effective).times(sin)), util=tension.div(wll); const warns=[];
    if(angle.lt(30)) warns.push(w('error','Sling angle below 30°','Leg tension amplification is extreme; redesign rigging geometry unless a qualified lift plan explicitly permits it.')); else if(angle.lt(45)) warns.push(w('warning','Low sling angle',`Angle ${angle.toFixed(1)}° materially amplifies leg tension.`)); if(util.gt(1)) warns.push(w('error','Sling WLL exceeded',`Per-leg demand ${tension.toFixed(1)} N exceeds entered WLL ${wll.toFixed(1)} N.`)); else if(util.gt(.8)) warns.push(w('warning','Low WLL reserve',`Sling utilization ${util.times(100).toFixed(1)}%.`)); if(legs===4) warns.push(w('info','Four-leg conservative sharing','Engine assumes only three legs carry load; this avoids unsafe equal-share credit.'));
    return {outputs:[o('designLoad','Factored lifted load',design,'N',1),o('effectiveLegs','Effective load-bearing legs',D(effective),'legs',0),o('legTension','Maximum modeled leg tension',tension,'N',1,true,util),o('verticalPerLeg','Vertical component / effective leg',design.div(effective),'N',1),o('angleFactor','Angle amplification 1/sinθ',D(1).div(sin),'×',3),o('util','Sling WLL utilization',util.times(100),'%',1,true,util)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

function sideLoadFactor(angle:Decimal):Decimal{
  const a=angle.abs();
  if(a.lte(5)) return D(1);
  if(a.lte(45)) return D(1).minus(a.minus(5).div(40).times('.30'));
  if(a.lte(90)) return D('.70').minus(a.minus(45).div(45).times('.20'));
  return D('.5');
}
const SC032: ToolDefinition = {
  code:'SC-032', slug:'shackle-eyebolt-pro', name:'Shackle & Eye-Bolt Load-Path Verification', category:'Lifting & Rigging', standard:'Manufacturer-WLL based load-path model with generic shackle side-load screening', engineVersion:'SC032-UEK-1.0.0',
  summary:'Checks per-point factored demand against shackle and lifting-point capacity while making side-load, sling-angle, center-of-gravity and manufacturer derating explicit.', decision:'Prevent the common failure of dividing load by point count while ignoring sling angle, COG, side loading and hardware derating.',
  fields:[
    {kind:'number',id:'load',label:'Lifted load',defaultValue:30,step:.5,family:'force',defaultUnit:'kN',min:.01,max:10000000,reference:'Total suspended load including lifting frame/attachments.'},
    {kind:'number',id:'points',label:'Effective lifting points',defaultValue:2,step:1,family:'count',defaultUnit:'count',min:1,max:8,reference:'Use effective points actually sharing load; do not assume redundant points carry equally.'},
    {kind:'number',id:'slingAngle',label:'Sling angle from horizontal',defaultValue:60,step:1,family:'angle',defaultUnit:'deg',min:5,max:90,reference:'Controls axial demand at each lift point.'},
    {kind:'number',id:'daf',label:'Dynamic factor',defaultValue:1.15,step:.05,family:'percent',defaultUnit:'ratio',min:1,max:4,reference:'Hoist acceleration / impact / motion factor.'},
    {kind:'number',id:'cog',label:'COG unequal-share factor',defaultValue:1.15,step:.05,family:'percent',defaultUnit:'ratio',min:1,max:3,reference:'Penalty for offset COG and unequal sling lengths.'},
    {kind:'number',id:'shackleWll',label:'Shackle tagged WLL',defaultValue:20,step:.5,family:'force',defaultUnit:'kN',min:.01,max:10000000,reference:'Exact manufacturer/model/size WLL in straight pull.'},
    {kind:'number',id:'sideAngle',label:'Shackle side-load angle',defaultValue:0,step:1,family:'angle',defaultUnit:'deg',min:0,max:90,reference:'Generic screen: 0–5° no reduction; 45° ~70%; 90° ~50%. Manufacturer chart overrides this.'},
    {kind:'number',id:'liftPointWll',label:'Eye bolt / lifting-point WLL',defaultValue:20,step:.5,family:'force',defaultUnit:'kN',min:.01,max:10000000,reference:'Use exact manufacturer WLL for the actual loading direction.'},
    {kind:'number',id:'liftPointDerate',label:'Manufacturer lifting-point derating',defaultValue:100,step:5,family:'percent',defaultUnit:'pct',min:.01,max:1,reference:'Enter manufacturer angle/orientation derating. Engine intentionally does not invent an eye-bolt angle table.'},
    {kind:'number',id:'tempDerate',label:'Temperature / environment derating',defaultValue:100,step:5,family:'percent',defaultUnit:'pct',min:.01,max:1,reference:'Enter manufacturer-approved remaining capacity after temperature/environment effects.'}
  ],
  formulas:['Point demand = W·DAF·COG/(N·sin θ)','Generic shackle side-load factor interpolates 1.00 @5°, 0.70 @45°, 0.50 @90°','Shackle capacity = WLL·sideFactor·tempFactor','Lifting-point capacity = WLL·manufacturerDerate·tempFactor','Governing utilization = demand/min(capacities)'],
  assumptions:['Generic shackle side-load factors are screening values only; exact manufacturer instructions are authoritative.','No generic eye-bolt angle derating is guessed. The entered manufacturer derating factor is mandatory for non-axial use.','Thread engagement, padeye plate checks, pin bending, bearing stress and weld design are separate failure modes.'], sensitivity:{inputId:'slingAngle',outputId:'util',spanPct:25},
  calculate(input){
    const load=positive(n(input,'load'),'load'), points=positive(n(input,'points'),'points'), theta=n(input,'slingAngle'), daf=positive(n(input,'daf'),'daf'), cog=positive(n(input,'cog'),'cog'), shW=positive(n(input,'shackleWll'),'shackleWll'), side=n(input,'sideAngle'), lpW=positive(n(input,'liftPointWll'),'liftPointWll'), lpD=positive(n(input,'liftPointDerate'),'liftPointDerate'), temp=positive(n(input,'tempDerate'),'tempDerate');
    const sin=sinDeg(theta); if(sin.lte(0)) throw new CalcError('E_DOMAIN','invalid sling angle'); const demand=load.times(daf).times(cog).div(points.times(sin)), sideF=sideLoadFactor(side), shCap=shW.times(sideF).times(temp), lpCap=lpW.times(lpD).times(temp), gov=Decimal.min(shCap,lpCap), util=demand.div(gov); const warns=[];
    if(theta.lt(30)) warns.push(w('error','Sling angle below 30°','Redesign geometry; point demand amplification is excessive.')); if(side.gt(5)) warns.push(w('warning','Shackle side loading present',`Generic side-load factor = ${sideF.toFixed(3)}. Replace with exact manufacturer chart before lift-plan approval.`)); if(lpD.eq(1)&&theta.lt(90)) warns.push(w('warning','Lifting-point angular derating not entered','Non-vertical load with 100% lifting-point factor is unsafe unless the manufacturer explicitly rates full WLL at this angle.')); if(util.gt(1)) warns.push(w('error','Hardware capacity exceeded',`Governing utilization ${util.times(100).toFixed(1)}%.`)); else if(util.gt(.75)) warns.push(w('warning','Hardware reserve below 25%',`Governing utilization ${util.times(100).toFixed(1)}%.`));
    return {outputs:[o('pointDemand','Factored demand per point',demand,'N',1,true,util),o('shackleFactor','Shackle side-load factor',sideF,'×',3),o('shackleCapacity','Derated shackle capacity',shCap,'N',1),o('liftPointCapacity','Derated lifting-point capacity',lpCap,'N',1),o('governingCapacity','Governing point capacity',gov,'N',1),o('util','Governing utilization',util.times(100),'%',1,true,util)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

export const FABRICATION_TOOLS: readonly ToolDefinition[] = [SC029,SC030,SC031,SC032];
