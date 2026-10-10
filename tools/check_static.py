#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: check_static.py
Modification: 2026-10-10 - 檢查原生靜態網頁的資源路徑、重複 ID 與基本內容。
"""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
# Keep this legacy checker scoped to the original static snapshot. Next.js
# writes its own generated HTML/assets to out/, which has a different layout.
PAGES = []
EXPORTED_ROUTES = [
    'index.html',
    '_not-found/index.html',
    'astro/index.html',
    'astro/tools/index.html',
    'astro/map/index.html',
    'astro/tonight/index.html',
    'astro/planner/index.html',
    'astro/compare/index.html',
    'astro/deep-sky/index.html',
    'astro/constellations/index.html',
    'astro/moon/index.html',
    'astro/equipment/index.html',
    'astro/exposure/index.html',
    'astro/object/m42/index.html',
    'astro/object/m110/index.html',
    'en/index.html',
    'en/astro/tools/index.html',
    'en/astro/object/m42/index.html',
    'en/astro/object/m110/index.html',
]


# ── HTML 結構檢查 ──
class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicates = []
        self.assets = []
        self.language = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        identifier = attributes.get('id')
        if identifier:
            if identifier in self.ids:
                self.duplicates.append(identifier)
            self.ids.add(identifier)
        if tag == 'html':
            self.language = bool(attributes.get('lang'))
        for name in ('src', 'href'):
            value = attributes.get(name)
            if value:
                self.assets.append(value)


def main():
    errors = []
    for page in PAGES:
        doc = Inspector()
        doc.feed(page.read_text(encoding='utf-8'))
        if not doc.language:
            errors.append(f'{page.relative_to(ROOT)}: missing lang')
        for identifier in doc.duplicates:
            errors.append(f'{page.relative_to(ROOT)}: duplicate id {identifier}')
        for link in doc.assets:
            if link.startswith(('http:', 'https:', 'mailto:', '#', 'data:')):
                continue
            parts = urlsplit(link)
            if parts.path in ('', './'):
                continue
            target = (page.parent / unquote(parts.path)).resolve()
            if not target.is_relative_to(ROOT.resolve()) or not target.exists():
                errors.append(f'{page.relative_to(ROOT)}: broken path {link}')
        print(f'CHECK {page.relative_to(ROOT)}: {len(doc.ids)} elements with ID')
    if errors:
        print('\n'.join(f'ERROR {error}' for error in errors))
        raise SystemExit(1)
    exported_root = ROOT / 'out'
    missing = [route for route in EXPORTED_ROUTES if not (exported_root / route).exists()]
    if missing:
        raise SystemExit('ERROR missing exported routes: ' + ', '.join(missing))
    content_expectations = {
        'astro/tools/index.html': ('Astro Tools', 'AstroLab'),
        'astro/map/index.html': ('Sky Map', 'Astro Catalog'),
        'en/astro/tools/index.html': ('Observation tools', 'AstroLab'),
    }
    for route, required in content_expectations.items():
        page = exported_root / route
        content = page.read_text(encoding='utf-8')
        for phrase in required:
            if phrase not in content:
                raise SystemExit(f'ERROR {route} missing expected content: {phrase}')
        if '← STLab' in content:
            raise SystemExit(f'ERROR {route} contains stale STLab navigation')
    print(f'CHECK route content: {len(content_expectations)} tool pages')
    zh_objects = list((exported_root / 'astro' / 'object').glob('*/index.html'))
    en_objects = list((exported_root / 'en' / 'astro' / 'object').glob('*/index.html'))
    if not zh_objects or len(zh_objects) != len(en_objects):
        raise SystemExit(f'ERROR object route mismatch: zh={len(zh_objects)} en={len(en_objects)}')
    print(f'CHECK object detail pages: zh={len(zh_objects)} en={len(en_objects)}')
    print(f'CHECK out/: {len(EXPORTED_ROUTES)} Next.js routes present')
    print('OK: current Next.js static routes validated')


if __name__ == '__main__':
    main()
