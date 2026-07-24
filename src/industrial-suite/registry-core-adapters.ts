import { D } from '../core/engine.js';
import { calculate as calculateWeld } from '../tools/SC-001-weld-thickness/v1.0.0/formula.js';
import { calculate as calculateLabor } from '../tools/SC-010-labor-cost/v1.0.0/formula.js';
import { calculate as calculateQuote } from '../tools/SC-012-quote-pricing/v1.0.0/formula.js';
import { COUNTRIES } from '../tools/SC-010-labor-cost/v1.0.0/reference.js';
import { numberValue as n, selectValue as s, output as o, warning as w } from './engine.js';
import type { CanonicalInput, ToolDefinition } from './engine.js';

const SC001: ToolDefinition = {
  code:'SC-001', slug:'weld-pro', name:'Weld Thickness / Fillet Leg Sizing', category:'Welding & Fabrication',
  standard:'AWS D1.1 minimum fillet-leg reference · EN ISO 2553 drawing context', engineVersion:'SC001-DECIMAL-2.0.0',
  summary:'Pure Decimal weld-sizing engine that resolves allowable shear, required throat, load-driven leg and governing code-minimum leg with explicit utilization.',
  decision:'Select a weld leg that satisfies both structural demand and minimum-leg requirements before WPS/NDT release.',
  fields:[
    {kind:'number',id:'load',label:'Design load',defaultValue:50,step:1,family:'force',defaultUnit:'kN',min:0,max:100000000,reference:'Factored load carried by the modeled weld line.'},
    {kind:'number',id:'length',label:'Effective weld length',defaultValue:200,step:5,family:'length',defaultUnit:'mm',min:1,max:100000,reference:'Effective load-carrying weld length.'},
    {kind:'number',id:'strength',label:'Weld metal strength',defaultValue:480,step:10,family:'pressure',defaultUnit:'MPa',min:1,max:2000,reference:'Use the governing nominal/allowable basis from electrode, WPS and code.'},
    {kind:'number',id:'sf',label:'Safety factor',defaultValue:2,step:.1,family:'percent',defaultUnit:'ratio',min:.5,max:10,reference:'Explicit preview factor; governing code resistance factors may use a different format.'},
    {kind:'number',id:'thickness',label:'Connected material thickness',defaultValue:10,step:.5,family:'length',defaultUnit:'mm',min:.1,max:500,reference:'Thickness governing the minimum fillet-leg reference table.'},
    {kind:'select',id:'joint',label:'Joint model',defaultValue:'fillet',options:[{value:'fillet',label:'Equal-leg fillet — throat factor 0.707'},{value:'butt',label:'Butt-path preview — factor 1.0'}],reference:'Fillet model uses theoretical throat = 0.707·leg.'}
  ],
  formulas:['Allowable shear = weld strength / safety factor','Required throat = design load / (effective length · allowable shear)','Load-driven leg = throat / 0.707 for equal-leg fillet','Final leg = max(load-driven leg, minimum-leg table value)','Utilization = required throat / provided theoretical throat'],
  assumptions:['Single resultant load distributed uniformly over the entered effective weld length.','Minimum fillet-leg table is a planning reference; exact contract/code edition and joint details are authoritative.','Fatigue category, eccentric weld-group moments, base-metal failure, HAZ, fit-up and NDT acceptance are separate checks.'],
  sensitivity:{inputId:'load',outputId:'finalLeg',spanPct:25},
  calculate(input: CanonicalInput){
    const r=calculateWeld({designLoadN:n(input,'load'),weldLengthMm:n(input,'length'),weldStrengthMpa:n(input,'strength'),safetyFactor:n(input,'sf'),materialThicknessMm:n(input,'thickness'),jointType:s(input,'joint') as 'fillet'|'butt'});
    const util=D(r.utilization);
    const warnings=[];
    if(util.gte(1)) warnings.push(w('warning','Load-driven throat reaches provided leg capacity',`Utilization ${util.times(100).toFixed(1)}%; no reserve beyond the selected governing leg.`));
    if(n(input,'sf').lt('1.5')) warnings.push(w('warning','Low explicit safety factor','Verify the governing code resistance/load-factor format before release.'));
    return {outputs:[o('finalLeg','Required final weld leg',D(r.finalLegMm),'mm',2,true,util),o('finalLegIn','Required final weld leg',D(r.finalLegIn),'in',3),o('throat','Required throat',D(r.requiredThroatMm),'mm',2),o('minLeg','Minimum reference leg',D(r.minLegMm),'mm',2),o('loadLeg','Load-driven leg',D(r.legFromLoadMm),'mm',2),o('util','Provided-leg utilization',util.times(100),'%',1,true,util)],warnings,formulas:this.formulas,assumptions:this.assumptions};
  }
};

