import {hash,seeded,shuffle} from './engine.mjs';
import {iosReleases} from './trivia.mjs';
// A pair is included once. No reversed duplicates or paraphrase copies.
export function buildTimeline(catalog){
 const records=[...catalog.filter(p=>['iphone','ipad'].includes(p.category)&&Number.isInteger(p.facts.year)).map(p=>({id:p.id,model:p.model,year:p.facts.year,category:p.category,source:p.source})),...iosReleases];
 const out=[];
 for(const r of iosReleases){const rng=seeded(r.id),answer=`${r.year} 年`;out.push({id:`year-${r.id}`,category:'ecosystem',difficulty:'easy',prompt:`时间拨回 ${r.model}：它首次公开亮相，是哪一年？`,answer,options:shuffle([answer,...shuffle([-2,-1,1,2].map(d=>`${r.year+d} 年`),rng).slice(0,3)],rng),explanation:`${r.model} 首次公开亮相于 ${r.year} 年。这里按首次公布／预览年份，不按某个小版本的更新日期。`,sources:[r.source],kind:'timeline',tag:'系统年份',families:[r.id]});}
 const pairs=[];
 for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
  const a=records[i],b=records[j];
  // Avoid screen-size twins and names which expose their release year.
  if(/\b20\d{2}\b/.test(a.model+b.model))continue;
  if(a.model.replace(/ Pro Max| Pro| Plus| mini/gi,'')===b.model.replace(/ Pro Max| Pro| Plus| mini/gi,''))continue;
  pairs.push([a,b]);
 }
 // Deterministic reservoir: 2,400 different release relationships, sampled across years and lines.
 const selected=shuffle(pairs,seeded('apple-time-travel-v2')).slice(0,2400);
 for(const [a,b] of selected){
  const gap=Math.abs(a.year-b.year),front=a.year<b.year,answer=gap===0?'同年亮相':`${front?'前者':'后者'}早 ${gap} 年`;
  const wrong=gap===0?['前者早 1 年','后者早 1 年','前者早 2 年']:[`${front?'后者':'前者'}早 ${gap} 年`,'同年亮相',`${front?'前者':'后者'}早 ${gap+1} 年`];
  const id=`timeline-${a.id}-${b.id}`,rng=seeded(hash(id));
  out.push({id,category:a.category===b.category?a.category:'history',difficulty:gap<=1?'medium':'easy',prompt:`${a.model} 和 ${b.model}，按首次公布年份，谁是前辈？`,answer,options:shuffle([answer,...wrong],rng),explanation:`前者 ${a.model}：${a.year} 年；后者 ${b.model}：${b.year} 年。${gap?`按公历年份相差 ${gap} 年。`:'它们在同一年亮相，具体月份可以不同。'}这里比较首次公布年份，系统按首次预览年份，不比较各地区开售日。`,sources:[...new Set([a.source,b.source])],kind:'timeline',tag:'年份对对碰',families:[a.id,b.id]});
 }
 return out;
}
