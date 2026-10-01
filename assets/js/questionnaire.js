/* Lebona intake form.
   Every question lives in STEPS below: add, reorder or reword there and progress,
   validation and branching follow automatically. Adapted from PHQ-4, GAD-7 and WHO-5
   for a manual, human-reviewed matching process. */
(function () {
  'use strict';

  // Mirrors COUNTRIES in layout.js (this page does not load layout.js).
  var COUNTRIES = {
    ET: { name: 'Ethiopia', helpline: '8335', emergency: '907', pay: 'Telebirr, CBE or Awash Bank',
          langs: [['am', 'አማርኛ · Amharic'], ['om', 'Afaan Oromoo'], ['ti', 'ትግርኛ · Tigrinya'], ['en', 'English']] },
    KE: { name: 'Kenya', helpline: '1190', emergency: '999', pay: 'M-Pesa',
          langs: [['sw', 'Kiswahili'], ['en', 'English']] },
    RW: { name: 'Rwanda', helpline: '116', emergency: '912', pay: 'MTN MoMo or Airtel Money',
          langs: [['rw', 'Kinyarwanda'], ['en', 'English'], ['fr', 'Français']] }
  };
  var FREQ = [['0', 'Not at all'], ['1', 'Several days'], ['2', 'More than half the days'], ['3', 'Nearly every day']];
  var KEY = 'lebona.intake.v2';

  var STEPS = [
    { id: 'tier', section: 'About your visit', title: 'What brings you to Lebona today?',
      help: 'There is no wrong answer. This only decides how we route your form.',
      options: [
        ['proactive', 'Proactive self-growth', 'Stress, balance, confidence, building habits before things get hard.'],
        ['therapy', 'Ongoing therapy', 'Something has been weighing on me and I would like regular support.'],
        ['urgent', 'I need help urgently', 'I am struggling a lot right now or I do not feel safe.', 'urgent']
      ] },

    { id: 'crisis', section: 'Your safety first', title: 'Please don’t wait for us.',
      help: 'Lebona matching is done by people and takes 24–48 hours. If you are in danger or might act on thoughts of harming yourself, call your national helpline now. It is free and answered around the clock.',
      type: 'crisis', skip: function (a) { return a.tier !== 'urgent'; },
      options: [['safe', 'I am safe right now and want to continue', 'We will still read your form carefully.']] },

    { id: 'country', section: 'About you', title: 'Which country are you in?',
      help: 'This decides which pool of licensed psychologists your coordinator draws from, and how you pay.',
      options: [['ET', 'Ethiopia'], ['KE', 'Kenya'], ['RW', 'Rwanda']] },

    { id: 'focus', section: 'About you', title: 'What would you most like support with?',
      help: 'Pick the closest one. You can say more to your coordinator later.',
      options: [
        ['stress', 'Stress and burnout'], ['anxiety', 'Anxiety and worry'], ['mood', 'Low mood or depression'],
        ['relationships', 'Relationships and family'], ['grief', 'Grief, loss or trauma'], ['growth', 'Personal growth and confidence']
      ], cols: 2 },

    { id: 'phq1', section: 'How you have been', title: 'Over the last two weeks, how often have you felt nervous, anxious or on edge?', options: FREQ, cols: 2 },
    { id: 'phq2', section: 'How you have been', title: 'How often have you not been able to stop or control worrying?', options: FREQ, cols: 2 },
    { id: 'phq3', section: 'How you have been', title: 'How often have you had little interest or pleasure in doing things?', options: FREQ, cols: 2 },
    { id: 'phq4', section: 'How you have been', title: 'How often have you felt down, depressed or hopeless?', options: FREQ, cols: 2 },
    { id: 'harm', section: 'How you have been', title: 'How often have you had thoughts that you would be better off dead, or of hurting yourself?',
      help: 'We ask everyone this. Answering honestly helps us look after you.', options: FREQ, cols: 2 },

    { id: 'rel_imp', section: 'Faith and values', title: 'How important is religion or spirituality in your life?',
      options: [['very', 'Very important'], ['some', 'Somewhat important'], ['not', 'Not important at all'], ['na', 'Prefer not to say']] },
    { id: 'rel', section: 'Faith and values', title: 'Which faith, if any, do you practise?',
      skip: function (a) { return a.rel_imp === 'not'; },
      options: [['orthodox', 'Orthodox Christian'], ['protestant', 'Protestant or Evangelical'], ['catholic', 'Catholic'],
        ['muslim', 'Muslim'], ['other', 'Another faith'], ['na', 'Prefer not to say']], cols: 2 },
    { id: 'rel_ther', section: 'Faith and values', title: 'Would you like a therapist who brings faith into the work?',
      help: 'Faith only enters the room if you bring it there.',
      skip: function (a) { return a.rel_imp === 'not' || a.rel === 'na' || a.rel_imp === 'na'; },
      options: [['yes', 'Yes, faith-informed therapy'], ['no', 'No, keep it secular'], ['either', 'I don’t mind']] },

    { id: 'lang', section: 'Your match', title: 'Which language would you like your sessions in?',
      options: function (a) { return (COUNTRIES[a.country] || COUNTRIES.ET).langs; } },
    { id: 'gender', section: 'Your match', title: 'Do you have a preference for your therapist’s gender?',
      options: [['f', 'Female'], ['m', 'Male'], ['any', 'No preference']] },
    { id: 'approach', section: 'Your match', title: 'What kind of approach suits you?',
      options: [
        ['practical', 'Practical and structured', 'Tools, exercises and goals between sessions.'],
        ['talk', 'Space to talk things through', 'Being listened to and understanding patterns.'],
        ['unsure', 'Not sure yet', 'Your coordinator will help you decide.']
      ] },
    { id: 'prev', section: 'Your match', title: 'Have you spoken to a therapist or counsellor before?',
      options: [['no', 'No, this would be my first time'], ['past', 'Yes, in the past'], ['now', 'Yes, I am seeing someone now']] },

    { id: 'format', section: 'Practical details', title: 'How would you like to meet?',
      options: [['video', 'Video call'], ['phone', 'Phone call'], ['msg', 'Messaging'], ['inperson', 'In person, where available']], cols: 2 },
    { id: 'channel', section: 'Practical details', title: 'How should your coordinator contact you?',
      options: [['whatsapp', 'WhatsApp'], ['telegram', 'Telegram'], ['phone', 'Phone call'], ['email', 'Email']], cols: 2 },
    { id: 'time', section: 'Practical details', title: 'When is the best time to reach you?',
      options: [['morning', 'Morning', '08:00 to 12:00'], ['afternoon', 'Afternoon', '12:00 to 17:00'], ['evening', 'Evening', '17:00 to 21:00'], ['any', 'Any time']], cols: 2 },

    { id: 'contact', section: 'Last step', title: 'How can we reach you?', type: 'fields',
      help: 'A human care coordinator will read this form. Nobody else at Lebona sees it.' }
  ];

  // Answers that become stale when an earlier answer changes.
  var DEPENDS = { tier: ['crisis'], country: ['lang'], rel_imp: ['rel', 'rel_ther'], rel: ['rel_ther'], channel: ['handle'] };

  // ---- State ----
  var state = load();
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!s || typeof s !== 'object') s = {};
    s.a = s.a || {}; s.i = s.i || 0; s.done = !!s.done;
    if (!s.a.country) {
      try { var r = JSON.parse(localStorage.getItem('lebona.region') || 'null'); if (r && COUNTRIES[r.country]) s.a.country = r.country; } catch (e) {}
    }
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function visible() { return STEPS.filter(function (s) { return !s.skip || !s.skip(state.a); }); }

  var stage = document.getElementById('stage');
  var next = document.getElementById('next');
  var back = document.getElementById('back');
  var bar = document.getElementById('bar');
  var count = document.getElementById('count');
  var foot = document.getElementById('foot');
  var restart = document.getElementById('restart');

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function country() { return COUNTRIES[state.a.country] || COUNTRIES.ET; }
  function optsFor(step) { return typeof step.options === 'function' ? step.options(state.a) : step.options; }
  function labelFor(step, v) {
    var o = (optsFor(step) || []).filter(function (x) { return x[0] === v; })[0];
    return o ? o[1] : '';
  }

  var callIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.2 1.8h2.4l1.2 3-1.6 1.1a8.4 8.4 0 0 0 4.9 4.9l1.1-1.6 3 1.2v2.4a1.6 1.6 0 0 1-1.7 1.6C6.9 14 2 9.1 1.6 3.5a1.6 1.6 0 0 1 1.6-1.7Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  function callButtons() {
    var cur = state.a.country;
    return '<div class="q-crisis">' + Object.keys(COUNTRIES).map(function (k) {
      var c = COUNTRIES[k];
      return '<a class="call-btn' + (k === cur ? ' is-current' : '') + '" href="tel:' + c.helpline + '">' +
        '<span class="call-btn__txt"><span class="call-btn__sub">' + c.name + ' helpline</span>' +
        '<span class="call-btn__num">' + c.helpline + '</span></span><span class="call-btn__icon">' + callIcon + '</span></a>';
    }).join('') + '</div>' +
    '<p class="small muted mt-4">If someone is hurt, call emergency services: Ethiopia 907 · Kenya 999 · Rwanda 912, or go to the nearest hospital.</p>';
  }

  function harmNote() {
    var c = country();
    return '<div class="q-note q-note--soft" role="status">Thank you for telling us. You don’t have to carry this alone. ' +
      'Your coordinator will read this carefully, and if these thoughts feel strong right now, please call the ' + c.name +
      ' helpline on <a href="tel:' + c.helpline + '">' + c.helpline + '</a>. It is free, confidential and open all day and night.</div>';
  }

  // ---- Render ----
  function render() {
    if (state.done) return renderResult();
    var list = visible();
    if (state.i >= list.length) state.i = list.length - 1;
    if (state.i < 0) state.i = 0;
    var step = list[state.i];
    var ans = state.a[step.id];

    foot.hidden = false;
    back.hidden = state.i === 0;
    count.textContent = 'Question ' + (state.i + 1) + ' of ' + list.length;
    bar.style.width = Math.round((state.i / list.length) * 100) + '%';
    bar.setAttribute('aria-valuenow', String(state.i + 1));
    bar.setAttribute('aria-valuemin', '1');
    bar.setAttribute('aria-valuemax', String(list.length));
    next.textContent = state.i === list.length - 1 ? 'Send to a coordinator' : 'Continue';

    var html = '<div class="q"><p class="q__section">' + esc(step.section) + '</p>' +
      '<h1 class="q__title" id="q-title" tabindex="-1">' + esc(step.title) + '</h1>' +
      (step.help ? '<p class="q__help">' + esc(step.help) + '</p>' : '');

    if (step.type === 'crisis') html += callButtons();

    if (step.type === 'fields') {
      var a = state.a;
      var ch = a.channel || 'whatsapp';
      var handleLabel = ch === 'email' ? 'Email address' : ch === 'telegram' ? 'Telegram username or phone number' : 'Phone number (with country code)';
      var handleType = ch === 'email' ? 'email' : ch === 'telegram' ? 'text' : 'tel';
      var ph = { ET: '+251 9..', KE: '+254 7..', RW: '+250 7..' }[a.country] || '';
      html += '<div class="q-fields">' +
        '<label class="field"><span class="field__label">What should we call you? *</span>' +
        '<input class="input" name="name" autocomplete="given-name" value="' + esc(a.name) + '" required></label>' +
        '<label class="field"><span class="field__label">' + handleLabel + ' *</span>' +
        '<input class="input" name="handle" type="' + handleType + '" autocomplete="' + (ch === 'email' ? 'email' : 'tel') + '" placeholder="' + (ch === 'email' ? 'you@example.com' : ph) + '" value="' + esc(a.handle) + '" required>' +
        '<span class="field__hint">We only use this to arrange your care. No marketing.</span></label>' +
        '<label class="field"><span class="field__label">Anything else you’d like your coordinator to know? (optional)</span>' +
        '<textarea class="textarea" name="notes" style="min-height:110px">' + esc(a.notes) + '</textarea></label>' +
        '<label class="check"><input type="checkbox" name="consent"' + (a.consent ? ' checked' : '') + '><span class="check__box">' +
        '<svg width="11" height="9" viewBox="0 0 12 10" fill="none"><path d="M1 5.2 4.4 8.6 11 1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<span>I understand a human care coordinator will read my answers, and I agree to be contacted. <a href="privacy.html" target="_blank" style="color:var(--green-700);text-decoration:underline">Privacy notice</a></span></label>' +
        '<div id="field-err" class="quiz-safety" hidden></div></div>';
    } else if (step.options) {
      var multi = !!step.multi;
      html += '<div class="opts' + (step.cols === 2 ? ' opts--2' : '') + '" role="radiogroup" aria-labelledby="q-title">' +
        optsFor(step).map(function (o) {
          var checked = ans === o[0];
          return '<label class="opt' + (o[3] === 'urgent' ? ' opt--urgent' : '') + (multi ? ' opt--multi' : '') + '">' +
            '<input type="radio" name="' + step.id + '" value="' + esc(o[0]) + '"' + (checked ? ' checked' : '') + '>' +
            '<span class="opt__box"><span class="opt__mark" aria-hidden="true"></span>' +
            (o[4] ? '<span class="opt__icon" aria-hidden="true">' + o[4] + '</span>' : '') +
            '<span><strong>' + esc(o[1]) + '</strong>' + (o[2] ? '<small>' + esc(o[2]) + '</small>' : '') + '</span></span></label>';
        }).join('') + '</div>';
      if (step.id === 'harm') html += '<div id="harm-note">' + (ans && ans !== '0' ? harmNote() : '') + '</div>';
    }
    html += '</div>';
    stage.innerHTML = html;
    syncNext();

    var t = document.getElementById('q-title');
    if (t && document.activeElement !== document.body) t.focus({ preventScroll: true });
    window.scrollTo(0, 0);

    // Wire inputs
    Array.prototype.forEach.call(stage.querySelectorAll('input[type=radio]'), function (inp) {
      inp.addEventListener('change', function () {
        setAnswer(step.id, inp.value);
        syncNext();
        if (step.id === 'harm') {
          document.getElementById('harm-note').innerHTML = inp.value !== '0' ? harmNote() : '';
          if (inp.value !== '0') return; // stop auto-advance so the note is seen
        }
        if (step.type === 'crisis') return;
        setTimeout(function () { if (visible()[state.i] === step || visible()[state.i].id === step.id) go(1); }, 260);
      });
    });
    Array.prototype.forEach.call(stage.querySelectorAll('.q-fields input, .q-fields textarea'), function (inp) {
      inp.addEventListener('input', function () {
        state.a[inp.name] = inp.type === 'checkbox' ? inp.checked : inp.value;
        inp.style.borderColor = '';
        save(); syncNext();
      });
      inp.addEventListener('change', function () { state.a[inp.name] = inp.type === 'checkbox' ? inp.checked : inp.value; save(); syncNext(); });
    });
  }

  function setAnswer(id, v) {
    if (state.a[id] !== v) (DEPENDS[id] || []).forEach(function (d) { delete state.a[d]; });
    state.a[id] = v;
    save();
  }

  function answered(step) {
    if (step.type === 'fields') return true; // validated on submit with messages
    return state.a[step.id] != null && state.a[step.id] !== '';
  }
  function syncNext() {
    var step = visible()[state.i];
    next.disabled = !answered(step);
  }

  function validateFields() {
    var a = state.a, bad = [];
    var name = stage.querySelector('[name=name]'), handle = stage.querySelector('[name=handle]'), consent = stage.querySelector('[name=consent]');
    if (!(a.name || '').trim()) bad.push(name);
    var h = (a.handle || '').trim();
    var okHandle = a.channel === 'email' ? /.+@.+\..+/.test(h) : h.replace(/[^\d]/g, '').length >= 7 || (a.channel === 'telegram' && h.length >= 4);
    if (!okHandle) bad.push(handle);
    if (!a.consent) bad.push(consent);
    var err = document.getElementById('field-err');
    bad.forEach(function (f) { if (f.type !== 'checkbox') f.style.borderColor = 'var(--alert-600)'; });
    if (bad.length) {
      err.hidden = false;
      err.innerHTML = '<strong>Nearly there</strong>Please add your name, a way to reach you, and tick the consent box.';
      bad[0].focus();
      return false;
    }
    return true;
  }

  function go(d) {
    var list = visible();
    var step = list[state.i];
    if (d > 0 && step.type === 'fields' && !validateFields()) return;
    if (d > 0 && !answered(step)) return;
    if (d > 0 && state.i === list.length - 1) { state.done = true; state.submitted = new Date().toISOString(); save(); return render(); }
    state.i = Math.max(0, Math.min(visible().length - 1, state.i + d));
    save();
    render();
  }

  // ---- Result ----
  function score() { return ['phq1', 'phq2', 'phq3', 'phq4'].reduce(function (s, k) { return s + (parseInt(state.a[k], 10) || 0); }, 0); }
  function band(s) {
    if (s <= 2) return { n: 1, key: '', label: 'Within the usual range', text: 'Your answers suggest everyday levels of stress. That is a great time to build preventive habits.' };
    if (s <= 5) return { n: 2, key: '', label: 'Mild', text: 'Some strain is showing. Talking to someone early can stop it from building.' };
    if (s <= 8) return { n: 3, key: 'mid', label: 'Moderate', text: 'This is a real load to be carrying. Regular support is likely to help.' };
    return { n: 4, key: 'high', label: 'High', text: 'You are carrying a lot right now. Your coordinator will prioritise your form.' };
  }

  function renderResult() {
    var a = state.a, c = country(), s = score(), b = band(s);
    foot.hidden = true;
    bar.style.width = '100%';
    count.textContent = 'Complete';
    var rows = [
      ['Country', c.name],
      ['Support with', labelFor(stepById('focus'), a.focus)],
      ['Language', labelFor(stepById('lang'), a.lang)],
      ['Therapist', labelFor(stepById('gender'), a.gender)],
      ['Format', labelFor(stepById('format'), a.format)],
      ['Contact', labelFor(stepById('channel'), a.channel) + (a.time ? ', ' + labelFor(stepById('time'), a.time).toLowerCase() : '')]
    ].filter(function (r) { return r[1]; });

    stage.innerHTML = '<div class="q result">' +
      '<div class="result-ring"><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M8 17.5 14.5 24 26 11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<h1 class="h2 mt-6" id="q-title" tabindex="-1">Thank you' + (a.name ? ', ' + esc(a.name.split(' ')[0]) : '') + '. We’ll take a thorough look.</h1>' +
      '<p class="lede mt-4">A care coordinator will personally read your answers and match you with a psychologist who fits. You don’t need to do anything else right now.</p>' +

      (a.harm && a.harm !== '0' ? '<div class="q-note q-note--soft" style="text-align:left">You mentioned thoughts of hurting yourself. We’re glad you told us. If they get stronger before we reach you, the ' + c.name + ' helpline is free and open all day and night: <a href="tel:' + c.helpline + '">' + c.helpline + '</a>.</div>' : '') +

      '<div class="result__block"><h3>What happens next</h3><ol class="result__steps">' +
      '<li><span>1</span><div><strong>Review</strong>A coordinator reads your form within 24–48 hours.</div></li>' +
      '<li><span>2</span><div><strong>Outreach</strong>We contact you on ' + esc(labelFor(stepById('channel'), a.channel) || 'your chosen channel') + ' to introduce your therapist.</div></li>' +
      '<li><span>3</span><div><strong>Payment and booking</strong>Pay with ' + c.pay + ', send the receipt, and your first session is booked.</div></li>' +
      '</ol></div>' +

      '<div class="result__block"><h3>Your well-being check</h3>' +
      '<p class="small muted mt-2">' + b.label + ' · score ' + s + ' of 12. This is not a diagnosis, only a starting point for your coordinator.</p>' +
      '<div class="band-meter' + (b.key ? ' band-meter--' + b.key : '') + '">' + [1, 2, 3, 4].map(function (n) { return '<i class="' + (n <= b.n ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<p class="small mt-3">' + b.text + '</p></div>' +

      '<div class="result__block"><h3>Your answers</h3><dl class="summary">' +
      rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') +
      '</dl></div>' +

      '<div class="flex gap-4 mt-7 wrap-flex" style="justify-content:center">' +
      '<a class="btn btn--accent btn--lg" href="resources.html#tools">Free tools while you wait</a>' +
      '<a class="btn btn--ghost btn--lg" href="index.html">Back to home</a></div>' +
      '<p class="small faint mt-6">In crisis? Call ' + c.name + ' <a href="tel:' + c.helpline + '" style="color:var(--alert-700);font-weight:600">' + c.helpline + '</a> or see <a href="crisis.html" style="text-decoration:underline">crisis support</a>.</p>' +
      '</div>';
    window.scrollTo(0, 0);
  }
  function stepById(id) { return STEPS.filter(function (s) { return s.id === id; })[0]; }

  // ---- Controls ----
  next.addEventListener('click', function () { go(1); });
  back.addEventListener('click', function () { go(-1); });
  restart.addEventListener('click', function (e) {
    e.preventDefault();
    if (!window.confirm('Clear your answers and start again?')) return;
    try { localStorage.removeItem(KEY); } catch (err) {}
    state = load();
    render();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !state.done && e.target.tagName !== 'TEXTAREA' && !document.getElementById('gate')) {
      if (!next.disabled) { e.preventDefault(); go(1); }
    }
  });

  render();
})();
