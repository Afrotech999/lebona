/* Lebona self-guided tools: breathing, grounding, mood, journal, PHQ-4 screening,
   and the library filter. Everything stays in the visitor's own browser. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // ---- 1. Breathing 4-7-8 ----
  (function () {
    var btn = $('#breath-btn'); if (!btn) return;
    var circle = $('.breath'), count = $('.breath__count'), phase = $('.breath__phase'), cyclesEl = $('#breath-cycles');
    var PHASES = [['Breathe in', 4, 'is-in'], ['Hold', 7, 'is-hold'], ['Breathe out', 8, 'is-out']];
    var CYCLES = 4, timer = null, running = false;

    function stop(msg) {
      clearInterval(timer); timer = null; running = false;
      circle.className = 'breath';
      count.textContent = '4·7·8';
      phase.textContent = msg || 'Ready';
      btn.textContent = 'Begin';
    }
    function start() {
      running = true; btn.textContent = 'Stop';
      var cycle = 0, p = 0, left = PHASES[0][1];
      function show() {
        circle.className = 'breath ' + PHASES[p][2];
        phase.textContent = PHASES[p][0];
        count.textContent = left;
        cyclesEl.textContent = 'Cycle ' + (cycle + 1) + ' of ' + CYCLES;
      }
      show();
      timer = setInterval(function () {
        left--;
        if (left <= 0) {
          p++;
          if (p >= PHASES.length) { p = 0; cycle++; }
          if (cycle >= CYCLES) { cyclesEl.textContent = 'Four cycles done. Notice how you feel.'; return stop('Well done'); }
          left = PHASES[p][1];
        }
        show();
      }, 1000);
    }
    btn.addEventListener('click', function () { running ? stop() : start(); });
  })();

  // ---- 2. Grounding 5-4-3-2-1 ----
  (function () {
    var btn = $('#ground-btn'); if (!btn) return;
    var reset = $('#ground-reset'), prompt = $('.ground__prompt'), dots = $('.ground__dots');
    var STEPS = [
      ['Take a slow breath.', 'When you are ready, press Next. We will move through your five senses.'],
      ['Name 5 things you can see.', 'Say them quietly, or in your head. A colour, a shape, a shadow.'],
      ['Notice 4 things you can feel.', 'Your feet on the floor, the chair behind you, the air on your skin.'],
      ['Listen for 3 things you can hear.', 'Near sounds and far ones. Traffic, birds, your own breath.'],
      ['Find 2 things you can smell.', 'If nothing is nearby, remember two smells you like.'],
      ['Name 1 thing you can taste.', 'Or take a sip of water and notice it.'],
      ['You are here, in this room.', 'Your mind has had a moment to settle. Come back to this any time.']
    ];
    var i = 0;
    function show() {
      prompt.innerHTML = STEPS[i][0] + '<small>' + STEPS[i][1] + '</small>';
      dots.innerHTML = [1, 2, 3, 4, 5].map(function (n) { return '<i class="' + (i >= n ? 'on' : '') + '"></i>'; }).join('');
      var last = i === STEPS.length - 1;
      btn.hidden = last; reset.hidden = !last;
      btn.textContent = i === 0 ? 'Begin' : 'Next';
    }
    btn.addEventListener('click', function () { if (i < STEPS.length - 1) { i++; show(); } });
    reset.addEventListener('click', function () { i = 0; show(); btn.focus(); });
    show();
  })();

  // ---- 3. Mood check-in ----
  (function () {
    var box = $('#mood'); if (!box) return;
    var out = $('#mood-out');
    var LABELS = ['Very low', 'Low', 'Okay', 'Good', 'Very good'];
    var KEY = 'lebona.mood';
    function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function draw() {
      var log = get(KEY, {});
      var t = log[today()];
      $$('button', box).forEach(function (b) { b.setAttribute('aria-pressed', String(String(t) === b.getAttribute('data-mood'))); });
      var days = [];
      for (var k = 6; k >= 0; k--) {
        var d = new Date(); d.setDate(d.getDate() - k);
        var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        days.push({ v: log[key], l: 'SMTWTFS'.charAt(d.getDay()) });
      }
      var logged = days.filter(function (d) { return d.v != null; }).length;
      out.innerHTML = (t != null ? '<p class="small"><strong>Logged today: ' + LABELS[t] + '.</strong> ' +
        (t <= 1 ? 'Thank you for noticing. A breathing cycle or a short walk may help. If low days keep coming, <a class="link" href="match.html">talk to a coordinator</a>.' : 'Nice. Come back tomorrow to build the pattern.') + '</p>'
        : '<p class="small muted">How are you feeling today? Tap a face.</p>') +
        (logged ? '<div class="mood-hist" aria-label="Your last seven days">' + days.map(function (d) {
          return '<div class="mood-hist__bar"><i style="height:' + (d.v == null ? 6 : 14 + d.v * 12) + 'px;' + (d.v == null ? 'background:var(--line)' : '') + '"></i><span>' + d.l + '</span></div>';
        }).join('') + '</div><p class="small faint mt-2">Your last seven days, saved only on this device.</p>' : '');
    }
    $$('button', box).forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        var log = get(KEY, {}); log[today()] = parseInt(b.getAttribute('data-mood'), 10); set(KEY, log); draw();
      });
    });
    draw();
  })();

  // ---- 4. Journal ----
  (function () {
    var ta = $('#journal-text'); if (!ta) return;
    var p = $('#journal-prompt'), btn = $('#journal-btn'), status = $('#journal-status');
    var PROMPTS = [
      'What took up most of your energy today, and was it worth it?',
      'Name one thing you handled better than you would have a year ago.',
      'What are you carrying right now that isn’t yours to carry?',
      'Describe a moment today when you felt even a little bit calm.',
      'If a close friend were in your situation, what would you tell them?',
      'What do you need more of this week, and what do you need less of?',
      'Write about someone who makes you feel safe. What do they do?',
      'What is one small thing you could do tomorrow to be kind to yourself?'
    ];
    var idx = get('lebona.journal.prompt', 0) % PROMPTS.length;
    function show() { p.textContent = PROMPTS[idx]; }
    btn.addEventListener('click', function () { idx = (idx + 1) % PROMPTS.length; set('lebona.journal.prompt', idx); show(); ta.focus(); });
    ta.value = get('lebona.journal', '');
    var t;
    ta.addEventListener('input', function () {
      clearTimeout(t); status.textContent = 'Saving…';
      t = setTimeout(function () { set('lebona.journal', ta.value); status.textContent = 'Saved on this device only'; }, 500);
    });
    if (ta.value) status.textContent = 'Saved on this device only';
    show();
  })();

  // ---- 5. PHQ-4 screening ----
  (function () {
    var qBox = $('[data-scr-questions]'); if (!qBox) return;
    var result = $('[data-scr-result]'), reset = $('[data-scr-reset]');
    var Q = [
      'Feeling nervous, anxious or on edge',
      'Not being able to stop or control worrying',
      'Little interest or pleasure in doing things',
      'Feeling down, depressed or hopeless'
    ];
    var OPTS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
    qBox.innerHTML = Q.map(function (q, i) {
      return '<div class="scr__q"><fieldset><legend>' + (i + 1) + '. ' + q + '</legend><div class="scr__opts">' +
        OPTS.map(function (o, v) {
          return '<label class="scr__opt"><input type="radio" name="scr' + i + '" value="' + v + '"><span>' + o + '</span></label>';
        }).join('') + '</div></fieldset></div>';
    }).join('');

    function calc() {
      var vals = Q.map(function (_, i) { var c = $('input[name=scr' + i + ']:checked', qBox); return c ? +c.value : null; });
      var answered = vals.filter(function (v) { return v !== null; }).length;
      reset.hidden = answered === 0;
      if (answered < Q.length) {
        result.innerHTML = answered ? '<p class="small faint">' + (Q.length - answered) + ' question' + (Q.length - answered === 1 ? '' : 's') + ' to go.</p>' : '';
        return;
      }
      var total = vals.reduce(function (a, b) { return a + b; }, 0);
      var anx = vals[0] + vals[1], dep = vals[2] + vals[3];
      var r = total <= 2 ? ['', 'Within the usual range', 'Your answers suggest everyday levels of stress. A good moment to keep preventive habits going: the tools above take minutes a day.']
        : total <= 5 ? ['', 'Mild', 'Some strain is showing. Keep using the daily tools, and consider talking to someone before it builds.']
        : total <= 8 ? ['mid', 'Moderate', 'This is a real load to carry. Talking to a psychologist is likely to help, and a coordinator can match you in 24–48 hours.']
        : ['high', 'High', 'You are carrying a lot right now. Please consider getting matched with a psychologist. If you feel unsafe, call your national helpline now.'];
      var extra = [];
      if (anx >= 3) extra.push('Your anxiety items (' + anx + ' of 6) are above the level where clinicians usually look further.');
      if (dep >= 3) extra.push('Your mood items (' + dep + ' of 6) are above the level where clinicians usually look further.');
      result.innerHTML = '<div class="scr-result' + (r[0] ? ' scr-result--' + r[0] : '') + '" role="status">' +
        '<h4>' + r[1] + ' · ' + total + ' of 12</h4><p>' + r[2] + '</p>' +
        (extra.length ? '<p>' + extra.join(' ') + '</p>' : '') +
        '<p class="faint">A screening is a prompt for reflection, not a diagnosis.</p>' +
        (total >= 3 ? '<div class="flex gap-3 wrap-flex mt-4"><a class="btn btn--accent btn--sm" href="match.html">Get matched</a>' +
          (total >= 9 ? '<a class="btn btn--light btn--sm" href="crisis.html">Crisis support</a>' : '') + '</div>' : '') +
        '</div>';
    }
    qBox.addEventListener('change', calc);
    reset.addEventListener('click', function () { $$('input', qBox).forEach(function (i) { i.checked = false; }); calc(); });
  })();

  // ---- 6. Library filter ----
  (function () {
    var chips = $$('[data-filter]'); if (!chips.length) return;
    var cards = $$('[data-tags]'), empty = $('#lib-empty');
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.classList.contains('is-selected')));
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-filter');
        chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-selected', on); x.setAttribute('aria-pressed', String(on)); });
        var shown = 0;
        cards.forEach(function (card) {
          var ok = f === 'all' || card.getAttribute('data-tags').split(' ').indexOf(f) > -1;
          card.hidden = !ok; if (ok) { shown++; card.classList.add('is-in'); }
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  })();
})();
