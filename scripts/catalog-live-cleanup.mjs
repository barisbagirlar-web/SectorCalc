import { basename } from 'node:path';

export function catalogLiveCleanupPlugin(){
  return {
    name:'sectorcalc-catalog-live-cleanup',
    enforce:'pre',
    transformIndexHtml:{
      order:'pre',
      handler(html,ctx){
        const file=basename(ctx.filename||ctx.originalUrl||'');
        if(file!=='tools.html')return html;
        return html
          .replace('<div class="n" id="stPipe">0</div><div class="l">In pipeline</div>','<div class="n">25</div><div class="l">Live calculators</div>')
          .replace('Planned tools follow the same standard before release.','All 25 calculators follow the same release standard.')
          .replace('>28</div><div class="stat-label">Live Tools</div>','>25</div><div class="stat-label">Live Tools</div>')
          .replace('>12</div><div class="stat-label">In Pipeline</div>','>0</div><div class="stat-label">In Pipeline</div>');
      }
    }
  };
}
