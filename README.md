# rickarko.github.io

Static public portfolio for [Rick Arko](https://github.com/RickArko),
deployed on GitHub Pages at https://rickarko.github.io/.

Primary site: https://rickarko.com (separate repo). This Pages site is a
lightweight, self-contained site built from **public** Portfolio content
only: no secrets, no gated work or blog.

## Quick start

```bash
npm install
npm run dev
```

## Quality gate

```bash
npm run check   # content + assets + privacy + astro check
npm run build
```

## Content

- Content lives in `src/content/{home,experience,projects}.json`, validated
  by Zod (`src/lib/schemas.ts`) at build time and by `npm run check:content`.
- `check:content` also fails if any `/images/...` or `/downloads/...` path in
  the JSON is missing from `public/`.
- Toolkit: `toolkit` in `home.json` is a grouped, Pages-curated list
  (`{ label, items }[]`); sync keeps the local copy.
- Every number on the site should trace to the resume, a repo README, or a
  live app. Don't add metrics you can't point to.

### Project cards (`projects.json`)

| Field | Purpose |
|---|---|
| `tier` | `featured` (large rows), `grid` (cards), or `more` (text list) |
| `title`, `tagline` | Plain name and a one-line subtitle |
| `description`, `impact` | What it is; the measured result |
| `engineering` | Featured only: tests, CI, deployment |
| `image` | Still image, or the poster frame when `video` is set |
| `video` | Muted MP4 that plays only while in view (never with reduced motion) |
| `figure` | Inline SVG figure (`platform`, `agent`, `recs`) instead of media |
| `frame` | `browser` adds a URL bar showing the `demo_url` domain |
| `github_url` | **Public repos only.** Leave empty for private repos; the card shows "Private repo" |

Convert screen recordings to MP4 + WebP poster rather than shipping GIFs:

```bash
ffmpeg -i in.gif -movflags +faststart -c:v libx264 -preset veryslow -crf 26 \
  -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -an public/images/projects/name.mp4
ffmpeg -i in.gif -vf "select=eq(n\,30)" -frames:v 1 -c:v libwebp -quality 82 public/images/projects/name.webp
```

### Sync from Portfolio

`npm run sync:portfolio` imports from `../Portfolio/src/db/*.json`. It is
lossy: it overwrites the Pages-only copy edits and project-card fields above,
so diff and reconcile `src/content/` after running it.

## Deploy

Push to `main`. GitHub Actions builds and deploys to Pages.
Repo must be named `RickArko.github.io` for the user site URL.


## Update resume

The Resume button serves `public/downloads/resume-generic-media.pdf`.
Pages deploys from **`main`**; a local swap alone does not update the live site.

```bash
# 1. Path to the new PDF (unquoted ~ so the shell expands it)
NEW_RESUME=~/Downloads/RickArkoResume.pdf

# 2. Install into this repo (what the site links to)
cp "$NEW_RESUME" public/downloads/resume-generic-media.pdf

# 3. Optional: no-media variant (not linked on the site)
# cp /path/to/resume-no-media.pdf public/downloads/resume-no-media.pdf

# 4. Optional: mirror into Portfolio so a later sync doesn't restore an older PDF
cp public/downloads/resume-generic-media.pdf \
  ../Portfolio/src/static/downloads/resume-generic-media.pdf

# 5. Gate (PDF must stay ≤ 2048 KB)
npm run check:assets

# 6. Commit on a branch and open a PR into main
git add public/downloads/resume-generic-media.pdf
git commit -m "Update resume"
```

Don't run `npm run sync:portfolio` just to refresh the resume. Copy the PDF
as above instead.
