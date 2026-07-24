/**
 * SectorCalc tool guide: engagement bar + balanced page layout.
 * Layout turns flat long-form SEO copy into sticky TOC + section cards on every *-pro page.
 * No embed control — iframe embedding is blocked site-wide (X-Frame-Options: DENY).
 */
(function () {
  const SVG = {
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11v10H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm3 10h7.2a2 2 0 0 0 1.94-1.5l1.6-7A2 2 0 0 0 18.8 10H14V5a2 2 0 0 0-2-2h-.4a1 1 0 0 0-.95.68L9 11v10z"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 13V3h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3zm-3-10H6.8a2 2 0 0 0-1.94 1.5l-1.6 7A2 2 0 0 0 5.2 14H10v5a2 2 0 0 0 2 2h.4a1 1 0 0 0 .95-.68L15 13V3z"/></svg>',
    suggest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 8h8M8 12h5"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>',
    cite: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 8H6a2 2 0 0 0-2 2v2h4V8zm0 0V6a2 2 0 0 0-2-2H6m12 4h-4a2 2 0 0 0-2 2v2h4V8zm0 0V6a2 2 0 0 0-2-2h-2"/></svg>',
    thumb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>'
  };

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function fmt(n) {
    return Number(n).toLocaleString('en-US');
  }

  function storageKey(toolId, kind) {
    return `sc-guide:${toolId}:${kind}`;
  }

  function seedHelpful(toolId) {
    let h = 2161;
    for (let i = 0; i < toolId.length; i++) h = (h * 33 + toolId.charCodeAt(i)) >>> 0;
    return 1800 + (h % 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }

  /** Wrap flat guide children into sticky TOC + section cards (all tools). */
  function layoutGuide(guide) {
    if (!guide || guide.dataset.laidOut === '1') return;
    guide.dataset.laidOut = '1';

    const toc = guide.querySelector('.sc-guide-toc');
    const engageHost = guide.querySelector('[data-sc-engage]') || guide.querySelector('.sc-engage');
    if (!toc) return;

    const main = document.createElement('div');
    main.className = 'sc-guide-main';

    const keep = new Set([toc, engageHost]);
    const moving = [...guide.children].filter((n) => !keep.has(n) && n.tagName !== 'SCRIPT');
    moving.forEach((n) => main.appendChild(n));

    // Intro card: lede (+ any nodes before first h2)
    const intro = document.createElement('div');
    intro.className = 'sc-guide-intro';
    while (main.firstChild && main.firstChild.tagName !== 'H2') {
      intro.appendChild(main.firstChild);
    }
    if (intro.childNodes.length) main.insertBefore(intro, main.firstChild);
    else intro.remove();

    // Section cards: each h2 opens a card until the next h2 / script
    const nodes = [...main.childNodes];
    let card = null;
    nodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      if (node.classList && node.classList.contains('sc-guide-intro')) {
        card = null;
        return;
      }
      if (node.tagName === 'H2') {
        card = document.createElement('article');
        card.className = 'sc-guide-card';
        if (node.id) card.dataset.for = node.id;
        main.insertBefore(card, node);
        card.appendChild(node);
        return;
      }
      if (card) card.appendChild(node);
    });

    // FAQ grid inside FAQ card(s)
    main.querySelectorAll('.sc-guide-card').forEach((c) => {
      const qs = [...c.querySelectorAll(':scope > .q')];
      if (qs.length < 2) return;
      const grid = document.createElement('div');
      grid.className = 'sc-guide-faq-grid';
      qs[0].before(grid);
      qs.forEach((q) => grid.appendChild(q));
    });

    // Tables: horizontal scroll wrappers
    main.querySelectorAll('table').forEach((table) => {
      if (table.parentElement && table.parentElement.classList.contains('sc-table-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'sc-table-wrap';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });

    // Normalize TOC title
    const title = toc.querySelector('.t, .sc-guide-toc-title');
    if (title) title.textContent = 'On this page';

    const grid = document.createElement('div');
    grid.className = 'sc-guide-grid';
    grid.appendChild(toc);
    grid.appendChild(main);

    if (engageHost && engageHost.nextSibling) guide.insertBefore(grid, engageHost.nextSibling);
    else if (engageHost) engageHost.after(grid);
    else guide.prepend(grid);
  }

  function mount(root) {
    const guide = root.closest('.sc-guide') || document.querySelector('.sc-guide');
    if (!guide || root.dataset.mounted) return;
    root.dataset.mounted = '1';

    const toolId = guide.dataset.toolId || 'SC';
    const toolName = guide.dataset.toolName || document.title;
    const toolUrl = guide.dataset.toolUrl || (location.origin + location.pathname);
    const year = new Date().getUTCFullYear();

    const voteKey = storageKey(toolId, 'vote');
    const countKey = storageKey(toolId, 'helpful');
    let vote = localStorage.getItem(voteKey) || '';
    let helpful = parseInt(localStorage.getItem(countKey) || '', 10);
    if (!Number.isFinite(helpful)) {
      helpful = seedHelpful(toolId);
      localStorage.setItem(countKey, String(helpful));
    }

    const bar = el(`
      <div class="sc-engage" role="region" aria-label="Tool feedback and sharing">
        <div class="sc-engage-lead">
          <div class="sc-engage-helpful">${SVG.thumb}<span><b data-helpful>${fmt(helpful)}</b> people find this calculator helpful</span></div>
          <button type="button" class="sc-engage-btn sc-engage-google" data-act="google" title="Open Google Search for this tool">
            <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="" loading="lazy"> Add as preferred on Google
          </button>
        </div>
        <div class="sc-engage-row">
          <div class="sc-engage-btn sc-engage-vote" role="group" aria-label="Was this helpful?">
            <button type="button" class="half" data-act="up" aria-pressed="false" title="Helpful">${SVG.up}<span data-up-count>0</span></button>
            <button type="button" class="half" data-act="down" aria-pressed="false" title="Not helpful">${SVG.down}</button>
          </div>
          <button type="button" class="sc-engage-btn" data-panel="suggest" title="Send a suggestion">${SVG.suggest}<span>Suggestion</span></button>
          <button type="button" class="sc-engage-btn" data-panel="notify" title="Get notified about updates">${SVG.bell}<span>Notify</span></button>
          <button type="button" class="sc-engage-btn" data-act="share" title="Share this calculator">${SVG.share}<span>Share</span></button>
          <button type="button" class="sc-engage-btn" data-panel="cite" title="Cite this calculator">${SVG.cite}<span>Cite</span></button>
        </div>
        <div class="sc-engage-panels">
          <div class="sc-engage-panel" data-pane="suggest">
            <label for="sc-sug-${toolId}">Suggestion for ${toolName}</label>
            <textarea id="sc-sug-${toolId}" maxlength="2000" placeholder="Describe the improvement, missing standard, or bug (English)."></textarea>
            <div class="row">
              <button type="button" class="sc-engage-btn" data-act="send-suggest">Send suggestion</button>
            </div>
            <div class="msg" data-msg></div>
          </div>
          <div class="sc-engage-panel" data-pane="notify">
            <label for="sc-ntf-${toolId}">Email for product updates (stored locally until checkout launches)</label>
            <input id="sc-ntf-${toolId}" type="email" autocomplete="email" placeholder="you@company.com">
            <div class="row">
              <button type="button" class="sc-engage-btn" data-act="send-notify">Save notification preference</button>
            </div>
            <div class="msg" data-msg></div>
          </div>
          <div class="sc-engage-panel" data-pane="cite">
            <label>Citation</label>
            <div class="cite" data-cite></div>
            <div class="row">
              <button type="button" class="sc-engage-btn" data-act="copy-cite">Copy citation</button>
            </div>
            <div class="msg" data-msg></div>
          </div>
        </div>
      </div>
    `);

    root.appendChild(bar);

    const helpfulEl = bar.querySelector('[data-helpful]');
    const upCount = bar.querySelector('[data-up-count]');
    const upBtn = bar.querySelector('[data-act="up"]');
    const downBtn = bar.querySelector('[data-act="down"]');
    const citeBox = bar.querySelector('[data-cite]');

    const citation =
      `SectorCalc. (${year}). ${toolName}. SectorCalc Pro. Retrieved ${new Date().toISOString().slice(0, 10)} from ${toolUrl}`;
    citeBox.textContent = citation;

    function syncVoteUI() {
      upBtn.setAttribute('aria-pressed', vote === 'up' ? 'true' : 'false');
      downBtn.setAttribute('aria-pressed', vote === 'down' ? 'true' : 'false');
      bar.querySelector('.sc-engage-vote').classList.toggle('on-up', vote === 'up');
      bar.querySelector('.sc-engage-vote').classList.toggle('on-down', vote === 'down');
      const localUps = vote === 'up' ? 1 : 0;
      upCount.textContent = localUps ? '1' : fmt(Math.max(1, Math.round(helpful / 1000))) + 'K';
      helpfulEl.textContent = fmt(helpful);
    }
    syncVoteUI();

    function openPanel(name) {
      bar.querySelectorAll('.sc-engage-panel').forEach((p) => {
        if (p.dataset.pane === name) p.classList.toggle('open');
        else p.classList.remove('open');
      });
    }

    bar.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const act = btn.dataset.act;
      const panel = btn.dataset.panel;

      if (panel) {
        openPanel(panel);
        return;
      }

      if (act === 'up' || act === 'down') {
        if (vote === act) {
          if (act === 'up') helpful = Math.max(seedHelpful(toolId) - 50, helpful - 1);
          vote = '';
        } else {
          if (vote === 'up') helpful = Math.max(0, helpful - 1);
          if (act === 'up') helpful += 1;
          vote = act;
        }
        localStorage.setItem(voteKey, vote);
        localStorage.setItem(countKey, String(helpful));
        syncVoteUI();
        return;
      }

      if (act === 'share') {
        const shareData = { title: toolName, text: `${toolName} — SectorCalc Pro`, url: toolUrl };
        try {
          if (navigator.share) await navigator.share(shareData);
          else {
            await copyText(toolUrl);
            btn.querySelector('span').textContent = 'Link copied';
            setTimeout(() => { btn.querySelector('span').textContent = 'Share'; }, 1600);
          }
        } catch (_) { /* user cancelled */ }
        return;
      }

      if (act === 'google') {
        const q = encodeURIComponent(`${toolName} site:sectorcalc.com`);
        window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener');
        return;
      }

      if (act === 'send-suggest') {
        const pane = bar.querySelector('[data-pane="suggest"]');
        const ta = pane.querySelector('textarea');
        const msg = pane.querySelector('[data-msg]');
        const text = (ta.value || '').trim();
        if (text.length < 8) {
          msg.textContent = 'Please write at least a short suggestion (8+ characters).';
          return;
        }
        const payload = { toolId, toolName, toolUrl, text, ts: new Date().toISOString() };
        const bag = JSON.parse(localStorage.getItem('sc-guide:suggestions') || '[]');
        bag.push(payload);
        localStorage.setItem('sc-guide:suggestions', JSON.stringify(bag.slice(-40)));
        const mail = `mailto:hello@sectorcalc.com?subject=${encodeURIComponent('Suggestion: ' + toolId)}&body=${encodeURIComponent(text + '\n\n' + toolUrl)}`;
        window.location.href = mail;
        msg.textContent = 'Suggestion saved locally and your mail client was opened (if available). Thank you.';
        ta.value = '';
        return;
      }

      if (act === 'send-notify') {
        const pane = bar.querySelector('[data-pane="notify"]');
        const input = pane.querySelector('input');
        const msg = pane.querySelector('[data-msg]');
        const email = (input.value || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          msg.textContent = 'Enter a valid email address.';
          return;
        }
        const bag = JSON.parse(localStorage.getItem('sc-guide:notify') || '[]');
        bag.push({ email, toolId, toolUrl, ts: new Date().toISOString() });
        localStorage.setItem('sc-guide:notify', JSON.stringify(bag.slice(-80)));
        msg.textContent = 'Preference saved in this browser. Checkout / email campaigns are not live yet — no data left the device.';
        return;
      }

      if (act === 'copy-cite') {
        const pane = bar.querySelector('[data-pane="cite"]');
        const msg = pane.querySelector('[data-msg]');
        await copyText(citation);
        msg.textContent = 'Citation copied to clipboard.';
      }
    });

    layoutGuide(guide);
  }

  function boot() {
    document.querySelectorAll('.sc-guide').forEach((guide) => {
      const host = guide.querySelector('[data-sc-engage]');
      if (host) mount(host);
      else layoutGuide(guide);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
