from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import argparse,json,re,hashlib,sys
ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[2]);ap.add_argument('--expected-stories',type=int,choices=[19,29],default=29);a=ap.parse_args();root=a.root.resolve();source=root/'site-source';errors=[]
def check(ok,label):
 print(('[PASS] ' if ok else '[FAIL] ')+label)
 if not ok:errors.append(label)
metas=[json.loads(p.read_text()) for p in (source/'src/content/stories').glob('*/meta.json')];pub=[m for m in metas if m['status']=='published'];slugs={m['slug'] for m in pub}
check(len(pub)==len(slugs)==a.expected_stories,'Exact source publication count')
check(len({m['id'] for m in metas})==len(metas) and len({m['slug'] for m in metas})==len(metas),'Unique IDs and slugs')
for prefix in ['stories','en/stories']:check({p.parent.name for p in (root/prefix).glob('*/index.html')}==slugs,'Exact bilingual slug set: '+prefix)
expected={'404.html','404/index.html','_not-found/index.html'}
for f in (source/'src/app').rglob('page.tsx'):
 route='/'.join(x for x in f.relative_to(source/'src/app').parent.parts if not x.startswith('('))
 paths=[route.replace('[slug]',s) for s in slugs] if '[slug]' in route else [route.replace('[theme]',t) for t in ['peaceful-life','pure-land']] if '[theme]' in route else [route]
 expected.update((p+'/' if p else '')+'index.html' for p in paths)
actual={p.relative_to(root).as_posix() for p in root.rglob('*.html') if '.git' not in p.parts}
check(actual==expected,f'HTML route set derived from source: {len(expected)} expected / {len(actual)} actual')
missingflight=[]
for rel in expected-{'404.html','404/index.html','_not-found/index.html'}:
 for name in ['index.txt','__next._tree.txt','__next._full.txt']:
  f=(root/rel).parent/name
  if not f.is_file():missingflight.append(str(f.relative_to(root)))
check(not missingflight,'All route Flight payloads present')
class Refs(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.canonical=[];self.languages={};self.lang=None;self.in_footer=False;self.footer=[]
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='html':self.lang=attrs.get('lang')
  if tag=='footer':self.in_footer=True
  if tag=='link' and attrs.get('rel')=='canonical':self.canonical.append(attrs.get('href'))
  if tag=='link' and attrs.get('rel')=='alternate' and attrs.get('hreflang'):self.languages[attrs['hreflang']]=attrs.get('href')
  v=attrs.get('href') if tag in ['a','link'] else attrs.get('src') if tag in ['img','script'] else None
  if v:self.refs.append(v)
 def handle_endtag(self,tag):
  if tag=='footer':self.in_footer=False
 def handle_data(self,data):
  if self.in_footer:self.footer.append(data)
missing=[]
seo=[];footers=[];origin='https://lotus-sutra-stories.com'
for rel in actual:
 f=root/rel;parser=Refs();parser.feed(f.read_text())
 if rel not in {'404.html','404/index.html','_not-found/index.html'}:
  route=rel[:-len('index.html')];en=route.startswith('en/');base=route[3:] if en else route
  expected_languages={'zh-Hant':origin+'/'+base,'en':origin+'/en/'+base}
  if parser.canonical!=[origin+'/'+route] or parser.languages!=expected_languages or parser.lang!=('en' if en else 'zh-Hant'):seo.append(rel)
  note='This website is live on GitHub Pages. Please refer to the project owner’s announcements for custom-domain information.' if en else '本網站已於 GitHub Pages 上線。自訂網域資訊請以站方公告為準。'
  if note not in ''.join(parser.footer):footers.append(rel)
 for ref in parser.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc or not u.path:continue
  target=root/unquote(u.path).lstrip('/') if u.path.startswith('/') else f.parent/unquote(u.path)
  if target.is_dir():target=target/'index.html'
  if not target.is_file():missing.append((rel,ref))
check(not missing,'No missing assets or internal pages')
export_manifest=json.loads((root/'.github/static-export-manifest.json').read_text())
check(bool(export_manifest) and all(not Path(p).is_absolute() and '..' not in Path(p).parts and (root/p).is_file() and hashlib.sha256((root/p).read_bytes()).hexdigest()==sha for p,sha in export_manifest.items()),'Every exported file matches the committed SHA-256 manifest')
check({p.relative_to(root).as_posix() for p in (root/'_next').rglob('*') if p.is_file()}=={p for p in export_manifest if p.startswith('_next/')},'Exact Next.js asset set, including files not directly referenced by HTML')
check(not seo,'Self-canonical, reciprocal zh-Hant/en hreflang and HTML lang on all content routes')
check(not footers,'Corrected deployment footer on all content routes')
import xml.etree.ElementTree as ET
urls={x.text for x in ET.parse(root/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
expected_urls={origin+'/'+p[:-len('index.html')] for p in expected-{'404.html','404/index.html','_not-found/index.html'}}
check(urls==expected_urls,'Sitemap URLs exactly match all bilingual content routes')
check('Sitemap: '+origin+'/sitemap.xml' in (root/'robots.txt').read_text(),'robots.txt declares the approved sitemap')
check(all('CBETA' in (root/p).read_text() for p in ['licensing/index.html','en/licensing/index.html']),'Bilingual licensing pages retain CBETA attribution')
logo=root/'lotus-approved.png';check(logo.is_file() and hashlib.sha256(logo.read_bytes()).hexdigest()=='fc297d59b5d3eda675e2e5232fa46ad382866382fe6198e5b3f380b4884273b6','Official logo exact SHA-256')
bad=[]
for m in metas:
 for w in m['witnesses']:
  p=w['paragraphs'];u=urlsplit(w['url']);prefix='X78n'+w['work'][1:]+'_p'
  good=u.scheme=='https' and ((u.netloc=='cbetaonline.dila.edu.tw' and u.path.rstrip('/')==f"/zh/{w['work']}_{w['juan']:03d}") or (u.netloc=='deerpark.app' and u.path.rstrip('/')==f"/cbeta/{w['work']}/{w['juan']}"))
  good=good and bool(p) and w['anchorStart']==prefix+p[0]['anchor'] and w['anchorEnd']==prefix+p[-1]['anchor'] and all(re.fullmatch(r'\d{4}[a-c]\d{2}',q['anchor']) and q['text'].strip() for q in p)
  if not good:bad.append(m['id'])
check(not bad,'Source links agree with work, juan and witness bounds')
baseline=json.loads((source/'scripts/baseline-story-hashes.json').read_text())
check(len(baseline)==95 and all(hashlib.sha256((source/p).read_bytes()).hexdigest()==sha for p,sha in baseline.items()),'Original 19 stories: all 95 source files unchanged')
forbidden=[]
for f in root.rglob('*'):
 if '.git' in f.parts:continue
 if f.is_file() and (f.name=='.env' or f.name.startswith('.env.') or f.name in ['.npmrc','id_rsa','id_ed25519','PRIVATE-REVIEW-ONLY.json']):forbidden.append(str(f.relative_to(root)))
 if f.is_dir() and f.name in ['node_modules','.next','private-staging','research','source-evidence','reports','evidence','acceptance']:forbidden.append(str(f.relative_to(root)))
check(not forbidden,'No credentials, private research or caches')
if errors:print('FAILED:',errors);sys.exit(1)
print('ALL RELEASE STATIC CHECKS PASSED')
