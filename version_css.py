#!/usr/bin/env python3
"""Publish an exact, content-hashed copy of css/style.css to every HTML page.

Run after editing css/style.css. Existing hashed files remain available so pages
that have not yet been updated can still load their previous stylesheet.
"""

import argparse
import hashlib
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "css" / "style.css"
STYLESHEET_LINK = re.compile(
    r'href=(?P<quote>["\'])/css/style(?:\.[0-9a-f]{12})?\.css(?P=quote)'
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify without changing files")
    args = parser.parse_args()

    css = SOURCE.read_bytes()
    digest = hashlib.sha256(css).hexdigest()[:12]
    target = SOURCE.with_name(f"style.{digest}.css")
    url = f"/css/{target.name}"
    pages = sorted(
        path for path in ROOT.rglob("*.html")
        if not any(part.startswith(".") or part == "node_modules" for part in path.relative_to(ROOT).parts)
    )

    replacements = []
    linked_pages = 0
    for path in pages:
        html = path.read_text(encoding="utf-8")
        links = list(STYLESHEET_LINK.finditer(html))
        if not links:
            continue
        linked_pages += 1
        updated = STYLESHEET_LINK.sub(
            lambda match: f'href={match.group("quote")}{url}{match.group("quote")}', html
        )
        if updated != html:
            replacements.append((path, updated))

    if linked_pages == 0:
        raise SystemExit("No HTML pages link to css/style.css")
    if target.exists() and target.read_bytes() != css:
        raise SystemExit(f"Hashed stylesheet differs from source: {target}")

    if args.check:
        if not target.exists() or replacements:
            raise SystemExit(
                f"CSS version is out of date: {len(replacements)} of {linked_pages} pages need {url}"
            )
        print(f"OK: {linked_pages} pages use {url}; hashed file matches css/style.css byte for byte")
        return

    if not target.exists():
        target.write_bytes(css)
    for path, updated in replacements:
        path.write_text(updated, encoding="utf-8")
    print(f"CSS: {url} (exact copy)")
    print(f"Updated {len(replacements)} of {linked_pages} linked HTML pages")


if __name__ == "__main__":
    main()
