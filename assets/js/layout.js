/* Lebona: shared header, footer, country/language picker and sticky crisis bar.
   Change NAV or COUNTRIES here once and every page updates. */
(function () {
  'use strict';

  var COUNTRIES = [
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', helpline: '8335',
      emergency: '907', pay: 'Telebirr, CBE or Awash Bank',
      board: 'Ethiopian Ministry of Health', langs: ['en', 'am', 'om', 'ti'] },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', helpline: '1190',
      emergency: '999', pay: 'M-Pesa',
      board: 'Kenya Counsellors and Psychologists Board', langs: ['en', 'sw'] },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼', helpline: '116',
      emergency: '912', pay: 'MTN MoMo or Airtel Money',
      board: 'Rwanda Allied Health Professions Council', langs: ['en', 'rw', 'fr'] }
  ];

  var LANGS = {
    en: 'English', am: 'አማርኛ', om: 'Afaan Oromoo',
    ti: 'ትግርኛ', sw: 'Kiswahili', rw: 'Kinyarwanda', fr: 'Français'
  };

  var NAV = [
    { label: 'Get support', href: 'services.html', children: [
      { label: 'Our services', href: 'services.html', sub: 'Therapy, groups and self-help' },
      { label: 'How it works', href: 'how-it-works.html', sub: 'From intake form to first session' },
      { label: 'Find help', href: 'find-help.html', sub: 'Directory across three countries' },
      { label: 'Fees & payment', href: 'payments.html', sub: 'Mobile money and bank transfer' }
    ]},
    { label: 'Resources', href: 'resources.html', children: [
      { label: 'Self-help tools', href: 'resources.html#tools', sub: 'Breathing, grounding, mood, journal' },
      { label: 'Screening', href: 'resources.html#screening', sub: 'Four anonymous questions' },
      { label: 'Worksheets', href: 'resources.html#worksheets', sub: 'Printable and offline' },
      { label: 'Library', href: 'resources.html#library', sub: 'Plain-language guides' }
    ]},
    { label: 'Trainings', href: 'trainings.html' },
    { label: 'About', href: 'about.html', children: [
      { label: 'Our story', href: 'about.html', sub: 'Why Lebona exists' },
      { label: 'Stories', href: 'stories.html', sub: 'In people’s own words' },
      { label: 'Get involved', href: 'careers.html', sub: 'Careers, volunteering, partners' },
      { label: 'Privacy', href: 'privacy.html', sub: 'Who sees what, and why' }
    ]},
    { label: 'Contact', href: 'contact.html' }
  ];

  var KEY = 'lebona.region';

  function read() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!s || typeof s !== 'object') s = {};
    var c = byCode(s.country) || COUNTRIES[0];
    var lang = c.langs.indexOf(s.lang) > -1 ? s.lang : 'en';
    return { country: c.code, lang: lang };
  }
  function write(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function byCode(code) {
    for (var i = 0; i < COUNTRIES.length; i++) if (COUNTRIES[i].code === code) return COUNTRIES[i];
    return null;
  }

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (here.indexOf('.html') === -1) here = 'index.html';
  function isHere(href) { return href.split('#')[0] === here; }

  var mark =
    '<svg class="brand__mark" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">' +
    '<path d="M29 16a13 13 0 1 1-13-13" stroke="#2E7D32" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M22.6 16A6.6 6.6 0 1 0 16 22.6" stroke="#E07A5F" stroke-width="2.6" stroke-linecap="round"/>' +
    '<circle cx="26.4" cy="6.2" r="2.5" fill="#E07A5F"/></svg>';
  var chev = '<svg width="10" height="7" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var arrow = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var phone = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.2 1.8h2.4l1.2 3-1.6 1.1a8.4 8.4 0 0 0 4.9 4.9l1.1-1.6 3 1.2v2.4a1.6 1.6 0 0 1-1.7 1.6C6.9 14 2 9.1 1.6 3.5a1.6 1.6 0 0 1 1.6-1.7Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function navHTML() {
    return NAV.map(function (item, i) {
      var cur = isHere(item.href) || (item.children || []).some(function (c) { return isHere(c.href); });
      if (!item.children) {
        return '<div class="nav__item"><a class="nav__link" href="' + item.href + '"' +
          (cur ? ' aria-current="page"' : '') + '>' + esc(item.label) + '</a></div>';
      }
      return '<div class="nav__item">' +
        '<a class="nav__link" href="' + item.href + '" aria-haspopup="true"' + (cur ? ' aria-current="page"' : '') + '>' +
        esc(item.label) + chev + '</a>' +
        '<div class="nav__menu">' + item.children.map(function (c) {
          return '<a href="' + c.href + '">' + esc(c.label) + '<span>' + esc(c.sub) + '</span></a>';
        }).join('') + '</div></div>';
    }).join('') +
    '<div class="nav__item"><a class="nav__link nav__link--crisis" href="crisis.html"' +
    (here === 'crisis.html' ? ' aria-current="page"' : '') + '>Crisis support</a></div>';
  }

  function regionHTML() {
    return '<div class="region" data-region>' +
      '<button class="region__btn" type="button" aria-expanded="false" aria-haspopup="dialog" aria-label="Choose your country and language">' +
      '<span class="region__flag" data-region-flag></span><span class="region__label" data-region-label></span>' + chev + '</button>' +
      '<div class="region__pop" role="dialog" aria-label="Country and language" hidden>' +
      '<h4>Your country</h4><div class="region__opts" data-region-countries></div>' +
      '<h4>Language</h4><div class="region__opts region__opts--lang" data-region-langs></div>' +
      '<p class="region__note">Your country sets the helpline, payment options and the therapist pool we match from. Page text is in English for now; your coordinator will speak your language.</p>' +
      '</div></div>';
  }

  function headerHTML() {
    return '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="wrap wrap--wide site-header__inner">' +
      '<a class="brand" href="index.html" aria-label="Lebona, home">' + mark +
      '<span><span class="brand__word">Lebona</span><span class="brand__tag">Your mental well-being, our mission</span></span></a>' +
      '<nav class="nav" aria-label="Main">' + navHTML() + '</nav>' +
      '<div class="header-actions">' + regionHTML() +
      '<a class="btn btn--accent btn--sm" href="match.html">Get matched</a>' +
      '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" data-drawer-open><span></span></button>' +
      '</div></div></header>' +
      drawerHTML();
  }

  function drawerHTML() {
    var groups = NAV.map(function (item) {
      var links = item.children ? item.children : [item];
      return '<div class="drawer__group"><h4>' + esc(item.label) + '</h4>' + links.map(function (c) {
        return '<a href="' + c.href + '"' + (isHere(c.href) && c.href.indexOf('#') === -1 ? ' aria-current="page"' : '') + '>' + esc(c.label) + '</a>';
      }).join('') + '</div>';
    }).join('');
    return '<div class="drawer" data-drawer aria-hidden="true">' +
      '<div class="drawer__scrim" data-drawer-close></div>' +
      '<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="drawer__top"><a class="brand" href="index.html">' + mark + '<span class="brand__word">Lebona</span></a>' +
      '<button class="drawer__close" type="button" aria-label="Close menu" data-drawer-close>' +
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>' +
      groups +
      '<div class="drawer__group"><h4>Right now</h4><a href="crisis.html" style="color:var(--alert-700)">Crisis support</a></div>' +
      '<a class="btn btn--accent btn--block mt-4" href="match.html">Get matched ' + arrow + '</a>' +
      '<a class="btn btn--ghost btn--block mt-3" href="resources.html#tools">Free self-help tools</a>' +
      '</div></div>';
  }

  function footerHTML() {
    var cols = NAV.filter(function (n) { return n.children; }).map(function (n) {
      return '<div><h4>' + esc(n.label) + '</h4><ul>' + n.children.map(function (c) {
        return '<li><a href="' + c.href + '">' + esc(c.label) + '</a></li>';
      }).join('') + '</ul></div>';
    }).join('');
    var lines = COUNTRIES.map(function (c) {
      return '<li><a href="tel:' + c.helpline + '">' + c.flag + ' ' + c.name + ' · ' + c.helpline + '</a></li>';
    }).join('');
    return '<footer class="footer"><div class="wrap wrap--wide">' +
      '<div class="footer__grid">' +
      '<div class="footer__about"><a class="brand" href="index.html">' + mark + '<span class="brand__word">Lebona</span></a>' +
      '<p>Your mental well-being, our mission. Free self-guided tools and human-matched therapy across Ethiopia, Kenya and Rwanda.</p>' +
      '<p><a class="link" href="trainings.html">Trainings for individuals and teams ' + arrow + '</a></p></div>' +
      cols +
      '<div><h4>Crisis lines</h4><ul>' + lines + '<li><a href="crisis.html">All crisis options</a></li><li><a href="contact.html">Contact us</a></li></ul></div>' +
      '</div>' +
      '<div class="footer__bottom"><span>© ' + new Date().getFullYear() + ' Lebona. Not an emergency service.</span>' +
      '<span><a href="privacy.html">Privacy &amp; terms</a></span></div>' +
      '</div></footer>';
  }

  function sosHTML() {
    return '<div class="sos-bar" role="region" aria-label="Crisis helplines">' +
      '<span class="sos-bar__lead"><span class="sos-long">In crisis? Call</span><span class="sos-short">Crisis</span></span><span class="sos-bar__nums">' +
      COUNTRIES.map(function (c) {
        return '<a class="sos-num" data-sos="' + c.code + '" href="tel:' + c.helpline + '" aria-label="Call ' + c.name + ' helpline ' + c.helpline + '">' +
          phone + c.helpline + ' <small>(' + c.code + ')</small></a>';
      }).join('') +
      '</span><a class="sos-more" href="crisis.html">More options</a></div>';
  }

  // ---- Inject ----
  var h = document.querySelector('[data-site-header]');
  if (h) h.outerHTML = headerHTML();
  var f = document.querySelector('[data-site-footer]');
  if (f) f.outerHTML = footerHTML() + sosHTML();

  // ---- Region state, applied to anything on the page that depends on it ----
  function apply(state) {
    var c = byCode(state.country);
    document.documentElement.setAttribute('data-country', c.code);

    each('[data-region-flag]', function (el) { el.textContent = c.flag; });
    each('[data-region-label]', function (el) { el.textContent = c.name + ' · ' + (state.lang === 'en' ? 'EN' : LANGS[state.lang]); });
    each('[data-crisis-country]', function (el) { el.textContent = c.name; });
    each('[data-crisis-num]', function (el) { el.textContent = c.helpline; });
    each('[data-crisis-tel]', function (el) { el.setAttribute('href', 'tel:' + c.helpline); });
    each('[data-crisis-flag]', function (el) { el.textContent = c.flag; });
    each('[data-region-pay]', function (el) { el.textContent = c.pay; });
    each('[data-region-board]', function (el) { el.textContent = c.board; });
    each('[data-region-emergency]', function (el) { el.textContent = c.emergency; });
    each('[data-region-langs]', function (el) {
      if (el.closest('.region__pop')) return;
      el.textContent = c.langs.map(function (l) { return LANGS[l]; }).join(', ');
    });

    // Cards / buttons tagged with a country get highlighted
    each('[data-country-card]', function (el) {
      var on = el.getAttribute('data-country-card') === c.code;
      el.classList.toggle('is-current', on);
      var tag = el.querySelector('.current-tag');
      if (on && !tag) {
        tag = document.createElement('span');
        tag.className = 'pill pill--green pill--dot current-tag';
        tag.textContent = 'Your country';
        el.appendChild(tag);
      } else if (!on && tag) tag.remove();
    });
    each('[data-sos]', function (el) { el.classList.toggle('is-current', el.getAttribute('data-sos') === c.code); });
    each('[data-country-only]', function (el) { el.hidden = el.getAttribute('data-country-only') !== c.code; });

    // Picker contents
    each('[data-region-countries]', function (box) {
      box.innerHTML = COUNTRIES.map(function (x) {
        return '<button type="button" class="region__opt" data-set-country="' + x.code + '" aria-pressed="' + (x.code === c.code) + '">' +
          '<span class="region__flag">' + x.flag + '</span>' + x.name + '<small>' + x.helpline + '</small></button>';
      }).join('');
    });
    each('.region__pop [data-region-langs]', function (box) {
      box.innerHTML = c.langs.map(function (l) {
        return '<button type="button" class="region__opt" data-set-lang="' + l + '" aria-pressed="' + (l === state.lang) + '">' + LANGS[l] + '</button>';
      }).join('');
    });

    document.dispatchEvent(new CustomEvent('lebona:region', { detail: { country: c, lang: state.lang } }));
  }

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  var state = read();

  window.Lebona = {
    COUNTRIES: COUNTRIES,
    LANGS: LANGS,
    NAV: NAV,
    region: function () { return byCode(read().country); },
    state: read,
    setCountry: function (code) {
      var c = byCode(code); if (!c) return;
      state.country = c.code;
      if (c.langs.indexOf(state.lang) === -1) state.lang = 'en';
      write(state); apply(state);
    },
    setLang: function (l) { state.lang = l; write(state); apply(state); },
    apply: function () { apply(read()); }
  };

  // Picker interaction (delegated, so it survives re-renders)
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;
    var setC = t.closest('[data-set-country]');
    if (setC) { window.Lebona.setCountry(setC.getAttribute('data-set-country')); return; }
    var setL = t.closest('[data-set-lang]');
    if (setL) { window.Lebona.setLang(setL.getAttribute('data-set-lang')); return; }
    var btn = t.closest('.region__btn');
    var open = document.querySelector('.region__pop:not([hidden])');
    if (btn) {
      var pop = btn.parentNode.querySelector('.region__pop');
      var willOpen = pop.hidden;
      pop.hidden = !willOpen;
      btn.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    var opener = t.closest('[data-open-region]');
    if (opener) {
      e.preventDefault();
      var b = document.querySelector('.region__btn');
      if (b) { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(function () { b.click(); b.focus(); }, 250); }
      return;
    }
    if (open && !t.closest('.region__pop')) {
      open.hidden = true;
      var ob = open.parentNode.querySelector('.region__btn');
      if (ob) ob.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.region__pop:not([hidden])');
    if (open) {
      open.hidden = true;
      var b = open.parentNode.querySelector('.region__btn');
      b.setAttribute('aria-expanded', 'false'); b.focus();
    }
  });

  apply(state);
})();
