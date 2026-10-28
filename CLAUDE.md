# MarlonWalksLA website: notes for Claude

MarlonWalksLA is Marlon Gonzalez's walking-tour business in Los Angeles: free tours of Downtown LA in English and Spanish, team building tours and private tours. Mascot: Ernesto, a piñata donkey (always "Ernesto", never "Earnie").

## How the site is built
- **Webflow** (site ID `6a050f29c558b4d909196aad`) holds the pages, CMS and forms. Most page content lives in HTML embeds.
- **This repo** holds the custom CSS and JS. Webflow loads them from jsDelivr: `https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/<file>?v=N`.
- `.github/workflows/refresh-cdn.yml` purges jsDelivr after every push to main, so changes show within a minute or two. Bump `?v=` in Webflow when a change must show immediately.
- `page-embeds/` holds reference copies of the HTML pasted into Webflow embeds. Webflow is the live source; keep these copies in sync when you change an embed.

## Key files
- `global-vars.css`: brand colors and shared components (loaded site-wide)
- `tour-pages.css`: styles for the tour, About, Privacy and Terms pages. `.tp-todo` = red placeholder for info Marlon still has to fill in.
- Map: `page-embeds/map-v2.html` is the passport-first map served at /maps and /mapa-los-angeles. It reads
  `spots.geojson` (master list of ~232 spots) and `passport-collections.json` directly. The pre-Oct-26 map
  code (map-core, spot-groups, storage-manager, ui-view-*) was deleted on Oct 28, 2026; it is in git history.
- Passport: `page-embeds/free-passport.html` (/free-tour-passport). `free-passport-stops.json` is its source
  data; the builder that inlines it is NOT in this repo.
- Self-guided tours are retired (content in `claude/hollywood-tour-content.md`). History stories now live in
  the Webflow Blogs and Historias (ES) collections, rendered by `story-cards.js`, not in this repo.

## Rules
- **Never publish to the live domain (marlonwalksla.com) without Marlon's explicit OK.** Publish to the test site only: Webflow `publish_site` with `customDomains: []` and `publishToWebflowSubdomain: true` (marlonwalksla.webflow.io).
- Business email is **marlonwalksla@gmail.com**. Never use marlon@marlonwalksla.com (it does not exist).
- Copy: simple words ("if every word cost $1000"), English and Spanish, "Explore" as the key verb, no "hidden history", no em dashes.
- Real photos (guest Polaroids) over designed marketing images. No numbers baked into images. No off-brand AI Ernesto art. Guest photos only with permission.
- Review numbers come from Marlon's review sheet (Oct 14, 2026: 505 reviews, 4.86; Google 309 at 4.95). Update by hand; do not invent ratings in schema markup.
- Log every change in the claude.ai Project doc `claude/changelog.md`.
