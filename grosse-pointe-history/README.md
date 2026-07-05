# Grosse Pointe: A Documented History

A neutral, citation-first static website documenting Grosse Pointe's school-board
fights, elections and civic disputes from ~2018 to the present. Built to be a
durable public record ahead of the next school-board election.

## Editorial standard

Two tiers of statement, kept visually distinct:

- **Documented facts** — votes, dates, filings, quotes — carry an inline link to
  news reporting or a public record.
- **Allegations / rumor / characterization** are labeled and attributed, never
  stated in the site's own voice. Unsourced community claims carry a
  `⚠ Needs local source` badge (see `about.html#open-items`).

Do not remove a `Needs local source` badge without attaching a real source.
Never invent a citation.

## Structure (flat, no build step)

```
index.html          Home + master timeline
schools.html        The district saga (2018–2025), anchored sections
cotton.html         Sean Cotton: paper, board, PfAE, STEAM, spending, influence
national.html       Palmer / Wayne County, Oltmann / FEC United / Dominion, Jan 6
south-north.html    The two high schools + the North clinic funding question
people.html         Cast of characters
sources.html        Master bibliography
about.html          Methodology, corrections, open items, anonymity note
search.html         Client-side search UI
assets/
  style.css         All styles (light/dark, no external fonts)
  site.js           Theme toggle + active-nav
  search.js         Client-side search
  search-index.json Hand-maintained search index (keep in sync when editing)
vercel.json         Static hosting config
```

Pure static HTML/CSS/JS. No framework, no build. Works opened locally or served
by any static host.

## Run locally

```bash
cd grosse-pointe-history
python3 -m http.server 8080
# open http://localhost:8080
```

(Search uses `fetch()` on `search-index.json`, so it needs to be *served*, not
opened as a `file://` path.)

## Maintaining search

When you add or change a section, add/update the matching entry in
`assets/search-index.json` (fields: `title`, `url`, `section`, `date`, `tags`,
`body`). The `url` should point at the page + anchor, e.g. `schools.html#clinic`.

## Deploy to Vercel

This folder is the site root. Either:

- **Vercel dashboard** → New Project → import the repo → set **Root Directory**
  to `grosse-pointe-history` → Framework preset: **Other** → deploy. No build
  command; output is the directory itself.
- Or `vercel` CLI from inside this folder.

`vercel.json` sets clean URLs and basic security headers.

## Anonymity / hosting notes (see about.html)

If the goal is to publish without the author's identity attached:

- Put this in its **own repository**, not tied to a personal account/site, and
  keep author-identifying details out of commits and content.
- Register the domain with **WHOIS privacy** enabled (most registrars offer it
  free).
- Point the domain at the deployment; the deploy platform account can be a
  dedicated one.
- Anonymity does **not** lower the accuracy bar — the sourcing standard above is
  the accountability. Correct errors quickly and visibly.

_This README is internal documentation and is not published as a page._
