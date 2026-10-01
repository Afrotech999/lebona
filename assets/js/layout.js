/* Lebona: shared header, footer and settings (country + language).
   Change NAV or COUNTRIES here once and every page updates. */
(function () {
  'use strict';

  var COUNTRIES = [
    { code: 'ET', name: 'Ethiopia', helpline: '8335', emergency: '907', pay: 'Telebirr, CBE or Awash Bank',
      board: 'Ethiopian Ministry of Health', langs: ['en', 'am', 'om', 'ti'] },
    { code: 'KE', name: 'Kenya', helpline: '1190', emergency: '999', pay: 'M-Pesa',
      board: 'Kenya Counsellors and Psychologists Board', langs: ['en', 'sw'] },
    { code: 'RW', name: 'Rwanda', helpline: '116', emergency: '912', pay: 'MTN MoMo or Airtel Money',
      board: 'Rwanda Allied Health Professions Council', langs: ['en', 'rw', 'fr'] }
  ];
  var LANGS = { en: 'English', am: 'አማርኛ', om: 'Afaan Oromoo', ti: 'ትግርኛ', sw: 'Kiswahili', rw: 'Kinyarwanda', fr: 'Français' };

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
    { label: 'Contact', href: 'contact.html' },
    { label: 'Crisis support', href: 'crisis.html', crisis: true }
  ];

  var KEY = 'lebona.region';
  function byCode(code) { for (var i = 0; i < COUNTRIES.length; i++) if (COUNTRIES[i].code === code) return COUNTRIES[i]; return null; }
  function read() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!s || typeof s !== 'object') s = {};
    var c = byCode(s.country) || COUNTRIES[0];
    return { country: c.code, lang: c.langs.indexOf(s.lang) > -1 ? s.lang : 'en' };
  }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (here.indexOf('.html') === -1) here = 'index.html';
  function isHere(href) { return href.split('#')[0] === here; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  var mark = '<svg class="brand__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M29 16a13 13 0 1 1-13-13" stroke="#0F766E" stroke-width="3" stroke-linecap="round"/><path d="M22.6 16A6.6 6.6 0 1 0 16 22.6" stroke="#0F172A" stroke-width="3" stroke-linecap="round"/></svg>';
  var chev = '<svg width="10" height="7" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var gear = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  function navHTML() {
    return NAV.map(function (item) {
      var cur = isHere(item.href) || (item.children || []).some(function (c) { return isHere(c.href); });
      var a = '<a class="nav__link' + (item.crisis ? ' nav__link--crisis' : '') + '" href="' + item.href + '"' + (cur ? ' aria-current="page"' : '') + (item.children ? ' aria-haspopup="true"' : '') + '>' + esc(item.label) + (item.children ? chev : '') + '</a>';
      if (!item.children) return '<div class="nav__item">' + a + '</div>';
      return '<div class="nav__item">' + a + '<div class="nav__menu">' + item.children.map(function (c) {
        return '<a href="' + c.href + '">' + esc(c.label) + '<span>' + esc(c.sub) + '</span></a>';
      }).join('') + '</div></div>';
    }).join('');
  }

  function settingsBody() {
    return '<h4>Country</h4><div class="settings__opts" data-settings-countries></div>' +
      '<h4>Language</h4><div class="settings__opts settings__opts--2" data-settings-langs></div>' +
      '<p class="settings__note">Your country sets the helpline, payment options and the therapist pool. Site text is in English for now; your coordinator will speak your language.</p>';
  }

  function headerHTML() {
    return '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="wrap site-header__inner">' +
      '<a class="brand" href="index.html" aria-label="Lebona, home">' + mark + '<span class="brand__word">Lebona</span></a>' +
      '<nav class="nav" aria-label="Main">' + navHTML() + '</nav>' +
      '<div class="header-actions">' +
      '<div class="settings"><button class="settings__btn" type="button" aria-expanded="false" aria-haspopup="dialog" aria-label="Settings: country and language">' + gear + '</button>' +
      '<div class="settings__pop" role="dialog" aria-label="Country and language" hidden>' + settingsBody() + '</div></div>' +
      '<a class="btn btn--accent btn--sm" href="match.html">Get matched</a>' +
      '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" data-drawer-open><span></span></button>' +
      '</div></div></header>' + drawerHTML();
  }

  function drawerHTML() {
    var groups = NAV.map(function (item) {
      var links = item.children || [item];
      return '<div class="drawer__group"><h4>' + esc(item.label) + '</h4>' + links.map(function (c) {
        return '<a href="' + c.href + '"' + (isHere(c.href) && c.href.indexOf('#') === -1 ? ' aria-current="page"' : '') + '>' + esc(c.label) + '</a>';
      }).join('') + '</div>';
    }).join('');
    return '<div class="drawer" data-drawer aria-hidden="true"><div class="drawer__scrim" data-drawer-close></div>' +
      '<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="drawer__top"><a class="brand" href="index.html">' + mark + '<span class="brand__word">Lebona</span></a>' +
      '<button class="drawer__close" type="button" aria-label="Close menu" data-drawer-close><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>' +
      '<a class="btn btn--accent btn--block" href="match.html">Get matched</a>' +
      groups +
      '<div class="drawer__group"><h4>Settings</h4><div class="settings settings--inline"><div class="settings__pop">' + settingsBody() + '</div></div></div>' +
      '</div></div>';
  }

  function footerHTML() {
    var cols = NAV.filter(function (n) { return n.children; }).map(function (n) {
      return '<div><h4>' + esc(n.label) + '</h4><ul>' + n.children.map(function (c) { return '<li><a href="' + c.href + '">' + esc(c.label) + '</a></li>'; }).join('') + '</ul></div>';
    }).join('');
    return '<footer class="footer"><div class="wrap"><div class="footer__grid">' +
      '<div class="footer__about"><a class="brand" href="index.html">' + mark + '<span class="brand__word">Lebona</span></a>' +
      '<p>Your mental well-being, our mission. Free self-guided tools and human-matched therapy across Ethiopia, Kenya and Rwanda.</p></div>' +
      cols +
      '<div><h4>Urgent help</h4><ul><li><a href="crisis.html">Crisis support</a></li><li><a href="contact.html">Contact us</a></li><li><a href="trainings.html">Trainings</a></li></ul></div>' +
      '</div><div class="footer__bottom"><span>© ' + new Date().getFullYear() + ' Lebona. Not an emergency service.</span><span><a href="privacy.html">Privacy &amp; terms</a></span></div></div></footer>';
  }

  var h = document.querySelector('[data-site-header]'); if (h) h.outerHTML = headerHTML();
  var f = document.querySelector('[data-site-footer]'); if (f) f.outerHTML = footerHTML();

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function apply(state) {
    var c = byCode(state.country);
    document.documentElement.setAttribute('data-country', c.code);
    each('[data-crisis-country]', function (el) { el.textContent = c.name; });
    each('[data-crisis-num]', function (el) { el.textContent = c.helpline; });
    each('[data-crisis-tel]', function (el) { el.setAttribute('href', 'tel:' + c.helpline); });
    each('[data-region-pay]', function (el) { el.textContent = c.pay; });
    each('[data-region-board]', function (el) { el.textContent = c.board; });
    each('[data-region-emergency]', function (el) { el.textContent = c.emergency; });
    each('[data-country-card]', function (el) {
      var on = el.getAttribute('data-country-card') === c.code;
      el.classList.toggle('is-current', on);
      var tag = el.querySelector('.current-tag');
      if (on && !tag) { tag = document.createElement('span'); tag.className = 'pill pill--green current-tag'; tag.textContent = 'Your country'; el.appendChild(tag); }
      else if (!on && tag) tag.remove();
    });
    each('[data-sos]', function (el) { el.classList.toggle('is-current', el.getAttribute('data-sos') === c.code); });
    each('[data-settings-countries]', function (box) {
      box.innerHTML = COUNTRIES.map(function (x) {
        return '<button type="button" class="settings__opt" data-set-country="' + x.code + '" aria-pressed="' + (x.code === c.code) + '">' + x.name + '<small>Helpline ' + x.helpline + '</small></button>';
      }).join('');
    });
    each('[data-settings-langs]', function (box) {
      box.innerHTML = c.langs.map(function (l) {
        return '<button type="button" class="settings__opt" data-set-lang="' + l + '" aria-pressed="' + (l === state.lang) + '">' + LANGS[l] + '</button>';
      }).join('');
    });
    document.dispatchEvent(new CustomEvent('lebona:region', { detail: { country: c, lang: state.lang } }));
  }

  var state = read();
  window.Lebona = {
    COUNTRIES: COUNTRIES, LANGS: LANGS, NAV: NAV,
    region: function () { return byCode(read().country); },
    state: read,
    setCountry: function (code) { var c = byCode(code); if (!c) return; state.country = c.code; if (c.langs.indexOf(state.lang) === -1) state.lang = 'en'; write(state); apply(state); },
    setLang: function (l) { state.lang = l; write(state); apply(state); }
  };

  function closePops() {
    each('.settings__pop:not([hidden])', function (p) {
      if (p.closest('.settings--inline')) return;
      p.hidden = true; var b = p.parentNode.querySelector('.settings__btn'); if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    var sc = t.closest('[data-set-country]'); if (sc) return window.Lebona.setCountry(sc.getAttribute('data-set-country'));
    var sl = t.closest('[data-set-lang]'); if (sl) return window.Lebona.setLang(sl.getAttribute('data-set-lang'));
    var btn = t.closest('.settings__btn');
    if (btn) { var pop = btn.parentNode.querySelector('.settings__pop'); var open = pop.hidden; closePops(); pop.hidden = !open; btn.setAttribute('aria-expanded', String(open)); return; }
    var opener = t.closest('[data-open-settings]');
    if (opener) {
      e.preventDefault();
      var b = document.querySelector('.settings:not(.settings--inline) .settings__btn');
      if (b && b.offsetParent) { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(function () { b.click(); b.focus(); }, 250); }
      else { var o = document.querySelector('[data-drawer-open]'); if (o) o.click(); }
      return;
    }
    if (!t.closest('.settings__pop')) closePops();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(); });

  apply(state);
})();
