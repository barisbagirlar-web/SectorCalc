#!/usr/bin/env python3
import json
import re
from pathlib import Path
import urllib.request
import urllib.error

ROOT = Path(__file__).resolve().parents[1]
INDEXNOW_KEY = "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b"
HOST = "sectorcalc.com"
KEY_LOCATION = f"https://{HOST}/9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b.txt"
ENDPOINTS = ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"]

def load_urls():
    sitemap_path = ROOT / "public" / "sitemap.xml"
    if not sitemap_path.exists():
        return ["https://sectorcalc.com/"]
    content = sitemap_path.read_text(encoding="utf-8")
    urls = re.findall(r"<loc>(https://sectorcalc\.com[^<]*)</loc>", content)
    return sorted(list(set(urls)))

def ping():
    url_list = load_urls()
    print(f"Submitting {len(url_list)} URLs to IndexNow endpoints...")
    payload = {"host": HOST, "key": INDEXNOW_KEY, "keyLocation": KEY_LOCATION, "urlList": url_list}
    data = json.dumps(payload).encode('utf-8')
    headers = {'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'IndexNow-Notifier/2.0'}
    for ep in ENDPOINTS:
        try:
            req = urllib.request.Request(ep, data=data, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"✅ {ep} -> HTTP {resp.getcode()}")
        except Exception as e:
            print(f"⚠️ {ep} -> {e}")

if __name__ == "__main__":
    ping()

