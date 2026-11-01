from pathlib import Path
import re
import struct
import sys

root = Path(__file__).resolve().parents[2]
errors = []

def check(condition, message):
    if condition:
        print(f"[PASS] {message}")
    else:
        print(f"[FAIL] {message}")
        errors.append(message)

required = [
    ".nojekyll",
    "index.html",
    "en/index.html",
    "licensing/index.html",
    "en/licensing/index.html",
    "stories/index.html",
    "en/stories/index.html",
    "sitemap.xml",
    "robots.txt",
    "lotus-approved.png",
    "lotus-favicon.png",
]

for name in required:
    check((root / name).is_file(), f"Required file: {name}")

# Bilingual story directories
zh = {
    p.parent.name
    for p in (root / "stories").glob("*/index.html")
}
en = {
    p.parent.name
    for p in (root / "en/stories").glob("*/index.html")
}

check(len(zh) == 29, f"Chinese stories: {len(zh)}/29")
check(len(en) == 29, f"English stories: {len(en)}/29")
check(zh == en, "Chinese and English story slugs match")

# Check deployment asset references in generated HTML.
html_files = list(root.rglob("*.html"))
check(len(html_files) >= 40, f"HTML pages: {len(html_files)}")

missing_assets = set()
pattern = re.compile(r'/_next/static/[A-Za-z0-9_./%-]+')

for html in html_files:
    content = html.read_text(encoding="utf-8")
    for ref in pattern.findall(content):
        asset = ref.split("?", 1)[0]
        if not (root / asset.lstrip("/")).is_file():
            missing_assets.add(asset)

check(
    not missing_assets,
    f"Referenced Next.js static assets ({len(missing_assets)} missing)"
)
for item in sorted(missing_assets)[:20]:
    print(f"  MISSING: {item}")

# Verify PNG headers and transparency.
def png_info(name):
    data = (root / name).read_bytes()[:26]
    if len(data) < 26 or data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    width, height = struct.unpack(">II", data[16:24])
    return width, height, data[25]

for name in ("lotus-approved.png", "lotus-favicon.png"):
    path = root / name
    if path.is_file():
        info = png_info(name)
        check(info is not None, f"Valid PNG header: {name}")
        if info:
            check(
                info[0] > 0 and info[1] > 0,
                f"PNG dimensions: {name}"
            )

if (root / "lotus-approved.png").is_file():
    info = png_info("lotus-approved.png")
    check(
        info is not None and info[2] in (4, 6),
        "Official logo PNG contains an alpha channel"
    )

# Protect against accidental publication of sensitive filenames.
forbidden = []
for p in root.rglob("*"):
    if not p.is_file() or ".git" in p.parts:
        continue
    if p.name == ".env" or p.name.startswith(".env."):
        forbidden.append(str(p.relative_to(root)))
    if p.name in ("id_rsa", "id_ed25519", ".npmrc"):
        forbidden.append(str(p.relative_to(root)))

check(not forbidden, "No prohibited credential filenames")
for item in forbidden:
    print(f"  FORBIDDEN: {item}")

print()
if errors:
    print(f"FAILED: {len(errors)} check(s)")
    sys.exit(1)

print("ALL STATIC SITE CHECKS PASSED")

# Additional route, metadata, payload and publication-boundary checks.
import runpy
runpy.run_path(str(root / "site-source/scripts/check-release-static.py"), run_name="__main__")
