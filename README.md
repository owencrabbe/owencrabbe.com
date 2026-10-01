# Owen Crabbe — applied AI portfolio

A fast, dependency-free professional portfolio and engineering notebook. Projects and inspectable outputs form the public work record. The public site includes two source-linked project case studies, two self-published technical notes, and a clearly labeled proposed research agenda.

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

`SITE_ORIGIN` controls every canonical URL, Open Graph URL, feed link, and sitemap entry. It must be an HTTPS origin without a path or trailing slash. The default is the connected custom domain:

```sh
SITE_ORIGIN=https://owencrabbe.com npm run build
```

To generate a standalone preview with a different origin, override it when building:

```sh
SITE_ORIGIN=https://owencrabbe-portfolio.vercel.app npm run build
```

DNS hosting and domain registration are separate from this site. Pointing a website to Vercel does not require transferring registration. Preserve existing mail-related DNS records when changing web records. This project does not modify DNS or email.

## Edit the site

| File | Purpose |
| --- | --- |
| `src/content.mjs` | Public facts, pinned evidence links, case study, engineering notes, research directions, and origin validation |
| `src/templates.mjs` | Shared layout, homepage, project pages, notebook pages, research page, and 404 |
| `public/styles.css` | Responsive typography, colors, components, reduced-motion and print styles |
| `public/main.js` | Progressively enhanced mobile navigation |
| `scripts/build.mjs` | Clean static build, sitemap, robots, and RSS |
| `scripts/check.mjs` | Local reference/anchor checks, document metadata, unique IDs, landmarks, and asset budget |
| `scripts/serve.mjs` | Dependency-free local preview |

Add a route in `src/templates.mjs`, then build and check. Sitemap entries are generated from the page list. Add engineering notes to `notes` in `src/content.mjs` to include them in the RSS feed. Update the content revision date in `scripts/build.mjs` when publishing a substantive change.

## Editorial boundaries

The site uses public evidence for the Cividian Site Diligence Agent and Phroneme projects. Phroneme's reusable toolkit retains the MindForge-Skills repository name. Evidence URLs are pinned to reviewed revisions so a reader can inspect the specific artifact supporting a statement.

- Engineering notes are self-published analysis, not peer-reviewed papers.
- The Cividian report contains scripted cases; it is not a live factual-accuracy benchmark.
- Citation and numeric checks do not establish semantic entailment or legal applicability.
- Phroneme's journal and evidence contract have software tests; controlled reasoning improvements and health outcomes have not been established.
- Proposed research remains labeled proposed until datasets, methods, and results are actually published.
- AI-assisted workflows are disclosed in the About section.
- No invented employment, degree, personal implementation breakdown, award, adoption metric, or performance score is included.
- Private repository details, customer information, account state, and operational audits belong outside the public site.

## Verification

`npm run check` validates local links and anchors across every generated page, a single `h1`, language and main landmarks, metadata, unique IDs, accessible image requirements, reduced-motion/focus/print CSS, and required static assets. It also enforces a 50 KB uncompressed CSS budget.

The mobile navigation uses a native button with visible keyboard focus and ARIA state. Navigation remains visible when JavaScript is unavailable, and in-page menu links move focus to their destination. Content remains readable without JavaScript. Production headers in `vercel.json` include a restrictive content security policy and disable camera, microphone, and geolocation permissions. No third-party fonts, analytics, forms, external JavaScript, or runtime dependencies are required.

Browser review should cover desktop and mobile, menu open/close/Escape behavior, all case study and note routes, and print rendering. A successful static content check is not a replacement for that browser review.

## Professional record and publication status

The homepage distinguishes public implementations, self-published engineering notes, and proposed studies. Add preprints and peer-reviewed publications only when an inspectable artifact and its actual status exist. A repository, demo, software test, or internal review does not establish a scientific result or independent review. Preserve pinned source links and historical test counts in the case studies.

Before release, run build/check and browser QA at desktop and mobile widths. Verify menu keyboard behavior, no-JavaScript navigation, contact/RSS links, accessible focus, all article routes, and print rendering. Review and approve changes before merging or deploying to production.
