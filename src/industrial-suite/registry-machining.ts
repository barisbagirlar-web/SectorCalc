import { D, Decimal, CalcError } from '../core/engine.js';
import { ToolDefinition, CanonicalInput, numberValue as n, selectValue as s, output as o, warning as w, decimalPi as PI, cosDeg, expD } from './engine.js';

const positive = (x: Decimal, name: string): Decimal => { if (x.lte(0)) throw new CalcError('E_NON_POSITIVE', `${name} must be > 0`); return x; };
const nonNegative = (x: Decimal, name: string): Decimal => { if (x.lt(0)) throw new CalcError('E_NEGATIVE', `${name} must be >= 0`); return x; };

const SC022: ToolDefinition = {
  code:'SC-022', slug:'threading-pro', name:'Tap & Thread Milling Process Window', category:'Machining & Manufacturing',
  standard:'ISO metric / Unified 60° thread geometry · machine kinematic verification', engineVersion:'SC022-UEK-1.0.0',
  summary:'Deterministic tapping and thread-milling process-window calculator with thread engagement, pilot-size, helical path, feed synchronization and machine-limit verification.',
  decision:'Select a pilot diameter and cutting program that produces the required thread without overspeed, overfeed, geometry collision or excessive engagement.',
  fields:[
    {kind:'select',id:'method',label:'Process',defaultValue:'cutTap',options:[{value:'cutTap',label:'Cutting tap'},{value:'formTap',label:'Form / roll tap'},{value:'threadMill',label:'Internal thread mill'}],reference:'Cut taps remove chips; form taps displace material and require a larger pilot; thread mills interpolate helically.'},
    {kind:'number',id:'majorD',label:'Nominal thread diameter',defaultValue:10,step:.1,family:'length',defaultUnit:'mm',min:.5,max:300,reference:'Use nominal major diameter: M10 = 10 mm; 3/8-16 = 0.375 in.'},
    {kind:'number',id:'pitch',label:'Pitch per thread',defaultValue:1.5,step:.05,family:'length',defaultUnit:'mm',min:.05,max:20,reference:'Metric: pitch in mm. Unified: pitch = 1/TPI inches (16 TPI = 0.0625 in).'},
    {kind:'number',id:'pilotD',label:'Actual pilot / minor-hole diameter',defaultValue:8.5,step:.05,family:'length',defaultUnit:'mm',min:.2,max:300,reference:'Measure the drilled hole, not drill nominal. Cutting-tap starting estimate ≈ D − P.'},
    {kind:'number',id:'threadLength',label:'Thread length',defaultValue:18,step:.5,family:'length',defaultUnit:'mm',min:.2,max:1000,reference:'Axial full-thread length; exclude chamfer unless your cycle includes it.'},
    {kind:'number',id:'toolD',label:'Thread-mill cutter diameter',defaultValue:6,step:.1,family:'length',defaultUnit:'mm',min:.1,max:250,reference:'For internal thread milling cutter diameter must be smaller than the pilot hole.'},
    {kind:'number',id:'flutes',label:'Effective cutting flutes',defaultValue:4,step:1,family:'count',defaultUnit:'count',min:1,max:20,reference:'Use effective cutting edges participating in feed-per-tooth calculation.'},
    {kind:'number',id:'vc',label:'Cutting speed',defaultValue:70,step:1,family:'surfaceSpeed',defaultUnit:'mmin',min:1,max:1200,reference:'Start from tool-maker data for workpiece, coating and coolant.'},
    {kind:'number',id:'fz',label:'Feed per tooth (thread mill)',defaultValue:.035,step:.001,family:'length',defaultUnit:'mm',min:.0005,max:1,reference:'Thread milling only; use tool-maker chip-load range.'},
    {kind:'number',id:'maxRpm',label:'Machine spindle limit',defaultValue:12000,step:100,family:'rpm',defaultUnit:'rpm',min:10,max:100000,reference:'Programmed spindle must remain below machine/tool-holder limit.'},
    {kind:'number',id:'maxFeed',label:'Machine feed limit',defaultValue:10000,step:100,family:'linearSpeed',defaultUnit:'mmmin',min:10,max:100000,reference:'Use contouring feed limit, not rapid traverse rating.'}
  ],
  formulas:['H = 0.8660254·P (60° fundamental triangle)','Cut-tap pilot ≈ D − P; form-tap pilot ≈ D − 0.5P','Approx. thread engagement = 75·(D − pilot)/P [%]','n = 1000·Vc/(π·tool diameter)','Tap feed = P·n','Internal thread-mill center feed = fz·z·n·(Dpath/D)','Helix length = √[(π·Dpath·turns)² + L²]'],
  assumptions:['60° symmetric thread form; geometry is a process-planning model, not a substitute for tolerance-class gauges.','Thread engagement estimate is normalized so D−P corresponds to roughly 75% engagement; forming taps require manufacturer pilot charts.','Thread-mill feed correction is for internal interpolation at tool-center path; CNC control behavior and lead-in/out remain machine-specific.'],
  sensitivity:{inputId:'pilotD',outputId:'engagementPct',spanPct:8},
  calculate(input:CanonicalInput){
    const method=s(input,'method'), Dm=positive(n(input,'majorD'),'majorD'), P=positive(n(input,'pitch'),'pitch'), pilot=positive(n(input,'pilotD'),'pilotD'), L=positive(n(input,'threadLength'),'threadLength'), tool=positive(n(input,'toolD'),'toolD'), z=positive(n(input,'flutes'),'flutes'), vc=positive(n(input,'vc'),'vc'), fz=positive(n(input,'fz'),'fz'), maxRpm=positive(n(input,'maxRpm'),'maxRpm'), maxFeed=positive(n(input,'maxFeed'),'maxFeed');
    const warns=[];
    if (pilot.gte(Dm)) warns.push(w('error','Pilot diameter invalid','Pilot/minor hole must be smaller than nominal major diameter.'));
    if (P.gte(Dm.div(2))) warns.push(w('error','Pitch-to-diameter geometry invalid','Pitch is too large for the entered nominal diameter; check TPI/pitch units.'));
    const H=P.times('0.866025403784');
    const cutPilot=Dm.minus(P), formPilot=Dm.minus(P.times('.5'));
    const engagement=Dm.minus(pilot).div(P).times(75);
    if (engagement.lt(45)) warns.push(w('warning','Low thread engagement',`Estimated engagement ${engagement.toFixed(1)}% is below a common production window; verify stripping strength and gauge requirements.`));
    if (engagement.gt(85)) warns.push(w('warning','High thread engagement',`Estimated engagement ${engagement.toFixed(1)}% raises tapping torque, breakage and galling risk; verify pilot size against the tap maker chart.`));
    const diaForRpm=method==='threadMill'?tool:Dm;
    const rpm=vc.times(1000).div(PI().times(diaForRpm));
    if (rpm.gt(maxRpm)) warns.push(w('error','Spindle speed exceeds machine limit',`Required ${rpm.toFixed(0)} rpm > ${maxRpm.toFixed(0)} rpm.`));
    let feed:Decimal, cycle:Decimal, pathD=D(0), helix=D(0);
    if(method==='threadMill'){
      pathD=Dm.minus(tool);
      if(tool.gte(pilot)) warns.push(w('error','Thread mill cannot enter pilot','Tool diameter must be smaller than the actual pilot hole for internal interpolation.'));
      if(pathD.lte(0)) warns.push(w('error','Invalid helical path','Nominal diameter must exceed cutter diameter.'));
      const turns=L.div(P);
      helix=PI().times(pathD).times(turns).pow(2).plus(L.pow(2)).sqrt();
      const centerCorrection=pathD.div(Dm);
      feed=fz.times(z).times(rpm).times(centerCorrection);
      cycle=helix.div(feed).times(60);
    } else {
      feed=P.times(rpm);
      cycle=L.times(2).div(feed).times(60).plus('.25');
    }
    if(feed.gt(maxFeed)) warns.push(w('error','Feed exceeds contouring limit',`Required ${feed.toFixed(0)} mm/min > ${maxFeed.toFixed(0)} mm/min.`));
    const syncError=method==='threadMill'?D(0):feed.div(rpm).minus(P).abs();
    return {outputs:[o('engagementPct','Estimated thread engagement',engagement,'%',1,'Pilot-driven approximation',true,engagement.gt(85)?engagement.div(85):D(0)),o('recommendedPilot','Recommended starting pilot',method==='formTap'?formPilot:cutPilot,'mm',3,'Confirm with tool maker'),o('fundamentalH','60° fundamental triangle H',H,'mm',3),o('rpm','Program spindle speed',rpm,'rpm',0),o('feed','Program feed',feed,'mm/min',1,'Synchronized to pitch / cutter path'),o('cycle','Cut/retract cycle estimate',cycle,'s',2,'Excludes approach, probing and tool change'),o('pathD','Thread-mill center path diameter',method==='threadMill'?pathD:'—','mm',3),o('helixLength','Helical cutting-path length',method==='threadMill'?helix:'—','mm',2),o('syncError','Tap pitch synchronization error',method==='threadMill'?'—':syncError,'mm/rev',6)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

const SC023: ToolDefinition = {
  code:'SC-023', slug:'cycle-cost-pro', name:'Cycle Time & Cost per Good Part', category:'Machining & Manufacturing', standard:'Deterministic time-element costing · OEE-normalized capacity model', engineVersion:'SC023-UEK-1.0.0',
  summary:'Converts programmed cutting/rapid motions, tool changes, setup, availability, performance and scrap into effective cycle time, batch capacity and cost per conforming part.',
  decision:'Quote and schedule from effective good-part economics rather than ideal CAM cycle time.',
  fields:[
    {kind:'number',id:'cutLen',label:'Cutting path length',defaultValue:1800,step:10,family:'length',defaultUnit:'mm',min:0,max:10000000,reference:'Sum feed-controlled cutting moves from CAM or verified NC trace.'},
    {kind:'number',id:'cutFeed',label:'Average cutting feed',defaultValue:1200,step:10,family:'linearSpeed',defaultUnit:'mmmin',min:1,max:100000,reference:'Use weighted average feed if operations differ materially.'},
    {kind:'number',id:'rapidLen',label:'Rapid / positioning path',defaultValue:900,step:10,family:'length',defaultUnit:'mm',min:0,max:10000000,reference:'Include non-cutting positioning distance.'},
    {kind:'number',id:'rapidFeed',label:'Effective rapid rate',defaultValue:10000,step:100,family:'linearSpeed',defaultUnit:'mmmin',min:1,max:200000,reference:'Use effective axis-limited rapid, not brochure peak if acceleration dominates.'},
    {kind:'number',id:'toolChanges',label:'Tool changes per part',defaultValue:4,step:1,family:'count',defaultUnit:'count',min:0,max:200,reference:'Count automatic/manual changes that interrupt the part cycle.'},
    {kind:'number',id:'toolChangeTime',label:'Time per tool change',defaultValue:4,step:.1,family:'time',defaultUnit:'s',min:0,max:3600,reference:'Measure chip-to-chip time where available.'},
    {kind:'number',id:'loadUnload',label:'Load / unload time',defaultValue:45,step:1,family:'time',defaultUnit:'s',min:0,max:7200,reference:'Include door, clamping, cleaning and part handling.'},
    {kind:'number',id:'setupTime',label:'Setup time per batch',defaultValue:3600,step:60,family:'time',defaultUnit:'s',min:0,max:604800,reference:'Fixture, prove-out, offsets, first-off inspection and paperwork.'},
    {kind:'number',id:'batch',label:'Batch size',defaultValue:50,step:1,family:'count',defaultUnit:'count',min:1,max:1000000,reference:'Good + expected scrap parts in the run planning basis.'},
    {kind:'number',id:'availability',label:'Availability',defaultValue:88,step:1,family:'percent',defaultUnit:'pct',min:.05,max:1,reference:'Run time / planned production time. World-class reference often ~90%.'},
    {kind:'number',id:'performance',label:'Performance',defaultValue:92,step:1,family:'percent',defaultUnit:'pct',min:.05,max:1.2,reference:'Actual speed / ideal speed. >100% usually means ideal cycle is stale.'},
    {kind:'number',id:'scrap',label:'Scrap + unrecoverable rework',defaultValue:3,step:.1,family:'percent',defaultUnit:'pct',min:0,max:.95,reference:'Fraction of produced parts not shipped as conforming product.'},
    {kind:'number',id:'machineRate',label:'Machine cost rate',defaultValue:75,step:1,family:'currencyPerHour',defaultUnit:'curh',min:0,max:100000,reference:'Use fully burdened machine-hour cost, ideally from SC-038.'},
    {kind:'number',id:'laborRate',label:'Direct labor cost rate',defaultValue:38,step:1,family:'currencyPerHour',defaultUnit:'curh',min:0,max:100000,reference:'Use loaded labor cost, not net wage.'},
    {kind:'number',id:'laborAttendance',label:'Labor attendance during machine cycle',defaultValue:60,step:5,family:'percent',defaultUnit:'pct',min:0,max:1,reference:'1.0 for dedicated operator; lower for multi-machine tending.'}
  ],
  formulas:['Ideal cycle = cutLen/cutFeed + rapidLen/rapidFeed + toolChanges·toolChangeTime + loadUnload','Effective running cycle = ideal cycle / (availability·performance)','Setup per part = setupTime / batch','Good-part time = (effective cycle + setup/part)/(1 − scrap)','Cost/good part = machineTime·machineRate + laborAttendance·laborRate, normalized by yield'],
  assumptions:['Availability and performance are independent multiplicative losses.','Scrap is treated as unrecoverable yield loss and therefore spreads consumed time/cost over good output.','Queue time and WIP carrying cost are excluded unless embedded in the hourly rates.'], sensitivity:{inputId:'availability',outputId:'costGood',spanPct:15},
  calculate(input){
    const cutLen=nonNegative(n(input,'cutLen'),'cutLen'), cutFeed=positive(n(input,'cutFeed'),'cutFeed'), rapidLen=nonNegative(n(input,'rapidLen'),'rapidLen'), rapidFeed=positive(n(input,'rapidFeed'),'rapidFeed'), tc=nonNegative(n(input,'toolChanges'),'toolChanges'), tct=nonNegative(n(input,'toolChangeTime'),'toolChangeTime'), load=nonNegative(n(input,'loadUnload'),'loadUnload'), setup=nonNegative(n(input,'setupTime'),'setupTime'), batch=positive(n(input,'batch'),'batch'), A=positive(n(input,'availability'),'availability'), P=positive(n(input,'performance'),'performance'), scrap=n(input,'scrap'), mr=nonNegative(n(input,'machineRate'),'machineRate'), lr=nonNegative(n(input,'laborRate'),'laborRate'), attend=n(input,'laborAttendance');
    if(scrap.gte(1)) throw new CalcError('E_OUT_OF_RANGE','scrap must be < 100%');
    const warns=[]; if(P.gt(1.05)) warns.push(w('warning','Performance above 105%','Ideal cycle definition is likely stale or standard speed is understated.')); if(A.lt(.6)) warns.push(w('warning','Low availability','Availability below 60% makes quoted cycle highly sensitive to downtime root causes.')); if(scrap.gt(.1)) warns.push(w('warning','High yield loss',`Scrap/rework ${scrap.times(100).toFixed(1)}% materially inflates cost per good part.`));
    const cutSec=cutLen.div(cutFeed).times(60), rapidSec=rapidLen.div(rapidFeed).times(60), toolSec=tc.times(tct);
    const ideal=cutSec.plus(rapidSec).plus(toolSec).plus(load);
    const effective=ideal.div(A.times(P));
    const setupPer=setup.div(batch); const consumed=effective.plus(setupPer); const goodSec=consumed.div(D(1).minus(scrap));
    const machineCost=consumed.div(3600).times(mr).div(D(1).minus(scrap));
    const laborCost=consumed.div(3600).times(lr).times(attend).div(D(1).minus(scrap));
    const costGood=machineCost.plus(laborCost);
    const goodPerHour=D(3600).div(goodSec);
    return {outputs:[o('idealCycle','Ideal programmed cycle',ideal,'s',2),o('effectiveCycle','Effective cycle before scrap',effective,'s',2),o('goodPartTime','Time per conforming part',goodSec,'s',2,'Includes setup and yield loss',true),o('goodPerHour','Good parts per productive hour',goodPerHour,'parts/h',2),o('machineCost','Machine cost / good part',machineCost,'currency',2),o('laborCost','Labor cost / good part',laborCost,'currency',2),o('costGood','Total cost / good part',costGood,'currency',2,'Before margin',true),o('setupShare','Setup time / part',setupPer,'s',2)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

const SC024: ToolDefinition = {
  code:'SC-024', slug:'bearing-frequencies-pro', name:'Bearing Defect Frequencies — BPFO / BPFI / BSF / FTF', category:'Rotating Equipment & Reliability', standard:'Rolling-element bearing kinematic defect-frequency equations', engineVersion:'SC024-UEK-1.0.0',
  summary:'Calculates shaft frequency, cage frequency, outer-race, inner-race and ball-spin fault frequencies with contact-angle and slip sensitivity.', decision:'Map measured vibration peaks to physically possible bearing defect orders before condemning a bearing.',
  fields:[
    {kind:'number',id:'z',label:'Rolling elements z',defaultValue:9,step:1,family:'count',defaultUnit:'count',min:3,max:100,reference:'Count balls/rollers from manufacturer drawing or bearing disassembly.'},
    {kind:'number',id:'bd',label:'Ball / roller diameter Bd',defaultValue:12,step:.1,family:'length',defaultUnit:'mm',min:.1,max:500,reference:'Rolling element diameter.'},
    {kind:'number',id:'pd',label:'Pitch diameter Pd',defaultValue:52,step:.1,family:'length',defaultUnit:'mm',min:.2,max:2000,reference:'Diameter through rolling-element centers; not bearing OD.'},
    {kind:'number',id:'angle',label:'Contact angle',defaultValue:0,step:1,family:'angle',defaultUnit:'deg',min:0,max:60,reference:'0° for deep-groove radial bearing unless loaded contact angle is known.'},
    {kind:'number',id:'rpm',label:'Shaft speed',defaultValue:1800,step:10,family:'rpm',defaultUnit:'rpm',min:1,max:100000,reference:'Use actual measured running speed for spectral matching.'},
    {kind:'number',id:'slip',label:'Observed slip correction',defaultValue:0,step:.1,family:'percent',defaultUnit:'pct',min:0,max:.2,reference:'0 for theoretical kinematics. Real defects often appear 1–3% lower due to slip/loading.'}
  ],
  formulas:['fr = rpm/60','k = (Bd/Pd)·cos α','FTF = 0.5·fr·(1−k)','BPFO = z/2·fr·(1−k)','BPFI = z/2·fr·(1+k)','BSF = Pd/(2Bd)·fr·[1−k²]','Displayed defect frequencies = theoretical·(1−slip)'],
  assumptions:['No skidding other than the explicit slip correction.','Pitch diameter and rolling-element diameter are loaded geometry inputs from the exact bearing, not inferred from bore/OD.','Frequency matching alone does not prove a defect; confirm harmonics, sidebands, envelope spectrum and time waveform.'], sensitivity:{inputId:'rpm',outputId:'bpfi',spanPct:20},
  calculate(input){
    const z=positive(n(input,'z'),'z'), bd=positive(n(input,'bd'),'bd'), pd=positive(n(input,'pd'),'pd'), a=n(input,'angle'), rpm=positive(n(input,'rpm'),'rpm'), slip=n(input,'slip');
    const warns=[]; if(bd.gte(pd)) warns.push(w('error','Impossible bearing geometry','Rolling element diameter must be smaller than pitch diameter.'));
    const fr=rpm.div(60), k=bd.div(pd).times(cosDeg(a));
    if(k.abs().gte(1)) warns.push(w('error','Invalid kinematic ratio','(Bd/Pd)·cos α must have magnitude < 1.'));
    if(slip.gt(.05)) warns.push(w('warning','Large slip correction','Slip above 5% indicates severe skidding or uncertain geometry; frequency matching becomes non-diagnostic.'));
    const corr=D(1).minus(slip); const ftf=fr.times('.5').times(D(1).minus(k)).times(corr); const bpfo=z.div(2).times(fr).times(D(1).minus(k)).times(corr); const bpfi=z.div(2).times(fr).times(D(1).plus(k)).times(corr); const bsf=pd.div(bd.times(2)).times(fr).times(D(1).minus(k.pow(2))).times(corr);
    return {outputs:[o('shaft','Shaft rotational frequency',fr,'Hz',3),o('ftf','FTF — cage',ftf,'Hz',3),o('bpfo','BPFO — outer race',bpfo,'Hz',3,true),o('bpfi','BPFI — inner race',bpfi,'Hz',3,true),o('bsf','BSF — rolling element spin',bsf,'Hz',3),o('bpfoOrder','BPFO order',bpfo.div(fr),'×RPM',3),o('bpfiOrder','BPFI order',bpfi.div(fr),'×RPM',3)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

const SC025: ToolDefinition = {
  code:'SC-025', slug:'belt-chain-pro', name:'Belt & Chain Drive Sizing / Load Verification', category:'Rotating Equipment & Reliability', standard:'Power-transmission kinematics · Euler-Eytelwein belt traction model', engineVersion:'SC025-UEK-1.0.0',
  summary:'Checks speed ratio, belt/chain velocity, transmitted pull, belt tight/slack tension, centrifugal tension, wrap and candidate allowable tension.', decision:'Verify that the selected belt or chain can transmit factored power without traction loss, excessive tension or speed-limit exposure.',
  fields:[
    {kind:'select',id:'type',label:'Drive type',defaultValue:'belt',options:[{value:'belt',label:'Belt — traction model'},{value:'chain',label:'Roller chain — pitch/sprocket model'}],reference:'Belt uses friction/wrap traction; chain uses positive engagement.'},
    {kind:'number',id:'power',label:'Transmitted power',defaultValue:15,step:.5,family:'power',defaultUnit:'kW',min:.01,max:10000,reference:'Use peak continuous transmitted power, not motor nameplate alone.'},
    {kind:'number',id:'service',label:'Service factor',defaultValue:1.4,step:.05,family:'percent',defaultUnit:'ratio',min:.5,max:4,reference:'Typical 1.0 steady to >2.0 severe shock; use manufacturer table.'},
    {kind:'number',id:'eff',label:'Drive efficiency',defaultValue:96,step:1,family:'percent',defaultUnit:'pct',min:.2,max:1,reference:'Belts often 94–98%; chains 95–98% when aligned and lubricated.'},
    {kind:'number',id:'n1',label:'Driver speed',defaultValue:1450,step:10,family:'rpm',defaultUnit:'rpm',min:1,max:100000,reference:'Measured shaft speed at full load.'},
    {kind:'number',id:'ratio',label:'Speed ratio n1/n2',defaultValue:2.5,step:.05,family:'percent',defaultUnit:'ratio',min:.1,max:100,reference:'Driven speed = driver speed / ratio.'},
    {kind:'number',id:'driverD',label:'Driver pulley pitch diameter',defaultValue:140,step:1,family:'length',defaultUnit:'mm',min:5,max:5000,reference:'Belt pitch diameter; ignored for chain velocity.'},
    {kind:'number',id:'chainPitch',label:'Chain pitch',defaultValue:19.05,step:.01,family:'length',defaultUnit:'mm',min:1,max:200,reference:'Roller-chain pitch; 19.05 mm = 3/4 in.'},
    {kind:'number',id:'z1',label:'Driver sprocket teeth',defaultValue:19,step:1,family:'count',defaultUnit:'count',min:6,max:200,reference:'Fewer than ~17 teeth increases polygonal action and wear.'},
    {kind:'number',id:'wrap',label:'Belt wrap on small pulley',defaultValue:165,step:1,family:'angle',defaultUnit:'deg',min:30,max:360,reference:'Open belt drives typically target >120° on the small pulley.'},
    {kind:'number',id:'mu',label:'Effective belt friction coefficient',defaultValue:.30,step:.01,family:'percent',defaultUnit:'ratio',min:.05,max:1.5,reference:'Effective traction coefficient after groove/wedge effects; use belt maker data.'},
    {kind:'number',id:'beltMass',label:'Belt mass per metre',defaultValue:.18,step:.01,family:'mass',defaultUnit:'kg',min:0,max:50,reference:'Enter kg per metre of moving belt. Set 0 if centrifugal tension is negligible.'},
    {kind:'number',id:'allowT',label:'Allowable tight-side tension',defaultValue:1800,step:10,family:'force',defaultUnit:'N',min:1,max:10000000,reference:'Per belt/chain strand allowable working pull after manufacturer factors.'}
  ],
  formulas:['Pdesign = power·service/efficiency','Belt v = π·D1·n1/60000','Chain v = pitch·z1·n1/60000','Effective pull Te = 1000·Pdesign/v','Belt tension ratio r = exp(μ·wrap_rad); T1=Te·r/(r−1), T2=Te/(r−1)','Centrifugal tension Tc = m·v²','Driven speed n2 = n1/ratio'],
  assumptions:['Belt traction uses an effective friction coefficient; V-belt groove geometry is therefore embedded in μ rather than modeled separately.','Chain pull ignores dynamic polygonal amplification; tooth-count warning identifies the region where manufacturer selection factors become mandatory.','Allowable tension must come from the exact belt/chain manufacturer and width/strand count.'], sensitivity:{inputId:'service',outputId:'util',spanPct:20},
  calculate(input){
    const type=s(input,'type'), power=positive(n(input,'power'),'power'), service=positive(n(input,'service'),'service'), eff=positive(n(input,'eff'),'eff'), n1=positive(n(input,'n1'),'n1'), rr=positive(n(input,'ratio'),'ratio'), D1=positive(n(input,'driverD'),'driverD'), pitch=positive(n(input,'chainPitch'),'chainPitch'), z1=positive(n(input,'z1'),'z1'), wrap=n(input,'wrap'), mu=positive(n(input,'mu'),'mu'), mass=nonNegative(n(input,'beltMass'),'beltMass'), allow=positive(n(input,'allowT'),'allowT');
    const warns=[]; const designP=power.times(service).div(eff); const n2=n1.div(rr); let v:Decimal, tight:Decimal, slack:Decimal, cent=D(0);
    if(type==='chain'){
      v=pitch.times(z1).times(n1).div(60000); const pull=designP.times(1000).div(v); tight=pull; slack=D(0); if(z1.lt(17)) warns.push(w('warning','Low sprocket tooth count',`${z1.toFixed(0)} teeth increases polygonal speed variation and articulation wear; apply chain-maker rating factors.`));
    } else {
      v=PI().times(D1).times(n1).div(60000); const Te=designP.times(1000).div(v); const theta=wrap.times(PI()).div(180); const tr=expD(mu.times(theta));
      if(tr.lte(1.05)) warns.push(w('error','Insufficient traction ratio','Friction × wrap produces almost no tight/slack tension ratio.'));
      slack=Te.div(tr.minus(1)); tight=slack.times(tr); cent=mass.div(1000).times(1000).times(v.pow(2));
      tight=tight.plus(cent); if(wrap.lt(120)) warns.push(w('warning','Low small-pulley wrap','Wrap below 120° materially reduces traction and belt life.'));
    }
    if(v.gt(40)&&type==='belt') warns.push(w('warning','High belt speed',`${v.toFixed(1)} m/s requires belt-specific centrifugal and balance verification.`));
    if(v.gt(15)&&type==='chain') warns.push(w('warning','High chain speed',`${v.toFixed(1)} m/s is a high-speed chain application; lubrication and dynamic rating govern.`));
    const util=tight.div(allow); if(util.gt(1)) warns.push(w('error','Allowable tension exceeded',`Demand ${tight.toFixed(0)} N exceeds entered allowable ${allow.toFixed(0)} N.`)); else if(util.gt(.85)) warns.push(w('warning','Tension reserve below 15%',`Utilization ${util.times(100).toFixed(1)}%.`));
    return {outputs:[o('designPower','Factored transmitted power',designP,'kW',2),o('drivenRpm','Driven speed',n2,'rpm',1),o('velocity','Belt / chain speed',v,'m/s',3),o('tight','Tight-side / chain pull',tight,'N',1,true,util),o('slack','Slack-side tension',type==='belt'?slack:'—','N',1),o('centrifugal','Centrifugal tension',type==='belt'?cent:'—','N',1),o('util','Allowable-tension utilization',util.times(100),'%',1,'Demand / entered allowable',true,util)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

function isoIT(Dm:Decimal, grade:number):Decimal{
  const i=D('.45').times(Dm.pow(D(1).div(3))).plus(D('.001').times(Dm));
  const mult:Record<number,string>={6:'10',7:'16',8:'25',9:'40'}; return i.times(mult[grade] ?? '16').div(1000);
}
function shaftDeviation(letter:string,Dm:Decimal,it:Decimal):{es:Decimal;ei:Decimal;note:string}{
  if(letter==='h') return {es:D(0),ei:it.neg(),note:'h: upper deviation = 0'};
  if(letter==='g'){const es=D('-2.5').times(Dm.pow('.34')).div(1000);return{es,ei:es.minus(it),note:'g fundamental deviation equation'};}
  if(letter==='f'){const es=D('-5.5').times(Dm.pow('.41')).div(1000);return{es,ei:es.minus(it),note:'f fundamental deviation equation'};}
  const es=it.div(2), ei=it.div(2).neg(); return {es,ei,note:'js: symmetric tolerance zone'};
}
const SC027: ToolDefinition = {
  code:'SC-027', slug:'fits-clearances-pro', name:'ISO 286 Fits & Clearances — Limit Calculator', category:'Tolerances & Metrology', standard:'ISO 286-1/2 tolerance-unit equations — 3 to 500 mm equation range', engineVersion:'SC027-UEK-1.0.0',
  summary:'Computes hole/shaft limits, minimum/maximum clearance and fit class for common H-hole basis combinations with explicit ISO tolerance-unit equations.', decision:'Confirm whether a selected fit guarantees clearance, transition, or interference before drawing release and gauge planning.',
  fields:[
    {kind:'number',id:'nominal',label:'Basic size',defaultValue:40,step:.1,family:'length',defaultUnit:'mm',min:3,max:500,reference:'ISO equation implementation is intentionally bounded to 3–500 mm.'},
    {kind:'select',id:'fit',label:'Fit',defaultValue:'H7g6',options:[{value:'H7g6',label:'H7/g6 — precision running clearance'},{value:'H7h6',label:'H7/h6 — close clearance / line fit'},{value:'H7f7',label:'H7/f7 — running clearance'},{value:'H8f7',label:'H8/f7 — general running clearance'},{value:'H7js6',label:'H7/js6 — transition centered'}],reference:'Supported classes use equation-backed H, f, g, h and js deviations; other ISO zones remain table-driven and are not guessed.'},
    {kind:'number',id:'actualHole',label:'Measured hole (optional check)',defaultValue:40.02,step:.001,family:'length',defaultUnit:'mm',min:3,max:500,reference:'Used only for conformance check against computed hole limits.'},
    {kind:'number',id:'actualShaft',label:'Measured shaft (optional check)',defaultValue:39.99,step:.001,family:'length',defaultUnit:'mm',min:3,max:500,reference:'Used only for conformance check against computed shaft limits.'}
  ],
  formulas:['i [µm] = 0.45·D^(1/3) + 0.001·D','IT6=10i, IT7=16i, IT8=25i','H hole: EI=0, ES=IT','h shaft: es=0; g: es=−2.5D^0.34 µm; f: es=−5.5D^0.41 µm; js: ±IT/2','Clearance min = hole_min − shaft_max; max = hole_max − shaft_min'],
  assumptions:['D is evaluated at entered basic size rather than the geometric mean of ISO size-step boundaries; this is conservative only within small step variation and must be checked against official tabulated values for contractual inspection.','Only H/f/g/h/js equation families listed in the selector are implemented; unsupported zones are intentionally absent rather than approximated.','Temperature is assumed at the drawing reference condition (normally 20 °C).'], sensitivity:{inputId:'nominal',outputId:'maxClear',spanPct:10},
  calculate(input){
    const Dm=positive(n(input,'nominal'),'nominal'), fit=s(input,'fit'), ah=n(input,'actualHole'), as=n(input,'actualShaft'); const warns=[];
    if(Dm.lt(3)||Dm.gt(500)) warns.push(w('error','Outside implemented ISO equation range','Basic size must remain 3–500 mm for this engine version.'));
    const holeGrade=fit.startsWith('H8')?8:7; const shaftGrade=fit.endsWith('7')?7:6; const letter=fit.includes('js')?'js':fit.includes('g')?'g':fit.includes('f')?'f':'h';
    const itH=isoIT(Dm,holeGrade), itS=isoIT(Dm,shaftGrade); const holeMin=Dm, holeMax=Dm.plus(itH); const dev=shaftDeviation(letter,Dm,itS), shaftMax=Dm.plus(dev.es), shaftMin=Dm.plus(dev.ei); const minC=holeMin.minus(shaftMax), maxC=holeMax.minus(shaftMin);
    const cls=minC.gt(0)?'CLEARANCE':maxC.lt(0)?'INTERFERENCE':'TRANSITION';
    const holeOK=ah.gte(holeMin)&&ah.lte(holeMax), shaftOK=as.gte(shaftMin)&&as.lte(shaftMax); if(!holeOK) warns.push(w('warning','Measured hole outside limits',`Measured ${ah.toFixed(4)} mm; allowed ${holeMin.toFixed(4)}–${holeMax.toFixed(4)} mm.`)); if(!shaftOK) warns.push(w('warning','Measured shaft outside limits',`Measured ${as.toFixed(4)} mm; allowed ${shaftMin.toFixed(4)}–${shaftMax.toFixed(4)} mm.`));
    return {outputs:[o('fitClass','Fit behavior',cls,'—',0,'Based on limit envelopes',true),o('holeMin','Hole lower limit',holeMin,'mm',4),o('holeMax','Hole upper limit',holeMax,'mm',4),o('shaftMin','Shaft lower limit',shaftMin,'mm',4),o('shaftMax','Shaft upper limit',shaftMax,'mm',4),o('minClear','Minimum clearance',minC,'mm',4,true),o('maxClear','Maximum clearance',maxC,'mm',4,true),o('holeIT','Hole tolerance',itH.times(1000),'µm',1),o('shaftIT','Shaft tolerance',itS.times(1000),'µm',1)],warnings:warns,formulas:this.formulas,assumptions:[...this.assumptions,dev.note]};
  }
};

const SC028: ToolDefinition = {
  code:'SC-028', slug:'surface-finish-pro', name:'Surface Finish Converter & Process Capability Window', category:'Tolerances & Metrology', standard:'ISO 1302 roughness notation · ASME B46.1 parameter conventions', engineVersion:'SC028-UEK-1.0.0',
  summary:'Converts Ra across µm/µin, estimates Rq and an uncertainty-banded Rz range, maps N-grade and checks process capability against a selected manufacturing process.', decision:'Translate roughness requirements without treating empirical Ra↔Rz ratios as exact constants.',
  fields:[
    {kind:'number',id:'ra',label:'Ra',defaultValue:1.6,step:.05,family:'length',defaultUnit:'mm',min:.00002,max:.05,reference:'Enter µm by choosing mm and using 0.0016 mm, or inch for imperial roughness; report normalizes to µm.'},
    {kind:'select',id:'process',label:'Process',defaultValue:'grinding',options:[{value:'turning',label:'Turning — typical Ra 0.8–6.3 µm'},{value:'milling',label:'Milling — typical Ra 0.8–6.3 µm'},{value:'grinding',label:'Grinding — typical Ra 0.1–1.6 µm'},{value:'honing',label:'Honing — typical Ra 0.05–0.8 µm'},{value:'lapping',label:'Lapping — typical Ra 0.012–0.2 µm'}],reference:'Ranges are process-planning references, not capability guarantees.'},
    {kind:'number',id:'rzRatioLow',label:'Rz/Ra lower ratio',defaultValue:4,step:.1,family:'percent',defaultUnit:'ratio',min:2,max:20,reference:'Empirical conversion varies by process/profile; use measured correlation where contractual.'},
    {kind:'number',id:'rzRatioHigh',label:'Rz/Ra upper ratio',defaultValue:7,step:.1,family:'percent',defaultUnit:'ratio',min:2,max:30,reference:'Common engineering estimate envelope is roughly 4–7× Ra, but it is not a standard equivalence.'}
  ],
  formulas:['Ra[µm] = entered length[mm]·1000','Rq ≈ 1.11·Ra for near-Gaussian machined profiles','Rz estimate envelope = Ra·[ratio_low, ratio_high]','Ra[µin] = Ra[µm]·39.37007874','N-grade selected from ISO roughness series 0.025…50 µm'],
  assumptions:['Ra↔Rq and Ra↔Rz conversions are empirical estimates, not interchangeable drawing specifications.','Process ranges describe typical achievable roughness under stable tooling and metrology; geometry, material, waviness and filtering can dominate.','Contract acceptance must use the parameter and cutoff/filter stated on the drawing.'], sensitivity:{inputId:'ra',outputId:'rzHigh',spanPct:25},
  calculate(input){
    const raMm=positive(n(input,'ra'),'ra'), process=s(input,'process'), lo=positive(n(input,'rzRatioLow'),'rzRatioLow'), hi=positive(n(input,'rzRatioHigh'),'rzRatioHigh'); if(hi.lt(lo)) throw new CalcError('E_OUT_OF_RANGE','Rz/Ra high ratio must be >= low ratio');
    const ra=raMm.times(1000), rq=ra.times('1.11'), rzLo=ra.times(lo), rzHi=ra.times(hi), microIn=ra.times('39.3700787401575');
    const grades=[['N1','.025'],['N2','.05'],['N3','.1'],['N4','.2'],['N5','.4'],['N6','.8'],['N7','1.6'],['N8','3.2'],['N9','6.3'],['N10','12.5'],['N11','25'],['N12','50']] as const;
    let grade='>N12'; for(const [g,v] of grades){if(ra.lte(v)){grade=g;break;}}
    const bands:Record<string,[number,number]>={turning:[.8,6.3],milling:[.8,6.3],grinding:[.1,1.6],honing:[.05,.8],lapping:[.012,.2]}; const [b0,b1]=bands[process] ?? [.1,6.3]; const warns=[]; if(ra.lt(b0)||ra.gt(b1)) warns.push(w('warning','Outside typical process band',`${process} reference band ${b0}–${b1} µm Ra; entered ${ra.toFixed(3)} µm requires process-specific capability evidence.`));
    return {outputs:[o('raUm','Ra',ra,'µm',3,true),o('raMicroIn','Ra',microIn,'µin',1),o('rq','Estimated Rq',rq,'µm',3,'Near-Gaussian profile estimate'),o('rzLow','Estimated Rz low',rzLo,'µm',3),o('rzHigh','Estimated Rz high',rzHi,'µm',3,true),o('grade','ISO roughness grade',grade,'—',0),o('processBand','Typical process Ra band',`${b0}–${b1}`,'µm',0)],warnings:warns,formulas:this.formulas,assumptions:this.assumptions};
  }
};

export const MACHINING_TOOLS: readonly ToolDefinition[] = [SC022,SC023,SC024,SC025,SC027,SC028];
