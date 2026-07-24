/**
 * SECTORCALC — Core Web Vitals monitor (production-safe)
 * Reports LCP / INP / CLS / TTFB / FCP via console.
 * GA4 send stays OFF until GA_MEASUREMENT_ID is a real G- ID.
 */
(function () {
  'use strict';
  if (!('PerformanceObserver' in window)) return;

  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // set real GA4 ID to enable send
  const SEND_TO_GA = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX';
  const SEND_TO_CONSOLE = true;

  function sendToGA(eventName, params) {
    if (!SEND_TO_GA) return;
    if (window.gtag) {
      window.gtag('event', eventName, params);
    } else {
      window.__cvw_queue = window.__cvw_queue || [];
      window.__cvw_queue.push({ eventName, params });
    }
  }

  let lcpValue = 0;
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) lcpValue = last.renderTime || last.loadTime || last.startTime || 0;
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        try { lcpObserver.disconnect(); } catch (e) {}
      }
    }, { once: true });
  } catch (e) {}

  let clsValue = 0;
  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}

  let inpValue = 0;
  try {
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.interactionId > 0) {
          const duration = entry.duration || (entry.processingEnd - entry.startTime) || 0;
          if (duration > inpValue) inpValue = duration;
        }
      }
    });
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch (e) {}

  function getTTFB() {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav ? nav.responseStart - nav.startTime : 0;
  }
  function getFCP() {
    const entries = performance.getEntriesByName('first-contentful-paint');
    return entries.length ? entries[0].startTime : 0;
  }

  let reported = false;
  function reportCVW() {
    if (reported) return;
    reported = true;
    const ttfb = getTTFB();
    const fcp = getFCP();

    if (lcpValue > 0) {
      const rating = lcpValue <= 2500 ? 'good' : lcpValue <= 4000 ? 'needs-improvement' : 'poor';
      sendToGA('cvw_lcp', { event_category: 'Core Web Vitals', value: Math.round(lcpValue), cvw_rating: rating });
      if (SEND_TO_CONSOLE) console.log('[CVW] LCP:', Math.round(lcpValue), 'ms —', rating);
    }
    if (clsValue >= 0) {
      const rating = clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor';
      sendToGA('cvw_cls', { event_category: 'Core Web Vitals', value: Math.round(clsValue * 1000) / 1000, cvw_rating: rating });
      if (SEND_TO_CONSOLE) console.log('[CVW] CLS:', Math.round(clsValue * 1000) / 1000, '—', rating);
    }
    if (inpValue > 0) {
      const rating = inpValue <= 200 ? 'good' : inpValue <= 500 ? 'needs-improvement' : 'poor';
      sendToGA('cvw_inp', { event_category: 'Core Web Vitals', value: Math.round(inpValue), cvw_rating: rating });
      if (SEND_TO_CONSOLE) console.log('[CVW] INP:', Math.round(inpValue), 'ms —', rating);
    }
    if (ttfb > 0) {
      const rating = ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor';
      sendToGA('cvw_ttfb', { event_category: 'Core Web Vitals', value: Math.round(ttfb), cvw_rating: rating });
      if (SEND_TO_CONSOLE) console.log('[CVW] TTFB:', Math.round(ttfb), 'ms —', rating);
    }
    if (fcp > 0) {
      sendToGA('cvw_fcp', { event_category: 'Core Web Vitals', value: Math.round(fcp) });
      if (SEND_TO_CONSOLE) console.log('[CVW] FCP:', Math.round(fcp), 'ms');
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') reportCVW();
  });
  window.addEventListener('pagehide', reportCVW);
  setTimeout(reportCVW, 10000);
})();
