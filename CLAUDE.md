# MarlonWalksLA website: notes for Claude

MarlonWalksLA is Marlon Gonzalez's walking-tour business in Los Angeles: free tours of Downtown LA in English and Spanish, team building tours and private tours. Mascot: Ernesto, a piñata donkey (always "Ernesto", never "Earnie").

## How the site is built
- **Webflow** (site ID `6a050f29c558b4d909196aad`) holds the pages, CMS and forms. Most page content lives in HTML embeds.
- **Embeds on Home, /es, Team, Private and the Free tour pages are one line each** that loads its section from this repo through `mw.js` (see `page-embeds/MAP.md`). Other pages still hold their code directly in Webflow.
- **This repo** holds the custom CSS and JS. Webflow loads them from jsDelivr: `https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/<file>?v=N`.
- `.github/workflows/refresh-cdn.yml` purges jsDelivr after every push to main, so changes show within a minute or two. Bump `?v=` in Webflow when a change must show immediately.
- `page-embeds/` holds the section HTML for those one-line embeds. For Home, /es, Team, Private and Free tour the repo is the source (Webflow only holds the loader line). For other pages (About, Privacy, 404, header...) the files are reference copies; Webflow is the source, so keep them in sync.
- **Two branches feed the sections:** `test` is what the test site (marlonwalksla.webflow.io) loads, `live` is what marlonwalksla.com loads. `mw.js` picks the branch from the hostname. Edit and push `test`; only after Marlon says OK, `git push origin test:live`. The embeds pin `mw.js` to commit `5b58f07489e770356f3dfa935dc89e76b3cdedc5` ("loader-v2", GitHub blocked creating a tag from here), so the loader never changes by accident. To change the loader, commit a new `mw.js` and update the 25 embeds to the new commit (or tag it as `loader-v3`).
- CSS and JS files (`global-vars.css`, `map-core.js`, etc.) still load from `@main`, so a push to main reaches the live site. Treat main as live for those files.

- **Crawler text:** each main page has a `<noscript>` copy of its text in the page's footer code in Webflow, built by `tools/build_crawler_text.py` (output in `tools/crawler-text/`). After copy changes in `page-embeds/`, re-run it and re-paste into that page's footer (keep the existing scripts above it).
- **Section prefetch:** the site head code has a small script with the list of sections per page (same URLs and branch rule as `mw.js`). When a page gets a new or renamed section, update that list too.

- **Shared photo slider:** `mw-slider.css` and `mw-slider.js` (on `main`) run every image slider (Team, Free tour, Private). Slide kinds: `.mws-print` (CSS Polaroid, optional custom `--frame`), `.mws-raw` (already framed), `.mws-photo`, `.mws-card`. Details in the CSS header. Each embed loads the two files itself.

## Consistency rule
- **Home has three parallel sections: Team, Private and Free tour (plus /es).** When Marlon asks for a change to one of them (pills, sliders, quotes, mobile order, captions, spacing, copy style), check the other two and apply the same change, or tell him why it does not apply. Check mobile (375px) too. Say in the reply which sections changed.

## Key files
- `global-vars.css`: brand colors and shared components (loaded site-wide)
- `tour-pages.css`: styles for the tour, About, Privacy and Terms pages. `.tp-todo` = red placeholder for info Marlon still has to fill in.
- Map: `map-core.js`, `spots.geojson` (master list of ~232 spots), `spot-groups.js` (regions, locations, moods), `ui-view-explore-v2.js` (filters and quiz), `storage-manager.js` (trip planner, browser storage only)
- Self-guided tours: `tour-dtla.js`, `tour-hollywood.js`. History stories: `history-water.js`, `history-transportation.js`.

## Rules
- **Never publish to the live domain (marlonwalksla.com) without Marlon's explicit OK.** Publish to the test site only: Webflow `publish_site` with `customDomains: []` and `publishToWebflowSubdomain: true` (marlonwalksla.webflow.io).
- Business email is **marlonwalksla@gmail.com**. Never use marlon@marlonwalksla.com (it does not exist).
- Copy: simple words ("if every word cost $1000"), English and Spanish, "Explore" as the key verb, no "hidden history", no em dashes.
- Real photos (guest Polaroids) over designed marketing images. No numbers baked into images. No off-brand AI Ernesto art. Guest photos only with permission.
- Review numbers come from Marlon's review sheet (Oct 14, 2026: 505 reviews, 4.86; Google 309 at 4.95). Update by hand; do not invent ratings in schema markup.
- Log every change in the claude.ai Project doc `claude/changelog.md`.
