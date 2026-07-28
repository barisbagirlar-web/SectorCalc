/**
 * SectorCalc shared site header — mobile menu + active link + homepage anchors.
 */
(function () {
  function isHome() {
    const p = location.pathname.replace(/\/+$/, '') || '/';
    return p === '/' || p === '/index.html' || p.endsWith('/index.html');
  }

  function boot() {
    document.body.classList.add('has-site-header');

    const home = isHome();
    document.querySelectorAll('[data-nav-home]').forEach((a) => {
      const hash = a.getAttribute('data-nav-home');
      a.setAttribute('href', home ? hash : '/' + hash);
    });

    const path = location.pathname;
    document
      .querySelectorAll('.site-header [data-nav], .mobile-nav-overlay [data-nav]')
      .forEach((a) => {
        const key = a.getAttribute('data-nav');
        let on = false;
        if (key === 'tools' && /tools\.html$/.test(path)) on = true;
        if (key === 'pricing' && /pricing\.html$/.test(path)) on = true;
        if (key === 'glossary' && /\/glossary(\/|$)/.test(path)) on = true;
        if (key === 'guides' && /\/guides(\/|$)/.test(path)) on = true;
        if (key === 'compare' && /\/compare(\/|$)/.test(path)) on = true;
        if (key === 'home' && isHome()) on = true;
        if (on) a.setAttribute('aria-current', 'page');
      });

    const badge = document.body.getAttribute('data-tool-badge');
    const badgeEl = document.querySelector('.site-header .sc-nav-tool');
    if (badge && badgeEl) badgeEl.textContent = badge;

    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('active', open);
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    btn.addEventListener('click', () => setOpen(!nav.classList.contains('active')));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
