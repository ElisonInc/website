# Elison Inc. — Website

Source for **[elisoninc.com](https://elisoninc.com)**, the public site of Elison Inc., an independent creative and technology company. It presents the company's ventures, consulting services and video production work through Eclipse Studio.

**Status:** Active. Deployed to GitHub Pages from `main`; most recent changes were made in November 2026.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Editorial homepage: flagship ventures, portfolio, R&D and founder |
| `consulting.html` | Consulting scope, discovery booking, checkout and inquiry form |
| `production.html` | Commercials, product videos and branded content through Eclipse Studio |
| `case-study-shorthouse.html` | ShortHouse platform and B2 production project study |
| `case-study-devhouse.html` | DevHouse AI workflow product study |
| `engagement.html` | "Working Together": what to expect before an engagement, payments, rights and AI-assisted work |
| `privacy.html` | Inquiry data handling and third-party services |
| `404.html` | Not-found page |

## Featured on the site

- **ShortHouse / B2**: platform preparing for launch, not yet commercial; B2 is in production.
- **DevHouse AI**: AI workflow product, presented alongside consulting.
- **ELISON / The Book of Eli**: independent music and film.
- **SongSplit**: beta.
- **RiftHouseStudio**: original games in development.
- **OneTime Studios**: paused prototype.
- **Eclipse AI**: agent-systems research and architecture.
- **Eclipse Studio**: internal AI-assisted production workflow, also used for commissioned video work.

Homepage imagery is original ShortHouse, DevHouse AI and ELISON artwork. It is representative and does not show delivered client results.

## Stack

- Static HTML and CSS, plus a small vanilla-JavaScript inquiry handler (`inquiry.js`). No framework, no build step and no custom backend.
- `editorial.css` styles the homepage. `interior.css` styles the interior pages, and `styles.css` holds older shared styles.
- Hosted on GitHub Pages, with `CNAME` pointing to `elisoninc.com`.
- Third-party services (form handling, scheduling, payments) are listed on `privacy.html`.
- Each page sets a meta-tag Content Security Policy and a referrer policy. GitHub Pages does not allow custom HTTP security headers.

## Repository structure

```
*.html, *.css, inquiry.js   Site pages, styles and form handler
assets/                     Images; assets/og/ holds the Open Graph cards
docs/                       Internal client-engagement checklist and draft agreement (not legal advice)
scripts/check-site.mjs      Dependency-free static quality and credential gate
scripts/visual-qa.mjs       Playwright responsive, keyboard and Axe accessibility checks
scripts/generate-og.py      Pillow-based Open Graph card generator
.github/workflows/          CI: site-qa, visual-qa, live-smoke, generate-og
sitemap.xml, robots.txt, ads.txt, CNAME
```

## Local development

Serve the site:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Run the static checks (Node 22, no install needed):

```bash
node scripts/check-site.mjs
```

These checks cover page metadata, CSP and referrer tags, local links and assets, alt text, sitemap coverage, JSON-LD validity and the inquiry acknowledgment. They also scan for secrets that look like common key formats.

Run the browser QA. It needs the local server above running on `127.0.0.1:8000`, and Playwright is installed only for testing:

```bash
npm install --no-save playwright@1.56.1 @axe-core/playwright@4.10.2
npx playwright install chromium
node scripts/visual-qa.mjs   # screenshots go to qa-screenshots/
```

Regenerate the Open Graph cards (requires Pillow):

```bash
python3 scripts/generate-og.py
```

## Continuous integration

| Workflow | When it runs | What it does |
| --- | --- | --- |
| `site-qa.yml` | Pushes to `main` and pull requests | Runs `check-site.mjs` |
| `visual-qa.yml` | Pushes to `main` and manual runs | Runs the Playwright and Axe checks and uploads screenshots |
| `live-smoke.yml` | After a Pages deploy, pushes to `main`, a weekly schedule and manual runs | Confirms the live pages, assets and client disclosures are being served |
| `generate-og.yml` | Changes to the generator and manual runs | Rebuilds and commits the OG cards |

## Content rules

- Never commit credentials, API keys, confidential client media or private customer data.
- Do not publish metrics, testimonials, release claims, certifications or legal claims without evidence.
- After visible design changes, check the result in a real browser. The static checker does not replace visual QA.

## Ownership

© 2026 Elison Inc. All rights reserved. No open-source licence file is included.

Last reviewed: 2026-11-12
