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
