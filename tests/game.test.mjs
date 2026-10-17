import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildBank} from '../src/bank.mjs';
import {CATEGORIES,drawQuestions,updateRecent,createSession,hydrateSession,resultTitle,easterEggs} from '../src/engine.mjs';
import {iosReleases,iosFeatures} from '../src/trivia.mjs';
const catalog=JSON.parse(await readFile(new URL('../src/catalog.json',import.meta.url),'utf8'));
const bank=buildBank(catalog),cfg={mode:'quick',casual:true,count:5,difficulty:'mixed',categories:Object.keys(CATEGORIES)};
test('release has >4000 distinct questions and substantial authored trivia + timeline content',()=>{
 assert.ok(bank.length>4000);assert.ok(bank.filter(q=>q.kind==='trivia').length>=240);
 assert.equal(bank.filter(q=>q.id.startsWith('timeline-')).length,2400);
 assert.ok(iosFeatures.length>=80);assert.equal(iosReleases.length,19);
 assert.ok(catalog.filter(p=>p.category==='ipad').every(p=>Number.isInteger(p.facts.year)));
});
test('quick rounds favor stories and surprises, with one timeline and one wildcard',()=>{
 for(let seed=1;seed<100;seed++){
  const qs=drawQuestions(bank,cfg,seed);assert.equal(qs.length,5);
  assert.equal(qs.filter(q=>q.kind==='trivia').length,3);
  assert.equal(qs.filter(q=>q.kind==='timeline').length,1);
  assert.ok(qs.every(q=>!q.id.startsWith('spec-')&&!q.id.startsWith('ratio-')&&!q.id.startsWith('compare-')));
  assert.ok(qs.filter(q=>q.families?.includes('ios-features')).length<=1);
  const families=qs.flatMap(q=>q.families||[q.family||q.id]);assert.equal(new Set(families).size,families.length);
 }
});
test('back-to-back short games remain fresh and topic filters keep their promises',()=>{
 let seen=[];
 for(let i=0;i<50;i++){const qs=drawQuestions(bank,cfg,i,seen);assert.ok(qs.every(q=>!seen.includes(q.id)));seen=updateRecent(seen,qs.map(q=>q.id));}
 for(const topic of ['surprise','stories','timeline']){const qs=drawQuestions(bank,{...cfg,topic},23);assert.equal(qs.length,5);assert.ok(qs.every(q=>topic==='timeline'?q.kind==='timeline':q.topic===topic));}
});
test('recent history keeps the actual visit order, moves repeats to tail and trims oldest',()=>{
 assert.deepEqual(updateRecent(['a','b','c'],['b']),['a','c','b']);
 assert.deepEqual(updateRecent(['a','b','a'],['c']),['b','a','c']);
 assert.deepEqual(updateRecent(['a','b','c'],['b','d'],3),['c','b','d']);
 assert.deepEqual(updateRecent(['a'],['b'],0),[]);
 const pool=bank.slice(0,20),seen=pool.map(q=>q.id);
 const qs=drawQuestions(pool,{...cfg,mode:'exam',casual:false,count:5},7,seen);
 assert.deepEqual(new Set(qs.map(q=>q.id)),new Set(seen.slice(0,5)));
});
test('a quick game can resume with locked answers, options and index intact',()=>{
 const qs=drawQuestions(bank,cfg,7),s=createSession(qs,cfg,7,1000);s.answers[qs[0].id]=qs[0].answer;s.confirmed=[qs[0].id];s.index=1;
 const h=hydrateSession(s,bank);assert.equal(h.config.mode,'quick');assert.equal(h.index,1);assert.deepEqual(h.confirmed,s.confirmed);assert.deepEqual(h.hydratedQuestions[0].options,qs[0].options);assert.equal(h.deadline,null);
});
test('timeline answers are derived from their two source records without reversed pair duplicates',()=>{
 const pairs=new Set();
 for(const q of bank.filter(q=>q.id.startsWith('timeline-'))){const key=[...q.families].sort().join('|');assert.ok(!pairs.has(key));pairs.add(key);assert.ok(q.explanation.includes('前者'));assert.equal(q.options.filter(o=>o===q.answer).length,1);}
});
test('result names and surprises match score, streak and actual completed time',()=>{
 assert.equal(resultTitle({score:100}).title,'库克看了都点头');assert.equal(resultTitle({score:80}).title,'苹果店隐藏店员');assert.equal(resultTitle({score:0}).title,'完美避开正确答案');
 assert.equal(easterEggs({score:100,bestStreak:5,total:5,unanswered:0,duration:10}).length,3);
 assert.equal(easterEggs({score:0,bestStreak:0,total:5,unanswered:5,duration:0}).length,0);
});
