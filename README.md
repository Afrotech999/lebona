# Lebona, website

Preventive mental wellness for East Africa. Static site, no build step.

**Positioning:** care starts *before* the breakdown. Free self-guided tools are the core;
human-matched therapy is the next tier up, not the entry point.

**Operating model:** matching is done by human care coordinators, not software. Everything
on the site, copy, intake form, crisis warnings, privacy notice, is written around that
24–48 hour lag rather than hiding it.

## Running it

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

or double-click `index.html`. It works from `file://` too.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home, full-bleed hero, 3-step process, where we work, tiers, founder, FAQ |
| `match.html` | **The intake form.** Gate → 15 branching questions → next-steps result |
| `how-it-works.html` | The four steps in detail, sessions, pricing, privacy, long FAQ |
| `services.html` | The tiered model, `#therapy` · `#groups` · `#training` |
| `resources.html` | `#tools` · `#screening` (PHQ-4) · `#worksheets` · `#library` · `#channels` |
| `trainings.html` | Six training tracks, B2C/B2B delivery comparison, NGO proposal structure. **Top-level nav item**, not nested under Get support |
| `find-help.html` | Directory across all three countries, with credential mapping |
| `payments.html` | Fees, Telebirr / M-Pesa / MTN & Airtel Money, manual receipt verification |
| `about.html` | Founder's story (`#founder`), objectives, values, `#approach`, impact |
| `crisis.html` | Helplines and walk-in services for all three countries |
| `stories.html`, `careers.html`, `contact.html`, `privacy.html` | |

## Region: countries and languages

Three countries with real behaviour attached, not just labels:

| | Helpline | Languages | Payment |
| --- | --- | --- | --- |
| Ethiopia | **952** | Amharic, Afaan Oromoo, Tigrinya, Somali, English | Telebirr, CBE, Awash |
| Kenya | **1190** | Kiswahili, English | M-Pesa |
| Rwanda | **116** | Kinyarwanda, English, Français | MTN MoMo, Airtel Money |

The header picker writes to `localStorage` (`lebona.region`) and drives:

- the helpline shown in the crisis bar on every page (number, country name and `tel:` href),
- the language options offered in the intake form,
- the payment channel named on the intake result screen.

Countries and helplines live in **one place**: the `COUNTRIES` array in
`assets/js/layout.js`, mirrored in `assets/js/questionnaire.js` and `assets/js/site.js`.

The **language selector persists and relabels but does not translate yet**, page copy is
still English. `<html lang>` is deliberately left as `en` so screen readers don't
mispronounce English text as Kinyarwanda.

## The intake form (`match.html`)

Adapted from PHQ-4, GAD-7 and WHO-5 for manual operations. 15 screens:

1. **Tier**, proactive self-growth / ongoing therapy / urgent. Choosing *urgent* inserts a
   crisis hard-stop screen with all three helplines before anything else.
2. **Country**, decides the therapist pool, and rewrites the language question below it.
3. **Primary area of focus**: six options.
4. **Severity ×4**: the PHQ-4 items plus the self-harm question. Any non-zero answer to the
   last one stops auto-advance and surfaces your country's helpline inline.
5. **Religion**, importance, then which religion, then whether you want religious-based
   therapy. Branching: answering *"Not important at all"* skips the next two entirely, and
   *"Prefer not to say"* skips the religious-therapy question. Changing an earlier answer
   clears the stale ones below it.
6. **Matching preferences**, language, therapist gender, approach, previous therapy.
7. **Logistics**, session format, contact channel (WhatsApp / Telegram / phone / email),
   best time of day.
8. **Contact details**, with explicit consent that *a human coordinator will read this*.

