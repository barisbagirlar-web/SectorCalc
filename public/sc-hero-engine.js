(function(){
'use strict';
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const SEED=0x7A3F1C9E,N=10000,SPEC=0.100,fixed=[0.020,0.030,0.025];
function gauss(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function runEngine(t1){
  const t0=performance.now(),tols=[t1,...fixed];
  const wc=tols.reduce((a,b)=>a+b,0);
  const sig=tols.map(t=>t/3),sS=Math.sqrt(sig.reduce((a,s)=>a+s*s,0)),rss=3*sS;
  const rnd=mulberry32(SEED),s=new Float64Array(N);
  for(let i=0;i<N;i++){let x=0;for(const q of sig)x+=gauss(rnd)*q;s[i]=x;}
  let m=0;for(const x of s)m+=x;m/=N;let v=0;for(const x of s)v+=(x-m)*(x-m);v/=N;
  const mc=3*Math.sqrt(v);
  return{wc,rss,mc,cpk:SPEC/mc,samples:s,ms:(performance.now()-t0).toFixed(1)};
}
const canvas=document.getElementById('histo');
if(!canvas) return;
const ctx=canvas.getContext('2d');
let dots=[],animStart=0,raf=null,current=null;
function sizeC(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio,2);
  canvas.width=r.width*d;canvas.height=104*d;ctx.setTransform(d,0,0,d,0,0);return{w:r.width,h:104};}
function build(samples){
  const{w,h}=sizeC(),B=64,R=0.15,bins=new Array(B).fill(0);
  for(let i=0;i<N;i++){let b=Math.floor((samples[i]+R)/(2*R)*B);bins[Math.max(0,Math.min(B-1,b))]++;}
  const mx=Math.max(...bins),cnt=new Array(B).fill(0);dots=[];
  for(let i=0;i<N;i++){
    let b=Math.max(0,Math.min(B-1,Math.floor((samples[i]+R)/(2*R)*B)));
    const k=cnt[b]++;
    dots.push({x:(b+0.5)/B*w+(mulberry32(SEED+i)()-0.5)*(w/B*0.7),y:h-5-(k/mx)*(h-20),delay:(i/N)*650});
  }
  animStart=performance.now();if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(draw);
}
function draw(now){
  const{w,h}=sizeC();ctx.clearRect(0,0,w,h);
  const t=now-animStart;ctx.fillStyle='#0055A4';
  for(const d of dots){const p=(t-d.delay)/360;if(p<=0)continue;
    const e=p>=1?1:1-Math.pow(1-p,3);ctx.globalAlpha=0.25+0.75*e;
    ctx.fillRect(d.x-1,-8+(d.y+8)*e-1,2,2);}
  ctx.globalAlpha=1;
  if(current){ctx.beginPath();ctx.strokeStyle='rgba(26,26,26,.5)';ctx.lineWidth=1.3;
    const s=current.mc/3;
    for(let px=0;px<=w;px+=3){const xv=(px/w-0.5)*0.3,yv=Math.exp(-xv*xv/(2*s*s));
      const y=h-5-yv*(h-20)*0.98;px===0?ctx.moveTo(px,y):ctx.lineTo(px,y);}
    ctx.stroke();}
  if(t<1050)raf=requestAnimationFrame(draw);
}
const needle=document.getElementById('needle');
let ang=-90,tgt=-90,vel=0,gRaf=null;
function spring(){if(gRaf)return;gRaf=requestAnimationFrame(function s(){
  vel+=(tgt-ang)*0.045;vel*=0.82;ang+=vel;
  needle.setAttribute('transform','rotate('+ang.toFixed(2)+' 100 108)');
  if(Math.abs(tgt-ang)>0.05||Math.abs(vel)>0.05)gRaf=requestAnimationFrame(s);
  else{needle.setAttribute('transform','rotate('+tgt.toFixed(2)+' 100 108)');gRaf=null;}});}
function tween(el,to,fmt){const from=el._v==null?to:el._v;el._v=to;const t0=performance.now();
  (function s(n){const p=Math.min((n-t0)/450,1),e=1-Math.pow(1-p,3);
    el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(s);})(t0);}
const f4=v=>'±'+v.toFixed(4),f2=v=>v.toFixed(2);
const inTol=document.getElementById('inTol'),oTol=document.getElementById('oTol');
function recalc(){
  const t1=+inTol.value/1000;oTol.textContent='±'+t1.toFixed(3)+' mm';
  const r=runEngine(t1);current=r;
  tween(document.getElementById('vWC'),r.wc,f4);
  tween(document.getElementById('vRSS'),r.rss,f4);
  tween(document.getElementById('vMC'),r.mc,f4);
  tween(document.getElementById('cpkVal'),r.cpk,f2);
  document.getElementById('calcTime').textContent=r.ms+' ms';
  tgt=-90+(Math.max(0,Math.min(2.2,r.cpk))/2.2)*180;spring();
  build(r.samples);
}
let deb=null;
inTol.addEventListener('input',()=>{clearTimeout(deb);deb=setTimeout(recalc,180);});
addEventListener('resize',()=>{if(current)build(current.samples);});
recalc();
/* Re-measure engine time after 3D init load settles */
setTimeout(recalc,2000);
})();