import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createThemeSwitcher} from '../assets/theme.mjs';

function fixture({theme='light', supported=true, reduce=false, width=390, height=844, snapshotWidth=width, snapshotHeight=height, bounds={left:320,top:18,width:44,height:44}, fail}={}) {
  const values=new Map(), classes=new Set(), applied=[], saved=[], committed=[];
  const root={dataset:{theme},style:{setProperty:(k,v)=>values.set(k,v),removeProperty:k=>values.delete(k)},classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)}};
  let finish, skipCount=0, captures=0;
  const finished=new Promise(resolve=>{finish=resolve;});
  const document={documentElement:root};
  if(supported)document.startViewTransition=update=>{
    captures++;
    if(fail==='start')throw Error('unavailable');
    update();
    return {ready:fail==='ready'?Promise.reject(Error('skipped')):Promise.resolve(),finished,skipTransition(){skipCount++;finish();}};
  };
  const window={innerWidth:width,innerHeight:height,getComputedStyle:(_,pseudo)=>pseudo?{width:`${snapshotWidth}px`,height:`${snapshotHeight}px`}:{getPropertyValue:()=>root.dataset.theme==='dark'?'#0b0e15':'#f7f8fb'}};
  const switchTheme=createThemeSwitcher({document,window,applyTheme:v=>{root.dataset.theme=v;applied.push(v);},saveTheme:v=>saved.push(v),commitTheme:v=>committed.push(v),reducedMotion:()=>reduce});
  return {switchTheme,button:{getBoundingClientRect:()=>bounds},root,values,classes,applied,saved,committed,finish,get skips(){return skipCount;},get captures(){return captures;}};
}

test('both appearance directions reveal from the button center and cover every viewport corner',async()=>{
  for(const theme of ['light','dark'])for(const geometry of [
    {width:390,height:844,bounds:{left:320,top:18,width:44,height:44}},
    {width:1440,height:900,bounds:{left:1236,top:26,width:44,height:44}},
    {width:844,height:390,bounds:{left:760,top:12,width:44,height:44}},
  ]) {
    const f=fixture({theme,...geometry});const pending=f.switchTheme(f.button);await Promise.resolve();
    const x=parseFloat(f.values.get('--theme-reveal-x')),y=parseFloat(f.values.get('--theme-reveal-y')),r=parseFloat(f.values.get('--theme-reveal-radius'));
    assert.equal(x,geometry.bounds.left+22);assert.equal(y,geometry.bounds.top+22);
    for(const [cx,cy] of [[0,0],[geometry.width,0],[0,geometry.height],[geometry.width,geometry.height]])assert.ok(r>Math.hypot(cx-x,cy-y));
    assert.equal(f.root.dataset.theme,theme==='dark'?'light':'dark');assert.equal(f.classes.has('theme-revealing'),true);
    f.finish();assert.equal(await pending,true);assert.equal(f.values.size,0);assert.equal(f.classes.size,0);assert.equal(f.saved.length,1);
  }
});
test('rapid clicks cannot overlap captures or overwrite the saved appearance',async()=>{
  const f=fixture(),pending=f.switchTheme(f.button);assert.equal(await f.switchTheme(f.button),false);
  assert.equal(f.captures,1);assert.deepEqual(f.saved,['dark']);f.finish();await pending;
  await f.switchTheme(f.button);assert.deepEqual(f.saved,['dark','light']);
});
test('mobile toolbar areas remain covered when the snapshot exceeds the visible viewport',async()=>{
  const f=fixture({width:390,height:680,snapshotWidth:390,snapshotHeight:844});
  const pending=f.switchTheme(f.button);await Promise.resolve();
  const x=parseFloat(f.values.get('--theme-reveal-x')),y=parseFloat(f.values.get('--theme-reveal-y')),r=parseFloat(f.values.get('--theme-reveal-radius'));
  for(const [cx,cy] of [[0,844],[390,844]])assert.ok(r>Math.hypot(cx-x,cy-y));
  f.finish();await pending;
});
test('old backing color survives the state change, and browser chrome commits after the reveal',async()=>{
  for(const theme of ['light','dark']) {
    const f=fixture({theme}),pending=f.switchTheme(f.button);await Promise.resolve();
    assert.equal(f.values.get('--theme-reveal-backdrop'),theme==='dark'?'#0b0e15':'#f7f8fb');
    assert.notEqual(f.root.dataset.theme,theme);assert.deepEqual(f.committed,[]);
    f.finish();await pending;assert.deepEqual(f.committed,[theme==='dark'?'light':'dark']);
    assert.equal(f.values.size,0);
  }
});
test('unsupported browsers and reduced motion still switch and save the appearance once',async()=>{
  for(const options of [{supported:false},{reduce:true}]) {
    const f=fixture(options);assert.equal(await f.switchTheme(f.button),true);
    assert.deepEqual(f.applied,['dark']);assert.deepEqual(f.saved,['dark']);assert.equal(f.captures,0);assert.equal(f.classes.size,0);
    assert.deepEqual(f.committed,['dark']);
  }
});
test('failed or skipped captures apply the appearance without leaving an overlay or lock',async()=>{
  for(const fail of ['start','ready']) {
    const f=fixture({fail});assert.equal(await f.switchTheme(f.button),true);
    assert.deepEqual(f.applied,['dark']);assert.deepEqual(f.saved,['dark']);assert.equal(f.values.size,0);assert.equal(f.classes.size,0);
    await f.switchTheme(f.button);assert.equal(f.root.dataset.theme,'light');
  }
});
