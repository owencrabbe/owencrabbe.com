# Owen Crabbe — applied AI portfolio

A fast, dependency-free static portfolio and engineering notebook. No résumé page. The public site includes two source-linked project case studies, two self-published technical notes, and a clearly labeled proposed research agenda.

## Run locally

Use Node.js 24. No dependency installation is needed.

```sh
npm run build
npm run check
npm start
```

The preview serves `dist/` at `http://127.0.0.1:4319`. Set `PORT` or `HOST` to change its binding. The preview server is intended for local review; Vercel serves the production static files.

## Publish on Vercel

Import the GitHub repository. Framework preset: Other. Build command: `npm run build`. Output directory: `dist`. Runtime: Node.js 24. These settings are also present in `vercel.json` and `package.json`.

`SITE_ORIGIN` controls every canonical URL, Open Graph URL, feed link, and sitemap entry. It must be an HTTPS origin without a path or trailing slash. The default is the initial publication domain:

```sh
SITE_ORIGIN=https://owencrabbe-portfolio.vercel.app npm run build
```

When `owencrabbe.com` serves this portfolio, set the production environment variable to the custom domain and rebuild:

```sh
SITE_ORIGIN=https://owencrabbe.com npm run build
```

DNS hosting and domain registration are separate from this site. Pointing a website to Vercel does not require transferring registration. Preserve existing mail-related DNS records when changing web records. This project does not modify DNS or email.

## Edit the site

| File | Purpose |
| --- | --- |
| `src/content.mjs` | Public facts, pinned evidence links, case study, engineering notes, research directions, and origin validation |
| `src/templates.mjs` | Shared layout, homepage, project pages, notebook pages, research page, and 404 |
| `public/styles.css` | Responsive typography, colors, components, reduced-motion and print styles |
| `public/main.js` | Mobile navigation and evidence-principle inspector |
| `scripts/build.mjs` | Clean static build, sitemap, robots, and RSS |
| `scripts/check.mjs` | Local reference/anchor checks, document metadata, unique IDs, landmarks, asset budget, and résumé exclusion |
| `scripts/serve.mjs` | Dependency-free local preview |

Add a route in `src/templates.mjs`, then build and check. Sitemap entries are generated from the page list. Add engineering notes to `notes` in `src/content.mjs` to include them in the RSS feed. Update the content revision date in `scripts/build.mjs` when publishing a substantive change.

## Editorial boundaries

The site uses only public evidence for the Cividian Site Diligence Agent and MindForge Skills repositories. Evidence URLs are pinned to reviewed revisions so a reader can inspect the specific artifact supporting a statement.

- Engineering notes are self-published analysis, not peer-reviewed papers.
- The Cividian report contains scripted cases; it is not a live factual-accuracy benchmark.
- Citation and numeric checks do not establish semantic entailment or legal applicability.
- MindForge is methodology tooling; measured reasoning gains are not claimed.
- Proposed research remains labeled proposed until datasets, methods, and results are actually published.
- AI-assisted workflows are disclosed in the About section.
- No invented employment, degree, personal implementation breakdown, award, adoption metric, or performance score is included.
- Private repository details, customer information, account state, and operational audits belong outside the public site.

## Verification

`npm run check` validates local links and anchors across every generated page, a single `h1`, language and main landmarks, metadata, unique IDs, accessible image requirements, reduced-motion/focus/print CSS, required static assets, and absence of résumé content. It also enforces a 50 KB uncompressed CSS budget.

The navigation and evidence inspector use native buttons with visible keyboard focus and ARIA state. Content remains readable without JavaScript. Production headers in `vercel.json` include a restrictive content security policy and disable camera, microphone, and geolocation permissions. No third-party fonts, analytics, forms, external JavaScript, or runtime dependencies are required.

Browser review should cover desktop and mobile, menu open/close/Escape behavior, inspector state changes, all case study and note routes, and print rendering. A successful static content check is not a replacement for that browser review.
