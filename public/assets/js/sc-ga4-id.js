/**
 * SectorCalc GA4 Measurement ID + early gtag bootstrap.
 * Measurement ID from Google Analytics Admin → Data Streams → Web.
 * Must load in <head> so page_view is not lost behind body/CSP races.
 */
(function () {
  'use strict';
  var ID = 'G-WGJ2K86B38';
  window.__SC_GA4_ID__ = ID;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
  // Consent defaults: allow analytics so Realtime is not stuck waiting.
  // Update these only if you add a real CMP cookie banner later.
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
    wait_for_update: 0,
  });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
  var first = document.getElementsByTagName('script')[0];
  if (first && first.parentNode) {
    first.parentNode.insertBefore(s, first);
  } else {
    (document.head || document.documentElement).appendChild(s);
  }
  window.gtag('js', new Date());
  window.gtag('config', ID, { anonymize_ip: true, send_page_view: true });
})();
