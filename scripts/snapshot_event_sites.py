#!/usr/bin/env python3
"""Fetch a lightweight snapshot of every event's website for review/tagging.

For each unique `website:` in _events/, fetches the page (stdlib only) and
records title, meta/og description, headings and a slice of visible text into
reports/event_site_snapshots.json. Maintainer tool; nothing on the site uses
the output. Re-runs skip URLs already snapshotted unless --refresh.

Usage: python3 scripts/snapshot_event_sites.py [--refresh] [--workers N]
"""
import concurrent.futures, glob, html, json, os, re, sys, urllib.request, ssl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "reports", "event_site_snapshots.json")
UA = "Mozilla/5.0 (compatible; BoardGameClubsBot/1.0; +https://boardgameclubs.org)"

def frontmatter(path):
    txt = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---", txt, re.S)
    data = {}
    for line in m.group(1).split("\n"):
        mm = re.match(r'^(\w+): "?(.*?)"?$', line)
        if mm: data[mm.group(1)] = mm.group(2)
    return data

def strip_tags(s):
    s = re.sub(r"(?is)<(script|style|noscript|svg|nav|footer|header)[^>]*>.*?</\1>", " ", s)
    s = re.sub(r"(?s)<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()

def meta(page, name):
    m = re.search(r'(?is)<meta[^>]+(?:name|property)=["\']%s["\'][^>]*content=["\']([^"\']*)' % re.escape(name), page)
    if not m:
        m = re.search(r'(?is)<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:name|property)=["\']%s["\']' % re.escape(name), page)
    return html.unescape(m.group(1)).strip() if m else ""

def fetch(url):
    ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    try:
        with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
            raw = r.read(600_000)
            final = r.geturl(); status = r.status
    except Exception as e:
        return {"url": url, "error": str(e)[:200]}
    page = raw.decode("utf-8", "replace")
    title = re.search(r"(?is)<title[^>]*>(.*?)</title>", page)
    heads = [strip_tags(h) for h in re.findall(r"(?is)<h[12][^>]*>(.*?)</h[12]>", page)][:8]
    return {
        "url": url, "final_url": final, "status": status,
        "title": strip_tags(title.group(1)) if title else "",
        "description": meta(page, "description") or meta(page, "og:description"),
        "og_title": meta(page, "og:title"),
        "headings": [h for h in heads if h],
        "text": strip_tags(page)[:1500],
    }

def main():
    refresh = "--refresh" in sys.argv
    workers = int(sys.argv[sys.argv.index("--workers") + 1]) if "--workers" in sys.argv else 12
    snaps = json.load(open(OUT)) if os.path.exists(OUT) and not refresh else {}
    urls = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "_events", "*", "*.md"))):
        d = frontmatter(f)
        if d.get("website"):
            urls.setdefault(d["website"], []).append(os.path.relpath(f, ROOT))
    todo = [u for u in urls if u not in snaps]
    print(f"{len(urls)} unique sites, {len(todo)} to fetch")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(workers) as ex:
        for i, snap in enumerate(ex.map(fetch, todo), 1):
            snap["events"] = urls[snap["url"]]
            snaps[snap["url"]] = snap
            if i % 25 == 0:
                print(f"  {i}/{len(todo)}"); json.dump(snaps, open(OUT, "w"), indent=1, ensure_ascii=False)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(snaps, open(OUT, "w"), indent=1, ensure_ascii=False)
    errs = sum(1 for s in snaps.values() if "error" in s)
    print(f"done: {len(snaps)} snapshots, {errs} fetch errors -> {os.path.relpath(OUT, ROOT)}")

if __name__ == "__main__":
    main()