const COUNTRY_OPTIONS=Object.entries(COUNTRIES).map(([value,c])=>({value,label:`${value} · ${c.currency} reference regime`}));
const SC010: ToolDefinition = {
  code:'SC-010',slug:'labor-pro',name:'True Labor Cost',category:'Costing & Business',
  standard:'Deterministic loaded-labor cost build-up · reference statutory regimes',engineVersion:'SC010-DECIMAL-2.0.0',
  summary:'Conservation-locked Decimal engine that normalizes pay frequency, grosses up net pay, adds employer contributions, benefits, severance, overtime and recruitment amortization, then returns true monthly and hourly labor cost.',
  decision:'Use a fully loaded labor rate in quoting instead of net wage, with every cost component reconciled to the reported total.',
  fields:[
    {kind:'select',id:'country',label:'Reference statutory regime',defaultValue:'US',options:COUNTRY_OPTIONS,reference:'Built-in rates are reference estimates only; verify current payroll law/provider before contractual use.'},
    {kind:'number',id:'netSalary',label:'Net pay',defaultValue:2500,step:50,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Take-home pay in the selected pay frequency.'},
    {kind:'select',id:'frequency',label:'Pay frequency',defaultValue:'monthly',options:[{value:'monthly',label:'Monthly'},{value:'weekly',label:'Weekly'},{value:'biweekly',label:'Biweekly'},{value:'hourly',label:'Hourly'}],reference:'Engine normalizes to monthly using 4.33 weeks/month.'},
    {kind:'number',id:'hours',label:'Hours per week',defaultValue:40,step:1,family:'count',defaultUnit:'count',min:1,max:168,reference:'Average worked/paid hours used for hourly normalization.'},
    {kind:'number',id:'health',label:'Employer health / month',defaultValue:0,step:10,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Employer-paid monthly health benefit.'},
    {kind:'number',id:'meal',label:'Meal benefit / month',defaultValue:0,step:10,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Employer-paid meal benefit.'},
    {kind:'number',id:'transport',label:'Transport / month',defaultValue:0,step:10,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Employer-paid commuting/transport benefit.'},
    {kind:'number',id:'bonus',label:'Annual bonus',defaultValue:0,step:100,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Annual amount amortized over 12 months.'},
    {kind:'number',id:'overtimeHours',label:'Overtime hours / month',defaultValue:0,step:1,family:'count',defaultUnit:'count',min:0,max:744,reference:'Average monthly overtime hours.'},
    {kind:'number',id:'overtimeMult',label:'Overtime multiplier',defaultValue:1.5,step:.1,family:'percent',defaultUnit:'ratio',min:1,max:5,reference:'1.5 is a common premium reference; local law/contract controls.'},
    {kind:'number',id:'recruitment',label:'Recruitment / onboarding cost',defaultValue:0,step:100,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'One-time cost amortized over expected tenure.'},
    {kind:'number',id:'tenure',label:'Expected tenure',defaultValue:3,step:.5,family:'count',defaultUnit:'count',min:.1,max:50,reference:'Years used for recruitment-cost amortization.'}
  ],
  formulas:['Normalize net pay to monthly','Gross = net / (1 − employee burden rate)','Employer contributions = gross · statutory employer rates','Benefits = health + meal + transport + annualBonus/12','Severance accrual = gross · severance rate','Overtime = overtime hours · gross hourly rate · overtime multiplier','True monthly cost = conservation-locked sum of all components','True hourly cost = total / (hours/week · 4.33)'],
  assumptions:['Built-in country rates are reference estimates, not payroll filing rules.','Progressive income-tax brackets, wage caps and industry funds are simplified into effective reference rates.','All monetary inputs must use one consistent currency; the engine does not perform FX conversion.'],
  sensitivity:{inputId:'netSalary',outputId:'trueMonthly',spanPct:20},
  calculate(input){
    const country=s(input,'country');
    const ref=COUNTRIES[country];
    const r=calculateLabor({country,netSalary:n(input,'netSalary'),payFrequency:s(input,'frequency') as 'hourly'|'weekly'|'biweekly'|'monthly',hoursPerWeek:n(input,'hours'),healthMonthly:n(input,'health'),mealMonthly:n(input,'meal'),transportMonthly:n(input,'transport'),annualBonus:n(input,'bonus'),overtimeHoursMonthly:n(input,'overtimeHours'),overtimeMultiplier:n(input,'overtimeMult'),recruitmentCost:n(input,'recruitment'),tenureYears:n(input,'tenure')});
    const mult=D(r.costMultiplier);
    const warnings=[];
    if(mult.gt('2')) warnings.push(w('warning','High loaded-cost multiplier',`True cost is ${mult.toFixed(2)}× net pay; verify statutory references and benefit inputs.`));
    if(ref) warnings.push(w('info','Reference regime',ref.note));
    return {outputs:[o('trueMonthly','True monthly employer cost',D(r.trueMonthlyCost),'currency/mo',2,true),o('trueHourly','True loaded hourly cost',D(r.trueHourlyCost),'currency/h',2,true),o('multiplier','True cost / net multiplier',mult,'×',2,true,mult.div(2)),o('hiddenPct','Hidden cost above net',D(r.hiddenCostPct),'%',1),o('annual','Annual true cost',D(r.annualTrueCost),'currency/y',2),o('gross','Estimated gross monthly pay',D(r.grossMonthly),'currency/mo',2),...r.breakdown.map((x,i)=>o(`component${i}`,x.item,D(x.amount),'currency/mo',2,`${x.pct}% of total`))],warnings,formulas:this.formulas,assumptions:this.assumptions};
  }
};

const SC012: ToolDefinition = {
  code:'SC-012',slug:'quote-pro',name:'Quote Pricing / Full-Cost Margin',category:'Costing & Business',
  standard:'Full absorption costing · deterministic margin gross-up',engineVersion:'SC012-DECIMAL-2.0.0',
  summary:'Conservation-locked quote engine that builds material-with-scrap, labor, machine, setup, energy, consumables, shipping, overhead and financing into total cost, then gross-ups to a target margin and unit price.',
  decision:'Issue a defensible quote only from one engine-owned cost build-up; no report-side recalculation is permitted.',
  fields:[
    {kind:'number',id:'material',label:'Raw material cost before scrap',defaultValue:1000,step:10,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Purchase/material input before yield loss.'},
    {kind:'number',id:'scrap',label:'Material scrap rate',defaultValue:10,step:.5,family:'percent',defaultUnit:'pct',min:0,max:.95,reference:'Effective purchased material = material/(1−scrap), not material×(1+scrap).' },
    {kind:'number',id:'laborHours',label:'Direct labor hours',defaultValue:5,step:.1,family:'count',defaultUnit:'count',min:0,max:1000000,reference:'Use routing/standard or measured labor hours.'},
    {kind:'number',id:'laborRate',label:'Loaded labor rate',defaultValue:40,step:1,family:'currencyPerHour',defaultUnit:'curh',min:0,max:100000,reference:'Use true loaded labor rate from SC-010.'},
    {kind:'number',id:'machineHours',label:'Machine hours',defaultValue:3,step:.1,family:'count',defaultUnit:'count',min:0,max:1000000,reference:'Productive machine time consumed by the batch/job.'},
    {kind:'number',id:'machineRate',label:'True machine-hour rate',defaultValue:60,step:1,family:'currencyPerHour',defaultUnit:'curh',min:0,max:100000,reference:'Use productive-hour cost from SC-038.'},
    {kind:'number',id:'setupMin',label:'Setup time',defaultValue:60,step:5,family:'time',defaultUnit:'min',min:0,max:604800,reference:'Fixture, offsets, prove-out and first-off inspection.'},
    {kind:'number',id:'setupRate',label:'Setup labor/machine rate',defaultValue:150,step:5,family:'currencyPerHour',defaultUnit:'curh',min:0,max:100000,reference:'Loaded hourly cost for the setup resource.'},
    {kind:'number',id:'energy',label:'Direct energy cost',defaultValue:0,step:10,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Job/batch-specific energy not already inside machine rate.'},
    {kind:'number',id:'consumables',label:'Consumables / tooling cost',defaultValue:0,step:10,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Job-specific cutters, gas, wire, coolant, abrasives etc.'},
    {kind:'number',id:'shipping',label:'Shipping / packaging',defaultValue:0,step:10,family:'currency',defaultUnit:'cur',min:0,max:1000000000,reference:'Direct outbound packaging/freight cost.'},
    {kind:'number',id:'overhead',label:'Overhead rate on direct cost',defaultValue:25,step:1,family:'percent',defaultUnit:'pct',min:0,max:5,reference:'Applied to direct cost in the formula engine.'},
    {kind:'number',id:'paymentDays',label:'Customer payment term',defaultValue:30,step:1,family:'count',defaultUnit:'count',min:0,max:3650,reference:'Days used for working-capital financing charge.'},
    {kind:'number',id:'monthlyInterest',label:'Monthly financing rate',defaultValue:2,step:.1,family:'percent',defaultUnit:'pct',min:0,max:1,reference:'Simple monthly carrying rate on cost before finance.'},
    {kind:'number',id:'margin',label:'Target gross margin',defaultValue:20,step:1,family:'percent',defaultUnit:'pct',min:0,max:.95,reference:'Margin on selling price: sell = cost/(1−margin), not markup on cost.'},
    {kind:'number',id:'quantity',label:'Quantity',defaultValue:10,step:1,family:'count',defaultUnit:'count',min:1,max:100000000,reference:'Units across which total sell and cost are allocated.'}
  ],
  formulas:['Effective material = material/(1−scrap)','Labor = laborHours·laborRate; machine = machineHours·machineRate','Setup = setupMinutes/60 · setupRate','Direct cost = effective material + labor + machine + setup + energy + consumables + shipping','Overhead = direct cost · overhead rate','Finance = (direct + overhead) · monthly interest · paymentDays/30','Total cost = conservation-locked sum of nine cost components','Sell price = total cost/(1−target margin); unit price = sell/quantity'],
  assumptions:['All monetary inputs use one consistent currency; no FX conversion.','Scrap is modeled as yield loss: purchased material required for good output is material/(1−scrap).','Overhead and financing bases are explicit formula choices; accounting policy may require a different allocation basis.'],
  sensitivity:{inputId:'material',outputId:'unitPrice',spanPct:20},
  calculate(input){
    const r=calculateQuote({materialCost:n(input,'material'),scrapRate:n(input,'scrap'),laborHours:n(input,'laborHours'),laborHourlyCost:n(input,'laborRate'),machineHours:n(input,'machineHours'),machineHourlyCost:n(input,'machineRate'),setupMinutes:n(input,'setupMin').div(60),setupHourlyCost:n(input,'setupRate'),energyCost:n(input,'energy'),consumablesCost:n(input,'consumables'),shippingCost:n(input,'shipping'),overheadRate:n(input,'overhead'),paymentDays:n(input,'paymentDays'),monthlyInterestRate:n(input,'monthlyInterest'),targetMargin:n(input,'margin'),quantity:n(input,'quantity'),currency:'currency'});
    const sell=D(r.sellPrice),cost=D(r.totalCost),realized=sell.gt(0)?sell.minus(cost).div(sell):D(0);
    const warnings=[];
    if(realized.lt(n(input,'margin').times('.9'))) warnings.push(w('warning','Realized margin below requested envelope','Reconcile input mappings and policy bases before releasing quote.'));
    return {outputs:[o('sellPrice','Total sell price',sell,'currency',2,true),o('unitPrice','Unit selling price',D(r.unitPrice),'currency/pc',2,true),o('totalCost','Total full cost',cost,'currency',2,true,cost.div(sell)),o('profit','Total gross profit',D(r.profit),'currency',2),o('profitPerUnit','Gross profit / unit',D(r.profitPerUnit),'currency/pc',2),o('effectiveMaterial','Effective material after scrap',D(r.effectiveMaterial),'currency',2),o('financeCharge','Financing charge',D(r.financeCharge),'currency',2),...r.breakdown.map((x,i)=>o(`component${i}`,x.item,D(x.amount),'currency',2,`${x.pct}% of total cost`))],warnings,formulas:this.formulas,assumptions:this.assumptions};
  }
};

export const CORE_ADAPTER_TOOLS: readonly ToolDefinition[]=[SC001,SC010,SC012];
