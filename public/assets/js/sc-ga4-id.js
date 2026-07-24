/**
 * SectorCalc GA4 Measurement ID + early gtag bootstrap.
 * Measurement ID from Google Analytics Admin → Data Streams → Web.
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
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
  document.head.appendChild(s);
  window.gtag('js', new Date());
  window.gtag('config', ID, { anonymize_ip: true, send_page_view: true });
})();
