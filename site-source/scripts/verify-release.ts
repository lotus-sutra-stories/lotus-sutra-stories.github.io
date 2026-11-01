import fs from "node:fs";
import { createHash } from "node:crypto";
import { getAllStoryMetas, getPublishedStoryMetas, buildSearchIndex, countWitnesses, getRotatingStory } from "../src/lib/content";
import { toCardData } from "../src/lib/cards";
import { filterStories, EMPTY_FILTERS } from "../src/lib/story-filters";
import hashes from "./baseline-story-hashes.json";
import { UI,fmt } from "../src/lib/i18n";
let n=0;function check(ok:boolean,label:string){if(!ok)throw new Error(label);n++;console.log(`[PASS] ${label}`);}
const all=getAllStoryMetas(),pub=getPublishedStoryMetas();
const baselineIds=Array.from({length:29},(_,i)=>`S${String(i+1).padStart(3,"0")}`);
check(pub.length>=29 && all.length>=pub.length && baselineIds.every(id=>pub.some(m=>m.id===id)) && countWitnesses()>=41,`${pub.length}篇／${countWitnesses()}見證（原29篇與41見證基準保留）`);
check(Object.entries(hashes).every(([p,h])=>createHash("sha256").update(fs.readFileSync(p)).digest("hex")===h),"原95檔逐位元不變");
check(new Set(Array.from({length:pub.length},(_,i)=>getRotatingStory(new Date(Date.UTC(2026,0,1+i)))?.id)).size===pub.length,`${pub.length}日輪替完整`);
for(const locale of ["zh","en"] as const){
 const docs=buildSearchIndex(locale),cards=pub.map(toCardData);const select=(f:Partial<typeof EMPTY_FILTERS>,bookmarks=new Set<string>())=>filterStories(cards,docs,locale,{...EMPTY_FILTERS,...f},bookmarks);
 check(docs.length===pub.length && new Set(docs.map(d=>d.slug)).size===pub.length,`${locale} 搜尋${pub.length}篇`);
 check(select({identity:"lay-man"}).length>=6,`${locale} 信男不少於原6篇`);
 check(select({identity:"lay-woman"}).length>=5,`${locale} 信女不少於原5篇`);
 check(["S028","S029"].every(id=>select({identity:"lay-woman",theme:"pure-land"}).some(m=>m.id===id)),`${locale} 信女AND淨土保留原案例`);
 check(select({query:"zzzz-nonexistent-story-123456"}).length===0,`${locale} 零結果`);
 const one=cards.find(m=>m.id==="S028")!;
 check(select({identity:"lay-woman",theme:"pure-land",query:one.person[locale],practice:"nianfo",period:one.periodLabel[locale],type:one.secondaryTypes[0],rebirth:"interpreted",bookmarksOnly:true},new Set([one.slug])).map(m=>m.id).join()==="S028",`${locale} 真實搜尋與全部篩選器及書籤交集`);
 check(select({}).length===pub.length,`${locale} 清除還原${pub.length}篇`);
 check(fmt(UI[locale].taxonomy.resultsCount,{count:pub.length}).includes(String(pub.length)),`${locale} 結果標籤含數字`);
}
console.log(`${n}/${n} checks passed`);
