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
| Ethiopia | **8335** | Amharic, Afaan Oromoo, Tigrinya, Somali, English | Telebirr, CBE, Awash |
| Kenya | **1190** | Kiswahili, English | M-Pesa |
| Rwanda | **116** | Kinyarwanda, English, Français | MTN MoMo, Airtel Money |

The header **country / language picker** (flag dropdown) writes to `localStorage` (`lebona.region`) and drives:

- the helpline highlighted in the sticky crisis bar on every page, and the local helpline, payment
  channels and verifying board shown on the home page,
- which country tab opens first on the crisis page, and which listings sort first in the directory,
- the language options offered in the intake form,
- the payment channel named on the intake result screen.

Countries and helplines live in **one place**: the `COUNTRIES` array in
`assets/js/layout.js`, mirrored in `assets/js/questionnaire.js` and `assets/js/site.js`.

The **language selector persists and relabels but does not translate yet**, page copy is
still English. `<html lang>` is deliberately left as `en` so screen readers don't
mispronounce English text as Kinyarwanda.

## The intake form (`match.html`)

Adapted from PHQ-4, GAD-7 and WHO-5 for manual operations. Up to 21 screens, one question each:

1. **Tier**, proactive self-growth / ongoing therapy / urgent. Choosing *urgent* inserts a
   crisis hard-stop screen with all three helplines before anything else.
2. **Country**, decides the therapist pool, and rewrites the language question below it.
3. **Primary area of focus**: six options.
4. **Severity ×5**: the four PHQ-4 items plus the self-harm question. Any non-zero answer to the
   last one stops auto-advance and surfaces your country's helpline inline.
5. **Religion**, importance, then which religion, then whether you want religious-based
   therapy. Branching: answering *"Not important at all"* skips the next two entirely, and
   *"Prefer not to say"* skips the religious-therapy question. Changing an earlier answer
   clears the stale ones below it.
6. **Matching preferences**, language (options depend on country), therapist gender, approach, previous therapy.
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
  img/hero-scene.svg    full-bleed hero landscape (pale dawn)
  img/portrait.svg      founder section illustration
```

**Navigation lives in the `NAV` array in `assets/js/layout.js`**, change it once and every
page updates.

## Design

Updated after the 24 Sept 2026 design review. Calm, light and airy, with no dark sections.

- **Colour** (tokens in `:root` of `lebona.css`):
  - Soft mint `#E8F5E9` backgrounds with primary green `#2E7D32` for actions and accents.
  - Warm cream `#FDFBF7` page background, white cards with subtle shadows.
  - Sky `#E0F2FE` in gradients for the softer "on-dark" sections (the class name is kept for
    compatibility, it is now a mint-to-sky wash with dark text).
  - Soft terracotta / peach `#E07A5F` as decorative accent; a deeper `#A8452C` where it is text.
  - Text is dark slate `#1E293B`, never pure black. Body and muted text all meet WCAG AA (4.5:1+).
- **Type**: Plus Jakarta Sans for headings at 600/700 (no 800/900), Inter 400 for body.
  Body text is 17px on desktop and 16px on phones. Headings use `text-wrap: balance`, and
  `word-spacing: 0.05em` is set on the body. Noto Sans Ethiopic is loaded for Amharic.
  **No italics anywhere.**
- **Spacing**: major sections have 56px (phone) to 100px (desktop) of vertical padding.
- **No scrolling tickers.** The home page uses static icon badges (4 languages, 48h response,
  100% verified, free tools) instead.
- **Hero** leads with instant value ("Instant access to free self-help tools · Personal matching
  in 24–48 hrs"); the intake form length is only described inside the intake flow itself.
- **Crisis access**: a slim sticky bar at the bottom of every page ("In crisis? Call 8335 (ET) |
  1190 (KE) | 116 (RW)"), with the visitor's own country highlighted. Every helpline number on
  the site is a `tel:` link.
- **Crisis page**: hero states the action first ("Emergency help is available 24/7"), then
  a country tab bar, with each country grouped into 1. mental health hotline, 2. specialised
  services (ambulance, gender-based violence), 3. walk-in hospitals. Longer self-help and
  supporter guidance sits in collapsible accordions under "Self-guided safety planning".
- **No em dashes and no ALL-CAPS eyebrow labels** in copy or CSS.
- Content is readable without JavaScript: the reveal animation is gated behind a `js` class
  set in `<head>`, and on the crisis page all country panels show when scripts are off.

## Mobile

Audited at 320px and 390px with a measurement harness (every element checked for horizontal
overflow, tap-target height and input font size), and re-checked at 1400px so nothing
regressed on desktop.

- **No horizontal overflow** on any page at 320px or above.
- **Inputs are 16px on small screens** so iOS Safari doesn't zoom the page on focus.
- **Tap targets are >=44px** for every button, chip, filter row and screening option.
  Inline links inside sentences are left alone, as WCAG allows.
- **The header keeps its "Get matched" button and country picker on phones** (compact, with
  the wordmark tagline hidden) rather than dropping the primary action.
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
- Prices, therapist profiles (the directory shows clearly labelled sample listings), board-verification claims and statistics are placeholders.
- Worksheet and starter-kit PDFs are listed but not attached.
- Translations aren't wired up; coordinator outreach scripts in the four languages still need
  writing.
