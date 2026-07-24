import { D, Decimal, CalcError } from '../core/engine.js';
import { numberValue as n, selectValue as s, output as o, warning as w } from './engine.js';
import type { CanonicalInput, ToolDefinition } from './engine.js';

type BearingFamily='ball'|'roller'|'thrustBall'|'thrustRoller';
const ISO:Record<BearingFamily,{psi:string;b0:[string,string,string];m:[string,string,string];w:string;ce:string;b1:string;p:string}>={
  ball:{psi:'2.5671',b0:['2.2649','1.9987','1.9987'],m:['0.054381','0.19087','0.071739'],w:'0.3333333333333333',ce:'9.185',b1:'1',p:'3'},
  roller:{psi:'1.5859',b0:['1.3993','1.2348','1.2348'],m:['0.054381','0.19087','0.071739'],w:'0.4',ce:'9.185',b1:'1',p:'3.3333333333333333'},
  thrustBall:{psi:'2.5671',b0:['2.2649','1.9987','1.9987'],m:['0.054381','0.19087','0.071739'],w:'0.3333333333333333',ce:'9.3',b1:'3',p:'3'},
  thrustRoller:{psi:'1.5859',b0:['1.3993','1.2348','1.2348'],m:['0.054381','0.19087','0.071739'],w:'0.4',ce:'9.185',b1:'2.5',p:'3.3333333333333333'}
};
const TYPE:Record<string,BearingFamily>={dgbb:'ball',acbb:'ball',crb:'roller',srb:'roller',trb:'roller',tbb:'thrustBall',trrb:'thrustRoller'};
const DGBB:[number,number,number][]=[[.014,.19,2.30],[.028,.22,1.99],[.056,.26,1.71],[.084,.28,1.55],[.11,.30,1.45],[.17,.34,1.31],[.28,.38,1.15],[.42,.42,1.04],[.56,.44,1.00]];

function positive(x:Decimal,name:string):Decimal{if(x.lte(0))throw new CalcError('E_NON_POSITIVE',`${name} must be > 0`);return x;}
function nonNegative(x:Decimal,name:string):Decimal{if(x.lt(0))throw new CalcError('E_NEGATIVE',`${name} must be >= 0`);return x;}
function interpDgbb(r:Decimal):{e:Decimal;Y:Decimal}{
  const x=r.toNumber();
  if(x<=DGBB[0]![0])return{e:D(DGBB[0]![1]),Y:D(DGBB[0]![2])};
  for(let i=1;i<DGBB.length;i++){
    const cur=DGBB[i]!,prev=DGBB[i-1]!;
    if(x<=cur[0]){
      const t=(x-prev[0])/(cur[0]-prev[0]);
      return{e:D(String(prev[1]+t*(cur[1]-prev[1]))),Y:D(String(prev[2]+t*(cur[2]-prev[2])))};
    }
  }
  const last=DGBB[DGBB.length-1]!;
  return{e:D(last[1]),Y:D(last[2])};
}

function aiso(fam:BearingFamily,kRaw:Decimal,eC:Decimal,Cu:Decimal,P:Decimal):{value:Decimal;limited:boolean}{
  const c=ISO[fam];
  const k=Decimal.min(Decimal.max(kRaw,D('.1')),D(4));
  const band=k.lt('.4')?0:k.lt(1)?1:2;
  const b0=D(c.b0[band]!),m=D(c.m[band]!),psi=D(c.psi),w=D(c.w),ce=D(c.ce),b1=D(c.b1);
  const kTerm=Decimal.max(psi.minus(b0.div(k.pow(m))),D(0));
  const x=eC.times(Cu).div(b1.times(P));
  const modifier=kTerm.pow(D('2.5').times(w)).times(x.pow(w));
  if(modifier.gte(1)) return {value:D(50),limited:true};
  const raw=D('.1').times(D(1).minus(modifier).pow(ce.neg()));
  if(!raw.isFinite()||raw.gt(50)) return {value:D(50),limited:true};
  return {value:Decimal.max(raw,D('.1')),limited:false};
}

