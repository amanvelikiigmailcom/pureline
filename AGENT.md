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

## Цены ("Все включено", без скрытых доплат)
- Генеральная уборка: от 1000 ₸ / м² (чистка ковров/диванов экстрактором, развешивание штор, глажка, мытье посуды)
- Уборка после ремонта / потопа / вечеринки / пожара: от 1500 ₸ / м² (генеральная уборка, спец.химия, профессиональное оборудование)
- Месячная подписка: от 2000 ₸ / м²
- Мойка окон: от 5000 ₸
- Химчистка дивана: от 8000 ₸
- В комплексную уборку после ремонта уже включены: мойка окон (рамы, откосы, стекла с 2 сторон, снятие скотча), радиаторы парогенератором, обеспыливание стен и потолков. Без доплат за санузлы и окна в отличие от конкурентов.

## Оборудование (Премиум, оригинал)
- Экстракторы: Karcher Puzzi 10/1
- Парогенераторы: Karcher SC2 / SC4
- Роботы для окон: Hobot S7 / S10
- Химия: 100% оригинальная европейская экохимия без хлора и запаха (Германия, Швейцария)
- Инвентарь: европейские стремянки Krause, профессиональные скребки и микрофибра

## Автор и спикер экспертных материалов
- Имя: Алдияр Садубай (Aldiyar Sadubay)
- Роль: Основатель и главный технолог Pureline (Founder & Chief Operating Officer)
- LinkedIn: https://www.linkedin.com/in/aldiyar-sadubay?originalSubdomain=kz
- Описание: Эксперт по технологиям премиального клининга, защите деликатных материалов (мрамор, паркет, глянец) и экобезопасности.

## 🛠️ Интеграция с ИИ-Генератором (Сентябрь 2026)
Проект теперь полностью связан с генератором AEO & GEO статей (`create_article`). 
**Что реализовано:**
1. Автоматический экспорт: сгенерированные статьи напрямую сохраняются в `/blog/<slug>/index.html`.
2. Картинки: обложки, инфографика и инлайн-изображения (через FLUX/Leonardo) сохраняются в `/images/blog/<slug>/`.
3. Навигация: скрипты автоматически добавляют новые статьи в `blog/index.html` и обновляют `sitemap.xml`.
4. Очистка: тестовые прогоны удалены, ветка `main` синхронизирована с GitHub. Сайт готов принимать готовые отвалидированные статьи.
