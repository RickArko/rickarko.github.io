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
7. **Public repo = published forever.** Never commit browser profiles,
   screenshot user-data dirs, or telemetry. Forbidden: `.brave-shot/`,
   `.chrome-shot/`, `.chromium-user-data/`, `.playwright-profile/`,
   `.puppeteer-profile/`, and files named `Local State`,
   `TransportSecurity`, `Network Persistent State`, `Cookies`,
   `Login Data`. Screenshots belong in `public/` only as compressed
   images — never the browser that captured them. `npm run check:privacy`
   fails the gate if any of these are tracked.

   If a leak lands on a public branch:
   - Deleting the files in a later commit is **not** a scrub. The blobs
     stay in git history and on GitHub.
   - Do **not** merge those commits onto `main` as-is. Squash-merge only
     after HEAD no longer contains the files, then delete the remote
     topic branch.
   - To purge history, rewrite with `git filter-repo` (or BFG), force-push
     every branch that contained the files (user must authorize
     `--force-with-lease`), and ask GitHub Support to clear cached
     objects. Anyone who cloned the branch should delete it and re-clone.
   - Review comments and PR diffs can still hold the leaked bytes after
     a rewrite. Treat those identifiers as public; do not paste profile
     JSON into issues or chat.

## Commands

```bash
npm run sync:portfolio   # allowlisted import from ../Portfolio
npm run check            # content + assets + privacy + astro check
npm run check:privacy    # fail if browser-profile files are tracked
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