export const SC021_BEARING:ToolDefinition={
  code:'SC-021',slug:'bearing-pro',name:'Bearing Life L10 / Lnm — ISO 281',category:'Rotating Equipment & Reliability',
  standard:'ISO 281:2007 basic and modified rating life · ISO 76 static-load screening',engineVersion:'SC021-DECIMAL-2.1.0',
  summary:'Catalog-driven bearing life engine with equivalent load, L10, reliability factor a1, viscosity ratio κ, contamination/fatigue-limit modification aISO, static safety and speed-life diagnostics.',
  decision:'Accept a bearing only when modified rating life, lubrication regime and static safety pass using exact catalog C/C0/Cu and operating viscosity.',
  fields:[
    {kind:'select',id:'type',label:'Bearing type',defaultValue:'dgbb',options:[{value:'dgbb',label:'Deep-groove ball'},{value:'acbb',label:'Angular-contact ball'},{value:'crb',label:'Cylindrical roller'},{value:'srb',label:'Spherical roller'},{value:'trb',label:'Tapered roller'},{value:'tbb',label:'Thrust ball'},{value:'trrb',label:'Thrust roller'}],reference:'Selects point/line-contact exponents and equivalent-load model.'},
    {kind:'number',id:'d',label:'Bearing bore d',defaultValue:40,step:1,family:'length',defaultUnit:'mm',min:1,max:2000,reference:'Exact catalog bore.'},
    {kind:'number',id:'D',label:'Bearing outside diameter D',defaultValue:80,step:1,family:'length',defaultUnit:'mm',min:2,max:4000,reference:'Exact catalog OD; dm=(d+D)/2 drives reference viscosity.'},
    {kind:'number',id:'C',label:'Dynamic rating C',defaultValue:40.5,step:.1,family:'force',defaultUnit:'kN',min:1,max:100000000,reference:'Exact manufacturer dynamic rating.'},
    {kind:'number',id:'C0',label:'Static rating C0',defaultValue:24,step:.1,family:'force',defaultUnit:'kN',min:1,max:100000000,reference:'Exact manufacturer static rating.'},
    {kind:'number',id:'Cu',label:'Fatigue load limit Cu',defaultValue:1,step:.05,family:'force',defaultUnit:'kN',min:.01,max:100000000,reference:'Exact catalog fatigue load limit; do not infer for final release.'},
    {kind:'number',id:'Fr',label:'Radial load Fr',defaultValue:5,step:.1,family:'force',defaultUnit:'kN',min:0,max:100000000,reference:'Resultant radial bearing load.'},
    {kind:'number',id:'Fa',label:'Axial load Fa',defaultValue:1,step:.1,family:'force',defaultUnit:'kN',min:0,max:100000000,reference:'Resultant axial bearing load.'},
    {kind:'number',id:'e',label:'Catalog e factor',defaultValue:.35,step:.01,family:'percent',defaultUnit:'ratio',min:.05,max:2,reference:'Used for spherical/tapered roller combined load; enter catalog value.'},
    {kind:'number',id:'Y',label:'Catalog Y factor',defaultValue:1.9,step:.05,family:'percent',defaultUnit:'ratio',min:.1,max:10,reference:'Used for spherical/tapered roller combined load; enter catalog value.'},
    {kind:'number',id:'rpm',label:'Speed',defaultValue:1500,step:10,family:'rpm',defaultUnit:'rpm',min:1,max:100000,reference:'Operating speed; separately verify catalog limiting/reference speed.'},
    {kind:'number',id:'requiredHours',label:'Required life',defaultValue:15000,step:500,family:'time',defaultUnit:'h',min:1,max:1000000000,reference:'Target service life in operating hours.'},
    {kind:'select',id:'a1',label:'Reliability factor a1',defaultValue:'1',options:[{value:'1',label:'90% — 1.000'},{value:'.64',label:'95% — 0.640'},{value:'.55',label:'96% — 0.550'},{value:'.47',label:'97% — 0.470'},{value:'.37',label:'98% — 0.370'},{value:'.25',label:'99% — 0.250'},{value:'.22',label:'99.2% — 0.220'},{value:'.19',label:'99.4% — 0.190'},{value:'.16',label:'99.6% — 0.160'},{value:'.12',label:'99.8% — 0.120'},{value:'.093',label:'99.9% — 0.093'},{value:'.077',label:'99.95% — 0.077'}],reference:'ISO 281 reliability adjustment.'},
    {kind:'number',id:'nuOp',label:'Operating kinematic viscosity',defaultValue:12,step:.5,family:'count',defaultUnit:'count',min:.1,max:10000,reference:'cSt (mm²/s) at bearing operating temperature from lubricant data or measurement.'},
    {kind:'select',id:'eC',label:'Contamination factor eC',defaultValue:'.55',options:[{value:'1',label:'Extreme cleanliness — 1.00'},{value:'.7',label:'High cleanliness — 0.70'},{value:'.55',label:'Normal cleanliness — 0.55'},{value:'.4',label:'Slight contamination — 0.40'},{value:'.2',label:'Typical contamination — 0.20'},{value:'.05',label:'Severe contamination — 0.05'}],reference:'ISO 281 planning contamination factor; exact application refinement may apply.'}
  ],
  formulas:['P = X·Fr + Y·Fa using type-specific equivalent-load factors','L10 = (C/P)^p million revolutions; p=3 ball, 10/3 roller','L10h = L10·10^6/(60n)','ν1 = 45000·n^−0.83·dm^−0.5 for n<1000 rpm; 4500·n^−0.5·dm^−0.5 for n≥1000 rpm','κ = ν/ν1, limited to 0.1…4 only inside the aISO equation','aISO = 0.1·[1 − (ψ − b0/κ^m)^(2.5w)·(eC·Cu/(b1P))^w]^−ce, capped at 50','Lnm = a1·aISO·L10','s0 = C0/P0'],
  assumptions:['Catalog ratings C, C0 and Cu belong to the exact bearing part number.','Direct operating viscosity is used to avoid a hidden viscosity-temperature model.','Equivalent static-load factors are screening approximations for several bearing families; exact catalog X0/Y0 values govern final release.','ISO 281 rating life does not model misalignment, preload error, edge stress, cage limits, variable load spectra or high-speed centrifugal/gyroscopic effects.'],
  sensitivity:{inputId:'Fr',outputId:'LnmHours',spanPct:25},
  calculate(input:CanonicalInput){
    const type=s(input,'type'),fam=TYPE[type];
    if(!fam)throw new CalcError('E_INVALID_INPUT','unknown bearing type');
    const d=positive(n(input,'d'),'d'),Do=positive(n(input,'D'),'D'),C=positive(n(input,'C'),'C'),C0=positive(n(input,'C0'),'C0'),Cu=positive(n(input,'Cu'),'Cu'),Fr=nonNegative(n(input,'Fr'),'Fr'),Fa=nonNegative(n(input,'Fa'),'Fa'),eIn=positive(n(input,'e'),'e'),YIn=positive(n(input,'Y'),'Y'),rpm=positive(n(input,'rpm'),'rpm'),reqSec=positive(n(input,'requiredHours'),'requiredHours'),a1=D(s(input,'a1')),nu=positive(n(input,'nuOp'),'nuOp'),eC=D(s(input,'eC'));
    if(Do.lte(d))throw new CalcError('E_DIMENSION_MISMATCH','outside diameter must exceed bore');
    const warnings=[];
    let P:Decimal,P0:Decimal;
    const ratio=Fa.div(Fr.gt(0)?Fr:D('1e-30'));
    if(type==='tbb'||type==='trrb'){
      P=Fa;P0=Fa;if(Fr.gt(0))warnings.push(w('warning','Radial load on thrust bearing','Pure thrust bearing life model ignores Fr; provide a separate radial bearing for the radial load.'));
    }else if(type==='crb'){
      P=Fr;P0=Fr;if(Fa.gt(Fr.times('.05')))warnings.push(w('warning','Axial load on cylindrical roller bearing','Verify the exact NU/NJ/NUP design or use a bearing family intended for the axial load.'));
    }else if(type==='dgbb'){
      const xy=interpDgbb(Fa.div(C0));P=ratio.lte(xy.e)?Fr:Fr.times('.56').plus(xy.Y.times(Fa));P0=Decimal.max(Fr,Fr.times('.6').plus(Fa.times('.5')));
    }else if(type==='acbb'){
      P=ratio.lte('.68')?Fr:Fr.times('.41').plus(Fa.times('.87'));P0=Decimal.max(Fr,Fr.times('.5').plus(Fa.times('.46')));
    }else{
      P=ratio.lte(eIn)?Fr:(type==='srb'?Fr.times('.67'):Fr.times('.4')).plus(YIn.times(Fa));P0=Decimal.max(Fr,Fr.times('.5').plus(Fa.times('.5')));
    }
    if(P.lte(0)||P0.lte(0))throw new CalcError('E_NON_POSITIVE','equivalent bearing load must be positive');
    const p=D(ISO[fam].p),L10=C.div(P).pow(p),L10h=L10.times(1e6).div(rpm.times(60)),dm=d.plus(Do).div(2);
    const nu1=rpm.lt(1000)?D(45000).times(rpm.pow('-.83')).times(dm.pow('-.5')):D(4500).times(rpm.pow('-.5')).times(dm.pow('-.5'));
    const kappa=nu.div(nu1),ai=aiso(fam,kappa,eC,Cu,P),Lnm=L10.times(a1).times(ai.value),Lnmh=Lnm.times(1e6).div(rpm.times(60)),s0=C0.div(P0),reqH=reqSec.div(3600),lifeRatio=Lnmh.div(reqH),ndm=rpm.times(dm);
    if(kappa.lt('.1'))warnings.push(w('error','Viscosity ratio below ISO model floor',`κ=${kappa.toFixed(3)} < 0.1; the aISO equation is outside its validated range.`));
    else if(kappa.lt(1))warnings.push(w('warning','Lubrication film below reference',`κ=${kappa.toFixed(2)} < 1; modified life is lubrication-sensitive.`));
    else if(kappa.gt(4))warnings.push(w('info','Viscosity ratio above aISO cap',`κ=${kappa.toFixed(2)} > 4; aISO uses κ=4 and additional viscosity can increase churning losses.`));
    if(s0.lt(1))warnings.push(w('error','Static safety below 1',`s0=${s0.toFixed(2)} indicates permanent-deformation risk.`));
    else if(s0.lt(2))warnings.push(w('warning','Low static reserve',`s0=${s0.toFixed(2)}; shock/vibration service may require more reserve.`));
    if(lifeRatio.lt(1))warnings.push(w('error','Modified life below requirement',`Lnmh=${Lnmh.toFixed(0)} h < required ${reqH.toFixed(0)} h.`));
    else if(lifeRatio.lt('1.25'))warnings.push(w('warning','Thin life margin',`Modified life margin is only ${lifeRatio.times(100).toFixed(0)}% of requirement.`));
    if(ndm.gt(500000))warnings.push(w('warning','High n·dm speed index','ISO 281 rating life alone is insufficient; verify limiting speed, cage, lubrication and manufacturer high-speed analysis.'));
    if(ai.limited)warnings.push(w('info','aISO capped at 50','Calculated life modification reached the engine model cap.'));
    return {outputs:[o('P','Equivalent dynamic load P',P,'N',1),o('L10Hours','Basic L10 life',L10h,'h',0,true),o('nu1','Reference viscosity ν1',nu1,'cSt',2),o('kappa','Viscosity ratio κ',kappa,'—',3,true,kappa.lt(1)?D(1).div(kappa):D(0)),o('aISO','Life modification aISO',ai.value,'—',3),o('LnmHours','Modified rating life Lnm',Lnmh,'h',0,'ISO 281 modified life',true,reqH.div(Lnmh)),o('lifeRatio','Life / requirement',lifeRatio,'×',2,true,D(1).div(lifeRatio)),o('s0','Static safety s0',s0,'—',2,true,D(1).div(s0)),o('ndm','Speed index n·dm',ndm,'mm/min',0)],warnings,formulas:this.formulas,assumptions:this.assumptions};
  }
};
