"""Run ONLY in an ephemeral GitHub Actions checkout; never on the production checkout.
Fixture is created, tested and restored in the runner's private workspace.
"""
from pathlib import Path
import json, shutil, subprocess, sys, os, hashlib
import xml.etree.ElementTree as ET

root=Path.cwd()
stories=root/'site-source/src/content/stories'
source=root/'site-source'
fixture=stories/'scalability-fixture-s030'
if not (root/'.git').exists() or not (source/'bun.lock').exists() and not (source/'bun.lockb').exists():
    raise SystemExit('STOP: not a checkout or missing lockfile')
if fixture.exists(): raise SystemExit('STOP: fixture exists')
metas=[(p,json.loads(p.read_text(encoding='utf-8'))) for p in stories.glob('*/meta.json')]
s029=next((p.parent for p,m in metas if m['id']=='S029'), None)
s001=next((p for p,m in metas if m['id']=='S001'),None)
if s029 is None or s001 is None or len([1 for _,m in metas if m['status']=='published'])!=29: raise SystemExit('STOP: expected 29-story baseline')

def run(*args, good=True):
    print('RUN:', ' '.join(args), flush=True)
    p=subprocess.run(args,cwd=source,check=False)
    if (p.returncode==0)!=good: raise RuntimeError(f'Unexpected exit {p.returncode}: {args}; expected {"PASS" if good else "FAIL"}')
    print('PASS: expected', 'success' if good else 'rejection',flush=True)

saved_s001=s001.read_bytes()
try:
    shutil.copytree(s029, fixture)
    meta_path=fixture/'meta.json'
    meta=json.loads(meta_path.read_text(encoding='utf-8'))
    meta['id']='S030';meta['slug']=fixture.name
    meta_path.write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    good_meta=meta_path.read_bytes()
    run('bun','run','validate:content')
    run('bun','run','validate:safety')
    run('bun','run','build:static')
    out=source/'out'
    html=sum(1 for _ in out.rglob('*.html'))
    urls=[x.text for x in ET.parse(out/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    assert html==79,(html,'expected 79 HTML')
    assert len(urls)==len(set(urls))==76,(len(urls),'expected 76 sitemap URLs')
    assert (out/'stories'/fixture.name/'index.html').is_file()
    assert (out/'en/stories'/fixture.name/'index.html').is_file()
    print('PASS: 79 HTML, 76 unique sitemap URLs, 2 S030 story routes')
    english=fixture/'en.md'; saved_english=english.read_bytes()
    try:
        english.unlink()
        run('bun','run','validate:content',good=False)
    finally: english.write_bytes(saved_english)
    try:
        meta['id']='S029';meta_path.write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        run('bun','run','validate:content',good=False)
    finally:meta_path.write_bytes(good_meta)
    try:
        base=json.loads(saved_s001.decode('utf-8'));base['status']='draft'
        s001.write_text(json.dumps(base,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        run('bun','run','validate:content',good=False)
    finally:s001.write_bytes(saved_s001)
    run('bun','run','validate:content')
    print('ALL S030 CI SCENARIOS PASSED')
finally:
    if s001.exists():s001.write_bytes(saved_s001)
    if fixture.exists():shutil.rmtree(fixture)
