/* Lebona: page behaviour shared by every page.
   Sticky header, drawer, reveals, accordions, counters, table hints, country tabs. */
(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Sticky header shadow ----
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Drawer ----
  var drawer = $('[data-drawer]');
  var opener = $('[data-drawer-open]');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (opener) opener.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) { var c = $('.drawer__close', drawer); if (c) c.focus(); }
    else if (opener) opener.focus();
  }
  if (opener) opener.addEventListener('click', function () { setDrawer(true); });
  $$('[data-drawer-close]').forEach(function (el) { el.addEventListener('click', function () { setDrawer(false); }); });
  if (drawer) $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) setDrawer(false);
  });

  // ---- Reveal on scroll ----
  var revealEls = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduce) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content invisible
    setTimeout(function () { revealEls.forEach(function (el) { el.classList.add('is-in'); }); }, 2500);
  }

  // ---- Accordions ----
  $$('.acc__trigger').forEach(function (btn) {
    var item = btn.closest('.acc__item');
    btn.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      var group = item.closest('[data-accordion-exclusive]');
      if (open && group) {
        $$('.acc__item.is-open', group).forEach(function (o) {
          if (o !== item) { o.classList.remove('is-open'); $('.acc__trigger', o).setAttribute('aria-expanded', 'false'); }
        });
      }
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  // Open an accordion item when linked to directly
  function openFromHash() {
    if (!location.hash) return;
    var t = document.getElementById(location.hash.slice(1));
    if (t && t.classList.contains('acc__item') && !t.classList.contains('is-open')) $('.acc__trigger', t).click();
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  // ---- Counters ----
  $$('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    function done() { el.textContent = target + suffix; }
    if (reduce || !('IntersectionObserver' in window)) return done();
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now(), dur = 1100;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
    o.observe(el);
  });

  // ---- "Scroll sideways" hint only when a table overflows ----
  function hints() {
    $$('.table-wrap').forEach(function (w) {
      var hint = w.previousElementSibling;
      if (hint && hint.classList.contains('table-hint')) hint.classList.toggle('is-visible', w.scrollWidth > w.clientWidth + 2);
    });
  }
  hints();
  window.addEventListener('resize', hints);

  // ---- Country tabs (crisis page) ----
  var tabs = $$('[data-country-tab]');
  if (tabs.length) {
    var chosenByUser = false;
    var select = function (code, focus) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-country-tab') === code;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      $$('[data-country-panel]').forEach(function (p) {
        if (p.getAttribute('data-country-panel') === code) p.removeAttribute('data-inactive');
        else p.setAttribute('data-inactive', '');
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { chosenByUser = true; select(t.getAttribute('data-country-tab')); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length];
        chosenByUser = true;
        select(n.getAttribute('data-country-tab'), true);
      });
    });
    var initial = window.Lebona ? window.Lebona.region().code : tabs[0].getAttribute('data-country-tab');
    select(initial);
    document.addEventListener('lebona:region', function (e) { if (!chosenByUser) select(e.detail.country.code); });
  }
})();
