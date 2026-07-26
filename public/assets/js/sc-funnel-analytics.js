/**
 * SectorCalc search→revenue funnel events (GA4).
 * Never send calculator input values, emails, or other PII.
 */
(function () {
  'use strict';

  var ALLOWED = {
    calculator_view: 1,
    calculator_start: 1,
    calculator_complete: 1,
    demo_load: 1,
    audit_open: 1,
    guide_click: 1,
    pricing_view: 1,
    checkout_start: 1,
    purchase: 1,
  };

  function ctx() {
    var b = document.body || {};
    var path = (location && location.pathname) || '';
    return {
      tool_id: b.getAttribute && b.getAttribute('data-sc-tool-id') || undefined,
      canonical_path: b.getAttribute && b.getAttribute('data-sc-canonical') || path,
      query_cluster: b.getAttribute && b.getAttribute('data-sc-query-cluster') || undefined,
      revenue_tier: b.getAttribute && b.getAttribute('data-sc-revenue-tier') || undefined,
      traffic_source: 'web',
    };
  }

  function clean(params) {
    var out = {};
    var base = ctx();
    var src = params || {};
    var key;
    for (key in base) {
      if (base[key] != null && base[key] !== '') out[key] = base[key];
    }
    for (key in src) {
      if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
      if (key === 'value' || key === 'currency' || key === 'transaction_id' || key === 'items') {
        out[key] = src[key];
        continue;
      }
      // Block accidental input dumps
      if (/input|salary|email|phone|password|address/i.test(key)) continue;
      if (src[key] != null && src[key] !== '') out[key] = src[key];
    }
    return out;
  }

  function track(name, params) {
    if (!ALLOWED[name]) return;
    var payload = clean(params);
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, payload);
    } else {
      window.dataLayer.push({ event: name, ...payload });
    }
    window.dispatchEvent(new CustomEvent('sectorcalc-funnel', { detail: { name: name, params: payload } }));
  }

  window.scTrack = track;

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    var path = location.pathname || '';
    var pageRole = document.body && document.body.getAttribute('data-sc-page-role');
    if (pageRole === 'pricing' || /pricing\.html$/.test(path) || path === '/pricing' || path === '/pricing/') {
      track('pricing_view');
    }

    if (document.body && document.body.getAttribute('data-sc-tool-id')) {
      track('calculator_view');
    }

    document.addEventListener(
      'click',
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        var calc = t.closest('#calcBtn, #genReport, [data-sc-funnel="calculate"]');
        if (calc) {
          track('calculator_start');
          window.setTimeout(function () {
            track('calculator_complete');
          }, 0);
          return;
        }
        var demo = t.closest('.sc-preset, [data-sc-funnel="demo"], button[data-preset]');
        if (demo) {
          track('demo_load', { demo_id: demo.getAttribute('data-preset') || demo.textContent.trim().slice(0, 40) });
          return;
        }
        var guide = t.closest('a[href^="/guides/"], a[href*="/guides/"], .sc-guide a, #sc-guide a');
        if (guide && guide.href) {
          track('guide_click', { link_path: guide.pathname || undefined });
          return;
        }
        var pricing = t.closest('a[href*="pricing"], [data-sc-funnel="pricing"]');
        if (pricing) track('pricing_view');
      },
      true,
    );

    document.addEventListener(
      'toggle',
      function (ev) {
        var el = ev.target;
        if (!el || el.tagName !== 'DETAILS') return;
        if (!el.open) return;
        if (el.querySelector('#aEngine, #aInputs, #aFormulas, #aAssump, #aWarn') || /A1|audit/i.test(el.textContent || '')) {
          track('audit_open');
        }
      },
      true,
    );
  });

  window.addEventListener('sectorcalc-checkout', function (ev) {
    var detail = (ev && ev.detail) || {};
    if (detail.name === 'checkout.open' || detail.name === 'checkout.loaded') {
      track('checkout_start');
      return;
    }
    if (detail.name === 'checkout.completed') {
      track('purchase', {
        transaction_id: detail.transactionId || undefined,
        value: typeof detail.value === 'number' ? detail.value : undefined,
        currency: detail.currency || undefined,
      });
    }
  });
})();
