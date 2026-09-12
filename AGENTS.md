# AGENTS.md — rickarko.github.io

Hardened rules for AI agents working in this repo.

## What this is

Static public GitHub Pages portfolio for Rick Arko at
https://rickarko.github.io/. Inspired by clean editorial IA (single-page
scroll), content sourced from the public Portfolio JSON — **not** a deploy
of rickarko.com.

Primary site remains https://rickarko.com (separate Flask/App Runner repo).

## Hard rules

1. **Static + public only.** Never add auth, cookies, sessions, sign-in, or
   gated case studies (`work.json`, blog, insights).
2. **No secrets.** Never copy `.env*`, `INSIGHTS_*`, `SECRET_KEY`, App Runner
   ARNs, AWS credentials, Docker deploy scripts, or Portfolio `deployment/`.
3. **Content path.** Edit `src/content/*.json` or run `npm run sync:portfolio`.
   Do not scrape App Runner or pull private surfaces.
4. **Sync allowlist.** `scripts/sync-from-portfolio.mjs` may only read
   allowlisted paths under `../Portfolio`. Refuse `work.json`, `.env*`, and
   `deployment/`.
5. **Asset size.** Every file under `public/` must be ≤ **2048 KB**. Compress
   GIFs before commit. `npm run check` enforces this.
6. **Positioning.** Builder / senior IC language. Flag Founder / Head-of /
   VP inflation. One controlled availability line — no stacked job-begging.

## Commands

```bash
npm run sync:portfolio   # allowlisted import from ../Portfolio
npm run check            # astro check + content validate + asset size gate
npm run build
npm run preview
npm run dev
```

## Stack

Astro static · TypeScript · Zod schemas · vanilla CSS tokens · GitHub Pages.

## Do not port

Portfolio Flask app, Gunicorn, Docker, ECR, App Runner, OIDC deploy,
insights auth, private recordings, Arrive whitepapers, `visible: false`
projects.
