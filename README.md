# rickarko.github.io

Static public portfolio for [Rick Arko](https://github.com/RickArko),
deployed on GitHub Pages at https://rickarko.github.io/.

Primary site: https://rickarko.com (separate repo). This Pages site is a
lightweight self-contained clone of **public** Portfolio content only —
no secrets, no gated work/blog.

## Quick start

```bash
npm install
npm run sync:portfolio   # first time / when Portfolio public JSON changes
npm run dev
```

## Quality gate

```bash
npm run check   # content + assets + privacy + astro check
npm run build
```

## Content

- Source of truth for bios/projects: `../Portfolio/src/db/*.json` (public)
- Local copies: `src/content/{home,experience,projects}.json`
- Toolkit chips: `toolkit` in `src/content/home.json` (hand-selected; sync preserves it)
- Assets: `public/images/`, `public/downloads/`

Re-sync:

```bash
npm run sync:portfolio
```

## Deploy

Push to `main`. GitHub Actions builds and deploys to Pages.
Repo must be named `RickArko.github.io` for the user site URL.


## Update resume

The Résumé button serves `public/downloads/resume-generic-media.pdf`.
Pages deploys from **`main`** — a local swap alone does not update the live site.

```bash
# 1. Paste the path to the new PDF
NEW_RESUME="/path/to/your-new-resume.pdf
NEW_RESUME="~/Downloads/RickArkoResume.pdf"

# 2. Install into this repo (what the site links to)
cp "$NEW_RESUME" public/downloads/resume-generic-media.pdf

# 3. Optional: no-media variant (synced but not linked in the nav)
# NEW_RESUME_NO_MEDIA="/path/to/resume-no-media.pdf"
# cp "$NEW_RESUME_NO_MEDIA" public/downloads/resume-no-media.pdf

# 4. Optional but recommended: mirror into Portfolio so the next
#    `npm run sync:portfolio` does not restore an older PDF
cp public/downloads/resume-generic-media.pdf \
  ../Portfolio/src/static/downloads/resume-generic-media.pdf
# cp public/downloads/resume-no-media.pdf \
#   ../Portfolio/src/static/downloads/resume-no-media.pdf

# 5. Gate (PDF must stay ≤ 2048 KB)
npm run check:assets

# 6. Ship on main (adjust branch if you use a PR)
git add public/downloads/resume-generic-media.pdf
# git add public/downloads/resume-no-media.pdf   # if you updated it
git commit -m "update resume"
git push origin HEAD
# If you are not on main: open a PR and merge into main
```

Do **not** run `npm run sync:portfolio` just to refresh the resume — sync
rewrites `src/content/*.json` from Portfolio and can drop Pages-only edits
(Arrive, ccquant card, Title Case, etc.). Copy the PDF as above instead.
