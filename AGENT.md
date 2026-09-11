# Pureline — AGENT.md

- Project: Pureline Astana — https://pureline.kz — repo https://github.com/amanvelikiigmailcom/pureline (`main`)
- Stack: static HTML/CSS/JS — no build, no framework
- Paths:
  - primary `/Users/amanyessen/pureline` (git)
  - source `/Users/amanyessen/NEW/pureline`
- Structure:
  - `index.html` — Google tag `AW-18437513193` right after `<head>`
  - `cleaning/index.html` — copy, assets via `/css/` `/js/` `/assets/`
  - `css/style.css`, `js/script.js`, `assets/team.webp`
- Run: `python3 -m http.server 8765` → `localhost:8765/` and `/cleaning/`
- Trakkr: brand `e13f1f8d-b695-4c3f-b984-a12b8ec896cc` — visibility `0.0` — 50 prompts
- Git: `amanvelikiigmailcom` — push to `main`

## Design
- Fonts: `Cormorant Garamond` 400/500/600/700 (headings h1-h3, logo, serif) + `Manrope` 300-700 (body/UI) via Google Fonts; vars `--serif`/`--sans`/`--ease cubic-bezier(.16,.84,.44,1)`
- Colors: `--ink #0d1613`/`--ink-2 #14211c` dark bg, `--surface #fff`/`--soft #f6f4ee`/`--line #e7e2d6`, `--text #1b241f`/`--soft #5c665f`, `--on-dark #f3f1ea`/`#a9b3ac`, `--gold #b28a4b`/`--gold-light #d6b877`
- Radius/shadow: `--radius 18px`, cards 24-28px, inputs 12-14px, buttons 100px pill; shadow `0 30px 80px rgba(0,0,0,.35)` / header `0 10px 30px rgba(0,0,0,.15)`
- Style: premium/minimal — dark hero gradient+gold radials+grid+noise 0.025, gold accents, serif headlines, `em` gold italic, reveal `translateY(24px)` .9s
- Layout: container 1180px + 32px gutter, section 88px (48px mobile), breakpoints 980px/720px
- Keep fonts/colors/vars consistent when creating new pages like `/cleaning/` — reuse `css/style.css` tokens, pill CTAs, `clamp()` headings
