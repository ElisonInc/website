# Elison Inc. — Website

Production source for **[elisoninc.com](https://elisoninc.com)**, the independent creative and technology company portfolio and consulting site.

## Site map

| Page | Purpose |
| --- | --- |
| `index.html` | Editorial homepage; flagship ventures, portfolio, R&D and founder |
| `consulting.html` | Consulting scope, pricing, Calendly discovery, Stripe checkout and inquiry form |
| `production.html` | Commercials, product videos, social ads and branded film production through Eclipse Studio |
| `case-study-shorthouse.html` | ShortHouse platform and B2 production project study |
| `case-study-devhouse.html` | DevHouse AI workflow product study |
| `privacy.html` | Inquiry data handling and third-party services |
| `engagement.html` | Client information about inquiries, payments, cancellation, rights and AI-assisted work |
| `404.html` | Not-found page |

## Stack

Static HTML, CSS and a small vanilla-JavaScript inquiry handler. Hosted on GitHub Pages with `CNAME` for `elisoninc.com`; no JavaScript framework, build tool or custom backend. Homepage uses `editorial.css`; the consulting and project pages use `interior.css` with legacy shared styles in `styles.css`.

Branding deliberately uses editorial type, warm paper colors and minimal ornamentation. Homepage project images are sourced from our original ShortHouse and DevHouse AI asset folders. These are representative artwork **not** examples of delivered client results.

## Business and project status

- **ShortHouse / B2** — platform in precommercial launch preparation; B2 is in production. Do not call it streaming or published without release approval.
- **DevHouse AI** — consulting-facing product; do not invent case-study metrics or testimonials.
- **ELISON / The Book of Eli** — independent music and film.
- **SongSplit** — beta.
- **RiftHouseStudio** — games in development.
- **OneTime Studios** — paused prototype.
- **Eclipse AI** — engineering and architecture research.
- **Eclipse Studio** — internal creative production workflow for ShortHouse and commissioned commercials, product videos and branded content. Client production is quoted as a service, not offered as software.

## Client protection and commercial terms

- The public [Working Together](https://elisoninc.com/engagement.html) page explains pre-engagement expectations, privacy, revisions, payment, cancellation, IP rights and AI-assisted production. It is not an executed agreement.
- Use the [client engagement checklist](docs/client-engagement-checklist.md) for every paid project. Have a qualified attorney review the actual master services agreement and statement of work.
- No confidential client media, private customer data, passwords or credentials belong in this public repository or the inquiry form.
- The inquiry form has a required, clearly labeled acknowledgment that it is not a booking and that sensitive material must not be submitted.
- Static pages implement a limited meta-level Content Security Policy and referrer policy. **GitHub Pages does not provide us with configurable HTTP security response headers here**; verify site headers separately and assess edge hosting if stronger controls are required.
- Do not claim compliance certification, enforceable liability limits, insurance coverage, trademark rights or signed client consent without actual evidence.

## Lead capture and booking

- The inquiry form in `consulting.html` submits via `inquiry.js` to FormSubmit and forwards to **info@elisoninc.com**. The receiving address must remain activated with FormSubmit.
- Free discovery uses a **15-minute** Calendly event with limited date-specific windows, maintained as a rolling 30-day schedule; do not enable recurring weekly availability or broaden the calendar without approval.
- Commercial and product video production is quoted separately based on creative brief, number of deliverables, platform formats, usage rights and revisions.
- The **$200** one-time strategy consultation uses a live Stripe Payment Link, with automatic tax calculation enabled. Paying **does not** reserve a meeting time; the confirmation asks the client to email for scheduling.
- Stripe Tax collection depends on actual tax registrations in applicable jurisdictions. Do not claim registrations or tax collection without verification.
- Never store Stripe or API secret keys in this repo.

## Local development

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000` in a browser.

Run dependency-free static checks:

```bash
node scripts/check-site.mjs
```

The `.github/workflows/site-qa.yml` workflow also runs these checks on pushes and pull requests. Run a browser-based responsive and keyboard test after visible design changes; the static checker does not replace visual QA.

## Before calling a release complete

1. Check the live deployed URL in desktop and mobile browsers and ensure assets load.
2. Confirm the form submits and an actual inquiry reaches the inbox.
3. Confirm discovery booking shows only approved available hours.
4. Confirm Stripe payment link details and tax configuration, without creating an unnecessary live charge.
5. Check the sitemap, metadata, no broken links, accessibility and Google Search Console indexing where access is available.
6. Verify the public disclosure pages, obtain real signed project terms and confirm rights to all third-party and AI-assisted output before publishing client work.

## Ownership

© 2026 Elison Inc. All rights reserved unless otherwise noted in project repositories.
