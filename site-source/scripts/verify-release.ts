import fs from "node:fs";
import { createHash } from "node:crypto";
import { getAllStoryMetas, getPublishedStoryMetas, buildSearchIndex, countWitnesses, getRotatingStory } from "../src/lib/content";
import { toCardData } from "../src/lib/cards";
import { filterStories, EMPTY_FILTERS } from "../src/lib/story-filters";
import hashes from "./baseline-story-hashes.json";
import { UI,fmt } from "../src/lib/i18n";
let n=0;function check(ok:boolean,label:string){if(!ok)throw new Error(label);n++;console.log(`[PASS] ${label}`);}
const all=getAllStoryMetas(),pub=getPublishedStoryMetas();
check(all.length===29&&pub.length===29&&countWitnesses()===41,"29篇／41見證");
check(Object.entries(hashes).every(([p,h])=>createHash("sha256").update(fs.readFileSync(p)).digest("hex")===h),"原95檔逐位元不變");
check(new Set(Array.from({length:29},(_,i)=>getRotatingStory(new Date(Date.UTC(2026,0,1+i)))?.id)).size===29,"29日輪替完整");
for(const locale of ["zh","en"] as const){
 const docs=buildSearchIndex(locale),cards=pub.map(toCardData);const select=(f:Partial<typeof EMPTY_FILTERS>,bookmarks=new Set<string>())=>filterStories(cards,docs,locale,{...EMPTY_FILTERS,...f},bookmarks);
 check(docs.length===29,`${locale} 搜尋29篇`);
 check(select({identity:"lay-man"}).length===6,`${locale} 信男6篇`);
 check(select({identity:"lay-woman"}).length===5,`${locale} 信女5篇`);
 check(select({identity:"lay-woman",theme:"pure-land"}).map(m=>m.id).join()==="S028,S029",`${locale} 信女AND淨土`);
 check(select({identity:"nun"}).length===0,`${locale} 零結果`);
 const one=cards.find(m=>m.id==="S028")!;
 check(select({identity:"lay-woman",theme:"pure-land",query:one.person[locale],practice:"nianfo",period:one.periodLabel[locale],type:one.secondaryTypes[0],rebirth:"interpreted",bookmarksOnly:true},new Set([one.slug])).map(m=>m.id).join()==="S028",`${locale} 真實搜尋與全部篩選器及書籤交集`);
 check(select({}).length===29,`${locale} 清除還原29篇`);
 check(fmt(UI[locale].taxonomy.resultsCount,{count:29}).includes("29"),`${locale} 結果標籤含數字`);
}
console.log(`${n}/${n} checks passed`);
