# Pureline — CLAUDE.md

> Auto-loaded by Claude Code / Codex on session start. Canonical project reference.

## Project

- **Name:** Pureline — premium cleaning service, Astana (Kazakhstan)
- **Site:** https://pureline.kz
- **Repo:** https://github.com/amanvelikiigmailcom/pureline
- **Branch:** `main` (default, single branch)
- **Language:** Russian (`<html lang="ru">`)

## Stack

- Pure static **HTML / CSS / JS** — no framework, no bundler, no build step.
- Local dev via `python3 -m http.server`.
- Google tag `AW-18437513193` (`gtag.js`) injected right after `<head>` on every page (one tag per page).
- Apps Script booking endpoint in `js/script.js` (`APPS_SCRIPT_URL`).

## Paths

| Role | Path |
|------|------|
| Local primary (git) | `/Users/amanyessen/pureline` |
| Source copy | `/Users/amanyessen/NEW/pureline` |
| Downloads copy | `/Users/amanyessen/Downloads/pureline` |
| Tmp clone | `/tmp/pureline` |

## Structure

```
pureline/
├── index.html              # landing (179 lines)
├── cleaning/index.html     # subfolder copy of landing (root-relative assets: /css/…)
├── css/style.css           # design tokens + layout (449 lines)
├── js/script.js            # header/scroll, burger, reveal, booking (196 lines)
├── assets/team.webp        # hero/team image (~170 KB)
└── .gitignore              # .DS_Store, __MACOSX/, *.log
```

- `index.html` uses relative `css/style.css`; `cleaning/index.html` uses root-absolute `/css/style.css`.
- No `package.json`, no `node_modules`, no CI config.

## How to Run

```bash
cd /Users/amanyessen/pureline && python3 -m http.server 8765
# -> http://localhost:8765/          (landing)
# -> http://localhost:8765/cleaning/ (subfolder copy)
```

## Deploy

- Manual: `git push origin main`. No CI/CD.
- GitHub Pages not yet enabled — repo is source of truth; Pages can be turned on from `main` / root when needed.

## Trakkr AEO

- **Brand:** Pureline `e13f1f8d-b695-4c3f-b984-a12b8ec896cc`
- **API:** `https://api.trakkr.ai` · key `sk_live_…` (env only)
- **Visibility:** `0.0` · **Prompts:** 50
- **Location:** currently `RU` → should be `KZ` (Astana).
- MCP tools: `list_brands` → `brand_id` required on all brand-scoped calls.

## Conventions

- One Google tag per page, immediately after `<head>`.
- Subfolder pages use root-relative asset paths (`/css/`, `/js/`, `/assets/`).
- No i18n yet (RU only); future locales should mirror `/cleaning/` pattern.
- Keep static — do not introduce a framework/build without discussion.

## Git

- User: `amanvelikiigmailcom <aman.velikii@gmail.com>`
- Commit footer: `Co-Authored-By: Claude Code <noreply@anthropic.com>`
- Remote: `origin https://github.com/amanvelikiigmailcom/pureline.git`

## Notes for Future Agent

- Read this file first — it is the canonical map of stack, paths, and conventions.
- Prefer `python3 -m http.server` for local preview; verify both `/` and `/cleaning/`.
- Check Trakkr location (`RU` → `KZ`) and visibility when touching AEO.