The result screen opens with a warm "we'll take a thorough look" reassurance rather than a
warning about the wait, then shows what happens next (review → outreach → payment, with your
country's payment channel named), a score band labelled *not a diagnosis*, and a summary.
Where someone flagged self-harm it also shows a soft, supportive note with their national
helpline, kept deliberately non-alarming, but kept. Progress is
saved to `localStorage` (`lebona.intake.v2`). `match.html#go` skips the intro gate.

Questions live in one `STEPS` array at the top of `assets/js/questionnaire.js`, add,
reorder or reword there and progress, validation and branching follow automatically.

## Structure

```
assets/
  css/lebona.css        design system, tokens, type scale, every component
  js/layout.js          header + footer + region picker, injected on every page
  js/site.js            sticky header, drawer, region state, reveals, accordions, counters
  js/questionnaire.js   the intake form
  js/find-help.js       directory data + filtering
  js/tools.js           breathing, grounding, mood, journal, PHQ-4 screening
  img/hero-scene.svg    full-bleed hero landscape
  img/portrait.svg      editorial portrait
  head.txt              shared <head> snippet for new pages
```

**Navigation lives in the `NAV` array in `assets/js/layout.js`**, change it once and every
page updates.

## Design

- **Type**: Plus Jakarta Sans (display, 700/800) + Inter (body) + IBM Plex Mono (numerals).
  Noto Sans Ethiopic is loaded for Amharic. **No italics anywhere.**
- **No em dashes and no ALL-CAPS eyebrow labels** anywhere in the copy or the CSS. Both are
  common tells of generated content; section labels are sentence case instead.
- **Colour**: the site keeps its deep evergreen sections. The hero is the one light moment.
  - `.on-dark` — evergreen gradient (`#16483D → #27735F`) with ochre and clay glow.
  - `.band` — the CTA, same family with a stronger ochre wash.
  - `.footer` / `.crisis-bar` — deepest evergreen.
  - Tokens: evergreen `#1D5A4B` · clay `#C86A3C` · ochre `#DFA945` · sand `#FCF8F0`.
- **CTA band**: the "You don't need a crisis" section above the footer is `.cta-band` —
  full-bleed edge to edge, and light like the hero. The separate `.band` class stays dark
  and is used only for the pull quote on the About page.
- **Hero (light)**: `assets/img/hero-scene.svg` is a pale dawn — mint-to-cream sky, apricot
  sun, sage hills. It sits under a *cream* scrim that fades to nothing on the right, and the
  hero type is dark ink rather than white. This is deliberately the only light-background
  hero on the site; every other section keeps the darker treatment.
- Content is readable without JavaScript: the reveal animation is gated behind a `js` class
  set in `<head>`, so a script failure degrades to a plain page rather than a blank one.

## Mobile

Audited at 320px and 390px with a measurement harness (every element checked for horizontal
overflow, tap-target height and input font size), and re-checked at 1400px so nothing
regressed on desktop.

- **No horizontal overflow** on any page at 320px or above.
- **Inputs are 16px on small screens** so iOS Safari doesn't zoom the page on focus.
- **Tap targets are >=44px** for every button, chip, filter row and screening option.
  Inline links inside sentences are left alone, as WCAG allows.
- **The header keeps its "Get matched" button on phones** (compact, with the wordmark
  tagline hidden) rather than dropping the primary action.
- **Directory filters collapse** behind a "Filter results" toggle under 900px, so results
  aren't pushed below a long stack of checkboxes.
- **Wide tables scroll** inside `.table-wrap`, with a "scroll sideways" hint that appears
  only when the table actually overflows.
- **Safe-area insets** on the fixed intake footer, the drawer, and page gutters, so nothing
  hides behind the iPhone home indicator or a landscape notch.
- The hero drops its fixed viewport height on phones and the CTAs go full-width.

Two layout bugs were found and fixed during this pass: `.ledger__row p { grid-column: 2 }`
never applied (the `<p>` isn't a direct grid child), which squeezed list descriptions into
the 36px number column; and two inline `grid-template-columns` on the trainings page
overrode the mobile media query, holding a 2-up grid at 320px.

## Before going live

Front-end only by design:

- The intake form and contact form don't post anywhere. Per the operational plan, wire the
  intake submit to a webhook (Make/Zapier → Google Sheets or Airtable) with tracking columns
  for *Intake Received · Coordinator Assigned · Therapist Assigned · Payment Pending ·
  Session Scheduled*.
- **Verify every helpline number on `crisis.html` before publishing.** They are the highest-risk
  content on the site and are currently unverified placeholders.
- Prices, therapist names, board-verification claims and statistics are placeholders.
- Worksheet and starter-kit PDFs are listed but not attached.
- Translations aren't wired up; coordinator outreach scripts in the four languages still need
  writing.
#   l e b o n a  
 