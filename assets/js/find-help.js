/* Lebona directory: data + filtering.
   Individual therapist entries are SAMPLE profiles until the verified roster is loaded.
   Filters: OR within a group, AND across groups. Your selected country is listed first. */
(function () {
  'use strict';

  var DATA = [
    // Hospitals and clinics (public institutions)
    { name: 'Amanuel Mental Specialised Hospital', type: 'clinic', ctry: 'ET', city: 'Addis Ababa',
      langs: ['am', 'om', 'en'], modes: ['inperson'], desc: 'Ethiopia’s principal specialist mental health hospital. Emergency care 24 hours.' },
    { name: 'Zewditu Memorial Hospital, Psychiatry', type: 'clinic', ctry: 'ET', city: 'Addis Ababa',
      langs: ['am', 'en'], modes: ['inperson'], desc: 'Low-cost outpatient assessment and medication, weekdays.' },
    { name: 'Mathari National Teaching & Referral Hospital', type: 'clinic', ctry: 'KE', city: 'Nairobi',
      langs: ['sw', 'en'], modes: ['inperson'], desc: 'Kenya’s national referral hospital for mental health. Emergency assessment 24 hours.' },
    { name: 'Kenyatta National Hospital, Mental Health', type: 'clinic', ctry: 'KE', city: 'Nairobi',
      langs: ['sw', 'en'], modes: ['inperson'], desc: 'Psychiatric outpatient clinic and 24-hour emergency department.' },
    { name: 'CARAES Ndera Neuropsychiatric Hospital', type: 'clinic', ctry: 'RW', city: 'Kigali',
      langs: ['rw', 'fr', 'en'], modes: ['inperson'], desc: 'Rwanda’s main neuropsychiatric hospital. Acute and inpatient care.' },
    { name: 'Isange One Stop Centres', type: 'clinic', ctry: 'RW', city: 'Nationwide',
      langs: ['rw', 'fr', 'en'], modes: ['inperson', 'phone'], desc: 'Free medical, psychosocial and legal support for survivors of gender-based violence.' },

    // Sample therapist profiles (placeholders)
    { name: 'Sample profile: Clinical psychologist', type: 'therapist', ctry: 'ET', city: 'Addis Ababa', gender: 'f', sample: true,
      langs: ['am', 'en'], modes: ['video', 'phone', 'msg'], desc: 'Anxiety, burnout and work stress. CBT-based, faith-informed on request.' },
    { name: 'Sample profile: Counselling psychologist', type: 'therapist', ctry: 'ET', city: 'Adama', gender: 'm', sample: true,
      langs: ['om', 'am'], modes: ['phone', 'inperson'], desc: 'Family conflict, grief and young adults. Sessions in Afaan Oromoo.' },
    { name: 'Sample profile: Trauma therapist', type: 'therapist', ctry: 'ET', city: 'Mekelle', gender: 'f', sample: true,
      langs: ['ti', 'am', 'en'], modes: ['video', 'phone'], desc: 'Trauma-informed care, displacement and recovery.' },
    { name: 'Sample profile: Counselling psychologist', type: 'therapist', ctry: 'KE', city: 'Nairobi', gender: 'f', sample: true,
      langs: ['sw', 'en'], modes: ['video', 'msg'], desc: 'Relationships, postpartum mood and self-esteem.' },
    { name: 'Sample profile: Clinical psychologist', type: 'therapist', ctry: 'KE', city: 'Mombasa', gender: 'm', sample: true,
      langs: ['sw', 'en'], modes: ['phone', 'video', 'inperson'], desc: 'Men’s mental health, substance use and workplace stress.' },
    { name: 'Sample profile: Consultant psychiatrist', type: 'psychiatrist', ctry: 'KE', city: 'Nairobi', gender: 'f', sample: true,
      langs: ['en', 'sw'], modes: ['video', 'inperson'], desc: 'Medication review, bipolar disorder and severe depression.' },
    { name: 'Sample profile: Clinical psychologist', type: 'therapist', ctry: 'RW', city: 'Kigali', gender: 'm', sample: true,
      langs: ['rw', 'fr', 'en'], modes: ['video', 'phone', 'inperson'], desc: 'Trauma, grief and community healing.' },
    { name: 'Sample profile: Psychiatrist', type: 'psychiatrist', ctry: 'RW', city: 'Kigali', gender: 'f', sample: true,
      langs: ['rw', 'en'], modes: ['inperson', 'video'], desc: 'Assessment and medication for anxiety, depression and psychosis.' },
    { name: 'Sample profile: Remote counsellor', type: 'therapist', ctry: 'XX', city: 'Online, all three countries', gender: 'f', sample: true,
      langs: ['en', 'am', 'sw'], modes: ['video', 'msg'], desc: 'Diaspora and cross-border clients, students and young professionals.' },

    // Groups
    { name: 'Parents and carers circle', type: 'group', ctry: 'XX', city: 'Online, fortnightly',
      langs: ['en', 'am'], modes: ['video'], desc: 'Peer support for people caring for someone with a mental health condition. Run by Lebona.' },
    { name: 'Young professionals stress group', type: 'group', ctry: 'KE', city: 'Nairobi and online',
      langs: ['en', 'sw'], modes: ['video', 'inperson'], desc: 'Eight-week facilitated group on burnout and boundaries.' },
    { name: 'Grief and loss circle', type: 'group', ctry: 'RW', city: 'Kigali',
      langs: ['rw', 'en'], modes: ['inperson'], desc: 'Monthly facilitated circle for people living with loss.' }
  ];

  var LANG = { am: 'አማርኛ', om: 'Afaan Oromoo', ti: 'ትግርኛ', sw: 'Kiswahili', rw: 'Kinyarwanda', fr: 'Français', en: 'English' };
  var MODE = { msg: 'Messaging', phone: 'Phone', video: 'Video', inperson: 'In person' };
  var TYPE = { therapist: 'Therapist', psychiatrist: 'Psychiatrist', clinic: 'Clinic or hospital', group: 'Support group' };
  var CTRY = { ET: 'Ethiopia', KE: 'Kenya', RW: 'Rwanda', XX: 'Regional / remote' };

  var form = document.getElementById('filters');
  var search = document.getElementById('dir-search');
  var results = document.getElementById('results');
  var count = document.getElementById('dir-count');
  var empty = document.getElementById('dir-empty');
  var reset = document.getElementById('dir-reset');
  if (!form || !results) return;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function checked(name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name=' + name + ']:checked'), function (i) { return i.value; });
  }
  function initials(n) {
    return n.replace(/^Sample profile: /, '').split(/\s+/).filter(function (w) { return /^[A-Z]/.test(w); }).slice(0, 2).map(function (w) { return w[0]; }).join('');
  }

  function render() {
    var f = { ctry: checked('ctry'), lang: checked('lang'), type: checked('type'), mode: checked('mode'), gender: checked('gender') };
    var q = (search.value || '').trim().toLowerCase();
    var local = window.Lebona ? window.Lebona.region().code : 'ET';

    var list = DATA.filter(function (d) {
      if (f.ctry.length && f.ctry.indexOf(d.ctry) < 0) return false;
      if (f.type.length && f.type.indexOf(d.type) < 0) return false;
      if (f.lang.length && !d.langs.some(function (l) { return f.lang.indexOf(l) > -1; })) return false;
      if (f.mode.length && !d.modes.some(function (m) { return f.mode.indexOf(m) > -1; })) return false;
      if (f.gender.length && f.gender.indexOf(d.gender) < 0) return false;
      if (q) {
        var hay = [d.name, d.city, CTRY[d.ctry], TYPE[d.type], d.desc].concat(d.langs.map(function (l) { return LANG[l]; })).join(' ').toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) { return (b.ctry === local) - (a.ctry === local); });

    results.innerHTML = list.map(function (d) {
      var av = d.type === 'clinic' ? 'prov__av prov__av--org' : d.type === 'group' ? 'prov__av prov__av--grp' : 'prov__av';
      return '<article class="prov' + (d.ctry === local ? ' is-local' : '') + '">' +
        '<span class="' + av + '" aria-hidden="true">' + esc(initials(d.name) || TYPE[d.type][0]) + '</span><div>' +
        '<h3>' + esc(d.name) + '</h3>' +
        '<p class="prov__meta">' + TYPE[d.type] + ' · ' + esc(d.city) + ', ' + CTRY[d.ctry] + '</p>' +
        '<p class="prov__desc">' + esc(d.desc) + '</p>' +
        '<div class="prov__tags">' +
        (d.ctry === local ? '<span class="pill pill--green pill--dot">In your country</span>' : '') +
        (d.sample ? '<span class="pill pill--clay">Sample listing</span>' : '') +
        d.langs.map(function (l) { return '<span class="pill">' + LANG[l] + '</span>'; }).join('') +
        d.modes.map(function (m) { return '<span class="pill pill--sky">' + MODE[m] + '</span>'; }).join('') +
        '</div></div></article>';
    }).join('');
    count.textContent = list.length + ' of ' + DATA.length + ' listings';
    empty.hidden = list.length > 0;
  }

  form.addEventListener('change', render);
  search.addEventListener('input', render);
  reset.addEventListener('click', function () { form.reset(); search.value = ''; render(); });
  document.addEventListener('lebona:region', render);
  render();
})();
