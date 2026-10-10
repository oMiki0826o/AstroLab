#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: check-static.py
Modification: 2026-10-11 - Validate every exported HTML route, anchors, basePath and assets.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import os

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out"
BASE = os.getenv("NEXT_PUBLIC_BASE_PATH", "").rstrip("/")


# ── HTML parsing ──
class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        ident = attributes.get("id")
        if ident:
            if ident in self.ids:
                self.duplicates.append(ident)
            self.ids.add(ident)
        for name in ("href", "src"):
            if attributes.get(name):
                self.links.append((tag, name, attributes[name]))


# ── Routing and file checks ──
def exported_path(url, source):
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or not parts.path or url.startswith(("data:", "mailto:", "tel:", "#")):
        return None
    path = unquote(parts.path)
    if path.startswith("//"):
        return None
    if path.startswith("/"):
        if BASE and path != BASE and not path.startswith(BASE + "/"):
            raise ValueError(f"missing base path prefix: {path}")
        if BASE:
            path = path[len(BASE):]
        relative = path.lstrip("/")
    else:
        relative = (source.parent.relative_to(OUT) / path).as_posix()
    if relative.endswith("/") or not Path(relative).suffix:
        relative = relative.rstrip("/") + "/index.html" if relative.rstrip("/") else "index.html"
    result = (OUT / relative).resolve()
    if not result.is_relative_to(OUT.resolve()):
        raise ValueError("path traversal")
    return result


def main():
    pages = list(OUT.rglob("*.html"))
    if len(pages) < 220:
        raise SystemExit(f"Expected static object routes and tools, found {len(pages)} HTML files")
    errors = []
    checked = 0
    for page in pages:
        parser = PageInspector()
        parser.feed(page.read_text(encoding="utf-8"))
        for ident in parser.duplicates:
            errors.append(f"{page.relative_to(OUT)}: duplicate id '{ident}'")
        for tag, attr, url in parser.links:
            try:
                target = exported_path(url, page)
                if target is not None and not target.exists():
                    errors.append(f"{page.relative_to(OUT)}: broken {tag}.{attr} → {url}")
                checked += 1
            except ValueError as exc:
                errors.append(f"{page.relative_to(OUT)}: {url}: {exc}")
    # Prevent a basePath regression. It doubles in old English pages.
    for page in pages:
        if BASE and f'{BASE}{BASE}/' in page.read_text(encoding="utf-8"):
            errors.append(f"{page.relative_to(OUT)}: double project basePath")
    if errors:
        for error in errors[:60]:
            print("ERROR", error)
        raise SystemExit(f"{len(errors)} static-export errors")
    print(f"OK: {len(pages)} static HTML routes, {checked} assets and links checked, basePath={BASE or '/'}")


if __name__ == "__main__":
    main()
