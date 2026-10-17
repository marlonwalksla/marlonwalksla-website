# Page embed copies (Oct 14, 2026 drafts)

Section HTML for the site's embeds. **Home, /es, Team, Private and the Free tour pages now load
these files straight from this repo** (each Webflow embed is one `mw.js` line; see `MAP.md`), so for
those pages the repo is the source of truth: edit here, not in Webflow. Branch `test` feeds the test
site, branch `live` feeds marlonwalksla.com. About, Privacy, Terms, 404 and the header are still
reference copies (Webflow is the source). Styles come from `tour-pages.css`.
Red `.tp-todo` text marks info Marlon still needs to fill in.

| File | Webflow page | Where it sits |
|---|---|---|
| free-en.html | /free-walking-tour-los-angeles | Whole page body |
| free-es.html | /free-tour-los-angeles-espanol | Whole page body |
| team-top.html, team-form-intro.html, team-bottom.html | /team-building-walking-tour-los-angeles | Above the form, left of the form, below the form |
| private-top.html, private-form-intro.html, private-bottom.html | /private-tours-los-angeles | Above the form, left of the form, below the form |
| about.html | /about | Whole page body |
| privacy-policy.html | /privacy-policy | Whole page body |
| terms.html | /terms | Whole page body |
| 404.html | 404 utility page | To paste by hand in the Designer (the API cannot edit utility pages) |

## Home page embeds (Oct 15, 2026)
- `home-hero-left.html`: hero text, language toggle (also switches the Polaroid captions)
- `home-hero-polaroids.html`: three static Polaroids (Free, Private, Team) in the hero's right column
- `home-reviews-strip.html`: big review banner (505 reviews). Update the numbers by hand.
- `home-team.html`, `home-private.html`: Team and Private sections next to the forms, with map-only route animations
- `route-team-dtla.json`, `route-private-la.json`: the route data pasted into the `.ra` embeds (route-anim.js)
